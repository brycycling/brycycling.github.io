import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import "./App.css";
import {
  BEHAVIOR_RESPONSIVENESS,
  DURATION_NUMBER,
} from "./recommender/constants";
import { getRecommendation } from "./recommender/recommender";

type Recommendation = {
  msg: string;
  danger: number;
};

const BEHAVIOR_KEYS = Object.keys(BEHAVIOR_RESPONSIVENESS).sort();
const DURATION_KEYS = Object.keys(DURATION_NUMBER);

type BehaviorInput = {
  type: string;
  duration: string;
};

const defaultBehaviorInput = {
  type: BEHAVIOR_KEYS[0],
  duration: DURATION_KEYS[0],
};

function App() {
  const pmhxRef = React.useRef<HTMLTextAreaElement>(null);
  const medsRef = React.useRef<HTMLTextAreaElement>(null);
  const recommendationRef = React.useRef<HTMLDivElement>(null);
  const [recommendation, setRecommendation] = useState<Recommendation>({
    msg: "",
    danger: 4,
  });

  const [behaviorInputs, setBehaviorInputs] = useState<BehaviorInput[]>([
    defaultBehaviorInput,
  ]);

  const addBehaviorInput = () => {
    setBehaviorInputs(prev => [...prev, defaultBehaviorInput]);
  };

  const removeBehaviorInput = (index: number) => {
    if (behaviorInputs.length === 1) {
      setBehaviorInputs([defaultBehaviorInput]);
    } else {
      setBehaviorInputs(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateBehaviorInput = ({
    index,
    type,
    duration,
  }: {
    index: number;
    type?: string;
    duration?: string;
  }) => {
    const newInputs = behaviorInputs.map((input, i) => {
      if (i !== index) {
        return input;
      }

      if (type) {
        return { ...input, type };
      }

      if (duration) {
        return { ...input, duration };
      }

      return input;
    });
    setBehaviorInputs(newInputs);
  };

  const onClick = () => {
    const userInput = {
      pmhx: pmhxRef.current?.value,
      meds: medsRef.current?.value,
      behaviors: behaviorInputs,
    };

    setRecommendation(getRecommendation(userInput));
    recommendationRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="Main">
      <div className="UserInputSection">
        <div className="Card">
          <label>PMHX</label>
          <textarea className="TextAreaInput" ref={pmhxRef} />
        </div>
        <div className="Card">
          <label>Meds</label>
          <textarea className="TextAreaInput" ref={medsRef} />
        </div>
        <div className="Card">
          <label>Behaviors</label>
          <div className="InputList">
            {behaviorInputs.map((input, index) => (
              <div className="InputListItem">
                <select
                  onChange={e => {
                    updateBehaviorInput({ index, type: e.target.value });
                  }}
                  value={input.type}
                >
                  {BEHAVIOR_KEYS.map(behavior => (
                    <option>{behavior}</option>
                  ))}
                </select>
                <select
                  onChange={e => {
                    updateBehaviorInput({ index, duration: e.target.value });
                  }}
                  value={input.duration}
                >
                  {DURATION_KEYS.map(behavior => (
                    <option>{behavior}</option>
                  ))}
                </select>
                <button
                  className="GhostCta"
                  onClick={() => removeBehaviorInput(index)}
                  disabled={index === 0 && behaviorInputs.length === 1}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
            <button className="SecondaryCta" onClick={addBehaviorInput}>
              <PlusIcon />
            </button>
          </div>
        </div>
      </div>
      <button className="PrimaryCta" onClick={onClick}>
        Get Recommendation
      </button>
      {recommendation.msg ? (
        <div className={`Result Danger${recommendation.danger}`}>
          {recommendation.msg}
        </div>
      ) : (
        <div className="ResultPlaceholder" />
      )}
      <div ref={recommendationRef} className="ScrollThreshold" />
    </div>
  );
}

export default App;
