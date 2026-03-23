import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { TrendingUp, Zap, Heart, Shield, MessageCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TrustIndex() {
  const [trustData, setTrustData] = useState({
    overall: 73,
    metrics: {
      issueResolution: 78,
      citizenSentiment: 65,
      verifiedWorkProof: 82,
      communicationTransparency: 68,
    },
  });

  useEffect(() => {
    fetch('/api/trust/city')
      .then(res => res.json())
      .then(data => {
        if (data && data.city_trust_score) {
          const areas = data.areas || [];
          const avgSpeed = areas.length > 0
            ? Math.round(areas.reduce((s, a) => s + (a.speed_score || 0), 0) / areas.length)
            : 78;
          const avgRating = areas.length > 0
            ? Math.round(areas.reduce((s, a) => s + (a.citizen_rating || 0), 0) / areas.length)
            : 65;
          const avgVerify = areas.length > 0
            ? Math.round(areas.reduce((s, a) => s + (a.verification_score || 0), 0) / areas.length)
            : 82;

          setTrustData({
            overall: Math.round(data.city_trust_score),
            metrics: {
              issueResolution: avgSpeed,
              citizenSentiment: avgRating,
              verifiedWorkProof: avgVerify,
              communicationTransparency: Math.round((avgSpeed + avgRating) / 2 * 0.9),
            },
          });
        }
      })
      .catch(() => {});
  }, []);

  const { overall, metrics } = trustData;

  const chartData = {
    labels: ['Resolution Speed', 'Citizen Sentiment', 'Verified Proof', 'Communication'],
    datasets: [{
      data: [
        metrics.issueResolution,
        metrics.citizenSentiment,
        metrics.verifiedWorkProof,
        metrics.communicationTransparency,
      ],
      backgroundColor: [
        'rgba(22, 163, 74, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(37, 99, 235, 0.8)',
        'rgba(139, 92, 246, 0.8)',
      ],
      borderColor: [
        'rgba(22, 163, 74, 0.3)',
        'rgba(249, 115, 22, 0.3)',
        'rgba(37, 99, 235, 0.3)',
        'rgba(139, 92, 246, 0.3)',
      ],
      borderWidth: 2,
      cutout: '72%',
      borderRadius: 6,
      spacing: 4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeOutQuart',
    },
  };

  const metricItems = [
    { key: 'issueResolution', label: 'Resolution Speed', value: metrics.issueResolution, icon: Zap, color: 'teal' },
    { key: 'citizenSentiment', label: 'Citizen Sentiment', value: metrics.citizenSentiment, icon: Heart, color: 'amber' },
    { key: 'verifiedWorkProof', label: 'Verified Proof', value: metrics.verifiedWorkProof, icon: Shield, color: 'blue' },
    { key: 'communicationTransparency', label: 'Communication', value: metrics.communicationTransparency, icon: MessageCircle, color: 'purple' },
  ];

  const colorMap = {
    teal: { bar: 'bg-teal-500', text: 'text-teal-400' },
    amber: { bar: 'bg-amber-500', text: 'text-amber-400' },
    blue: { bar: 'bg-blue-500', text: 'text-blue-400' },
    purple: { bar: 'bg-purple-500', text: 'text-purple-400' },
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            Public Trust Index
          </h3>
          <p className="text-xs text-gray-500 mt-1">Aggregated from 4 key metrics</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Chart */}
        <div className="relative w-56 h-56 flex-shrink-0">
          <Doughnut data={chartData} options={chartOptions} />
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{overall}</span>
            <span className="text-xs text-gray-400 mt-1">Trust Score</span>
          </div>
        </div>

        {/* Metric Breakdown */}
        <div className="flex-1 w-full space-y-4">
          {metricItems.map(item => (
            <div key={item.key} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.color === 'teal' ? 'bg-teal-500/15' :
                item.color === 'amber' ? 'bg-amber-500/15' :
                item.color === 'blue' ? 'bg-blue-500/15' : 'bg-purple-500/15'
              }`}>
                <item.icon className={`w-4 h-4 ${colorMap[item.color].text}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{item.label}</span>
                  <span className={`text-sm font-bold ${colorMap[item.color].text}`}>{item.value}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${colorMap[item.color].bar}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
