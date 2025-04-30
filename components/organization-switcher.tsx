"use client";

import {Check, ChevronsUpDown, Plus} from "lucide-react";
import * as React from "react";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";

type Organization = {
  id: string;
  name: string;
};

const organizations: Organization[] = [
  {
    id: "1",
    name: "Acme Inc",
  },
  {
    id: "2",
    name: "Monsters Inc",
  },
  {
    id: "3",
    name: "Stark Industries",
  },
  {
    id: "4",
    name: "Wayne Enterprises",
  },
  {
    id: "5",
    name: "Cyberdyne Systems",
  },
];

export function OrganizationSwitcher() {
  const [open, setOpen] = React.useState(false);
  const [showNewOrgDialog, setShowNewOrgDialog] = React.useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    React.useState<Organization>(organizations[0]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select an organization"
            className="w-full justify-between border-none shadow-none hover:bg-sidebar-accent cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {selectedOrganization.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{selectedOrganization.name}</span>
            </div>
            <ChevronsUpDown
              className={cn(
                "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search organization..." />
            <CommandList>
              <CommandEmpty>No organization found.</CommandEmpty>
              <CommandGroup heading="Organizations">
                {organizations.map((org) => (
                  <CommandItem
                    key={org.id}
                    onSelect={() => {
                      setSelectedOrganization(org);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{org.name}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedOrganization.id === org.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setShowNewOrgDialog(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Organization
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={showNewOrgDialog} onOpenChange={setShowNewOrgDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              Add a new organization to manage products and customers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewOrgDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowNewOrgDialog(false)}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
