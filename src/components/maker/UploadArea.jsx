import { Upload } from 'lucide-react';

export default function UploadArea({ isDragging, onDrop, onDragOver, onDragLeave, onUpload, fileInputRef }) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50 scale-105'
          : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => onUpload(e.target.files[0])}
        className="hidden"
        id="file-upload"
        aria-label="Upload CSV or Excel file"
      />
      
      <div className="flex flex-col items-center gap-4" onClick={() => fileInputRef.current?.click()}>
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-2xl flex items-center justify-center">
          <Upload className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <p className="text-indigo-600 font-semibold text-lg">Click to upload</p>
          <span className="text-gray-600"> or drag and drop</span>
        </div>
        <p className="text-sm text-gray-500">CSV or Excel files only (Max 5MB)</p>
      </div>
    </div>
  );
}
