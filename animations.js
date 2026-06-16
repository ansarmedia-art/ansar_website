/* ========================================
   ANIMATION & INTERACTION HANDLER
   ======================================== */

class ScrollAnimator {
    constructor() {
        this.elements = [];
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollListener();
    }

    setupIntersectionObserver() {
        const callback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationClass = entry.target.getAttribute('data-animation') || 'animate-fade-in-up';
                    const delay = entry.target.getAttribute('data-delay') || '0';

                    if (delay > 0) {
                        entry.target.style.animationDelay = `${delay}ms`;
                    }

                    entry.target.classList.add('in-view');
                    entry.target.classList.add(animationClass);

                    // Unobserve after animation
                    this.observer.unobserve(entry.target);
                }
            });
        };

        this.observer = new IntersectionObserver(callback, this.options);
    }

    observe() {
        const elements = document.querySelectorAll('[data-scroll-animate]');
        elements.forEach(el => {
            el.classList.add('scroll-animate');
            this.observer.observe(el);
        });
    }

    setupScrollListener() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    onScroll() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
            const yPos = window.scrollY * speed;
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ===== HOVER EFFECTS =====
function setupHoverEffects() {
    const hoverElements = document.querySelectorAll('[data-hover-lift]');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            this.style.transform = 'translateY(-8px)';
        });

        el.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== BUTTON RIPPLE EFFECT =====
function setupRippleEffects() {
    const buttons = document.querySelectorAll('.btn, button[data-ripple]');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function setupCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
                const target = parseInt(entry.target.getAttribute('data-counter'));
                animateCounter(entry.target, target);
                entry.target.setAttribute('data-counted', 'true');
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ===== SMOOTH SCROLL ANCHOR LINKS =====
function setupSmoothScroll() {
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
}

// ===== NAVBAR SCROLL EFFECT =====
function setupNavbarEffect() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

// ===== TYPEWRITER EFFECT =====
function typewriterEffect(element, text, speed = 50) {
    element.textContent = '';
    let index = 0;

    const type = () => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            setTimeout(type, speed);
        }
    };

    type();
}

// ===== INTERSECTION OBSERVER FOR VISIBILITY =====
function setupVisibilityAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

// ===== INITIALIZE ALL ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animator
    const animator = new ScrollAnimator();
    animator.observe();

    // Setup all interactive effects
    setupHoverEffects();
    setupRippleEffects();
    setupCounters();
    setupSmoothScroll();
    setupNavbarEffect();
    setupVisibilityAnimation();

    console.log('✨ Animations initialized successfully');
});

// ===== UTILITY FUNCTIONS FOR PAGES =====

// Fade in element
function fadeInElement(element, delay = 0) {
    setTimeout(() => {
        element.classList.add('animate-fade-in');
    }, delay);
}

// Fade in up element
function fadeInUpElement(element, delay = 0) {
    setTimeout(() => {
        element.classList.add('animate-fade-in-up');
    }, delay);
}

// Add pulse animation
function addPulseEffect(element) {
    element.classList.add('animate-pulse');
}

// Remove pulse animation
function removePulseEffect(element) {
    element.classList.remove('animate-pulse');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ScrollAnimator,
        fadeInElement,
        fadeInUpElement,
        addPulseEffect,
        removePulseEffect
    };
}
