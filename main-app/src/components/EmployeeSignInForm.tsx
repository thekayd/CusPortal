import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "../lib/AuthContext";
import { LoginEmployee } from "../services/EmployeeRequest";
import { EmployeeResponse } from "../server/employeeController";
import { EmployeeLoginFormSchema } from "../server/validators";

export type EmployeeLoginForm = z.infer<typeof EmployeeLoginFormSchema>;

export function EmployeeSignInForm() {
  const { login } = useAuth();
  const [isAuthed, setIsAuthed] = useState(false);

  const form = useForm<EmployeeLoginForm>({
    resolver: zodResolver(EmployeeLoginFormSchema),
    defaultValues: {
      empID: "",
      password: "",
    },
  });

  function onSubmit(values: EmployeeLoginForm) {
    toast.promise(LoginEmployee(values), {
      loading: "Logging in as Employee, please wait...",
      success: (res: EmployeeResponse) => {
        if (!res.employee?.empID) return "Login failed. Please check your credentials.";
        login(res.employee.empID);
        setIsAuthed(true);
        return "Logged in successfully!";
      },
      error: (error: Error) => `Error: ${error.message}. Please try again.`,
    });
  }

  return (
    <Form {...form}>
      {isAuthed && <Navigate to="/employeedashboard" />}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="empID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID</FormLabel>
              <FormControl>
                <Input placeholder="001" {...field} />
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
