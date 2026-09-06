// catalog.js
// Single source of truth for the compliance rules. Everything that gates what a
// seller may list reads from here, so a rule change is one edit in one file.
// The matching server side enforcement lives in firestore.rules.

export const SELLER_TYPES = {
  grower:                 { label: "Grower",              blurb: "Raw, uncut fruit, vegetables, herbs and cut flowers." },
  cottage_food:           { label: "Home kitchen",        blurb: "Baked goods, jams, candy and other shelf stable foods made at home." },
  permitted_establishment:{ label: "Licensed business",   blurb: "You hold a retail food establishment permit for a shop or kitchen." },
  meat_producer:          { label: "Meat and poultry",    blurb: "Processed at a state or USDA inspected facility." }
};

export const DOC_TYPES = {
  grower_attestation:      { label: "Grower attestation",        expires: false, unlocks: ["produce", "flowers", "honey_comb"] },
  food_handler_certificate:{ label: "Food handler certificate",  expires: true,  unlocks: [] },
  cottage_food_attestation:{ label: "Home kitchen attestation",  expires: false, unlocks: [] },
  establishment_permit:    { label: "Food establishment permit", expires: true,  unlocks: ["baked", "preserves", "confections", "dry_goods", "coffee", "prepared"] },
  inspection_grant:        { label: "Processor inspection number",expires: false, unlocks: ["meat", "poultry", "seafood"] }
};

// Some categories need more than one document. Listed here rather than on the
// document, because "unlocked" is a property of the combination.
export const COMBO_UNLOCKS = [
  {
    requires: ["food_handler_certificate", "cottage_food_attestation"],
    unlocks: ["baked", "preserves", "confections", "dry_goods", "coffee"]
  }
];

export const CATEGORIES = {
  produce:     { label: "Produce",            perishable: true,  cottage: false },
  flowers:     { label: "Cut flowers",        perishable: false, cottage: false },
  honey_comb:  { label: "Honey",              perishable: false, cottage: false },
  baked:       { label: "Baked goods",        perishable: false, cottage: true  },
  preserves:   { label: "Jams and preserves", perishable: false, cottage: true  },
  confections: { label: "Candy",              perishable: false, cottage: true  },
  dry_goods:   { label: "Granola and mixes",  perishable: false, cottage: true  },
  coffee:      { label: "Roasted coffee",     perishable: false, cottage: true  },
  prepared:    { label: "Prepared foods",     perishable: true,  cottage: false },
  meat:        { label: "Meat",               perishable: true,  cottage: false },
  poultry:     { label: "Poultry",            perishable: true,  cottage: false },
  seafood:     { label: "Seafood",            perishable: true,  cottage: false }
};

// Deliberately absent from CATEGORIES, kept here only so the UI can explain why
// someone cannot find them. These are never selectable anywhere in the app.
export const BLOCKED_CATEGORIES = {
  raw_milk:      "Raw milk can only be sold under a state permit, at the farm. It cannot be listed here.",
  home_canned:   "Home canned low acid foods, such as green beans or soups, are outside the home kitchen exemption.",
  frozen_treats: "Homemade ice cream and frozen treats are outside the home kitchen exemption.",
  cannabis:      "Cannabis derived products cannot be listed here."
};

export const FULFILLMENT = {
  market_pickup: { label: "Market pickup", who: "Buyer comes to your booth",     attended: true  },
  store_pickup:  { label: "Store pickup",  who: "Buyer comes to your shop",      attended: true  },
  porch_pickup:  { label: "Porch pickup",  who: "Buyer comes to you",            attended: null  },
  drop_off:      { label: "I deliver",     who: "You take it to the buyer",      attended: null  }
};

export const DRIVER_TYPES = {
  self_or_household: { label: "Me or someone in my household", requiresType: null },
  own_staff:         { label: "My employees",                  requiresType: "permitted_establishment" }
};

