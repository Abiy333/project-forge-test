import { createClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/features/orders/components/OrderStatusSelect";

export default async function OrdersPage() {
  const supabase = await createClient();

  // Retrieve auth session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-8">Please log in to view orders.</div>;

  // Query tenant orders
  const { data: orders } = await supabase
    .from("orders")
    .select("id, customer_name, customer_email, total_amount, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Orders Management</h1>
        <p className="text-sm text-zinc-500">Track and manage customer fulfillments in real time.</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-zinc-600">
          <thead className="border-b border-zinc-200 bg-zinc-50/50 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{order.customer_name || "Guest Customer"}</p>
                    <p className="text-xs text-zinc-400">{order.customer_email || "N/A"}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-900">
                    ₦{Number(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {new Date(order.created_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                  No orders recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}