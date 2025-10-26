'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { validateDataIntegrity } from '@/ai/flows/data-integrity-validation';
import type { DataIntegrityOutput } from '@/ai/flows/data-integrity-validation';

export type ActionState = {
  status: 'success' | 'error';
  message: string;
} | {
  status: 'idle';
  message: '';
};

export type DataIntegrityState = {
  result?: DataIntegrityOutput;
  message: string;
  status: 'success' | 'error' | 'idle';
};

// Simulate a database update
const fakeDbUpdate = async (paymentId: string) => {
  console.log(`Updating payment ${paymentId} to 'completed' in the database.`);
  console.log(`Sending receipt for payment ${paymentId}.`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}

export async function updatePaymentStatus(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const schema = z.object({
    paymentId: z.string(),
  });

  const validatedFields = schema.safeParse({
    paymentId: formData.get('paymentId'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Invalid payment ID.',
    };
  }

  try {
    await fakeDbUpdate(validatedFields.data.paymentId);
    revalidatePath('/admin');
    return {
      status: 'success',
      message: `Payment ${validatedFields.data.paymentId} marked as completed.`,
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Failed to update payment status.',
    };
  }
}

export async function validateData(prevState: DataIntegrityState, formData: FormData): Promise<DataIntegrityState> {
  const schema = z.object({
    logs: z.string().min(1, { message: 'Logs cannot be empty.' }),
  });

  const validatedFields = schema.safeParse({
    logs: formData.get('logs'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.flatten().fieldErrors.logs?.[0] ?? 'Invalid input.',
    };
  }

  try {
    const result = await validateDataIntegrity({ logs: validatedFields.data.logs });
    return {
      status: 'success',
      result,
      message: 'Data integrity validation completed.',
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'An error occurred during AI validation.',
    };
  }
}
