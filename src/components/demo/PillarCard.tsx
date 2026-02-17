"use client";

import { Card } from "@/components/ui/Card";

export default function PillarCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl min-h-[260px] flex flex-col">
        {/* Card design — visible through light overlay */}
        <div className="p-8 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                Pillar
              </p>
              <p className="text-xl font-bold text-white mt-1">Cash Card</p>
            </div>
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-white/20" />
              <div className="w-8 h-8 rounded-full bg-white/10 -ml-3" />
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            <p className="font-mono-financial text-xl tracking-[0.2em] text-white/80">
              •••• •••• •••• 4821
            </p>
            <div className="flex justify-between text-xs text-gray-400">
              <span>VALID THRU 12/28</span>
              <span>DEBIT</span>
            </div>
          </div>
        </div>

        {/* Light overlay — card clearly visible beneath */}
        <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-[1.5px] rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-white mb-2">Coming Soon</p>
            <p className="text-sm text-gray-300 max-w-[260px] leading-relaxed">
              Spend your yield anywhere Visa is accepted.
              Instant cashback on every purchase.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
