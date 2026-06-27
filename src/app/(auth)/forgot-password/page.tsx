"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="border border-border/50 bg-card text-card-foreground shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-2xl relative overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight text-gradient">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email address and we will send you a password reset link.
          </CardDescription>
        </CardHeader>
        
        {isSuccess ? (
          <CardContent className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 bg-primary/10 rounded-xl border border-primary/20">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <p className="text-sm font-medium">
                If an account exists for {email}, a password reset link has been sent.
              </p>
              <p className="text-xs text-muted-foreground">
                Please check your inbox and spam folder.
              </p>
            </div>
            <div className="pt-4 flex justify-center">
              <Link href="/login" className="text-sm text-primary hover:underline underline-offset-4 font-medium">
                Return to Login
              </Link>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <CardContent className="space-y-4 pt-4">
              {error && (
                <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@gmail.com"
                  required
                  className="bg-input/50 border-border/50 focus-visible:ring-primary/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                Send Reset Link
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </motion.div>
  );
}
