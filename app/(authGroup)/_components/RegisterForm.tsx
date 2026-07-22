"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "../_actions/authActions";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  profilePhoto: string;
}

type FieldErrors = Partial<Record<keyof RegisterValues, string>>;

interface ActionResult {
  success: boolean;
  message?: string;
}

const INITIAL_VALUES: RegisterValues = {
  name: "",
  email: "",
  password: "",
  profilePhoto: "",
};

function validateRegister(values: RegisterValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  const photo = values.profilePhoto.trim();
  if (photo) {
    try {
      const url = new URL(photo);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.profilePhoto = "URL must start with http:// or https://";
      }
    } catch {
      errors.profilePhoto = "Enter a valid URL, or leave it empty.";
    }
  }

  return errors;
}

const RegisterForm = () => {
  const [values, setValues] = useState<RegisterValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const submitted: RegisterValues = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        profilePhoto: String(formData.get("profilePhoto") ?? ""),
      };

      const nextErrors = validateRegister(submitted);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        // Block the request and let the inline messages explain why.
        return null;
      }

      // On success, registerAction throws NEXT_REDIRECT and navigates to /login,
      // so only a failed registration ever returns a result we can render here.
      return (await registerAction(null, formData)) as ActionResult;
    },
    null,
  );

  useEffect(() => {
    if (state && !state.success) {
      toast.error(state.message || "Registration failed. Please try again.");
    }
  }, [state]);

  const updateField = (field: keyof RegisterValues) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const serverError = state && !state.success ? state.message : undefined;

  return (
    <form action={formAction} noValidate className="space-y-4">
      <Card className="space-y-4 p-6">
        {serverError && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {serverError}
          </p>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField("name")(event.target.value)}
            disabled={pending}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email")(event.target.value)}
            disabled={pending}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              value={values.password}
              onChange={(event) => updateField("password")(event.target.value)}
              disabled={pending}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-xs text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profilePhoto">Profile Photo URL (optional)</Label>
          <Input
            id="profilePhoto"
            name="profilePhoto"
            type="url"
            placeholder="https://example.com/photo.jpg"
            autoComplete="off"
            value={values.profilePhoto}
            onChange={(event) => updateField("profilePhoto")(event.target.value)}
            disabled={pending}
            aria-invalid={Boolean(errors.profilePhoto)}
            aria-describedby={
              errors.profilePhoto ? "profilePhoto-error" : undefined
            }
          />
          {errors.profilePhoto && (
            <p id="profilePhoto-error" className="text-xs text-destructive">
              {errors.profilePhoto}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Registering..." : "Register"}
        </Button>
      </Card>
    </form>
  );
};

export default RegisterForm;
