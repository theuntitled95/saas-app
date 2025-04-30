"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {ChevronsUpDown, Loader2} from "lucide-react";

const languages = [
  {label: "English", value: "en"},
  {label: "French", value: "fr"},
  {label: "German", value: "de"},
  {label: "Spanish", value: "es"},
  {label: "Portuguese", value: "pt"},
  {label: "Russian", value: "ru"},
  {label: "Japanese", value: "ja"},
  {label: "Korean", value: "ko"},
  {label: "Chinese", value: "zh"},
];

const timezones = [
  {label: "Pacific Standard Time (PST)", value: "America/Los_Angeles"},
  {label: "Eastern Standard Time (EST)", value: "America/New_York"},
  {label: "Greenwich Mean Time (GMT)", value: "Europe/London"},
  {label: "Japan Standard Time (JST)", value: "Asia/Tokyo"},
  {label: "Arabian Standard Time (AST)", value: "Asia/Muscat"},
];

const PreferencesSchema = z.object({
  language: z.string().min(1, "Please select a language."),
  timezone: z.string().min(1, "Please select a timezone."),
});

type PreferencesFormValues = z.infer<typeof PreferencesSchema>;

export default function PreferencesForm() {
  const [isPending, startTransition] = useTransition();
  const [defaultValues, setDefaultValues] = useState<PreferencesFormValues>({
    language: "en",
    timezone: "Asia/Muscat",
  });

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(PreferencesSchema),
    defaultValues,
  });

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const values = {
            language: data.language || "en",
            timezone: data.timezone || "Asia/Muscat",
          };
          setDefaultValues(values);
          form.reset(values);
        }
      });
  }, [form]);

  const onSubmit = (values: PreferencesFormValues) => {
    startTransition(async () => {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success("Preferences updated.");
      } else {
        toast.error("Failed to update preferences.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your account preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="language"
              render={({field}) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Language</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {languages.find((lang) => lang.value === field.value)
                            ?.label || "Select language"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {languages.map((lang) => (
                            <CommandItem
                              key={lang.value}
                              value={lang.label}
                              onSelect={() =>
                                form.setValue("language", lang.value)
                              }
                            >
                              {lang.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({field}) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Timezone</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {timezones.find((tz) => tz.value === field.value)
                            ?.label || "Select timezone"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search timezone..." />
                        <CommandEmpty>No timezone found.</CommandEmpty>
                        <CommandGroup>
                          {timezones.map((tz) => (
                            <CommandItem
                              key={tz.value}
                              value={tz.label}
                              onSelect={() =>
                                form.setValue("timezone", tz.value)
                              }
                            >
                              {tz.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            {/* <div className="flex justify-end gap-2"> */}
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
            {/* </div> */}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