export const REQUIRED_LABEL_STATEMENT =
  "THIS PRODUCT WAS PRODUCED IN A PRIVATE RESIDENCE THAT IS NOT SUBJECT TO GOVERNMENTAL LICENSING OR INSPECTION.";

export const COMMON_ALLERGENS = ["Wheat", "Milk", "Eggs", "Soy", "Peanuts", "Tree nuts", "Fish", "Shellfish", "Sesame"];

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

function isLive(doc, now) {
  if (doc.status !== "approved") return false;
  if (!doc.expiresOn) return true;
  return new Date(doc.expiresOn) > now;
}

/** Categories a seller has actually earned, from their approved live documents. */
export function unlockedCategories(docs, now = new Date()) {
  const live = (docs || []).filter(d => isLive(d, now));
  const held = new Set(live.map(d => d.docType));
  const unlocked = new Set();

  live.forEach(d => (DOC_TYPES[d.docType]?.unlocks || []).forEach(c => unlocked.add(c)));
  COMBO_UNLOCKS.forEach(rule => {
    if (rule.requires.every(r => held.has(r))) rule.unlocks.forEach(c => unlocked.add(c));
  });

  return [...unlocked];
}

/** What is still missing, so the seller sees why a category is closed. */
export function missingFor(category, docs, now = new Date()) {
  const held = new Set((docs || []).filter(d => isLive(d, now)).map(d => d.docType));
  const paths = [];

  Object.entries(DOC_TYPES).forEach(([type, def]) => {
    if (def.unlocks.includes(category) && !held.has(type)) paths.push([type]);
  });
  COMBO_UNLOCKS.forEach(rule => {
    if (!rule.unlocks.includes(category)) return;
    const gap = rule.requires.filter(r => !held.has(r));
    if (gap.length) paths.push(gap);
  });

  if (!paths.length) return null;
  return paths.sort((a, b) => a.length - b.length)[0].map(t => DOC_TYPES[t].label);
}

/** Documents expiring soon, so nobody is surprised by their listings vanishing. */
export function expiringSoon(docs, days = 30, now = new Date()) {
  const edge = new Date(now.getTime() + days * 86400000);
  return (docs || []).filter(d =>
    d.status === "approved" && d.expiresOn &&
    new Date(d.expiresOn) > now && new Date(d.expiresOn) <= edge
  );
}

/** Which delivery arrangements this seller may legally offer. */
export function allowedDriverTypes(sellerTypes = []) {
  return Object.entries(DRIVER_TYPES)
    .filter(([, def]) => !def.requiresType || sellerTypes.includes(def.requiresType))
    .map(([key]) => key);
}

/** Perishables are handed over in person. No exceptions, no buyer opt out. */
export function requiresAttendedHandoff(category) {
  return !!CATEGORIES[category]?.perishable;
}

/** A home kitchen listing is not publishable without a complete label. */
export function labelIsComplete(listing) {
  if (!CATEGORIES[listing.category]?.cottage) return true;
  const l = listing.label || {};
  return !!(l.productName && l.businessName && l.registrationNumber && Array.isArray(l.allergens));
}

/** The single gate every listing write passes through, client and server. */
export function canPublish(listing, docs, sellerTypes, now = new Date()) {
  const problems = [];
  if (!CATEGORIES[listing.category]) problems.push("That category is not available on Market Day.");
  else if (!unlockedCategories(docs, now).includes(listing.category))
    problems.push(`Your documents do not cover ${CATEGORIES[listing.category].label} yet.`);

  if (!labelIsComplete(listing)) problems.push("This listing needs its label filled in before it can go live.");

  if (requiresAttendedHandoff(listing.category) && listing.allowUnattended)
    problems.push("Anything that needs to stay cold has to be handed over in person.");

  const drivers = allowedDriverTypes(sellerTypes);
  if (listing.driverType && !drivers.includes(listing.driverType))
    problems.push("Only a licensed business can send employees to deliver.");

  return { ok: problems.length === 0, problems };
}
