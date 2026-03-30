# SubBulk Implementation Report

## Completed Features

- Subscription widget on the storefront through the theme app extension.
- Purchase options block on the product page.
- Store-specific preview discount and widget settings for storefront rendering.
- Customer portal for subscription viewing and self-service management.
- Subscription list in the customer portal.
- Portal actions: pause, resume, cancel.
- Support for New Customer Accounts through the Customer Account UI extension.
- Subscription list shown directly on the customer Profile page.
- Inline self-service actions in Customer Account: pause, resume, cancel.
- Subscription status summary in Customer Account: Total, Active, Paused, Cancelled.
- Modern subscription management board on the customer Profile page.
- Admin configuration page for widget settings.
- Admin control over which products can show the widget.
- Admin management for subscription rules and subscription offers.

## Implemented Screens

- Storefront product page with the `SubBulk purchase options` widget.
- Customer portal at `/apps/subbulk/portal`.
- Customer Account Profile page with the `SubBulk subscriptions` block.
- Admin Settings page for widget configuration.
- Admin Widget Products page for product-level widget enablement.
- Admin Subscriptions page for merchant monitoring.
- Admin screens for subscription rules and offers.

## Areas For Improvement

- Add a confirmation modal before cancellation actions.
- Further refine the Customer Account board UI.
- Add filters or tabs for Active, Paused, and Cancelled states.
- Add pagination or lazy loading for customers with many subscriptions.
- Show subscription frequency and selling plan details more clearly.
- Add advanced actions such as skip next order, change frequency, or change quantity.
- Better align portal logic and Customer Account logic to reduce duplication.
- Improve logging and monitoring for public routes.
- Add automated tests for pause, resume, and cancel flows.
- Add end-to-end tests for storefront and Customer Account flows.
- Resolve the remaining CSS build warning.
- Improve the mobile layout for the subscription board.
- Improve error and empty states for customers.
- Consider removing the portal entry point if Customer Account self-service is sufficient.

## Merchant Registration and License Design

### Product Decision Based On Shopify

- Use Shopify Managed Pricing as the main licensing model for this public app.
- Reason: Shopify hosts the pricing page and handles recurring billing, free trials, proration, charge approval, and billing updates with far less custom code than a manual Billing API flow.
- Fit for the current app: SubBulk appears to need fixed recurring plans rather than complex usage billing, so it fits Managed Pricing well.
- Important limitation: Managed Pricing supports fixed recurring plans only. If we later need usage-based charging, we will need a separate billing design.

### Recommended Commercial Model

- Public plans: up to 3 main visible plans.
- Suggested plan set:
	- Free: app install, limited configuration, sandbox-style onboarding.
	- Growth: full widget, rule management, merchant analytics, standard support.
	- Scale: everything in Growth plus higher-touch support, premium onboarding, and future advanced analytics or automation.
- Optional private plans: use Shopify private plans for enterprise merchants or merchants with negotiated pricing.
- Billing cadence: ideally offer both monthly and yearly.
- Trial: 7 to 14 days on paid plans.

### Merchant Journey

1. The merchant installs the app.
2. OAuth completes and the app creates or updates the merchant record.
3. The root embedded app checks billing entitlement.
4. If the merchant has no valid paid entitlement, redirect them to Shopify's hosted plan selection page.
5. The merchant chooses a plan and approves the subscription charge.
6. Shopify redirects back to the app welcome route with charge context.
7. The app verifies billing status through Shopify Admin billing data, not only through redirect query parameters.
8. The app stores the effective plan and entitlement snapshot in its own database.
9. The merchant continues through the onboarding checklist.
10. During the merchant lifecycle, billing changes are synchronized through Shopify billing checks plus billing webhooks.

### What Shopify Owns Vs What The App Owns

- Shopify owns:
	- the hosted pricing plan selection page
	- the charge approval flow
	- recurring billing execution
	- proration and deferral during plan changes
	- automatic subscription cancellation on uninstall
	- managed pricing trial tracking
