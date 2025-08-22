/**
 * ============================================
 * QUANTUM OPTIMIZATION PROGRAM - MAIN JAVASCRIPT
 * Author: Carlos A.
 * Version: 1.0.0
 * ============================================
 */

// ============================================
// 1. GLOBAL VARIABLES & CONFIG
// ============================================
const CONFIG = {
    STORAGE_KEY: 'quantumProgress',
    TOTAL_WEEKS: 16,
    HOURS_PER_WEEK: 4,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    API_ENDPOINTS: {
        GITHUB_REPO: 'https://api.github.com/repos/Carlosandp/Cronograma.github.io',
        ARXIV_API: 'https://export.arxiv.org/api/query'
    }
};

// State Management
let appState = {
    currentTab: 'mes1',
    progress: {},
    theme: 'dark',
    language: 'es',
    lastUpdate: null
};

// ============================================
// 2. INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Quantum Optimization Program Initialized');
    
    // Initialize all modules
    initializeApp();
    loadProgress();
    setupEventListeners();
    initializeAnimations();
    checkForUpdates();
    
    // Set initial theme
    applyTheme();
    
    // Initialize tooltips
    initializeTooltips();
});

function initializeApp() {
    // Check browser compatibility
    if (!checkBrowserSupport()) {
        showCompatibilityWarning();
        return;
    }
    
    // Load saved state
    loadAppState();
    
    // Initialize progress tracking
    updateProgressDisplay();
    
    // Set active tab
    if (window.location.hash) {
        const tab = window.location.hash.substring(1);
        showSection(tab);
    }
}

// ============================================
// 3. PROGRESS TRACKING
// ============================================
function loadProgress() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
        try {
            appState.progress = JSON.parse(saved);
            console.log('✅ Progress loaded:', appState.progress);
        } catch (e) {
            console.error('Error loading progress:', e);
            appState.progress = {};
        }
    }
    
    // Apply saved progress to checkboxes
    applyProgressToUI();
}

function saveProgress() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(appState.progress));
        appState.lastUpdate = new Date().toISOString();
        console.log('💾 Progress saved');
        
        // Show save confirmation
        showNotification('Progreso guardado', 'success');
    } catch (e) {
        console.error('Error saving progress:', e);
        showNotification('Error al guardar progreso', 'error');
    }
}

function updateProgress() {
    const checkboxes = document.querySelectorAll('.week-checkbox');
    const completed = document.querySelectorAll('.week-checkbox:checked').length;
    const percentage = Math.round((completed / CONFIG.TOTAL_WEEKS) * 100);
    
    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const weekProgress = document.getElementById('weekProgress');
    
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        progressBar.setAttribute('aria-valuenow', percentage);
    }
    
    if (progressText) {
        progressText.textContent = percentage + '%';
        animateNumber(progressText, percentage);
    }
    
    if (weekProgress) {
        weekProgress.textContent = `${completed}/${CONFIG.TOTAL_WEEKS} semanas`;
    }
    
    // Update state
    checkboxes.forEach(cb => {
        appState.progress[cb.id] = cb.checked;
    });
    
    // Save to localStorage
    saveProgress();
    
    // Check for achievements
    checkAchievements(completed);
    
    // Update statistics
    updateStatistics(completed);
}

function applyProgressToUI() {
    Object.keys(appState.progress).forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = appState.progress[id];
        }
    });
    updateProgress();
}

// ============================================
// 4. NAVIGATION & TABS
// ============================================
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Remove active from all tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        setTimeout(() => {
            selectedSection.classList.add('active');
        }, 10);
    }
    
    // Activate corresponding tab
    const activeTab = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update URL hash
    window.location.hash = sectionId;
    
    // Update state
    appState.currentTab = sectionId;
    
    // Smooth scroll to top
    smoothScrollToTop();
    
    // Analytics event
    trackEvent('Navigation', 'Tab Change', sectionId);
}

