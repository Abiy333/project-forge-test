import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { DeleteButton } from "./DeleteButton";
import { BuyButton } from "./BuyButton";

interface AsyncGridProps {
  tenantId: string;
  isDashboard?: boolean; // 👈 Add this prop
}

export async function AsyncGrid({ tenantId, isDashboard = false }: AsyncGridProps) {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, description, image_url")
    .eq("tenant_id", tenantId);

  if (error || !products || products.length === 0) {
    return (
      <div className="border-2 border-dashed border-zinc-200 rounded-xl p-12 text-center text-zinc-500">
        📦 This store has not added any products to its catalog yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="group rounded-xl border border-zinc-200 bg-white overflow-hidden p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="h-48 w-full bg-zinc-100 rounded-lg overflow-hidden flex items-center justify-center text-zinc-400 relative">
              {product.image_url ? (
                <Image 
                  src={product.image_url} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized 
                />
              ) : (
                "No Image"
              )}
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-semibold text-zinc-900 tracking-tight">{product.name}</h3>
              <p className="text-sm text-zinc-500 line-clamp-2">{product.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-3 border-t border-zinc-100">
            <span className="font-bold text-zinc-900 text-base">
              ₦{Number(product.price).toLocaleString()}
            </span>

            {/* 👈 Show Delete button in Dashboard, Buy button on Public Store */}
            {isDashboard ? (
              <DeleteButton productId={product.id} />
            ) : (
              <BuyButton 
                productId={product.id} 
                productName={product.name} 
                price={Number(product.price)} 
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}