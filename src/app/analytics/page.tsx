
"use client";
import React from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";

const connectivityData = [
  { date: "2024-07-01", online: 1200, offline: 87 },
  { date: "2024-07-02", online: 1210, offline: 77 },
  { date: "2024-07-03", online: 1190, offline: 97 },
  { date: "2024-07-04", online: 1220, offline: 67 },
  { date: "2024-07-05", online: 1230, offline: 57 },
  { date: "2024-07-06", online: 1205, offline: 82 },
  { date: "2024-07-07", online: 1240, offline: 47 },
  { date: "2024-07-08", online: 1255, offline: 32 },
  { date: "2024-07-09", online: 1235, offline: 52 },
  { date: "2024-07-10", online: 1260, offline: 27 },
];

const chartConfigConnectivity: ChartConfig = {
  online: { label: "Online Devices", color: "hsl(var(--chart-2))" }, // Greenish
  offline: { label: "Offline Devices", color: "hsl(var(--chart-5))" }, // Reddish/Orangeish
};

const deviceStatusData = [
  { status: "Online", count: 1287, fill: "hsl(var(--chart-2))" },
  { status: "Offline", count: 150, fill: "hsl(var(--chart-4))" },
  { status: "Error", count: 42, fill: "hsl(var(--chart-5))" },
  { status: "Updating", count: 20, fill: "hsl(var(--chart-1))" },
];

const deviceStatusChartConfig: ChartConfig = {
  count: { label: "Device Count" },
  // For legend:
  Online: { label: "Online", color: "hsl(var(--chart-2))" },
  Offline: { label: "Offline", color: "hsl(var(--chart-4))" },
  Error: { label: "Error", color: "hsl(var(--chart-5))" },
  Updating: { label: "Updating", color: "hsl(var(--chart-1))" },
};

const legendPayloadForStatusChart = deviceStatusData.map(item => ({
  value: item.status, // This key ('Online', 'Offline', etc.) must exist in deviceStatusChartConfig for label
  color: item.fill, // This color will be used by ChartLegendContent
  type: 'square' as RechartsPrimitive.LegendType
}));


export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports & Analytics"
        description="Visualize trends and insights from your IoT data."
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Device Connectivity Over Time</CardTitle>
            <CardDescription className="font-body">Daily trend of online vs. offline devices.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigConnectivity} className="h-[350px] w-full">
              <RechartsPrimitive.AreaChart
                accessibilityLayer
                data={connectivityData}
                margin={{ left: 12, right: 12, top: 5, bottom: 5 }}
              >
                <RechartsPrimitive.CartesianGrid vertical={false} strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <RechartsPrimitive.YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <RechartsPrimitive.Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <RechartsPrimitive.Legend content={<ChartLegendContent />} />
                <RechartsPrimitive.Area
                  dataKey="online"
                  type="natural"
                  fill="var(--color-online)"
                  fillOpacity={0.3}
                  stroke="var(--color-online)"
                  stackId="a"
                />
                <RechartsPrimitive.Area
                  dataKey="offline"
                  type="natural"
                  fill="var(--color-offline)"
                  fillOpacity={0.3}
                  stroke="var(--color-offline)"
                  stackId="b"
                />
              </RechartsPrimitive.AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Device Status Distribution</CardTitle>
            <CardDescription className="font-body">Current count of devices by operational status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={deviceStatusChartConfig} className="h-[350px] w-full">
              <RechartsPrimitive.BarChart 
                accessibilityLayer 
                data={deviceStatusData} 
                layout="vertical"
                margin={{ left: 12, right: 12, top: 5, bottom: 5 }}
              >
                <RechartsPrimitive.CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
                <RechartsPrimitive.YAxis
                  dataKey="status"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={80}
                />
                <RechartsPrimitive.Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <RechartsPrimitive.Legend content={<ChartLegendContent payload={legendPayloadForStatusChart} />} />
                <RechartsPrimitive.Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {deviceStatusData.map((entry, index) => (
                    <RechartsPrimitive.Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </RechartsPrimitive.Bar>
              </RechartsPrimitive.BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

