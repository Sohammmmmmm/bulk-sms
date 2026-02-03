// Analytics constants and data
export const getAnalyticStats = () => [
  {
    title: 'Total Campaigns',
    value: '127',
    trend: 'up',
    trendValue: '+18%',
    color: 'indigo',
    chartData: {
      title: 'Total Campaigns (monthly)',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      values: [12, 18, 11, 20, 24],
    },
  },
  {
    title: 'Messages Sent',
    value: '45.2K',
    trend: 'up',
    trendValue: '+25%',
    color: 'cyan',
    chartData: {
      title: 'Messages Sent (weekly)',
      labels: ['W1', 'W2', 'W3', 'W4'],
      values: [10200, 11000, 12000, 12000],
    },
  },
  {
    title: 'Delivery Rate',
    value: '98.7%',
    trend: 'up',
    trendValue: '+0.5%',
    color: 'green',
    chartData: {
      title: 'Delivery Rate (%)',
      labels: ['Week1', 'Week2', 'Week3', 'Week4'],
      values: [98.2, 98.5, 98.7, 99.0],
    },
  },
  {
    title: 'Active Users',
    value: '12',
    color: 'purple',
    chartData: {
      title: 'Active Users',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      values: [8, 9, 11, 10, 12],
    },
  },
];

export const getRecentCampaigns = () => [
  {
    id: 1,
    name: 'Holiday Sale Campaign',
    status: 'completed',
    sent: 1250,
    delivered: 1238,
    failed: 12,
    date: 'Jan 25, 2026',
    deliveryRate: 99.0,
  },
  {
    id: 2,
    name: 'Product Launch',
    status: 'completed',
    sent: 890,
    delivered: 875,
    failed: 15,
    date: 'Jan 23, 2026',
    deliveryRate: 98.3,
  },
  {
    id: 3,
    name: 'Customer Feedback',
    status: 'completed',
    sent: 2100,
    delivered: 2087,
    failed: 13,
    date: 'Jan 20, 2026',
    deliveryRate: 99.4,
  },
  {
    id: 4,
    name: 'Weekly Newsletter',
    status: 'in_progress',
    sent: 450,
    delivered: 442,
    failed: 8,
    date: 'Jan 28, 2026',
    deliveryRate: 98.2,
  },
];

export const getTopPerformers = () => [
  { name: 'John Maker', campaigns: 24, successRate: 98.5 },
  { name: 'Jane Maker', campaigns: 18, successRate: 97.8 },
  { name: 'Mike Creator', campaigns: 15, successRate: 99.1 },
];
