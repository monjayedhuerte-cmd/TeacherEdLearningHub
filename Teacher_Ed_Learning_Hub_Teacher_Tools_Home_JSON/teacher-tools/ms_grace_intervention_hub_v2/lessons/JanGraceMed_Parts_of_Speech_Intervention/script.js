const GAME_DATA = {
  easy: [
    ["The teacher opened the book.", "Noun", "“Teacher” names a person."],
    ["Mia ran to the gate.", "Verb", "“Ran” shows an action."],
    ["The blue kite flew high.", "Adjective", "“Blue” describes the noun “kite.”"],
    ["They are ready for class.", "Pronoun", "“They” takes the place of people or nouns."],
    ["The baby slept peacefully.", "Adverb", "“Peacefully” tells how the baby slept."],
    ["The shoes are under the bed.", "Preposition", "“Under” shows the relationship between the shoes and the bed."],
    ["Lia studied, and Ben practiced.", "Conjunction", "“And” connects the two ideas."],
    ["Wow! That was amazing!", "Interjection", "“Wow!” expresses a sudden reaction."],
    ["The dog chased the ball.", "Noun", "“Dog” and “ball” name things; the target is a noun."],
    ["Hurray! We won the game!", "Interjection", "“Hurray!” expresses strong feeling."]
  ],
  average: [
    ["In “The small puppy barked loudly,” what part of speech is “small”?", "Adjective", "“Small” describes the noun “puppy.”"],
    ["In “Carlos carefully packed his bag,” what part of speech is “carefully”?", "Adverb", "“Carefully” tells how Carlos packed."],
    ["In “She finished her project,” what part of speech is “She”?", "Pronoun", "“She” replaces a person's name."],
    ["In “The books are beside the computer,” what part of speech is “beside”?", "Preposition", "“Beside” shows a place relationship."],
    ["In “I wanted to play, but it was raining,” what part of speech is “but”?", "Conjunction", "“But” connects contrasting ideas."],
    ["In “The athlete sprinted across the field,” what part of speech is “sprinted”?", "Verb", "“Sprinted” shows an action."],
    ["In “The bright moon appeared,” what part of speech is “moon”?", "Noun", "“Moon” names a thing."],
    ["In “Ouch! My foot hurts,” what part of speech is “Ouch!”?", "Interjection", "“Ouch!” expresses a sudden feeling."],
    ["In “Three students volunteered,” what part of speech is “Three”?", "Adjective", "“Three” gives information about the noun “students.”"],
    ["In “He spoke very softly,” what part of speech is “very”?", "Adverb", "“Very” modifies the adverb “softly.”"]
  ],
  difficult: [
    ["In “The fast runner won the race,” what is “fast”?", "Adjective", "“Fast” describes the noun “runner.”"],
    ["In “The runner moved fast,” what is “fast”?", "Adverb", "Here “fast” describes how the runner moved."],
    ["In “Before dinner, we washed our hands,” what is “Before”?", "Preposition", "“Before” establishes a time relationship with dinner."],
    ["In “Before we ate, we washed our hands,” what is “Before”?", "Conjunction", "Here “before” connects two clauses."],
    ["In “The tired students quietly entered,” what is “quietly”?", "Adverb", "“Quietly” tells how the students entered."],
    ["In “The tired students quietly entered,” what is “tired”?", "Adjective", "“Tired” describes the noun “students.”"],
    ["In “Running is good exercise,” what is “Running”?", "Noun", "Here “Running” names an activity and functions as the subject."],
    ["In “Running quickly, Ana reached the bus,” what is “quickly”?", "Adverb", "“Quickly” tells how Ana was running."],
    ["In “Although it rained, the match continued,” what is “Although”?", "Conjunction", "“Although” connects the dependent clause to the main clause."],
    ["In “The children played outside,” what is “outside”?", "Adverb", "“Outside” tells where the children played."]
  ],
  master: [
    ["“The scientist carefully recorded the results.” What is “carefully”?", "Adverb", "It tells how the scientist recorded the results."],
    ["“Those flowers are beautiful.” What is “Those”?", "Adjective", "“Those” points out which flowers and modifies the noun."],
    ["“Those flowers are beautiful.” What is “beautiful”?", "Adjective", "It describes the noun “flowers” through a linking verb."],
    ["“Wow! You solved it.” What is “Wow!”?", "Interjection", "It expresses a sudden reaction."],
    ["“The keys are inside the drawer.” What is “inside”?", "Preposition", "It shows the relationship between the keys and the drawer."],
    ["“I stayed home because I was sick.” What is “because”?", "Conjunction", "It connects the reason clause to the main idea."],
    ["“They quickly finished their work.” What is “They”?", "Pronoun", "It replaces the names of the people."],
    ["“The enormous elephant walked slowly.” What is “enormous”?", "Adjective", "It describes the noun “elephant.”"],
    ["“The enormous elephant walked slowly.” What is “walked”?", "Verb", "It shows the action of the elephant."],
    ["“The enormous elephant walked slowly.” What is “slowly”?", "Adverb", "It tells how the elephant walked."]
  ]
};

