/**
 * Navigation Component
 * Verwaltet die Navigation und Mobile Menu
 */

/**
 * Initialisiert die Navigation
 */
export function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav__menu');
    const header = document.getElementById('header');
    
    if (!navToggle || !navMenu) return;
    
    // Mobile Menu Toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', 
            navMenu.classList.contains('active').toString()
        );
    });
    
    // Schließe Menu bei Klick auf Link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Header-Stil beim Scrollen ändern
    initScrollHeader(header);
    
    // Smooth Scroll für Anchor-Links
    initSmoothScroll();
}

/**
 * Ändert den Header-Stil beim Scrollen
 * @param {HTMLElement} header - Das Header-Element
 */
function initScrollHeader(header) {
    if (!header) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header-Hintergrund bei Scroll
        if (scrollTop > scrollThreshold) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        // Header ausblenden beim Runterscrollen
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('header--hidden');
        } else {
            header.classList.remove('header--hidden');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
}

/**
 * Initialisiert Smooth Scroll für Anchor-Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


