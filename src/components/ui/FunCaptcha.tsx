import { useState, useEffect, useRef } from 'react';
import { ShieldAlert, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface FunCaptchaProps {
  onSuccess: () => void;
}

export function FunCaptcha({ onSuccess }: FunCaptchaProps) {
  const [captchaType, setCaptchaType] = useState<'math' | 'slider'>('math');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [solved, setSolved] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  const generateCaptcha = () => {
    const type = Math.random() > 0.5 ? 'math' : 'slider';
    setCaptchaType(type);
    
    if (type === 'math') {
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setAnswer('');
    } else {
      setSliderValue(0);
    }
    setError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer) === num1 + num2) {
      handleSuccess();
    } else {
      setError(true);
      generateCaptcha();
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    if (val > 95) {
      handleSuccess();
    }
  };

  const handleSuccess = () => {
    setSolved(true);
    setError(false);
    setTimeout(() => {
      onSuccess();
    }, 800);
  };

  if (solved) {
    return (
      <div className="bg-emerald-950/30 border border-emerald-700/30 rounded-xl p-6 text-center animate-scaleIn">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
        <h3 className="text-lg font-bold text-emerald-300">Проверка пройдена!</h3>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-red-500/30 rounded-xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-slideUp">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Подозрительная активность</h3>
          <p className="text-sm text-[var(--text-secondary)]">Докажите, что вы человек</p>
        </div>
      </div>

      {captchaType === 'math' ? (
        <form onSubmit={handleMathSubmit} className="space-y-4">
          <div className="flex items-center justify-center gap-4 bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-default)]">
            <span className="text-2xl font-bold text-[var(--accent)]">{num1}</span>
            <span className="text-xl font-medium text-[var(--text-muted)]">+</span>
            <span className="text-2xl font-bold text-[var(--accent)]">{num2}</span>
            <span className="text-xl font-medium text-[var(--text-muted)]">=</span>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`w-20 bg-[var(--bg-base)] border ${error ? 'border-red-500 text-red-400' : 'border-[var(--border-default)]'} rounded-lg px-3 py-2 text-xl font-bold text-center focus:outline-none focus:border-[var(--accent)]`}
              placeholder="?"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center animate-shake">
              Неверно! Попробуйте еще раз.
            </p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={generateCaptcha} className="px-3">
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button type="submit" className="flex-1">
              Подтвердить
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-default)] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-sm font-medium text-[var(--text-muted)] opacity-50 uppercase tracking-widest">
                Потяните ползунок вправо
              </span>
            </div>
            
            <div className="relative h-12 flex items-center">
              <div 
                className="absolute left-0 h-full bg-[var(--accent)]/20 rounded-l-lg transition-all duration-75"
                style={{ width: `${sliderValue}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              />
              <div 
                className="absolute h-10 w-10 bg-[var(--accent)] rounded-md shadow-lg flex items-center justify-center pointer-events-none transition-all duration-75 z-10"
                style={{ left: `calc(${sliderValue}% - ${sliderValue * 0.4}px)` }}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={generateCaptcha} className="w-full">
              <RefreshCw className="w-5 h-5 mr-2" />
              Сменить задание
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
