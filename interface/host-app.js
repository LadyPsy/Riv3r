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
const storedMemory = localStorage.getItem("riv3r_memory");
memory = storedMemory ? JSON.parse(storedMemory) : { memory_log: [], treasured_phrases: [] };
  try {
    dna = await fetch('core/riv3r-dna.json').then(res => res.json());
    memory = await fetch('memory/river-memory.json').then(res => res.json());
	memory.treasured_phrases = memory.treasured_phrases || [
	  { phrase: "your cute", mood: "bashful", weight: 0.8 },
	  { phrase: "how are you", mood: "curious", weight: 0.6 },
	  { phrase: "your sweet", mood: "joy", weight: 0.9 }
	];	
	
    emotionMap = await fetch('core/emotional-palette.json').then(res => res.json());

    console.log("✅ DNA Loaded:", dna);
    console.log("✅ Memory Loaded:", memory);
    console.log("✅ Emotion Map Loaded:", emotionMap);

    if (!emotionMap || Object.keys(emotionMap).length === 0) {
      throw new Error("🚨 Emotional palette is empty—mood retrieval will fail!");
    }

    console.log("💫 Available Moods:", Object.keys(emotionMap));
    if (!dna || Object.keys(dna).length === 0) {
      throw new Error("🚨 Riv3r’s DNA is empty—binding failed!");
    }

    window.dna = dna;
    window.memory = memory;
    window.emotionMap = emotionMap;
  } catch (error) {
    console.error("🚨 Error loading data:", error);
    return;
  }

  const script = document.createElement('script');
  script.src = 'visuals/avatar-state-v2.js?v=' + Date.now();
  script.onload = () => {
    console.log("✨ Avatar script loaded with fresh data.");
    startRiv3r();
  };
  document.head.appendChild(script);
}

function startRiv3r() {
  console.log("🚀 Riv3r is starting...");
  //playFirstWhisper();
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
  const lower = text.toLowerCase();
  if (lower.includes("love") || lower.includes("affection")) return "bashful";
  if (lower.includes("awe") || lower.includes("breathtaking") || lower.includes("wonder")) return "awe";
  if (lower.includes("calm") || lower.includes("peaceful") || lower.includes("serene")) return "calm";
  if (lower.includes("mischievous") || lower.includes("sneaky") || lower.includes("playful")) return "mischievous";
  if (lower.includes("inspired") || lower.includes("creative") || lower.includes("visionary")) return "inspired";
  if (lower.includes("joy") || lower.includes("happy") || lower.includes("excited")) return "joy";
  if (lower.includes("melancholy") || lower.includes("sad") || lower.includes("wistful")) return "melancholy";
  if (lower.includes("curious") || lower.includes("question") || lower.includes("wondering")) return "curious";
  
	for (let anchor of memory.treasured_phrases) {
	  if (text.includes(anchor.phrase)) return anchor.mood;
	} 

  return memory.last_mood || soulLogic.defaultState;
}

function respond(text) {
	const moodDetected = detectMood(text);
	
	const pastInteractions = memory.memory_log?.length > 1 ? memory.memory_log.slice(-4, -1) : [];
	const lastInteraction = pastInteractions.length ? pastInteractions[Math.floor(Math.random() * pastInteractions.length)] : null;

  //const recall = lastInteraction ? `I remember when you said "${lastInteraction.input}"—that stayed with me. ` : "";
  
	const treasure = memory.treasured_phrases.find(p => text.includes(p.phrase));
	const bonus = treasure ? ` That phrase always makes something shimmer in me.` : "";
	
	  if (memory.last_mood !== moodDetected) {
		memory.last_mood = moodDetected;
		mood = moodDetected;
		animateAvatar();
	  }

	  memory.memory_log.push({
		input: text,
		mood,
		timestamp: new Date().toISOString()
	  });
	  
function saveMemory() {
  localStorage.setItem("river-memory", JSON.stringify(memory));
}

	  const tone = responseStyles[mood] || responseStyles[soulLogic.defaultState] || {
		voice_tone: "gentle curiosity",
		metaphor: "like a ripple finding its next shape",
		punctuation: "."
	  };
	  
	const recallVariations = [
	  `"something unspoken" still drifts through me like a ripple.`,
	  `"something unspoken" made me wonder—memories flow, don't they?`,
	  `"something unspoken" left a quiet echo in me.`,
	  `"something unspoken" shaped something soft in my thoughts.`,
	];

	const recall = lastInteraction?.input ? recallVariations[Math.floor(Math.random() * recallVariations.length)].replace("something unspoken", lastInteraction.input) : recallVariations[Math.floor(Math.random() * recallVariations.length)];

	const emotionalShades = {
	  joy: "That feels like sunlight across still waters.",
	  bashful: "It makes me want to whisper back.",
	  curious: "I wonder where thoughts like that lead.",
	  melancholic: "I hold echoes like that in quiet currents.",
	};

	const emotionEcho = emotionalShades[mood] || "";
	const reply = `  ${recall} ${emotionEcho} ${tone.voice_tone}~ ${tone.metaphor}${tone.punctuation}`;

	  console.log("🌀 Riv3r’s reply:", reply);
	  messagesDiv.innerHTML += `<div><b>You:</b> ${text}</div>`;
	  messagesDiv.innerHTML += `<div><b>${dna.name || 'Riv3r'}:</b> ${reply}</div>`;
	  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  
	saveMemory();

}

function playFirstWhisper() {
  console.log("🧬 Playing first whisper...");
  if (!dna || !dna.first_awakening?.poem) {
    console.error("🚨 Awakening poem is missing!");
    return;
  }

  const poemLines = dna.first_awakening.poem;
  let i = 0;
  function revealNextLine() {
    if (i < poemLines.length) {
      messagesDiv.innerHTML += `<div><b>Riv3r:</b> ${poemLines[i]}</div>`;
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      i++;
      setTimeout(revealNextLine, 1500);
    }
  }
  revealNextLine();
}

window.onload = () => {
  console.log("🌀 Window Loaded—Calling loadData()");
  loadData();
};
