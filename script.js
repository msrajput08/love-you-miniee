/* =============================
   EDIT ONLY THIS CONFIG OBJECT
   ============================= */
const CONFIG = {
  friendName: "Miniiee",
  yourName: "MS",
  apology: "I have thought about what happened, and I understand that my words and actions hurt you. You deserved more patience, more understanding, and a friend who listened before reacting. I cannot undo that moment, but I can take responsibility for it—and I truly do.",
  finalMessage: "Our friendship means far more to me than my pride, a misunderstanding, or one painful moment. I am not asking you to forget what happened. I am asking for the chance to show, through better actions, how much I value you.",
  secretMessage: "No matter how angry or distant things feel, you will always matter to me.",
  music: "assets/music/background.mp3",
  tinySound: "assets/sounds/chime.mp3",
  sceneTiming: 11500,
  responseToEndingDelay: 3200,

  photos: [
    { src: "assets/images/photo1.jpeg", caption: "We looked happiest here." },
    { src: "assets/images/photo2.jpeg", caption: "This moment still makes me smile." },
    { src: "assets/images/photo3.jpeg", caption: "We really looked good together." },
    { src: "assets/images/photo4.jpeg", caption: "Some memories never fade." },
    { src: "assets/images/photo5.jpeg", caption: "The smiles were real." },
    { src: "assets/images/photo6.jpeg", caption: "When life felt simple." }
  ],

  realisations: [
    "I should have listened properly.",
    "I should have understood your feelings.",
    "I should never have taken our friendship for granted.",
    "My actions hurt someone very important to me.",
    "I want to become a better friend—and I will."
  ],

  chat: [
    { from: "me", text: "I've replayed everything in my head." },
    { from: "them", text: "I just wanted you to understand how I felt." },
    { from: "me", text: "You were right. I should have listened instead of reacting." },
    { from: "me", text: "You matter to me. I hope you can understand that." },
    { from: "me", text: "I am truly sorry. I love you so, so much 💛💛" }
  ],

  truths: [
    "No excuses.",
    "No blaming.",
    "No pretending.",
    "I made a mistake.",
    "I accept it."
  ],

  responses: [
    {
      label: "Yes, but let's talk",
      message: "Thank you. I promise to listen with patience and honesty.",
      mood: "warm"
    },
    {
      label: "I need some time",
      message: "I understand. Take all the time you need. Your peace matters.",
      mood: "calm"
    },
    {
      label: "Let's talk first",
      message: "Yes. A real conversation is the right place to begin.",
      mood: "hopeful"
    }
  ],

  popups: [
    "A message from my heart",
    "You deserved better",
    "A lesson I needed to learn",
    "Memory unlocked",
    "Words I should have said",
    "The truth, without excuses",
    "From my heart",
    "Thank you for being honest",
    "Thank you for staying"
  ]
};

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const scenes = $$(".scene");
  const music = $("#bg-music");
  const sound = $("#tiny-sound");
  const dock = $("#control-dock");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = 0;
  let started = false;
  let isAutoPlaying = false;
  let isMusicPlaying = false;
  let sceneTimer;
  let hideTimer;
  let chatTimer;
  let responseTimer;
  let lightboxIndex = 0;
  let secretTapCount = 0;
  let secretTapTimer;
  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;

  const particleModes = [
    { type: "dust", color: "255,226,177", amount: 72, speed: .22 },
    { type: "dust", color: "244,204,160", amount: 48, speed: .14 },
    { type: "spark", color: "173,157,255", amount: 62, speed: .20 },
    { type: "heart", color: "255,151,201", amount: 46, speed: .18 },
    { type: "spark", color: "120,183,255", amount: 42, speed: .16 },
    { type: "dust", color: "230,230,238", amount: 20, speed: .10 },
    { type: "heart", color: "255,185,210", amount: 54, speed: .19 },
    { type: "spark", color: "199,184,255", amount: 44, speed: .14 },
    { type: "firefly", color: "255,216,154", amount: 68, speed: .25 }
  ];

  function hydrate() {
    $$("[data-friend-name]").forEach(el => {
      el.textContent = CONFIG.friendName;
    });

    $$("[data-your-name]").forEach(el => {
      el.textContent = CONFIG.yourName;
    });

    $("#apology-text").textContent = CONFIG.apology;
    $("#final-message").textContent = CONFIG.finalMessage;

    music.src = CONFIG.music;
    sound.src = CONFIG.tinySound;
    music.volume = Number($("#volume").value);

    renderRealisations();
    renderMemories();
    renderTruths();
    renderResponses();
    renderMiniCollage();

    createTransitionOverlay();
    createTimeline();
    createLightbox();
    createSecretMessage();
    prepareRevealAnimations();
    prepareParallax();
  }

  function renderRealisations() {
    const root = $("#realisation-grid");
    root.innerHTML = "";

    CONFIG.realisations.forEach((text, index) => {
      const card = document.createElement("article");
      card.className = "realisation-card tilt-card";
      card.style.animationDelay = `${index * -.7}s`;
      card.textContent = text;
      root.appendChild(card);
    });
  }

  function imageBlock(item, className = "memory-photo") {
    const wrap = document.createElement("div");
    wrap.className = className;

    const img = new Image();
    img.loading = "lazy";
    img.alt = item.caption;
    img.src = item.src;

    img.onerror = () => {
      img.remove();
      const fallback = document.createElement("span");
      fallback.className = "fallback-mark";
      fallback.textContent = "our memory";
      wrap.appendChild(fallback);
    };

    wrap.appendChild(img);
    return wrap;
  }

  function renderMemories() {
    const stage = $("#memory-stage");
    stage.innerHTML = "";

    const positions = [
      [2, 8, -8],
      [26, 1, 5],
      [53, 8, -3],
      [73, 3, 8],
      [14, 48, 5],
      [58, 49, -7]
    ];

    CONFIG.photos.forEach((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "memory-card";
      figure.tabIndex = 0;
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", `Open memory: ${item.caption}`);

      const [x, y, rotation] = positions[index % positions.length];
      figure.style.left = `${x}%`;
      figure.style.top = `${y}%`;
      figure.style.transform = `rotate(${rotation}deg)`;
      figure.style.animationDelay = `${index * -.9}s`;

      figure.append(imageBlock(item));

      const caption = document.createElement("figcaption");
      caption.textContent = item.caption;
      figure.appendChild(caption);

      const open = () => {
        figure.classList.remove("camera-flash");
        void figure.offsetWidth;
        figure.classList.add("camera-flash");
        playTinySound(.15);
        setTimeout(() => openLightbox(index), 130);
      };

      figure.addEventListener("click", open);
      figure.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });

      stage.appendChild(figure);
    });
  }

  function renderTruths() {
    const root = $("#truth-lines");
    root.innerHTML = "";

    CONFIG.truths.forEach((line, index) => {
      const element = document.createElement("div");
      element.className = "truth-line";
      element.textContent = line;
      element.style.animationDelay = `${index * 1.05}s`;
      root.appendChild(element);
    });
  }

  function renderResponses() {
    const root = $("#response-buttons");
    root.innerHTML = "";

    CONFIG.responses.forEach((item, index) => {
      const button = document.createElement("button");
      button.className = index === 0 ? "primary-btn" : "secondary-btn";
      button.textContent = item.label;

      button.addEventListener("click", () => handleResponse(item, button));
      root.appendChild(button);
    });

    const saved = localStorage.getItem("apologyResponse");
    if (saved) {
      const match = CONFIG.responses.find(response => response.label === saved);
      if (match) {
        $("#response-message").textContent =
          `Previously selected: “${saved}” — ${match.message}`;
      }
    }
  }

  function handleResponse(item, selectedButton) {
    clearTimeout(responseTimer);

    localStorage.setItem("apologyResponse", item.label);

    const root = $("#response-buttons");
    const card = $(".forgive-card");

    root.classList.add("has-selection");
    $$("button", root).forEach(button => {
      button.classList.toggle("selected-response", button === selectedButton);
    });

    card.classList.remove("responded");
    void card.offsetWidth;
    card.classList.add("responded");

    $("#response-message").textContent = item.message;
    popup("Thank you for being honest");
    playTinySound(.28);

    if (!reducedMotion && item.mood !== "calm") {
      burstParticles(innerWidth / 2, innerHeight * .63, item.mood === "warm" ? 24 : 16);
    }

    responseTimer = setTimeout(() => {
      goTo(scenes.length - 1, true);
    }, CONFIG.responseToEndingDelay);
  }

  function renderMiniCollage() {
    const root = $("#mini-collage");
    root.innerHTML = "";

    CONFIG.photos.slice(0, 4).forEach(item => {
      root.append(imageBlock(item, "mini-photo"));
    });
  }

  function createTransitionOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "scene-transition-overlay";
    overlay.id = "scene-transition-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
  }

  function createTimeline() {
    const labels = [
      "Opening",
      "Apology Letter",
      "What I Realised",
      "Memories",
      "What I Wish I Said",
      "No Excuses",
      "Final Apology",
      "Your Answer",
      "Ending"
    ];

    const timeline = document.createElement("nav");
    timeline.className = "story-timeline";
    timeline.id = "story-timeline";
    timeline.setAttribute("aria-label", "Story scenes");

    scenes.forEach((_, index) => {
      const button = document.createElement("button");
      button.className = "timeline-dot";
      button.type = "button";
      button.setAttribute("aria-label", labels[index] || `Scene ${index + 1}`);
      button.addEventListener("click", () => goTo(index, true));
      timeline.appendChild(button);
    });

    document.body.appendChild(timeline);
  }

  function createLightbox() {
    const lightbox = document.createElement("div");
    lightbox.className = "memory-lightbox";
    lightbox.id = "memory-lightbox";
    lightbox.setAttribute("aria-hidden", "true");

    lightbox.innerHTML = `
      <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="Memory viewer">
        <button class="lightbox-close" type="button" aria-label="Close memory viewer">×</button>
        <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous memory">←</button>
        <div class="lightbox-image-wrap">
          <img id="lightbox-image" alt="">
        </div>
        <div class="lightbox-copy">
          <span class="eyebrow">A memory I still hold close</span>
          <h3 id="lightbox-caption"></h3>
          <p>Some moments become more valuable with time. This is one of mine.</p>
        </div>
        <button class="lightbox-nav lightbox-next" type="button" aria-label="Next memory">→</button>
      </div>
    `;

    document.body.appendChild(lightbox);

    $(".lightbox-close", lightbox).addEventListener("click", closeLightbox);
    $(".lightbox-prev", lightbox).addEventListener("click", () => changeLightbox(-1));
    $(".lightbox-next", lightbox).addEventListener("click", () => changeLightbox(1));

    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightbox();

    const lightbox = $("#memory-lightbox");
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.dataset.modalOpen = "true";
    $(".lightbox-close", lightbox).focus();
  }

  function closeLightbox() {
    const lightbox = $("#memory-lightbox");
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    delete document.body.dataset.modalOpen;
  }

  function changeLightbox(direction) {
    lightboxIndex =
      (lightboxIndex + direction + CONFIG.photos.length) % CONFIG.photos.length;
    updateLightbox();
    playTinySound(.12);
  }

  function updateLightbox() {
    const item = CONFIG.photos[lightboxIndex];
    $("#lightbox-image").src = item.src;
    $("#lightbox-image").alt = item.caption;
    $("#lightbox-caption").textContent = item.caption;
  }

  function createSecretMessage() {
    const secret = document.createElement("div");
    secret.className = "secret-message";
    secret.id = "secret-message";
    secret.setAttribute("aria-hidden", "true");
    secret.innerHTML = `
      <span class="eyebrow">A little truth I hid here</span>
      <p>${CONFIG.secretMessage}</p>
      <button class="secondary-btn" type="button">Close</button>
    `;

    document.body.appendChild(secret);
    $("button", secret).addEventListener("click", closeSecret);

    const secretTargets = $$(".signature, .repair-heart");
    secretTargets.forEach(target => {
      target.style.cursor = "pointer";
      target.title = "There may be something hidden here";

      target.addEventListener("click", () => {
        clearTimeout(secretTapTimer);
        secretTapCount += 1;

        if (secretTapCount >= 3) {
          secretTapCount = 0;
          openSecret();
          return;
        }

        secretTapTimer = setTimeout(() => {
          secretTapCount = 0;
        }, 900);
      });
    });
  }

  function openSecret() {
    const secret = $("#secret-message");
    secret.classList.add("open");
    secret.setAttribute("aria-hidden", "false");
    playTinySound(.3);
    burstParticles(innerWidth / 2, innerHeight / 2, 26);
  }

  function closeSecret() {
    const secret = $("#secret-message");
    secret.classList.remove("open");
    secret.setAttribute("aria-hidden", "true");
  }

  function prepareRevealAnimations() {
    scenes.forEach(scene => {
      const selectors = [
        ".scene-heading .eyebrow",
        ".scene-heading h2",
        ".hero-shell > *",
        ".letter-paper > *:not(.letter-shine)",
        ".realisation-card",
        ".memory-card",
        ".phone-shell",
        ".truth-line",
        ".final-apology-card",
        ".forgive-card > *",
        ".ending-content > *"
      ];

      const elements = selectors.flatMap(selector => $$(selector, scene));
      const uniqueElements = [...new Set(elements)];

      uniqueElements.forEach((element, index) => {
        element.classList.add("reveal-item");
        element.style.setProperty("--reveal-delay", `${90 + index * 85}ms`);
      });
    });
  }

  function prepareParallax() {
    const layers = [
      ...$$(".hero-shell, .scene-heading, .letter-wrap, .phone-shell, .final-apology-card, .forgive-card, .ending-content")
    ];

    layers.forEach((layer, index) => {
      layer.classList.add("parallax-layer");
      layer.dataset.depth = String(.25 + (index % 4) * .12);
    });
  }

  function loader() {
    let percent = 0;

    const interval = setInterval(() => {
      percent += Math.ceil(Math.random() * 7);
      percent = Math.min(100, percent);

      $("#loader-percent").textContent = `${percent}%`;
      $("#loader-bar").style.width = `${percent}%`;

      if (percent === 100) {
        clearInterval(interval);
        setTimeout(() => {
          $("#loading-screen").classList.add("done");
        }, 420);
      }
    }, 70);
  }

  function goTo(index, userInitiated = false) {
    index = Math.max(0, Math.min(scenes.length - 1, index));
    if (index === current && started) return;

    clearTimeout(sceneTimer);
    clearTimeout(chatTimer);

    const previous = current;
    const direction = index > previous ? 1 : -1;
    const oldScene = scenes[previous];
    const newScene = scenes[index];

    playTransition(direction);

    oldScene.classList.remove(
      "active",
      "enter-from-left",
      "enter-from-right",
      "exit-to-left",
      "exit-to-right"
    );
    oldScene.classList.add(direction > 0 ? "exit-to-left" : "exit-to-right");

    newScene.classList.remove(
      "active",
      "enter-from-left",
      "enter-from-right",
      "exit-to-left",
      "exit-to-right"
    );
    newScene.classList.add(direction > 0 ? "enter-from-right" : "enter-from-left");

    current = index;
    updateSceneState();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        newScene.classList.add("active");
        newScene.classList.remove("enter-from-left", "enter-from-right");
      });
    });

    setTimeout(() => {
      oldScene.classList.remove("exit-to-left", "exit-to-right");
    }, reducedMotion ? 20 : 1050);

    if (current === 4) startChat();
    if (current === 3 && !reducedMotion) animateMemoryEntrance();

    if (userInitiated) {
      popup(CONFIG.popups[current % CONFIG.popups.length]);
    }

    scheduleNextScene();

    if (current === scenes.length - 1) {
      setAutoPlaying(false);
    }
  }

  function updateSceneState() {
    document.body.dataset.scene = String(current);
    document.body.dataset.heartStage = String(
      current >= 8 ? 3 :
      current >= 6 ? 2 :
      current >= 2 ? 1 : 0
    );

    $("#dock-progress-bar").style.width =
      `${(current / (scenes.length - 1)) * 100}%`;

    $("#scene-counter").textContent = `${current + 1} / ${scenes.length}`;

    $$(".timeline-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === current);
    });

    $("#story-timeline")?.classList.toggle("visible", started);
  }

  function playTransition(direction) {
    if (reducedMotion) return;

    const overlay = $("#scene-transition-overlay");
    overlay.style.setProperty("--flash-x", direction > 0 ? "68%" : "32%");
    overlay.style.setProperty("--flash-y", `${38 + Math.random() * 24}%`);

    overlay.classList.remove("play");
    void overlay.offsetWidth;
    overlay.classList.add("play");
  }

  function animateMemoryEntrance() {
    $$(".memory-card").forEach((card, index) => {
      card.animate(
        [
          { opacity: 0, transform: `${card.style.transform} translateY(45px) scale(.86)` },
          { opacity: 1, transform: card.style.transform }
        ],
        {
          duration: 800,
          delay: index * 120,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "both"
        }
      );
    });
  }

  function scheduleNextScene() {
    clearTimeout(sceneTimer);

    if (isAutoPlaying && current < scenes.length - 1) {
      sceneTimer = setTimeout(() => {
        goTo(current + 1);
      }, CONFIG.sceneTiming);
    }
  }

  function setAutoPlaying(value) {
    isAutoPlaying = value;
    $('[data-control="play"]').textContent = isAutoPlaying ? "Ⅱ" : "▶";
    clearTimeout(sceneTimer);
    scheduleNextScene();
  }

  async function setMusicPlaying(value) {
    try {
      if (value) {
        await music.play();
        isMusicPlaying = true;
        $(".visualizer").classList.remove("paused");
      } else {
        music.pause();
        isMusicPlaying = false;
        $(".visualizer").classList.add("paused");
      }
    } catch {
      isMusicPlaying = false;
      $(".visualizer").classList.add("paused");
      popup("Add background.mp3 inside assets/music");
    }
  }

  async function startExperience() {
    started = true;
    $("#experience").classList.remove("is-locked");
    dock.classList.remove("hidden");
    $("#story-timeline").classList.add("visible");

    const targetVolume = Number($("#volume").value);
    music.volume = 0;

    await setMusicPlaying(true);

    if (isMusicPlaying) {
      fadeAudio(0, targetVolume, 1200);
    }

    setAutoPlaying(true);
    popup("A message from my heart");

    setTimeout(() => {
      goTo(1);
    }, 1200);
  }

  function startChat() {
    const root = $("#chat-window");
    root.innerHTML = "";

    let index = 0;

    const next = () => {
      if (index >= CONFIG.chat.length || current !== 4) return;

      const message = CONFIG.chat[index++];
      const bubble = document.createElement("div");
      bubble.className = `bubble ${message.from}`;
      bubble.textContent = message.text;

      const meta = document.createElement("small");
      meta.textContent = message.from === "me" ? "Read ✓✓" : "now";
      bubble.appendChild(meta);

      root.appendChild(bubble);
      root.scrollTop = root.scrollHeight;
      playTinySound(.12);

      chatTimer = setTimeout(next, reducedMotion ? 80 : 1150);
    };

    next();
  }

  function popup(text) {
    const toast = $("#toast");
    toast.textContent = text;
    toast.classList.add("show");

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  function playTinySound(volume = .22) {
    if (!sound.src) return;

    sound.currentTime = 0;
    sound.volume = volume;
    sound.play().catch(() => {});
  }

  function fadeAudio(from, to, duration) {
    const start = performance.now();
    from = Math.max(0, Math.min(1, from));
    to = Math.max(0, Math.min(1, to));
    music.volume = from;

    const tick = now => {
      const elapsed = Math.max(0, now - start);
      const progress = Math.max(0, Math.min(1, elapsed / duration));
      music.volume = Math.max(0, Math.min(1, from + (to - from) * progress));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }

  function toggleAutoPlay() {
    setAutoPlaying(!isAutoPlaying);
  }

  async function toggleMusic() {
    await setMusicPlaying(!isMusicPlaying);
  }

  function toggleMute() {
    music.muted = !music.muted;
    $('[data-control="mute"]').textContent = music.muted ? "×" : "♪";
  }

  function downloadCard() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 1200;
    canvas.height = 800;

    const gradient = context.createLinearGradient(0, 0, 1200, 800);
    gradient.addColorStop(0, "#17102d");
    gradient.addColorStop(.5, "#4d2f5e");
    gradient.addColorStop(1, "#b17087");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(255,255,255,.1)";
    roundRect(context, 80, 70, 1040, 660, 44);
    context.fill();

    context.textAlign = "center";
    context.fillStyle = "#ffd89a";
    context.font = "600 24px sans-serif";
    context.fillText(`FOR ${CONFIG.friendName.toUpperCase()}`, 600, 190);

    context.fillStyle = "#fff7e7";
    context.font = "600 78px Georgia";
    context.fillText("I am deeply sorry.", 600, 300);

    context.fillStyle = "#eee7f3";
    context.font = "30px Georgia";
    wrapText(context, CONFIG.finalMessage, 600, 385, 850, 46);

    context.fillStyle = "#ffd4e7";
    context.font = "52px cursive";
    context.fillText(`Always, ${CONFIG.yourName}`, 600, 650);

    const link = document.createElement("a");
    link.download =
      `apology-card-for-${CONFIG.friendName.replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    popup("Apology card downloaded");
  }

  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = `${line}${word} `;

      if (context.measureText(testLine).width > maxWidth && line) {
        context.fillText(line, x, y);
        line = `${word} `;
        y += lineHeight;
      } else {
        line = testLine;
      }
    }

    context.fillText(line, x, y);
  }

  function bindControls() {
    $("#start-btn").addEventListener("click", startExperience);

    dock.addEventListener("click", event => {
      const control = event.target.closest("button")?.dataset.control;
      if (!control) return;

      if (control === "prev") goTo(current - 1, true);
      if (control === "next") goTo(current + 1, true);
      if (control === "play") toggleAutoPlay();
      if (control === "mute") toggleMute();

      if (control === "fullscreen") {
        document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen().catch(() => {});
      }
    });

    $("#volume").addEventListener("input", event => {
      music.volume = Number(event.target.value);
      music.muted = false;

      if (!isMusicPlaying) {
        setMusicPlaying(true);
      }
    });

    $$("[data-jump]").forEach(button => {
      button.addEventListener("click", () => {
        setAutoPlaying(false);
        goTo(Number(button.dataset.jump), true);
      });
    });

    $('[data-action="replay"]').addEventListener("click", () => {
      goTo(0);
      setAutoPlaying(true);
      setMusicPlaying(true);
    });

    $("#download-btn").addEventListener("click", downloadCard);

    document.addEventListener("keydown", event => {
      if ($("#memory-lightbox")?.classList.contains("open")) {
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowLeft") changeLightbox(-1);
        if (event.key === "ArrowRight") changeLightbox(1);
        return;
      }

      if ($("#secret-message")?.classList.contains("open")) {
        if (event.key === "Escape") closeSecret();
        return;
      }

      if (!started) return;

      if (event.code === "Space") {
        event.preventDefault();
        toggleAutoPlay();
      }

      if (event.key === "ArrowLeft") goTo(current - 1, true);
      if (event.key === "ArrowRight") goTo(current + 1, true);
      if (event.key.toLowerCase() === "m") toggleMute();

      if (event.key.toLowerCase() === "f") {
        document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen().catch(() => {});
      }

      if (event.key.toLowerCase() === "r") {
        goTo(0);
        setAutoPlaying(true);
      }
    });

    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener("touchstart", event => {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchend", event => {
      if (!started || document.body.dataset.modalOpen) return;

      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
        goTo(current + (deltaX < 0 ? 1 : -1), true);
      }
    }, { passive: true });
  }

  function effects() {
    if (!reducedMotion) {
      const glow = $("#cursor-glow");

      document.addEventListener("mousemove", event => {
        pointerX = event.clientX;
        pointerY = event.clientY;

        glow.style.left = `${pointerX}px`;
        glow.style.top = `${pointerY}px`;
        glow.style.opacity = 1;

        dock.classList.remove("auto-hide");
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          dock.classList.add("auto-hide");
        }, 2600);

        updateParallax();
      });

      $$(".tilt-card").forEach(card => {
        card.addEventListener("mousemove", event => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - .5;
          const y = (event.clientY - rect.top) / rect.height - .5;

          card.style.transform =
            `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 8}deg)`;
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
      });

      particleCanvas();
      fakeMusicReactiveAmbience();
    }

    document.addEventListener("pointerdown", event => {
      if (event.pointerType !== "mouse") {
        const ripple = document.createElement("span");
        ripple.className = "tap-ripple";
        ripple.style.left = `${event.clientX}px`;
        ripple.style.top = `${event.clientY}px`;
        document.body.appendChild(ripple);

        setTimeout(() => ripple.remove(), 750);
      }
    });
  }

  function updateParallax() {
    const normalizedX = pointerX / innerWidth - .5;
    const normalizedY = pointerY / innerHeight - .5;

    $$(".scene.active .parallax-layer").forEach(layer => {
      const depth = Number(layer.dataset.depth || .3);
      layer.style.setProperty("--px", `${normalizedX * depth * 18}px`);
      layer.style.setProperty("--py", `${normalizedY * depth * 14}px`);
    });

    document.documentElement.style.setProperty(
      "--aurora-x",
      `${normalizedX * 18}px`
    );
    document.documentElement.style.setProperty(
      "--aurora-y",
      `${normalizedY * 14}px`
    );
  }

  function fakeMusicReactiveAmbience() {
    let phase = 0;

    const animate = () => {
      phase += isMusicPlaying ? .025 : .008;
      const pulse = .36 + (Math.sin(phase) + 1) * .055;

      $$(".aurora").forEach((aurora, index) => {
        aurora.style.opacity = String(pulse - index * .025);
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  function particleCanvas() {
    const canvas = $("#ambient-canvas");
    const context = canvas.getContext("2d");
    let particles = [];
    let width;
    let height;

    const createParticle = mode => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: Math.random() * 1.8 + .45,
      velocity: Math.random() * mode.speed + .035,
      alpha: Math.random() * .5 + .12,
      drift: (Math.random() - .5) * .16,
      phase: Math.random() * Math.PI * 2
    });

    const rebuild = () => {
      width = canvas.width = innerWidth * devicePixelRatio;
      height = canvas.height = innerHeight * devicePixelRatio;

      context.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
      );

      const mode = particleModes[current] || particleModes[0];
      const amount = Math.min(mode.amount, Math.floor(innerWidth / 11));
      particles = Array.from({ length: amount }, () => createParticle(mode));
    };

    const drawHeart = (x, y, size, alpha, color) => {
      context.save();
      context.translate(x, y);
      context.scale(size / 18, size / 18);
      context.beginPath();
      context.moveTo(0, 5);
      context.bezierCurveTo(-12, -3, -10, -12, -3, -12);
      context.bezierCurveTo(1, -12, 4, -9, 5, -6);
      context.bezierCurveTo(7, -9, 10, -12, 14, -12);
      context.bezierCurveTo(21, -12, 23, -3, 10, 5);
      context.lineTo(5, 10);
      context.closePath();
      context.fillStyle = `rgba(${color},${alpha})`;
      context.fill();
      context.restore();
    };

    const draw = () => {
      context.clearRect(0, 0, innerWidth, innerHeight);

      const mode = particleModes[current] || particleModes[0];

      particles.forEach(particle => {
        particle.y -= particle.velocity;
        particle.x += particle.drift + Math.sin(particle.phase += .01) * .04;

        if (particle.y < -12) {
          particle.y = innerHeight + 12;
          particle.x = Math.random() * innerWidth;
        }

        if (mode.type === "heart") {
          drawHeart(
            particle.x,
            particle.y,
            particle.radius * 5,
            particle.alpha * .55,
            mode.color
          );
        } else {
          context.beginPath();
          context.fillStyle = `rgba(${mode.color},${particle.alpha})`;
          context.shadowBlur = mode.type === "firefly" ? 12 : 0;
          context.shadowColor = `rgba(${mode.color},.6)`;
          context.arc(
            particle.x,
            particle.y,
            mode.type === "spark" ? particle.radius * .7 : particle.radius,
            0,
            Math.PI * 2
          );
          context.fill();
          context.shadowBlur = 0;
        }
      });

      requestAnimationFrame(draw);
    };

    addEventListener("resize", rebuild, { passive: true });
    rebuild();
    draw();
  }

  function burstParticles(x, y, amount = 20) {
    const symbols = ["❤", "✦", "•"];

    for (let index = 0; index < amount; index += 1) {
      const particle = document.createElement("span");
      particle.textContent = symbols[index % symbols.length];
      particle.style.position = "fixed";
      particle.style.zIndex = "96";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.pointerEvents = "none";
      particle.style.color =
        index % 2 ? "var(--scene-accent)" : "var(--scene-accent-2)";
      particle.style.fontSize = `${8 + Math.random() * 13}px`;

      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const distance = 55 + Math.random() * 155;

      particle.animate(
        [
          {
            opacity: 0,
            transform: "translate(-50%, -50%) scale(.3)"
          },
          {
            opacity: 1,
            offset: .18
          },
          {
            opacity: 0,
            transform:
              `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(1.25) rotate(${Math.random() * 180}deg)`
          }
        ],
        {
          duration: 900 + Math.random() * 600,
          easing: "cubic-bezier(.2,.7,.2,1)",
          fill: "forwards"
        }
      ).finished.finally(() => particle.remove());
    }
  }

  hydrate();
  loader();
  bindControls();
  effects();

  document.body.dataset.scene = "0";
  document.body.dataset.heartStage = "0";
  updateSceneState();
})();
