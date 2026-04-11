# Shopify GDPR Compliance Plan

## Goal

Bring SubBulk's uninstall and privacy flows into line with Shopify App Store privacy requirements.

## Required outcomes

1. All mandatory compliance webhooks stay registered and verified.
2. `app/uninstalled` immediately revokes access and local sessions.
3. `shop/redact` removes operational shop data and minimizes retained audit/billing data.
4. `customers/data_request` stores only sanitized request summaries and supports operational follow-up.
5. `customers/redact` removes customer-identifying data from local audit trails.
6. Retained metadata is reduced to the minimum required for billing reconciliation, support, and legal obligations.

## Execution plan

1. Stop persisting raw customer compliance payloads.
2. Sanitize or redact historical compliance event payloads when a customer/shop redact request arrives.
3. Extend shop redact processing to clear sessions and minimize audit trail payloads.
4. Keep plan/billing rows only at column level; remove raw billing payload JSON after redact.
5. Verify uninstall + redact flow with test shop and database snapshots.
6. Prepare reviewer evidence: webhook config, uninstall timeline, before/after database state.

## What is already implemented in code

1. Mandatory compliance webhooks are registered in `shopify.app.toml`.
2. `app/uninstalled` marks merchant state and deletes sessions.
3. `shop/redact` deletes operational shop tables.
4. Compliance payload logging is now sanitized.
5. Customer/shop redact flows now minimize local audit payloads.

## Remaining operational tasks

1. Record a reviewer demo showing uninstall, `app/uninstalled`, and later `shop/redact` effects.
2. Confirm production webhook deliveries from Shopify Partner Dashboard or CLI trigger.
3. Decide whether Shopify-side resources such as selling plan groups should also be actively cleaned up during uninstall.