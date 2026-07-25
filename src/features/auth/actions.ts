"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Handles securely logging in an existing store owner.
 */
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // 1. Initialize our secure server-side database client factory
  const supabase = await createClient();

  // 2. Request a session token from Supabase Auth using the credentials
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // If it fails, send them back to the login page with the network error message
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // 3. Success! The session cookie is now safely set in the browser.
  // Redirect them past the middleware bouncer to the protected dashboard.
  return redirect("/dashboard");
}

/**
 * Handles registering a brand new merchant and provisioning their tenant store.
 */
export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const storeName = formData.get("storeName") as string;
  
  const supabase = await createClient();

  // 1. Register the raw user inside the core Supabase authentication table
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return redirect(`/signup?error=${encodeURIComponent(authError?.message || "Registration failed")}`);
  }

  // 2. Provision their SaaS Tenant store automatically.
  // We clean up their store name to make a safe web subdomain (e.g., "Abigail Shop" -> "abigail-shop")
  const generatedSubdomain = storeName.toLowerCase().replace(/\s+/g, "-");

  const { error: tenantError } = await supabase.from("tenants").insert({
    id: authData.user.id, // Linking their unique Auth User ID directly to the Tenant ID
    store_name: storeName,
    subdomain: generatedSubdomain,
  });

  if (tenantError) {
    return redirect(`/signup?error=${encodeURIComponent(tenantError.message)}`);
  }

  // 3. Everything succeeded. Send them to their fresh dashboard.
  return redirect("/dashboard");
}