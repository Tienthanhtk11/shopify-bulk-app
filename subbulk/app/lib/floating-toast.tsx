import { Text } from "@shopify/polaris";

type FloatingToastProps = {
  message: string;
  tone?: "success" | "critical";
};

export function FloatingToast({
  message,
  tone = "success",
}: FloatingToastProps) {
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 40,
        maxWidth: 360,
        padding: "12px 16px",
        borderRadius: 12,
        background:
          tone === "critical"
            ? "rgba(127, 29, 29, 0.96)"
            : "rgba(15, 23, 42, 0.94)",
        color: "#f8fafc",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.28)",
      }}
    >
      <Text as="p" variant="bodyMd">
        {message}
      </Text>
    </div>
  );
}