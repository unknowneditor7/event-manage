'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { validateData, type DataIntegrityState } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';

const initialState: DataIntegrityState = {
  message: '',
  status: 'idle',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Validating...
        </>
      ) : (
        'Validate Data'
      )}
    </Button>
  );
}

export default function DataIntegrityChecker({ logs }: { logs: string }) {
  const [state, formAction] = useActionState(validateData, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Data Integrity Validation</CardTitle>
        <CardDescription>
          Use AI to analyze Firestore logs for anomalies and data corruption.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="logs" className="block text-sm font-medium mb-2">Firestore Logs</label>
            <Textarea
              id="logs"
              name="logs"
              rows={10}
              defaultValue={logs}
              className="font-code text-xs"
            />
          </div>
          <SubmitButton />
        </form>

        {state.status !== 'idle' && (
          <div className="mt-4 animate-in fade-in-50">
            {state.status === 'error' && (
              <Alert variant="destructive">
                 <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Validation Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            {state.status === 'success' && state.result && (
              state.result.isValid ? (
                <Alert>
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle>Validation Passed</AlertTitle>
                  <AlertDescription>
                    {state.result.anomalies || 'No anomalies detected. Data appears to be consistent.'}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Validation Failed: Anomalies Detected</AlertTitle>
                  <AlertDescription>
                    <p className="font-semibold">The following issues were found:</p>
                    <pre className="mt-2 whitespace-pre-wrap font-code text-sm">{state.result.anomalies}</pre>
                  </AlertDescription>
                </Alert>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
