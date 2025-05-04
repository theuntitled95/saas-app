import {Metadata} from "next";
import AssignRoleForm from "./components/AssignRoleForm";

// create page title
export const metadata: Metadata = {
  title: "Assign Role",
  description: "Page for assigning roles to users",
};

export default function RolesPage() {
  return (
    <div className="p-6 space-y-6">
      <AssignRoleForm />
    </div>
  );
}
