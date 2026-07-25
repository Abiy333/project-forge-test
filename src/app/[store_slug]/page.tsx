import { createClient } from "@/lib/supabase/server";
import { AsyncGrid } from "@/features/products/components/AsyncGrid";
import { CatalogSkeleton } from "@/features/products/components/Skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ store_slug: string }>;
}

export default async function StorefrontPage({ params }: PageProps) {
  const { store_slug } = await params;
  const supabase = await createClient();

  // 1. Resolve the matching tenant using the dynamic subdomain slug string
  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("id, store_name")
    .eq("subdomain", store_slug)
    .single();

  // If no store matches that name, throw an instant 404 page error handler
  if (error || !tenant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Consumer Header Bar */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-50 shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">{tenant.store_name}</h1>
        <div className="text-xs px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full font-semibold">
          Secure Storefront
        </div>
      </header>

      {/* Main Catalog View Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Our Catalog</h2>
          <p className="text-zinc-500 text-sm mt-0.5">Explore our brand verified digital products and inventory.</p>
        </div>

        {/* Streaming Framework boundary */}
        <Suspense fallback={<CatalogSkeleton />}>
          <AsyncGrid tenantId={tenant.id} />
        </Suspense>
      </main>
    </div>
  );
}