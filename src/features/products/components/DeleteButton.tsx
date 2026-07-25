"use client";

import { useTransition } from "react";
import { deleteProduct } from "../deleteActions";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  productId: string;
}

export function DeleteButton({ productId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this item from your store catalog?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result?.error) {
        alert(result.error);
      }
    });
  }

  return (
    <Button 
      variant="destructive" 
      size={"sm" as const}
      className="h-8 px-3 text-xs bg-red-600 hover:bg-red-700 font-medium"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Removing..." : "Delete"}
    </Button>
  );
}