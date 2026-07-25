import { Resend } from "resend";
import * as Sentry from "@sentry/nextjs";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailProps {
  buyerEmail: string;
  merchantEmail: string;
  orderId: string;
  totalAmount: number;
  storeName: string;
}

export async function sendOrderConfirmationEmails({
  buyerEmail,
  merchantEmail,
  orderId,
  totalAmount,
  storeName,
}: OrderEmailProps) {
  const formattedAmount = `₦${totalAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;

  try {
    // 1. Send receipt to the buyer
    await resend.emails.send({
      from: `${storeName} <onboarding@resend.dev>`, // Replace with your verified domain in production
      to: [buyerEmail],
      subject: `Order Confirmation #${orderId.slice(0, 8)}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Thank you for your order from ${storeName}!</h2>
          <p>We have successfully received your payment of <strong>${formattedAmount}</strong>.</p>
          <p>Order ID: <code>${orderId}</code></p>
          <hr />
          <p style="color: #666; font-size: 12px;">If you have any questions, reply to this email to reach store support.</p>
        </div>
      `,
    });

    // 2. Send order notification alert to the merchant
    await resend.emails.send({
      from: `Store Alerts <onboarding@resend.dev>`, // Replace with your verified domain in production
      to: [merchantEmail],
      subject: `🎉 New Order Received - ${formattedAmount}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>You made a new sale!</h2>
          <p>Order ID: <code>${orderId}</code></p>
          <p>Customer: <strong>${buyerEmail}</strong></p>
          <p>Total Revenue: <strong>${formattedAmount}</strong></p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders">View order in merchant dashboard →</a></p>
        </div>
      `,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Failed to send transactional email:", error);
  }
}