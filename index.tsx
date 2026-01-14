
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- TYPES ---
interface Question {
  id: number;
  text: string;
  options: Option[];
}

interface Option {
  id: number;
  text: string;
  score: number;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  aiAnalysis?: string;
}

enum AppState {
  LANDING = 'LANDING',
  QUIZ = 'QUIZ',
  LOADING = 'LOADING',
  RESULT = 'RESULT'
}

// --- CONSTANTS ---
const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "평소 즐겨 입는 바지(하의)의 실루엣은 어떤가요?",
    options: [
      { id: 1, text: "발목이 살짝 드러나는 꽉 끼는 슬림핏/스키니핏", score: 10 },
      { id: 2, text: "깔끔하게 떨어지는 테이퍼드 핏", score: 7 },
      { id: 3, text: "요즘 유행하는 넉넉한 와이드 핏", score: 2 },
      { id: 4, text: "그냥 아무거나 집어 입는 편한 트레이닝복", score: 4 }
    ]
  },
  {
    id: 2,
    text: "메신저(카톡) 대화 시 가장 자주 사용하는 문장 부호는?",
    options: [
      { id: 1, text: "말끝마다 붙이는 '...' 이나 '^^'", score: 10 },
      { id: 2, text: "감정을 풍부하게 전달하는 '!!!' 나 'ㅠㅠ'", score: 6 },
      { id: 3, text: "깔끔하게 마침표 하나 '.', 또는 생략", score: 2 },
      { id: 4, text: "웃음을 의미하는 'ㅋㅋㅋㅋ' 연타", score: 4 }
    ]
  },
  {
    id: 3,
    text: "후배가 'T발 너 C야?'라는 말을 했을 때 당신의 반응은?",
    options: [
      { id: 1, text: "나도 MBTI 잘 안다며 T와 F의 차이를 설명해준다", score: 10 },
      { id: 2, text: "욕인 줄 알고 정색하며 예의를 따진다", score: 5 },
      { id: 3, text: "요즘 유행하는 밈인 걸 알고 웃어넘긴다", score: 2 },
      { id: 4, text: "그게 무슨 소린지 아예 못 알아듣는다", score: 3 }
    ]
  },
  {
    id: 4,
    text: "최신 인기 아이돌(뉴진스, 아이브 등)에 대해 얼마나 알고 있나요?",
    options: [
      { id: 1, text: "멤버 전원의 이름과 최근 논란까지 꿰고 있다", score: 10 },
      { id: 2, text: "이름은 모르지만 노래는 즐겨 듣고 챌린지도 안다", score: 7 },
      { id: 3, text: "그룹 이름 정도만 겨우 들어봤다", score: 3 },
      { id: 4, text: "아이돌보다는 90년대 가수가 최고라고 생각한다", score: 2 }
    ]
  },
  {
    id: 5,
    text: "SNS(인스타그램 등)에 올리는 사진의 주된 스타일은?",
    options: [
      { id: 1, text: "명품 로고가 슬쩍 보이는 설정샷이나 거울 셀카", score: 10 },
      { id: 2, text: "오운완(오늘 운동 완료) 인증샷과 근육 자랑", score: 9 },
      { id: 3, text: "풍경 사진이나 음식 사진 위주", score: 4 },
      { id: 4, text: "가족 사진이나 반려동물 사진", score: 2 }
    ]
  },
  {
    id: 6,
    text: "본인의 체력이나 신체 나이에 대해 어떻게 생각하시나요?",
    options: [
      { id: 1, text: "마음만은 20대! 아직 현역들과 뛰어도 안 밀린다", score: 10 },
      { id: 2, text: "예전 같진 않지만 영양제 먹으며 관리하면 충분하다", score: 7 },
      { id: 3, text: "비 오면 무릎 쑤시는 빼도 박도 못하는 아재/아줌마다", score: 2 },
      { id: 4, text: "체력 관리에 전혀 관심 없다", score: 4 }
    ]
  },
  {
    id: 7,
    text: "회사에서 후배들과 소통할 때 본인의 철학은?",
    options: [
      { id: 1, text: "나는 다른 꼰대들과는 달리 말이 잘 통하는 '쿨한' 선배다", score: 10 },
      { id: 2, text: "후배들 눈치를 보며 최대한 말을 아끼려고 노력한다", score: 6 },
      { id: 3, text: "공과 사를 철저히 구분하고 업무 얘기만 한다", score: 3 },
      { id: 4, text: "가끔 '라떼' 얘기를 섞어줘야 교육이 된다고 믿는다", score: 5 }
    ]
  },
  {
    id: 8,
    text: "주말에 즐기는 취미 활동 중 가장 공감되는 것은?",
    options: [
      { id: 1, text: "러닝 크루, 서핑, 테니스 등 힙해 보이는 운동", score: 10 },
      { id: 2, text: "주식/코인 투자 공부 및 관련 모임", score: 7 },
      { id: 3, text: "집에서 밀린 드라마 정주행하거나 잠자기", score: 2 },
      { id: 4, text: "낚시, 등산 등 전통적인 아재 취미", score: 5 }
    ]
  },
  {
    id: 9,
    text: "최근에 구매한 아이템 중 가장 뿌듯한 것은?",
    options: [
      { id: 1, text: "리셀가 주고 산 한정판 스니커즈", score: 10 },
      { id: 2, text: "최신형 스마트폰이나 태블릿 PC", score: 6 },
      { id: 3, text: "성능 좋은 가전제품이나 가구", score: 3 },
      { id: 4, text: "건강 기기(안마의자 등)나 고가 영양제", score: 4 }
    ]
  },
  {
    id: 10,
    text: "'영포티'라는 단어를 처음 들었을 때 당신의 느낌은?",
    options: [
      { id: 1, text: "나처럼 젊게 사는 멋진 사람들을 지칭하는 단어다", score: 10 },
      { id: 2, text: "조금 오글거리지만 나쁘진 않다", score: 7 },
      { id: 3, text: "나를 비꼬는 단어 같아서 불쾌하다", score: 4 },
      { id: 4, text: "별 생각 없다", score: 2 }
    ]
  },
  {
    id: 11,
    text: "회식 자리에서 당신이 주로 건네는 말은?",
    options: [
      { id: 1, text: "\"자~ 오늘은 다들 MZ스럽게 1차만 깔끔하게 하자고!\"", score: 10 },
      { id: 2, text: "\"요즘 애들은 어떤 노래 좋아해? 한 번 틀어봐.\"", score: 8 },
      { id: 3, text: "\"고기 탈라, 빨리 먹어라.\"", score: 3 },
      { id: 4, text: "\"나 때는 회식하면 새벽까지 가는 게 국룰이었는데...\"", score: 5 }
    ]
  },
  {
    id: 12,
    text: "본인의 노래방 애창곡 스타일은?",
    options: [
      { id: 1, text: "최신 아이돌 노래를 연습해서 부르려고 노력함", score: 10 },
      { id: 2, text: "2000년대 감성 힙합이나 SG워너비류의 발라드", score: 6 },
      { id: 3, text: "그냥 분위기 맞추기 위해 트로트나 신나는 곡", score: 4 },
      { id: 4, text: "마이크를 잡지 않고 탬버린만 친다", score: 2 }
    ]
  }
];

