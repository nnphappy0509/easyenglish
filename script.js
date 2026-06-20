// 학습할 영어 지문 데이터를 배열 형태로 준비합니다.
const textData = [
    "G: Andy, how did the basketball game go?",
    "B: Our team lost.",
    "G: Oh, I'm sorry to hear that.",
    "B: It's okay.",
    "It was a great game.",
    "G: What was the score?",
    "B: It was 80 to 79.",
    "We lost by one point.",
    "G: That was really close!",
    "B: Yeah.",
    "We played really well as a team.",
    "G: That's wonderful!",
    "I want to watch your next game."
];

// 각 문장별 번역 데이터를 매핑해 둡니다. (Gemini AI 연결 전 데모 데이터)
const translations = {
    "G: Andy, how did the basketball game go?": "G: 앤디, 농구 경기는 어떻게 됐어?",
    "B: Our team lost.": "B: 우리 팀이 졌어.",
    "G: Oh, I'm sorry to hear that.": "G: 오, 그 말 들으니 유감이다.",
    "B: It's okay.": "B: 괜찮아.",
    "It was a great game.": "정말 훌륭한 경기였어.",
    "G: What was the score?": "G: 점수가 어떻게 됐는데?",
    "B: It was 80 to 79.": "B: 80 대 79였어.",
    "We lost by one point.": "우리가 1점 차이로 졌어.",
    "G: That was really close!": "G: 정말 아슬아슬했네!",
    "B: Yeah.": "B: 응.",
    "We played really well as a team.": "우리는 팀으로서 정말 잘 경기했어.",
    "G: That's wonderful!": "G: 그거 정말 멋지다!",
    "I want to watch your next game.": "너희 다음 경기는 나도 보고 싶어."
};

// HTML 요소들을 가져옵니다.
const elements = {
    btnHome: document.getElementById('btn-home'),
    btnListen: document.getElementById('btn-listen'),
    btnTranslate: document.getElementById('btn-translate'),
    instructionText: document.getElementById('instruction-text'),
    textContainer: document.getElementById('text-container')
};

// 음성 재생 상태 관리 변수
let isPlaying = false;
let speechSynthesis = window.speechSynthesis;

// 1. 기본 화면 렌더링 함수
function renderInitialText() {
    elements.instructionText.textContent = "메뉴를 선택하여 학습을 시작하세요.";
    // 일반 텍스트 모드로 합쳐서 보여주기
    elements.textContainer.innerHTML = textData.join('<br><br>');
}

// 2. [해석] 버튼 클릭 시 동작하는 함수 (요청하신 기능 반영)
function renderTranslateMode() {
    elements.instructionText.textContent = "문장을 클릭하여 AI 번역을 확인하세요.";
    elements.textContainer.innerHTML = ''; // 기존 텍스트 지우기

    // 배열에 있는 문장들을 하나씩 꺼내서 HTML 요소를 만듭니다.
    textData.forEach((sentence, index) => {
        const div = document.createElement('div');
        div.className = 'sentence-item';
        
        // 번호와 문장 결합
        div.innerHTML = `<span class="sentence-number">${index + 1}.</span> ${sentence}`;
        
        // 클릭 이벤트: 클릭하면 알림창(또는 모달)으로 해석 보여주기
        div.addEventListener('click', () => {
            const translation = translations[sentence] || "번역 데이터를 준비 중입니다.";
            alert(`[AI 번역 결과]\n\n${translation}`);
        });

        // 화면에 추가
        elements.textContainer.appendChild(div);
    });
}

// 3. [전체 듣기] 재생/중지 토글 기능
function toggleListenAll() {
    if (isPlaying) {
        // 재생 중일 때 누르면 중지
        speechSynthesis.cancel();
        isPlaying = false;
        elements.btnListen.textContent = "전체 듣기";
        elements.btnListen.classList.remove('btn-yellow');
        elements.btnListen.classList.add('btn-green');
    } else {
        // 정지 상태일 때 누르면 재생
        const textToSpeak = textData.join(' ');
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        
        utterance.onend = () => {
            isPlaying = false;
            elements.btnListen.textContent = "전체 듣기";
            elements.btnListen.classList.remove('btn-yellow');
            elements.btnListen.classList.add('btn-green');
        };

        speechSynthesis.speak(utterance);
        isPlaying = true;
        elements.btnListen.textContent = "중지";
        elements.btnListen.classList.remove('btn-green');
        elements.btnListen.classList.add('btn-yellow'); // 중지 버튼일 때 시각적 강조
    }
}

// 이벤트 리스너 연결
elements.btnTranslate.addEventListener('click', renderTranslateMode);
elements.btnListen.addEventListener('click', toggleListenAll);

// 처음으로 버튼을 누르면 초기화 (음성 중지 및 초기 화면)
elements.btnHome.addEventListener('click', () => {
    if (isPlaying) {
        speechSynthesis.cancel();
        isPlaying = false;
        elements.btnListen.textContent = "전체 듣기";
        elements.btnListen.classList.remove('btn-yellow');
        elements.btnListen.classList.add('btn-green');
    }
    renderInitialText();
});

// 앱이 켜질 때 기본 화면을 그려줍니다.
window.onload = renderInitialText;
