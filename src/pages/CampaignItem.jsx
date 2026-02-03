export default function CampaignItem({ campaign }) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{campaign.name}</h3>
          <p className="text-sm text-gray-600">{campaign.date}</p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            campaign.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {campaign.status === 'completed' ? 'Completed' : 'In Progress'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-600">Sent</p>
          <p className="text-lg font-bold text-gray-900">{campaign.sent}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Delivered</p>
          <p className="text-lg font-bold text-green-600">{campaign.delivered}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Failed</p>
          <p className="text-lg font-bold text-red-600">{campaign.failed}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full transition-all"
            style={{ width: `${campaign.deliveryRate}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-700">{campaign.deliveryRate}%</span>
      </div>
    </div>
  );
}
