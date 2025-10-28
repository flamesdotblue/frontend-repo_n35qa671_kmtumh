import React from "react";
import { Star, Trophy, Flame } from "lucide-react";

export default function HUD({ points, streak, currentLevel, onLevelChange, levels }) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white/70 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-amber-600">
          <Trophy className="h-5 w-5" />
          <span className="text-sm font-semibold">{points} pts</span>
        </div>
        <div className="flex items-center gap-2 text-orange-600">
          <Flame className="h-5 w-5" />
          <span className="text-sm font-semibold">Streak: {streak}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => onLevelChange(lvl.id)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              currentLevel === lvl.id
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {lvl.title}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(3)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
        <span className="ml-2 text-xs text-gray-500">Earn stars with strong prompts</span>
      </div>
    </div>
  );
}