const GAME_TITLES = {
  easy: "Word Scout",
  average: "Grammar Matcher",
  difficult: "Grammar Escape",
  master: "Grammar Master"
};

const HINTS = {
  Noun: "Ask: Does the word name a person, place, thing, or idea?",
  Pronoun: "Ask: Is the word taking the place of a noun?",
  Verb: "Ask: Does the word show an action or state of being?",
  Adjective: "Ask: Does the word describe or give information about a noun or pronoun?",
  Adverb: "Ask: Does the word tell how, when, where, or to what degree?",
  Preposition: "Look for a relationship involving place, time, direction, or another connection.",
  Conjunction: "Ask: Does the word connect words, phrases, or clauses?",
  Interjection: "Ask: Does the word express a sudden feeling or reaction?"
};

const STORAGE_KEY = "jangracemed_parts_of_speech_v1";
const defaultProgress = () => ({
  points: 0,
  bestStreak: 0,
  gamesPlayed: 0,
  mastered: { easy: 0, average: 0, difficult: 0, master: 0 }
});

let progress = loadProgress();
let game = null;

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return defaultProgress();
    return {
      points: Number(saved.points) || 0,
      bestStreak: Number(saved.bestStreak) || 0,
      gamesPlayed: Number(saved.gamesPlayed) || 0,
      mastered: {
        easy: Number(saved.mastered?.easy) || 0,
        average: Number(saved.mastered?.average) || 0,
        difficult: Number(saved.mastered?.difficult) || 0,
        master: Number(saved.mastered?.master) || 0
      }
    };
  } catch (error) {
    return defaultProgress();
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    // The game remains usable even when browser storage is unavailable.
  }
  renderProgress();
}

function renderProgress() {
  document.getElementById("total-points").textContent = progress.points;
  document.getElementById("best-streak").textContent = progress.bestStreak;
  document.getElementById("games-played").textContent = progress.gamesPlayed;

  const levels = ["easy", "average", "difficult", "master"];
  const masteredCount = levels.filter(level => progress.mastered[level] >= 10).length;
  document.getElementById("mastered").textContent = masteredCount;

  document.getElementById("progress-panel").innerHTML = levels.map(level => {
    const count = Math.min(10, progress.mastered[level]);
    const label = level.charAt(0).toUpperCase() + level.slice(1);
    return `
      <div class="prow">
        <span><b>${label}</b><b>${count} / 10</b></span>
        <div class="track"><i class="fill-${level}" style="width:${count * 10}%"></i></div>
      </div>
    `;
  }).join("");
}

function shuffled(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function makeChoices(correct) {
  const all = ["Noun", "Pronoun", "Verb", "Adjective", "Adverb", "Preposition", "Conjunction", "Interjection"];
  return shuffled([correct, ...shuffled(all.filter(item => item !== correct)).slice(0, 3)]);
}

function openGame(level) {
  game = {
    level,
    index: 0,
    score: 0,
    streak: 0,
    answered: false,
    hintUsed: false,
    finished: false
  };

  const modal = document.getElementById("game-modal");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  renderQuestion();
}

function closeGame() {
  document.getElementById("game-modal").classList.remove("show");
  document.getElementById("game-modal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  game = null;
}

function renderQuestion() {
  if (!game) return;

  const item = GAME_DATA[game.level][game.index];
  game.answered = false;
  game.hintUsed = false;

  document.getElementById("game-level").textContent = game.level.toUpperCase();
  document.getElementById("game-title").textContent = GAME_TITLES[game.level];
  document.getElementById("question-number").textContent = game.index + 1;
  document.getElementById("question-progress").style.width = `${(game.index + 1) * 10}%`;
  document.getElementById("game-question").textContent = item[0];
  document.getElementById("hint-text").textContent = "";

  const feedback = document.getElementById("feedback");
  feedback.className = "feedback";
  feedback.textContent = "";

  const next = document.getElementById("next-button");
  next.disabled = true;
  next.textContent = game.index === 9 ? "Finish Game →" : "Next Question →";

  document.getElementById("live-score").textContent = game.score;
  document.getElementById("live-streak").textContent = game.streak;

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  makeChoices(item[1]).forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => answerQuestion(button, choice, item));
    answers.appendChild(button);
  });
}

