"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BuyButtonProps {
  productId: string;
  productName: string;
  price: number;
}

export function BuyButton({ productId, productName, price }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);

    try {
      // 1. Ask customer for their email (or open a small modal form)
      const customerEmail = prompt(`Enter your email to buy ${productName}:`);
      
      if (!customerEmail) {
        setLoading(false);
        return;
      }

      // 2. Initialize payment with Paystack backend endpoint
      const response = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email: customerEmail,
          amount: price,
        }),
      });

      const data = await response.json();

      if (data.authorization_url) {
        // Redirect buyer to Paystack checkout page
        window.location.href = data.authorization_url;
      } else {
        toast.error(data.message || "Failed to initialize payment");
      }
    } catch {
      toast.error("An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button 
      onClick={handleBuy} 
      disabled={loading}
      className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all"
    >
      {loading ? "Redirecting..." : "Buy Now"}
    </Button>
  );
}