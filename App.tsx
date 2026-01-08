
import React, { useState, useEffect } from 'react';
import { TabType, SleepRecord, RoutineItem } from './types';
import HomeView from './views/HomeView';
import RecordView from './views/RecordView';
import AnalyticsView from './views/AnalyticsView';
import RoutineView from './views/RoutineView';
import AICareView from './views/AICareView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [routines, setRoutines] = useState<RoutineItem[]>([
    { id: '1', name: '따뜻한 차 마시기', icon: 'fa-mug-hot', time: '22:30', enabled: true, isCustom: false },
    { id: '2', name: '스마트폰 멀리하기', icon: 'fa-mobile-screen-button', time: '23:00', enabled: true, isCustom: false },
    { id: '3', name: '스트레칭 10분', icon: 'fa-person-walking', time: '22:00', enabled: false, isCustom: false },
    { id: '4', name: '백색 소음 듣기', icon: 'fa-wind', time: '23:15', enabled: true, isCustom: false },
  ]);

  useEffect(() => {
    const mockRecords: SleepRecord[] = [
      {
        id: 'r1',
        date: '2024-12-20',
        score: 88,
        duration: 480,
        deepSleep: 30,
        lightSleep: 50,
        remSleep: 20,
        mood: '😊 상쾌함',
        satisfaction: 5,
        title: '정말 푹 자고 개운한 날',
        memo: '어제 차 마시고 바로 잠들었음. 꿈도 안 꾸고 진짜 깊게 잠. 아침에 알람 없이 눈 뜸.',
        tags: ['완벽한수면', '상쾌함']
      },
      {
        id: 'r2',
        date: '2024-12-19',
        score: 65,
        duration: 350,
        deepSleep: 15,
        lightSleep: 65,
        remSleep: 20,
        mood: '😴 피곤함',
        satisfaction: 2,
        title: '새벽에 자꾸 깬 밤',
        memo: '악몽 꾸고 3시쯤 깼음. 다시 잠들기 힘들었음. 오늘 하루종일 멍함.',
        tags: ['악몽', '중간깸']
      },
      {
        id: 'r3',
        date: '2024-12-15',
        score: 75,
        duration: 420,
        deepSleep: 20,
        lightSleep: 60,
        remSleep: 20,
        mood: '😑 보통',
        satisfaction: 3,
        title: '무난하게 잘 잔 날',
        memo: '그냥저냥 잘 잤음. 특별한 꿈은 없었음.',
        tags: ['평범함']
      }
    ];
    setRecords(mockRecords);
  }, []);

  const handleAddRecord = (record: SleepRecord) => {
    setRecords(prev => {
      const exists = prev.find(r => r.id === record.id);
      if (exists) {
        return prev.map(r => r.id === record.id ? record : r);
      }
      return [record, ...prev];
    });
  };

  const handleDeleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView onNavigateRecord={() => setActiveTab('record')} latestRecord={records[0]} />;
      case 'record': return <RecordView records={records} onAddRecord={handleAddRecord} />;
      case 'analytics': return <AnalyticsView records={records} />;
      case 'routine': return <RoutineView routines={routines} setRoutines={setRoutines} onDeleteRoutine={handleDeleteRoutine} />;
      case 'aicare': return <AICareView />;
      default: return <HomeView onNavigateRecord={() => setActiveTab('record')} latestRecord={records[0]} />;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-softGray relative overflow-hidden shadow-2xl border-x border-gray-100">
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">
        {renderView()}
      </div>

      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-4 px-2 z-50 rounded-t-[2.5rem] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="fa-house" label="홈" />
        <NavButton active={activeTab === 'record'} onClick={() => setActiveTab('record')} icon="fa-calendar-days" label="기록" />
        <NavButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon="fa-chart-pie" label="리포트" />
        <NavButton active={activeTab === 'routine'} onClick={() => setActiveTab('routine')} icon="fa-moon" label="수면 루틴" />
        <NavButton active={activeTab === 'aicare'} onClick={() => setActiveTab('aicare')} icon="fa-wand-magic-sparkles" label="악몽 해석" />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5 w-16 group transition-all">
    <div className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? 'bg-primary text-dark shadow-lg shadow-primary/30 scale-110' : 'text-gray-400'}`}>
      <i className={`fa-solid ${icon} text-lg`}></i>
    </div>
    <span className={`text-[11px] font-bold transition-colors ${active ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
  </button>
);

export default App;
