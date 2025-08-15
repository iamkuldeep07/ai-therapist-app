"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/30">
      <Container className="flex flex-col items-center justify-center w-full">
        <Card className="w-full md:w-5/12 max-w-2xl p-8 md:p-10 rounded-3xl shadow-2xl border border-primary/10 bg-card/90 backdrop-blur-lg mt-12">
          <div className="mb-6 text-center">
            <h1
              className="text-2xl md:text-3xl font-extrabold 
               bg-gradient-to-r 
               from-[hsl(150,30%,60%)] 
               via-[hsl(150,30%,60%)] 
               to-[hsl(250,20%,96%)] 
               bg-clip-text 
               text-transparent 
               mb-1 
               tracking-tight 
               [text-shadow:_0_1px_0_rgb(0_0_0_/_20%)]"
            >
              Sign In
            </h1>
            <p className="text-base text-muted-foreground font-medium">
              Welcome back! Please sign in to continue your journey.
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-semibold mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your Email"
                    className="pl-12 py-2 text-base rounded-xl bg-card bg-opacity-80 border border-[hsl(150,30%,60%)] focus:outline-none focus:ring-2 focus:ring-[hsl(150,30%,60%)] text-white placeholder:text-muted-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <label
              htmlFor="password"
              className="block text-base font-semibold mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-12 py-2 text-base rounded-xl bg-card bg-opacity-80 border border-[hsl(150,30%,60%)] focus:outline-none focus:ring-2 focus:ring-[hsl(150,30%,60%)] text-white placeholder:text-muted-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              className="w-full py-2 text-base rounded-xl font-bold bg-gradient-to-r from-[hsl(150,30%,60%)] to-[hsl(150,30%,60%)]/80 shadow-md hover:from-[hsl(150,30%,60%)]/80 hover:to-[hsl(150,30%,60%)]"
              size="lg"
              type="submit"
              //   disabled={loading}
            >
              Sign In
              {/* {loading ? "Signing in..." : "Sign In"} */}
            </Button>
          </form>
          <div className="my-6 border-t border-[hsl(150,30%,60%)]/10" />
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className='text-[hsl(215,16%,45%)]'>
                Don&apos;t have an account?
              </span>
              <Link
                href="/signup"
                className="text-[hsl(150,30%,60%)] font-semibold underline hover:text-[hsl(150,30%,60%)]/80 transition-colors"
              >
                Sign up
              </Link>
              <span className="text-[hsl(215,16%,45%)]">·</span>
              <Link
                href="/forgot-password"
                className="text-[hsl(150,30%,60%)] underline hover:text-[hsl(150,30%,60%)]/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
