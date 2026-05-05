import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState(Array(9).fill(0));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const calculateResults = () => {
    const decision = answers.slice(0, 3).reduce((a, b) => a + b, 0);
    const communication = answers.slice(3, 6).reduce((a, b) => a + b, 0);
    const strategy = answers.slice(6, 9).reduce((a, b) => a + b, 0);

    const getBand = (score) => {
      if (score <= 7) return "Low";
      if (score <= 11) return "Medium";
      return "High";
    };

    return {
      scores: {
        decision,
        communication,
        strategy,
      },
      feedback: {
        decision: getBand(decision),
        communication: getBand(communication),
        strategy: getBand(strategy),
      },
    };
  };

  const handleSubmit = async () => {
    if (!name || !email) {
      alert("Name and Email required");
      return;
    }

    const result = calculateResults();

    const data = {
      name,
      email,
      scores: result.scores,
      feedback: result.feedback,
    };

    console.log("Sending:", data);

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      console.log("Response:", responseData);

      if (responseData.success) {
        setSubmitted(true);
      } else {
        alert("Error: " + responseData.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "#2563eb" }}>Check your email</h2>
        <p>Your assessment result has been sent.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ color: "#2563eb" }}>Leadership Assessment</h2>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "20px", width: "100%" }}
      />

      {answers.map((_, i) => (
        <div key={i} style={{ marginBottom: "15px" }}>
          <p>Question {i + 1}</p>
          {[1, 2, 3, 4, 5].map((val) => (
            <label key={val} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name={`q-${i}`}
                value={val}
                onChange={() => handleChange(i, val)}
              />
              {val}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Submitting..." : "Get My Result"}
      </button>
    </div>
  );
}

export default App;