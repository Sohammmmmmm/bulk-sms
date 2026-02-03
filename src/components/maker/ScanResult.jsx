import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function ScanResult({ scanResult, contacts, onReset }) {
  return (
    <div
      className={`rounded-xl p-6 border animate-slide-up ${
        scanResult.isClean ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4 flex-1">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              scanResult.isClean ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {scanResult.isClean ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h4
              className={`font-semibold mb-2 text-lg ${
                scanResult.isClean ? 'text-green-900' : 'text-red-900'
              }`}
            >
              {scanResult.isClean ? '✓ File is clean and safe' : '✗ Threat detected'}
            </h4>
            <div className="space-y-1 text-sm">
              <p className={scanResult.isClean ? 'text-green-700' : 'text-red-700'}>
                <span className="font-medium">File:</span> {scanResult.fileName}
              </p>
              {scanResult.fileSize && (
                <p className={scanResult.isClean ? 'text-green-700' : 'text-red-700'}>
                  <span className="font-medium">Size:</span> {scanResult.fileSize}
                </p>
              )}
              {scanResult.scanTime && (
                <p className={scanResult.isClean ? 'text-green-700' : 'text-red-700'}>
                  <span className="font-medium">Scanned at:</span> {scanResult.scanTime}
                </p>
              )}
              {scanResult.error && (
                <p className="text-red-700 font-medium mt-2">⚠️ {scanResult.error}</p>
              )}
              {scanResult.isClean && contacts.length > 0 && (() => {
                const validCount = contacts.filter(c => c.valid).length;
                const invalidCount = contacts.length - validCount;
                return (
                  <div className="text-gray-700 font-medium mt-3 text-sm">
                    <p>✓ Valid: <span className="text-green-600 font-bold">{validCount}</span> | ✗ Invalid: <span className="text-red-600 font-bold">{invalidCount}</span></p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
        <button
          onClick={onReset}
          className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0"
          title="Reset upload"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
