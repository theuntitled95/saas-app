"use client";

import {
  Check,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
} from "lucide-react";
import {useEffect, useState} from "react";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {toast} from "sonner";

// Define types
type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

type Organization = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
};

type UserRole = {
  organizationId: string;
  roleId: string;
};

export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const [isAssignRoleDialogOpen, setIsAssignRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Fetch organizations
  useEffect(() => {
    fetch("/api/organizations")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setOrganizations(data);
        if (data.length > 0) setSelectedOrg(data[0].id);
      })
      .catch(() => {
        toast.error("Failed to load organizations.");
      });
  }, []);

  // Fetch roles
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch("/api/roles");
        if (!res.ok) throw new Error("Failed to fetch roles");
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      } finally {
        setIsLoadingRoles(false);
      }
    }

    fetchRoles();
  }, []);

  // Fetch users for selected organization
  useEffect(() => {
    if (!selectedOrg) return;

    setIsLoadingUsers(true);

    fetch(`/api/users?orgId=${selectedOrg}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUsers(data))
      .catch(() => {
        toast.error("Failed to load users for selected organization.");
      })
      .finally(() => {
        setIsLoadingUsers(false);
      });
  }, [selectedOrg]);

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoleFilter =
      roleFilter === null ||
      user.roles.some(
        (role) =>
          role.organizationId === selectedOrg && role.roleId === roleFilter
      );

    return matchesSearch && matchesRoleFilter;
  });

  // Get user's role in the selected organization
  const getUserRole = (user: User, orgId: string) => {
    const userRole = user.roles.find((role) => role.organizationId === orgId);
    if (!userRole) return null;
    return roles.find((role) => role.id === userRole.roleId) || null;
  };

  // Handle role assignment
  const handleAssignRole = () => {
    if (!selectedUser || !selectedRole) return;

    // In a real app, this would be an API call
    // For now, we'll just update our local state
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        // Remove any existing role for this org
        const filteredRoles = user.roles.filter(
          (role) => role.organizationId !== selectedOrg
        );

        // Add the new role
        return {
          ...user,
          roles: [
            ...filteredRoles,
            {organizationId: selectedOrg, roleId: selectedRole},
          ],
        };
      }
      return user;
    });

    // In a real app, we would update the state after the API call succeeds
    // users = updatedUsers

    toast.success(
      `${selectedUser.name} has been assigned the role of ${roles.find((r) => r.id === selectedRole)?.name} in ${organizations.find((o) => o.id === selectedOrg)?.name}.`
    );

    setIsAssignRoleDialogOpen(false);
    setSelectedUser(null);
    setSelectedRole(null);
  };

  // Open the assign role dialog for a specific user
  const openAssignRoleDialog = (user: User) => {
    setSelectedUser(user);
    const currentRole = getUserRole(user, selectedOrg);
    setSelectedRole(currentRole?.id || null);
    setIsAssignRoleDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 ">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">User Roles</h2>
        <p className="text-muted-foreground">
          Manage user roles and permissions within your organizations.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Assign roles to users in your organizations.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedOrg || ""} onValueChange={setSelectedOrg}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  {roleFilter && (
                    <Badge variant="secondary" className="ml-2">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  onClick={() => setRoleFilter(null)}
                >
                  All Roles
                  {roleFilter === null && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role.id}
                    className="flex items-center justify-between"
                    onClick={() => setRoleFilter(role.id)}
                  >
                    {role.name}
                    {roleFilter === role.id && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Permissions
                  </TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const userRole = getUserRole(user, selectedOrg);
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{user.name}</div>
                              <div className="text-xs text-muted-foreground md:hidden">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {userRole ? (
                            <Badge
                              className={cn(
                                userRole.id === "admin" &&
                                  "bg-red-100 text-red-800 hover:bg-red-100/80",
                                userRole.id === "manager" &&
                                  "bg-amber-100 text-amber-800 hover:bg-amber-100/80",
                                userRole.id === "editor" &&
                                  "bg-green-100 text-green-800 hover:bg-green-100/80",
                                userRole.id === "viewer" &&
                                  "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
                              )}
                            >
                              {userRole.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No role
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.email}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {userRole ? (
                            <div className="flex flex-wrap gap-1">
                              {userRole.permissions
                                .slice(0, 2)
                                .map((permission) => (
                                  <Badge
                                    key={permission}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {permission}
                                  </Badge>
                                ))}
                              {userRole.permissions.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{userRole.permissions.length - 2} more
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No permissions
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openAssignRoleDialog(user)}
                              >
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem>View User</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Remove from Organization
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isAssignRoleDialogOpen}
        onOpenChange={setIsAssignRoleDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to {selectedUser?.name} in{" "}
              {organizations.find((o) => o.id === selectedOrg)?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {selectedUser?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedUser?.email}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole || ""}
                onValueChange={setSelectedRole}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Role</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRole && (
              <div className="rounded-md border p-4">
                <div className="font-medium mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Role Details
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {roles.find((r) => r.id === selectedRole)?.description}
                </p>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Permissions:</div>
                  <div className="flex flex-wrap gap-1">
                    {roles
                      .find((r) => r.id === selectedRole)
                      ?.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="secondary"
                          className="text-xs"
                        >
                          {permission}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={!selectedRole}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
