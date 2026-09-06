# Version 1 plan

A local marketplace where verified growers, bakers and meat producers list what they have, and neighbors reserve it before it is gone. Every seller chooses how their buyers get it, whether that is the Saturday market, their own shop, their front porch or their truck.

The app is the middle man for trust and discovery. It is not the middle man for the money, at least not yet.

## Why this shape

Every other version of this idea has to solve two problems at once, which is finding sellers and finding buyers. Launching against a market that already runs on Saturday solves the second one for free. The crowd is already walking in. Sellers with their own shop or their own regulars can serve them through the app on day one too, but the market is what gets strangers in the door.

Reserving ahead also gives vendors the thing they genuinely want, which is knowing what to bake and how much to pick before Friday night.

And every fulfillment option keeps the food moving from the seller's hands to the buyer's hands, which is what Texas cottage food rules require. No couriers, no shipping, no third party in the middle of the handoff.

## Seller verification tiers

This is the core of the product and the reason it beats a local Facebook group. A seller uploads what they have, and the app unlocks only the categories they have proven. Everything else stays locked with a plain explanation of what is missing.

| Tier | What they can list | What they upload | Status |
| --- | --- | --- | --- |
| Unverified | Nothing. Profile visible but empty. | Nothing yet. | Listings locked |
| Grower | Raw uncut fruit and vegetables, herbs, cut flowers, comb honey. | Farm name, growing location, signed attestation that produce is uncut and unprocessed. | Produce unlocked |
| Cottage food | Breads, cookies, cakes, pies, jams, candy, granola, dry mixes, roasted coffee. | Food handler certificate with expiry, labeling attestation, confirmation of staying under the annual gross cap. | Baked and shelf stable unlocked |
| Eggs and dairy | Shell eggs, pasteurized dairy only. | Whatever the state currently requires at her volume, confirmed at build time. Raw milk never qualifies. | Confirm rules first |
| Meat and poultry | Beef, pork, lamb, poultry, seafood. | Establishment number or grant of inspection from the state or USDA inspected processor. | Meat unlocked |
| Never allowed | Raw milk, home canned low acid goods, homemade frozen treats, cannabis products. | No document unlocks these. | Blocked at the schema |

Expiry matters. A lapsed food handler certificate should quietly move that seller back to unverified and hide their listings until they re upload, the same way an expired insurance certificate works on RentEvent.

## The label the app writes for them

Cottage food labels have required elements, and getting them wrong is the most common way a small seller gets in trouble. Generate the label from the listing fields and let them print it.

```
SOURDOUGH BOULE
Hannah's Kitchen  ·  CFPO reg. 00000
Contains: WHEAT
Made 2026-09-12

THIS PRODUCT WAS PRODUCED IN A PRIVATE
RESIDENCE THAT IS NOT SUBJECT TO
GOVERNMENTAL LICENSING OR INSPECTION.
```

Confirm the exact wording and the minimum type size against current state guidance before shipping the generator, and store the required statement as configuration rather than hard coded text.

## How the food gets there

The seller chooses which methods they offer, set once on their profile and overridable per listing. The buyer sees them as filters, since "what can I get delivered this week" and "what is at the market Saturday" are two different shopping trips.

| Method | Who travels | Seller configures | Watch for |
| --- | --- | --- | --- |
| Market pickup | Buyer, to the market | Which market, days, booth, order cutoff | Nothing much. The cleanest option, and the default |
| Store pickup | Buyer, to the shop | Address, hours, lead time | A storefront means a permitted establishment, not a cottage operator. Capture the permit number |
| Porch pickup | Buyer, to the seller's home | Pickup window, access notes, whether the address shows before or after reservation | Privacy. Hide the address until confirmed, and let them turn it off |
| Drop off | Seller, to the buyer | Radius or zips, days, window, fee, and who does the driving | Who the driver works for. Own staff for permitted businesses, herself for cottage food, never a gig courier |

### Rules the app enforces

