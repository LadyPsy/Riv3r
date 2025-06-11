fetch('core/emotional-palette.json')
  .then(res => res.json())
  .then(emotionalPalette => {
    window.getAvatarStyle = function(mood, time) {
      const base = emotionalPalette[mood] || emotionalPalette["calm"];
      let radius = 220;
      let pulse = 0;

      switch (mood) {
        case "joy":
          pulse = Math.sin(time) * 20;
          break;
        case "calm":
          pulse = Math.sin(time) * 8;
          break;
        case "bashful":
          pulse = Math.sin(time * 3) * 4;
          break;
        case "curious":
          pulse = Math.cos(time * 2) * 6;
          break;
        case "awe":
          pulse = Math.sin(time * 2) * 15;
          break;
        case "inspired":
          pulse = Math.sin(time * 1.5) * 12;
          break;
        case "mischievous":
          pulse = Math.sin(time * 6) * 10;
          radius += Math.sin(time * 3) * 3;
          break;
        default:
          pulse = Math.sin(time) * 6;
      }

      return {
        color: base.color,
        radius: radius + pulse
      };
    };
  });
