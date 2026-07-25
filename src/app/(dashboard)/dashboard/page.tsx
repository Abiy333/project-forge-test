import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MetricsGrid } from "@/features/analytics/components/MetricGrid";
import { ProductForm } from "@/features/products/components/ProductForm";
import { AsyncGrid } from "@/features/products/components/AsyncGrid";

// Dedicated server handler for clean logout flow execution
async function handleSignOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}

export default async function DashboardPage() {
  // 1. Initialize our secure database client factory
  const supabase = await createClient();

  // 2. Fetch the current logged-in user's metadata from the session token
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return redirect("/login");
  }

  // 3. Fetch this specific tenant's store data using their User ID relation
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("store_name, subdomain")
    .eq("id", user.id)
    .single();

  if (tenantError || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
        <Card className="max-w-md w-full border-red-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-600">Account Configuration Pending</CardTitle>
            <CardDescription>
              We authenticated your login, but could not locate your unique store provisioning records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signup">
              <Button className="w-full bg-zinc-900 text-white">Create a New Store Branch</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Persistent Dashboard Top Navigation Bar */}
      <nav className="border-b border-zinc-200 bg-white px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-sm">
            S
          </span>
          <h1 className="font-bold text-lg tracking-tight">{tenant.store_name} Console</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs px-2.5 py-1 bg-zinc-100 border border-zinc-200 rounded-full font-medium text-zinc-600">
            Tenant Active
          </span>
          <form action={handleSignOut}>
            <Button variant="outline" type="submit" className="border-zinc-300 text-zinc-700 hover:bg-zinc-50">
              Sign Out
            </Button>
          </form>
        </div>
      </nav>

      {/* Primary Management Panel Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Branch Overview Welcome banner */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Welcome back, administrator</h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              Your platform instance is fully optimized and serving public traffic.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-zinc-500 font-medium">Public URL:</span>
            <a 
              href={`https://${tenant.subdomain}.saas-platform.com`} 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-semibold text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
            >
              {tenant.subdomain}.saas-platform.com
            </a>
          </div>
        </div>

        {/* Section Title Heading */}
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-900">Store Performance Overview</h3>
          <p className="text-zinc-500 text-sm mt-0.5">Monitor sales data pipelines and active catalogs.</p>
        </div>

        {/* Dynamic Analytics Summary Dashboard Card Component Grid */}
        <MetricsGrid tenantId={user.id} />

        <hr className="border-zinc-200" />

        {/* Inventory Working Grid Area */}
        <div className="grid gap-8 md:grid-cols-3 items-start">
          {/* Left Column: Product Management Inputs */}
          <div className="md:col-span-1 md:sticky md:top-6">
            <ProductForm />
          </div>

          {/* Right Column: Live Partitioned Catalog Feed */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-zinc-900 mb-4 tracking-tight">Active Live Inventory</h3>
            <AsyncGrid tenantId={user.id} isDashboard={true} />
          </div>
        </div>
      </main>
    </div>
  );
}