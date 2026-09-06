# Starter backlog

Ordered roughly by build sequence. Each one is small enough to be a single GitHub issue.

## Milestone 1, seller can exist and be trusted

1. Seller signup and profile, forked from RentEvent's vendor profile
2. Seller type selection, with the four types and multi select
2b. Farm cover photo upload during onboarding, required before publishing
3. Document upload with type, issue date and expiry date
4. Admin review queue, approve or reject with a note
5. Category unlock engine, derive unlocked categories from approved verifications
6. Expiry job, revoke unlocks and hide listings when a document lapses
7. Seller facing verification status page, showing what is unlocked and what is missing and why

## Milestone 2, seller can sell

8. Category enum, with blocked categories absent by design
9. Listing create and edit, with quantity, unit and a required photo upload
10. Category gate validation at the model layer
11. Cottage food label fields on the listing, required before publish
12. Label generator, printable, with the required statement pulled from config
13. Listing expiry, market listings roll off after their market day

## Milestone 3, buyer can get it

14. Markets table and admin, seed with the pilot market
15. Fulfillment options per seller, all four methods
16. Per listing fulfillment overrides
17. Porch address privacy, hidden until reservation confirmed
18. Perishable rule, block unattended handoff on temperature controlled items
19. Buyer browse and search, filter by category and by fulfillment method
20. Reserve flow, no payment, generates a code
21. Reservation snapshot of fulfillment details, plus title, price and photo
22. Seller pack list, grouped by fulfillment method
23. Mark collected, and mark no show
24. Buyer completion rate, visible to sellers

## Milestone 4, pilot ready

25. Reviews, gated to collected reservations
26. Notification emails, reservation placed, reminder, cancelled
27. Terms of service and seller agreement pages, once the attorney returns them
28. Seller onboarding checklist, since the first fifteen get onboarded by hand
29. Admin dashboard, sellers pending review, expiring documents, this week's reservations

## Not now

In app payments, third party couriers, shipping, route optimization, CSA subscriptions, second market, native apps, vendor analytics, social feed.