const RESULT_LEVELS = [
  { min: 0, max: 40, title: "청정 구역 MZ 감성", description: "영포티의 기운이 거의 느껴지지 않습니다. 억지로 젊어 보이려 애쓰지 않아도 자연스러운 젊음이 묻어나네요." },
  { min: 41, max: 70, title: "세이프 존 (Safe Zone)", description: "건강한 40대의 표본입니다. 가끔 영포티스러운 행동을 할 때도 있지만, 선을 잘 지키는 세련된 어른의 모습입니다." },
  { min: 71, max: 100, title: "영포티 주의보", description: "당신은 이미 영포티의 길에 깊숙이 발을 들였습니다. 후배들이 당신의 '쿨함'을 조금은 버거워할지도 몰라요." },
  { min: 101, max: 120, title: "영포티 마스터 (Master)", description: "살아있는 영포티의 전설입니다. 스키니진을 벗고 '...' 사용을 멈춰주세요. 당신의 과한 젊음 열정이 주변을 힘들게 할 수 있습니다." }
];

// --- AI SERVICE ---
const getAIAnalysis = async (score: number, title: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const prompt = `
    사용자의 '영포티' 지수: ${score}/120점, 등급: ${title}.
    이 결과를 바탕으로 위트 있고 뼈 때리는 분석을 한국어로 2-3문장 작성해줘.
    유머러스하면서도 날카로운 통찰을 담아줘.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (e) {
    return "당신의 영포티 기운이 너무 강해 AI가 잠시 분석을 거부했습니다.";
  }
};

// --- COMPONENTS ---
const Landing = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
    <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-xl">
      <span className="text-3xl text-white font-black">Y4</span>
    </div>
    <h1 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
      영포티(Young Forty) <br /><span className="text-indigo-600">감별 테스트</span>
    </h1>
    <p className="text-slate-500 text-lg mb-10 max-w-sm leading-relaxed">
      당신은 젊게 사는 멋진 어른인가요, <br />아니면 '젊은 척'에 갇힌 영포티인가요?
    </p>
    <button
      onClick={onStart}
      className="w-full max-w-xs py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-100 text-xl active:scale-95"
    >
      시작하기
    </button>
  </div>
);

const Quiz = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const q = QUESTIONS[idx];
  const progress = ((idx + 1) / QUESTIONS.length) * 100;

  const handleSelect = (s: number) => {
    const nextScore = score + s;
    if (idx < QUESTIONS.length - 1) {
      setScore(nextScore);
      setIdx(idx + 1);
    } else {
      onComplete(nextScore);
    }
  };

  return (
    <div className="py-8 px-6">
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-indigo-600 mb-2 uppercase tracking-widest">
          <span>Question {idx + 1} / {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-10 leading-snug">{q.text}</h2>
      <div className="space-y-3">
        {q.options.map(o => (
          <button
            key={o.id}
            onClick={() => handleSelect(o.score)}
            className="w-full text-left p-5 border-2 border-slate-50 hover:border-indigo-500 hover:bg-indigo-50 rounded-2xl transition-all group font-medium text-slate-700"
          >
            {o.text}
          </button>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [result, setResult] = useState<TestResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleComplete = async (score: number) => {
    setState(AppState.LOADING);
    const level = RESULT_LEVELS.find(l => score >= l.min && score <= l.max) || RESULT_LEVELS[0];
    const analysis = await getAIAnalysis(score, level.title);
    setResult({ score, totalQuestions: QUESTIONS.length, aiAnalysis: analysis });
    setState(AppState.RESULT);
  };

  const handleShare = () => {
    if (!result) return;
    const level = RESULT_LEVELS.find(l => result.score >= l.min && result.score <= l.max);
    const text = `[영포티 감별기 결과]\n나의 영포티 지수는 ${result.score}/120점!\n등급: ${level?.title}\n\nAI 분석: ${result.aiAnalysis}\n\n당신도 지금 테스트 해보세요!`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden relative">
        {state === AppState.LANDING && <Landing onStart={() => setState(AppState.QUIZ)} />}
        {state === AppState.QUIZ && <Quiz onComplete={handleComplete} />}
        {state === AppState.LOADING && (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="font-bold text-slate-800">당신의 영포티 농도를 분석 중...</p>
          </div>
        )}
        {state === AppState.RESULT && result && (
          <div className="py-12 px-8 text-center">
            <span className="text-xs font-black bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full mb-4 inline-block uppercase">Analysis Result</span>
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {RESULT_LEVELS.find(l => result.score >= l.min && result.score <= l.max)?.title}
            </h2>
            <div className="text-6xl font-black text-indigo-600 my-8">{result.score}<span className="text-2xl text-indigo-300">/120</span></div>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {RESULT_LEVELS.find(l => result.score >= l.min && result.score <= l.max)?.description}
            </p>
            {result.aiAnalysis && (
              <div className="bg-slate-50 p-6 rounded-2xl text-left border-l-4 border-indigo-500 mb-8">
                <p className="text-sm font-bold text-indigo-600 mb-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                  AI 팩폭 분석
                </p>
                <p className="text-slate-700 italic">"{result.aiAnalysis}"</p>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleShare}
                className={`w-full py-4 font-bold rounded-2xl transition-all border-2 ${copyStatus === 'copied' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-600'}`}
              >
                {copyStatus === 'copied' ? '결과 복사 완료!' : '결과 복사해서 공유하기'}
              </button>
              <button
                onClick={() => setState(AppState.LANDING)}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
              >
                다시 하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
