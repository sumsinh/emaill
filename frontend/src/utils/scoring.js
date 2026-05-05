export function calculateScores(answers) {
  const scores = {
    decision: 0,
    communication: 0,
    strategy: 0,
  };

  answers.forEach((a) => {
    scores[a.dimension] += a.value;
  });

  function getBand(score) {
    if (score <= 7) return "Low";
    if (score <= 11) return "Medium";
    return "High";
  }

  function getFeedback(dimension, band) {
    if (band === "Low") {
      return `You need to improve your ${dimension}. Try to be more consistent and confident.`;
    }

    if (band === "Medium") {
      return `You are doing okay in ${dimension}, but there is room for improvement.`;
    }

    return `You are strong in ${dimension}. Keep it up and continue building on it.`;
  }

  const bands = {
    decision: getBand(scores.decision),
    communication: getBand(scores.communication),
    strategy: getBand(scores.strategy),
  };

  const feedback = {
    decision: getFeedback("decision making", bands.decision),
    communication: getFeedback("communication", bands.communication),
    strategy: getFeedback("strategic thinking", bands.strategy),
  };

  return {
    scores,
    bands,
    feedback,
  };
}