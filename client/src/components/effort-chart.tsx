import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

type ChartProps = {
  data: {
    category: string;
    totalEffort: number;
    taskCount: number;
  }[];
};

export default function EffortChart({ data }: ChartProps) {
  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="category"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: "Minutes",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12 },
            }}
          />
          <Tooltip />
          <Bar
            dataKey="totalEffort"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
