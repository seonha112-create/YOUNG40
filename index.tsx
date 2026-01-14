
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- CONSTANTS ---
const QUESTIONS = [
    { id: 1, text: "평소 즐겨 입는 바지의 실루엣은?", options: [
        { id: 1, text: "발목이 드러나는 꽉 끼는 슬림/스키니핏", score: 10 },
        { id: 2, text: "깔끔한 테이퍼드 핏", score: 7 },
        { id: 3, text: "넉넉한 와이드 핏", score: 2 },
        { id: 4, text: "편한 트레이닝복", score: 4 }
    ]},
    { id: 2, text: "카톡 대화 시 가장 자주 쓰는 문장 부호는?", options: [
        { id: 1, text: "말끝마다 '...' 이나 '^^'", score: 10 },
        { id: 2, text: "감정 가득한 '!!!' 나 'ㅠㅠ'", score: 6 },
        { id: 3, text: "깔끔한 마침표 '.'", score: 2 },
        { id: 4, text: "웃음 연타 'ㅋㅋㅋㅋ'", score: 4 }
    ]},
    { id: 3, text: "후배가 'T발 너 C야?'라고 했을 때 반응은?", options: [
        { id: 1, text: "MBTI 차이를 10분간 설명한다", score: 10 },
        { id: 2, text: "욕인 줄 알고 정색한다", score: 5 },
        { id: 3, text: "밈인 걸 알고 웃어넘긴다", score: 2 },
        { id: 4, text: "무슨 소린지 못 알아듣는다", score: 3 }
    ]},
    { id: 4, text: "최신 인기 아이돌(뉴진스, 아이브 등) 지식 수준은?", options: [
        { id: 1, text: "멤버 이름과 최근 뉴스까지 다 안다", score: 10 },
        { id: 2, text: "노래는 즐겨 듣고 챌린지도 안다", score: 7 },
        { id: 3, text: "그룹 이름만 들어봤다", score: 3 },
        { id: 4, text: "90년대 가수가 최고라고 생각한다", score: 2 }
    ]},
    { id: 5, text: "SNS에 올리는 사진의 스타일은?", options: [
        { id: 1, text: "명품 로고 설정샷이나 거울 셀카", score: 10 },
        { id: 2, text: "오운완(운동 인증)과 근육 자랑", score: 9 },
        { id: 3, text: "풍경이나 음식 사진", score: 4 },
        { id: 4, text: "가족이나 반려동물 사진", score: 2 }
    ]},
    { id: 6, text: "본인의 체력에 대한 생각은?", options: [
        { id: 1, text: "마음은 20대! 현역과 뛰어도 안 밀린다", score: 10 },
        { id: 2, text: "영양제 먹으며 관리하면 충분하다", score: 7 },
        { id: 3, text: "비 오면 무릎 쑤시는 아저씨/아줌마다", score: 2 },
        { id: 4, text: "관리에 관심 없다", score: 4 }
    ]},
    { id: 7, text: "후배들과 소통할 때 본인의 모습은?", options: [
        { id: 1, text: "나는 말이 잘 통하는 '쿨한' 선배다", score: 10 },
        { id: 2, text: "눈치 보며 최대한 말을 아낀다", score: 6 },
        { id: 3, text: "업무 얘기만 철저히 한다", score: 3 },
        { id: 4, text: "가끔 '라떼' 얘기를 해줘야 한다고 믿는다", score: 5 }
    ]},
    { id: 8, text: "주말에 주로 즐기는 취미는?", options: [
        { id: 1, text: "러닝 크루, 테니스 등 힙한 운동", score: 10 },
        { id: 2, text: "재테크 공부 및 모임", score: 7 },
        { id: 3, text: "집에서 드라마 정주행", score: 2 },
        { id: 4, text: "낚시, 등산 등 정통 취미", score: 5 }
    ]},
    { id: 9, text: "최근 구매한 가장 뿌듯한 아이템은?", options: [
        { id: 1, text: "한정판 스니커즈", score: 10 },
        { id: 2, text: "최신형 스마트 기기", score: 6 },
        { id: 3, text: "가전제품이나 가구", score: 3 },
        { id: 4, text: "건강 기기나 고가 영양제", score: 4 }
    ]},
    { id: 10, text: "'영포티'라는 단어를 들으면 드는 생각은?", options: [
        { id: 1, text: "젊게 사는 멋진 사람들을 뜻하는 말이다", score: 10 },
        { id: 2, text: "약간 오글거리지만 나쁘진 않다", score: 7 },
        { id: 3, text: "나를 비꼬는 것 같아 불쾌하다", score: 4 },
        { id: 4, text: "별 생각 없다", score: 2 }
    ]},
    { id: 11, text: "회식 자리에서 자주 하는 말은?", options: [
        { id: 1, text: "\"오늘은 MZ스럽게 1차만 하자!\"", score: 10 },
        { id: 2, text: "\"요즘 애들은 뭐 듣니? 틀어봐.\"", score: 8 },
        { id: 3, text: "\"고기 탄다, 빨리 먹어.\"", score: 3 },
        { id: 4, text: "\"나 때는 말이야...\"", score: 5 }
    ]},
    { id: 12, text: "노래방 애창곡 스타일은?", options: [
        { id: 1, text: "최신 아이돌 노래를 연습함", score: 10 },
        { id: 2, text: "2000년대 감성 발라드/힙합", score: 6 },
        { id: 3, text: "분위기용 트로트나 신나는 곡", score: 4 },
        { id: 4, text: "그냥 탬버린만 친다", score: 2 }
    ]}
];

