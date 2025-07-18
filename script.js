const allQuizData = {
    "第一回": [
        {
            question: "1）の空所を補充してください",
            pdfPath: "sportsPhysiology.pdf",
            pageNumber: 12,
            answer: "エネルギー"
        },
        {
            question: "2）の空所を補充してください",
            pdfPath: "sportsPhysiology.pdf",
            pageNumber: 13,
            answer: "アデノシン三リン酸(ATP)"
        },
        {
            question: "3）の空所を補充してください",
            pdfPath: "sportsPhysiology.pdf",
            pageNumber: 14,
            answer: "ATP→ADP時にエネルギー発生"
        },
        {
            question: "4）の空所を補充してください",
            pdfPath: "sportsPhysiology.pdf",
            pageNumber: 15,
            answer: "高エネルギーリン酸結合が<br>外れるときにエネルギーが発生"
        },
        {
            question: "7）,8)の空所を補充してください",
            pdfPath: "sportsPhysiology.pdf",
            pageNumber: 17,
            answer: "7)食物など外からエネルギー<br>8)無機リン酸(Pi)"
        },
        {
            question: "9),10),11),12)の空所を補充してください",
            pdfPath: "sportsPhysiology.pdf",
            pageNumber: 18,
            answer: "9)3つのエネルギー供給系<br>10)同時に使われている<br>11)代謝環境に応じて<br>12)相互作用しながら"
        },
        {
            question: "13）,14),15)の空所を補充してください",
            pdfPath: "sportsPhysiology.pdf",
            pageNumber: 18,
            answer: "13)ATP再生機構(ATP-CP系)<br>14)無酸素的解糖系(乳酸系)<br>15)有酸素系(酸化系)"
        },
    ],
    "第2回": [

    ],
    "第3回": [

    ],
    "第4回": [

    ],
    "第5回": [

    ],
    "第6回": [

    ],
    "第7回": [

    ],
    "第8回": [

    ],
    "第9回": [

    ],
    "第10回": [

    ],
    "第11回": [

    ],
    "第12回": [

    ],
    "第13回": [

    ]
};

let questions = [];

let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

const quizSelectionArea = document.getElementById('quiz-selection-area');
const quizRoundSelect = document.getElementById('quiz-round-select');
const startQuizButton = document.getElementById('start-quiz-button');

const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const showAnswerButton = document.getElementById('show-answer-button');
const feedbackButtons = document.getElementById('feedback-buttons');
const correctButton = document.getElementById('correct-button');
const incorrectButton = document.getElementById('incorrect-button');
const nextQuestionButton = document.getElementById('next-question-button');
const quizArea = document.getElementById('quiz-area');
const resultArea = document.getElementById('result-area');
const correctCountSpan = document.getElementById('correct-count');
const incorrectCountSpan = document.getElementById('incorrect-count');
const resetButton = document.getElementById('reset-button');

const pdfCanvas = document.getElementById('pdf-canvas');
const canvasContext = pdfCanvas.getContext('2d');

//　PDFの読み込みと特定ページの描画を行う非同期関数
async function displayPdfPage(pdfPath, pageNum) {
    try {
        // PDFドキュメントを読み込む
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;

        //　指定されたページを取得
        const page = await pdf.getPage(pageNum);

        // ビューポート（表示領域）を設定。スケールは適宜調整
        const scale = 0.5;  //　倍率
        const viewport = page.getViewport({ scale: scale });

        //　canvasのサイズをビューポートに合わせる
        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;

        // ページをcanvasに描画
        const renderContext = {
            canvasContext: canvasContext,
            viewport: viewport
        };
        await page.render(renderContext).promise;

        // PDFが表示されたらhiddenクラスを削除
        pdfCanvas.classList.remove('hidden');
    } catch (error) {
        console.error("PDFの読み込みまたは描画中にエラーが発生しました:", error);
        //　エラーが発生した場合、canvasを非表示にする
        pdfCanvas.classList.add('hidden');
        //　必要に応じて、ユーザーにエラーねっセージを表示するなどの処理
        alert("PDFの表示中にエラーが発生しました。コンソールを確認してください。");
    }
}

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const q = questions[currentQuestionIndex];
        questionElement.textContent = q.question;
        answerElement.innerHTML = q.answer;
        answerElement.classList.add('hidden');

        // PDF表示のロジックを追加
        if (q.pdfPath && q.pageNumber) {
            displayPdfPage(q.pdfPath, q.pageNumber);
        } else {
            pdfCanvas.classList.add('hidden');
        }

        showAnswerButton.classList.remove('hidden');
        feedbackButtons.classList.add('hidden');
        nextQuestionButton.classList.add('hidden');

        quizArea.classList.remove('hidden');
        resultArea.classList.add('hidden');
        quizSelectionArea.classList.add('hidden');
    } else {
        showResults();
    }
}

function showAnswer() {
    answerElement.classList.remove('hidden');
    showAnswerButton.classList.add('hidden');
    feedbackButtons.classList.remove('hidden');
}

function handleFeedback(isCorrect) {
    if (isCorrect) {
        correctCount++;
    } else {
        incorrectCount++;
    }
    nextQuestionButton.classList.remove('hidden');
    feedbackButtons.classList.add('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function showResults() {
    quizArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
    correctCountSpan.textContent = correctCount;
    incorrectCountSpan.textContent = incorrectCount;
}

function resetQuiz() {
    currentQuestionIndex = 0;
    correctCount = 0;
    incorrectCount = 0;

    // UIエリアの表示制御
    resultArea.classList.add('hidden');
    quizArea.classList.add('hidden');
    quizSelectionArea.classList.remove('hidden');

    // PDFキャンバスも非表示に戻す
    if (pdfCanvas) pdfCanvas.classList.add('hidden');
}

// --- 初期化処理 ---

//　アプリ起動時に回数選択オプションを生成
// DCMContentLoaded: HTMLが完全に読み込まれ、パースされた後に実行される
document.addEventListener('DOMContentLoaded', () => {
    generateRoundOptions();
});

function generateRoundOptions() {
    // allQuizDataのキーからオプションを生成
    const rounds = Object.keys(allQuizData);
    rounds.forEach(roundKey => {
        const option = document.createElement('option');
        option.value = roundKey;
        option.textContent = roundKey;
        quizRoundSelect.appendChild(option);
    });
}

//　クイズ開始ボタンのイベントリスナー
startQuizButton.addEventListener('click', () => {
    const selectedRound = quizRoundSelect.value;
    if (allQuizData[selectedRound]) {
        questions = allQuizData[selectedRound];

        quizSelectionArea.classList.add('hidden');
        quizArea.classList.remove('hidden');

        // クイズの状態をリセットして開始
        currentQuestionIndex = 0;
        correctCount = 0;
        incorrectCount = 0;
        displayQuestion();
    } else {
        alert("選択された回の問題データが見つかりません。");
    }
});

//　イベントリスナー
showAnswerButton.addEventListener('click', showAnswer);
correctButton.addEventListener('click', () => handleFeedback(true));
incorrectButton.addEventListener('click', () => handleFeedback(false));
nextQuestionButton.addEventListener('click', nextQuestion);
resetButton.addEventListener('click', resetQuiz);

// アプリ開始
// displayQuestion();