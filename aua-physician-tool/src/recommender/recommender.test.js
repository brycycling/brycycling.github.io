import { expect, test } from 'vitest';
import { getRecommendation } from './recommender';
import { CODE_RECOMMENDATIONS } from './constants';

test('Likely appropriate. Continue AP.', () => {
    const userInput = {
        pmhx: "Schizophrenia\nDementia\nDiabetes\nOsteoarthritis\nGout",
        meds: "Metformin 500 mg BID\nAcetaminophen 650 mg QID\nClozapine 500 mg qHS\nLoxapine 5 mg qHS",
        behaviors: [
            {
                type: "wandering",
                duration: "ongoing"
            },
            {
                type: "spitting",
                duration: "ongoing"
            },
            {
                type: "insomina",
                duration: "ongoing"
            },
        ]
    }

    const result = getRecommendation(userInput)
    expect(result).toBe(CODE_RECOMMENDATIONS.PN)
});