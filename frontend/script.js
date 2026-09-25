// Global Functions for Inline HTML Event Handlers
function highlightSection(id, event) {
    if (event) {
        event.preventDefault();
    }

    // Auto-close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }

    // 1. Locate element (checks for specific ID or falls back to 'root' for React components)
    let el = document.getElementById(id);
    if (!el && id === 'contact-form') {
        el = document.getElementById('root');
    }

    if (el) {
        // 2. Smooth scroll directly to element
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 3. Dynamic highlight styling classes
        const highlightClasses = [
            'ring-4',
            'ring-indigo-500',
            'ring-offset-4',
            'dark:ring-offset-slate-900',
            'shadow-[0_0_50px_rgba(99,102,241,0.6)]',
            'scale-[1.01]'
        ];

        // Ensure smooth property transitions
        el.classList.add('transition-all', 'duration-500', ...highlightClasses);

        // 4. Remove highlight after 2 seconds
        setTimeout(() => {
            el.classList.remove(...highlightClasses);
        }, 2000);
    }
}

function openLivePreview(title, description, tags, imageUrl) {
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalImg = document.getElementById('modal-image');
    const tagsContainer = document.getElementById('modal-tags');

    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = description;
    if (modalImg) modalImg.src = imageUrl;

    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
    }

    const modal = document.getElementById('preview-modal');
    const box = document.getElementById('modal-content-box');
    if (modal && box) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            box.classList.remove('scale-95');
            box.classList.add('scale-100');
        }, 10);
    }
}

function closeLivePreview() {
    const modal = document.getElementById('preview-modal');
    const box = document.getElementById('modal-content-box');
    if (modal && box) {
        modal.classList.add('opacity-0');
        box.classList.remove('scale-100');
        box.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

// DOM Ready Event Listeners
document.addEventListener("DOMContentLoaded", () => {

    /* 1. Canvas Mesh Animation */
    const canvas = document.getElementById('mesh-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let orbs = [];

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class GlowingOrb {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.2;
                this.vy = (Math.random() - 0.5) * 1.2;
                this.radius = Math.random() * 180 + 100;
                const colors = [
                    'rgba(99, 102, 241, 0.18)',
                    'rgba(168, 85, 247, 0.18)',
                    'rgba(236, 72, 153, 0.18)',
                    'rgba(6, 182, 212, 0.15)'
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < -this.radius || this.x > width + this.radius) this.vx *= -1;
                if (this.y < -this.radius || this.y > height + this.radius) this.vy *= -1;
            }
            draw() {
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.radius
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initOrbs() {
            orbs = [];
            const count = window.innerWidth < 768 ? 4 : 7;
            for (let i = 0; i < count; i++) {
                orbs.push(new GlowingOrb());
            }
        }

        function animateOrbs() {
            ctx.clearRect(0, 0, width, height);
            orbs.forEach(orb => {
                orb.update();
                orb.draw();
            });
            requestAnimationFrame(animateOrbs);
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            initOrbs();
        });

        resizeCanvas();
        initOrbs();
        animateOrbs();
    }

    /* 2. Theme Toggle (Dark / Light) */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        htmlElement.classList.remove('dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun text-base';
    } else {
        htmlElement.classList.add('dark');
        if (themeIcon) themeIcon.className = 'fas fa-moon text-base';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            const isDark = htmlElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (themeIcon) {
                themeIcon.className = isDark ? 'fas fa-moon text-base' : 'fas fa-sun text-base';
            }
        });
    }

    /* 3. Mobile Navigation Menu Toggle */
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    /* 4. Marquee Tracks Auto-Cloner */
    const trackIds = ["cert-track", "project-track", "skills-track", "logos-track"];
    trackIds.forEach(id => {
        const track = document.getElementById(id);
        if (track) {
            const items = Array.from(track.children);
            items.forEach((item) => {
                const clone = item.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                track.appendChild(clone);
            });
        }
    });

});