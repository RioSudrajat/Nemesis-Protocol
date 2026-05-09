"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { StakingPool } from "@/types/fi";
import { buildPoolCampaignViewModel } from "@/lib/poolCampaignViewModel";
import { formatIDRXFull } from "@/lib/yield";

export function FiFeaturedAssetCarousel({ pools }: { pools: StakingPool[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pool = pools[activeIndex];
  if (!pool) {
    return (
      <section className="rounded-[1.5rem] border border-dashed border-zinc-950/15 bg-white p-8 text-sm text-zinc-500">
        No public campaigns are available yet.
      </section>
    );
  }

  const vm = buildPoolCampaignViewModel(pool, { index: activeIndex });

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-zinc-950/10 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[0.36fr_0.64fr]">
        <div className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="mb-5 rounded-2xl bg-zinc-50 px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                {vm.statusLabel}
              </span>
            </div>
            <p className="text-sm font-semibold text-zinc-500">Minimum ticket</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-zinc-950">{formatIDRXFull(vm.minInvestment)}</p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-500">{pool.description}</p>
          </div>
          <Link href={vm.href} className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-black">
            View campaign <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative min-h-[300px] overflow-hidden bg-zinc-900">
          <Image src={vm.image} alt={vm.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-5 text-white md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight">{vm.name}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white/75">
                <MapPin className="h-4 w-4" /> {vm.region} · {vm.operator}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">Units</p>
                <p className="mt-1 text-3xl font-black">{vm.unitCount}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">Cash yield</p>
                <p className="mt-1 text-3xl font-black">{vm.cashYield}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pools.length > 1 && (
        <div className="flex items-center justify-center gap-2 py-3">
          {pools.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to campaign ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-zinc-950" : "w-2 bg-zinc-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
