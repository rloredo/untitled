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

// Observe night poem elements
document.querySelectorAll('.night-title, .night-reveal').forEach(el => {
  poemObserver.observe(el);
});

// Observe table-for-one elements
document.querySelectorAll('.table-reveal').forEach(el => {
  poemObserver.observe(el);
});

// Observe table-for-one section for illustration fade-in
const tableSection = document.querySelector('.section-table-for-one');
if (tableSection) {
  const tableObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.15 });
  tableObserver.observe(tableSection);
}

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
// FLOATING LETTERS FADEOUT
// =====================
const heavenSectionForFade = document.querySelector('.section-heaven');
let lettersRemoved = false;

if (heavenSectionForFade) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !lettersRemoved) {
        lettersRemoved = true;
        const floatingLetters = document.querySelectorAll('.floating-letter');
        // Fade out floating letters permanently
        floatingLetters.forEach((letter, i) => {
          setTimeout(() => {
            letter.classList.add('fade-out');
            // Remove from DOM after animation
            setTimeout(() => letter.remove(), 1000);
          }, i * 50);
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-10% 0px 0px 0px',
    threshold: 0
  });
  
  fadeObserver.observe(heavenSectionForFade);
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
      updateScrollHint();
      checkScrollDownHint();
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
// SCROLL HINT
// =====================
const scrollHint = document.querySelector('.scroll-hint');
const endSection = document.querySelector('.section-end');
let pulseTimeout = null;
let hasScrolled = false;

// =====================
// SCROLL DOWN HINT (anchor navigation)
// =====================
const scrollDownHint = document.querySelector('.scroll-down-hint');
let scrollDownInitialY = null;

// Show hint when page loads with anchor to destiempo or heaven
const scrollDownSections = ['#destiempo', '#heaven'];
if (window.location.hash && scrollDownHint && scrollDownSections.includes(window.location.hash)) {
  // Small delay to let page scroll to anchor
  setTimeout(() => {
    scrollDownInitialY = window.scrollY;
    scrollDownHint.classList.add('visible');
  }, 300);
}

// Hide hint on scroll
function checkScrollDownHint() {
  if (!scrollDownHint || scrollDownInitialY === null) return;
  
  const scrollDelta = Math.abs(window.scrollY - scrollDownInitialY);
  if (scrollDelta > 50) {
    scrollDownHint.classList.remove('visible');
    scrollDownInitialY = null;
  }
}

function updateScrollHint() {
  if (!scrollHint) return;
  
  const scrollTop = window.scrollY;
  
  // Hide when end section is visible
  if (endSection) {
    const endRect = endSection.getBoundingClientRect();
    if (endRect.top < window.innerHeight * 0.8) {
      scrollHint.style.opacity = '0';
      scrollHint.style.pointerEvents = 'none';
      return;
    } else {
      scrollHint.style.opacity = '';
      scrollHint.style.pointerEvents = '';
    }
  }
  
  // Only pulse after first scroll
  if (scrollTop > 0) {
    hasScrolled = true;
  }
  
  if (hasScrolled) {
    scrollHint.classList.add('pulsing');
    clearTimeout(pulseTimeout);
    pulseTimeout = setTimeout(() => {
      scrollHint.classList.remove('pulsing');
    }, 1500);
  }
}

// =====================
// INITIALIZATION
// =====================
document.addEventListener('DOMContentLoaded', () => {
  updateScrollProgress();
  // Don't call updateScrollHint on load to avoid pulsing
  
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

// =====================
// HEAVEN SECTION - SCROLL TEXT & SVG DRAWING
// =====================
const heavenSection = document.querySelector('.section-heaven');
const heavenTitle = document.querySelector('.heaven-title');
const heavenLines = document.querySelectorAll('.heaven-line');
const forestPaths = document.querySelectorAll('.section-heaven .tree-line, .section-heaven .ground-line, .section-heaven .mountain-line, .section-heaven .bird-line');

if (heavenSection && heavenLines.length > 0) {
  let currentLine = -1;
  let hasStarted = false;
  
  // Get hug SVG element and its paths
  const hugSvg = document.querySelector('.hug-svg');
  const hugPaths = hugSvg ? hugSvg.querySelectorAll('.hug-line') : [];
  
  // Calculate path lengths for hug SVG
  hugPaths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });
  
  // Calculate path lengths and set up stroke-dasharray
  forestPaths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });
  
  function updateHeavenSection() {
    const rect = heavenSection.getBoundingClientRect();
    const sectionHeight = heavenSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Check if section is in view
    if (rect.top < viewportHeight && rect.bottom > 0) {
      // Show title when section enters view
      if (!hasStarted && rect.top < viewportHeight * 0.5) {
        hasStarted = true;
        heavenTitle.classList.add('visible');
      }
      
      // Calculate scroll progress within the section (0 to 1)
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)));
      
      // Title must appear first, then lines start after a delay
      const titleDelay = 0.03; // Wait for title to appear before showing lines
      const adjustedProgress = Math.max(0, (scrollProgress - titleDelay) / (1 - titleDelay));
      
      // Determine which line to show based on progress
      const totalLines = heavenLines.length;
      const newLine = scrollProgress < titleDelay ? -1 : Math.min(Math.floor(adjustedProgress * totalLines), totalLines - 1);
      
      // Update active line
      if (newLine !== currentLine) {
        heavenLines.forEach((line, index) => {
          const lineNum = parseInt(line.getAttribute('data-line'));
          
          // Lines 0-3 accumulate and stay visible until line 4
          if (lineNum <= 3) {
            if (newLine >= lineNum && newLine <= 3) {
              line.classList.add('active');
              line.classList.remove('fading-out');
            } else if (newLine > 3) {
              line.classList.remove('active');
              line.classList.add('fading-out');
              setTimeout(() => line.classList.remove('fading-out'), 600);
            } else {
              // newLine < lineNum (including -1), hide the line
              line.classList.remove('active', 'fading-out');
            }
          // Lines 11-12 accumulate and stay visible until line 13
          } else if (lineNum >= 11 && lineNum <= 12) {
            if (newLine >= lineNum && newLine <= 12) {
              line.classList.add('active');
              line.classList.remove('fading-out');
            } else if (newLine > 12) {
              line.classList.remove('active');
              line.classList.add('fading-out');
              setTimeout(() => line.classList.remove('fading-out'), 600);
            } else {
              line.classList.remove('active', 'fading-out');
            }
          // Lines 14-17 accumulate and stay visible until line 18
          } else if (lineNum >= 14 && lineNum <= 17) {
            if (newLine >= lineNum && newLine <= 17) {
              line.classList.add('active');
              line.classList.remove('fading-out');
            } else if (newLine > 17) {
              line.classList.remove('active');
              line.classList.add('fading-out');
              setTimeout(() => line.classList.remove('fading-out'), 600);
            } else {
              line.classList.remove('active', 'fading-out');
            }
          // Lines 18-20 accumulate and stay visible until line 21
          } else if (lineNum >= 18 && lineNum <= 20) {
            if (newLine >= lineNum && newLine <= 20) {
              line.classList.add('active');
              line.classList.remove('fading-out');
            } else if (newLine > 20) {
              line.classList.remove('active');
              line.classList.add('fading-out');
              setTimeout(() => line.classList.remove('fading-out'), 600);
            } else {
              line.classList.remove('active', 'fading-out');
            }
          } else {
            // Other lines: show one at a time
            if (index === newLine) {
              line.classList.remove('fading-out');
              line.classList.add('active');
            } else if (index === currentLine) {
              line.classList.remove('active');
              line.classList.add('fading-out');
              setTimeout(() => line.classList.remove('fading-out'), 600);
            } else {
              line.classList.remove('active', 'fading-out');
            }
          }
        });
        currentLine = newLine;
      }
      
      // Draw hug SVG progressively between lines 14-17
      // Line 14 = "my daughter's tiny mind curiosity"
      // Line 17 = "An infinite hug"
      if (hugSvg && hugPaths.length > 0) {
        const hugStartLine = 14;
        const hugEndLine = 17;
        const totalLines = heavenLines.length;
        
        // Calculate progress within the hug drawing range
        const startProgress = hugStartLine / totalLines;
        const endProgress = (hugEndLine + 1) / totalLines;
        
        let hugProgress = 0;
        if (adjustedProgress >= startProgress && adjustedProgress <= endProgress) {
          hugProgress = (adjustedProgress - startProgress) / (endProgress - startProgress);
        } else if (adjustedProgress > endProgress) {
          hugProgress = 1;
        }
        
        // Show/hide SVG container based on progress
        if (hugProgress > 0) {
          hugSvg.style.opacity = Math.min(0.65, hugProgress * 2);
          hugSvg.style.transform = 'translateX(0)';
        } else {
          hugSvg.style.opacity = 0;
          hugSvg.style.transform = 'translateX(30px)';
        }
        
        // Draw each path based on progress with staggering
        hugPaths.forEach((path, index) => {
          const length = path.getTotalLength();
          const pathCount = hugPaths.length;
          // Stagger each path slightly
          const pathDelay = index / pathCount * 0.4;
          const pathProgress = Math.max(0, Math.min(1, (hugProgress - pathDelay) / (1 - pathDelay)));
          const drawLength = length * (1 - pathProgress);
          path.style.strokeDashoffset = drawLength;
        });
      }
      
      // Draw SVG paths based on scroll progress
      forestPaths.forEach((path, index) => {
        const length = path.getTotalLength();
        const isMountain = path.classList.contains('mountain-line');
        
        if (isMountain) {
          // Mountains draw across the full scroll duration
          const drawLength = length * (1 - scrollProgress);
          path.style.strokeDashoffset = Math.max(0, drawLength);
        } else {
          // Other elements use staggered delays
          const delay = parseFloat(getComputedStyle(path).getPropertyValue('--draw-delay')) || 0;
          const adjustedProgress = Math.max(0, Math.min(1, (scrollProgress - delay) / (0.7 - delay)));
          const drawLength = length * (1 - adjustedProgress);
          path.style.strokeDashoffset = Math.max(0, drawLength);
        }
      });
      
      // Fade out everything when approaching the end
      const heavenContent = document.querySelector('.heaven-content');
      const forestSvg = document.querySelector('.forest-svg');
      const fadeStart = 0.98; // Start fading at 98% scroll
      const fadeEnd = 1.0;
      
      if (scrollProgress > fadeStart) {
        const fadeProgress = (scrollProgress - fadeStart) / (fadeEnd - fadeStart);
        const opacity = Math.max(0, 1 - fadeProgress);
        if (heavenContent) heavenContent.style.opacity = opacity;
        if (forestSvg) forestSvg.style.opacity = opacity * 0.6; // Forest was at 0.6 opacity
      } else {
        if (heavenContent) heavenContent.style.opacity = 1;
        if (forestSvg) forestSvg.style.opacity = 0.6;
      }
    }
  }
  
  // Add to scroll handler
  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateHeavenSection);
  });
  
  // Initial check
  updateHeavenSection();
}

