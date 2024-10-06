"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { loginUser, RequestServiceResponse } from "../lib/RequestService";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../lib/AuthContext";

// Form Schema for typesafety and react-hook-form form validation and state management
export const LoginFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});
export type LoginForm = z.infer<typeof LoginFormSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [isAuthed, setIsAuthed] = useState(false);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: LoginForm) {
    toast.promise(loginUser(values), {
      // Executing the loginUser function in RequestService
      loading: "Logging in, please wait 🧑‍🍳...",
      success: (res: RequestServiceResponse) => {
        if (!res.username) return "oops something went wrong. Please try again.";
        login(res.username);
        setIsAuthed(true);
        return "Yay! 🎉 " + res.message;
      },
      error: (res: Error) => {
        return "Oops 🫢" + res.message + "\nPlease try again.";
      },
    });
  }

  return (
    <Form {...form}>
      {isAuthed && <Navigate to="/dashboard" />}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Jacob Zuma" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
