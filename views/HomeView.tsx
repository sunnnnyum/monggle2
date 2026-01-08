
import React from 'react';
import { SleepRecord } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface HomeViewProps {
  onNavigateRecord: () => void;
  latestRecord?: SleepRecord;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigateRecord, latestRecord }) => {
  const score = latestRecord?.score || 0;

  // 데이터 편차를 키워 더 역동적인 모양(덜 완만한 모양)을 생성
  const radarData = [
    { subject: '수면 깊이', A: 55, fullMark: 100 },
    { subject: '규칙성', A: 95, fullMark: 100 },
    { subject: '총 시간', A: score, fullMark: 100 },
    { subject: '효율', A: 65, fullMark: 100 },
    { subject: '만족도', A: 85, fullMark: 100 },
  ];
  
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700">
      <header className="flex justify-between items-center py-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-dark text-lg shadow-lg shadow-primary/20">
            <i className="fa-solid fa-moon"></i>
          </div>
          <span className="text-2xl font-black text-dark tracking-tighter">Monggle</span>
        </div>
        
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100 flex-shrink-0">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary/10 p-6 rounded-[2rem] border border-primary/20 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">어젯밤 점수</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-dark tracking-tighter">{score}</span>
            <span className="text-sm font-bold text-gray-400">/ 100</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">총 수면 시간</p>
          <p className="text-lg font-black text-dark tracking-tight">
            {Math.floor((latestRecord?.duration || 0) / 60)}h {(latestRecord?.duration || 0) % 60}m
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col items-center">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">수면 밸런스 도형</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} />
              <Radar
                name="SleepQuality"
                dataKey="A"
                stroke="#FFC62C"
                strokeWidth={4}
                fill="#FFC62C"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-[11px] font-medium text-gray-400 text-center leading-relaxed">
           규칙성이 매우 우수함. <br/> <span className="text-secondary font-bold">수면 효율</span>과 <span className="text-secondary font-bold">깊은 잠</span> 비중만 조금 더 높여보기!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricItem icon="fa-bed" label="깊은 잠" value={`${latestRecord?.deepSleep || 0}%`} color="text-secondary" />
        <MetricItem icon="fa-eye" label="렘 수면" value={`${latestRecord?.remSleep || 0}%`} color="text-secondary" />
        <MetricItem icon="fa-bolt" label="각성 시간" value="5%" color="text-primary" />
      </div>

      <button 
        onClick={onNavigateRecord}
        className="w-full bg-primary text-dark py-5 rounded-2xl font-bold shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
      >
        오늘 수면 기록 남기기
      </button>

      <div className="bg-secondary/5 p-6 rounded-[2rem] border border-secondary/10">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex-shrink-0 flex items-center justify-center text-secondary">
            <i className="fa-solid fa-wind text-sm"></i>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            자기 전 미지근한 물 샤워는 체온을 낮춰 깊은 잠에 도움을 줌. 오늘 한번 시도해보기!
          </p>
        </div>
      </div>
    </div>
  );
};

const MetricItem: React.FC<{ icon: string, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-3xl border border-gray-100 flex flex-col items-center justify-center gap-1 shadow-sm h-24">
    <i className={`fa-solid ${icon} ${color} text-xs mb-1 opacity-70`}></i>
    <p className="text-[10px] text-gray-400 font-bold tracking-tight text-center">{label}</p>
    <p className="text-xs font-black text-dark text-center">{value}</p>
  </div>
);

export default HomeView;
