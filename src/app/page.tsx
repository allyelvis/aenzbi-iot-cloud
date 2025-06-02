
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, BarChart3, Bell, HardDrive, Users, Wrench, AlertTriangle, CheckCircle2, Activity, Zap } from "lucide-react";
import type { DashboardStat } from "@/lib/types";
import Image from "next/image";

const stats: DashboardStat[] = [
  { title: "Active Devices", value: "1,287", icon: HardDrive, change: "+12%", changeType: "positive" },
  { title: "Alerts Today", value: "42", icon: AlertTriangle, change: "-5%", changeType: "negative" },
  { title: "System Health", value: "99.8%", icon: CheckCircle2, change: "+0.1%", changeType: "positive" },
  { title: "Users Online", value: "78", icon: Users, change: "+3", changeType: "positive" },
];

const quickActions = [
  { label: "Add New Device", icon: HardDrive, href: "/devices" },
  { label: "Manage Users", icon: Users, href: "/access-control" },
  { label: "View Alerts", icon: Bell, href: "/alerts" },
  { label: "Check Maintenance", icon: Wrench, href: "/maintenance" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Welcome to Aenzbi IoT Cloud. Here's an overview of your connected world."
        icon={LayoutDashboard}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-headline">{stat.value}</div>
              {stat.change && (
                <p className={`text-xs text-muted-foreground ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Device Activity Overview</CardTitle>
            <CardDescription className="font-body">
              Visual representation of device connections and data traffic.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {/* Placeholder for chart */}
            <AreaChart className="h-24 w-24 text-muted-foreground opacity-50" />
             <p className="text-muted-foreground font-body">Chart data would appear here.</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription className="font-body">
              Access common tasks quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {quickActions.map(action => (
              <Button key={action.label} variant="outline" className="w-full justify-start gap-2 font-body">
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1">
         <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Recent High-Priority Alerts</CardTitle>
            <CardDescription className="font-body">Critical issues that need your attention.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for alerts list */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-md border border-destructive/50 bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive font-body">Critical: Pump P-102 High Vibration</p>
                  <p className="text-sm text-destructive/80 font-body">Detected unusual vibration levels. Immediate inspection recommended. (Construction Site Alpha)</p>
                </div>
              </div>
               <div className="flex items-start gap-3 p-3 rounded-md border border-orange-500/50 bg-orange-500/10">
                <Zap className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-700 font-body">Warning: Office Main Door Unlocked After Hours</p>
                  <p className="text-sm text-orange-600/80 font-body">Main entrance door sensor indicates 'unlocked' at 10:32 PM. (Office HQ)</p>
                </div>
              </div>
               <div className="flex items-start gap-3 p-3 rounded-md border border-blue-500/50 bg-blue-500/10">
                <Activity className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-700 font-body">Info: Hotel Room 305 Temperature Anomaly</p>
                  <p className="text-sm text-blue-600/80 font-body">Room 305 temperature is 15°C while set to 22°C. (Grand Hotel)</p>
                </div>
              </div>
            </div>
             <Button variant="link" className="mt-4 p-0 h-auto text-primary font-body">View all alerts</Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

// Helper icon, not from lucide, but for PageHeader consistency
const LayoutDashboard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);
