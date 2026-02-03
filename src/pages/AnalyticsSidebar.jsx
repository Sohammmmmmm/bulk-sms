import { TrendingUp } from 'lucide-react';

export default function AnalyticsSidebar({ performers, monthlyStats }) {
  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-display font-bold text-gray-900">
            Top Performers
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {performers.map((performer, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{performer.name}</p>
                <p className="text-sm text-gray-600">
                  {performer.campaigns} campaigns • {performer.successRate}% success
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">This Month</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-indigo-100">Total Sent</span>
            <span className="text-2xl font-bold">{monthlyStats.totalSent}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-indigo-100">Delivered</span>
            <span className="text-2xl font-bold">{monthlyStats.delivered}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-indigo-100">Success Rate</span>
            <span className="text-2xl font-bold">{monthlyStats.successRate}</span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-indigo-400">
          <div className="flex items-center gap-2 text-indigo-100">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+23% vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
