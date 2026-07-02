import { useEffect, useState } from 'react';
import { workoutApi } from '../api/workouts.api';
import { BODY_PART_LABELS, BodyPart, WorkoutType, type WorkoutCheck } from '../types/workout';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

// 이번 주 월~일 날짜 문자열 7개 생성
function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay(); // 일=0, 월=1 ...
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
}

function toDateString(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const WorkoutWidget = () => {
  const [workouts, setWorkouts] = useState<WorkoutCheck[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<WorkoutType>(WorkoutType.GYM);
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekDates = getWeekDates();
  const todayStr = toDateString(new Date());

  useEffect(() => {
    workoutApi
      .getAll()
      .then(setWorkouts)
      .catch((err) => console.error('Error fetching workouts:', err));
  }, []);

  const togglePart = (part: BodyPart) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part],
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const created = await workoutApi.create({
        workoutType: selectedType,
        bodyParts: selectedType === WorkoutType.GYM ? selectedParts : undefined,
      });
      setWorkouts((prev) => [...prev, created]);
      setIsFormOpen(false);
      setSelectedParts([]);
    } catch (err) {
      console.error('Error creating workout:', err);
      alert('기록 저장에 실패했습니다. 백엔드 연결을 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='bg-card border-border rounded-3xl border p-6 shadow-sm'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-extrabold text-gray-900 dark:text-white'>오운완 체크 🏋️</h2>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>이번 주 운동 기록</p>
        </div>
        <button
          onClick={() => setIsFormOpen((v) => !v)}
          className='bg-primary text-primary-foreground shadow-primary/20 cursor-pointer rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition-all hover:opacity-95 active:scale-[0.98]'
        >
          {isFormOpen ? '닫기' : '오운완!'}
        </button>
      </div>

      {/* 주간 동그라미 */}
      <div className='mt-6 grid grid-cols-7 gap-2'>
        {weekDates.map((date, i) => {
          const dayWorkouts = workouts.filter((w) => w.date === date);
          const isToday = date === todayStr;
          const done = dayWorkouts.length > 0;

          return (
            <div key={date} className='flex flex-col items-center gap-2'>
              <span
                className={`text-xs font-semibold ${
                  isToday ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {DAY_LABELS[i]}
              </span>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-base transition-all ${
                  done
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                    : isToday
                      ? 'border-primary border-dashed'
                      : 'border-border'
                }`}
              >
                {dayWorkouts.map((w) => (w.workoutType === WorkoutType.GYM ? '🏋️' : '⚽')).join('')}
              </div>
              <span className='h-4 text-[10px] text-gray-500 dark:text-gray-400'>
                {dayWorkouts
                  .flatMap((w) => w.bodyParts)
                  .map((p) => BODY_PART_LABELS[p])
                  .join('·')}
              </span>
            </div>
          );
        })}
      </div>

      {/* 기록 폼 */}
      {isFormOpen && (
        <div className='border-border mt-6 space-y-4 border-t pt-6'>
          <div className='flex gap-2'>
            {[
              { type: WorkoutType.GYM, label: '🏋️ 헬스' },
              { type: WorkoutType.SPORTS, label: '⚽ 스포츠' },
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-bold transition-all ${
                  selectedType === type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-gray-500 dark:text-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {selectedType === WorkoutType.GYM && (
            <div className='flex flex-wrap gap-2'>
              {Object.values(BodyPart).map((part) => (
                <button
                  key={part}
                  onClick={() => togglePart(part)}
                  className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedParts.includes(part)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'border-border text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {BODY_PART_LABELS[part]}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting || (selectedType === WorkoutType.GYM && selectedParts.length === 0)
            }
            className='bg-primary text-primary-foreground w-full cursor-pointer rounded-xl py-2.5 text-sm font-bold transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40'
          >
            {isSubmitting ? '저장 중...' : '기록하기'}
          </button>
        </div>
      )}
    </section>
  );
};
