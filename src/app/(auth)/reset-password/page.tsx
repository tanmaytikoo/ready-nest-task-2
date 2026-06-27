"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <CardContent className="space-y-4 pt-4">
        <div className="p-4 text-center rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-sm">
          Invalid or missing reset token. Please request a new password reset link.
        </div>
        <div className="pt-4 flex justify-center">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline underline-offset-4 font-medium">
            Request new link
          </Link>
        </div>
      </CardContent>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Something went wrong");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 bg-primary/10 rounded-xl border border-primary/20">
          <CheckCircle2 className="w-10 h-10 text-primary" />
          <p className="text-sm font-medium">
            Password updated successfully!
          </p>
          <p className="text-xs text-muted-foreground">
            You will be redirected to the login page momentarily...
          </p>
        </div>
        <div className="pt-4 flex justify-center">
          <Link href="/login" className="text-sm text-primary hover:underline underline-offset-4 font-medium">
            Go to Login
          </Link>
        </div>
      </CardContent>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <CardContent className="space-y-4 pt-4">
        {error && (
          <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            required
            className="bg-input/50 border-border/50 focus-visible:ring-primary/50 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            className="bg-input/50 border-border/50 focus-visible:ring-primary/50 transition-all"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-2 border-t-0 bg-transparent">
        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all" 
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Password
        </Button>
      </CardFooter>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="border border-border/50 bg-card text-card-foreground shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-2xl relative overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight text-gradient">Set New Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <Suspense fallback={<div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </motion.div>
  );
}
