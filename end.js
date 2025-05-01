const finalScore = document.querySelector('#finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore') || 0;
finalScore.innerText = mostRecentScore;
