document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.slide_in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 });
  cards.forEach(card => observer.observe(card));
  
    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    const animationTypes = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'];
    
    document.querySelectorAll("img.flying_ghost").forEach((el, index) => {
      let xFrom = getRandomArbitrary(-10, 25);
      let yFrom = getRandomArbitrary(-30, -10);
      let xTo = getRandomArbitrary(-10, 100);
      let yTo = getRandomArbitrary(-30, 100);
    
      let lastStyleTag = null;
    
      function createKeyframes(fromX, fromY, toX, toY, name) {
        const direction = toX > fromX ? 1 : -1;
    
        return `
          @keyframes ${name} {
            0% {
                opacity: 0;
                transform: translate(${fromX}vw, ${fromY}vh) scaleX(${direction});
            }
            5% {
              opacity: 70%;
            }
            95% {
                opacity: 70%;
            }
            100% {
              transform: translate(${toX}vw, ${toY}vh) scaleX(${direction});
              opacity: 0;
            }
          }
        `;
      }
    
      function applyAnimation() {
        const animationName = `ghostFloat_${index}_${Math.floor(Math.random() * 10000)}`;
        const keyframes = createKeyframes(xFrom, yFrom, xTo, yTo, animationName);
    
        // Create and store the <style> tag
        const styleTag = document.createElement("style");
        styleTag.type = "text/css";
        styleTag.innerText = keyframes;
        document.head.appendChild(styleTag);
    
        // Remove the previous style tag if it exists
        if (lastStyleTag && lastStyleTag.parentNode) {
          lastStyleTag.parentNode.removeChild(lastStyleTag);
        }
        lastStyleTag = styleTag;
    
        const duration = Math.floor(Math.random() * 10) + 5;
        const timing = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    
        el.style.animation = `${animationName} ${duration}s ${timing} 1 forwards`;
        el.style.willChange = 'transform';
    
        el.addEventListener('animationend', function handler() {
          el.removeEventListener('animationend', handler);
            
        //   el.style.opacity = "0";
    
        //   setTimeout(() => {
              // Clean up this style tag after animation ends
              if (styleTag && styleTag.parentNode) {
                styleTag.parentNode.removeChild(styleTag);
              }
        
              // Update start coordinates only if current ones were offscreen
              if (xTo < 0 || yTo < 0 || xTo > 100 || yTo > 100) {
                xFrom = getRandomArbitrary(0, 100);
                yFrom = getRandomArbitrary(0, 100);
              } else {
                xFrom = xTo;
                yFrom = yTo;
              }
    
          
              // New destination
              xTo = getRandomArbitrary(-10, 100);
              yTo = getRandomArbitrary(-30, 100);
          
          
              applyAnimation(); // Run again
            //   el.style.opacity = "70%";
        //   }, 400);
        });
      }
    
      applyAnimation(); // Initial launch
    });

});