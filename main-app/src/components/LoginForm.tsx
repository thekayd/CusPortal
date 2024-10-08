import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { loginUser, RequestServiceResponse } from "../lib/RequestService";
import { useAuth } from "../lib/AuthContext";

const LoginFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  accountNumber: z.string().regex(/^\d{10}$/, { message: "Account number must be 10 digits." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export type LoginForm = z.infer<typeof LoginFormSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [isAuthed, setIsAuthed] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      accountNumber: "",
      password: "",
    },
  });

  function onSubmit(values: LoginForm) {
    toast.promise(loginUser(values), {
      loading: "Logging in, please wait...",
      success: (res: RequestServiceResponse) => {
        if (!res.username) return "Something went wrong. Please try again.";
        login(res.username);
        setIsAuthed(true);
        return "Logged in successfully!";
      },
      error: (res: Error) => {
        return "Login failed. Please try again.";
      },
    });
  }

  return (
    <Form {...form}>
      {isAuthed && <Navigate to={`/?username=${form.getValues("username")}`} />}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
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
          Login
        </Button>
      </form>
    </Form>
  );
}