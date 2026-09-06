# Market Day

A local marketplace where verified growers, bakers and producers list what they have, neighbors reserve it before it is gone, and each seller chooses how the food gets handed over.

`market-day` is a working name. Easy to change later.

## Status

Buyer and seller flows are built. Static HTML with Firebase Auth, Firestore and
Storage, no build step, the same shape as RentEvent.

Firebase project `market-day-261be` is live, with Email/Password auth and
Firestore already switched on. The config is in `firebase.js`.

Live at **richellestoweres-maker.github.io/market-day**

**Still outstanding:** payments. Sellers set their own prices and keep 100% of
them. The buyer pays one service fee, 10% plus 30 cents, shown as a single line
at checkout, and Stripe's cut comes out of Market Day's share rather than the
farm's. The code is written and needs four setup steps, all in
[docs/STRIPE-SETUP.md](docs/STRIPE-SETUP.md). Cloud Storage rides along on the
same Blaze upgrade, so seller photos start working at the same time.

## What version 1 is

Buyers browse verified local sellers, reserve items, and collect them. The platform verifies who is allowed to sell what, and surfaces what is available. It does not process payments and does not touch the food.

**Locked decisions**

| Decision | Choice |
| --- | --- |
| Codebase | Fork patterns and components from RentEvent |
| Launch anchor | One existing Saturday farmers market, one town |
| Fulfillment | Seller chooses: market pickup, store pickup, porch pickup, drop off |
| Payments | Stripe Connect. Sellers keep 100% of their listed price |
| Revenue | Buyer service fee, 10% plus 30 cents, one line at checkout |

## Documents

| File | What it covers |
| --- | --- |
| [docs/PLAN.md](docs/PLAN.md) | Full version 1 plan, verification tiers, launch sequence |
| [docs/DATA-MODEL.md](docs/DATA-MODEL.md) | Entities, fields and the invariants the app must enforce |
| [docs/BACKLOG.md](docs/BACKLOG.md) | Starter issues, ready to open as GitHub issues |
| [docs/STRIPE-SETUP.md](docs/STRIPE-SETUP.md) | Turning payments on, step by step |
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
