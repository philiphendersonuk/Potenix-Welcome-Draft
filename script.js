// Potenix module JS

let currentSlide = 1;
const totalSlides = 8;

function showSlide(n) {
  if (n < 1 || n > totalSlides) return;
  currentSlide = n;

  for (let i = 1; i <= totalSlides; i++) {
    const slide = document.getElementById(`slide${i}`);
    if (slide) {
      slide.classList.toggle("active", i === currentSlide);
    }
  }

  // Scroll to the top of the module whenever the slide changes
  const appShell = document.querySelector(".app-shell");
  if (appShell) {
    appShell.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
}

function nextSlide() {
  if (currentSlide < totalSlides) {
    showSlide(currentSlide + 1);
  }
}

function prevSlide() {
  // Don't allow navigation back to the fullscreen intro splash (slide 1)
  if (currentSlide > 2) {
    showSlide(currentSlide - 1);
  }
}

// Play intro video with sound, then auto-advance
function playIntroThenAdvance() {
  const video = document.getElementById("intro-video");
  const btn = document.getElementById("intro-continue");

  if (!video) {
    nextSlide();
    return;
  }

  if (btn) {
    btn.disabled = true;
  }

  video.muted = false;
  video.currentTime = 0;
  video.play().catch(() => {
    nextSlide();
  });
}

/* -----------------------------
   Micro quiz (Slide 3)
----------------------------- */
const microQuiz = [
  {
    id: "q1",
    type: "single",
    question: "How much non-household food waste is produced in the UK each year?",
    options: [
      "500,000 tonnes",
      "1.5 million tonnes",
      "2.8 million tonnes",
      "4 million tonnes"
    ],
    correct: 3
  },
  {
    id: "q2",
    type: "single",
    question: "Why is the current approach to food waste considered inefficient?",
    options: [
      "Landfill dependence",
      "It relies on transporting organic waste off-site, generating additional emissions",
      "Inadequate infrastructure for separating organic from non-recyclable waste",
      "All of the above"
    ],
    correct: 3
  }
];

function renderMicroQuiz() {
  const container = document.getElementById("micro-quiz-container");
  if (!container) return;
  container.innerHTML = "";

  microQuiz.forEach((q, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "quiz-question";
    const title = document.createElement("h2");
    title.textContent = `Q${index + 1}. ${q.question}`;
    wrapper.appendChild(title);

    const optionsList = document.createElement("ul");
    optionsList.className = "quiz-options";

    q.options.forEach((opt, i) => {
      const li = document.createElement("li");
      li.className = "quiz-option";

      const input = document.createElement("input");
      input.type = q.type === "multi" ? "checkbox" : "radio";
      input.name = q.id;
      input.value = i;

      const label = document.createElement("label");
      label.textContent = opt;

      li.appendChild(input);
      li.appendChild(label);
      optionsList.appendChild(li);
    });

    wrapper.appendChild(optionsList);
    container.appendChild(wrapper);
  });
}

function checkMicroQuiz() {
  let correctCount = 0;

  microQuiz.forEach(q => {
    if (q.type === "single") {
      const selected = document.querySelector(`input[name="${q.id}"]:checked`);
      if (selected && Number(selected.value) === q.correct) {
        correctCount++;
      }
    } else if (q.type === "multi") {
      const selected = Array.from(
        document.querySelectorAll(`input[name="${q.id}"]:checked`)
      ).map(el => Number(el.value));
      const correctSet = new Set(q.correct);
      const selectedSet = new Set(selected);
      if (
        correctSet.size === selectedSet.size &&
        [...correctSet].every(v => selectedSet.has(v))
      ) {
        correctCount++;
      }
    }
  });

  const feedback = document.getElementById("micro-quiz-feedback");
  if (!feedback) return;

  if (correctCount === microQuiz.length) {
    feedback.textContent = "Nice work — you’ve got a strong grasp of the challenge.";
    feedback.className = "feedback success";
  } else {
    feedback.textContent =
      "You’ve got some of it. Review your answers and look again at where the problem sits.";
    feedback.className = "feedback error";
  }
}

/* -----------------------------
   Flip cards (Slide 4)
----------------------------- */
const flipCardsData = [
  {
    title: "Food Scraps In",
    front: "Food Scraps In",
    image: "media/flip-scraps.png",
    back: "Teams tip unavoidable kitchen waste into a compact, sealed unit positioned by the bin store. No change to the menu, just a smarter destination for the scraps."
  },
  {
    title: "Engineered Biology in Action",
    front: "Engineered Biology",
    image: "media/flip-biology.jpg",
    back: "Inside the unit, carefully designed biological processes break the waste down under controlled conditions. Operations remain clean and practical — no smell, no pests, no extra faff."
  },
  {
    title: "Power & Proof Out",
    front: "Power & Proof Out",
    image: "media/flip-power.jpg",
    back: "The system produces usable on-site energy in the form of heat or electricity, and feeds performance data into a dashboard that supports ESG reporting."
  }
];

function renderFlipCards() {
  const container = document.getElementById("flip-card-container");
  if (!container) return;
  container.innerHTML = "";

  flipCardsData.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "flip-card";

    const inner = document.createElement("div");
    inner.className = "flip-card-inner";

    // FRONT
    const front = document.createElement("div");
    front.className = "flip-card-face flip-card-front has-image";
    if (card.image) {
      front.style.backgroundImage = `url('${card.image}')`;
    }

    const overlay = document.createElement("div");
    overlay.className = "flip-card-overlay";

    const frontTitle = document.createElement("div");
    frontTitle.className = "flip-card-title";
    frontTitle.textContent = card.front;

    const frontBody = document.createElement("p");
    frontBody.textContent = "Tap to reveal details.";

    overlay.appendChild(frontTitle);
    overlay.appendChild(frontBody);
    front.appendChild(overlay);

    // BACK
    const back = document.createElement("div");
    back.className = "flip-card-face flip-card-back";

    const backTitle = document.createElement("div");
    backTitle.className = "flip-card-title";
    backTitle.textContent = card.title;

    const backBody = document.createElement("p");
    backBody.textContent = card.back;

    back.appendChild(backTitle);
    back.appendChild(backBody);

    inner.appendChild(front);
    inner.appendChild(back);
    cardEl.appendChild(inner);

    // Flip interaction
    cardEl.addEventListener("click", () => {
      cardEl.classList.toggle("flipped");
    });

    container.appendChild(cardEl);

    // Arrow between cards (except after the last one)
    if (index < flipCardsData.length - 1) {
      const arrow = document.createElement("div");
      arrow.className = "process-arrow";
      arrow.innerHTML = "&#8595;";
      container.appendChild(arrow);
    }
  });
}

