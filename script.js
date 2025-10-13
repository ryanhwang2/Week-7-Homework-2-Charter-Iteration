// Navigation functionality
const navToggle = document.getElementById('navToggle');
const navSidebar = document.getElementById('navSidebar');
const navOverlay = document.getElementById('navOverlay');
const navItems = document.querySelectorAll('.nav-item');

navToggle.addEventListener('click', () => {
    navSidebar.classList.toggle('open');
    navOverlay.classList.toggle('show');
    document.body.style.overflow = navSidebar.classList.contains('open') ? 'hidden' : 'auto';
});

navOverlay.addEventListener('click', () => {
    navSidebar.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navSidebar.classList.remove('open');
        navOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
});

// Section toggle
function toggleSection(header) {
    const section = header.parentElement;
    section.classList.toggle('expanded');
    const isExpanded = section.classList.contains('expanded');
    header.setAttribute('aria-expanded', isExpanded);
    if (isExpanded) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Toggle all sections
function toggleAllSections() {
    const sections = document.querySelectorAll('.section');
    const expandedSections = document.querySelectorAll('.section.expanded');
    const shouldExpand = expandedSections.length < sections.length / 2;
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        if (shouldExpand) {
            section.classList.add('expanded');
            header.setAttribute('aria-expanded', 'true');
        } else {
            section.classList.remove('expanded');
            header.setAttribute('aria-expanded', 'false');
        }
    });
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Keyboard support
document.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('section-header')) {
        e.preventDefault();
        toggleSection(e.target);
    }
    if (e.key === 'Escape') {
        navSidebar.classList.remove('open');
        navOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        toggleAllSections();
    }
});

// Progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = Math.min((scrollTop / documentHeight) * 100, 100);
    progressBar.style.width = scrollPercent + '%';
}

// Active nav highlight
function updateActiveNav() {
    const sections = document.querySelectorAll('.section, .student-info');
    const navItems = document.querySelectorAll('.nav-item');
    let current = '';
    const scrollPos = window.pageYOffset + 150;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

// Scroll throttle
let ticking = false;
function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateProgressBar();
            updateActiveNav();
            ticking = false;
        });
        ticking = true;
    }
}
window.addEventListener('scroll', handleScroll);

// Quiz functionality
const quizButtons = document.querySelectorAll('.quiz-btn');
const quizFeedback = document.getElementById('quiz-feedback');
quizButtons.forEach(button => {
    button.addEventListener('click', () => {
        const isCorrect = button.dataset.answer === 'correct';
        quizButtons.forEach(btn => btn.disabled = true);
        quizFeedback.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect!';
        quizFeedback.className = `quiz-feedback show ${isCorrect ? 'correct' : 'incorrect'}`;
    });
});

// Print function
function printCharter() {
    window.print();
}
