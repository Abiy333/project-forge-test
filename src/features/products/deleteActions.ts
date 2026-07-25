"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  // 1. Authenticate session context
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Unauthorized access. Please log back in." };
  }

  // 2. Execute deletion query (RLS forces the isolation match on tenant_id)
  const { error: dbError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("tenant_id", user.id); // Double guardrail configuration

  if (dbError) {
    console.error("Deletion Error:", dbError.message);
    return { error: "Failed to remove item from catalog." };
  }

  // 3. Clear layout caches to visually remove the product instantly
  revalidatePath("/dashboard");
  return { success: true };
}