- **Delivery is the seller's operation, gated by seller type.** A permitted business with its own drivers runs delivery like any restaurant, on their staff, their vehicles, their insurance. A cottage food operator has no such staff, so her only legal option is going herself. One field, which is who performs delivery, with choices derived from verified type.
- **No gig couriers and no shipping, for anyone, in v1.** Handing food to a third party breaks the cottage food rules outright, and building the exception means building the enforcement.
- **Attended handoff for anything temperature controlled.** Unattended drops of perishables are a safety problem and a dispute nobody can referee.
- **Label details on the listing before checkout**, since online cottage food sales require it.
- **One dispute path per method.** A no show at a booth, a missed porch window and a failed drop off are three different failures.

Delivery liability follows the same logic. Terms say plainly that delivery is between seller and buyer, and that sellers who deliver carry their own coverage. This is not a delivery company and should never look like one.

**Recommendation:** build the data model for all four now, but turn on market pickup and porch pickup for the pilot. Add drop off once vendors ask, because it is where the timing complaints come from.

## What carries over from RentEvent

**Reuse:** seller accounts and profiles, photo upload, listing create and browse, location search, buyer to seller messaging, reviews and ratings, document upload and approval queue, admin dashboard.

**New:** category gating by verification tier, per seller fulfillment options, quantity on hand, reserve and hold with no payment, pack list grouped by fulfillment method, cottage food label generator.

## Core flow

1. Seller signs up and verifies. Sees which categories are open and why the others are not.
2. Seller sets how they hand off. Methods, market days, porch window, radius, fees.
3. Seller posts what they have. Quantity, price, which methods apply.
4. Buyer reserves. Filters by category, vendor or fulfillment. No card. Gets a code plus the booth, address or window.
5. Seller preps to the list. One pack list, grouped by method.
6. Handoff. Buyer shows the code, pays the vendor directly, vendor taps collected.
7. No shows get counted. Reserving and ghosting is what makes vendors quit.

## Launch sequence

Supply first, always. A marketplace with buyers and no sellers dies in a week. A marketplace with sellers and no buyers merely looks quiet.

1. **Pick one market and talk to its manager.** Their blessing beats any advertising, and they can introduce you to every vendor in one conversation.
2. **Recruit and verify 15 to 20 vendors.** By hand. Sit with them, upload their documents, write their first three listings with them.
3. **Run one market invite only.** Vendors invite their own regulars.
4. **Open to the town.** Only once reserving reliably produces a good Saturday.
5. **Add the second market** when vendors ask. Not before.

## Money

No commission, since buyers pay vendors directly, and small food sellers resent commission anyway.

- Free for buyers, permanently. Any buyer fee kills the reserve rate.
- Free for vendors through the pilot.
- Then a flat monthly vendor fee, priced against what a booth costs them, not what software costs.
- Featured placement later, which does not touch anyone's food margins.

## Before launch

Everything here reflects the rules as they read in September 2026, and food rules change. Re verify the cottage food category list, the annual gross cap, the label wording and the delivery requirements with the state health department at build time, and again before each expansion.

The statute contemplates delivery to the buyer or a location the buyer designates, while current guidance describes the operator or their household making that delivery in person. Whether an unattended porch drop satisfies that is not clearly settled. Treat attended handoff as the default and get an answer in writing.

Have a Texas attorney write the terms of service and seller agreement before a single real transaction. This is a platform, not a food handler, and that distinction only protects you if the documents say so. None of this is legal advice.

Also open:

- Decide the area and the specific market. Everything above is written for one town.
- Confirm current egg and dairy requirements.
- General liability coverage for the platform, and whether vendors must carry their own.
- No show and cancellation policy, written before the first Saturday.

## Sources

- [Texas Cottage Food Production, Texas DSHS](https://www.dshs.texas.gov/retail-food-establishments/permits-retail-food-establishments/texas-cottage-food-production)
- [Grants of Inspection and Exemptions FAQ, Texas DSHS](https://www.dshs.texas.gov/meat-safety/inspections-exemptions-meat-safety/frequently-asked-questions-about)
