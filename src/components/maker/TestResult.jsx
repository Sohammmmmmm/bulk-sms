import { CheckCircle, AlertCircle } from 'lucide-react';

export default function TestResult({ testResult }) {
  if (!testResult) return null;

  return (
    <div
      className={`rounded-xl p-4 border animate-scale-in ${
        testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex gap-3">
        <div className={testResult.success ? 'text-green-600' : 'text-red-600'}>
          {testResult.success ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className={`font-medium ${testResult.success ? 'text-green-900' : 'text-red-900'}`}>
            {testResult.message}
          </p>
          <p className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
            {testResult.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}
