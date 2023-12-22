// Selecionando todos os elementos necessários
const startBtnHome = document.querySelector(".start_btn");
const startBtn = document.querySelector(".start_btn #button_play");
const infoBox = document.querySelector(".info_box");
const highscores = document.querySelector("#highscores");
const scoreTextPoint = document.getElementById("score");
const exitBtn = infoBox.querySelector(".buttons .quit");
const continueBtn = infoBox.querySelector(".buttons .restart");
const quizBox = document.querySelector(".quiz_box");
const resultBox = document.querySelector(".result_box");
const optionList = document.querySelector(".option_list");
const timeLine = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

const loader = document.getElementById("loader");
loader.classList.add("hidden");

// Se o botão startQuiz for clicado
startBtn.onclick = () => {
  infoBox.classList.add("activeInfo"); // Mostra a caixa de informações
};

// Se o botão exitQuiz for clicado
exitBtn.onclick = () => {
  infoBox.classList.remove("activeInfo"); // Oculta a caixa de informações
};

// Se o botão continueQuiz for clicado
continueBtn.onclick = () => {
  infoBox.classList.remove("activeInfo"); // Oculta a caixa de informações
  startBtnHome.classList.add("hidden");

  loader.classList.remove("hidden");
  const myTimeout = setTimeout(startQuiz, 3000);

  function startQuiz() {
    loader.classList.add("hidden");
    startBtnHome.classList.remove("hidden");
    quizBox.classList.add("activeQuiz"); // Mostra a caixa de quiz
    showQuestions(0); // Chama a função showQuestions
    questionCounter(1); // Passa 1 parâmetro para questionCounter
    startTimer(15); // Chama a função startTimer
    startTimerLine(0);
  }
};

let timeValue = 15;
let questionCount = 0;
let questionNumber = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restartQuiz = resultBox.querySelector(".buttons .restart");
const quitQuiz = resultBox.querySelector(".buttons .quit");

// Se o botão restartQuiz for clicado
restartQuiz.onclick = () => {
  localStorage.setItem("mostRecentScore", userScore); /* Vai para a página final */
  return window.location.assign("./src/pages/end.html");
};

// Se o botão quitQuiz for clicado
quitQuiz.onclick = () => {
  window.location.reload(); // Recarrega a janela atual
};

const nextBtn = document.querySelector("footer .next_btn");
const bottomQuestionCounter = document.querySelector("footer .total_que");

// Se o botão Next Question for clicado
nextBtn.onclick = () => {
  if (questionCount < questions.length - 1) {
    // Se a contagem de questões for menor que o total de questões
    questionCount++; // Incrementa o valor da contagem de questões
    questionNumber++; // Incrementa o valor do número da questão
    showQuestions(questionCount); // Chama a função showQuestions
    questionCounter(questionNumber); // Passa o valor do número da questão para questionCounter
    clearInterval(counter); // Limpa o contador
    clearInterval(counterLine); // Limpa a linha do contador
    startTimer(timeValue); // Chama a função startTimer
    startTimerLine(widthValue); // Chama a função startTimerLine
    timeText.textContent = "Tempo Restante"; // Altera o texto de tempo para Tempo Restante
    nextBtn.classList.remove("show"); // Oculta o botão Next se o usuário selecionou uma opção
  } else {
    clearInterval(counter); // Limpa o contador
    clearInterval(counterLine); // Limpa a linha do contador
    showResult(); // Chama a função showResult
  }
};

// Obtendo perguntas e opções do array
function showQuestions(index) {
  loader.classList.add("hidden");
  const questionText = document.querySelector(".que_text");
  // Cria uma nova tag span e div para a pergunta e a opção, passando o valor usando o índice do array
  let questionTag =
    "<span>" +
    questions[index].numb +
    ". " +
    questions[index].question +
    "</span>";
  let optionTag =
    '<div class="option"><p class="choice-prefix">A</p><p class="choice-text" data-number="1"><span class="question">' +
    questions[index].options[0] +
    "</span></div>" +
    '<div class="option"><p class="choice-prefix">B</p><p class="choice-text" data-number="2"><span class="question">' +
    questions[index].options[1] +
    "</span></p></div>" +
    '<div class="option"><p class="choice-prefix">C</p><p class="choice-text" data-number="3"><span class="question">' +
    questions[index].options[2] +
    "</span></p></div>" +
    '<div class="option"><p class="choice-prefix">D</p><p class="choice-text" data-number="4"><span class="question">' +
    questions[index].options[3] +
    "</span></p></div>";
  questionText.innerHTML = questionTag; // Adiciona a nova tag span dentro da tag que_text
  optionList.innerHTML = optionTag; // Adiciona a nova tag div dentro da tag option_list

  const option = optionList.querySelectorAll(".option");

  // Configura o atributo onclick para todas as opções disponíveis
  for (i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }
}