- The app owns:
	- the merchant record and internal lifecycle state
	- feature entitlements inside the product
	- onboarding state and setup checklist
	- billing status snapshots for internal operations
	- support tooling, internal notes, risk flags, and health dashboard
	- compliance webhook handling and the data deletion workflow

### Internal Domains To Add

- Merchant
	- canonical record for each shop
	- survives uninstall and reinstall
- MerchantInstallation
	- tracks install, uninstall, and reinstall history
- MerchantPlan
	- current subscribed plan, billing period, trial state, and effective entitlement
- MerchantBillingEvent
	- tracks upgrades, downgrades, cancellation, freeze, approval, and declined states
- MerchantEntitlement
	- actual feature flags used by the app
- MerchantOnboarding
	- onboarding checklist and progress state
- MerchantHealthSnapshot
	- current operational health snapshot for the merchant
- MerchantEvent
	- audit trail across onboarding, billing, compliance, and support

### Suggested Prisma Models

- Merchant
	- id
	- shopDomain
	- shopGid
	- shopName
	- email
	- countryCode
	- currencyCode
	- timezone
	- status
	- installedAt
	- uninstalledAt
	- lastSeenAt
- MerchantPlan
	- id
	- merchantId
	- shopifySubscriptionGid
	- planKey
	- planName
	- billingModel
	- billingInterval
	- status
	- isTest
	- activatedAt
	- currentPeriodEndAt
	- trialEndsAt
	- canceledAt
	- rawPayloadJson
- MerchantEntitlement
	- id
	- merchantId
	- planKey
	- maxEnabledProducts
	- allowAdvancedAnalytics
	- allowPrioritySupport
	- allowMultiRuleSetup
	- allowFuturePremiumFeatures
	- effectiveFrom
	- effectiveTo
- MerchantOnboarding
	- merchantId
	- appInstalled
	- planSelected
	- billingApproved
	- widgetConfigured
	- productsSelected
	- subscriptionRuleCreated
	- themeWidgetVerified
	- firstCustomerActivityDetected
	- completedAt
- MerchantEvent
	- id
	- merchantId
	- type
	- severity
	- source
	- payloadJson
	- createdAt

### Core Status Model

- Merchant status:
	- pending_install
	- active
	- frozen
	- uninstalled
	- disabled
- Plan status:
	- none
	- pending_approval
	- active
	- trialing
	- canceled
	- frozen
	- declined
- Onboarding status:
	- not_started
	- in_progress
	- complete
	- blocked

### Entitlement Strategy

- Do not use the Shopify billing plan name directly throughout the app.
- Map the Shopify plan name to an internal `planKey`.
- Map `planKey` to entitlements in one place only.
- Example:
	- free -> widget preview only, maximum 5 enabled products, no advanced analytics
	- growth -> full widget, full rules, analytics, standard support
	- scale -> everything in growth plus future advanced automation and premium support
- This prevents future Shopify pricing copy changes from breaking app logic.

### Screen Design

#### 1. Billing Gate

- Location: the app root loader or the highest protected layout.
- Goal: block access to premium routes if the merchant has no valid active plan.
- Behavior:
	- if an active plan exists, continue
	- if no plan exists, redirect to Shopify's hosted pricing page
	- if the plan is pending or frozen, show a billing resolution screen

#### 2. Welcome And Plan Confirmation

- Example route: `/app/welcome`
- Goal: verify charge approval after Shopify redirects back from the plan selection page.
- Show:
	- selected plan
	- billing status
	- next-step CTA
	- onboarding checklist start

#### 3. Merchant Billing Page

- Example route: `/app/billing`
- Show:
	- current plan
	- billing interval
	- remaining trial days
	- next renewal date
	- current status
	- unlocked features
	- upgrade CTA
	- downgrade CTA
	- contact-support CTA for private plans

