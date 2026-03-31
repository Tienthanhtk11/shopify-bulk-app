CREATE TABLE "AdminPlanDefinition" (
  "id" TEXT NOT NULL,
  "planKey" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "monthlyPrice" TEXT NOT NULL,
  "yearlyPrice" TEXT NOT NULL,
  "tagline" TEXT NOT NULL,
  "bestFor" TEXT NOT NULL,
  "merchantFacingHighlightsJson" TEXT NOT NULL DEFAULT '[]',
  "opsHighlightsJson" TEXT NOT NULL DEFAULT '[]',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AdminPlanDefinition_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminPlanDefinition_planKey_key" ON "AdminPlanDefinition"("planKey");

INSERT INTO "AdminPlanDefinition" (
  "id",
  "planKey",
  "displayName",
  "monthlyPrice",
  "yearlyPrice",
  "tagline",
  "bestFor",
  "merchantFacingHighlightsJson",
  "opsHighlightsJson",
  "isActive",
  "isPublic",
  "sortOrder"
) VALUES
(
  'plan_free_default',
  'free',
  'Free',
  '$0',
  '$0',
  'Sandbox onboarding and limited storefront activation',
  'Trial merchants validating widget fit before monetizing subscriptions',
  '["Widget settings and product selection","Basic subscribe-and-save preview","Limited merchant onboarding checklist"]',
  '["No advanced analytics","No automation surfaces","No priority support"]',
  true,
  true,
  10
),
(
  'plan_growth_default',
  'growth',
  'Growth',
  '$29',
  '$290',
  'Seal-style core subscription stack for growing stores',
  'Merchants needing full rule management, portal controls, and analytics',
  '["Full subscription rule builder and subscription operations","Customer portal actions like pause, resume, and cancel","Analytics and billing visibility for store operators"]',
  '["Standard support lane","Admin plan reassignment and lifecycle controls","Best default plan for most production merchants"]',
  true,
  true,
  20
),
(
  'plan_scale_default',
  'scale',
  'Scale',
  '$79',
  '$790',
  'High-touch subscription operations inspired by Seal''s broader suite',
  'Larger brands that need automation, premium operations, and future forecasting surfaces',
  '["Everything in Growth","Automation-ready features and premium support","Room for payment calendar and inventory forecast tooling"]',
  '["Priority support and onboarding","Highest entitlement tier for internal exception handling","Target tier for upcoming advanced retention tooling"]',
  true,
  true,
  30
)
ON CONFLICT ("planKey") DO NOTHING;