
'use server';
import { predictEquipmentFailure, type PredictEquipmentFailureInput, type PredictEquipmentFailureOutput } from '@/ai/flows/predict-equipment-failure';
import { z } from 'zod';

// Optional: Add input validation here using Zod if not already handled by the flow itself or for extra client-side detail.
const PredictEquipmentFailureInputSchema = z.object({
  equipmentType: z.string().min(1, "Equipment type is required."),
  vibrationData: z.string().min(1, "Vibration data is required."),
  temperatureData: z.string().min(1, "Temperature data is required."),
  historicalMaintenanceRecords: z.string().optional(),
});


export async function getPrediction(input: PredictEquipmentFailureInput): Promise<PredictEquipmentFailureOutput> {
  // You can validate input here if needed
  // const validatedInput = PredictEquipmentFailureInputSchema.parse(input);
  
  try {
    // Assuming predictEquipmentFailure is robust and handles its own errors internally or throws specific errors.
    const result = await predictEquipmentFailure(input);
    return result;
  } catch (error) {
    console.error("Error in getPrediction server action:", error);
    // Construct a user-friendly error response
    let errorMessage = "An unexpected error occurred during prediction.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // It's often better to throw an error and let the client handle it, or return a structured error object.
    // For this case, returning a specific error structure:
    return {
      predictedFailure: false, // Default to non-failure on error
      failureReason: `Prediction failed: ${errorMessage}`,
      recommendedActions: "Verify input data and system logs. Contact support if the issue persists.",
      confidenceLevel: 0, // No confidence in an errored prediction
    };
  }
}
