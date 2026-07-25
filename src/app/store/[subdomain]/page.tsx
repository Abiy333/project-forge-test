import { createClient } from "@/lib/supabase/server";
import { AsyncGrid } from "@/features/products/components/AsyncGrid";
import { notFound } from "next/navigation";

interface StorefrontProps {
  params: Promise<{ subdomain: string }>;
}

export default async function StorefrontPage({ params }: StorefrontProps) {
  const { subdomain } = await params;
  const supabase = await createClient();

  // 1. Find the store details using the unique subdomain slug
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id, store_name")
    .eq("subdomain", subdomain)
    .single();

  // If the subdomain doesn't exist in our DB, show a clean 404 page
  if (tenantError || !tenant) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Public Storefront Banner Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-6 text-center shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 uppercase">
          {tenant.store_name}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Welcome to our official dynamic digital storefront.
        </p>
      </header>

      {/* Main Grid View presenting only this tenant's inventory items */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-zinc-900 mb-6 tracking-tight">Our Collection</h2>
        <AsyncGrid tenantId={tenant.id} />
      </main>
    </div>
  );
}