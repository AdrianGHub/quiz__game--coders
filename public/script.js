// FRONTEND

const question = document.querySelector("#question");
const gameBoard = document.querySelector("#game-board");
const h2 = document.querySelector("h2");

function fillQuestionElements(data) {
  // - jeżeli wygramy
  if (data.winner === true) {
    gameBoard.style.display = "none";
    h2.innerText = "WYGRAŁEŚ/AŚ!!!";
    return;
  }

  // - jeżeli przegramy
  if (data.loser === true) {
    gameBoard.style.display = "none";
    h2.innerText = "Tym razem nie poszło, spróbuj jeszcze raz.";
    return;
  }

  question.innerText = data.question;

  // - bierzemy każdy kolejny indeks w tablicy jako stringa
  // - szukamy konkretnego elemntu o id answer
  // - za każdym razem zwiększamy szuakny indeks o 1
  // - po znalezieniu elemntu nadajemy mu konkretny tekst na konkretną pojedynczą odpowiedź
  //   !!! opcja do zrobienia z forEach (pozwala na dostęp do elementu & indeksu) !!!

  for (const i in data.answers) {
    const answerEl = document.querySelector(`#answer${Number(i) + 1}`);
    answerEl.innerText = data.answers[i];
  }
}

function showNextQuestion() {
  fetch("/question", {
    method: "GET"
  })
    .then(r => r.json())
    .then(data => fillQuestionElements(data));
}

showNextQuestion();

const goodAnswersSpan = document.querySelector("#good-answers");

function handleAnswerFeedback(data) {
  goodAnswersSpan.innerText = data.goodAnswers;
  showNextQuestion();
}

function sendAnswer(answerIndex) {
  fetch(`/answer/${answerIndex}`, {
    method: "POST"
  })
    .then(r => r.json())
    .then(data => handleAnswerFeedback(data));
}

const buttons = document.querySelectorAll(".answer-btn");
// - znajdujemy wszystkie przyciski, dostępne w html
// - dla każdego elementu w tablicy nadajemy event 'click' i tekst wyświetlany w konsoli

for (const button of buttons) {
  button.addEventListener("click", function() {
    const answerIndex = this.dataset.answer;
    // console.log(answerIndex);
    sendAnswer(answerIndex);
  });
}

const tipDiv = document.querySelector("#tip");

// OBSŁUGA PRZYCISKU - callToAFriend

function handelFriendsAnswer(data) {
  tipDiv.innerText = data.text;
}

function callToAFriend() {
  fetch("/help/friend", {
    method: "GET"
  })
    .then(r => r.json())
    .then(data => handelFriendsAnswer(data));
}

document
  .querySelector("#callToAFriend")
  .addEventListener("click", callToAFriend);

// OBSŁUGA PRZYCISKU - halfOnHalf

function handelHalfOnHalfAnswer(data) {
  if (typeof data.text === "string") {
    tipDiv.innerText = data.text;
  } else {
    for (const button of buttons) {
      if (data.answersToRemove.indexOf(button.innerText) > -1) {
        button.innerText = "";
      }
    }
  }
}

function halfOnHalf() {
  fetch("/help/half", {
    method: "GET"
  })
    .then(r => r.json())
    .then(data => handelHalfOnHalfAnswer(data));
}

document.querySelector("#halfOnHalf").addEventListener("click", halfOnHalf);

// OBSŁUGA PRZYCISKU - questionToTheCrowd

function handelCrowdAnswer(data) {
  if (typeof data.text === "string") {
    tipDiv.innerText = data.text;
  } else {
    data.chart.forEach((percent, index) => {
      buttons[index].innerText = `${buttons[index].innerText}: ${percent}%`;
    });
  }
}

function questionToTheCrowd() {
  fetch("/help/crowd", {
    method: "GET"
  })
    .then(r => r.json())
    .then(data => handelCrowdAnswer(data));
}

document
  .querySelector("#questionToTheCrowd")
  .addEventListener("click", questionToTheCrowd);
