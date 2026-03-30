export type EntitledFeatureKey =
  | "settings"
  | "widgetProducts"
  | "subscriptionManagement"
  | "subscriptionRules"
  | "advancedOffers"
  | "analytics"
  | "automation"
  | "prioritySupport"
  | "merchantAdmin";

export const FEATURE_LABELS: Record<EntitledFeatureKey, string> = {
  settings: "Widget settings",
  widgetProducts: "Widget product selection",
  subscriptionManagement: "Subscription operations",
  subscriptionRules: "Subscription rule builder",
  advancedOffers: "Legacy advanced offers",
  analytics: "Analytics dashboard",
  automation: "Scale automation surfaces",
  prioritySupport: "Priority support",
  merchantAdmin: "Internal merchant admin",
};