import { createClient } from "@/lib/supabase/server";

export async function checkFeatureLimit(tenantId: string, feature: "product_count" | "custom_domain") {
  const supabase = await createClient();

  // 1. Fetch the merchant's active plan details
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_tier, status")
    .eq("tenant_id", tenantId)
    .single();

  const plan = subscription?.plan_tier || "free";
  const isActive = ["active", "trailing"].includes(subscription?.status || "");

  // If subscription payment is broken, lock down operations
  if (!isActive && plan !== "free") {
    return { allowed: false, reason: "Your subscription payment is past due. Please update billing." };
  }

  // 2. Define business tier limits rules
  if (feature === "product_count") {
    // Count how many products they currently have deployed
    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId);

    const currentCount = count || 0;

    if (plan === "free" && currentCount >= 3) {
      return { allowed: false, reason: "Free tier is limited to 3 products. Upgrade to Pro for unlimited slots!" };
    }
  }

  if (feature === "custom_domain") {
    if (plan === "free") {
      return { allowed: false, reason: "Custom vanity domains are reserved for Pro and Enterprise plans." };
    }
  }

  return { allowed: true };
}