// =====================
// BASQUE CONUNDRUM - PAGE NAVIGATION
// =====================
const basqueSection = document.querySelector('.section-basque');

// Auto-detect dialogue paragraphs
document.querySelectorAll('.basque-text p').forEach(p => {
  if (p.textContent.trimStart().startsWith('—')) {
    p.classList.add('dialogue');
  }
});

if (basqueSection) {
  const pages = basqueSection.querySelectorAll('.basque-page');
  const prevBtn = basqueSection.querySelector('.basque-prev');
  const nextBtn = basqueSection.querySelector('.basque-next');
  const indexBtns = basqueSection.querySelectorAll('.basque-index-btn');
  let currentPage = 0;
  let isAnimating = false;

  function goToPage(index) {
    if (isAnimating || index === currentPage || index < 0 || index >= pages.length) return;
    isAnimating = true;

    const direction = index > currentPage ? 1 : -1;
    const outgoing = pages[currentPage];
    const incoming = pages[index];

    // Exit current page
    outgoing.classList.remove('active');
    outgoing.style.transform = `translateX(${-40 * direction}px)`;
    outgoing.style.opacity = '0';

    // Prepare incoming page
    incoming.style.transition = 'none';
    incoming.style.transform = `translateX(${40 * direction}px)`;
    incoming.style.opacity = '0';

    // Force reflow
    incoming.offsetHeight;

    // Animate incoming
    incoming.style.transition = '';
    incoming.classList.add('active');
    incoming.style.transform = '';
    incoming.style.opacity = '';
    incoming.scrollTop = 0;

    // Update index buttons
    indexBtns.forEach(btn => btn.classList.remove('active'));
    indexBtns[index].classList.add('active');

    // Update prev/next state
    currentPage = index;
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === pages.length - 1;

    setTimeout(() => { isAnimating = false; }, 500);
  }

  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  indexBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-target')) - 1;
      goToPage(target);
    });
  });

  // Initial state
  prevBtn.disabled = true;

  // Scroll past top/bottom to change chapter
  let scrollAccumulator = 0;
  const scrollThreshold = 150;
  let scrollTimeout = null;

  const pageContainer = basqueSection.querySelector('.basque-page-container');
  pageContainer.addEventListener('wheel', (e) => {
    const activePage = pages[currentPage];
    const atTop = activePage.scrollTop <= 0;
    const atBottom = activePage.scrollTop + activePage.clientHeight >= activePage.scrollHeight - 1;

    if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
      e.preventDefault();
      scrollAccumulator += e.deltaY;

      if (scrollAccumulator > scrollThreshold && atBottom) {
        scrollAccumulator = 0;
        goToPage(currentPage + 1);
      } else if (scrollAccumulator < -scrollThreshold && atTop) {
        scrollAccumulator = 0;
        goToPage(currentPage - 1);
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { scrollAccumulator = 0; }, 500);
    } else {
      scrollAccumulator = 0;
    }
  }, { passive: false });
}
