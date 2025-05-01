const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');
const timerDisplay = document.getElementById('timer');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timer;
let timeLeft = 15;

const questions = [
    {
        question: 'What does LAN stand for?',
        choice1: 'Local Area Network',
        choice2: 'Large Address Network',
        choice3: 'Local Access Node',
        answer: 1,
    },
    {
        question: 'Which device connects LANs to the internet?',
        choice1: 'Switch',
        choice2: 'Router',
        choice3: 'Hub',
        answer: 2,
    },
    {
        question: 'Which OSI layer handles physical transmission of data?',
        choice1: 'Data Link Layer',
        choice2: 'Transport Layer',
        choice3: 'Physical Layer',
        answer: 3,
    },
    {
        question: 'Which layer is responsible for framing data and MAC addressing?',
        choice1: 'Physical Layer',
        choice2: 'Data Link Layer',
        choice3: 'Network Layer',
        answer: 2,
    },
    {
        question: 'What is the main job of the Transport Layer?',
        choice1: 'Encrypt packets',
        choice2: 'Deliver packets to the correct application',
        choice3: 'Ensure reliable communication between devices',
        answer: 3,
    },
    {
        question: 'Which protocol provides faster but less reliable transmission?',
        choice1: 'TCP',
        choice2: 'UDP',
        choice3: 'IP',
        answer: 2,
    },
    {
        question: 'How many layers does the OSI model have?',
        choice1: '4',
        choice2: '5',
        choice3: '7',
        answer: 3,
    },
    {
        question: 'What does the Network Layer handle?',
        choice1: 'Framing and MAC addresses',
        choice2: 'IP addressing and routing',
        choice3: 'Port numbers',
        answer: 2,
    },
    {
        question: 'What is the function of a switch?',
        choice1: 'Broadcast data to all devices',
        choice2: 'Route data between networks',
        choice3: 'Send data to a specific device based on MAC address',
        answer: 3,
    },
    {
        question: 'Which OSI layer does a router operate on?',
        choice1: 'Network Layer',
        choice2: 'Transport Layer',
        choice3: 'Data Link Layer',
        answer: 1,
    },
    {
        question: 'Which device is most basic and broadcasts to all connected devices?',
        choice1: 'Switch',
        choice2: 'Hub',
        choice3: 'Router',
        answer: 2,
    },
    {
        question: 'What is CSMA/CD used for?',
        choice1: 'Address translation',
        choice2: 'Collision detection in Ethernet networks',
        choice3: 'Packet encryption',
        answer: 2,
    },
    {
        question: 'Which model is mostly used in real-world networking?',
        choice1: 'OSI',
        choice2: 'TCP/IP',
        choice3: 'Hybrid OSI-TCP',
        answer: 2,
    },
    {
        question: 'Which TCP/IP layer corresponds to OSI’s Transport Layer?',
        choice1: 'Internet',
        choice2: 'Transport',
        choice3: 'Application',
        answer: 2,
    },
    {
        question: 'Which port is used by HTTP?',
        choice1: '21',
        choice2: '80',
        choice3: '443',
        answer: 2,
    },
    {
        question: 'Which protocol translates domain names into IP addresses?',
        choice1: 'SMTP',
        choice2: 'DNS',
        choice3: 'FTP',
        answer: 2,
    },
    {
        question: 'What kind of communication is Full Duplex?',
        choice1: 'One-way only',
        choice2: 'Two-way but not at the same time',
        choice3: 'Two-way simultaneously',
        answer: 3,
    },
    {
        question: 'What is the size of an IPv4 address?',
        choice1: '64 bits',
        choice2: '128 bits',
        choice3: '32 bits',
        answer: 3,
    },
    {
        question: 'Which protocol is connection-oriented?',
        choice1: 'UDP',
        choice2: 'IP',
        choice3: 'TCP',
        answer: 3,
    },
    {
        question: 'Which layer ensures encryption and compression?',
        choice1: 'Session',
        choice2: 'Presentation',
        choice3: 'Transport',
        answer: 2,
    },
    {
        question: 'What is a common use for Telnet?',
        choice1: 'Secure communication',
        choice2: 'Remote command-line access',
        choice3: 'Email delivery',
        answer: 2,
    },
    {
        question: 'What does DHCP do?',
        choice1: 'Assign MAC addresses',
        choice2: 'Assign IP addresses automatically',
        choice3: 'Store DNS records',
        answer: 2,
    },
    {
        question: 'Which binary number equals decimal 10?',
        choice1: '1010',
        choice2: '0101',
        choice3: '1111',
        answer: 1,
    },
    {
        question: 'Which is NOT a valid IPv4 address?',
        choice1: '192.168.0.1',
        choice2: '300.10.10.1',
        choice3: '10.0.0.1',
        answer: 2,
    },
    {
        question: 'What is the range of Class A private IPs?',
        choice1: '192.168.0.0 – 192.168.255.255',
        choice2: '172.16.0.0 – 172.31.255.255',
        choice3: '10.0.0.0 – 10.255.255.255',
        answer: 3,
    },
    {
        question: 'What is the purpose of a firewall?',
        choice1: 'Speed up data transmission',
        choice2: 'Protect a network by filtering traffic',
        choice3: 'Assign IP addresses',
        answer: 2,
    },
    {
        question: 'Which cable is best for long-distance, high-speed transmission?',
        choice1: 'Fiber Optic',
        choice2: 'Cat 5e',
        choice3: 'Coaxial',
        answer: 1,
    },
    {
        question: 'Which number system uses base 16?',
        choice1: 'Binary',
        choice2: 'Decimal',
        choice3: 'Hexadecimal',
        answer: 3,
    },
    {
        question: 'Which protocol is used to send emails?',
        choice1: 'HTTP',
        choice2: 'SMTP',
        choice3: 'DNS',
        answer: 2,
    }
];

const SCORE_POINTS = 2;
const MAX_QUESTIONS = questions.length;

const startExam = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
};

const getNewQuestion = () => {
    clearInterval(timer); // stop any previous timer

    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionsIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionsIndex, 1);
    acceptingAnswers = true;
    startTimer(); // Start countdown
};

const startTimer = () => {
    timeLeft = 15;
    timerDisplay.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            acceptingAnswers = false;
            getNewQuestion(); // Skip to next question
        }
    }, 1000);
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        clearInterval(timer); // stop the timer

        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(SCORE_POINTS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

const incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

startExam();
