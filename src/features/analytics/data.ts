import { createClient } from "@/lib/supabase/server";

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingOrdersCount: number;
}

export async function fetchAnalyticsSummary(tenantId: string): Promise<AnalyticsSummary> {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("total_amount, status")
    .eq("tenant_id", tenantId);

  if (error || !orders || orders.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      pendingOrdersCount: 0,
    };
  }

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total_amount || 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    pendingOrdersCount,
  };
}