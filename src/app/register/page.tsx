
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
import { ArrowRight, Eye, EyeOff, LoaderCircle, Mail, UserPlus, UserRound, Image as ImageIcon, LockKeyhole } from "lucide-react";
import AuthPanel from "@/components/auth-panel";
import GoogleIcon from "@/components/google-icon";
import Breadcrumbs from "@/components/breadcrumbs";
import PasswordRequirements from "@/components/password-requirements";


const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  photoURL: z.string().trim().min(1, "Photo URL is required").url("Enter a valid photo URL"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain an uppercase letter").regex(/[a-z]/, "Password must contain a lowercase letter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loadingAction, setLoadingAction] = useState<"credentials" | "google" | null>(null);
  const loading = loadingAction !== null;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: RegisterFormData) => {
    setLoadingAction("credentials");

    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.photoURL,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    const firstError = Object.values(formErrors).find((error) => error?.message)?.message;
    toast.error(typeof firstError === "string" ? firstError : "Please correct the highlighted fields.");
  };
  
  const handleGoogleSignUp = async () => {
    setLoadingAction("google");
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      toast.error("Unable to start Google sign up. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100svh-8rem)] max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-12">
      <div className="lg:col-span-2">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Register" }]} />
      </div>
      <AuthPanel mode="register" />
      <Card className="mx-auto w-full max-w-lg border-border/80 shadow-lg shadow-foreground/5">
        <CardHeader className="space-y-3 px-6 pt-8 sm:px-8">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary"><UserPlus aria-hidden="true" className="size-5" /></span>
          <CardTitle className="text-3xl font-semibold tracking-tight">Join Togetherly</CardTitle>
          <CardDescription className="text-base">Create an account and find your place in the community.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-8 sm:px-8">
          <form noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="gap-2"><UserRound aria-hidden="true" className="size-4 text-primary" />Full name</Label>
              <Input id="name" autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "register-name-error" : undefined} {...register("name")} />
              {errors.name && <p id="register-name-error" className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="gap-2"><Mail aria-hidden="true" className="size-4 text-primary" />Email address</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "register-email-error" : undefined} {...register("email")} />
              {errors.email && <p id="register-email-error" className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoURL" className="gap-2"><ImageIcon aria-hidden="true" className="size-4 text-primary" />Profile photo URL</Label>
              <Input id="photoURL" type="url" autoComplete="url" placeholder="Paste a profile photo link" aria-invalid={Boolean(errors.photoURL)} aria-describedby={errors.photoURL ? "register-photo-error" : undefined} {...register("photoURL")} />
              {errors.photoURL && <p id="register-photo-error" className="text-sm text-destructive">{errors.photoURL.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="gap-2"><LockKeyhole aria-hidden="true" className="size-4 text-primary" />Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a password" className="pr-10" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "register-password-error register-password-requirements" : "register-password-requirements"} {...register("password", { onChange: (event) => setPassword(event.target.value) })} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-9 w-9 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>
                    {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  </Button>
                </div>
                {errors.password && <p id="register-password-error" className="text-sm text-destructive">{errors.password.message}</p>}
                <div id="register-password-requirements">
                  <PasswordRequirements password={password} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Repeat password" className="pr-10" aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined} {...register("confirmPassword")} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-9 w-9 text-muted-foreground" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} aria-pressed={showConfirmPassword} onClick={() => setShowConfirmPassword((visible) => !visible)}>
                    {showConfirmPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p id="register-confirm-error" className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loadingAction === "credentials" ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <UserPlus aria-hidden="true" />}
              {loadingAction === "credentials" ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="h-11 w-full" onClick={handleGoogleSignUp} disabled={loading}>
            {loadingAction === "google" ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <GoogleIcon />}
            {loadingAction === "google" ? "Connecting to Google..." : "Continue with Google"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already part of Togetherly?{" "}
            <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              Sign in <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
