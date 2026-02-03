import { Loader, Shield } from 'lucide-react';

export default function ScanProgress({ fileName }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <Shield className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">Scanning for threats...</h4>
          <p className="text-sm text-blue-700">
            Analyzing {fileName} for viruses and validating file integrity
          </p>
        </div>
      </div>
    </div>
  );
}
