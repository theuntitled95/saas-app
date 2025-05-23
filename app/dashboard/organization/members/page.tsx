"use client";

import {useOrganization} from "@/app/context/organization-context"; // Adjust path as needed
import {
  Check,
  Copy,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
  UserPlus,
} from "lucide-react";
import React, {useEffect, useState} from "react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
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
  DialogTrigger,
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
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {cn} from "@/lib/utils";
import {toast} from "sonner";

// Types from your backend API
type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

type Member = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: "active" | "pending" | "inactive";
  joinedAt: string;
  avatarUrl?: string;
};

export default function OrganizationMembersPage() {
  const {selectedOrganization} = useOrganization();

  // Local state
  const [roles, setRoles] = useState<Role[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Reset dialogs/filters when org changes
  useEffect(() => {
    setRoleFilter(null);
    setStatusFilter(null);
    setIsChangeRoleDialogOpen(false);
    setSelectedMember(null);
    setSelectedRole(null);
    setInviteDialogOpen(false);
    setMembers([]);
    setRoles([]);
  }, [selectedOrganization]);

  // Fetch roles & members for the selected org
  useEffect(() => {
    if (!selectedOrganization) return;
    setIsLoading(true);

    Promise.all([
      fetch("/api/roles")
        .then((res) => res.json())
        .then((data) => setRoles(data))
        .catch(() => setRoles([])),
      fetch(`/api/users?orgId=${selectedOrganization.id}`)
        .then((res) => res.json())
        .then((users) => {
          const mappedMembers: Member[] = users.map((user: any) => {
            const orgRole = user.roles?.find(
              (r: any) => r.organizationId === selectedOrganization.id
            );
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              roleId: orgRole?.roleId ?? "",
              status: "active", // You can adjust if you have this in your DB
              joinedAt: user.createdAt || "", // If you store joined date, else blank
              avatarUrl: user.avatarUrl || "",
            };
          });
          setMembers(mappedMembers);
        })
        .catch(() => setMembers([])),
    ]).finally(() => setIsLoading(false));
  }, [selectedOrganization]);

  // Filtering
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      searchQuery === "" ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoleFilter =
      roleFilter === null || member.roleId === roleFilter;
    const matchesStatusFilter =
      statusFilter === null || member.status === statusFilter;

    return matchesSearch && matchesRoleFilter && matchesStatusFilter;
  });

  // Helpers
  const getMemberRole = (member: Member) => {
    return roles.find((role) => role.id === member.roleId) || null;
  };

  // Handle role change (API call to assign role)
  const handleChangeRole = async () => {
    if (!selectedMember || !selectedRole || !selectedOrganization) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/roles/assign", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId: selectedMember.id,
          organizationId: selectedOrganization.id,
          roleId: selectedRole,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${selectedMember.name}'s role has been updated.`);
      // Optionally, refetch members here to update the UI
      // (best: call setIsLoading(true) before re-fetch)
      fetch(`/api/users?orgId=${selectedOrganization.id}`)
        .then((res) => res.json())
        .then((users) => {
          const mappedMembers: Member[] = users.map((user: any) => {
            const orgRole = user.roles?.find(
              (r: any) => r.organizationId === selectedOrganization.id
            );
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              roleId: orgRole?.roleId ?? "",
              status: "active",
              joinedAt: user.createdAt || "",
              avatarUrl: user.avatarUrl || "",
            };
          });
          setMembers(mappedMembers);
        })
        .catch(() => setMembers([]));
    } catch {
      toast.error("Could not update member role.");
    } finally {
      setIsChangeRoleDialogOpen(false);
      setSelectedMember(null);
      setSelectedRole(null);
      setIsLoading(false);
    }
  };

  const openChangeRoleDialog = (member: Member) => {
    setSelectedMember(member);
    setSelectedRole(member.roleId);
    setIsChangeRoleDialogOpen(true);
  };

  // Invite member logic (likely POST to /api/invite)
  const handleInviteMember = async (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement your API call here
    toast.success(
      "Invitation sent. An invitation email has been sent to the provided email address."
    );
    setInviteDialogOpen(false);
  };

  // Copy invite link
  const copyInviteLink = () => {
    if (!selectedOrganization) return;
    navigator.clipboard.writeText(
      `https://app.example.com/invite/${selectedOrganization.id}?token=abc123`
    );
    toast(
      "Invite link copied. The invite link has been copied to your clipboard."
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[90dvh]">
        {/* <Loader2 className="animate-spin h-10 w-10 text-muted-foreground" /> */}
        <span className="loading loading-infinity loading-xl scale-200 text-blue-500"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Organization Members
        </h2>
        <p className="text-muted-foreground">
          Manage members and their roles within{" "}
          {selectedOrganization?.name ?? "your organization"}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {members.length} {members.length === 1 ? "member" : "members"}{" "}
                in your organization.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog
                open={inviteDialogOpen}
                onOpenChange={setInviteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                      Invite a new member to join {selectedOrganization?.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="email" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="email">Email Invite</TabsTrigger>
                      <TabsTrigger value="link">Invite Link</TabsTrigger>
                    </TabsList>
                    <TabsContent value="email">
                      <form
                        onSubmit={handleInviteMember}
                        className="space-y-4 py-4"
                      >
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="colleague@example.com"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="role">Role</Label>
                          <Select defaultValue="member">
                            <SelectTrigger id="role">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            This will determine what permissions the member has.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">
                            Personal message (optional)
                          </Label>
                          <Input
                            id="message"
                            placeholder="I'd like to invite you to join our organization..."
                          />
                        </div>
                        <DialogFooter className="pt-4">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setInviteDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Send Invitation</Button>
                        </DialogFooter>
                      </form>
                    </TabsContent>
                    <TabsContent value="link">
                      <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                          <Label>Invite Link</Label>
                          <div className="flex gap-2">
                            <Input
                              readOnly
                              value={`https://app.example.com/invite/${selectedOrganization?.id ?? ""}?token=abc123`}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={copyInviteLink}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Anyone with this link can join your organization as
                            a Member.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="link-role">Default Role</Label>
                          <Select defaultValue="member">
                            <SelectTrigger id="link-role">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter className="pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setInviteDialogOpen(false)}
                          >
                            Close
                          </Button>
                        </DialogFooter>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
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
                  {(roleFilter || statusFilter) && (
                    <Badge variant="secondary" className="ml-2">
                      {(roleFilter ? 1 : 0) + (statusFilter ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
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
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  onClick={() => setStatusFilter(null)}
                >
                  All Statuses
                  {statusFilter === null && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                  {statusFilter === "active" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                  {statusFilter === "pending" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => {
                    const memberRole = getMemberRole(member);
                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {member.avatarUrl ? (
                                <AvatarImage
                                  src={member.avatarUrl || "/placeholder.svg"}
                                  alt={member.name}
                                />
                              ) : (
                                <AvatarFallback>
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div>{member.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {memberRole && (
                            <Badge
                              className={cn(
                                memberRole.id === "admin" &&
                                  "bg-red-100 text-red-800 hover:bg-red-100/80",
                                memberRole.id === "member" &&
                                  "bg-green-100 text-green-800 hover:bg-green-100/80",
                                memberRole.id === "viewer" &&
                                  "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
                              )}
                            >
                              {memberRole.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant={
                              member.status === "active"
                                ? "outline"
                                : "secondary"
                            }
                            className={cn(
                              member.status === "pending" &&
                                "bg-amber-100 text-amber-800 hover:bg-amber-100/80"
                            )}
                          >
                            {member.status.charAt(0).toUpperCase() +
                              member.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {member.joinedAt
                            ? new Date(member.joinedAt).toLocaleDateString()
                            : "—"}
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
                                onClick={() => openChangeRoleDialog(member)}
                              >
                                Change Role
                              </DropdownMenuItem>
                              {member.status === "pending" && (
                                <DropdownMenuItem>
                                  Resend Invitation
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                {member.status === "pending"
                                  ? "Cancel Invitation"
                                  : "Remove Member"}
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
        open={isChangeRoleDialogOpen}
        onOpenChange={setIsChangeRoleDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedMember?.name} in{" "}
              {selectedOrganization?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                {selectedMember?.avatarUrl ? (
                  <AvatarImage
                    src={selectedMember.avatarUrl || "/placeholder.svg"}
                    alt={selectedMember.name}
                  />
                ) : (
                  <AvatarFallback>
                    {selectedMember?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">{selectedMember?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedMember?.email}
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
              onClick={() => setIsChangeRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeRole}
              disabled={
                !selectedRole || selectedRole === selectedMember?.roleId
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
