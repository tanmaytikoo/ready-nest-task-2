"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    accessCode: "",
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send verification code.");
      }

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid code or registration failed.");
      }

      // Auto-login the user after successful registration
      const signInRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInRes?.error) {
        // Fallback if auto-login fails
        router.push("/login");
      } else {
        // Redirect to root, which middleware will instantly bounce to the correct Dashboard
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.message);
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
          <CardTitle className="text-2xl font-semibold tracking-tight text-gradient">
            {step === 1 ? "Create an account" : "Verify your email"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {step === 1 
              ? "Enter your details below to create your Nova account." 
              : `We sent a 4-digit code to ${formData.email}.`}
          </CardDescription>
        </CardHeader>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              onSubmit={onSendCode} 
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                    {error}
                  </div>
                )}
                
                <div className="flex bg-input/30 p-1 rounded-xl mb-4 border-[0.3px] border-white/10 relative overflow-hidden">
                  {/* Active Background Pill */}
                  <motion.div 
                    className="absolute top-1 bottom-1 w-[calc(33.33%-4px)] bg-primary/20 rounded-lg border-[0.3px] border-primary/30 z-0 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    animate={{ 
                      x: formData.role === "STUDENT" ? "4px" : formData.role === "TEACHER" ? "calc(100% + 4px)" : "calc(200% + 4px)" 
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "STUDENT" })}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors z-10 ${
                      formData.role === "STUDENT" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "TEACHER", accessCode: "" })}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors z-10 ${
                      formData.role === "TEACHER" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "ADMIN", accessCode: "" })}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors z-10 ${
                      formData.role === "ADMIN" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Admin
                  </button>
                </div>

                <AnimatePresence>
                  {(formData.role === "TEACHER" || formData.role === "ADMIN") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="accessCode" className="text-primary">
                        {formData.role === "ADMIN" ? "Master Admin Code" : "Admin Access Code"} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="accessCode"
                        type="password"
                        placeholder={formData.role === "ADMIN" ? "Secret code required for admins" : "Secret code required for teachers"}
                        required={formData.role === "TEACHER" || formData.role === "ADMIN"}
                        className="bg-input/50 border-border/50 focus-visible:ring-primary/50 transition-all"
                        value={formData.accessCode}
                        onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    required
                    className="bg-input/50 border-border/50 focus-visible:ring-primary/50 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="youremail@gmail.com"
                    required
                    className="bg-input/50 border-border/50 focus-visible:ring-primary/50 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="bg-input/50 border-border/50 focus-visible:ring-primary/50 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-4 border-t-0 bg-transparent">
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  Send Verification Code
                </Button>
                <div className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline underline-offset-4">
                    Sign In
                  </Link>
                </div>
              </CardFooter>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form 
              key="step2"
              onSubmit={onVerifyAndRegister} 
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="code">4-Digit Verification Code</Label>
                  <Input
                    id="code"
                    placeholder="0000"
                    maxLength={4}
                    required
                    className="text-center text-2xl tracking-widest bg-input/50 border-border/50 focus-visible:ring-primary/50 transition-all"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-4 border-t-0 bg-transparent">
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all" 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify & Create Account
                </Button>
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-center text-muted-foreground hover:text-primary transition-colors"
                >
                  Back to Details
                </button>
              </CardFooter>
            </motion.form>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
