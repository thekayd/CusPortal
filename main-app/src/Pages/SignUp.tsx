import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { SignUpForm } from "../components/SignUpForm";
import { LoginForm } from "../components/LoginForm";

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export function SignUpPage() {
  return (
    <Card className="mx-auto w-full max-w-md shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignUpForm />
        <div>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="underline underline-offset-4" to="/login">
              Login
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function LoginPage() {
  return (
    <Card className="mx-auto w-full max-w-md shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>Enter your information to login to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        <div>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link className="underline underline-offset-4" to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
