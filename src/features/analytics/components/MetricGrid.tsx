import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAnalyticsSummary } from "../data";

interface MetricsGridProps {
  tenantId: string;
}

export async function MetricsGrid({ tenantId }: MetricsGridProps) {
  const metrics = await fetchAnalyticsSummary(tenantId);

  const cardData = [
    {
      title: "Total Revenue",
      value: `₦${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: `+${metrics.totalRevenue}% from last week`,
      textColor: "text-emerald-600",
    },
    {
      title: "Orders Processed",
      value: metrics.totalOrders.toString(),
      description: "Lifetime order volume count",
      textColor: "text-zinc-900",
    },
    {
      title: "Average Ticket",
      value: `₦${metrics.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: "Mean gross basket value size",
      textColor: "text-blue-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cardData.map((card, idx) => (
        <Card key={idx} className="bg-white border border-zinc-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold tracking-tight ${card.textColor}`}>
              {card.value}
            </div>
            <p className="text-xs text-zinc-400 mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}