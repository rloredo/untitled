/**
 * Experimental Poetry Page - Scroll Behaviors
 */

// =====================
// SCROLL PROGRESS
// =====================
const scrollProgress = document.querySelector('.scroll-progress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.height = `${scrollPercent}%`;
}

// =====================
// INTERSECTION OBSERVER
// =====================
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add 'in-view' class for CSS animations
      const animatedElements = entry.target.querySelectorAll('.staggered, .columns');
      animatedElements.forEach(el => el.classList.add('in-view'));
      
      // Trigger scattered words animation
      if (entry.target.classList.contains('section-scattered')) {
        animateScatteredWords(entry.target);
      }
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
  sectionObserver.observe(section);
});

// =====================
// POEM SCROLL REVEAL
// =====================
const poemObserverOptions = {
  root: null,
  rootMargin: '-10% 0px -10% 0px',
  threshold: 0.1
};

const poemObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, poemObserverOptions);

// Observe poem elements
document.querySelectorAll('.poem-title, .stanza').forEach(el => {
  poemObserver.observe(el);
});

// =====================
// SPECKS OF DUST EXPLOSION
// =====================
const firstWish = document.getElementById('first-wish');
const specksOfDust = document.querySelector('.specks-of-dust');

// Target positions for each letter (viewport percentages)
const letterPositions = [
  { top: 8, left: 12, rotate: -15 },    // s
  { top: 15, left: 78, rotate: 12 },    // p
  { top: 45, left: 5, rotate: -8 },     // e
  { top: 72, left: 88, rotate: 20 },    // c
  { top: 85, left: 25, rotate: -22 },   // k
  { top: 28, left: 92, rotate: 10 },    // s
  null,                                  // space
  { top: 5, left: 55, rotate: -14 },    // o
  { top: 68, left: 8, rotate: 18 },     // f
  null,                                  // space
  { top: 92, left: 65, rotate: 22 },    // d
  { top: 22, left: 35, rotate: -12 },   // u
  { top: 78, left: 48, rotate: 8 },     // s
  { top: 35, left: 18, rotate: -18 }    // t
];

if (firstWish && specksOfDust) {
  let hasExploded = false;
  
  const explosionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasExploded) {
        hasExploded = true;
        
        // Trigger explosion when wish comes into focus
        specksOfDust.classList.add('exploded');
        
        // Get all letter elements
        const letters = specksOfDust.querySelectorAll('.explode-letter');
        const floaters = [];
        
        // Create all floating copies first and position them
        letters.forEach((letter, index) => {
          const position = letterPositions[index];
          if (!position) return; // Skip spaces
          
          const letterText = letter.getAttribute('data-letter');
          if (!letterText || letterText === ' ') return;
          
          // Get original position BEFORE creating element
          const rect = letter.getBoundingClientRect();
          
          // Create floating element
          const floater = document.createElement('span');
          floater.className = 'floating-letter';
          floater.textContent = letterText;
          
          // Set position with inline styles (no transition yet)
          floater.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            transform: rotate(0deg);
          `;
          
          document.body.appendChild(floater);
          floaters.push({ floater, position, index, startTop: rect.top, startLeft: rect.left });
        });
        
        // Use requestAnimationFrame to ensure positions are applied
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Start each letter with staggered timing - appear and move simultaneously
            floaters.forEach(({ floater, position, index, startTop, startLeft }, i) => {
              const delay = i * 200; // Stagger each letter
              
              setTimeout(() => {
                // Add classes for transition
                floater.classList.add('visible', 'drifting');
                
                // Immediately set target position - will animate due to drifting class
                requestAnimationFrame(() => {
                  floater.style.top = position.top + 'vh';
                  floater.style.left = position.left + 'vw';
                  floater.style.transform = `rotate(${position.rotate}deg)`;
                });
                
                // Add gentle floating animation after drift completes
                setTimeout(() => {
                  floater.style.animation = 'gentle-float 10s ease-in-out infinite';
                }, 6500);
              }, delay);
            });
          });
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-20% 0px -20% 0px',
    threshold: 0.5
  });
  
  explosionObserver.observe(firstWish);
}

// =====================
// SCATTERED WORDS
// =====================
function animateScatteredWords(section) {
  const words = section.querySelectorAll('.word');
  words.forEach((word, index) => {
    setTimeout(() => {
      word.classList.add('visible');
    }, index * 200);
  });
}

// =====================
// HORIZONTAL SCROLL
// =====================
const horizontalSection = document.querySelector('.section-horizontal');
const horizontalScroll = document.querySelector('.horizontal-scroll');

if (horizontalSection && horizontalScroll) {
  const horizontalItems = horizontalScroll.querySelectorAll('.horizontal-item');
  const totalWidth = horizontalItems.length * window.innerWidth;
  
  window.addEventListener('scroll', () => {
    const rect = horizontalSection.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    // When section is in view
    if (sectionTop <= 0 && sectionTop > -sectionHeight) {
      const progress = Math.abs(sectionTop) / sectionHeight;
      const translateX = progress * (totalWidth - window.innerWidth);
      horizontalScroll.style.transform = `translateX(-${translateX}px)`;
    }
  });
  
  // Make horizontal section taller for scroll effect
  horizontalSection.style.height = `${totalWidth}px`;
}

// =====================
// PARALLAX EFFECTS
// =====================
const parallaxElements = document.querySelectorAll('[data-scroll-effect="parallax"]');

function updateParallax() {
  parallaxElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const scrollPercent = rect.top / window.innerHeight;
    const content = el.querySelector('.content');
    if (content) {
      content.style.transform = `translateY(${scrollPercent * 50}px)`;
    }
  });
}

// =====================
// REVEAL ON SCROLL
// =====================
const revealElements = document.querySelectorAll('[data-scroll-effect="reveal"]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      const overlayText = entry.target.querySelector('.overlay-text');
      if (overlayText) {
        overlayText.style.animation = 'fadeIn 1.5s ease-out forwards';
      }
    }
  });
}, { threshold: 0.5 });

revealElements.forEach(el => revealObserver.observe(el));

// =====================
// SMOOTH SCROLL FOR LINKS
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// =====================
// CURSOR EFFECTS (optional)
// =====================
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
// Uncomment to enable custom cursor:
// document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// =====================
// SCROLL EVENT LISTENER
// =====================
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
});

// =====================
// RESIZE HANDLER
// =====================
window.addEventListener('resize', () => {
  // Recalculate horizontal scroll section
  if (horizontalSection && horizontalScroll) {
    const horizontalItems = horizontalScroll.querySelectorAll('.horizontal-item');
    const totalWidth = horizontalItems.length * window.innerWidth;
    horizontalSection.style.height = `${totalWidth}px`;
  }
});

// =====================
// INITIALIZATION
// =====================
document.addEventListener('DOMContentLoaded', () => {
  updateScrollProgress();
  
  // Add loaded class after a brief delay for entrance animations
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// =====================
// OPTIONAL: TEXT SCRAMBLE EFFECT
// =====================
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Usage: const scramble = new TextScramble(document.querySelector('.title'));
// scramble.setText('NEW TEXT');
