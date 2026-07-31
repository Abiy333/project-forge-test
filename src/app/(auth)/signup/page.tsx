import { signup } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Store, Mail, Lock, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-950 to-emerald-950/40 px-4 py-12 relative overflow-hidden selection:bg-lime-400 selection:text-zinc-950">
      
      {/* 1. Electric Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-500/15 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[320px] h-[320px] bg-cyan-500/15 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* 2. Glassmorphic Card */}
      <Card className="w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-lime-400/30 bg-zinc-900/80 backdrop-blur-xl rounded-2xl relative z-10 overflow-hidden">
        
        {/* Neon Accent Top Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 shadow-[0_0_15px_rgba(163,230,53,0.8)]" />

        <CardHeader className="space-y-2 pt-8 text-center">
          
          {/* Logo / Sparkle Badge */}
          <div className="mx-auto h-12 w-12 rounded-xl bg-lime-400 text-zinc-950 flex items-center justify-center font-black text-2xl shadow-[0_0_25px_rgba(163,230,53,0.6)] mb-2">
            <Sparkles className="w-6 h-6 text-zinc-950 fill-zinc-950" />
          </div>

          <CardTitle className="text-2xl font-black tracking-tight text-white">
            Register Store
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Launch your multi-tenant e-commerce branch in seconds
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          
          <form action={signup} className="space-y-4">
            
            {/* Error Message Alert */}
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-300 text-sm rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{decodeURIComponent(error)}</span>
              </div>
            )}

            {/* Store Name Field */}
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-zinc-300 font-semibold text-xs uppercase tracking-wider">
                Store Name
              </Label>
              <div className="relative">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="storeName"
                  name="storeName"
                  type="text"
                  placeholder="e.g. Alaba Electronics"
                  required
                  className="pl-10 border-zinc-800 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-lime-400 focus-visible:ring-lime-400/20 rounded-xl h-11"
                />
              </div>
            </div>

            {/* Admin Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 font-semibold text-xs uppercase tracking-wider">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@my-store.com"
                  required
                  className="pl-10 border-zinc-800 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-lime-400 focus-visible:ring-lime-400/20 rounded-xl h-11"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300 font-semibold text-xs uppercase tracking-wider">
                Secure Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 border-zinc-800 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-lime-400 focus-visible:ring-lime-400/20 rounded-xl h-11"
                />
              </div>
            </div>

            {/* Deploy Button */}
            <Button
              type="submit"
              className="w-full bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black h-11 rounded-xl shadow-[0_0_25px_rgba(163,230,53,0.4)] transition-all group mt-2"
            >
              <span>Deploy Brand</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-sm border-t border-zinc-800/80">
            <span className="text-zinc-500">Already registered? </span>
            <Link
              href="/login"
              className="font-bold text-lime-400 hover:text-lime-300 underline decoration-lime-400/40 underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </div>

        </CardContent>
      </Card>
      
    </div>
  );
}