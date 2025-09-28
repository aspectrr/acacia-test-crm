"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function Overview({
  data,
}: {
  data: { created_at: string; value: number }[];
}) {
  const monthlyData = data.reduce(
    (acc, deal) => {
      const month = new Date(deal.created_at).toLocaleString("default", {
        month: "short",
      });
      const existingMonth = acc.find((d) => d.name === month);
      if (existingMonth) {
        existingMonth.total += deal.value;
      } else {
        acc.push({ name: month, total: deal.value });
      }
      return acc;
    },
    [] as { name: string; total: number }[],
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthlyData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <Tooltip
          formatter={(value, name) => {
            if (name === "total") return [`$${value}`, "Revenue"];
            return [value, "Deals"];
          }}
        />
        <Bar
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          name="Revenue"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
