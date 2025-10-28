import React, { useState, useEffect } from "react";

export default function PromptInput({ onSubmit, disabled }) {
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
  const limit = 600;

  useEffect(() => {
    setCount(text.length);
  }, [text]);

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <label htmlFor="prompt" className="mb-2 block text-sm font-medium text-gray-700">
        Your prompt
      </label>
      <textarea
        id="prompt"
        className="h-36 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none ring-orange-300 focus:ring"
        placeholder="Write your prompt here…"
        value={text}
        maxLength={limit}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          Characters: {count}/{limit}
        </span>
        <button
          onClick={() => onSubmit(text, () => setText(""))}
          disabled={disabled || text.trim().length < 10}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
            disabled || text.trim().length < 10
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        >
          Submit for feedback
        </button>
      </div>
    </div>
  );
}
