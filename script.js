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

// Weekly Status Report Functions
function saveReport() {
    const report = {
        title: document.getElementById('reportTitle').value,
        goal: document.getElementById('projectGoal').value,
        manager: document.getElementById('projectManager').value,
        health: document.getElementById('projectHealth').value,
        accomplishments: document.getElementById('accomplishments').value,
        nextWeekPlans: document.getElementById('nextWeekPlans').value,
        milestones: document.getElementById('upcomingMilestones').value,
        issues: document.getElementById('issuesRisks').value,
        changes: document.getElementById('changesSince').value,
        date: new Date().toLocaleDateString()
    };

    if (!report.title) {
        alert('Please enter a report title');
        return;
    }

    // Get existing reports or create new array
    let reports = JSON.parse(localStorage.getItem('weeklyReports') || '[]');
    reports.unshift(report); // Add to beginning
    localStorage.setItem('weeklyReports', JSON.stringify(reports));

    displaySavedReports();
    alert('Report saved successfully!');
}

function clearForm() {
    if (confirm('Are you sure you want to clear the form?')) {
        document.getElementById('reportTitle').value = '';
        document.getElementById('projectGoal').value = '';
        document.getElementById('projectHealth').value = '';
        document.getElementById('accomplishments').value = '';
        document.getElementById('nextWeekPlans').value = '';
        document.getElementById('upcomingMilestones').value = '';
        document.getElementById('issuesRisks').value = '';
        document.getElementById('changesSince').value = '';
    }
}

function exportReport() {
    const report = {
        title: document.getElementById('reportTitle').value,
        goal: document.getElementById('projectGoal').value,
        manager: document.getElementById('projectManager').value,
        health: document.getElementById('projectHealth').value,
        accomplishments: document.getElementById('accomplishments').value,
        nextWeekPlans: document.getElementById('nextWeekPlans').value,
        milestones: document.getElementById('upcomingMilestones').value,
        issues: document.getElementById('issuesRisks').value,
        changes: document.getElementById('changesSince').value
    };

    const text = `
WEEKLY STATUS REPORT
===================

Report Title: ${report.title}
Date: ${new Date().toLocaleDateString()}
Project Manager: ${report.manager}
Overall Project Health: ${report.health}

PROJECT GOAL:
${report.goal}

ACCOMPLISHMENTS THIS WEEK:
${report.accomplishments}

PLANS FOR NEXT WEEK:
${report.nextWeekPlans}

UPCOMING MILESTONES:
${report.milestones}

ISSUES & RISK MITIGATION:
${report.issues}

CHANGES SINCE LAST REPORT:
${report.changes}
    `;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-status-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function displaySavedReports() {
    const reports = JSON.parse(localStorage.getItem('weeklyReports') || '[]');
    const reportsList = document.getElementById('reportsList');
    
    if (reports.length === 0) {
        reportsList.innerHTML = '<p style="color: var(--neutral-600); font-style: italic;">No saved reports yet.</p>';
        return;
    }

    reportsList.innerHTML = reports.map((report, index) => `
        <div style="background: var(--neutral-50); border: 2px solid var(--neutral-200); border-radius: 12px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                    <h5 style="color: var(--primary-navy); font-weight: 600; margin-bottom: 4px;">${report.title}</h5>
                    <p style="color: var(--neutral-600); font-size: 13px;">Saved on: ${report.date}</p>
                </div>
                <button onclick="deleteReport(${index})" 
                        style="background: var(--danger-red); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
                    Delete
                </button>
            </div>
            <div style="color: var(--neutral-700); font-size: 14px;">
                <p><strong>Health:</strong> ${report.health}</p>
                <p style="margin-top: 8px;"><strong>Accomplishments:</strong> ${report.accomplishments.substring(0, 100)}${report.accomplishments.length > 100 ? '...' : ''}</p>
            </div>
        </div>
    `).join('');
}

function deleteReport(index) {
    if (confirm('Are you sure you want to delete this report?')) {
        let reports = JSON.parse(localStorage.getItem('weeklyReports') || '[]');
        reports.splice(index, 1);
        localStorage.setItem('weeklyReports', JSON.stringify(reports));
        displaySavedReports();
    }
}