function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================================
// 5. EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const section = this.getAttribute('data-section') || 
                           this.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            showSection(section);
        });
    });
    
    // Week checkboxes
    document.querySelectorAll('.week-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', debounce(filterResources, CONFIG.DEBOUNCE_DELAY));
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportProgress);
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Copy code blocks
    setupCodeCopy();
    
    // Window resize
    window.addEventListener('resize', debounce(handleResize, CONFIG.DEBOUNCE_DELAY));
    
    // Offline/Online events
    window.addEventListener('online', () => showNotification('Conexión restaurada', 'success'));
    window.addEventListener('offline', () => showNotification('Sin conexión', 'warning'));
}

// ============================================
// 6. KEYBOARD SHORTCUTS
// ============================================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Alt/Cmd + 1-5 for navigation
        if (e.altKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    showSection('mes1');
                    break;
                case '2':
                    showSection('mes2');
                    break;
                case '3':
                    showSection('mes3');
                    break;
                case '4':
                    showSection('mes4');
                    break;
                case '5':
                    showSection('recursos');
                    break;
                case 's':
                    e.preventDefault();
                    saveProgress();
                    break;
                case 'k':
                    e.preventDefault();
                    focusSearch();
                    break;
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// ============================================
// 7. EXPORT & IMPORT
// ============================================
function exportProgress() {
    const exportData = {
        version: '1.0.0',
        date: new Date().toISOString(),
        progress: appState.progress,
        statistics: calculateStatistics(),
        achievements: getUnlockedAchievements()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', `quantum_progress_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);
    
    showNotification('Progreso exportado correctamente', 'success');
    trackEvent('Export', 'Progress', 'JSON');
}

function importProgress(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.progress) {
                appState.progress = data.progress;
                applyProgressToUI();
                saveProgress();
                showNotification('Progreso importado correctamente', 'success');
            }
        } catch (error) {
            console.error('Error importing progress:', error);
            showNotification('Error al importar el archivo', 'error');
        }
    };
    reader.readAsText(file);
}

// ============================================
// 8. ACHIEVEMENTS SYSTEM
// ============================================
function checkAchievements(completedWeeks) {
    const achievements = [
        { id: 'first_week', threshold: 1, name: '🎯 Primera Semana', message: '¡Has completado tu primera semana!' },
        { id: 'month_1', threshold: 4, name: '🎯 Primer Mes', message: '¡Mecánica Analítica dominada!' },
        { id: 'month_2', threshold: 8, name: '🔬 Experto Cuántico', message: '¡Mecánica Cuántica desbloqueada!' },
        { id: 'month_3', threshold: 12, name: '📊 Maestro Optimizador', message: '¡Optimización clásica completada!' },
        { id: 'almost_done', threshold: 15, name: '🏁 Casi Listo', message: '¡Solo falta una semana!' },
        { id: 'complete', threshold: 16, name: '🏆 Programa Completo', message: '¡Felicitaciones! Has completado todo el programa!' }
    ];
    
    achievements.forEach(achievement => {
        if (completedWeeks >= achievement.threshold && !isAchievementUnlocked(achievement.id)) {
            unlockAchievement(achievement);
        }
    });
}

function unlockAchievement(achievement) {
    // Mark as unlocked
    if (!appState.achievements) {
        appState.achievements = [];
    }
    appState.achievements.push(achievement.id);
    
    // Update UI
    const badge = document.getElementById(`badge-${achievement.id}`);
    if (badge) {
        badge.classList.remove('locked');
        badge.classList.add('animate-pulse');
    }
    
    // Show notification
    showAchievementNotification(achievement);
    
    // Play sound (optional)
    playAchievementSound();
    
    // Track event
    trackEvent('Achievement', 'Unlocked', achievement.name);
}

function isAchievementUnlocked(achievementId) {
    return appState.achievements && appState.achievements.includes(achievementId);
}

