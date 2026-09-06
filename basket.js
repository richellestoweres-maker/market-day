// basket.js
// The buyer's basket. Held in this browser until they reserve, at which point it
// becomes reservation documents in Firestore.
//
// Two rules from CLAUDE.md live here and matter more than they look:
//
//  1. Every line stores a COPY of the title, price and photo as they were when
//     the buyer added it. If a seller swaps their sourdough photo on Friday, the
//     buyer still sees what they picked on Tuesday, and so does the pack list.
//  2. Lines group by where they are collected, not by farm. A flat list across
//     four farms quietly sends someone on four separate trips.

const KEY = "marketday.basket.v1";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];   // private window, cleared storage, blocked cookies
  }
}

function write(lines) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* nothing we can do, the basket just will not persist */
  }
  document.dispatchEvent(new CustomEvent("basket:changed", { detail: lines }));
  return lines;
}

export function getBasket() { return read(); }

export function count() {
  return read().reduce((n, l) => n + l.quantity, 0);
}

export function total() {
  return read().reduce((s, l) => s + l.price * l.quantity, 0);
}

/** Add a listing. Snapshot it, do not reference it. */
export function add(listing, seller, quantity = 1) {
  const lines = read();
  const existing = lines.find(l => l.listingId === listing.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    lines.push({
      listingId: listing.id,
      sellerId: listing.sellerId,
      quantity,
      // the snapshot
      title: listing.title,
      price: listing.price,
      unit: listing.unit,
      photoUrl: listing.photoUrl,
      sellerName: seller?.displayName || "",
      pickup: pickupLabel(listing, seller),
      pickupKey: pickupKey(listing, seller),
      addedAt: Date.now()
    });
  }
  return write(lines);
}

export function setQuantity(listingId, quantity) {
  let lines = read();
  if (quantity <= 0) lines = lines.filter(l => l.listingId !== listingId);
  else {
    const line = lines.find(l => l.listingId === listingId);
    if (line) line.quantity = quantity;
  }
  return write(lines);
}

export function remove(listingId) { return setQuantity(listingId, 0); }
export function clear() { return write([]); }

/** One group per collection point, so the buyer sees trips and not a jumble. */
export function groups() {
  const map = new Map();
  read().forEach(line => {
    if (!map.has(line.pickupKey)) {
      map.set(line.pickupKey, { key: line.pickupKey, label: line.pickup, lines: [] });
    }
    map.get(line.pickupKey).lines.push(line);
  });
  return [...map.values()].map(g => ({
    ...g,
    subtotal: g.lines.reduce((s, l) => s + l.price * l.quantity, 0)
  }));
}

function firstMethod(listing, seller) {
  const allowed = listing.allowedFulfillment?.length
    ? listing.allowedFulfillment
    : Object.keys(seller?.fulfillment || {}).filter(m => seller.fulfillment[m]?.enabled);
  return allowed[0] || "market_pickup";
}

function pickupKey(listing, seller) {
  const method = firstMethod(listing, seller);
  const cfg = seller?.fulfillment?.[method]?.config || {};
  // market pickup groups by market, everything else groups by the seller
  return method === "market_pickup"
    ? `market:${cfg.marketId || "unknown"}`
    : `${method}:${listing.sellerId}`;
}

function pickupLabel(listing, seller) {
  const method = firstMethod(listing, seller);
  const cfg = seller?.fulfillment?.[method]?.config || {};
  switch (method) {
    case "market_pickup": return cfg.marketName ? `${cfg.marketName}` : "Saturday market";
    case "store_pickup":  return `${seller?.displayName || "The shop"}, in store`;
    case "porch_pickup":  return `${seller?.displayName || "The farm"}, pickup at the farm`;
    case "drop_off":      return `${seller?.displayName || "The farm"} delivers`;
    default:              return "Pickup";
  }
}

/** Keep the little number on the basket icon honest on every page. */
export function paintBadge() {
  const n = count();
  document.querySelectorAll("[data-basket-count]").forEach(el => {
    el.textContent = n;
    el.hidden = n === 0;
  });
}

document.addEventListener("basket:changed", paintBadge);
