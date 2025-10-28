// Challenge data for Prompt Quest
// Each challenge includes: id, level, title, description, successCriteria, hints, examples

export const levels = [
  {
    id: 1,
    title: "Level 1 · Basics",
    description: "Clarity and specificity",
  },
  {
    id: 2,
    title: "Level 2 · Context & Role",
    description: "Add relevant context and define the AI's role",
  },
];

export const challenges = [
  {
    id: "l1-c1",
    level: 1,
    title: "Explain Photosynthesis",
    description:
      "Write a prompt asking an AI to explain photosynthesis to a 10-year-old pupil. Be clear and specify the audience.",
    successCriteria: [
      "Mentions the topic ‘photosynthesis’",
      "Specifies the audience (10-year-old)",
      "Uses clear, simple language",
      "Requests an explanation",
    ],
    hints: [
      "State the topic plainly and who it’s for.",
      "Ask for a short and simple explanation.",
    ],
    examples: [
      "Explain photosynthesis to a 10-year-old using simple words and a short paragraph.",
    ],
  },
  {
    id: "l1-c2",
    level: 1,
    title: "Compare Two Animals",
    description:
      "Ask the AI to compare cats and dogs for a school project. Be specific about what to compare.",
    successCriteria: [
      "Mentions both animals",
      "Lists specific aspects to compare (e.g., temperament, care)",
      "Requests a clear structure",
    ],
    hints: [
      "Use bullet points or a short list.",
      "Name 2–3 aspects to compare.",
    ],
    examples: [
      "Compare cats and dogs for a school project in 4 bullet points: care needs, temperament, living space, and costs.",
    ],
  },
  {
    id: "l2-c1",
    level: 2,
    title: "AI as a Tour Guide",
    description:
      "Tell the AI to act as a friendly London tour guide and suggest a 1-day itinerary for history lovers.",
    successCriteria: [
      "Defines the AI's role",
      "Includes the city (London)",
      "Specifies the audience (history lovers)",
      "Requests a 1-day plan",
    ],
    hints: [
      "Start with ‘You are…’ to set the role.",
      "Ask for a morning/afternoon/evening structure.",
    ],
    examples: [
      "You are a friendly London tour guide. Create a 1-day itinerary for history lovers with morning, afternoon, and evening activities.",
    ],
  },
  {
    id: "l2-c2",
    level: 2,
    title: "Structured Summary",
    description:
      "Ask the AI to summarise an article about climate change in three sections: Key Facts, Impacts, and Actions.",
    successCriteria: [
      "Mentions climate change",
      "Requests three clear sections",
      "Asks for concise bullet points",
    ],
    hints: [
      "Name the three headings you want.",
      "Ask for 3–4 bullets per section.",
    ],
    examples: [
      "Summarise an article about climate change in three sections with 3–4 bullets each: Key Facts, Impacts, Actions.",
    ],
  },
  {
    id: "l2-c3",
    level: 2,
    title: "Role + Audience + Format",
    description:
      "Set the AI as a maths tutor. Ask for a step-by-step explanation of how to find the area of a triangle for a Year 8 pupil.",
    successCriteria: [
      "Defines the role (maths tutor)",
      "Specifies the audience (Year 8 pupil)",
      "Requests step-by-step format",
      "Mentions area of a triangle",
    ],
    hints: [
      "Role + audience + topic + format is a strong combo.",
    ],
    examples: [
      "Act as a patient maths tutor. Explain step-by-step how to find the area of a triangle for a Year 8 pupil.",
    ],
  },
];

export function getChallengesByLevel(level) {
  return challenges.filter((c) => c.level === level);
}
