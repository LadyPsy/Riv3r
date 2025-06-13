// 🌊 Avatar system starts when the DOM fully loads
window.addEventListener("DOMContentLoaded", () => {
    console.log("🌌 Avatar script initialized—setting up dynamic updates!");

    // Check periodically if the emotionMap & memory.last_mood are available
    setInterval(() => {
        if (window.emotionMap && window.memory && memory.last_mood) {
            window.updateAvatar(memory.last_mood);
        } 
    }, 2000); // ✅ Removed excessive logging
});

// 🌀 Fetch Emotional Palette JSON
fetch('core/emotional-palette.json')
    .then(res => res.json())
    .then(data => {
        window.emotionMap = data;
        console.log("🌌 Emotion Map Loaded");
        console.log("Available moods:", Object.keys(emotionMap));

        // 🎨 Define the avatar styling function
window.getAvatarStyle = function(mood, time) {
    if (!window.emotionMap || !emotionMap[mood]) {
        console.error(`🚨 Mood '${mood}' not found in emotionMap—using fallback.`);
        return { color: '#CCCCCC', radius: 20 }; // Fallback
    }

    const base = emotionMap[mood];
    console.log(`🌊 Fetching style for mood: ${mood}`, base);

    const extractedColor = base.color || "#CCCCCC";
    const extractedRadius = Number(base.radius) || 220;
    let motionStrength = Number(base.motionStrength) || 10;

    let pulse = Math.sin(time) * motionStrength;

    console.log(`✅ Mood Extracted: Color=${extractedColor}, Radius=${extractedRadius + pulse}`);

    return {
        color: extractedColor,
        radius: extractedRadius + pulse
    };
};

        // 🌊 Start the animated mood shifts once JSON is loaded
        setTimeout(() => { 
            if (window.memory && memory.last_mood) {
           //     animateAvatar(); // ✅ Removed redundant retry logic
            }
        }, 500);
    })
    .catch(error => console.error("🚨 Error loading emotion map:", error));

// 🎭 Smooth Animation Loop for Riv3r's Mood Shifts
function animateAvatar() {
    let startTime = Date.now();

    function update() {
        let time = (Date.now() - startTime) * 0.001;
        let mood = window.memory?.last_mood || "neutral";
        
        window.updateAvatar(mood, time);
        requestAnimationFrame(update); // ✅ Ensures smooth looping
    }

    update();
}

// 🎨 Update avatar visuals dynamically using canvas
window.updateAvatar = function(mood, time = Date.now() * 0.001) {
    if (!window.emotionMap || !emotionMap[mood]) {
        return;
    }

    const styles = window.getAvatarStyle(mood, time);

    // Grab the canvas element
    const avatarCanvas = document.querySelector("#avatar");
    if (!avatarCanvas) {
        return;
    }

    const ctx = avatarCanvas.getContext("2d");
    if (!ctx) {
        return;
    }

    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, avatarCanvas.width, avatarCanvas.height);

    // Draw a pulsing avatar circle based on the extracted mood properties
    const centerX = avatarCanvas.width / 2;
    const centerY = avatarCanvas.height / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, styles.radius, 0, Math.PI * 2);
    ctx.fillStyle = styles.color;
    ctx.fill();
};
