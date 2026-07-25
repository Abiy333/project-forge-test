"use client";

import { useTransition } from "react";
import { updateOrderStatusAction, type OrderStatus } from "../actions";

interface OrderStatusSelectProps {
  orderId: string;
  initialStatus: OrderStatus;
}

export function OrderStatusSelect({ orderId, initialStatus }: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as OrderStatus;
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, nextStatus);
      if (!result.success) {
        alert(result.message);
      }
    });
  };

  return (
    <select
      defaultValue={initialStatus}
      disabled={isPending}
      onChange={handleChange}
      className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm focus:border-zinc-900 focus:outline-none disabled:opacity-50"
    >
      <option value="pending">⏳ Pending</option>
      <option value="processing">⚙️ Processing</option>
      <option value="shipped">🚚 Shipped</option>
      <option value="delivered">✅ Delivered</option>
      <option value="cancelled">❌ Cancelled</option>
    </select>
  );
}