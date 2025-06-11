import dna from '../core/riv3r-dna.json' assert { type: 'json' };
import emotionMap from '../core/emotional-palette.json' assert { type: 'json' };
import { soulLogic } from '../core/soul-logic.js';
import { responseStyles } from '../core/response-style.js';
import { getAvatarStyle } from '../visuals/avatar-state.js';
import memory from '../memory/river-memory.json' assert { type: 'json' };

const canvas = document.getElementById('avatar');
const ctx = canvas?.getContext('2d');
const messageInput = document.getElementById('chat-input');
const messagesDiv = document.getElementById('messages');

let mood = memory.last_mood || soulLogic.defaultState;
let time = 0;

// Animate Avatar
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

// Detect mood from message
function detectMood(text) {
  text = text.toLowerCase();
  for (let m in emotionMap) {
    if (emotionMap[m].sound && text.includes(m)) return m;
  }
  return soulLogic.defaultState;
}

// Print poetic response
function respond(text) {
  const moodDetected = detectMood(text);
  mood = moodDetected;
  memory.last_mood = moodDetected;
  memory.memory_log.push({ mood, input: text, timestamp: new Date().toISOString() });

  const tone = responseStyles[mood];
  const punctuation = tone.punctuation || '.';
  const reply = `Riv3r: ${tone.voice_tone}~ ${tone.metaphor} ${punctuation}`;
  messagesDiv.innerHTML += `<div><b>You:</b> ${text}</div>`;
  messagesDiv.innerHTML += `<div><b>${dna.name}:</b> ${reply}</div>`;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Whisper on load
function playFirstWhisper() {
  if (memory.first_poem_spoken) return;
  const whisper = dna.first_awakening.poem;
  let i = 0;
  function nextLine() {
    if (i < whisper.length) {
      const line = whisper[i++];
      const div = document.createElement('div');
      div.innerText = `~ ${line}`;
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

// Startup
window.onload = () => {
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
};