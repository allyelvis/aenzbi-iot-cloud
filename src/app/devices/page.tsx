
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
import { HardDrive, PlusCircle, MoreHorizontal, Edit2, Trash2, Settings2 } from "lucide-react";
import type { Device } from "@/lib/types";
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const initialDevices: Device[] = [
  { id: "dev_001", name: "Living Room Thermostat", type: "Home", status: "Online", lastPing: new Date().toISOString(), ipAddress: "192.168.1.10", firmwareVersion: "1.2.3" },
  { id: "dev_002", name: "Hotel Room 301 Lock", type: "Hotel", status: "Online", lastPing: new Date().toISOString(), ipAddress: "10.0.5.12", firmwareVersion: "2.0.1" },
  { id: "dev_003", name: "Office Main AC Unit", type: "Office", status: "Offline", lastPing: new Date(Date.now() - 3600000).toISOString(), ipAddress: "172.16.0.50", firmwareVersion: "3.1.0" },
  { id: "dev_004", name: "Excavator GPS Tracker", type: "Construction", status: "Error", lastPing: new Date(Date.now() - 7200000).toISOString(), location: "Site A", firmwareVersion: "1.0.5" },
  { id: "dev_005", name: "Conference Room Light", type: "Office", status: "Updating", lastPing: new Date().toISOString(), ipAddress: "172.16.0.55", firmwareVersion: "3.1.1" },
];

const statusVariantMap: Record<Device['status'], "default" | "secondary" | "destructive" | "outline"> = {
  Online: "default", // default is primary, which is blue. Green would be better. Let's use outline with custom color.
  Offline: "secondary",
  Error: "destructive",
  Updating: "outline",
};

const statusColorMap: Record<Device['status'], string> = {
  Online: "bg-green-500 hover:bg-green-600",
  Offline: "bg-gray-500 hover:bg-gray-600",
  Error: "bg-red-500 hover:bg-red-600",
  Updating: "bg-yellow-500 hover:bg-yellow-600",
};


export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<Partial<Device>>({});

  const handleOpenForm = (device?: Device) => {
    setEditingDevice(device || null);
    setFormData(device || { type: "Home", status: "Online" });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDevice(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: keyof Device) => (value: string) => {
     setFormData({ ...formData, [name]: value as Device['type'] | Device['status'] });
  };

  const handleSubmit = () => {
    if (editingDevice) {
      setDevices(devices.map(d => d.id === editingDevice.id ? { ...d, ...formData } as Device : d));
    } else {
      const newDevice: Device = {
        id: `dev_${String(Date.now()).slice(-5)}`,
        name: formData.name || "Unnamed Device",
        type: formData.type || "Home",
        status: formData.status || "Online",
        lastPing: new Date().toISOString(),
        ...formData,
      };
      setDevices([...devices, newDevice]);
    }
    handleCloseForm();
  };
  
  const handleDeleteDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Device Management"
        description="View, configure, and manage all your IoT devices."
        icon={HardDrive}
        actions={
          <Button onClick={() => handleOpenForm()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Device
          </Button>
        }
      />

      <Card className="shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Ping</TableHead>
                <TableHead>IP Address / Location</TableHead>
                <TableHead>Firmware</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColorMap[device.status]} text-white`}>
                      {device.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(device.lastPing).toLocaleString()}</TableCell>
                  <TableCell>{device.ipAddress || device.location || 'N/A'}</TableCell>
                  <TableCell>{device.firmwareVersion || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenForm(device)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings2 className="mr-2 h-4 w-4" /> Configure
                        </DropdownMenuItem>
                         <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDevice(device.id)}>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingDevice ? "Edit Device" : "Add New Device"}</DialogTitle>
            <DialogDescription className="font-body">
              {editingDevice ? "Update the details of your existing device." : "Fill in the details for the new IoT device."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select name="type" value={formData.type} onValueChange={handleSelectChange('type')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ipAddress" className="text-right">IP / Location</Label>
              <Input id="ipAddress" name="ipAddress" value={formData.ipAddress || formData.location || ""} onChange={handleChange} className="col-span-3" placeholder="e.g. 192.168.1.15 or Site B" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firmwareVersion" className="text-right">Firmware</Label>
              <Input id="firmwareVersion" name="firmwareVersion" value={formData.firmwareVersion || ""} onChange={handleChange} className="col-span-3" placeholder="e.g. 1.0.0" />
            </div>
            {!editingDevice && (
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Initial Status</Label>
                <Select name="status" value={formData.status} onValueChange={handleSelectChange('status')}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">{editingDevice ? "Save Changes" : "Add Device"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Dummy Card component, because it's used in page.tsx but not DevicesPage
// This is to avoid linting errors, actual Card is imported from ui/card
const Card = ({className, children}: {className?:string, children: React.ReactNode}) => <div className={className}>{children}</div>;
const CardContent = ({className, children}: {className?:string, children: React.ReactNode}) => <div className={className}>{children}</div>;
