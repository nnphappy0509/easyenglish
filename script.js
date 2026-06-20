// 학습 데이터를 담을 빈 배열 (사용자가 입력하면 채워짐)
let textData = []; 

// 음성 재생 상태 관리 변수
let isPlaying = false;
let speechSynthesis = window.speechSynthesis;

// HTML 요소 연결
const elements = {
    btnHome: document.getElementById('btn-home'),
    inputSection: document.getElementById('input-section'),
    userInput: document.getElementById('user-input'),
    btnStart: document.getElementById('btn-start'),
    
    learningSection: document.getElementById('learning-section'),
    btnListen: document.getElementById('btn-listen'),
    btnTranslate: document.getElementById('btn-translate'),
    instructionText: document.getElementById('instruction-text'),
    textContainer: document.getElementById('text-container')
};

// 1. [학습 시작] 버튼: 텍스트 가져와서 자르고 화면 전환
elements.btnStart.addEventListener('click', () => {
    const rawText = elements.userInput.value.trim();
    
    if (!rawText) {
        alert("영어 텍스트를 먼저 입력하거나 붙여넣어 주세요!");
        return;
    }

    // 마침표(.), 물음표(?), 느낌표(!) 기준으로 텍스트 분할
    const regex = /[^.!?]+[.!?]+/g;
    const matches = rawText.match(regex);
    
    // 기호가 없으면 전체를 한 문장으로, 기호가 있으면 분할된 배열 사용
    textData = matches ? matches : [rawText];
    
    // 앞뒤 공백 제거 및 빈 문장 필터링
    textData = textData.map(s => s.trim()).filter(s => s.length > 0);

    // 입력 화면 숨기고, 학습 메뉴 화면 보이기
    elements.inputSection.style.display = 'none';
    elements.learningSection.style.display = 'block';

    renderInitialText();
});

// 2. [처음으로] 버튼: 학습 중지 및 입력 화면으로 돌아가기
elements.btnHome.addEventListener('click', () => {
    if (isPlaying) stopListening();
    
    elements.learningSection.style.display = 'none';
    elements.inputSection.style.display = 'block';
});

// 3. 기본 전체 텍스트 렌더링
function renderInitialText() {
    elements.instructionText.textContent = "메뉴를 선택하여 학습을 시작하세요.";
    // 배열에 담긴 문장들을 공백으로 이어서 보여줌
    elements.textContainer.innerHTML = textData.join(' ');
}

// 4. [해석] 버튼: 문장별 번호 부여 및 클릭 이벤트
elements.btnTranslate.addEventListener('click', () => {
    elements.instructionText.textContent = "문장을 클릭하면 AI 번역을 확인할 수 있습니다.";
    elements.textContainer.innerHTML = ''; // 텍스트 컨테이너 비우기

    textData.forEach((sentence, index) => {
        const div = document.createElement('div');
        div.className = 'sentence-item';
        div.innerHTML = `<span class="sentence-number">${index + 1}.</span> ${sentence}`;
        
        // 클릭 시 해석 띄우기
        div.addEventListener('click', () => {
            // ※ 여기에 향후 Gemini API를 연결하여 실시간 번역 결과를 띄우게 됩니다.
            // 현재는 동적인 입력 텍스트를 받으므로, 알림창으로 작동 여부만 확인합니다.
            alert(`[AI 번역] (API 연동 필요)\n\n원문: ${sentence}`);
        });

        elements.textContainer.appendChild(div);
    });
});

// 5. [전체 듣기] 버튼: 재생 및 중지 토글
elements.btnListen.addEventListener('click', () => {
    if (isPlaying) {
        stopListening();
    } else {
        startListening();
    }
});

function startListening() {
    const textToSpeak = textData.join(' ');
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    
    utterance.onend = () => { stopListening(); };

    speechSynthesis.speak(utterance);
    isPlaying = true;
    elements.btnListen.textContent = "중지";
    elements.btnListen.classList.replace('btn-green', 'btn-yellow');
}

function stopListening() {
    speechSynthesis.cancel();
    isPlaying = false;
    elements.btnListen.textContent = "전체 듣기";
    elements.btnListen.classList.replace('btn-yellow', 'btn-green');
}
