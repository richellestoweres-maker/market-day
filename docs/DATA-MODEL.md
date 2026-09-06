# Data model

A first sketch. Field names are suggestions, the relationships and the invariants are the part that matters.

## Entities

### users
Standard account. A user can be a buyer, a seller, or both.

`id`, `email`, `name`, `phone`, `role`, `created_at`

### sellers
The public storefront. One per selling user.

`id`, `user_id`, `display_name`, `slug`, `bio`, `cover_photo_url`, `seller_type`, `status`, `created_at`

`cover_photo_url` is the seller's own photo of their farm, stall or kitchen. Required before they can publish anything, because the farm rows are unusable without it. Never a stock image.

`seller_type` is the gate for almost everything downstream:

| Value | Meaning |
| --- | --- |
| `grower` | Sells raw uncut produce |
| `cottage_food` | Home producer under the cottage food exemption |
| `permitted_establishment` | Holds a retail food establishment permit |
| `meat_producer` | Sells meat processed at an inspected facility |

A seller may hold more than one type. Model it as a set, not a single column.

### verifications
Every document a seller uploads, with its own review state and expiry.

`id`, `seller_id`, `doc_type`, `file_url`, `issued_on`, `expires_on`, `status`, `reviewed_by`, `reviewed_at`, `notes`

`doc_type`: `food_handler_certificate`, `cottage_food_attestation`, `grower_attestation`, `establishment_permit`, `inspection_grant`

`status`: `pending`, `approved`, `rejected`, `expired`

### unlocked_categories
Derived from approved, unexpired verifications. Store it rather than computing on every read, and recompute on any verification change.

`seller_id`, `category`, `granted_by_verification_id`, `active`

### markets
`id`, `name`, `address`, `lat`, `lng`, `day_of_week`, `opens_at`, `closes_at`, `season_start`, `season_end`

### fulfillment_options
One row per method a seller offers. This is their delivery configuration.

`id`, `seller_id`, `method`, `enabled`, `config`

| `method` | `config` holds |
| --- | --- |
| `market_pickup` | `market_id`, `booth`, `days[]`, `order_cutoff` |
| `store_pickup` | `address`, `hours`, `lead_time_hours` |
| `porch_pickup` | `address`, `window_start`, `window_end`, `address_visible_before_reservation`, `access_notes` |
| `drop_off` | `zip_codes[]` or `radius_miles`, `days[]`, `window`, `fee`, `free_over`, `performed_by` |

`performed_by` is `self_or_household` or `own_staff`. `own_staff` is only selectable when the seller holds `permitted_establishment`.

### listings
`id`, `seller_id`, `title`, `description`, `category`, `price`, `unit`, `photo_url`, `quantity_available`, `temperature_controlled`, `label`, `available_from`, `available_to`, `allowed_fulfillment[]`, `status`

`photo_url` is the seller's photo of this actual item. Required to publish, and it cannot come from a platform library.

`label` is a structured object for cottage food items: `product_name`, `business_name`, `registration_number`, `allergens[]`, `production_date`, `handling_instructions`. The required residence statement is stored as configuration, not hard coded, so a rule change is a one line edit.

### reservations
`id`, `listing_id`, `buyer_id`, `quantity`, `fulfillment_method`, `fulfillment_snapshot`, `item_snapshot`, `code`, `status`, `reserved_at`, `collected_at`

`item_snapshot` freezes the title, price and photo as they were when the buyer reserved. If the seller swaps the photo on Friday, the buyer still sees what they picked on Tuesday, and so does the pack list at the booth.

`status`: `reserved`, `collected`, `no_show`, `cancelled_by_buyer`, `cancelled_by_seller`

`fulfillment_snapshot` freezes the booth number, address or delivery window at reservation time, so later edits to the seller's config do not rewrite history.

### reviews
Carries over from RentEvent largely unchanged. Only a buyer with a `collected` reservation can review.

## Invariants

Enforce these at the model layer. The UI should also prevent them, but the model is what actually holds.

1. `listing.category` must exist in `unlocked_categories` for that seller and be `active`.
2. When a verification moves to `expired` or `rejected`, every category it granted deactivates, and listings in those categories move to `hidden`.
3. `fulfillment_options.config.performed_by = 'own_staff'` requires `permitted_establishment` on the seller.
4. A listing with `temperature_controlled = true` cannot include an unattended handoff option.
5. A `cottage_food` listing cannot reach `published` with an incomplete `label`.
6. `reservations.quantity` cannot exceed `listing.quantity_available` at reservation time.
7. Blocked categories are absent from the category enum entirely.
8. A listing cannot reach `published` without `photo_url`, and its seller cannot publish at all without `cover_photo_url`.
9. Basket and reservation rows carry their own copy of the photo, never a live lookup to the listing.

## Open questions

- Should `unlocked_categories` be a materialized table or a computed view. Materialized is simpler to query and to audit, at the cost of recompute discipline.
- Does a seller need per listing fulfillment overrides in v1, or is per seller enough. Leaning yes on overrides, since a custom cake is a different handoff than a loaf of bread.
- How long reservations hold before auto cancelling.