function answerQuestion(button, answer, item) {
  if (!game || game.answered || game.finished) return;

  game.answered = true;
  const correct = answer === item[1];
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === item[1]) btn.classList.add("correct");
  });

  const feedback = document.getElementById("feedback");

  if (correct) {
    button.classList.add("correct");
    game.streak += 1;
    const points = Math.max(5, 10 + (game.streak - 1) * 5 - (game.hintUsed ? 3 : 0));
    game.score += points;
    progress.points += points;
    progress.bestStreak = Math.max(progress.bestStreak, game.streak);

    feedback.className = "feedback correct";
    feedback.textContent = `✓ Correct! ${item[2]} +${points} points`;
    launchConfetti();
  } else {
    button.classList.add("wrong");
    game.streak = 0;
    feedback.className = "feedback wrong";
    feedback.textContent = `✗ Not quite. The correct answer is “${item[1]}.” ${item[2]}`;
  }

  document.getElementById("live-score").textContent = game.score;
  document.getElementById("live-streak").textContent = game.streak;
  document.getElementById("next-button").disabled = false;
  saveProgress();
}

function showHint() {
  if (!game || game.answered || game.hintUsed) return;
  game.hintUsed = true;

  const item = GAME_DATA[game.level][game.index];
  document.getElementById("hint-text").textContent = HINTS[item[1]] || "Look closely at the job the word performs in the sentence.";
}

function goNext() {
  if (!game || !game.answered) return;

  if (game.index < 9) {
    game.index += 1;
    renderQuestion();
    return;
  }

  game.finished = true;
  progress.gamesPlayed += 1;
  progress.mastered[game.level] = Math.max(
    progress.mastered[game.level],
    game.score >= 70 ? 10 : Math.min(10, Math.floor(game.score / 10))
  );
  saveProgress();

  const feedback = document.getElementById("feedback");
  feedback.className = "feedback correct";
  feedback.textContent = `🏆 Game complete! You scored ${game.score} points. ${resultMessage(game.score)}`;

  const next = document.getElementById("next-button");
  next.disabled = false;
  next.textContent = "Play Again →";
  next.onclick = () => {
    next.onclick = goNext;
    openGame(game.level);
  };
}

function resultMessage(score) {
  if (score >= 120) return "Outstanding! You are a grammar master!";
  if (score >= 90) return "Excellent work! Keep challenging yourself!";
  if (score >= 70) return "Great job! Your grammar skills are growing!";
  return "Good effort! Practice again and keep improving!";
}

function launchConfetti() {
  const container = document.getElementById("confetti");
  const pieces = ["#e5b63e", "#2e7dd2", "#18a566", "#7450c7", "#ef9424"];

  for (let i = 0; i < 14; i += 1) {
    const piece = document.createElement("i");
    piece.className = "piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = "-20px";
    piece.style.background = pieces[i % pieces.length];
    piece.style.animationDelay = `${Math.random() * 0.15}s`;
    container.appendChild(piece);
    window.setTimeout(() => piece.remove(), 1400);
  }
}

document.querySelectorAll(".game-card button").forEach(button => {
  button.addEventListener("click", () => openGame(button.dataset.level));
});

document.getElementById("close-game").addEventListener("click", closeGame);
document.querySelector(".modal-shade").addEventListener("click", closeGame);
document.getElementById("hint-button").addEventListener("click", showHint);
document.getElementById("next-button").addEventListener("click", goNext);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && game) closeGame();
});

document.querySelectorAll(".quick-options button").forEach(button => {
  button.addEventListener("click", () => {
    const feedback = document.getElementById("quick-feedback");
    if (button.dataset.answer === "Adjective") {
      feedback.textContent = "✓ Correct! “Bright” describes the noun “stars,” so it is an adjective.";
      feedback.style.color = "#168253";
    } else {
      feedback.textContent = "Try again. Ask: what job does “bright” perform for the noun “stars”?";
      feedback.style.color = "#a33b3b";
    }
  });
});

renderProgress();
