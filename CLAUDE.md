# Working in this repo

Market Day is a local farmers market marketplace. Read `docs/PLAN.md` before proposing features and `docs/DATA-MODEL.md` before touching schema.

## Hard rules, enforce in code not just in copy

These come from Texas cottage food and meat inspection law. Breaking one puts a seller at legal risk, so they are validated at the model layer, not the form layer.

1. **Category gating.** A listing's category must be in the set unlocked by the seller's approved verifications. Reject at the model, not just in the UI.
2. **Verification expiry.** When a verification lapses, the categories it unlocked revoke automatically and the affected listings hide. Nothing stays live on an expired document.
3. **No third party delivery.** Drop off is performed by the seller, their household, or the employees of a permitted establishment. No gig couriers, no shipping, no mail, for any seller type, in v1.
4. **Attended handoff for perishables.** Any listing flagged temperature controlled cannot use an unattended handoff option.
5. **Label before checkout.** A cottage food listing cannot publish without its label fields populated, and those fields render on the listing page above the reserve action.
6. **Blocked categories.** Raw milk, home canned low acid goods, homemade ice cream and frozen treats, and cannabis derived products are not selectable. They are absent from the schema, not hidden in the UI.

## Not in version 1

In app payments, third party couriers, shipping, route optimization, CSA subscriptions, multiple markets, native mobile apps, vendor analytics, social feed.

If a request implies one of these, say so before building it.

## Writing style for anything user facing

No em dashes, and no dashes used as punctuation or separators. Use commas, periods, or "such as".

Copy is written from the seller's or buyer's side of the screen. A seller sees "I deliver these myself", not "fulfillment_method: self_delivery".

## Photography

Two kinds of images, two different rules. Do not blur them.

**Platform imagery is ours.** Only two surfaces: the category circles and the
hero. Stock or licensed photography is right here, because these are navigation
and consistency is the point. Someone tapping the Bakery circle is choosing a
category, not buying that loaf.

**Everything downstream of a seller is the seller's own photo.** No stock, no
borrowed shots, no close enough.

| Surface | Whose photo | Source |
| --- | --- | --- |
| Category circles | Ours | Platform library |
| Hero | Ours | Platform library |
| Featured Near You | Seller's | The listing photo |
| Local Farms Near You | Seller's | The farm cover photo they upload |
| Farm profile | Seller's | Cover plus their listing photos |
| Market Basket | Seller's | The listing photo, as it was when the buyer added it |
| Reservation and pack list | Seller's | Same snapshot as the basket |

Three things follow from this and all three are requirements, not nice to haves:

1. **A seller cannot publish without a farm cover photo.** It is collected during
   onboarding, not bolted on later, because the farm rows are unusable without it.
2. **A listing cannot publish without its own photo.** The upload cannot be chosen
   from a platform library, and this is stated in the seller agreement.
3. **The basket stores the photo, not a pointer to it.** Copy the listing's photo
   URL into the basket item and again into the reservation. If a seller swaps the
   photo on Friday, the buyer still sees what they actually reserved on Tuesday,
   and so does the pack list at the booth.

A buyer who reserves against one picture and collects something else has been
misled. That is the one thing a marketplace built on trust cannot survive.

## Legal posture

This platform lists and connects. It does not handle food, does not process payments in v1, and is not a delivery company. Product copy and terms should both reflect that. Do not add features that blur it without flagging the change.
