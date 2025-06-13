// 🌊 Ensure global references for animation control
window.animationId = null;
let startTime = Date.now();

// 🎭 Load Emotional Palette JSON
fetch('core/emotional-palette.json')
  .then(res => res.json())
  .then(data => {
    window.emotionMap = data;
    console.log("🌌 Emotion Map Loaded:", window.emotionMap);

    // 🎨 Define avatar style based on mood and time
    window.getAvatarStyle = function(mood, time) {
      if (!window.emotionMap || !window.emotionMap[mood]) {
        console.warn(`🫥 Mood '${mood}' not found—fallback triggered.`);
        return { color: '#CCCCCC', radius: 20 };
      }

      const base = window.emotionMap[mood];
      const color = base.color || '#CCCCCC';
      const radius = Number(base.radius || 30);
      const motionStrength = Number(base.motionStrength ?? 10);
      const pulse = Math.sin(time*3) * motionStrength;

      return {
        color,
        radius: radius + pulse
      };
    };

    // 🎭 Smooth Animation Loop
window.animateAvatar = function() {
  function update() {
    const time = (Date.now() - startTime) * 0.001;

    // 🔥 **Force animation to fetch the latest mood**
    const mood = window.memory?.last_mood; // ✅ Always pull fresh mood

    console.log(`🔄 Animation Fetching Mood → ${mood}`); // ✅ Debugging mood updates

    window.updateAvatar(mood, time);
    window.animationId = requestAnimationFrame(update);
  }

  window.animationId = requestAnimationFrame(update);
};


// 🚨 **Place stop function AFTER animateAvatar()**
window.stopAvatarAnimation = function() {
  if (window.animationId) {
    cancelAnimationFrame(window.animationId);
    console.log("🚫 Animation stopped.");
  } else {
    console.warn("⚠️ No active animation to stop.");
  }
};



    // 🌊 Begin animation after memory reset
setTimeout(() => {
  if (!window.memory?.last_mood) { // 🔥 Only reset IF mood is missing
    window.memory = { last_mood: "bashful" };
  }
  animateAvatar();
}, 100);
  })
  .catch(error => console.error("🚨 Error loading emotion map:", error));

// 🎨 Draw avatar visuals dynamically
window.updateAvatar = function(mood, time = Date.now() * 0.001) {
  if (!window.emotionMap || !window.emotionMap[mood]) {
    console.warn(`🫥 Mood '${mood}' not found—fallback triggered.`);
    return;
  }

  // 🌊 **Ensure the latest mood is applied before rendering**
  mood = window.memory?.last_mood || mood;

  const style = window.getAvatarStyle(mood, time);
const radiusScale = 6.0; // 🔥 Adjust size multiplier
const radius = style.radius * radiusScale; // 🌀 Scale up mood circle

  const canvas = document.getElementById("avatar");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 🎭 **Clear canvas before drawing**
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🔥 **Force real-time mood update in visuals**
  //console.log(`🎨 Rendering Mood → ${mood}`);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = style.color;
  ctx.fill();
};