#### 3b. Privacy And Data Deletion Page

- Example route: `/app/privacy`
- Goal: let merchants submit a self-service request to delete the data stored by the app.
- Show:
	- a clear description of what data will be deleted
	- a clear description of what minimal metadata will still be retained
	- a warning that the action is irreversible
	- a confirmation checkbox
	- a second confirmation step by entering the shop name or typing `DELETE`
	- a `Request deletion of app-stored data` button
	- request status: not submitted, processing, completed, failed
- UX notes:
	- place this inside a `Danger zone`
	- do not place it close to normal action buttons
	- include a link to the privacy policy in this area

#### 4. Internal Merchant Admin Page

- For the internal team, not merchant-facing.
- Show:
	- merchant profile
	- current Shopify plan status
	- entitlement snapshot
	- onboarding progress
	- health state
	- recent incidents and compliance events

### Route And Service Design

- Add a service layer:
	- `app/services/merchant.server.ts`
	- `app/services/billing.server.ts`
	- `app/services/entitlements.server.ts`
	- `app/services/compliance.server.ts`
- Add routes:
	- `app/routes/app.welcome.tsx`
	- `app/routes/app.billing.tsx`
	- `app/routes/webhooks.customers.data_request.tsx`
	- `app/routes/webhooks.customers.redact.tsx`
	- `app/routes/webhooks.shop.redact.tsx`
	- `app/routes/webhooks.app.subscriptions_update.tsx`

### Webhooks Required For This Feature Set

- Mandatory compliance webhooks required for App Store distribution:
	- `customers/data_request`
	- `customers/redact`
	- `shop/redact`
- Existing lifecycle webhooks already relevant:
	- `app/uninstalled`
	- `app/scopes_update`
- Billing webhook recommended for plan lifecycle synchronization:
	- `app_subscriptions/update`
	- if one-time charges are ever introduced, also add `app_purchases_one_time/update`

### Compliance And Data Retention Rules

- `app/uninstalled`:
	- mark the merchant as uninstalled
	- revoke active app access
	- stop scheduled merchant jobs
	- keep only minimal internal records while waiting for the redact workflow
- `shop/redact`:
	- erase or anonymize shop data stored in the database
	- remove merchant configuration and customer-linked data unless legal retention is required
- `customers/redact`:
	- erase customer personal data linked to the merchant
- `customers/data_request`:
	- gather exportable customer data references and complete the operational response within Shopify's required window

### Merchant Self-Service Data Deletion

- The app should include a self-service mechanism so the merchant can request deletion of their shop data directly from the app admin UI.
- This mechanism does not replace Shopify's mandatory compliance webhooks. It is a direct request channel from the merchant.
- Proposed flow:
	1. The merchant opens `Privacy` or `Data settings`.
	2. The merchant reads the scope of data that will be deleted and the metadata that will be retained.
	3. The merchant confirms the action using a checkbox and a second confirmation step.
	4. The app creates a `MerchantDataDeletionRequest` with status `pending`.
	5. The app can place the merchant into a restricted mode for sensitive write actions if needed.
	6. An asynchronous job deletes the data and records the result.
	7. When complete, the request moves to `completed` and an audit event is stored.
- Data that should be deleted:
	- widget settings
	- widget enabled products
	- subscription rules and subscription offers stored in the internal database
	- internal notes related to the merchant
	- detailed health snapshots
	- customer data copies or related caches if any exist
	- logs containing personal data, unless they must be retained for legal reasons
- Data that should be retained at a minimum:
	- install and uninstall history
	- plan history and billing status history
	- subscription charge IDs or subscription GIDs
	- minimal audit records for uninstall, billing, and deletion requests
	- metadata required for financial reconciliation, fraud prevention, or legal obligations
- Recommended retention approach:
	- do not retain full copies of merchant configuration after deletion
	- keep only minimal metadata and anonymize or pseudonymize whenever possible
	- clearly separate `operational data` from `retained billing/audit metadata`
