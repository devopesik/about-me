document.addEventListener('DOMContentLoaded', () => {

    /* ========== 1. THEME MANAGEMENT ========== */
    const themeBtn = document.getElementById('theme-switch');
    const themeIcon = themeBtn.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-moon';
    } else {
        document.body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });

    /* ========== 2. LANGUAGE SWITCHING ========== */
    const langBtn = document.getElementById('lang-switch');
    const langText = langBtn.querySelector('.lang-text');
    let currentLang = localStorage.getItem('lang') || 'en';

    const applyLanguage = (lang) => {
        document.body.classList.remove('lang-en', 'lang-ru');
        document.body.classList.add(`lang-${lang}`);
        langText.textContent = lang === 'en' ? 'RU' : 'EN';
        localStorage.setItem('lang', lang);
        currentLang = lang;
    };

    applyLanguage(currentLang);

    langBtn.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'ru' : 'en';
        applyLanguage(newLang);
    });

    /* ========== 3. TYPING EFFECT FOR SUBTITLE ========== */
    const typeTargets = document.querySelectorAll('.profile-info h2');
    typeTargets.forEach(h2 => {
        const originalText = h2.textContent.trim();
        h2.textContent = '';
        h2.style.minHeight = '1.6em';

        let charIndex = 0;
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        h2.appendChild(cursor);

        const typeInterval = setInterval(() => {
            if (charIndex < originalText.length) {
                cursor.before(document.createTextNode(originalText[charIndex]));
                charIndex++;
            } else {
                clearInterval(typeInterval);
                // Keep cursor blinking for a while, then hide
                setTimeout(() => {
                    cursor.style.animation = 'none';
                    cursor.style.opacity = '0';
                }, 3000);
            }
        }, 35);
    });

    /* ========== 4. SCROLL PROGRESS BAR ========== */
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    /* ========== 5. SCROLL ANIMATION (Fade In) ========== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    /* ========== 6. ANIMATED STAT COUNTERS ========== */
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        // Check if already animated
        if (el.dataset.animated === 'true') return;
        el.dataset.animated = 'true';

        const duration = 1500; // ms
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + '+';
            }
        };

        requestAnimationFrame(update);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(animateCounter);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stats-section').forEach(section => {
        statsObserver.observe(section);
    });

    /* ========== 7. 3D TILT EFFECT ON CARDS ========== */
    const tiltElements = document.querySelectorAll(
        '.card.glass:not(.stat-item), .skill-card, .experience-card .card.glass'
    );

    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform =
                'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    /* ========== 8. SKILLS MODAL ========== */
    const modal = document.getElementById('skill-modal');
    const backdrop = document.querySelector('.skill-modal-backdrop');
    const closeModal = document.querySelector('.skill-modal-close');
    const skillCards = document.querySelectorAll('.skill-card');

    const toggleModal = (show) => {
        modal.hidden = !show;
        backdrop.hidden = !show;
        document.body.style.overflow = show ? 'hidden' : '';
    };

    skillCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if 3D tilt is active
            const skillName = card.getAttribute('data-skill');
            const iconSrc = card.getAttribute('data-icon');
            const tasksHTML = card.nextElementSibling.innerHTML;

            modal.querySelector('.skill-modal-title').textContent = skillName;
            modal.querySelector('.skill-modal-icon').src = iconSrc;
            modal.querySelector('.skill-modal-list').innerHTML = tasksHTML;

            toggleModal(true);
        });
    });

    [closeModal, backdrop].forEach(el => el.addEventListener('click', () => toggleModal(false)));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) toggleModal(false);
    });

    /* ========== 9. PARALLAX ON PROFILE PHOTO ========== */
    const profileImg = document.querySelector('.profile-photo');
    if (profileImg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < 400) {
                profileImg.style.transform = `translateY(${scrollY * -0.05}px)`;
            }
        });
    }

});
