// Gemini integration with a graceful local fallback evaluator.
// Set VITE_GEMINI_API_KEY in your environment to use Gemini.

const MODEL = "gemini-2.0-flash-lite-preview-02-05";

function basicHeuristicScore(promptText, challenge) {
  const text = (promptText || "").toLowerCase();
  let score = 0;

  // Reward length (but not too long)
  if (text.length > 30) score += 15;
  if (text.length > 80) score += 10;
  if (text.length > 200) score -= 5; // too wordy can be a minus

  // Criteria keyword matching
  const criteriaHints = [
    "explain",
    "summarise",
    "bullet",
    "list",
    "step-by-step",
    "you are",
    "act as",
    "format",
    "sections",
    "for a 10-year-old",
    "year 8",
  ];
  criteriaHints.forEach((kw) => {
    if (text.includes(kw)) score += 5;
  });

  // Challenge-specific nudges
  if (challenge.id === "l1-c1") {
    if (text.includes("photosynthesis")) score += 20;
    if (text.includes("10-year")) score += 15;
    if (text.includes("explain")) score += 10;
  }
  if (challenge.id === "l1-c2") {
    if (text.includes("cat") && text.includes("dog")) score += 15;
    if (text.includes("compare")) score += 10;
    ["temperament", "care", "space", "cost"].forEach((kw) => {
      if (text.includes(kw)) score += 5;
    });
  }
  if (challenge.id === "l2-c1") {
    if (text.includes("you are") || text.includes("act as")) score += 15;
    if (text.includes("tour guide") || text.includes("guide")) score += 10;
    if (text.includes("london")) score += 10;
    ["morning", "afternoon", "evening"].forEach((kw) => {
      if (text.includes(kw)) score += 5;
    });
  }
  if (challenge.id === "l2-c2") {
    if (text.includes("climate change")) score += 15;
    if (text.includes("sections") || text.includes("headings")) score += 10;
    if (text.includes("key facts") && text.includes("impacts") && text.includes("actions")) score += 20;
  }
  if (challenge.id === "l2-c3") {
    if (text.includes("maths tutor") || text.includes("math tutor")) score += 15;
    if (text.includes("year 8")) score += 10;
    if (text.includes("area of a triangle")) score += 20;
    if (text.includes("step-by-step")) score += 10;
  }

  // Clamp and stars
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  const stars = finalScore >= 85 ? 3 : finalScore >= 60 ? 2 : finalScore > 0 ? 1 : 0;
  return {
    score: finalScore,
    stars,
    feedback:
      finalScore >= 85
        ? "Excellent! Your prompt is clear, specific, and well-structured."
        : finalScore >= 60
        ? "Good start. Add a bit more context and structure for a stronger result."
        : "Try adding clearer instructions, audience details, and a specific format.",
    suggestions: [
      "Mention the audience and purpose explicitly.",
      "Request a specific structure (e.g., bullets or sections).",
      "Use role-setting like ‘You are a…’ when helpful.",
    ],
  };
}

export async function evaluatePrompt(promptText, challenge) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return basicHeuristicScore(promptText, challenge);
  }

  try {
    const system =
      "You are an expert prompt engineering coach for students aged 13–18. " +
      "Evaluate the student's prompt against these criteria: Clarity, Specificity, Context, Structure, Effectiveness. " +
      "Return JSON with fields: score (0-100), stars (1-3), feedback (string), and suggestions (array of 3 concise tips).";

    const criteria = `Challenge: ${challenge.title}\nDescription: ${challenge.description}\nSuccess criteria: ${challenge.successCriteria.join(
      "; "
    )}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: system },
            { text: criteria },
            { text: `Student prompt: ${promptText}` },
            { text: "Respond with ONLY valid JSON and nothing else." },
          ],
        },
      ],
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) throw new Error("Gemini API error");
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Attempt to parse JSON from the model text
    const parsed = JSON.parse(text);
    const score = Math.max(0, Math.min(100, Number(parsed.score) || 0));
    const stars = Math.max(0, Math.min(3, Number(parsed.stars) || 0));
    const feedback = String(parsed.feedback || "");
    const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [];

    // If stars not provided, derive from score
    const finalStars = stars || (score >= 85 ? 3 : score >= 60 ? 2 : score > 0 ? 1 : 0);

    return { score, stars: finalStars, feedback, suggestions };
  } catch (e) {
    // Fallback gracefully
    return basicHeuristicScore(promptText, challenge);
  }
}
