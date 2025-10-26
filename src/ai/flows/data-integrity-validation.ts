'use server';

/**
 * @fileOverview Data integrity validation flow.
 *
 * - validateDataIntegrity - A function that validates data integrity by analyzing Firestore logs.
 * - DataIntegrityInput - The input type for the validateDataIntegrity function.
 * - DataIntegrityOutput - The return type for the validateDataIntegrity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataIntegrityInputSchema = z.object({
  logs: z
    .string()
    .describe('Firestore logs to be analyzed for data integrity.'),
});
export type DataIntegrityInput = z.infer<typeof DataIntegrityInputSchema>;

const DataIntegrityOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the data is valid or not.'),
  anomalies: z
    .string()
    .describe('Description of anomalies or inconsistencies found in the data.'),
});
export type DataIntegrityOutput = z.infer<typeof DataIntegrityOutputSchema>;

export async function validateDataIntegrity(
  input: DataIntegrityInput
): Promise<DataIntegrityOutput> {
  return dataIntegrityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dataIntegrityPrompt',
  input: {schema: DataIntegrityInputSchema},
  output: {schema: DataIntegrityOutputSchema},
  prompt: `You are an expert data integrity analyst. Your task is to analyze the provided Firestore logs for any anomalies or inconsistencies in payment data. Identify any potential data corruption issues and provide a summary of the findings.

Firestore Logs:
{{{logs}}}

Based on your analysis, determine whether the data is valid (isValid). If anomalies are found, describe them in detail (anomalies). Be concise and specific in your assessment.`,
});

const dataIntegrityFlow = ai.defineFlow(
  {
    name: 'dataIntegrityFlow',
    inputSchema: DataIntegrityInputSchema,
    outputSchema: DataIntegrityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
