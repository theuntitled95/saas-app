"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState, useTransition} from "react";
import {toast} from "sonner";

export default function AssignRoleForm() {
  const [userId, setUserId] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await fetch("/api/roles/assign", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({userId, organizationId, roleId}),
      });

      if (res.ok) {
        toast.success("Role assigned successfully.");
        setUserId("");
        setOrganizationId("");
        setRoleId("");
      } else {
        const {error} = await res.json();
        toast.error(error || "Failed to assign role.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <Input
        placeholder="Organization ID"
        value={organizationId}
        onChange={(e) => setOrganizationId(e.target.value)}
      />
      <Input
        placeholder="Role ID"
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Assigning..." : "Assign Role"}
      </Button>
    </form>
  );
}
