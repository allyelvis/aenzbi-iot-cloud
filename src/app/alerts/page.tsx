
"use client";
import React, { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, PlusCircle, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import type { AlertRule } from "@/lib/types";
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const initialAlertRules: AlertRule[] = [
  { id: "alert_001", name: "High Temperature Warning", targetType: "DeviceType", targetValue: "HVAC", sensor: "temperature", conditionOperator: ">", conditionValue: 30, notificationMethods: ["Email", "SMS"], isActive: true, severity: "High" },
  { id: "alert_002", name: "Excavator Out of Bounds", targetType: "Device", targetValue: "dev_004", sensor: "geofence", conditionOperator: "!=", conditionValue: "Site A perimeter", notificationMethods: ["Push"], isActive: true, severity: "Critical" },
  { id: "alert_003", name: "Low Battery - Hotel Lock", targetType: "Group", targetValue: "Hotel Room Locks", sensor: "battery_level", conditionOperator: "<", conditionValue: 20, notificationMethods: ["Email"], isActive: false, severity: "Medium" },
  { id: "alert_004", name: "Office Motion Detected After Hours", targetType: "DeviceType", targetValue: "MotionSensor", sensor: "motion", conditionOperator: "=", conditionValue: "detected", notificationMethods: ["SMS", "Push"], isActive: true, severity: "High" },
];

const severityColorMap: Record<AlertRule['severity'], string> = {
  Low: "bg-blue-500 hover:bg-blue-600",
  Medium: "bg-yellow-500 hover:bg-yellow-600",
  High: "bg-orange-500 hover:bg-orange-600",
  Critical: "bg-red-600 hover:bg-red-700",
};


export default function AlertsPage() {
  const [alertRules, setAlertRules] = useState<AlertRule[]>(initialAlertRules);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [formData, setFormData] = useState<Partial<AlertRule>>({});

  const handleOpenForm = (rule?: AlertRule) => {
    setEditingRule(rule || null);
    setFormData(rule || { targetType: "Device", isActive: true, notificationMethods: [], severity: "Medium" });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRule(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "notificationMethods") {
      const currentMethods = formData.notificationMethods || [];
      if (checked) {
        setFormData({ ...formData, notificationMethods: [...currentMethods, value as ('Email' | 'SMS' | 'Push')] });
      } else {
        setFormData({ ...formData, notificationMethods: currentMethods.filter(m => m !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSelectChange = (name: keyof AlertRule) => (value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSwitchChange = (name: keyof AlertRule) => (checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = () => {
    if (editingRule) {
      setAlertRules(alertRules.map(r => r.id === editingRule.id ? { ...r, ...formData } as AlertRule : r));
    } else {
      const newRule: AlertRule = {
        id: `alert_${String(Date.now()).slice(-5)}`,
        name: formData.name || "New Alert Rule",
        targetType: formData.targetType || "Device",
        targetValue: formData.targetValue || "",
        sensor: formData.sensor || "",
        conditionOperator: formData.conditionOperator || ">",
        conditionValue: formData.conditionValue || 0,
        notificationMethods: formData.notificationMethods || [],
        isActive: formData.isActive === undefined ? true : formData.isActive,
        severity: formData.severity || "Medium",
      };
      setAlertRules([...alertRules, newRule]);
    }
    handleCloseForm();
  };

  const handleDeleteRule = (ruleId: string) => {
    setAlertRules(alertRules.filter(r => r.id !== ruleId));
  };
  
  const toggleAlertStatus = (ruleId: string) => {
    setAlertRules(prevRules => 
      prevRules.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Alerts &amp; Notifications"
        description="Configure and manage alert rules for your IoT devices and systems."
        icon={Bell}
        actions={
          <Button onClick={() => handleOpenForm()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Alert Rule
          </Button>
        }
      />

      <Card className="shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.targetType}: {rule.targetValue}</TableCell>
                  <TableCell>{rule.sensor} {rule.conditionOperator} {rule.conditionValue}</TableCell>
                  <TableCell><Badge className={`${severityColorMap[rule.severity]} text-white`}>{rule.severity}</Badge></TableCell>
                  <TableCell>{rule.notificationMethods.join(', ')}</TableCell>
                  <TableCell>
                    <Switch checked={rule.isActive} onCheckedChange={() => toggleAlertStatus(rule.id)} aria-label={`Toggle ${rule.name} alert status`} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenForm(rule)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                         <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRule(rule.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingRule ? "Edit Alert Rule" : "Create New Alert Rule"}</DialogTitle>
            <DialogDescription className="font-body">
              {editingRule ? "Modify the existing alert configuration." : "Define a new rule for triggering alerts."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Form fields for AlertRule */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right col-span-1">Name</Label>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetType" className="text-right col-span-1">Target Type</Label>
              <Select name="targetType" value={formData.targetType} onValueChange={handleSelectChange('targetType')}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select target type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Device">Device</SelectItem>
                  <SelectItem value="Group">Group</SelectItem>
                  <SelectItem value="DeviceType">Device Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetValue" className="text-right col-span-1">Target Value</Label>
              <Input id="targetValue" name="targetValue" value={formData.targetValue || ""} onChange={handleChange} className="col-span-3" placeholder="Device ID, Group Name, or Type" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sensor" className="text-right col-span-1">Sensor</Label>
              <Input id="sensor" name="sensor" value={formData.sensor || ""} onChange={handleChange} className="col-span-3" placeholder="e.g., temperature, vibration" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">Condition</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                <Select name="conditionOperator" value={formData.conditionOperator} onValueChange={handleSelectChange('conditionOperator')}>
                  <SelectTrigger><SelectValue placeholder="Operator" /></SelectTrigger>
                  <SelectContent>
                    {['>', '&lt;', '=', '!=', '>=', '&lt;='].map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input name="conditionValue" value={formData.conditionValue || ""} onChange={handleChange} placeholder="Value" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="severity" className="text-right col-span-1">Severity</Label>
               <Select name="severity" value={formData.severity} onValueChange={handleSelectChange('severity')}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select severity" /></SelectTrigger>
                <SelectContent>
                  {['Low', 'Medium', 'High', 'Critical'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right col-span-1 pt-2">Notifications</Label>
              <div className="col-span-3 space-y-2">
                {(['Email', 'SMS', 'Push'] as const).map(method => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`notif-${method}`} 
                      name="notificationMethods" 
                      value={method} 
                      checked={(formData.notificationMethods || []).includes(method)} 
                      onCheckedChange={(checked) => {
                        const currentMethods = formData.notificationMethods || [];
                        if (checked) {
                           setFormData({ ...formData, notificationMethods: [...currentMethods, method] });
                        } else {
                           setFormData({ ...formData, notificationMethods: currentMethods.filter(m => m !== method) });
                        }
                      }}
                    />
                    <Label htmlFor={`notif-${method}`} className="font-normal">{method}</Label>
                  </div>
                ))}
              </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right col-span-1">Active</Label>
               <Switch id="isActive" name="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange('isActive')} className="col-span-3"/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">{editingRule ? "Save Changes" : "Create Rule"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


// Dummy Card component, because it's used in page.tsx but not AccessControlPage
// This is to avoid linting errors, actual Card is imported from ui/card
const Card = ({className, children}: {className?:string, children: React.ReactNode}) => <div className={className}>{children}</div>;
const CardContent = ({className, children}: {className?:string, children: React.ReactNode}) => <div className={className}>{children}</div>;
