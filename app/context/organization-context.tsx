"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Organization = {id: string; name: string};

type OrgContextType = {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  setSelectedOrganization: (org: Organization) => void;
  setOrganizations: (orgs: Organization[]) => void;
};

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrganizationProvider({children}: {children: ReactNode}) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  // On mount, fetch orgs and set initial org from localStorage or default
  useEffect(() => {
    fetch("/api/organizations")
      .then((res) => res.json())
      .then((data) => {
        setOrganizations(data);
        const lastOrgId =
          typeof window !== "undefined"
            ? localStorage.getItem("selectedOrgId")
            : null;
        const found =
          data.find((org: Organization) => org.id === lastOrgId) ||
          data[0] ||
          null;
        setSelectedOrganization(found);
      });
  }, []);

  // Persist selected org
  useEffect(() => {
    if (selectedOrganization && typeof window !== "undefined") {
      localStorage.setItem("selectedOrgId", selectedOrganization.id);
    }
  }, [selectedOrganization]);

  return (
    <OrgContext.Provider
      value={{
        organizations,
        selectedOrganization,
        setSelectedOrganization,
        setOrganizations,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export function useOrganization() {
  const ctx = useContext(OrgContext);
  if (!ctx)
    throw new Error("useOrganization must be used within OrganizationProvider");
  return ctx;
}
