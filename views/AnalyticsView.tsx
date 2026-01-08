
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie } from 'recharts';
import { SleepRecord } from '../types';

interface AnalyticsViewProps {
  records: SleepRecord[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ records }) => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  const chartData = useMemo(() => {
    if (period === 'day') {
      return [
        { name: '00시', time: 0, score: 0 },
        { name: '02시', time: 2, score: 80 },
        { name: '04시', time: 4, score: 90 },
        { name: '06시', time: 6, score: 85 },
        { name: '08시', time: 7.5, score: 95 },
      ];
    }
    if (period === 'month') {
      return [
        { name: '1주', time: 6.8, score: 72 },
        { name: '2주', time: 7.4, score: 85 },
        { name: '3주', time: 7.1, score: 78 },
        { name: '4주', time: 8.2, score: 92 },
      ];
    }
    return [
      { name: '월', time: 7.2, score: 85 },
      { name: '화', time: 6.5, score: 70 },
      { name: '수', time: 8.0, score: 92 },
      { name: '목', time: 5.8, score: 62 },
      { name: '금', time: 7.5, score: 78 },
      { name: '토', time: 9.2, score: 95 },
      { name: '일', time: 8.5, score: 88 },
    ];
  }, [period]);

  const stageData = [
    { name: '깊은 수면', value: 25, color: '#5337CF' },
    { name: '얕은 수면', value: 55, color: '#FFC62C' },
    { name: '렘 수면', value: 20, color: '#D8B4FE' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-dark tracking-tight">수면 리포트</h1>

      {/* Period Toggles */}
      <div className="bg-white p-1.5 rounded-[1.5rem] flex gap-1 border border-gray-100 shadow-sm">
        {(['day', 'week', 'month'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all duration-300 ${period === p ? 'bg-secondary text-white shadow-md scale-[1.02]' : 'text-gray-400 hover:text-dark'}`}
          >
            {p === 'day' ? '일간' : p === 'week' ? '주간' : '월간'}
          </button>
        ))}
      </div>

      {/* Main Stats Card */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-dark text-sm tracking-tight">
            {period === 'day' ? '시간별 수면 흐름' : period === 'week' ? '요일별 수면 시간' : '주차별 수면 분석'}
          </h3>
          <span className="text-[10px] text-secondary bg-purple-50 px-2 py-1 rounded-lg font-bold">AVG 7.4h</span>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {period === 'day' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFC62C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFC62C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F9FAFB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#D1D5DB' }} />
                <Area type="monotone" dataKey="time" stroke="#FFC62C" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F9FAFB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#D1D5DB' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="time" fill="#5337CF" radius={[10, 10, 10, 10]} barSize={period === 'week' ? 12 : 25} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-softGray p-4 rounded-2xl">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">최장 수면</p>
            <p className="text-lg font-black text-dark">9h 12m</p>
          </div>
          <div className="bg-softGray p-4 rounded-2xl">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">수면 효율</p>
            <p className="text-lg font-black text-secondary">92%</p>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h3 className="font-bold text-dark text-sm mb-6">단계별 분포</h3>
        <div className="flex items-center gap-8">
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stageData} innerRadius={40} outerRadius={55} paddingAngle={8} dataKey="value" cornerRadius={10}>
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-gray-400 font-bold">깊은잠</span>
              <span className="text-xs font-black text-dark">25%</span>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            {stageData.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md" style={{ backgroundColor: s.color }}></div>
                  <span className="text-[11px] font-bold text-gray-500">{s.name}</span>
                </div>
                <span className="text-[11px] font-black text-dark">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-secondary p-6 rounded-[2.5rem] text-white">
        <p className="text-xs font-bold opacity-70 mb-2 uppercase tracking-widest">Monggle AI Insight</p>
        <p className="text-sm font-medium leading-relaxed">
          "{period === 'month' ? '이번 달은 지난달보다 규칙적인 수면 패턴을 보여주고 있어요!' : '주말에 부족한 잠을 보충하고 계시네요. 주중 수면 시간 확보가 필요해 보여요.'}"
        </p>
      </div>
    </div>
  );
};

export default AnalyticsView;
