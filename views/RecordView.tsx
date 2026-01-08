
import React, { useState } from 'react';
import { SleepRecord } from '../types';

interface RecordViewProps {
  records: SleepRecord[];
  onAddRecord: (record: SleepRecord) => void;
}

const MOOD_OPTIONS = [
  { emoji: '😊', label: '상쾌함' },
  { emoji: '😴', label: '피곤함' },
  { emoji: '😰', label: '불안함' },
  { emoji: '😑', label: '보통' },
  { emoji: '😖', label: '악몽' },
  { emoji: '🤩', label: '활기참' },
];

const RecordView: React.FC<RecordViewProps> = ({ records, onAddRecord }) => {
  const [view, setView] = useState<'record' | 'form'>('record');
  const [subTab, setSubTab] = useState<'calendar' | 'archive'>('calendar');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const year = 2024;
  const month = 12;
  const [selectedDate, setSelectedDate] = useState(`${year}-${month}-20`);
  
  const todayRecord = records.find(r => r.date === selectedDate);
  const daysInMonth = Array.from({ length: 31 }, (_, i) => `${year}-${month}-${(i + 1).toString().padStart(2, '0')}`);

  const [mood, setMood] = useState('😊 상쾌함');
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');

  const handleEdit = (record: SleepRecord) => {
    setEditingId(record.id);
    setSelectedDate(record.date);
    setMood(record.mood);
    setTitle(record.title);
    setMemo(record.memo);
    setView('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: SleepRecord = {
      id: editingId || Date.now().toString(),
      date: selectedDate,
      score: 75 + Math.floor(Math.random() * 20),
      duration: 420 + Math.floor(Math.random() * 60),
      deepSleep: 20 + Math.floor(Math.random() * 10),
      lightSleep: 50 + Math.floor(Math.random() * 10),
      remSleep: 20 + Math.floor(Math.random() * 5),
      mood,
      satisfaction: 3 + Math.floor(Math.random() * 3),
      title,
      memo,
      tags: ['기록됨']
    };
    onAddRecord(record);
    setView('record');
    setEditingId(null);
    setTitle('');
    setMemo('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-dark tracking-tight">수면 기록</h1>
        {view === 'record' && (
          <button onClick={() => { setEditingId(null); setTitle(''); setMemo(''); setView('form'); }} className="w-10 h-10 bg-primary text-dark rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform">
            <i className="fa-solid fa-plus"></i>
          </button>
        )}
      </div>

      {view === 'record' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            <button onClick={() => setSubTab('calendar')} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${subTab === 'calendar' ? 'bg-primary text-dark shadow-md' : 'text-gray-400'}`}>캘린더</button>
            <button onClick={() => setSubTab('archive')} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${subTab === 'archive' ? 'bg-primary text-dark shadow-md' : 'text-gray-400'}`}>아카이브</button>
          </div>

          {subTab === 'calendar' ? (
            <div className="space-y-6 animate-in slide-in-from-left-2">
              <div className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6 px-2">
                  <span className="font-bold text-dark">{year}년 {month}월</span>
                  <div className="flex gap-4">
                    <i className="fa-solid fa-chevron-left text-gray-300 text-xs cursor-pointer"></i>
                    <i className="fa-solid fa-chevron-right text-dark text-xs cursor-pointer"></i>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center">
                  {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-gray-300 uppercase py-2">{d}</span>
                  ))}
                  {daysInMonth.map((date) => {
                    const hasRecord = records.some(r => r.date === date);
                    const isSelected = selectedDate === date;
                    const dayNum = new Date(date).getDate();
                    return (
                      <button key={date} onClick={() => setSelectedDate(date)} className="relative flex flex-col items-center justify-center h-10 w-full">
                        <span className={`text-sm font-medium z-10 ${isSelected ? 'text-dark font-bold' : 'text-dark'}`}>{dayNum}</span>
                        {isSelected && <div className="absolute inset-0 bg-primary rounded-xl scale-90"></div>}
                        {hasRecord && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-secondary rounded-full"></div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-dark px-2">선택한 날의 기록</h3>
                {todayRecord ? (
                  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in slide-in-from-bottom-2 space-y-5">
                    {/* 상단: 기분 및 기본 정보 */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-softGray rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                          {todayRecord.mood.split(' ')[0]}
                        </div>
                        <div>
                          <p className="font-black text-dark text-lg">{todayRecord.mood.split(' ')[1]}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400 font-bold">{todayRecord.date}</span>
                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                            <span className="text-[10px] text-secondary font-black">
                              {Math.floor(todayRecord.duration / 60)}h {todayRecord.duration % 60}m 수면
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(todayRecord)} className="text-gray-300 hover:text-secondary p-2 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                        </div>
                        <div className="bg-primary text-dark px-3 py-1 rounded-full font-black text-xs shadow-sm">{todayRecord.score}점</div>
                      </div>
                    </div>

                    {/* 수면 메트릭 상세 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-softGray p-4 rounded-2xl">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">만족도</p>
                        <div className="flex gap-0.5 text-secondary text-[10px]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`fa-solid fa-star ${i < todayRecord.satisfaction ? 'opacity-100' : 'opacity-20 text-gray-400'}`}></i>
                          ))}
                        </div>
                      </div>
                      <div className="bg-softGray p-4 rounded-2xl">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1 text-right">깊은 수면</p>
                        <p className="text-sm font-black text-dark text-right">{todayRecord.deepSleep}%</p>
                      </div>
                    </div>

                    {/* 수면 단계 시각화 바 */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end mb-1 px-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Sleep Stages</p>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden">
                        <div style={{ width: `${todayRecord.deepSleep}%` }} className="h-full bg-secondary" title="Deep Sleep"></div>
                        <div style={{ width: `${todayRecord.lightSleep}%` }} className="h-full bg-primary" title="Light Sleep"></div>
                        <div style={{ width: `${todayRecord.remSleep}%` }} className="h-full bg-purple-300" title="REM Sleep"></div>
                      </div>
                      <div className="flex justify-between text-[9px] font-bold px-1">
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div><span className="text-gray-500">깊은잠 {todayRecord.deepSleep}%</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div><span className="text-gray-500">얕은잠 {todayRecord.lightSleep}%</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-300"></div><span className="text-gray-500">REM {todayRecord.remSleep}%</span></div>
                      </div>
                    </div>

                    {/* 제목 및 메모 */}
                    <div className="pt-2 border-t border-gray-50">
                      <h4 className="font-bold text-dark mb-2 text-sm">"{todayRecord.title}"</h4>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{todayRecord.memo}</p>
                      <div className="flex flex-wrap gap-2">
                        {todayRecord.tags.map(t => <span key={t} className="text-[9px] bg-secondary/5 px-2.5 py-1 rounded-lg text-secondary font-bold">#{t}</span>)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/50 border-2 border-dashed border-gray-100 p-10 rounded-[2.5rem] text-center">
                    <p className="text-gray-400 text-sm mb-4">이 날은 수면 기록이 없어요</p>
                    <button onClick={() => { setEditingId(null); setTitle(''); setMemo(''); setView('form'); }} className="text-primary font-bold text-xs underline underline-offset-4">기록 추가하기</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right-2">
              <div className="px-2 flex justify-between items-center">
                <h3 className="font-bold text-dark">수면 아카이브</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{records.length} Records</span>
              </div>
              <div className="space-y-4">
                {records.map(record => (
                  <div key={record.id} onClick={() => { setSelectedDate(record.date); setSubTab('calendar'); }} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl group-hover:scale-110 transition-transform">{record.mood.split(' ')[0]}</span>
                        <span className="text-[10px] font-bold text-dark bg-primary/20 px-2 py-0.5 rounded-lg">{record.date}</span>
                      </div>
                      <span className="text-xs font-black text-dark">{record.score}점</span>
                    </div>
                    <h4 className="font-bold text-dark text-sm mb-1">{record.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">{record.memo}</p>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                      <div className="flex gap-2">
                        {record.tags.map(t => <span key={t} className="text-[9px] text-gray-400">#{t}</span>)}
                      </div>
                      <span className="text-[9px] text-gray-300 font-bold">{Math.floor(record.duration / 60)}h {record.duration % 60}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-xl animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-dark">{editingId ? '기록 수정' : '기록 남기기'}</h2>
            <button type="button" onClick={() => setView('record')} className="text-gray-300 hover:text-dark transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 ml-2 uppercase tracking-widest">날짜</label>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-softGray p-4 rounded-2xl outline-none font-medium border border-transparent focus:border-primary transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-3 ml-2 uppercase tracking-widest">일어난 직후 기분</label>
              <div className="grid grid-cols-3 gap-2">
                {MOOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setMood(`${opt.emoji} ${opt.label}`)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                      mood === `${opt.emoji} ${opt.label}` ? 'border-primary bg-primary/5 shadow-inner' : 'border-transparent bg-softGray'
                    }`}
                  >
                    <span className="text-xl mb-1">{opt.emoji}</span>
                    <span className="text-[10px] font-bold text-gray-500">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 ml-2 uppercase tracking-widest">오늘의 한 줄</label>
              <input 
                type="text" 
                required 
                placeholder="어제 잠은 어땠어?" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-softGray p-4 rounded-2xl outline-none font-medium border border-transparent focus:border-primary transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 ml-2 uppercase tracking-widest">수면 메모</label>
              <textarea 
                rows={3} 
                placeholder="꿈 내용이나 잠들기 전 상황..." 
                value={memo} 
                onChange={(e) => setMemo(e.target.value)} 
                className="w-full bg-softGray p-4 rounded-2xl outline-none resize-none font-medium border border-transparent focus:border-primary transition-all" 
              />
            </div>
          </div>

          <button className="w-full bg-primary text-dark py-5 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
            {editingId ? '기록 업데이트' : '기록 저장'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RecordView;
