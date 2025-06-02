
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
import { Users, PlusCircle, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import type { User, UserRole } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const initialUsers: User[] = [
  { id: "user_001", name: "Alice Wonderland", email: "alice@example.com", role: "Admin", lastLogin: new Date(Date.now() - 3600000 * 2).toISOString(), avatarUrl: "https://placehold.co/100x100/E91E63/FFFFFF.png?text=AW" },
  { id: "user_002", name: "Bob The Builder", email: "bob@example.com", role: "ConstructionSupervisor", lastLogin: new Date().toISOString(), avatarUrl: "https://placehold.co/100x100/FFC107/000000.png?text=BB" },
  { id: "user_003", name: "Carol Danvers", email: "carol@example.com", role: "HotelManager", lastLogin: new Date(Date.now() - 86400000).toISOString(), avatarUrl: "https://placehold.co/100x100/2196F3/FFFFFF.png?text=CD" },
  { id: "user_004", name: "David Copperfield", email: "david@example.com", role: "Technician", lastLogin: new Date(Date.now() - 86400000 * 3).toISOString(), avatarUrl: "https://placehold.co/100x100/4CAF50/FFFFFF.png?text=DC" },
  { id: "user_005", name: "Eve Harrington", email: "eve@example.com", role: "HomeOwner", lastLogin: new Date(Date.now() - 3600000 * 5).toISOString(), avatarUrl: "https://placehold.co/100x100/9C27B0/FFFFFF.png?text=EH" },
];

const userRoles: UserRole[] = [
  'Admin', 'HomeOwner', 'HotelManager', 'OfficeManager', 
  'ConstructionSupervisor', 'Technician', 'Guest'
];

export default function AccessControlPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  const handleOpenForm = (user?: User) => {
    setEditingUser(user || null);
    setFormData(user || { role: "Guest" });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value as UserRole });
  };

  const handleSubmit = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } as User : u));
    } else {
      const newUser: User = {
        id: `user_${String(Date.now()).slice(-5)}`,
        name: formData.name || "New User",
        email: formData.email || "user@example.com",
        role: formData.role || "Guest",
        lastLogin: new Date().toISOString(),
        ...formData,
      };
      setUsers([...users, newUser]);
    }
    handleCloseForm();
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="User Access Control"
        description="Manage user accounts, roles, and permissions across the platform."
        icon={Users}
        actions={
          <Button onClick={() => handleOpenForm()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add User
          </Button>
        }
      />

      <Card className="shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{user.name.split(' ').map(n=>n[0]).join('').toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                  <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenForm(user)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit Role
                        </DropdownMenuItem>
                         <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Remove User
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
            <DialogTitle className="font-headline">{editingUser ? "Edit User Role" : "Add New User"}</DialogTitle>
            <DialogDescription className="font-body">
              {editingUser ? `Modify the role for ${editingUser.name}.` : "Enter the details for the new user account."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} className="col-span-3" disabled={!!editingUser} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} className="col-span-3" disabled={!!editingUser} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map(role => (
                    <SelectItem key={role} value={role}>{role.replace(/([A-Z])/g, ' $1').trim()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">{editingUser ? "Save Changes" : "Add User"}</Button>
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
