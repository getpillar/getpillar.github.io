"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CURRENT_APY, BASE_APY } from "@/data/mockData";
import { formatPercent } from "@/lib/utils";
import { PillarLogo } from "@/components/ui/Logo";

const NATIONAL_AVG = 0.39;
const MAX_APY = Math.ceil(CURRENT_APY + 1);

interface Competitor {
  name: string;
  apy: number;
  highlight: boolean;
  subtitle: string | null;
  initial: string;
  logoUrl: string | null;
}

const competitors: Competitor[] = [
  {
    name: "Pillar",
    apy: CURRENT_APY,
    highlight: true,
    subtitle: "Yield Boost 2x",
    initial: "",
    logoUrl: null,
  },
  {
    name: "Marcus",
    apy: 3.65,
    highlight: false,
    subtitle: null,
    initial: "M",
    logoUrl:
      "https://play-lh.googleusercontent.com/ToLoo2jiP5JOGMTc72SMvR5TpehiQULpaimInD_qYD425xQgdef9J7L1yDWIZmGDkMw=s64-rw",
  },
  {
    name: "Wealthfront",
    apy: 3.3,
    highlight: false,
    subtitle: null,
    initial: "W",
    logoUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/b0/63/ad/b063ad0c-b745-eb85-0377-680e4d11d182/Wealthfront_Icon-0-0-1x_U007ephone-0-1-0-sRGB-85-220.png/128x128bb.jpg",
  },
  {
    name: "Ally",
    apy: 3.3,
    highlight: false,
    subtitle: null,
    initial: "A",
    logoUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/52/e3/1f/52e31ff8-5a7c-7abc-c302-890b518b454f/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/128x128bb.jpg",
  },
  {
    name: "National Avg",
    apy: NATIONAL_AVG,
    highlight: false,
    subtitle: "FDIC savings avg",
    initial: "US",
    logoUrl: null,
  },
];

const advantage = CURRENT_APY - NATIONAL_AVG;
const annualExtra = Math.round(advantage * 500);

function CompetitorLogo({
  comp,
}: {
  comp: Competitor;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (comp.name === "Pillar") {
    return <PillarLogo size={32} />;
  }

  if (comp.logoUrl && !imgFailed) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0 flex items-center justify-center">
        <img
          src={comp.logoUrl}
          alt={comp.name}
          width={22}
          height={22}
          className="w-[22px] h-[22px] rounded-full object-cover grayscale opacity-50"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <span
        className="font-bold text-gray-400"
        style={{ fontSize: comp.initial.length > 1 ? 9 : 12 }}
      >
        {comp.initial}
      </span>
    </div>
  );
}

export default function YieldComparison() {
  return (
    <section className="py-20">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-serif text-navy">
          Stop leaving money on the table
        </h2>
        <p className="mt-3 text-gray-500 max-w-lg mx-auto">
          On a $50K balance, Pillar earns you{" "}
          <span className="font-semibold text-forest font-mono-financial">
            ${annualExtra.toLocaleString()}/year
          </span>{" "}
          more than the national average. Base yield{" "}
          {formatPercent(BASE_APY)}, boosted with automated leverage.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mt-10 space-y-3">
        {competitors.map((comp, i) => {
          const barPct = Math.max((comp.apy / MAX_APY) * 100, 1.5);
          const annual = Math.round((comp.apy / 100) * 50000);

          return (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              {/* Logo */}
              <div className="w-8 shrink-0">
                <CompetitorLogo comp={comp} />
              </div>

              {/* Name */}
              <div className="w-28 text-right shrink-0">
                <span
                  className={
                    comp.highlight
                      ? "text-sm font-bold text-navy"
                      : "text-sm text-gray-400"
                  }
                >
                  {comp.name}
                </span>
                {comp.subtitle && (
                  <p
                    className={`text-[10px] font-medium ${
                      comp.highlight ? "text-forest" : "text-gray-300"
                    }`}
                  >
                    {comp.subtitle}
                  </p>
                )}
              </div>

              {/* Bar */}
              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${barPct}%` }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.08 + 0.2,
                    duration: 0.6,
                    ease: "easeOut" as const,
                  }}
                  className={`h-full rounded-full ${
                    comp.highlight ? "bg-forest" : "bg-gray-200"
                  }`}
                />
              </div>

              {/* Fixed APY column */}
              <span
                className={`w-14 text-right text-xs font-bold font-mono-financial shrink-0 ${
                  comp.highlight ? "text-forest" : "text-gray-400"
                }`}
              >
                {formatPercent(comp.apy)}
              </span>

              {/* Annual earnings */}
              <span
                className={`hidden sm:block w-20 text-right text-[11px] font-mono-financial shrink-0 ${
                  comp.highlight
                    ? "font-semibold text-navy"
                    : "text-gray-300"
                }`}
              >
                ${annual.toLocaleString()}/yr
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
