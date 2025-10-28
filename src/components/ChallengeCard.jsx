import React, { useState } from "react";
import { ChevronDown, Lightbulb, CheckCircle2, Info } from "lucide-react";

export default function ChallengeCard({ challenge, completed, onEvaluate }) {
  const [showHints, setShowHints] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{challenge.title}</h3>
          <p className="mt-1 text-sm text-gray-700">{challenge.description}</p>
        </div>
        {completed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
            <CheckCircle2 className="h-4 w-4" /> Completed
          </span>
        )}
      </div>

      <div className="rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <Info className="h-4 w-4" /> Success criteria
        </div>
        <ul className="ml-5 list-disc space-y-1">
          {challenge.successCriteria.map((c, idx) => (
            <li key={idx}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowHints((s) => !s)}
          className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          <Lightbulb className="h-4 w-4 text-amber-500" /> Hints
          <ChevronDown className={`h-4 w-4 transition ${showHints ? "rotate-180" : ""}`} />
        </button>
        <button
          onClick={() => setShowExamples((s) => !s)}
          className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Examples (after attempt)
          <ChevronDown className={`h-4 w-4 transition ${showExamples ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showHints && (
        <div className="rounded-lg border border-dashed border-orange-200 bg-orange-50/60 p-3 text-sm text-orange-900">
          <ul className="ml-5 list-disc space-y-1">
            {challenge.hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {showExamples && (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
          <ul className="ml-5 list-disc space-y-1">
            {challenge.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      )}

      {/* External evaluation trigger handled by parent via PromptInput */}
      <div className="text-xs text-gray-500">Write your prompt below and submit for feedback.</div>
    </div>
  );
}