/* -----------------------------
   Sequencing (Slide 5) – 5-step circular click/select
----------------------------- */
/* -----------------------------
   Sequencing (Slide 5) – vertical layout
----------------------------- */
const sequenceSteps = [
  "Unit runs on food scraps",
  "Collects performance data",
  "New adjusted settings = more energy",
  "Optimisation drives adoption",
  "More sites = better data = better unit"
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderSequence() {
  const container = document.getElementById("circle-sequencing");
  if (!container) return;

  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "sequence-vertical";

  const shuffled = shuffle(sequenceSteps);

  sequenceSteps.forEach((step, index) => {
    const box = document.createElement("div");
    box.className = "sequence-step-box";

    const label = document.createElement("label");
    label.textContent = `Step ${index + 1}`;

    const select = document.createElement("select");
    select.dataset.slotIndex = index;

    const placeholder = document.createElement("option");
    placeholder.textContent = "Select stage...";
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    shuffled.forEach(option => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      select.appendChild(opt);
    });

    box.appendChild(label);
    box.appendChild(select);
    wrapper.appendChild(box);
  });

  const note = document.createElement("div");
  note.className = "sequence-note";
  note.textContent = "When Step 5 is complete, the cycle repeats.";

  wrapper.appendChild(note);

  container.appendChild(wrapper);
}

