// src/ai/flows/predict-equipment-failure.ts
'use server';

/**
 * @fileOverview Predicts equipment failure based on sensor data.
 *
 * - predictEquipmentFailure - A function that predicts equipment failure.
 * - PredictEquipmentFailureInput - The input type for the predictEquipmentFailure function.
 * - PredictEquipmentFailureOutput - The return type for the predictEquipmentFailure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictEquipmentFailureInputSchema = z.object({
  equipmentType: z.string().describe('Type of equipment being monitored.'),
  vibrationData: z.string().describe('Vibration sensor data.'),
  temperatureData: z.string().describe('Temperature sensor data.'),
  historicalMaintenanceRecords: z
    .string()
    .optional()
    .describe('Historical maintenance records for the equipment.'),
});
export type PredictEquipmentFailureInput = z.infer<
  typeof PredictEquipmentFailureInputSchema
>;

const PredictEquipmentFailureOutputSchema = z.object({
  predictedFailure: z
    .boolean()
    .describe('Whether or not the equipment is predicted to fail.'),
  failureReason: z
    .string()
    .describe('The reason for the predicted failure, if any.'),
  recommendedActions: z
    .string()
    .describe('Recommended actions to prevent the predicted failure.'),
  confidenceLevel: z
    .number()
    .describe('Confidence level of the prediction (0-1).'),
});
export type PredictEquipmentFailureOutput = z.infer<
  typeof PredictEquipmentFailureOutputSchema
>;

export async function predictEquipmentFailure(
  input: PredictEquipmentFailureInput
): Promise<PredictEquipmentFailureOutput> {
  return predictEquipmentFailureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictEquipmentFailurePrompt',
  input: {schema: PredictEquipmentFailureInputSchema},
  output: {schema: PredictEquipmentFailureOutputSchema},
  prompt: `You are an expert in predictive maintenance for construction equipment. Analyze the provided sensor data and historical maintenance records to predict potential equipment failures.

  Equipment Type: {{{equipmentType}}}
  Vibration Data: {{{vibrationData}}}
  Temperature Data: {{{temperatureData}}}
  Historical Maintenance Records: {{{historicalMaintenanceRecords}}}

  Based on this information, predict whether the equipment will fail, provide a reason for the predicted failure, recommend actions to prevent the failure, and provide a confidence level for the prediction.

  Ensure that the output is valid JSON.  If there is no failure predicted, failureReason and recommendedActions should be empty strings, predictedFailure should be false, and confidenceLevel should be low.
  `,
});

const predictEquipmentFailureFlow = ai.defineFlow(
  {
    name: 'predictEquipmentFailureFlow',
    inputSchema: PredictEquipmentFailureInputSchema,
    outputSchema: PredictEquipmentFailureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
