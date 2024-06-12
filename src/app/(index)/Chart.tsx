"use client";

import { AreaChart, Area, YAxis, ResponsiveContainer } from "recharts";

const Chart = ({ prices }: { prices: any[] }) => (
  <ResponsiveContainer width="100%" height={96} className="mt-6">
    <AreaChart
      id="near-chart"
      data={prices}
      margin={{
        top: 10,
        right: 0,
        left: 0,
        bottom: 10,
      }}
    >
      <defs>
        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#37CD83" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#37CD83" stopOpacity={0} />
        </linearGradient>
      </defs>
      <YAxis hide={true} domain={["dataMin - 0.1", "dataMax"]} />
      <Area
        type="natural"
        dataKey="price"
        fill="url(#colorPrice)"
        stroke="#37CD83"
        strokeWidth={3}
        animationDuration={1000}
        animationEasing="ease-in-out"
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default Chart;
