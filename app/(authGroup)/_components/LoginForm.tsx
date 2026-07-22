"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { loginAction } from "../_actions/authActions";

const LoginForm = () => {
  const [state, action, pending] = useActionState(loginAction, null);
  // const router = useRouter();

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || "Login successful!");
      // router.push("/dashboard");
    } else {
      toast.error(state.message || "An error occurred during login.");
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <Card className="space-y-4 p-6">
        <Input name="email" type="email" placeholder="Email" required />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <Button type="submit" className="w-full">
          {pending ? "Logging in..." : "Login"}
        </Button>
      </Card>
    </form>
  );
};

export default LoginForm;