function checkSequence() {
  const container = document.getElementById("circle-sequencing");
  const selects = container.querySelectorAll("select");
  const feedback = document.getElementById("sequence-feedback");

  let correct = true;

  selects.forEach(select => {
    const idx = Number(select.dataset.slotIndex);
    const correctText = sequenceSteps[idx];

    if (select.value === correctText) {
      select.style.borderColor = "#38e8a5";
    } else {
      select.style.borderColor = "#ff4b6a";
      correct = false;
    }
  });

  if (correct) {
    feedback.textContent = "Perfect — you’ve mapped the optimisation cycle correctly.";
    feedback.className = "feedback success";
  } else {
    feedback.textContent = "Not quite — check the flow again and try once more.";
    feedback.className = "feedback error";
  }
}

/* -----------------------------
   Matching (Slide 7)
----------------------------- */
const matchingTerms = [
  "Point-of-waste treatment",
  "Engineered biology with optimisation capability",
  "Compact sealed hardware",
  "ESG-ready reporting",
  "Data moat",
  "Design Group"
];

const matchingDefinitions = [
  {
    term: "Point-of-waste treatment",
    text: "Food scraps are processed directly at the site where they’re produced, turning them into energy locally instead of sending them away."
  },
  {
    term: "Engineered biology with optimisation capability",
    text: "Biological processes are tuned over time using performance data, so they become faster and more efficient with every run."
  },
  {
    term: "Compact sealed hardware",
    text: "A low-touch, enclosed unit designed to sit by the bin store, handle variable food waste, and run without odours or pests."
  },
  {
    term: "ESG-ready reporting",
    text: "Automatically generated performance information that can be dropped straight into sustainability and compliance reporting."
  },
  {
    term: "Data moat",
    text: "A growing advantage created as every unit adds to the performance dataset, strengthening the underlying optimisation model and making it hard to copy."
  },
  {
    term: "Design Group",
    text: "A group of businesses in hospitality, healthcare, processing and production who feed back on features and workflows so the product fits real sites."
  }
];

function renderMatching() {
  const container = document.getElementById("matching-task");
  if (!container) return;
  container.innerHTML = "";

  matchingDefinitions.forEach((def, index) => {
    const defDiv = document.createElement("div");
    defDiv.className = "match-definition";
    defDiv.dataset.correctTerm = def.term;

    const textP = document.createElement("p");
    textP.textContent = def.text;
    defDiv.appendChild(textP);

    const select = document.createElement("select");
    select.dataset.definitionIndex = index;

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select term...";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    matchingTerms.forEach(term => {
      const opt = document.createElement("option");
      opt.value = term;
      opt.textContent = term;
      select.appendChild(opt);
    });

    defDiv.appendChild(select);
    container.appendChild(defDiv);
  });
}

function checkMatches() {
  const container = document.getElementById("matching-task");
  const selects = container.querySelectorAll("select");
  const feedback = document.getElementById("matching-feedback");
  if (!feedback) return;

  let allCorrect = true;

  selects.forEach(sel => {
    const idx = Number(sel.dataset.definitionIndex);
    const def = matchingDefinitions[idx];
    const chosen = sel.value;

    if (chosen && chosen === def.term) {
      sel.style.borderColor = "#38e8a5";
    } else {
      sel.style.borderColor = "#ff4b6a";
      allCorrect = false;
    }
  });

  if (allCorrect) {
    feedback.textContent = "Great — you’ve nailed the core concepts that make Potenix different.";
    feedback.className = "feedback success";
  } else {
    feedback.textContent =
      "Some of the matches are off. Check the details in each description and try again.";
    feedback.className = "feedback error";
  }
}