// Cria as novas tags div para os ícones
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// Se o usuário clicou em uma opção
function optionSelected(answer) {
  clearInterval(counter); // Limpa o contador
  clearInterval(counterLine); // Limpa a linha do contador
  let userAns = answer.querySelector(".choice-text").textContent; // Obtém a opção selecionada pelo usuário
  let correctAns = questions[questionCount].answer; // Obtém a resposta correta do array
  const allOptions = optionList.children.length; // Obtém todos os itens de opção
  setTimeout(() => showNextQuestion(), 1000);
  if (userAns == correctAns) {
    // Se a opção selecionada pelo usuário for igual à resposta correta do array
    userScore += 1; // Atualiza o valor da pontuação com 1
    scoreTextPoint.innerHTML = userScore * 10;
    answer.classList.add("correct"); // Adiciona a cor verde à opção selecionada correta
    answer.insertAdjacentHTML("beforeend", tickIconTag); // Adiciona o ícone de marca à opção selecionada correta
    console.log("Resposta Correta");
    console.log("Suas respostas corretas = " + userScore);
  } else {
    answer.classList.add("incorrect"); // Adiciona a cor vermelha à opção selecionada correta
    answer.insertAdjacentHTML("beforeend", crossIconTag); // Adiciona o ícone de cruz à opção selecionada correta
    console.log("Resposta Errada");

    for (let i = 0; i < allOptions; i++) {
      if (optionList.children[i].textContent == correctAns) {
        // Se houver uma opção que corresponda à resposta do array
        optionList.children[i].setAttribute("class", "option correct"); // Adiciona a cor verde à opção correspondente
        optionList.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Adiciona o ícone de marca à opção correspondente
        console.log("Resposta correta selecionada automaticamente.");
      }
    }
  }
  for (let i = 0; i < allOptions; i++) {
    optionList.children[i].classList.add("disabled"); // Uma vez que o usuário selecionou uma opção, desativa todas as opções
  }

  // Avança automaticamente para a próxima pergunta após um breve intervalo
  setTimeout(() => showNextQuestion(), 1000);
}





// Adiciona esta função para avançar automaticamente para a próxima pergunta
function showNextQuestion() {
  if (questionCount < questions.length - 1) {
    questionCount++;
    questionNumber++;
    showQuestions(questionCount);
    questionCounter(questionNumber);
    clearInterval(counter);
    clearInterval(counterLine);
    startTimer(timeValue);
    startTimerLine(0);
    timeText.textContent = "Tempo Restante";
    nextBtn.classList.remove("show");
  } else {
    clearInterval(counter);
    clearInterval(counterLine);
    showResult();
  }
}


function showResult() {
  infoBox.classList.remove("activeInfo"); // Oculta a caixa de informações
  quizBox.classList.remove("activeQuiz"); // Oculta a caixa de quiz
  resultBox.classList.add("activeResult"); // Mostra a caixa de resultado
  const scoreText = resultBox.querySelector(".score_text");
  if (userScore > 6) {
    // Se o usuário acertou mais de 6
    // Cria uma nova tag span e passa o número da pontuação do usuário e o número total de questões
    let scoreTag =
      "<span>Parabéns!! 🎉, você fez <p>" +
      userScore * 10 +
      "</p> de <p>" +
      questions.length * 10 +
      "</p></span>";
    scoreText.innerHTML = scoreTag; // Adiciona a nova tag span dentro de score_Text
  } else if (userScore > 1) {
    // Se o usuário acertou mais de 1
    let scoreTag =
      "<span>Legal 😎, você fez  <p>" +
      userScore * 10 +
      "</p> de <p>" +
      questions.length * 10 +
      "</p></span>";
    scoreText.innerHTML = scoreTag;
  } else {
    // Se o usuário acertou menos de 1
    let scoreTag =
      "<span>Desculpe 😐, Você fez apenas <p>" +
      userScore * 10 +
      "</p> de <p>" +
      questions.length * 10 +
      "</p></span>";
    scoreText.innerHTML = scoreTag;
  }
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time; // Altera o valor de timeCount com o valor de tempo
    time--; // Decrementa o valor de tempo
    if (time < 9) {
      // Se o temporizador for menor que 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; // Adiciona um 0 antes do valor de tempo
    }
    if (time < 0) {
      // Se o temporizador for menor que 0
      clearInterval(counter); // Limpa o contador
      timeText.textContent = "Intervalo"; // Altera o texto de tempo para Intervalo
      const allOptions = optionList.children.length; // Obtém todos os itens de opção
      let correctAns = questions[questionCount].answer; // Obtém a resposta correta do array
      setTimeout(() => showNextQuestion(), 1000);
      for (i = 0; i < allOptions; i++) {
        if (optionList.children[i].textContent == correctAns) {
          // Se houver uma opção que corresponda à resposta do array
          optionList.children[i].setAttribute("class", "option correct"); // Adiciona a cor verde à opção correspondente
          optionList.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Adiciona o ícone de marca à opção correspondente
          console.log("Tempo esgotado: Resposta correta selecionada automaticamente.");
          
        }
      }
      for (i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add("disabled"); // Uma vez que o usuário selecionou uma opção, desativa todas as opções
      }
      nextBtn.classList.add("show"); // Mostra o botão Next se o usuário selecionou alguma opção
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 29);
  function timer() {
    time += 1; // Atualiza o valor de tempo com 1
    timeLine.style.width = time + "px"; // Aumenta a largura da timeLine com px pelo valor de tempo
    if (time > 549) {
      // Se o valor de tempo for maior que 549
      clearInterval(counterLine); // Limpa o counterLine
    }
  }
}

function questionCounter(index) {
  // Cria uma nova tag span e passa o número da questão e o número total de questões
  let totalQuestionCountTag =
    "<span><p>" +
    index +
    "</p> de <p>" +
    questions.length +
    "</p> Questões</span>";
  bottomQuestionCounter.innerHTML = totalQuestionCountTag; // Adiciona a nova tag span dentro de bottom_question_counter
}
