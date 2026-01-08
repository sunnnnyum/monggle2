
import React, { useState } from 'react';
import { RoutineItem } from '../types';

interface RoutineViewProps {
  routines: RoutineItem[];
  setRoutines: React.Dispatch<React.SetStateAction<RoutineItem[]>>;
  onDeleteRoutine: (id: string) => void;
}

const RECOMMENDED_ROUTINES = [
  { name: '따뜻한 우유 한 잔', icon: 'fa-glass-water', time: '22:15' },
  { name: '4-7-8 호흡법', icon: 'fa-lungs', time: '23:00' },
  { name: '라벤더 오일 향 맡기', icon: 'fa-spa', time: '22:45' },
];

const RoutineView: React.FC<RoutineViewProps> = ({ routines, setRoutines, onDeleteRoutine }) => {
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:30');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineTime, setNewRoutineTime] = useState('22:00');

  const toggleRoutine = (id: string) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const addRoutine = () => {
    if (!newRoutineName.trim()) return;
    const newItem: RoutineItem = {
      id: Date.now().toString(),
      name: newRoutineName,
      icon: 'fa-sparkles',
      enabled: true,
      isCustom: true,
      time: newRoutineTime
    };
    setRoutines([...routines, newItem]);
    setNewRoutineName('');
    setNewRoutineTime('22:00');
    setShowAddModal(false);
  };

  const addRecommendedRoutine = (rec: typeof RECOMMENDED_ROUTINES[0]) => {
    const isDuplicate = routines.some(r => r.name === rec.name);
    if (isDuplicate) {
      alert('이미 추가된 루틴이에요!');
      return;
    }
    const newItem: RoutineItem = {
      id: Date.now().toString(),
      name: rec.name,
      icon: rec.icon,
      enabled: true,
      isCustom: true,
      time: rec.time
    };
    setRoutines([...routines, newItem]);
  };

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-dark tracking-tight">수면 루틴 설정</h1>
        <p className="text-[11px] text-gray-400 mt-1 italic font-medium">취침 1시간 전이 수면의 골든타임!</p>
      </header>

      {/* 목표 시간 설정 */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="font-bold text-dark text-[11px] uppercase tracking-widest mb-4 ml-1">목표 시간 설정</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-softGray p-3 rounded-2xl flex flex-col items-center border border-transparent focus-within:border-primary transition-all">
            <span className="text-[9px] text-gray-400 font-bold uppercase mb-1">취침</span>
            <input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)} className="bg-transparent text-lg font-black text-dark outline-none w-full text-center" />
          </div>
          <div className="flex-shrink-0 text-secondary opacity-30 px-1">
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </div>
          <div className="flex-1 bg-softGray p-3 rounded-2xl flex flex-col items-center border border-transparent focus-within:border-primary transition-all">
            <span className="text-[9px] text-gray-400 font-bold uppercase mb-1">기상</span>
            <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="bg-transparent text-lg font-black text-dark outline-none w-full text-center" />
          </div>
        </div>
      </div>

      {/* 루틴 리스트 (직사각형 토글 형식) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-dark text-xs uppercase tracking-widest">수면 루틴</h3>
          <button onClick={() => setShowAddModal(true)} className="w-8 h-8 bg-primary text-dark rounded-xl flex items-center justify-center active:scale-90 transition-transform">
            <i className="fa-solid fa-plus text-[10px]"></i>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {routines.map(item => (
            <div key={item.id} className="relative group flex items-center bg-white p-4 rounded-[1.8rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${item.enabled ? 'bg-primary/20 text-dark' : 'bg-gray-100 text-gray-400'}`}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              
              <div className="ml-4 flex-1">
                <p className={`font-bold text-sm ${item.enabled ? 'text-dark' : 'text-gray-400 line-through'}`}>{item.name}</p>
                <p className="text-[10px] text-gray-400 font-bold">{item.time || '언제나'}</p>
              </div>

              <div className="flex items-center gap-4">
                {/* 토글 스위치 */}
                <button 
                  onClick={() => toggleRoutine(item.id)}
                  className={`w-10 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${item.enabled ? 'bg-secondary' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${item.enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </button>

                {/* 삭제 버튼 */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteRoutine(item.id); }} 
                  className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </div>
          ))}
          {routines.length === 0 && (
            <div className="text-center py-10 bg-white/50 border-2 border-dashed border-gray-200 rounded-[2rem]">
              <p className="text-gray-400 text-xs">등록된 루틴이 없어요.<br/>새로운 루틴을 만들어보세요!</p>
            </div>
          )}
        </div>
      </div>

      {/* 추천 루틴 섹션 */}
      <div className="space-y-4">
        <h3 className="font-bold text-dark text-xs uppercase tracking-widest px-2">추천 루틴</h3>
        <div className="flex flex-col gap-3">
          {RECOMMENDED_ROUTINES.map((rec) => (
            <div key={rec.name} className="flex items-center bg-white/60 p-4 rounded-[1.8rem] border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-sm flex-shrink-0">
                <i className={`fa-solid ${rec.icon}`}></i>
              </div>
              <div className="ml-4 flex-1">
                <p className="font-bold text-dark text-xs">{rec.name}</p>
                <p className="text-[9px] text-gray-400 font-bold">평균 추천 시간: {rec.time}</p>
              </div>
              <button 
                onClick={() => addRecommendedRoutine(rec)}
                className="px-4 py-2 bg-primary/20 text-dark rounded-xl text-[10px] font-bold hover:bg-primary transition-colors"
              >
                추가
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 루틴 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-6 z-[60]">
          <div className="bg-white w-full rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-dark">새 루틴 만들기</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-300"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 ml-1 uppercase">루틴 이름</label>
                <input 
                  type="text" 
                  placeholder="예: 독서하기, 명상하기" 
                  value={newRoutineName} 
                  onChange={(e) => setNewRoutineName(e.target.value)} 
                  className="w-full bg-softGray p-4 rounded-2xl outline-none font-medium text-sm border border-transparent focus:border-primary transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 ml-1 uppercase">수행 시간</label>
                <input 
                  type="time" 
                  value={newRoutineTime} 
                  onChange={(e) => setNewRoutineTime(e.target.value)} 
                  className="w-full bg-softGray p-4 rounded-2xl outline-none font-medium text-sm border border-transparent focus:border-primary transition-all" 
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-gray-400 font-bold text-sm">취소</button>
              <button onClick={addRoutine} className="flex-1 py-4 bg-primary text-dark rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all">추가하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineView;
