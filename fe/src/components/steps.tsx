import { CheckCircle } from 'lucide-react';

export function Steps({ steps }: { steps: string[] }) {
  return (
    <div className="p-4 space-y-6">
      <h2 className="font-semibold text-lg text-center">Build Steps</h2>
      <ul className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start space-x-3">
            {/* Green checkmark for all steps */}
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            {/* Step description */}
            <p className="text-sm text-gray-700">{step}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
