"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Building2, Mail, MapPin, Hash } from "lucide-react";

export default function OnboardInfrastructurePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [infraType, setInfraType] = useState("EV Fleet");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would normally send the data to a backend or email service
    // For now, we simulate a successful submission
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full rounded-3xl p-10 text-center shadow-xl shadow-black/5 border border-zinc-100">
          <div className="w-20 h-20 bg-[#F5FFF9] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-[#14B8A6]" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-3">You're on the waitlist!</h1>
          <p className="text-zinc-500 mb-8 leading-relaxed">
            Thank you for your interest in onboarding your infrastructure to Nemesis Protocol. Our team will review your details and contact you via email shortly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#111827] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-colors hover:bg-black w-full"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar minimal */}
      <nav className="w-full px-6 py-6 md:px-12 flex items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium text-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 mt-4 md:mt-10">
        <div className="mb-10">
          <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-medium tracking-tight text-[#09111F] mb-4">
            Onboard Infrastructure
          </h1>
          <p className="text-zinc-500 text-lg">
            Join the Nemesis DePIN ecosystem. Tell us about your productive EV assets to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-black/5 border border-zinc-100 space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-2">Company / Operator Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Building2 size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAF8] border border-zinc-200 rounded-xl text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all"
                  placeholder="e.g. Volt Logistics"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAF8] border border-zinc-200 rounded-xl text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all"
                  placeholder="you@company.com"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-2">Infrastructure Type</label>
              <select 
                value={infraType}
                onChange={(e) => setInfraType(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#F8FAF8] border border-zinc-200 rounded-xl text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em' }}
              >
                <option value="EV Fleet">EV Fleet</option>
                <option value="Charging Station">Charging Station</option>
                <option value="Battery Swap Station">Battery Swap Station</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {infraType === "EV Fleet" && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-bold text-zinc-900 mb-2">Fleet Category</label>
                <select 
                  required
                  defaultValue=""
                  className="w-full px-4 py-3.5 bg-[#F8FAF8] border border-zinc-200 rounded-xl text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em' }}
                >
                  <option value="" disabled>Select category...</option>
                  <option value="Logistics">Logistics / Delivery</option>
                  <option value="Ride-Hailing">Ride-Hailing / Ojol</option>
                  <option value="Rental">Rental / Leasing</option>
                  <option value="Public Transit">Public Transit</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-zinc-900 mb-2">Estimated Asset Count</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                    <Hash size={18} />
                  </div>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAF8] border border-zinc-200 rounded-xl text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-900 mb-2">Operational City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                    <MapPin size={18} />
                  </div>
                  <input 
                    type="text" 
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAF8] border border-zinc-200 rounded-xl text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all"
                    placeholder="e.g. Jakarta"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#14B8A6] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#14B8A6]/20 transition-all hover:bg-[#0F766E] hover:shadow-xl hover:shadow-[#14B8A6]/30 active:scale-[0.98]"
            >
              Submit Application <ChevronRight size={18} />
            </button>
            <p className="text-center text-xs text-zinc-400 mt-4 font-medium">
              By submitting this form, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
