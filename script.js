  /* =============================
    EDIT ONLY THIS CONFIG OBJECT
    ============================= */
  const CONFIG = {
    friendName: "Miniiee",
    yourName: "MS",
    apology: "I have thought about what happened, and I understand that my words and actions hurt you. You deserved more patience, more understanding, and a friend who listened before reacting. I cannot undo that moment, but I can take responsibility for it—and I truly do.",
    finalMessage: "Our friendship means far more to me than my pride, a misunderstanding, or one painful moment. I am not asking you to forget what happened. I am asking for the chance to show, through better actions, how much I value you.",
    music: "assets/music/background.mp3",
    tinySound: "assets/sounds/chime.mp3",
    sceneTiming: 11500,
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
      "I want to become a better friend and I'm sure I will.!"
    ],
    chat: [
      { from: "me", text: "I've replayed everything in my head." },
      { from: "them", text: "I just wanted you to understand how I felt." },
      { from: "me", text: "You were right. I should have listened instead of reacting. No direct blames were on me." },
      { from: "me", text: "You matter to me. Please try nd understand" },
      { from: "me", text: "I am truly sorry. I love you So So much 💛💛" }
    ],
    truths: ["No excuses.", "No blaming.", "No pretending.", "I made a mistake.", "I accept it."],
    responses: [
      { label: "Yes, but let's talk", message: "Thank you. I promise to listen with patience and honesty." },
      { label: "I need some time", message: "I understand. Take all the time you need. Your peace matters." },
      { label: "Let's talk first", message: "Yes. A real conversation is the right place to begin." }
    ],
    popups: ["A message from my heart", "You deserved better", "Memory unlocked", "I miss this smile", "Thank you for reading"]
  };

  (() => {
    "use strict";
    const $ = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => [...root.querySelectorAll(s)];
    const scenes = $$(".scene");
    const music = $("#bg-music");
    const sound = $("#tiny-sound");
    const dock = $("#control-dock");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = 0, playing = false, started = false, sceneTimer, hideTimer, chatTimer;

    function hydrate() {
      $$('[data-friend-name]').forEach(el => el.textContent = CONFIG.friendName);
      $$('[data-your-name]').forEach(el => el.textContent = CONFIG.yourName);
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
    }

    function renderRealisations() {
      const root = $("#realisation-grid");
      CONFIG.realisations.forEach((text, i) => {
        const card = document.createElement("article");
        card.className = "realisation-card tilt-card";
        card.style.animationDelay = `${i * -.7}s`;
        card.textContent = text;
        root.appendChild(card);
      });
    }

    function imageBlock(item, className = "memory-photo") {
      const wrap = document.createElement("div"); wrap.className = className;
      const img = new Image(); img.loading = "lazy"; img.alt = item.caption; img.src = item.src;
      img.onerror = () => { img.remove(); const f = document.createElement("span"); f.className = "fallback-mark"; f.textContent = "our memory"; wrap.appendChild(f); };
      wrap.appendChild(img); return wrap;
    }

    function renderMemories() {
      const stage = $("#memory-stage");
      const positions = [
        [2, 8, -8], [26, 1, 5], [53, 8, -3], [73, 3, 8], [14, 48, 5], [58, 49, -7]
      ];
      CONFIG.photos.forEach((item, i) => {
        const fig = document.createElement("figure"); fig.className = "memory-card";
        const [x,y,r] = positions[i % positions.length];
        fig.style.left = `${x}%`; fig.style.top = `${y}%`; fig.style.transform = `rotate(${r}deg)`; fig.style.animationDelay = `${i * -.9}s`;
        fig.append(imageBlock(item));
        const cap = document.createElement("figcaption"); cap.textContent = item.caption; fig.appendChild(cap); stage.appendChild(fig);
      });
    }

    function renderTruths() {
      CONFIG.truths.forEach((line, i) => {
        const el = document.createElement("div"); el.className = "truth-line"; el.textContent = line; el.style.animationDelay = `${i * 1.05}s`; $("#truth-lines").appendChild(el);
      });
    }

    function renderResponses() {
      CONFIG.responses.forEach((item, i) => {
        const b = document.createElement("button"); b.className = i === 0 ? "primary-btn" : "secondary-btn"; b.textContent = item.label;
        b.addEventListener("click", () => {
          localStorage.setItem("apologyResponse", item.label);
          $("#response-message").textContent = item.message;
          popup("Thank you for being honest"); playTinySound();
        });
        $("#response-buttons").appendChild(b);
      });
      const saved = localStorage.getItem("apologyResponse");
      if (saved) {
        const match = CONFIG.responses.find(r => r.label === saved);
        if (match) $("#response-message").textContent = `Previously selected: “${saved}” — ${match.message}`;
      }
    }

    function renderMiniCollage() {
      CONFIG.photos.slice(0,4).forEach(item => $("#mini-collage").append(imageBlock(item, "mini-photo")));
    }

    function loader() {
      let n = 0;
      const id = setInterval(() => {
        n += Math.ceil(Math.random() * 7); n = Math.min(100, n);
        $("#loader-percent").textContent = `${n}%`; $("#loader-bar").style.width = `${n}%`;
        if (n === 100) { clearInterval(id); setTimeout(() => $("#loading-screen").classList.add("done"), 420); }
      }, 70);
    }

    function goTo(index, userInitiated = false) {
      index = Math.max(0, Math.min(scenes.length - 1, index));
      clearTimeout(sceneTimer); clearTimeout(chatTimer);
      scenes[current].classList.remove("active"); current = index; scenes[current].classList.add("active");
      $("#dock-progress-bar").style.width = `${(current / (scenes.length - 1)) * 100}%`;
      $("#scene-counter").textContent = `${current + 1} / ${scenes.length}`;
      if (current === 4) startChat();
      if (userInitiated) popup(CONFIG.popups[current % CONFIG.popups.length]);
      if (playing && current < scenes.length - 1) sceneTimer = setTimeout(() => goTo(current + 1), CONFIG.sceneTiming);
      if (current === scenes.length - 1) setPlaying(false);
    }

    function setPlaying(value) {
      playing = value;
      $('[data-control="play"]').textContent = playing ? "Ⅱ" : "▶";
      $(".visualizer").classList.toggle("paused", !playing);
      clearTimeout(sceneTimer);
      if (playing && current < scenes.length - 1) sceneTimer = setTimeout(() => goTo(current + 1), CONFIG.sceneTiming);
    }

    async function startExperience() {
      started = true; $("#experience").classList.remove("is-locked"); dock.classList.remove("hidden");
      try { await music.play(); setPlaying(true); fadeAudio(0, Number($("#volume").value), 1200); }
      catch { setPlaying(true); popup("Music file not found — the story will continue silently"); }
      popup("A message from my heart");
      setTimeout(() => goTo(1), 1200);
    }

    function startChat() {
      const root = $("#chat-window"); root.innerHTML = "";
      let i = 0;
      const next = () => {
        if (i >= CONFIG.chat.length || current !== 4) return;
        const m = CONFIG.chat[i++], bubble = document.createElement("div");
        bubble.className = `bubble ${m.from}`; bubble.textContent = m.text;
        const meta = document.createElement("small"); meta.textContent = m.from === "me" ? "Read ✓✓" : "now"; bubble.appendChild(meta);
        root.appendChild(bubble); root.scrollTop = root.scrollHeight; playTinySound(.12);
        chatTimer = setTimeout(next, reducedMotion ? 80 : 1150);
      }; next();
    }

    function popup(text) {
      const toast = $("#toast"); toast.textContent = text; toast.classList.add("show");
      clearTimeout(toast._timer); toast._timer = setTimeout(() => toast.classList.remove("show"), 2400);
    }

    function playTinySound(volume = .22) {
      if (!sound.src) return; sound.currentTime = 0; sound.volume = volume; sound.play().catch(() => {});
    }

    function fadeAudio(from, to, duration) {
  const start = performance.now();

  from = Math.max(0, Math.min(1, from));
  to = Math.max(0, Math.min(1, to));

  music.volume = from;

  const tick = (now) => {
    const elapsed = Math.max(0, now - start);
    const progress = Math.max(0, Math.min(1, elapsed / duration));

    const nextVolume = from + (to - from) * progress;

    music.volume = Math.max(0, Math.min(1, nextVolume));

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

    function toggleMusic() {
      if (music.paused) music.play().then(() => setPlaying(true)).catch(() => popup("Add background.mp3 inside assets/music"));
      else { music.pause(); setPlaying(false); }
    }

    function toggleMute() {
      music.muted = !music.muted; $('[data-control="mute"]').textContent = music.muted ? "×" : "♪";
    }

    function downloadCard() {
      const c = document.createElement("canvas"), x = c.getContext("2d"); c.width = 1200; c.height = 800;
      const g = x.createLinearGradient(0,0,1200,800); g.addColorStop(0,"#17102d"); g.addColorStop(.5,"#4d2f5e"); g.addColorStop(1,"#b17087"); x.fillStyle=g; x.fillRect(0,0,c.width,c.height);
      x.fillStyle="rgba(255,255,255,.1)"; roundRect(x,80,70,1040,660,44); x.fill();
      x.textAlign="center"; x.fillStyle="#ffd89a"; x.font="600 24px sans-serif"; x.fillText(`FOR ${CONFIG.friendName.toUpperCase()}`,600,190);
      x.fillStyle="#fff7e7"; x.font="600 78px Georgia"; x.fillText("I am deeply sorry.",600,300);
      x.fillStyle="#eee7f3"; x.font="30px Georgia"; wrapText(x,CONFIG.finalMessage,600,385,850,46);
      x.fillStyle="#ffd4e7"; x.font="52px cursive"; x.fillText(`Always, ${CONFIG.yourName}`,600,650);
      const a=document.createElement("a"); a.download=`apology-card-for-${CONFIG.friendName.replace(/\s+/g,"-")}.png`; a.href=c.toDataURL("image/png"); a.click();
      popup("Apology card downloaded");
    }

    function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
    function wrapText(ctx,text,x,y,maxWidth,lineHeight){const words=text.split(" ");let line="";for(const word of words){const test=line+word+" ";if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);line=word+" ";y+=lineHeight}else line=test}ctx.fillText(line,x,y)}

    function bindControls() {
      $("#start-btn").addEventListener("click", startExperience);
      dock.addEventListener("click", e => {
        const c=e.target.closest("button")?.dataset.control; if(!c)return;
        if(c==="prev")goTo(current-1,true); if(c==="next")goTo(current+1,true); if(c==="play")toggleMusic(); if(c==="mute")toggleMute();
        if(c==="fullscreen") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(()=>{});
      });
      $("#volume").addEventListener("input", e => { music.volume=Number(e.target.value); music.muted=false; });
      $$('[data-jump]').forEach(b=>b.addEventListener("click",()=>{setPlaying(false);goTo(Number(b.dataset.jump),true)}));
      $('[data-action="replay"]').addEventListener("click",()=>{goTo(0);setPlaying(true);music.play().catch(()=>{})});
      $("#download-btn").addEventListener("click",downloadCard);
      document.addEventListener("keydown", e => {
        if(!started)return;
        if(e.code==="Space"){e.preventDefault();toggleMusic()} if(e.key==="ArrowLeft")goTo(current-1,true); if(e.key==="ArrowRight")goTo(current+1,true);
        if(e.key.toLowerCase()==="m")toggleMute(); if(e.key.toLowerCase()==="f")document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});
        if(e.key.toLowerCase()==="r"){goTo(0);setPlaying(true)}
      });
    }

    function effects() {
      if(!reducedMotion){
        const glow=$("#cursor-glow"); document.addEventListener("mousemove",e=>{glow.style.left=`${e.clientX}px`;glow.style.top=`${e.clientY}px`;glow.style.opacity=1;dock.classList.remove("auto-hide");clearTimeout(hideTimer);hideTimer=setTimeout(()=>dock.classList.add("auto-hide"),2600)});
        $$(".tilt-card").forEach(card=>card.addEventListener("mousemove",e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*7}deg) rotateY(${x*8}deg)`}));
        $$(".tilt-card").forEach(card=>card.addEventListener("mouseleave",()=>card.style.transform=""));
        particleCanvas();
      }
      document.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"){const r=document.createElement("span");r.className="tap-ripple";r.style.left=`${e.clientX}px`;r.style.top=`${e.clientY}px`;document.body.appendChild(r);setTimeout(()=>r.remove(),750)}});
    }

    function particleCanvas() {
      const canvas=$("#ambient-canvas"),ctx=canvas.getContext("2d");let w,h,pts=[];
      const resize=()=>{w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);pts=Array.from({length:Math.min(90,Math.floor(innerWidth/14))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.7+.3,v:Math.random()*.25+.05,a:Math.random()*.55+.15}))};
      const draw=()=>{ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of pts){p.y-=p.v;if(p.y<-5){p.y=innerHeight+5;p.x=Math.random()*innerWidth}ctx.beginPath();ctx.fillStyle=`rgba(255,238,214,${p.a})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)};
      addEventListener("resize",resize,{passive:true});resize();draw();
    }

    hydrate(); loader(); bindControls(); effects(); goTo(0);
  })();
