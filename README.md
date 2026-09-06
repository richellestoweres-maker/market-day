# Market Day

A local marketplace where verified growers, bakers and producers list what they have, neighbors reserve it before it is gone, and each seller chooses how the food gets handed over.

`market-day` is a working name. Easy to change later.

## Status

Buyer and seller flows are built. Static HTML with Firebase Auth, Firestore and
Storage, no build step, the same shape as RentEvent.

Firebase project `market-day-261be` is live, with Email/Password auth and
Firestore already switched on. The config is in `firebase.js`.

**Two things still outstanding:**

1. **Publish `firestore.rules`.** Firestore console, Rules tab, paste the file,
   Publish. Until then the database is closed to everyone, which is safe but
   means nothing works.
2. **Cloud Storage needs the Blaze plan.** It is the only paid piece, it stores
   seller documents and photos, and until it is on, uploads fail with a clear
   message while the rest of the site works.

## What version 1 is

Buyers browse verified local sellers, reserve items, and collect them. The platform verifies who is allowed to sell what, and surfaces what is available. It does not process payments and does not touch the food.

**Locked decisions**

| Decision | Choice |
| --- | --- |
| Codebase | Fork patterns and components from RentEvent |
| Launch anchor | One existing Saturday farmers market, one town |
| Fulfillment | Seller chooses: market pickup, store pickup, porch pickup, drop off |
| Payments | Buyer pays the seller directly. No payment processing in v1 |
| Revenue | Free during pilot, then a flat monthly vendor fee |

## Documents

| File | What it covers |
| --- | --- |
| [docs/PLAN.md](docs/PLAN.md) | Full version 1 plan, verification tiers, launch sequence |
| [docs/DATA-MODEL.md](docs/DATA-MODEL.md) | Entities, fields and the invariants the app must enforce |
| [docs/BACKLOG.md](docs/BACKLOG.md) | Starter issues, ready to open as GitHub issues |
| [CLAUDE.md](CLAUDE.md) | Project rules for Claude sessions working in this repo |

## The non negotiable rules

These are compliance rules, not preferences. They are restated in `CLAUDE.md` so they survive into every future session.

1. A seller can only list in categories their verified documents unlock.
2. Cottage food sellers deliver personally or not at all. No gig couriers, no shipping, for anyone, in v1.
3. Temperature controlled items require an attended handoff.
4. Cottage food label information appears on the listing page before checkout.
5. Raw milk, home canned low acid goods, homemade frozen treats and cannabis products do not exist as categories.

## Open before build

- Which town, and which Saturday market.
- Current egg and dairy requirements, the one unresolved verification tier.
- Terms of service and seller agreement, written by a Texas attorney.
