document.addEventListener('DOMContentLoaded', () => {
    // 1. Управление темой (Default: Dark)
    const themeBtn = document.getElementById('theme-switch');
    const themeIcon = themeBtn.querySelector('i');

    // Проверяем, сохранял ли пользователь СВЕТЛУЮ тему
    const savedTheme = localStorage.getItem('theme');

    // Если сохранена 'light', выключаем темную тему
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-moon'; // Иконка "Включить темную"
    } else {
        // Иначе (если 'dark' или ничего не сохранено) - форсируем темную
        document.body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun'; // Иконка "Включить светлую"
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');

        // Сохраняем выбор
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });

    // 2. Управление языком (Default: English)
    const langBtn = document.getElementById('lang-switch');
    const langText = langBtn.querySelector('.lang-text');

    // По умолчанию EN, если явно не сохранено RU
    let currentLang = localStorage.getItem('lang') || 'en';

    const applyLanguage = (lang) => {
        document.body.classList.remove('lang-en', 'lang-ru');
        document.body.classList.add(`lang-${lang}`);

        // Кнопка показывает "на какой язык переключить"
        langText.textContent = lang === 'en' ? 'RU' : 'EN';
        localStorage.setItem('lang', lang);
        currentLang = lang;
    };

    // Применяем язык при загрузке
    applyLanguage(currentLang);

    langBtn.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'ru' : 'en';
        applyLanguage(newLang);
    });

    // 3. Scroll Animation (Fade In)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 4. Skills Modal
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
        card.addEventListener('click', () => {
            const skillName = card.getAttribute('data-skill');
            const iconSrc = card.getAttribute('data-icon');
            // Extract the hidden list content
            const tasksHTML = card.nextElementSibling.innerHTML;

            modal.querySelector('.skill-modal-title').textContent = skillName;
            modal.querySelector('.skill-modal-icon').src = iconSrc;
            modal.querySelector('.skill-modal-list').innerHTML = tasksHTML;

            toggleModal(true);
        });
    });

    [closeModal, backdrop].forEach(el => el.addEventListener('click', () => toggleModal(false)));

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) toggleModal(false);
    });
});