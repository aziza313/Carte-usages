/*
 * ============================================================================
 * BIDON OU BÉTON ? — moteur de jeu
 * Vanilla JS, aucune dépendance. Le contenu (questions, profils) vit dans
 * questions.js et est chargé avant ce fichier.
 * ============================================================================
 */
(function () {
  "use strict";

  const ROUND_MS = 10000; // 10 secondes par manche
  const PLATFORM_URL = "https://participer.lausanne.ch";
  const REPLAY_GUARD_KEY = "bidonBeton.lastFinishTs";
  const REPLAY_GUARD_MS = 60000; // ne sert qu'à informer, jamais à bloquer

  // --------------------------------------------------------------------
  // Références DOM
  // --------------------------------------------------------------------
  const screens = {
    home: document.getElementById("screen-home"),
    game: document.getElementById("screen-game"),
    final: document.getElementById("screen-final"),
  };
  const horizonWrap = document.getElementById("horizon-wrap");
  const horizonSvg = document.getElementById("horizon-svg");
  const horizonHomeParent = horizonWrap.parentNode;
  const horizonHomeNextSibling = horizonWrap.nextSibling;
  const waypointsGroup = document.getElementById("waypoints");
  const trainEl = document.getElementById("m2-train");

  const btnPlay = document.getElementById("btn-play");
  const homeReplayNote = document.getElementById("home-replay-note");

  const roundCounterEl = document.getElementById("round-counter");
  const timerValueEl = document.getElementById("timer-value");
  const timerFillEl = document.getElementById("timer-fill");
  const questionPromptEl = document.getElementById("question-prompt");
  const answersListEl = document.getElementById("answers-list");
  const btnNext = document.getElementById("btn-next");
  const liveRegion = document.getElementById("live-region");

  const finalAvatarUse = document.getElementById("final-avatar-use");
  const finalProfileName = document.getElementById("final-profile-name");
  const finalTagline = document.getElementById("final-tagline");
  const finalScore = document.getElementById("final-score");
  const btnShare = document.getElementById("btn-share");
  const btnReplay = document.getElementById("btn-replay");
  const shareStatus = document.getElementById("share-status");

  // --------------------------------------------------------------------
  // Géométrie de la pente — doit correspondre aux terrasses dessinées
  // dans index.html (#horizon-svg). 9 points : 0 = départ (accueil),
  // 1..8 = position du wagon après chaque manche jouée.
  // --------------------------------------------------------------------
  const WAYPOINTS = [];
  for (let i = 0; i <= QUESTIONS.length; i++) {
    WAYPOINTS.push({ x: 30 + i * 42, y: 116 - i * 8 });
  }

  function buildWaypointDots() {
    waypointsGroup.innerHTML = "";
    for (let i = 1; i < WAYPOINTS.length; i++) {
      const wp = WAYPOINTS[i];
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", wp.x - 2);
      rect.setAttribute("y", wp.y - 2);
      rect.setAttribute("width", 4);
      rect.setAttribute("height", 4);
      waypointsGroup.appendChild(rect);
    }
  }

  function moveTrainTo(index) {
    const wp = WAYPOINTS[Math.max(0, Math.min(index, WAYPOINTS.length - 1))];
    trainEl.setAttribute("transform", `translate(${wp.x - 13}, ${wp.y - 6})`);
  }

  // --------------------------------------------------------------------
  // État de la partie
  // --------------------------------------------------------------------
  const state = {
    order: [],
    roundIndex: 0,
    score: 0,
    currentAnswers: [],
    roundTimeoutId: null,
    roundTickId: null,
    locked: false,
    busy: false,
  };

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // --------------------------------------------------------------------
  // Navigation entre écrans
  // --------------------------------------------------------------------
  function showScreen(name) {
    Object.keys(screens).forEach((key) => {
      screens[key].hidden = key !== name;
    });

    if (name === "final") {
      // Le décor rejoint le flux normal de l'écran final : jamais de recouvrement,
      // quelle que soit la hauteur du contenu ou de l'écran du visiteur.
      // On recadre aussi la vue sur la droite de la scène, là où le M2 arrive
      // à la cathédrale — c'est ce que le joueur doit voir en dernier.
      horizonWrap.classList.remove("horizon--compact");
      horizonWrap.classList.add("horizon--docked");
      horizonSvg.setAttribute("preserveAspectRatio", "xMaxYMax slice");
      screens.final.appendChild(horizonWrap);
    } else {
      horizonWrap.classList.remove("horizon--docked");
      horizonWrap.classList.toggle("horizon--compact", name === "game");
      horizonSvg.setAttribute("preserveAspectRatio", "xMidYMax slice");
      horizonHomeParent.insertBefore(horizonWrap, horizonHomeNextSibling);
    }
  }

  function focusHeading(el) {
    if (!el) return;
    // Laisse le temps au navigateur d'afficher l'écran avant de déplacer le focus.
    requestAnimationFrame(() => el.focus());
  }

  // --------------------------------------------------------------------
  // Accueil
  // --------------------------------------------------------------------
  function initHome() {
    const lastFinish = Number(localStorage.getItem(REPLAY_GUARD_KEY) || 0);
    if (lastFinish && Date.now() - lastFinish < REPLAY_GUARD_MS) {
      homeReplayNote.textContent =
        "Partie déjà jouée à l'instant — les questions et les réponses seront mélangées différemment.";
    } else {
      homeReplayNote.textContent = "";
    }
  }

  // --------------------------------------------------------------------
  // Déroulé d'une partie
  // --------------------------------------------------------------------
  function startGame() {
    if (state.busy) return;
    state.busy = true;
    setTimeout(() => { state.busy = false; }, 400);

    state.order = shuffle(QUESTIONS.map((_, i) => i));
    state.roundIndex = 0;
    state.score = 0;
    moveTrainTo(0);
    showScreen("game");
    loadRound(0);
  }

  function loadRound(index) {
    if (index >= state.order.length) {
      finishGame();
      return;
    }
    state.roundIndex = index;
    state.locked = false;

    const question = QUESTIONS[state.order[index]];
    state.currentAnswers = shuffle(question.answers);

    roundCounterEl.textContent = `Manche ${index + 1}/${state.order.length}`;
    questionPromptEl.textContent = question.prompt;
    liveRegion.textContent = `Manche ${index + 1} sur ${state.order.length}. ${question.prompt}`;

    answersListEl.innerHTML = "";
    state.currentAnswers.forEach((answer, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";
      btn.dataset.index = String(i);

      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = "BÉTON";

      const label = document.createElement("span");
      label.textContent = answer.text;

      btn.appendChild(tag);
      btn.appendChild(label);
      btn.addEventListener("click", () => handleAnswer(i));

      li.appendChild(btn);
      answersListEl.appendChild(li);
    });

    btnNext.hidden = true;
    focusHeading(questionPromptEl);
    startTimer();
  }

  function startTimer() {
    clearTimeout(state.roundTimeoutId);
    clearInterval(state.roundTickId);

    timerFillEl.style.transition = "none";
    timerFillEl.style.width = "100%";
    timerValueEl.textContent = String(Math.ceil(ROUND_MS / 1000));

    // Redémarre l'animation sur la frame suivante pour que la transition s'applique.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timerFillEl.style.transition = `width ${ROUND_MS}ms linear`;
        timerFillEl.style.width = "0%";
      });
    });

    let remaining = Math.ceil(ROUND_MS / 1000);
    state.roundTickId = setInterval(() => {
      remaining -= 1;
      timerValueEl.textContent = String(Math.max(remaining, 0));
    }, 1000);

    state.roundTimeoutId = setTimeout(() => handleAnswer(null), ROUND_MS);
  }

  function stopTimer() {
    clearTimeout(state.roundTimeoutId);
    clearInterval(state.roundTickId);
    // Fige la barre à sa position actuelle plutôt que de la laisser sauter.
    const computedWidth = getComputedStyle(timerFillEl).width;
    timerFillEl.style.transition = "none";
    timerFillEl.style.width = computedWidth;
  }

  function handleAnswer(selectedIndex) {
    if (state.locked) return;
    state.locked = true;
    stopTimer();

    const question = QUESTIONS[state.order[state.roundIndex]];
    const correctIndex = state.currentAnswers.findIndex((a) => a.correct);
    const isCorrect = selectedIndex === correctIndex;
    if (isCorrect) state.score += 1;

    const buttons = answersListEl.querySelectorAll(".answer-btn");
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      const tag = btn.querySelector(".tag");
      if (i === correctIndex) {
        btn.dataset.state = "correct";
        tag.textContent = "BÉTON";
        const explanation = document.createElement("p");
        explanation.className = "answer-explanation";
        explanation.textContent = question.explanation;
        btn.appendChild(explanation);
      } else {
        btn.dataset.state = i === selectedIndex ? "chosen-wrong" : "wrong";
        tag.textContent = "BIDON";
      }
    });

    liveRegion.textContent = isCorrect
      ? `Béton ! ${question.answers.find((a) => a.correct).text}. ${question.explanation}`
      : `Bidon. La bonne réponse était : ${question.answers.find((a) => a.correct).text}. ${question.explanation}`;

    moveTrainTo(state.roundIndex + 1);

    btnNext.hidden = false;
    focusHeading(btnNext);
  }

  function goToNextRound() {
    loadRound(state.roundIndex + 1);
  }

  // --------------------------------------------------------------------
  // Écran final
  // --------------------------------------------------------------------
  function finishGame() {
    localStorage.setItem(REPLAY_GUARD_KEY, String(Date.now()));

    const profile = PROFILES.find((p) => state.score >= p.min && state.score <= p.max) || PROFILES[0];

    finalAvatarUse.setAttribute("href", `#avatar-${profile.avatar}`);
    finalProfileName.textContent = profile.name;
    finalTagline.textContent = profile.tagline;
    finalScore.textContent = `Score : ${state.score}/${state.order.length}`;
    shareStatus.textContent = "";

    moveTrainTo(WAYPOINTS.length - 1);
    showScreen("final");
    focusHeading(finalProfileName);
  }

  async function shareResult() {
    const profile = PROFILES.find((p) => state.score >= p.min && state.score <= p.max) || PROFILES[0];
    const shareData = {
      title: "Bidon ou Béton ?",
      text: `${profile.name} — ${state.score}/${state.order.length} à Bidon ou Béton, le quiz du Budget participatif de Lausanne.`,
      url: PLATFORM_URL,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Annulation par l'utilisateur ou échec silencieux : rien à faire.
      }
      return;
    }

    const textToCopy = `${shareData.text} ${shareData.url}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      shareStatus.textContent = "Lien copié !";
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        shareStatus.textContent = "Lien copié !";
      } catch (copyErr) {
        shareStatus.textContent = "Lien : " + PLATFORM_URL;
      }
      document.body.removeChild(textarea);
    }
    setTimeout(() => { shareStatus.textContent = ""; }, 4000);
  }

  // --------------------------------------------------------------------
  // Initialisation
  // --------------------------------------------------------------------
  buildWaypointDots();
  moveTrainTo(0);
  initHome();
  showScreen("home");

  btnPlay.addEventListener("click", startGame);
  btnReplay.addEventListener("click", startGame);
  btnNext.addEventListener("click", goToNextRound);
  btnShare.addEventListener("click", shareResult);
})();