const RESULT_LEVELS = [
    { min: 0, max: 40, title: "청정 구역 MZ 감성", description: "영포티의 기운이 없습니다. 자연스러운 젊음이 묻어나네요." },
    { min: 41, max: 70, title: "세이프 존 (Safe Zone)", description: "건강한 40대의 표본입니다. 선을 잘 지키는 세련된 어른입니다." },
    { min: 71, max: 100, title: "영포티 주의보", description: "당신은 이미 영포티의 길에 깊숙이 발을 들였습니다. 쿨함이 과할 수 있어요." },
    { min: 101, max: 120, title: "영포티 마스터", description: "살아있는 영포티의 전설입니다. 스키니진을 벗고 '...' 사용을 멈춰주세요." }
];

function App() {
    const [step, setStep] = useState('landing');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [copyStatus, setCopyStatus] = useState('idle');

    const startQuiz = () => setStep('quiz');

    const handleAnswer = (s: number) => {
        const nextScore = score + s;
        if (currentIdx < QUESTIONS.length - 1) {
            setScore(nextScore);
            setCurrentIdx(currentIdx + 1);
        } else {
            finishQuiz(nextScore);
        }
    };

    const finishQuiz = async (finalScore: number) => {
        setStep('loading');
        setLoading(true);
        const level = RESULT_LEVELS.find(l => finalScore >= l.min && finalScore <= l.max) || RESULT_LEVELS[0];
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `영포티 지수 테스트 결과: ${finalScore}/120점, 등급: ${level.title}. 아주 위트 있고 뼈 때리는 분석을 한국어로 2-3문장 작성해줘.`,
            });
            setAnalysis(response.text || "AI 분석 결과를 가져올 수 없습니다.");
        } catch (e) {
            console.error(e);
            setAnalysis("AI가 당신의 영포티 아우라에 압도되어 분석을 중단했습니다.");
        }
        setScore(finalScore);
        setLoading(false);
        setStep('result');
    };

    const copyToClipboard = () => {
        const level = RESULT_LEVELS.find(l => score >= l.min && score <= l.max);
        const text = `[영포티 감별 결과]\n나의 영포티 지수: ${score}/120점\n등급: ${level?.title}\nAI 분석: ${analysis}\n테스트 해보기: ${window.location.href}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden fade-in">
                {step === 'landing' && (
                    <div className="py-16 text-center px-8">
                        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-xl mx-auto">
                            <span className="text-3xl text-white font-black">Y4</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-6 leading-tight">영포티 감별기</h1>
                        <p className="text-slate-500 text-lg mb-10 leading-relaxed">당신은 젊은 어른인가요,<br/>아니면 '젊은 척'하는 영포티인가요?</p>
                        <button onClick={startQuiz} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg text-xl active:scale-95">테스트 시작</button>
                    </div>
                )}

                {step === 'quiz' && (
                    <div className="py-10 px-8">
                        <div className="mb-8">
                            <div className="flex justify-between text-xs font-bold text-indigo-600 mb-2 uppercase tracking-tighter">
                                <span>질문 {currentIdx + 1} / {QUESTIONS.length}</span>
                                <span>{Math.round(((currentIdx + 1) / QUESTIONS.length) * 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-10 leading-snug">{QUESTIONS[currentIdx].text}</h2>
                        <div className="space-y-3">
                            {QUESTIONS[currentIdx].options.map(o => (
                                <button key={o.id} onClick={() => handleAnswer(o.score)} className="w-full text-left p-5 border-2 border-slate-50 hover:border-indigo-500 hover:bg-indigo-50 rounded-2xl transition-all font-medium text-slate-700">{o.text}</button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'loading' && (
                    <div className="py-32 text-center px-8">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-8"></div>
                        <p className="text-xl font-bold text-slate-800">당신의 '젊은 척' 지수 분석 중...</p>
                    </div>
                )}

                {step === 'result' && (
                    <div className="py-12 px-8 text-center">
                        <span className="text-xs font-black bg-indigo-100 text-indigo-700 py-1 px-4 rounded-full mb-4 inline-block">결과 분석 완료</span>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">{RESULT_LEVELS.find(l => score >= l.min && score <= l.max)?.title}</h2>
                        <div className="text-6xl font-black text-indigo-600 my-8">{score}<span className="text-2xl text-indigo-300">/120</span></div>
                        <p className="text-slate-600 mb-8 leading-relaxed">{RESULT_LEVELS.find(l => score >= l.min && score <= l.max)?.description}</p>
                        
                        <div className="bg-slate-50 p-6 rounded-3xl text-left border-l-4 border-indigo-500 mb-8">
                            <p className="text-sm font-bold text-indigo-600 mb-2 flex items-center gap-1 italic">AI의 팩폭 분석</p>
                            <p className="text-slate-700 italic leading-relaxed text-sm">"{analysis}"</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={copyToClipboard} className={`py-4 font-bold rounded-2xl transition-all border-2 ${copyStatus === 'copied' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-600'}`}>
                                {copyStatus === 'copied' ? '복사 완료!' : '결과 복사해서 공유하기'}
                            </button>
                            <button onClick={() => window.location.reload()} className="py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all">다시 하기</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
