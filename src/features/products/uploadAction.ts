"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadProductImage(formData: FormData) {
  const supabase = await createClient();

  // 1. Authenticate user session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Unauthorized access. Please log back in." };
  }

  const file = formData.get("imageFile") as File;
  if (!file || file.size === 0) {
    return { error: "No image file provided." };
  }

  // 2. Security Validation: File size and extension limits (Max 4MB)
  if (file.size > 4 * 1024 * 1024) {
    return { error: "File size exceeds the 4MB limit." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Invalid file type. Only JPEG, PNG, and WebP images are permitted." };
  }

  // 3. Generate an isolated file destination path (tenant_id/unique_filename)
  const fileExtension = file.name.split(".").pop();
  const uniqueFilename = `${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `${user.id}/${uniqueFilename}`;

  // 4. Upload raw buffer to Supabase Storage bucket
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    console.error("Storage Error:", uploadError.message);
    return { error: "Cloud storage upload failed. Try again." };
  }

  // 5. Build and return the permanent public asset URL
  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return { success: true, url: publicUrl };
}