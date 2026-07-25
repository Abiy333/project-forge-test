import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, BarChart3, Sparkles } from "lucide-react";

export default function SaaSLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-lime-400 selection:text-zinc-950">
      
      {/* 1. Neon Top Bar */}
      <div className="bg-gradient-to-r from-lime-500 via-emerald-400 to-cyan-400 text-zinc-950 text-xs font-black py-2 px-4 text-center tracking-wider uppercase shadow-[0_0_20px_rgba(34,197,94,0.3)]">
        ⚡ LAUNCH YOUR MULTI-TENANT STOREFRONT IN UNDER 2 MINUTES • POWERED BY PAYSTACK
      </div>

      {/* 2. Header Navigation */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5 font-black text-xl tracking-tight">
            <div className="h-9 w-9 rounded-xl bg-lime-400 text-zinc-950 flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(163,230,53,0.6)]">
              F
            </div>
            <span className="bg-gradient-to-r from-white via-zinc-100 to-lime-400 bg-clip-text text-transparent">
              FORGE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-300 hover:text-lime-400 hover:bg-zinc-900 font-medium text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black shadow-[0_0_25px_rgba(163,230,53,0.5)] transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8 my-auto relative">
        
        {/* Electric Radial Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-500/15 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Neon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime-400/40 bg-lime-950/30 text-xs text-lime-400 font-bold shadow-[0_0_15px_rgba(163,230,53,0.2)]">
          <Zap className="w-4 h-4 text-lime-400 fill-lime-400" />
          <span>Launch your multi-tenant storefront in under 2 minutes</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white leading-tight">
          Sell anything online with <br />
          your own <span className="bg-gradient-to-r from-lime-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent underline decoration-lime-400/50 underline-offset-8">custom store.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
          Manage inventory, track revenue analytics, accept seamless payments with Paystack, and deliver automated order receipts to buyers instantly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black px-8 h-12 text-base shadow-[0_0_30px_rgba(163,230,53,0.5)] transition-all group">
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full border-purple-500/50 bg-purple-950/20 text-purple-300 hover:bg-purple-900/40 hover:border-purple-400 h-12 text-base font-bold shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              Merchant Dashboard
            </Button>
          </Link>
        </div>

        {/* 4. Electric Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left">
          
          {/* Neon Green Card */}
          <div className="p-6 rounded-2xl border border-lime-400/30 bg-zinc-900/60 backdrop-blur-sm space-y-3 hover:border-lime-400 hover:shadow-[0_0_25px_rgba(163,230,53,0.2)] transition-all group">
            <div className="p-3 w-fit rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/30 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-lime-400">Dedicated Subdomains</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every merchant receives their own isolated product catalog at <code className="text-lime-300 bg-lime-950/60 px-1.5 py-0.5 rounded border border-lime-400/30">store.yourdomain.com</code>.
            </p>
          </div>

          {/* Electric Cyan Card */}
          <div className="p-6 rounded-2xl border border-cyan-400/30 bg-zinc-900/60 backdrop-blur-sm space-y-3 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all group">
            <div className="p-3 w-fit rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-cyan-400">Paystack Direct Billing</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Accept credit cards, bank transfers, and mobile money securely with automated webhook handling.
            </p>
          </div>

          {/* Electric Purple Card */}
          <div className="p-6 rounded-2xl border border-purple-500/30 bg-zinc-900/60 backdrop-blur-sm space-y-3 hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all group">
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-purple-400">Real-Time Analytics</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Track incoming revenue, customer purchases, and inventory levels in one dynamic overview.
            </p>
          </div>

        </div>
      </main>

      {/* 5. Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Storefront SaaS Platform. Powered by Neon Energy.</p>
      </footer>
    </div>
  );
}