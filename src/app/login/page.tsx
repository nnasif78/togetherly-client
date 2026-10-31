
"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "../../lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LoaderCircle, LogIn, Mail, LockKeyhole } from "lucide-react";
import AuthPanel from "@/components/auth-panel";
import GoogleIcon from "@/components/google-icon";
import Breadcrumbs from "@/components/breadcrumbs";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Login failed");
        return;
      }

      toast.success("Logged in successfully!");
      router.push("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    const firstError = Object.values(formErrors).find((error) => error?.message)?.message;
    toast.error(typeof firstError === "string" ? firstError : "Please enter a valid email and password.");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      toast.error("Unable to start Google sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100svh-8rem)] max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-12">
      <div className="lg:col-span-2">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Login" }]} />
      </div>
      <AuthPanel mode="login" />
      <Card className="mx-auto w-full max-w-lg border-border/80 shadow-lg shadow-foreground/5">
        <CardHeader className="space-y-3 px-6 pt-8 sm:px-8">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary"><LogIn aria-hidden="true" className="size-5" /></span>
          <CardTitle className="text-3xl font-semibold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-base">Sign in and pick up where your good work left off.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-8 sm:px-8">
          <form noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="gap-2"><Mail aria-hidden="true" className="size-4 text-primary" />Email address</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} {...register("email")} />
              {errors.email && <p id="login-email-error" className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="gap-2"><LockKeyhole aria-hidden="true" className="size-4 text-primary" />Password</Label>
              <Input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined} {...register("password")} />
              {errors.password && <p id="login-password-error" className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <LogIn aria-hidden="true" />}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="h-11 w-full" onClick={handleGoogleLogin} disabled={loading}>
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New to Togetherly?{" "}
            <Link href="/register" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              Create an account <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
