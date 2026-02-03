import { useState } from 'react';
import { BarChart3, Send, CheckCircle, Users } from 'lucide-react';
import StatsCard from '../components/shared/StatsCard';
import ChartModal from './ChartModal';
import RecentCampaigns from './RecentCampaigns';
import AnalyticsSidebar from './AnalyticsSidebar';
import {
  getAnalyticStats,
  getRecentCampaigns,
  getTopPerformers,
} from './analyticsData';

const iconMap = {
  'Total Campaigns': BarChart3,
  'Messages Sent': Send,
  'Delivery Rate': CheckCircle,
  'Active Users': Users,
};

export default function Analytics() {
  const [chartOpen, setChartOpen] = useState(false);
  const [chartTitle, setChartTitle] = useState('');
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  const stats = getAnalyticStats();
  const recentCampaigns = getRecentCampaigns();
  const topPerformers = getTopPerformers();
  const monthlyStats = {
    totalSent: '12.5K',
    delivered: '12.3K',
    successRate: '98.4%',
  };

  const openChart = (title, labels, values) => {
    setChartTitle(title);
    setChartData({ labels, values });
    setChartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Analytics & Reports
        </h1>
        <p className="text-gray-600">
          Track performance and insights across all campaigns
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={iconMap[stat.title]}
            trend={stat.trend}
            trendValue={stat.trendValue}
            color={stat.color}
            onClick={() =>
              openChart(
                stat.chartData.title,
                stat.chartData.labels,
                stat.chartData.values
              )
            }
          />
        ))}
      </div>

      {/* Chart Modal */}
      <ChartModal
        isOpen={chartOpen}
        title={chartTitle}
        labels={chartData.labels}
        values={chartData.values}
        onClose={() => setChartOpen(false)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentCampaigns campaigns={recentCampaigns} />
        <AnalyticsSidebar performers={topPerformers} monthlyStats={monthlyStats} />
      </div>
    </div>
  );
}