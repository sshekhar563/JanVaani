import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, Users, AlertTriangle } from 'lucide-react';
import { dashboardStats } from '../../data/mockData';

export default function StatsCards() {
  const [potholeStats, setPotholeStats] = useState({ total: 0, high: 0, medium: 0, low: 0, detected: 0 });

  useEffect(() => {
    fetch('/api/pothole-stats')
      .then(res => res.json())
      .then(data => setPotholeStats(data))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: 'Total Issues',
      value: dashboardStats.totalIssues.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: AlertCircle,
      color: 'blue',
    },
    {
      label: 'Resolved',
      value: dashboardStats.resolvedIssues.toLocaleString(),
      change: '+18%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'trust',
    },
    {
      label: 'Pending',
      value: dashboardStats.pendingIssues.toLocaleString(),
      change: '-5%',
      trend: 'down',
      icon: Clock,
      color: 'saffron',
    },
    {
      label: 'Pothole Alerts',
      value: potholeStats.high.toString(),
      change: potholeStats.total > 0 ? `${potholeStats.total} total` : 'New',
      trend: 'up',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      label: 'Citizen Satisfaction',
      value: `${dashboardStats.citizenSatisfaction}%`,
      change: '+3%',
      trend: 'up',
      icon: Users,
      color: 'trust',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              card.color === 'trust' ? 'bg-trust-500/15' :
              card.color === 'saffron' ? 'bg-saffron-500/15' :
              card.color === 'red' ? 'bg-red-500/15' : 'bg-blue-500/15'
            }`}>
              <card.icon className={`w-5 h-5 ${
                card.color === 'trust' ? 'text-trust-400' :
                card.color === 'saffron' ? 'text-saffron-400' :
                card.color === 'red' ? 'text-red-400' : 'text-blue-400'
              }`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              card.trend === 'up' 
                ? card.color === 'red' ? 'text-red-400 bg-red-500/10' : 'text-trust-400 bg-trust-500/10'
                : 'text-saffron-400 bg-saffron-500/10'
            }`}>
              {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {card.change}
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
          <p className="text-sm text-gray-400 mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}

