// BACKEND

function gameRoutes(app) {
  let goodAnswers = 0; // licznik dobrych odpowiedzi
  let isGameOver = false; // flaga na odpowiedź
  let callToAFriendUsed = false; // koło ratunkowe
  let questionToTheCrownUsed = false; // pytanie do publiki
  let halfOnHalfUsed = false; // pół na pół

  const questions = [
    {
      question: "Jaki jest najlepszy język programowania na świecie wg mnie?",
      answers: ["C++", "Fortan", "JavaScript", "Java"],
      correctAnswer: 2
    },
    {
      question: "Czy ten kurs jest fajny?",
      answers: ["Nie wiem", "Jest możliwe", "Nie.", "Jest najlepszy"],
      correctAnswer: 3
    },
    {
      question: "Czy chcesz zjeśc pizze??",
      answers: [
        "Tak poproszę z ketchupem",
        "Jestem na diecie paleo",
        "Nie, dziękuję",
        "Wolę brokuły"
      ],
      correctAnswer: 0
    }
  ];

  app.get("/question", (req, res) => {
    if (goodAnswers == questions.length) {
      res.json({
        winner: true
      });
    } else if (isGameOver) {
      res.json({
        loser: true
      });
    } else {
      const nextQuestion = questions[goodAnswers];
      // destrukturyzacja z obiektu
      const { question, answers } = nextQuestion;

      res.json({
        question,
        answers
      });
    }
  });

  app.post("/answer/:index", (req, res) => {
    if (isGameOver) {
      res.json({
        loser: true
      });
    }

    // - odczytuję indeks wskaany przez użytkownika
    // - sprawdzam, czy odpowiedź jest prawidłowa
    // - jeżeli tak to.../ jeżeli nie to...
    // - na koniec wysyłam do frontendu info, czy odpowiedź była prawidłowa

    const { index } = req.params;
    const question = questions[goodAnswers];

    const isGoodAnswer = question.correctAnswer === Number(index);

    if (isGoodAnswer) {
      goodAnswers++; // dodajemy 1 punkt użytkownikowi
    } else {
      isGameOver = true;
    }

    res.json({
      correct: isGoodAnswer,
      goodAnswers
    });
  });

  // OBSŁUGA PRZYCISKU - callToAFriend

  app.get("/help/friend", (req, res) => {
    if (callToAFriendUsed) {
      return res.json({
        text: "To koło ratunkowe było już wykorzystane."
      });
    }

    callToAFriendUsed = true; // flaga

    const doesFriendKnowAnswer = Math.random() < 0.5;

    const question = questions[goodAnswers];

    res.json({
      text: doesFriendKnowAnswer
        ? `Hmm, wydaje mi się, że odpowiedź to ${
            question.answers[question.correctAnswer]
          }`
        : "Hmm, no nie wiem..."
    });
  });

  // OBSŁUGA PRZYCISKU - halfOnHalf

  app.get("/help/half", (req, res) => {
    if (halfOnHalfUsed) {
      return res.json({
        text: "To koło ratunkowe było już wykorzystane."
      });
    }

    halfOnHalfUsed = true; // flaga

    const question = questions[goodAnswers];

    const answersCopy = question.answers.filter(
      (s, index) => index !== question.correctAnswer
    );

    answersCopy.splice(~~(Math.random() * answersCopy.length), 1);

    res.json({
      answersToRemove: answersCopy
    });
  });

  app.get("/help/crowd", (req, res) => {
    /*

    if (questionToTheCrownUsed) {
      return res.json({
        text: "To koło ratunkowe było już wykorzystane."
      });
    }

    questionToTheCrownUsed = true; // flaga

    */

    const chart = [10, 20, 30, 40];

    for (let i = chart.length - 1; i > 0; i--) {
      const change = Math.floor(Math.random() * 20 - 10);

      chart[i] += change;
      chart[i - 1] -= change;
    }

    const question = questions[goodAnswers];
    const { correctAnswer } = question;

    // zamiana 2 elementow z tablicy pozycjami-sortowanie bąbelkowe

    [chart[3], (chart[correctAnswer] = chart[correctAnswer]), chart[3]]; // tablica 2-elementowa

    res.json({
      chart
    });
  });
}

module.exports = gameRoutes;
