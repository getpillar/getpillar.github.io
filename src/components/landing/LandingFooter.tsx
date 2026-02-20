"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingFooter() {
  return (
    <section className="py-20 text-center">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-navy">
          See it for yourself
        </h2>
        <p className="mt-3 text-gray-500">
          Explore a live demo with $50K earning yield in real-time.
          Adjust the Yield Boost dial, watch daily earnings tick up,
          and see exactly where your money goes. No sign-up required.
        </p>
        <Link
          href="/demo"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-navy text-white text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-navy-light transition-colors"
        >
          Try the Live Demo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-20 border-t border-border pt-8">
        <p className="text-xs text-gray-400 tracking-wide">
          Pillar &middot; Your cash deserves better than a bank.
        </p>
        <p className="text-xs text-gray-300 mt-2">
          Past performance does not guarantee future results. This is a product
          demo, not investment advice.
        </p>
      </div>
    </section>
  );
}
