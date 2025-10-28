import React, { useEffect, useMemo, useState } from "react";
import Hero from "./components/Hero";
import HUD from "./components/HUD";
import ChallengeCard from "./components/ChallengeCard";
import PromptInput from "./components/PromptInput";
import { evaluatePrompt } from "./components/evaluator";
import { challenges, levels, getChallengesByLevel } from "./components/challenges";
import { loadProgress, saveProgress, updateDailyStreak } from "./components/storage";
import { Star } from "lucide-react";

export default function App() {
  const [progress, setProgress] = useState(loadProgress());
  const [currentLevel, setCurrentLevel] = useState(1);
  const levelChallenges = useMemo(() => getChallengesByLevel(currentLevel), [currentLevel]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentChallenge = levelChallenges[currentIdx];
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Keep daily streak up to date on first load
    const updated = updateDailyStreak({ ...progress });
    setProgress(updated);
    saveProgress(updated);
  }, []);

  useEffect(() => {
    // Reset view on level change
    setCurrentIdx(0);
    setResult(null);
  }, [currentLevel]);

  const handleEvaluate = async (text, clear) => {
    if (!currentChallenge) return;
    setLoading(true);
    setResult(null);
    try {
      const evalRes = await evaluatePrompt(text, currentChallenge);
      setResult({ ...evalRes, text });

      // Award points: raw score plus bonus for stars
      const earned = Math.round(evalRes.score + evalRes.stars * 10);

      // Update progress (points and completion state)
      setProgress((prev) => {
        const updated = { ...prev };
        updated.points = (updated.points || 0) + earned;
        updated.completed = { ...updated.completed, [currentChallenge.id]: {
          score: evalRes.score,
          stars: evalRes.stars,
        }};
        const withStreak = updateDailyStreak(updated);
        saveProgress(withStreak);
        return withStreak;
      });

      // Clear input after successful evaluation
      if (typeof clear === "function") clear();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nextChallenge = () => {
    if (currentIdx < levelChallenges.length - 1) {
      setCurrentIdx((i) => i + 1);
      setResult(null);
    } else if (currentLevel < levels.length) {
      setCurrentLevel((l) => l + 1);
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
        <Hero />

        <HUD
          points={progress.points}
          streak={progress.streak}
          currentLevel={currentLevel}
          onLevelChange={setCurrentLevel}
          levels={levels}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            {currentChallenge && (
              <ChallengeCard
                challenge={currentChallenge}
                completed={Boolean(progress.completed?.[currentChallenge.id])}
              />
            )}
            <div className="mt-4">
              <PromptInput onSubmit={handleEvaluate} disabled={loading} />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex h-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="text-base font-semibold text-gray-900">Feedback</h4>
              {!result && (
                <p className="text-sm text-gray-600">
                  Submit your prompt to receive immediate, constructive feedback based on clarity,
                  specificity, context, structure, and effectiveness.
                </p>
              )}
              {result && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Score</div>
                    <div className="text-lg font-bold text-gray-900">{result.score}/100</div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: result.stars }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                    {Array.from({ length: Math.max(0, 3 - result.stars) }).map((_, i) => (
                      <Star key={`o-${i}`} className="h-5 w-5" />
                    ))}
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
                    {result.feedback}
                  </div>
                  {result.suggestions?.length > 0 && (
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Suggestions
                      </div>
                      <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                        {result.suggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    onClick={nextChallenge}
                    className="w-full rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                  >
                    {currentIdx < levelChallenges.length - 1 ? "Next challenge" : currentLevel < levels.length ? "Unlock next level" : "Replay level"}
                  </button>
                </div>
              )}

              {progress.completed && (
                <div className="mt-2 rounded-lg border border-dashed border-gray-200 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Your progress in this level
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {getChallengesByLevel(currentLevel).map((c) => (
                      <div
                        key={c.id}
                        className={`flex items-center justify-between rounded-md px-2 py-1 ${
                          progress.completed[c.id] ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        <span>{c.title}</span>
                        <span>
                          {progress.completed[c.id] ? `${progress.completed[c.id].score} / 100` : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="py-8 text-center text-xs text-gray-500">
          Tip: Set your API key in an environment variable named VITE_GEMINI_API_KEY to enable live AI feedback. Without it, a local evaluator will provide guidance.
        </footer>
      </div>
    </div>
  );
}
