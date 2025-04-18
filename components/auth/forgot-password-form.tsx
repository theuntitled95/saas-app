"use client";

import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"},
    });

    if (res.ok) {
      toast.success("If that email exists, a reset link was sent.");
    } else {
      const {error} = await res.json();
      toast.error(error || "Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
      </form>
    </Form>
  );
}
