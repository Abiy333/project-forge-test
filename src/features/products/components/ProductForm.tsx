"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createProduct } from "../actions";
import { uploadProductImage } from "../uploadAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as Sentry from "@sentry/nextjs";

export function ProductForm() {
  const [isPending, startTransition] = useTransition();
  const [uploadingStatus, setUploadingStatus] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const initialFormData = new FormData(formElement);

    startTransition(async () => {
      try {
        let finalImageUrl = "";
        const imageFile = initialFormData.get("imageFile") as File;

        // 1. If a file was chosen, upload it to cloud storage first
        if (imageFile && imageFile.size > 0) {
          setUploadingStatus(true);
          const uploadData = new FormData();
          uploadData.append("imageFile", imageFile);
          
          const uploadResult = await uploadProductImage(uploadData);
          setUploadingStatus(false);

          if (uploadResult.error) {
            toast.error(uploadResult.error);
            return;
          }
          finalImageUrl = uploadResult.url || "";
        }

        // 2. Build product parameters payload
        const productFormData = new FormData();
        productFormData.append("name", initialFormData.get("name") as string);
        productFormData.append("description", initialFormData.get("description") as string);
        productFormData.append("price", initialFormData.get("price") as string);
        productFormData.append("imageUrl", finalImageUrl);

        // 3. Submit main data parameters down into inventory pipeline
        const result = await createProduct(productFormData);

        if (result?.error) {
          toast.error(result.error);
        } else if (result?.success) {
          toast.success("🎉 Product successfully added to your catalog!");
          formElement.reset();
        }
      } catch (err) {
        Sentry.captureException(err);
        setUploadingStatus(false);
        toast.error("Something went wrong while saving your product. Please try again.");
      }
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-zinc-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-900">Add New Product</CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Introduce a new item to your store&apos;s digital inventory catalog.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-zinc-700 font-medium text-sm">Product Name</Label>
            <Input id="name" name="name" type="text" placeholder="e.g. Wireless Headset" disabled={isPending} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-zinc-700 font-medium text-sm">Description</Label>
            <Input id="description" name="description" type="text" placeholder="e.g. Noise-cancelling bluetooth" disabled={isPending} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price" className="text-zinc-700 font-medium text-sm">Price (₦)</Label>
            <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" disabled={isPending} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageFile" className="text-zinc-700 font-medium text-sm">Product Image File</Label>
            <Input 
              id="imageFile" 
              name="imageFile" 
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              className="cursor-pointer file:border-0 file:bg-zinc-100 file:text-zinc-700 file:font-medium file:rounded-md hover:file:bg-zinc-200"
              disabled={isPending} 
            />
          </div>

          <Button type="submit" className="w-full mt-2 transition-all" disabled={isPending}>
            {uploadingStatus ? "Uploading Media..." : isPending ? "Syncing Inventory..." : "Add to Inventory"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}