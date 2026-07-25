"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkFeatureLimit } from "@/features/billing/guardrails";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  // 1. Get current logged-in user session to figure out their Tenant ID
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Unauthorized access. Please log back in." };
  }

  // Use the User ID as the Tenant ID (since our schema maps them 1:1)
  const tenantId = user.id;

  const limitCheck = await checkFeatureLimit(tenantId, "product_count");
  if (!limitCheck.allowed) {
    return { error: limitCheck.reason };
  }

  // 2. Extract input fields safely from the submitted form
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceInput = formData.get("price") as string;
  const imageUrl = formData.get("imageUrl") as string || null;

  if (!name || !priceInput) {
    return { error: "Product name and price are required fields." };
  }

  const price = parseFloat(priceInput);

  // 3. Write data to Supabase (RLS policy will double check this!)
  const { error: dbError } = await supabase
    .from("products")
    .insert({
      tenant_id: tenantId,
      name,
      description,
      price,
      image_url: imageUrl,
    });

  if (dbError) {
    console.error("Database Insert Error:", dbError.message);
    return { error: "Failed to save product to inventory." };
  }

  // 4. Wipe Next.js data cache for the dashboard so the new item displays instantly
  revalidatePath("/dashboard");
  return { success: true };
}