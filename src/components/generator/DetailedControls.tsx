'use client'; 
 import { DetailedFields } from '@/types'; 
 import { Input } from '@/components/ui/Input'; 
 import { Textarea } from '@/components/ui/Textarea'; 
 import { Select } from '@/components/ui/Select'; 
 import { ChevronDown } from 'lucide-react'; 
 import { useState } from 'react'; 
 
 interface DetailedControlsProps { 
   value: DetailedFields; 
   onChange: (fields: DetailedFields) => void; 
 } 
 
 function field<K extends keyof DetailedFields>( 
   value: DetailedFields, 
   onChange: (fields: DetailedFields) => void, 
   key: K 
 ) { 
   return (v: string) => onChange({ ...value, [key]: v }); 
 } 
 
const EMOTION_OPTIONS = [ 
  { value: '', label: 'Любая / Не указано' }, 
  { value: 'shocked', label: '😮 Шокированный' }, 
  { value: 'excited', label: '🤩 Взволнованный' }, 
  { value: 'happy', label: '😄 Счастливый' }, 
  { value: 'confident', label: '😎 Уверенный' }, 
  { value: 'serious', label: '😐 Серьёзный' }, 
  { value: 'determined', label: '💪 Решительный' }, 
  { value: 'surprised', label: '😲 Удивлённый' }, 
  { value: 'laughing', label: '😂 Смеющийся' }, 
  { value: 'disgusted', label: '🤢 Отвращение' }, 
  { value: 'angry', label: '😡 Злой' }, 
  { value: 'fearful', label: '😱 Испуганный' }, 
  { value: 'smug', label: '😏 Самодовольный' }, 
  { value: 'suspicious', label: '🤨 Подозрительный' }, 
]; 

const COMPOSITION_OPTIONS = [ 
  { value: '', label: 'Любая / Не указано' }, 
  { value: 'center focus', label: 'Центральный фокус' }, 
  { value: 'rule of thirds', label: 'Правило третей' }, 
  { value: 'close-up face', label: 'Крупный план лица' }, 
  { value: 'split layout — person left, graphic right', label: 'Разделённый макет (Человек + Графика)' }, 
  { value: 'dramatic low angle', label: 'Драматичный нижний угол' }, 
  { value: 'dramatic high angle', label: 'Драматичный верхний угол' }, 
  { value: 'over-the-shoulder', label: 'Через плечо' }, 
  { value: 'side by side comparison', label: 'До / После сравнение' }, 
  { value: 'zoomed out wide shot', label: 'Широкий план' }, 
  { value: 'extreme close-up on eyes', label: 'Экстремальный крупный план (Глаза)' }, 
]; 

const STYLE_OPTIONS = [ 
  { value: '', label: 'Любой / Не указано' }, 
  { value: 'realistic cinematic photography', label: 'Реалистичная кинематография' }, 
  { value: 'bold graphic design', label: 'Яркий графический дизайн' }, 
  { value: 'neon vibrant', label: 'Неоновый / Яркий' }, 
  { value: 'minimalist clean', label: 'Минималистичный чистый' }, 
  { value: 'dark dramatic', label: 'Тёмный драматичный' }, 
  { value: 'vlog casual', label: 'Влог повседневный' }, 
  { value: 'luxury polished', label: 'Роскошный полированный' }, 
  { value: 'retro vintage', label: 'Ретро / Винтаж' }, 
  { value: 'anime illustrated', label: 'Аниме / Иллюстрация' }, 
  { value: 'comic book pop art', label: 'Комикс / Поп-арт' }, 
  { value: 'news broadcast', label: 'Стиль новостей' }, 
  { value: 'gaming', label: 'Игровой' }, 
];
 
 export function DetailedControls({ value, onChange }: DetailedControlsProps) { 
   const [expanded, setExpanded] = useState(true); 
   const set = <K extends keyof DetailedFields> (k: K) => field(value, onChange, k); 
 
   const filledCount = Object.values(value).filter((v) => v.trim()).length; 
 
   return ( 
     <div className="border border-[var(--border-default)] rounded-xl overflow-hidden"> 
       {/* Accordion header */} 
        <button 
          type="button" 
          onClick={() => setExpanded(!expanded)} 
          className="w-full flex items-center justify-between px-4 py-3.5 bg-[var(--bg-base)] hover:bg-[var(--bg-card)] transition-colors text-left" 
        > 
          <div className="flex items-center gap-2.5"> 
            <span className="text-sm font-semibold text-[var(--text-primary)]">Детальные настройки</span> 
            {filledCount > 0 && ( 
              <span className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-glow)] border border-[var(--accent)]/20 px-1.5 py-0.5 rounded-full"> 
                {filledCount} заполнено 
              </span> 
            )} 
          </div> 
          <ChevronDown 
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${ 
              expanded ? 'rotate-180' : '' 
            }`} 
          /> 
        </button>
 
       {/* Fields */} 
       {expanded && ( 
          <div className="p-4 space-y-4 bg-[var(--bg-base)] border-t border-[var(--border-subtle)]"> 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
              <Input 
                label="Лицо / Персонаж" 
                placeholder="например: молодой человек в очках, каштановые волосы" 
                value={value.face} 
                onChange={(e) => set('face')(e.target.value)} 
              /> 
              <Select 
                label="Эмоция / Выражение лица" 
                options={EMOTION_OPTIONS} 
                value={value.emotion} 
                onChange={(e) => set('emotion')(e.target.value)} 
              /> 
              <Input 
                label="Объекты / Предметы" 
                placeholder="например: ноутбук, стопка денег, красная спортивная машина" 
                value={value.objects} 
                onChange={(e) => set('objects')(e.target.value)} 
              /> 
              <Input 
                label="Фон" 
                placeholder="например: размытый городской горизонт ночью" 
                value={value.background} 
                onChange={(e) => set('background')(e.target.value)} 
              /> 
              <Input 
                label="Цвета" 
                placeholder="например: красный и золотой, тёмно-синий и неоновый зелёный" 
                value={value.colors} 
                onChange={(e) => set('colors')(e.target.value)} 
              /> 
              <Input 
                label="Текст на миниатюре" 
                placeholder="например: Я ЗАРАБОТАЛ 10,000$ ЗА НЕДЕЛЮ" 
                value={value.thumbnailText} 
                onChange={(e) => set('thumbnailText')(e.target.value)} 
              /> 
              <Select 
                label="Композиция / Фокус" 
                options={COMPOSITION_OPTIONS} 
                value={value.composition} 
                onChange={(e) => set('composition')(e.target.value)} 
              /> 
              <Select 
                label="Визуальный стиль" 
                options={STYLE_OPTIONS} 
                value={value.style} 
                onChange={(e) => set('style')(e.target.value)} 
              /> 
            </div> 

            <Textarea 
              label="Дополнительные детали" 
              placeholder="Любые дополнительные инструкции — освещение, настроение, конкретные элементы, цвета бренда, что избегать..." 
              value={value.extraDetails} 
              onChange={(e) => set('extraDetails')(e.target.value)} 
              className="min-h-[80px]" 
            /> 
          </div>
       )} 
     </div> 
   ); 
 }
