# SubBulk Implementation Report

## Completed Features

- Subscription widget on the storefront via theme app extension.
- Purchase options block on the product page.
- Store-specific preview discount and widget settings for storefront display.
- Customer portal for subscription viewing and self-service management.
- Subscription list in the customer portal.
- Portal actions: pause, resume, cancel.
- Support for New Customer Accounts via Customer Account UI extension.
- Subscription list directly on the customer Profile page.
- Inline self-service actions in Customer Account: pause, resume, cancel.
- Subscription status summary in Customer Account: Total, Active, Paused, Cancelled.
- Modern subscription management board on the customer Profile page.
- Admin configuration for widget settings.
- Admin control for which products can display the widget.
- Admin management for subscription rules and subscription offers.

## Implemented Screens

- Storefront product page with `SubBulk purchase options` widget.
- Customer portal at `/apps/subbulk/portal`.
- Customer Account Profile page with `SubBulk subscriptions` block.
- Admin Settings page for widget configuration.
- Admin Widget Products page for product-level widget enablement.
- Admin Subscriptions page for merchant monitoring.
- Admin screens for subscription rules and offers.

## Areas For Improvement

- Add a confirmation modal before cancel actions.
- Further refine the Customer Account board UI.
- Add filters or tabs for Active, Paused, and Cancelled states.
- Add pagination or lazy loading for customers with many subscriptions.
- Show subscription frequency and selling plan details more clearly.
- Add advanced actions such as skip next order, change frequency, or change quantity.
- Better align portal logic and Customer Account logic to reduce duplication.
- Add stronger logging and monitoring for public routes.
- Add automated tests for pause, resume, and cancel flows.
- Add end-to-end tests for storefront and Customer Account flows.
- Resolve the remaining CSS build warning.
- Improve mobile layout for the subscription board.
- Improve error and empty states for customers.
- Consider removing the portal entry point if Customer Account self-service is sufficient.
