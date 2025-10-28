import React from "react";
import Spline from "@splinetool/react-spline";
import { Rocket } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-sm">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/95Gu7tsx2K-0F3oi/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Soft gradient overlay for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-10 sm:py-14">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 shadow-sm">
          <Rocket size={16} />
          Learn prompt engineering through play
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Prompt Quest
        </h1>
        <p className="max-w-2xl text-base text-gray-700 sm:text-lg">
          A gamified path to clearer, more effective AI prompts. Tackle bite-sized
          challenges, get real-time feedback, and level up your skills.
        </p>
      </div>
    </section>
  );
}
