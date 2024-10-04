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
import { createUser, RequestServiceResponse } from "../server/RequestService";
import { Navigate } from "react-router-dom";
import { useState } from "react";

export const SignUpFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email format.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});
export type SignUpForm = z.infer<typeof SignUpFormSchema>;

export function SignUpForm() {
  const [isAuthed, setIsAuthed] = useState(false);
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: "meatboyed",
      email: "charlie@gmail.com",
      password: "12345678",
    },
  });

  function onSubmit(values: SignUpForm) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    toast.promise(createUser(values), {
      loading: "Creating account, please wait 🧑‍🍳...",
      success: (res: RequestServiceResponse) => {
        setIsAuthed(true);
        return "Yay! 🎉 " + res.message;
      },
      error: (res: Error) => {
        return "Oops 🫢" + res.message + ". Please try again.";
      },
    });
  }

  return (
    <Form {...form}>
      {isAuthed && <Navigate to="/login" />}
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
        />{" "}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jacobzuma@gmail.com" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
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
