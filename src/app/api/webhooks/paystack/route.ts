import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmationEmails } from "@/lib/supabase/email";
import * as Sentry from "@sentry/nextjs";
 
export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseKey) {
    return new Response('Missing Supabase credentials', { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  try {
    const bodyText = await request.text();
    const paystackSignature = request.headers.get("x-paystack-signature");

    // 1. Verify Paystack HMAC SHA512 Signature for Security
    const secret = process.env.PAYSTACK_SECRET_KEY || "";
    const hash = crypto
      .createHmac("sha512", secret)
      .update(bodyText)
      .digest("hex");

    if (hash !== paystackSignature) {
      return NextResponse.json({ message: "Invalid Paystack signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    // 2. Handle successful charge event
    if (event.event === "charge.success") {
      const data = event.data;
      const orderId = data.metadata?.order_id || data.reference;

      // Update order status in Supabase database
      const { data: updatedOrder, error: orderError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "processing",
          payment_reference: data.reference,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select("*, tenants(name, owner_email)")
        .single();

      if (orderError || !updatedOrder) {
        console.error("Failed to update order status:", orderError);
        return NextResponse.json({ message: "Order not found or update failed" }, { status: 404 });
      }

      // 3. 📧 Trigger Resend emails (Buyer receipt & Merchant notification)
      const storeName = updatedOrder.tenants?.name || "Our Store";
      const merchantEmail = updatedOrder.tenants?.owner_email || process.env.ADMIN_EMAIL || "";

      await sendOrderConfirmationEmails({
        buyerEmail: updatedOrder.customer_email || data.customer.email,
        merchantEmail: merchantEmail,
        orderId: updatedOrder.id,
        totalAmount: Number(updatedOrder.total_amount),
        storeName: storeName,
      });
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}