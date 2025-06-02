import {
  ANTIPSYCHOTICS_CATEGORY,
  BEHAVIOR_RESPONSIVENESS,
  CODE_RECOMMENDATIONS,
  DIAGNOSES_CATEGORY,
  DURATION_NUMBER,
} from "./constants";

function getCode(input, mapping, fallback) {
  let code = "";
  const sanitizedInput = input.toLowerCase().replace(" ", "_");

  Object.entries(mapping).forEach(([key, value]) => {
    const position = sanitizedInput.indexOf(key);
    if (position >= 0) {
      code = code.concat(value);
    }
  });

  if (code === "") {
    return fallback;
  }

  return code;
}

function getDxCode(userInput) {
  return getCode(userInput.pmhx, DIAGNOSES_CATEGORY, "X");
}

function getApCode(userInput) {
  return getCode(userInput.meds, ANTIPSYCHOTICS_CATEGORY, "W");
}

function getAppropriatenessCode(userInput) {
  const results = userInput.behaviors.map(behavior => {
    const responsiveness = BEHAVIOR_RESPONSIVENESS[behavior.type];
    const durationNumber = DURATION_NUMBER[behavior.duration];

    return 10 * responsiveness + durationNumber + 10;
  });

  return Math.max(...results).toString();
}

export function getRecommendation(userInput) {
  const apCode = getApCode(userInput);
  const dxCode = getDxCode(userInput);
  const appropriatenessCode = getAppropriatenessCode(userInput);

  return (
    CODE_RECOMMENDATIONS[apCode] ??
    CODE_RECOMMENDATIONS[dxCode] ??
    CODE_RECOMMENDATIONS[appropriatenessCode] ??
    "ERROR"
  );
}