// ============================================
// 9. STATISTICS
// ============================================
function updateStatistics(completedWeeks) {
    const stats = {
        totalProgress: Math.round((completedWeeks / CONFIG.TOTAL_WEEKS) * 100),
        hoursStudied: completedWeeks * CONFIG.HOURS_PER_WEEK,
        currentMonth: Math.ceil(completedWeeks / 4),
        streak: calculateStreak(),
        lastActivity: new Date().toISOString()
    };
    
    // Update UI elements
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(`stat-${key}`);
        if (element) {
            if (typeof stats[key] === 'number') {
                animateNumber(element, stats[key]);
            } else {
                element.textContent = stats[key];
            }
        }
    });
    
    return stats;
}

function calculateStatistics() {
    const completed = Object.values(appState.progress).filter(v => v).length;
    return {
        weeksCompleted: completed,
        totalWeeks: CONFIG.TOTAL_WEEKS,
        percentageComplete: Math.round((completed / CONFIG.TOTAL_WEEKS) * 100),
        hoursStudied: completed * CONFIG.HOURS_PER_WEEK,
        estimatedCompletion: estimateCompletionDate(completed)
    };
}

function calculateStreak() {
    // Simplified streak calculation
    const today = new Date().toDateString();
    if (!appState.lastActivity || appState.lastActivity !== today) {
        appState.streak = (appState.streak || 0) + 1;
        appState.lastActivity = today;
    }
    return appState.streak || 0;
}

// ============================================
// 10. ANIMATIONS
// ============================================
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all cards
    document.querySelectorAll('.card, .week-card, .resource-card').forEach(card => {
        observer.observe(card);
    });
}

function animateNumber(element, target) {
    const start = parseInt(element.textContent) || 0;
    const duration = 1000;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// ============================================
// 11. NOTIFICATIONS
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} animate-slideIn`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    const container = document.getElementById('notificationContainer') || createNotificationContainer();
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('animate-fadeOut');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification animate-slideIn';
    notification.innerHTML = `
        <div class="achievement-icon">${achievement.name.split(' ')[0]}</div>
        <div class="achievement-content">
            <div class="achievement-title">¡Logro Desbloqueado!</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-message">${achievement.message}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-fadeOut');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// ============================================
// 12. THEME MANAGEMENT
// ============================================
function toggleTheme() {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveAppState();
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', appState.theme);
    
    // Update theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = appState.theme === 'dark' ? '☀️' : '🌙';
    }
}

// ============================================
// 13. SEARCH & FILTER
// ============================================
function filterResources() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.resource-card, .week-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const title = card.querySelector('.resource-title, .week-header');
        
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
            
            // Highlight matching text
            if (title && searchTerm) {
                highlightText(title, searchTerm);
            }
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show no results message
    showSearchResults(visibleCount, searchTerm);
}

function highlightText(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = text.replace(regex, '<mark>$1</mark>');
}

function showSearchResults(count, term) {
    let resultsElement = document.getElementById('searchResults');
    
    if (!resultsElement) {
        resultsElement = document.createElement('div');
        resultsElement.id = 'searchResults';
        resultsElement.className = 'search-results';
        document.querySelector('.search-container').appendChild(resultsElement);
    }
    
    if (term) {
        resultsElement.textContent = `${count} resultados para "${term}"`;
        resultsElement.style.display = 'block';
    } else {
        resultsElement.style.display = 'none';
    }
}

function focusSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

// ============================================
// 14. UTILITY FUNCTIONS
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function estimateCompletionDate(completedWeeks) {
    const remainingWeeks = CONFIG.TOTAL_WEEKS - completedWeeks;
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + (remainingWeeks * 7));
    return formatDate(completionDate);
}

function setupCodeCopy() {
    document.querySelectorAll('pre').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = '📋 Copiar';
        button.addEventListener('click', () => copyCode(block, button));
        block.appendChild(button);
    });
}

function copyCode(block, button) {
    const code = block.querySelector('code') || block;
    const text = code.textContent.replace('📋 Copiar', '');
    
    navigator.clipboard.writeText(text).then(() => {
        button.textContent = '✅ Copiado!';
        setTimeout(() => {
            button.textContent = '📋 Copiar';
        }, 2000);
    });
}

