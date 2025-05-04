"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import PersonalInfoForm from "./components/personal-info-form";
import PreferencesForm from "./components/preferences-form";
import ProfileAvatarCard from "./components/profile-avatar-card";
import SettingsForm from "./components/settings-form";
import {ProfileFormValues, profileFormSchema} from "./profile-form-schema";

export default function ProfilePage() {
  const [defaultValues, setDefaultValues] = useState<
    Partial<ProfileFormValues>
  >({});

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Fetch user info on page load
  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const values: Partial<ProfileFormValues> = {
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "prefer-not-to-say",
            dateOfBirth: data.dateOfBirth || undefined,
            avatarUrl: data.avatarUrl || undefined,
            language: data.language || "en",
            timezone: data.timezone || "Asia/Muscat",
            bio: data.bio || "",
            emailVerified: data.emailVerified || false,
          };
          setDefaultValues(values);
          form.reset(values);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
      });
  }, [form]);

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal information and account preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProfileAvatarCard defaultValues={defaultValues} />

        <div className="flex flex-col gap-6 md:col-span-2">
          <PersonalInfoForm form={form} />
          <PreferencesForm form={form} defaultValues={defaultValues} />
          <SettingsForm email={defaultValues.email} />
        </div>
      </div>
    </div>
  );
}
