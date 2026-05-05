import { useState } from "react";
import questions from "./data/questions";
import { calculateScores } from "./utils/scoring";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  function handleAnswer(q, value) {
    setAnswers((prev) => [
      ...prev.filter((a) => a.id !== q.id),
      { id: q.id, dimension: q.dimension, value },
    ]);
  }

  function getSelectedValue(questionId) {
    const found = answers.find((a) => a.id === questionId);
    return found ? found.value : null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const uniqueAnswers = new Set(answers.map((a) => a.id));

    if (!name || !email || uniqueAnswers.size !== 9) {
      setError("Please fill all fields and answer all questions");
      return;
    }

    const data = calculateScores(answers);

    const payload = {
      name,
      email,
      answers,
      ...data,
    };

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const response = await res.json();

      if (response.success) {
        setResult(data);
      } else {
        setError(response.error || "Something went wrong");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-blue-50 flex justify-center items-center px-4">
        <div className="w-full max-w-md bg-white border border-blue-100 rounded-lg p-6">

          <h2 className="text-lg font-semibold text-blue-700 mb-4">
            Your Results
          </h2>

          {["decision", "communication", "strategy"].map((key) => (
            <div key={key} className="mb-4">
              <p className="text-sm font-medium capitalize text-gray-700">
                {key}
              </p>
              <p className="text-sm text-gray-600">
                Score: {result.scores[key]} ({result.bands[key]})
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {result.feedback[key]}
              </p>
            </div>
          ))}

          <p className="text-sm text-blue-600 mt-4">
            Your report has been sent to your email.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-blue-700">
            Leadership Assessment
          </h1>
          <p className="text-blue-500 text-sm mt-1">
            Answer a few quick questions.
          </p>
        </div>

        <div className="bg-white border border-blue-100 rounded-lg p-5 mb-6">
          <div className="flex flex-col gap-3">
            <input
              className="w-full border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-blue-100 rounded-lg p-5">
          {questions.map((q) => (
            <div key={q.id} className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                {q.text}
              </p>

              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((v) => {
                  const selected = getSelectedValue(q.id) === v;

                  return (
                    <button
                      type="button"
                      key={v}
                      onClick={() => handleAnswer(q, v)}
                      className={`w-10 h-10 flex items-center justify-center text-sm rounded-full border transition
                        ${
                          selected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-blue-600 border-blue-300 hover:bg-blue-100"
                        }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {error && (
            <p className="text-sm text-red-500 mb-3">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Get results"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;