// ============================================
// 15. STATE MANAGEMENT
// ============================================
function saveAppState() {
    localStorage.setItem('appState', JSON.stringify(appState));
}

function loadAppState() {
    const saved = localStorage.getItem('appState');
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            appState = { ...appState, ...savedState };
        } catch (e) {
            console.error('Error loading app state:', e);
        }
    }
}

// ============================================
// 16. BROWSER COMPATIBILITY
// ============================================
function checkBrowserSupport() {
    const features = {
        localStorage: typeof(Storage) !== 'undefined',
        fetch: typeof(fetch) !== 'undefined',
        promises: typeof(Promise) !== 'undefined',
        arrow: (() => 1)() === 1
    };
    
    return Object.values(features).every(f => f);
}

function showCompatibilityWarning() {
    const warning = document.createElement('div');
    warning.className = 'compatibility-warning';
    warning.innerHTML = `
        <h2>⚠️ Navegador no compatible</h2>
        <p>Por favor, actualiza tu navegador para usar esta aplicación.</p>
        <p>Recomendamos Chrome, Firefox, Safari o Edge.</p>
    `;
    document.body.appendChild(warning);
}

// ============================================
// 17. ANALYTICS
// ============================================
function trackEvent(category, action, label = null, value = null) {
    // Google Analytics implementation
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Console logging for development
    console.log('📊 Event:', { category, action, label, value });
}

// ============================================
// 18. API INTEGRATIONS
// ============================================
async function checkForUpdates() {
    try {
        const response = await fetch(CONFIG.API_ENDPOINTS.GITHUB_REPO);
        const data = await response.json();
        
        if (data.updated_at) {
            const lastUpdate = new Date(data.updated_at);
            const lastCheck = localStorage.getItem('lastUpdateCheck');
            
            if (!lastCheck || new Date(lastCheck) < lastUpdate) {
                showUpdateNotification();
                localStorage.setItem('lastUpdateCheck', new Date().toISOString());
            }
        }
    } catch (error) {
        console.error('Error checking for updates:', error);
    }
}

function showUpdateNotification() {
    showNotification('🔄 Hay actualizaciones disponibles en el repositorio', 'info');
}

// ============================================
// 19. TOOLTIPS
// ============================================
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-popup';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
}

function hideTooltip() {
    const tooltips = document.querySelectorAll('.tooltip-popup');
    tooltips.forEach(t => t.remove());
}

// ============================================
// 20. RESPONSIVE HANDLERS
// ============================================
function handleResize() {
    const width = window.innerWidth;
    
    if (width < 768) {
        // Mobile adjustments
        document.body.classList.add('mobile-view');
        adjustMobileLayout();
    } else {
        // Desktop adjustments
        document.body.classList.remove('mobile-view');
        adjustDesktopLayout();
    }
}

function adjustMobileLayout() {
    // Move progress tracker to top on mobile
    const tracker = document.querySelector('.progress-tracker');
    if (tracker) {
        tracker.style.position = 'static';
    }
}

function adjustDesktopLayout() {
    // Fixed position for progress tracker on desktop
    const tracker = document.querySelector('.progress-tracker');
    if (tracker) {
        tracker.style.position = 'fixed';
    }
}

// ============================================
// 21. HELPER FUNCTIONS
// ============================================
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function getUnlockedAchievements() {
    return appState.achievements || [];
}

function playAchievementSound() {
    // Optional: Add sound effect
    const audio = new Audio('assets/sounds/achievement.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// ============================================
// EXPORT PUBLIC API
// ============================================
window.QuantumApp = {
    showSection,
    updateProgress,
    exportProgress,
    importProgress,
    toggleTheme,
    showNotification,
    trackEvent,
    version: '1.0.0'
};

console.log('✨ Quantum Optimization Program loaded successfully!');