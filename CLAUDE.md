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

## Legal posture

This platform lists and connects. It does not handle food, does not process payments in v1, and is not a delivery company. Product copy and terms should both reflect that. Do not add features that blur it without flagging the change.