- Model to add:
	- `MerchantDataDeletionRequest`
- Suggested fields for `MerchantDataDeletionRequest`:
	- id
	- merchantId
	- requestedBy
	- requestedAt
	- status
	- scopeJson
	- completedAt
	- failureReason
	- auditNotes

### Product Principles For The Data Deletion Button

- Do not label the button `Delete account` if the system still retains minimal metadata.
- Better labels:
	- `Request deletion of app-stored data`
	- or `Delete shop configuration and operational data`
- The UI should explain clearly:
	- app configuration and operational data will be deleted
	- install history, uninstall history, and minimal billing/subscription metadata will still be retained for reconciliation, operations, and legal obligations
- This action should always create an audit trail so the support team can verify it later.

### Operational Flow For Plan Changes

- Upgrade:
	- the merchant selects a higher plan
	- Shopify handles proration
	- the app receives the approval redirect and later the billing update webhook
	- the app refreshes entitlements immediately after confirmation and again when the webhook arrives
- Downgrade:
	- the merchant selects a lower plan
	- the effective timing may be deferred depending on Shopify billing rules
	- the app should show a scheduled downgrade state if Shopify indicates that the previous plan remains active until the cycle ends
- Uninstall:
	- Shopify automatically cancels the subscription
	- the app moves the merchant to `uninstalled`
- Frozen billing account:
	- the app subscription can become frozen
	- the app should move the merchant to `frozen` and show resolution guidance

### Recommended Access Policy

- Free plan merchants can access:
	- the install flow
	- basic onboarding
	- limited product selection
	- preview-only or reduced functionality
- Paid plan merchants can access:
	- full widget configuration
	- full subscription rule management
	- the subscriptions analytics page
	- all premium merchant operations
- Frozen or canceled merchants:
	- read-only access to the billing page and support page
	- block write actions that depend on paid entitlement

### Proposed Backlog

#### Phase 1: Billing foundation

- Add merchant and plan models.
- Introduce internal `planKey` mapping and the entitlement map.
- Add the billing gate at the app root.
- Add `/app/welcome` and `/app/billing` routes.
- Configure Managed Pricing in the Partner Dashboard.

#### Phase 2: Lifecycle synchronization

- Add compliance webhooks.
- Add the `APP_SUBSCRIPTIONS_UPDATE` webhook.
- Persist billing events and reconcile plan status.
- Add uninstall and redact workflows.

#### Phase 3: Merchant operations

- Add internal merchant list and detail pages.
- Add onboarding checklist state.
- Add merchant support notes and event timeline.
- Add health snapshots and billing risk flags.

#### Phase 4: Growth tooling

- Add private plan support.
- Add internal playbooks for discounts and trial extensions.
- Add proactive risk alerts for frozen, declined, and incomplete onboarding merchants.

### Acceptance Criteria

- A new merchant can install the app, be redirected to the plan selection page, approve a plan, and return to the app with verified billing state.
- The app stores a merchant record independently from the Shopify session record.
- The app maps Shopify billing state to internal entitlements and gates premium routes consistently.
- The app behaves correctly across upgrade, downgrade, uninstall, reinstall, and frozen billing scenarios.
- The app includes mandatory compliance webhook handling required for App Store distribution.
- Internal operators can inspect the merchant's plan, entitlement, onboarding state, and lifecycle events.
- The merchant can submit a self-service data deletion request through a safe UI with two-step confirmation.
- After processing, merchant configuration and operational data are removed from the app, while install/uninstall history and minimal billing/subscription metadata are retained.

### Final Recommendation

- For this app, start with Managed Pricing.
- Build an internal merchant domain around Shopify billing state rather than building a completely separate custom licensing system.
- Treat billing status, entitlement state, and compliance lifecycle as three separate concerns.
- Implement compliance webhooks and merchant records before shipping plan-based access control to production.