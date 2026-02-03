import SimpleChart from '../components/shared/SimpleChart';

export default function ChartModal({ isOpen, title, labels, values, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm text-gray-600">
            Close
          </button>
        </div>
        <SimpleChart labels={labels} values={values} />
      </div>
    </div>
  );
}
