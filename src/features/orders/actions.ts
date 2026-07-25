"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export async function updateOrderStatusAction(orderId: string, newStatus: OrderStatus) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    return { success: false, message: "Failed to update order status." };
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  return { success: true, message: `Order updated to ${newStatus}.` };
}