/* -----------------------------
   Final quiz (Slide 8)
----------------------------- */
const finalQuiz = [
  {
    id: "fq1",
    question: "Which challenge does Potenix aim to address?",
    options: [
      "The rising cost of packaged food items",
      "The loss of energy and emissions caused by unavoidable food waste",
      "A shortage of industrial composting sites",
      "The decline of global recycling markets"
    ],
    correct: 1
  },
  {
    id: "fq2",
    question: "Which sectors does Potenix focus on?",
    options: [
      "Hospitality, healthcare, processors, production sets",
      "Retail, schools, financial services",
      "Residential households",
      "Farms and fisheries only"
    ],
    correct: 0
  },
  {
    id: "fq3",
    question: "Which sequence best describes the three-stage process?",
    options: [
      "Food scraps in → Engineered biology → Power & proof out",
      "Energy in → Transport → Disposal",
      "Packaging in → Sorting → Recycling",
      "Heat in → Cooling → Landfill"
    ],
    correct: 0
  },
  {
    id: "fq4",
    question: "What is a key feature of the Potenix system?",
    options: [
      "It ships waste to distant facilities for processing.",
      "It creates on-site energy and generates ESG-ready performance data.",
      "It only works with dry packaged food.",
      "It is designed solely for household use."
    ],
    correct: 1
  }
];

function renderFinalQuiz() {
  const container = document.getElementById("final-quiz-container");
  if (!container) return;
  container.innerHTML = "";

  finalQuiz.forEach((q, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "quiz-question";
    const title = document.createElement("h2");
    title.textContent = `Q${index + 1}. ${q.question}`;
    wrapper.appendChild(title);

    const optionsList = document.createElement("ul");
    optionsList.className = "quiz-options";

    q.options.forEach((opt, i) => {
      const li = document.createElement("li");
      li.className = "quiz-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.value = i;

      const label = document.createElement("label");
      label.textContent = opt;

      li.appendChild(input);
      li.appendChild(label);
      optionsList.appendChild(li);
    });

    wrapper.appendChild(optionsList);
    container.appendChild(wrapper);
  });
}

function submitFinalQuiz() {
  let correctCount = 0;

  finalQuiz.forEach(q => {
    const selected = document.querySelector(`input[name="${q.id}"]:checked`);
    if (selected && Number(selected.value) === q.correct) {
      correctCount++;
    }
  });

  const scorePercent = Math.round((correctCount / finalQuiz.length) * 100);
  const feedback = document.getElementById("final-quiz-feedback");
  if (!feedback) return;

  feedback.textContent = `You scored ${scorePercent}%.`;
  feedback.className =
    scorePercent >= 75 ? "feedback success" : "feedback error";

  // SCORM hook placeholder:
  // setScormScore(scorePercent);
}

/* -----------------------------
   Intro video mid-quiz (Slide 1)
----------------------------- */
function setupIntroVideoQuiz() {
  const video = document.getElementById("intro-video");
  const quizOverlay = document.getElementById("intro-video-quiz");
  if (!video || !quizOverlay) return;

  const options = quizOverlay.querySelectorAll(".video-option");
  const feedback = quizOverlay.querySelector("[data-feedback]");

  const QUIZ_TIME = 11.8; // seconds
  let quizShown = false;

  // Pause and show quiz when we hit 11.8 seconds
  video.addEventListener("timeupdate", () => {
    if (!quizShown && video.currentTime >= QUIZ_TIME) {
      quizShown = true;
      video.pause();
      quizOverlay.hidden = false;
      quizOverlay.style.display = "flex";
    }
  });

  // Handle option clicks
  options.forEach((option) => {
    option.addEventListener("click", () => {
      const isCorrect = option.dataset.correct === "true";

      // Reset styles
      options.forEach((opt) => opt.classList.remove("correct", "incorrect"));

      if (isCorrect) {
        option.classList.add("correct");
        if (feedback) {
          feedback.textContent =
            "Exactly — Potenix sees food waste as a source of on-site energy.";
        }

        // Brief pause, then hide overlay and continue video
        setTimeout(() => {
          quizOverlay.hidden = true;
          quizOverlay.style.display = "none";
          video.play();
        }, 400);
      } else {
        option.classList.add("incorrect");
        if (feedback) {
          feedback.textContent =
            "Not quite. Think about what Potenix is trying to unlock from this waste.";
        }
      }
    });
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  setupIntroVideoQuiz();   // ← REQUIRED FOR THE OVERLAY TO WORK
  renderMicroQuiz();
  renderFlipCards();
  renderSequence();
  renderMatching();
  renderFinalQuiz();
  showSlide(1);
});
