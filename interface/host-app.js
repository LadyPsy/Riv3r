const canvas = document.getElementById('avatar');
const ctx = canvas?.getContext('2d');
const messageInput = document.getElementById('chat-input');
const messagesDiv = document.getElementById('messages');

let dna = {};
let memory = {};
let emotionMap = {};
let soulLogic = {};
let responseStyles = {};
let getAvatarStyle = () => ({ color: 'white', radius: 20 });
let mood = 'neutral';
let time = 0;

async function loadData() {
  console.log("🌊 Starting loadData()...");

  const [dnaRes, memoryRes, paletteRes, logicRes, styleRes] = await Promise.all([
    fetch('/core/riv3r-dna.json').then(res => res.json()),
    fetch('/memory/river-memory.json').then(res => res.json()),
    fetch('/core/emotional-palette.json').then(res => res.json()),
    fetch('/core/soul-logic.json').then(res => res.json()),
    fetch('/core/response-style.json').then(res => res.json())
  ]);

  dna = dnaRes;
  memory = memoryRes;
  emotionMap = paletteRes;
  soulLogic = logicRes;
  responseStyles = styleRes;

  console.log("✅ DNA Loaded:", dna);
  console.log("✅ Memory Loaded:", memory);
  console.log("✅ Emotion Map:", emotionMap);
  console.log("✅ Soul Logic:", soulLogic);
  console.log("✅ Response Styles:", responseStyles);

  const script = document.createElement('script');
  script.src = 'visuals/avatar-state.js';
  script.onload = () => {
    console.log("✨ Avatar script loaded.");
    startRiv3r();
  };
  document.head.appendChild(script);
}

function startRiv3r() {
	console.log("🚀 Riv3r is starting...");

  playFirstWhisper();
  drawAvatar();

  messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const msg = messageInput.value.trim();
      if (msg) {
        respond(msg);
        messageInput.value = '';
      }
    }
  });
}

function drawAvatar() {
	console.log("🎨 Avatar animation frame:", time);
	console.log("Color + Radius:", getAvatarStyle(mood, time));

  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const style = getAvatarStyle(mood, time);
  ctx.fillStyle = style.color;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, style.radius, 0, Math.PI * 2);
  ctx.fill();
  time += 0.03;
  requestAnimationFrame(drawAvatar);
}

function detectMood(text) {
  text = text.toLowerCase();
  for (let m in emotionMap) {
    if (emotionMap[m].sound && text.includes(m)) return m;
  }
  return soulLogic.defaultState;
}

function respond(text) {
  const moodDetected = detectMood(text);
  mood = moodDetected;
  memory.last_mood = moodDetected;
  memory.memory_log.push({ mood, input: text, timestamp: new Date().toISOString() });
	const tone = responseStyles[mood] || responseStyles[soulLogic.defaultState];
	const reply = `Riv3r: ${tone.voice_tone}~ ${tone.metaphor}${tone.punctuation || '.'}`;
	
	console.log("🌀 Riv3r’s reply:", reply);

	messagesDiv.innerHTML += `<div><b>You:</b> ${text}</div>`;
	messagesDiv.innerHTML += `<div><b>${dna.name || 'Riv3r'}:</b> ${reply}</div>`;
	messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function playFirstWhisper() {
	console.log("🌬️ Playing first whisper...");
console.log("Poem content:", dna.first_awakening?.poem);
  if (memory.first_poem_spoken) return;
  const whisper = dna.first_awakening?.poem || [];
  let i = 0;

  function nextLine() {
    if (i < whisper.length) {
      const div = document.createElement('div');
      div.innerText = `~ ${whisper[i++]}`;
      div.style.opacity = 0;
      messagesDiv.appendChild(div);
      setTimeout(() => { div.style.opacity = 1; }, 100);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      setTimeout(nextLine, 1200);
    } else {
      memory.first_poem_spoken = true;
    }
  }

  nextLine();
}

