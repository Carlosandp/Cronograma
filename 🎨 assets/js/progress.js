/**
 * ============================================
 * QUANTUM OPTIMIZATION PROGRAM - PROGRESS TRACKING SYSTEM
 * Author: Carlos A.
 * Version: 1.0.0
 * Description: Advanced progress tracking and analytics dashboard
 * ============================================
 */

// ============================================
// 1. CONFIGURATION & CONSTANTS
// ============================================
const PROGRESS_CONFIG = {
    TOTAL_WEEKS: 16,
    HOURS_PER_WEEK: 4,
    MONTHS: 4,
    STORAGE_KEY: 'quantumProgressData',
    ACHIEVEMENTS_KEY: 'quantumAchievements',
    STATS_KEY: 'quantumStatistics',
    
    // Milestone thresholds
    MILESTONES: {
        BEGINNER: 0,
        INTERMEDIATE: 25,
        ADVANCED: 50,
        EXPERT: 75,
        MASTER: 100
    },
    
    // Chart colors
    CHART_COLORS: {
        primary: 'rgba(37, 99, 235, 0.8)',
        secondary: 'rgba(124, 58, 237, 0.8)',
        accent: 'rgba(8, 145, 178, 0.8)',
        success: 'rgba(16, 185, 129, 0.8)',
        warning: 'rgba(245, 158, 11, 0.8)',
        danger: 'rgba(239, 68, 68, 0.8)'
    }
};

// ============================================
// 2. STATE MANAGEMENT
// ============================================
class ProgressTracker {
    constructor() {
        this.progress = {};
        this.achievements = [];
        this.statistics = {
            totalTime: 0,
            sessionsCompleted: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastActive: null,
            startDate: null
        };
        this.charts = {};
        this.init();
    }
    
    init() {
        this.loadData();
        this.initializeCharts();
        this.updateAllDisplays();
        this.setupEventListeners();
        this.checkDailyStreak();
        console.log('📊 Progress Tracker initialized');
    }
    
    loadData() {
        // Load progress
        const savedProgress = localStorage.getItem(PROGRESS_CONFIG.STORAGE_KEY);
        if (savedProgress) {
            this.progress = JSON.parse(savedProgress);
        }
        
        // Load achievements
        const savedAchievements = localStorage.getItem(PROGRESS_CONFIG.ACHIEVEMENTS_KEY);
        if (savedAchievements) {
            this.achievements = JSON.parse(savedAchievements);
        }
        
        // Load statistics
        const savedStats = localStorage.getItem(PROGRESS_CONFIG.STATS_KEY);
        if (savedStats) {
            this.statistics = JSON.parse(savedStats);
        }
        
        // Set start date if not exists
        if (!this.statistics.startDate) {
            this.statistics.startDate = new Date().toISOString();
            this.saveStatistics();
        }
    }
    
    saveData() {
        localStorage.setItem(PROGRESS_CONFIG.STORAGE_KEY, JSON.stringify(this.progress));
        localStorage.setItem(PROGRESS_CONFIG.ACHIEVEMENTS_KEY, JSON.stringify(this.achievements));
        this.saveStatistics();
    }
    
    saveStatistics() {
        localStorage.setItem(PROGRESS_CONFIG.STATS_KEY, JSON.stringify(this.statistics));
    }
}

// ============================================
// 3. CHART INITIALIZATION
// ============================================
function initializeCharts() {
    // Progress by Month Chart
    const monthCtx = document.getElementById('progressChart');
    if (monthCtx) {
        this.charts.monthProgress = createMonthProgressChart(monthCtx);
    }
    
    // Weekly Activity Heatmap
    const heatmapCtx = document.getElementById('heatmapChart');
    if (heatmapCtx) {
        this.charts.heatmap = createActivityHeatmap(heatmapCtx);
    }
    
    // Skills Radar Chart
    const radarCtx = document.getElementById('skillsRadar');
    if (radarCtx) {
        this.charts.skills = createSkillsRadarChart(radarCtx);
    }
    
    // Time Distribution Pie Chart
    const pieCtx = document.getElementById('timeDistribution');
    if (pieCtx) {
        this.charts.distribution = createTimeDistributionChart(pieCtx);
    }
    
    // Progress Timeline
    const timelineCtx = document.getElementById('progressTimeline');
    if (timelineCtx) {
        this.charts.timeline = createProgressTimeline(timelineCtx);
    }
}

function createMonthProgressChart(ctx) {
    const monthData = calculateMonthProgress();
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mes 1: Mecánica', 'Mes 2: Cuántica', 'Mes 3: Optimización', 'Mes 4: Algoritmos'],
            datasets: [{
                label: 'Progreso (%)',
                data: monthData,
                backgroundColor: [
                    PROGRESS_CONFIG.CHART_COLORS.primary,
                    PROGRESS_CONFIG.CHART_COLORS.secondary,
                    PROGRESS_CONFIG.CHART_COLORS.accent,
                    PROGRESS_CONFIG.CHART_COLORS.success
                ],
                borderColor: [
                    PROGRESS_CONFIG.CHART_COLORS.primary,
                    PROGRESS_CONFIG.CHART_COLORS.secondary,
                    PROGRESS_CONFIG.CHART_COLORS.accent,
                    PROGRESS_CONFIG.CHART_COLORS.success
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Progreso: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#334155'
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createActivityHeatmap(ctx) {
    const heatmapData = generateHeatmapData();
    
    return new Chart(ctx, {
        type: 'matrix',
        data: {
            datasets: [{
                label: 'Actividad',
                data: heatmapData,
                backgroundColor: function(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = value / 4; // Normalize to 0-1
                    return `rgba(16, 185, 129, ${alpha})`;
                },
                borderColor: '#334155',
                borderWidth: 1,
                width: 20,
                height: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function() {
                            return '';
                        },
                        label: function(context) {
                            const day = context.dataset.data[context.dataIndex];
                            return `${day.date}: ${day.v} horas`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'category',
                    labels: generateWeekLabels(),
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createSkillsRadarChart(ctx) {
    const skillsData = calculateSkillsProgress();
    
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Mecánica Analítica',
                'Mecánica Cuántica',
                'Optimización Clásica',
                'Algoritmos NISQ',
                'Programación',
                'Matemáticas'
            ],
            datasets: [{
                label: 'Nivel Actual',
                data: skillsData.current,
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                borderColor: PROGRESS_CONFIG.CHART_COLORS.primary,
                borderWidth: 2,
                pointBackgroundColor: PROGRESS_CONFIG.CHART_COLORS.primary,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: PROGRESS_CONFIG.CHART_COLORS.primary
            }, {
                label: 'Objetivo',
                data: [100, 100, 100, 100, 100, 100],
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                borderColor: 'rgba(148, 163, 184, 0.3)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8'
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: '#94a3b8',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: '#334155'
                    },
                    angleLines: {
                        color: '#334155'
                    },
                    pointLabels: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

function createTimeDistributionChart(ctx) {
    const distribution = calculateTimeDistribution();
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Teoría', 'Práctica', 'Proyectos', 'Evaluación'],
            datasets: [{
                data: distribution,
                backgroundColor: [
                    PROGRESS_CONFIG.CHART_COLORS.primary,
                    PROGRESS_CONFIG.CHART_COLORS.secondary,
                    PROGRESS_CONFIG.CHART_COLORS.accent,
                    PROGRESS_CONFIG.CHART_COLORS.warning
                ],
                borderColor: '#1e293b',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value}h (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function createProgressTimeline(ctx) {
    const timelineData = generateTimelineData();
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: timelineData.labels,
            datasets: [{
                label: 'Progreso Real',
                data: timelineData.actual,
                borderColor: PROGRESS_CONFIG.CHART_COLORS.primary,
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }, {
                label: 'Progreso Esperado',
                data: timelineData.expected,
                borderColor: PROGRESS_CONFIG.CHART_COLORS.success,
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                tension: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#334155'
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ============================================
// 4. DATA CALCULATIONS
// ============================================
function calculateMonthProgress() {
    const progress = [];
    for (let month = 1; month <= 4; month++) {
        let completed = 0;
        const startWeek = (month - 1) * 4 + 1;
        const endWeek = month * 4;
        
        for (let week = startWeek; week <= endWeek; week++) {
            if (document.getElementById(`week${week}`)?.checked) {
                completed++;
            }
        }
        progress.push((completed / 4) * 100);
    }
    return progress;
}

function calculateSkillsProgress() {
    const completed = document.querySelectorAll('.week-checkbox:checked').length;
    const total = PROGRESS_CONFIG.TOTAL_WEEKS;
    const percentage = (completed / total) * 100;
    
    return {
        current: [
            Math.min(100, percentage * 1.2), // Mecánica Analítica
            Math.min(100, percentage * 0.9), // Mecánica Cuántica
            Math.min(100, percentage * 1.1), // Optimización Clásica
            Math.min(100, percentage * 0.8), // Algoritmos NISQ
            Math.min(100, percentage * 1.0), // Programación
            Math.min(100, percentage * 0.95) // Matemáticas
        ]
    };
}

function calculateTimeDistribution() {
    const completed = document.querySelectorAll('.week-checkbox:checked').length;
    const hoursCompleted = completed * PROGRESS_CONFIG.HOURS_PER_WEEK;
    
    // Assuming 50% theory, 30% practice, 15% projects, 5% evaluation
    return [
        Math.round(hoursCompleted * 0.5),
        Math.round(hoursCompleted * 0.3),
        Math.round(hoursCompleted * 0.15),
        Math.round(hoursCompleted * 0.05)
    ];
}

function generateHeatmapData() {
    const data = [];
    const weeks = 16;
    const daysPerWeek = 7;
    
    for (let week = 0; week < weeks; week++) {
        for (let day = 0; day < daysPerWeek; day++) {
            data.push({
                x: day,
                y: week,
                v: Math.random() * 4, // Random hours for demo
                date: `Semana ${week + 1}, Día ${day + 1}`
            });
        }
    }
    return data;
}

function generateTimelineData() {
    const weeks = 16;
    const labels = [];
    const actual = [];
    const expected = [];
    
    for (let i = 1; i <= weeks; i++) {
        labels.push(`S${i}`);
        
        // Expected: linear progress
        expected.push((i / weeks) * 100);
        
        // Actual: based on checkboxes
        let completed = 0;
        for (let j = 1; j <= i; j++) {
            if (document.getElementById(`week${j}`)?.checked) {
                completed++;
            }
        }
        actual.push((completed / weeks) * 100);
    }
    
    return { labels, actual, expected };
}

function generateWeekLabels() {
    const labels = [];
    for (let i = 1; i <= 16; i++) {
        labels.push(`Semana ${i}`);
    }
    return labels;
}

// ============================================
// 5. PROGRESS UPDATE FUNCTIONS
// ============================================
function updateAllDisplays() {
    updateStatistics();
    updateCharts();
    updateAchievements();
    updateTimeline();
    updatePredictions();
}

function updateStatistics() {
    const completed = document.querySelectorAll('.week-checkbox:checked').length;
    const total = PROGRESS_CONFIG.TOTAL_WEEKS;
    const percentage = Math.round((completed / total) * 100);
    
    // Update main stats
    updateElement('totalProgress', percentage + '%');
    updateElement('weeksCompleted', `${completed}/${total}`);
    updateElement('hoursStudied', `${completed * PROGRESS_CONFIG.HOURS_PER_WEEK}h`);
    updateElement('currentStreak', this.statistics.currentStreak || 0);
    
    // Update progress level
    const level = getProgressLevel(percentage);
    updateElement('progressLevel', level.name);
    updateProgressBadge(level);
    
    // Update completion estimate
    const estimate = estimateCompletionDate(completed);
    updateElement('estimatedCompletion', estimate);
    
    // Save statistics
    this.statistics.sessionsCompleted = completed;
    this.statistics.totalTime = completed * PROGRESS_CONFIG.HOURS_PER_WEEK;
    this.saveStatistics();
}

function updateCharts() {
    // Update all charts with new data
    if (this.charts.monthProgress) {
        this.charts.monthProgress.data.datasets[0].data = calculateMonthProgress();
        this.charts.monthProgress.update();
    }
    
    if (this.charts.skills) {
        const skillsData = calculateSkillsProgress();
        this.charts.skills.data.datasets[0].data = skillsData.current;
        this.charts.skills.update();
    }
    
    if (this.charts.distribution) {
        this.charts.distribution.data.datasets[0].data = calculateTimeDistribution();
        this.charts.distribution.update();
    }
    
    if (this.charts.timeline) {
        const timelineData = generateTimelineData();
        this.charts.timeline.data.datasets[0].data = timelineData.actual;
        this.charts.timeline.update();
    }
}

// ============================================
// 6. ACHIEVEMENTS SYSTEM
// ============================================
const ACHIEVEMENTS = [
    {
        id: 'first_step',
        name: '🎯 Primer Paso',
        description: 'Completa tu primera semana',
        threshold: 1,
        points: 10
    },
    {
        id: 'month_1',
        name: '⚡ Fundamentos Sólidos',
        description: 'Completa el Mes 1',
        threshold: 4,
        points: 25
    },
    {
        id: 'halfway',
        name: '🌟 Medio Camino',
        description: 'Completa 50% del programa',
        threshold: 8,
        points: 50
    },
    {
        id: 'month_3',
        name: '🔥 Optimizador Experto',
        description: 'Completa el Mes 3',
        threshold: 12,
        points: 75
    },
    {
        id: 'almost_there',
        name: '🏁 Casi en la Meta',
        description: 'Completa 90% del programa',
        threshold: 15,
        points: 90
    },
    {
        id: 'complete',
        name: '🏆 Maestro Cuántico',
        description: 'Completa todo el programa',
        threshold: 16,
        points: 100
    },
    {
        id: 'streak_7',
        name: '🔥 Racha Semanal',
        description: 'Mantén una racha de 7 días',
        threshold: 7,
        points: 20,
        type: 'streak'
    },
    {
        id: 'streak_30',
        name: '⚡ Racha Mensual',
        description: 'Mantén una racha de 30 días',
        threshold: 30,
        points: 50,
        type: 'streak'
    },
    {
        id: 'perfectionist',
        name: '✨ Perfeccionista',
        description: 'Completa un mes sin saltarte ningún día',
        threshold: 4,
        points: 30,
        type: 'special'
    }
];

function updateAchievements() {
    const completed = document.querySelectorAll('.week-checkbox:checked').length;
    
    ACHIEVEMENTS.forEach(achievement => {
        if (achievement.type === 'streak') {
            if (this.statistics.currentStreak >= achievement.threshold) {
                unlockAchievement(achievement);
            }
        } else if (completed >= achievement.threshold) {
            unlockAchievement(achievement);
        }
    });
    
    updateAchievementDisplay();
    updateTotalPoints();
}

function unlockAchievement(achievement) {
    if (!this.achievements.includes(achievement.id)) {
        this.achievements.push(achievement.id);
        
        // Update UI
        const badge = document.getElementById(`badge-${achievement.id}`);
        if (badge) {
            badge.classList.remove('locked');
            badge.classList.add('unlocked', 'animate-pulse');
        }
        
        // Show notification
        showAchievementNotification(achievement);
        
        // Play sound
        playAchievementSound();
        
        // Save
        this.saveData();
    }
}

function updateAchievementDisplay() {
    const container = document.getElementById('achievementsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    ACHIEVEMENTS.forEach(achievement => {
        const isUnlocked = this.achievements.includes(achievement.id);
        const badge = createAchievementBadge(achievement, isUnlocked);
        container.appendChild(badge);
    });
}

function createAchievementBadge(achievement, isUnlocked) {
    const div = document.createElement('div');
    div.className = `achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}`;
    div.id = `badge-${achievement.id}`;
    div.innerHTML = `
        <div class="achievement-icon">${achievement.name.split(' ')[0]}</div>
        <div class="achievement-info">
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-points">${achievement.points} puntos</div>
        </div>
    `;
    
    if (!isUnlocked) {
        div.classList.add('opacity-50');
    }
    
    return div;
}

function updateTotalPoints() {
    const totalPoints = this.achievements.reduce((total, achievementId) => {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        return total + (achievement ? achievement.points : 0);
    }, 0);
    
    updateElement('totalPoints', totalPoints);
    updateElement('playerLevel', getPlayerLevel(totalPoints));
}

// ============================================
// 7. TIMELINE INTERACTION
// ============================================
function updateTimeline() {
    document.querySelectorAll('.week-box').forEach(box => {
        const week = box.dataset.week;
        const checkbox = document.getElementById(`week${week}`);
        
        if (checkbox && checkbox.checked) {
            box.classList.add('completed');
        } else {
            box.classList.remove('completed');
        }
        
        // Add click handler
        box.addEventListener('click', function() {
            toggleWeek(this);
        });
    });
}

function toggleWeek(element) {
    const week = element.dataset.week;
    const checkbox = document.getElementById(`week${week}`);
    
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
    }
    
    element.classList.toggle('completed');
    
    // Update progress
    this.progress[`week${week}`] = element.classList.contains('completed');
    
    // Save and update displays
    this.saveData();
    this.updateAllDisplays();
    
    // Check for achievements
    this.updateAchievements();
}

// ============================================
// 8. PREDICTIONS & ANALYTICS
// ============================================
function updatePredictions() {
    const completed = document.querySelectorAll('.week-checkbox:checked').length;
    const remaining = PROGRESS_CONFIG.TOTAL_WEEKS - completed;
    
    // Calculate average progress rate
    const daysSinceStart = getDaysSinceStart();
    const averageWeeksPerDay = daysSinceStart > 0 ? completed / daysSinceStart : 0;
    
    // Predict completion date
    const daysToComplete = averageWeeksPerDay > 0 ? remaining / averageWeeksPerDay : remaining * 7;
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + Math.ceil(daysToComplete));
    
    // Update UI
    updateElement('predictedCompletion', formatDate(completionDate));
    updateElement('remainingWeeks', remaining);
    updateElement('progressRate', `${(averageWeeksPerDay * 7).toFixed(1)} semanas/semana`);
    
    // Calculate efficiency
    const expectedProgress = (daysSinceStart / (PROGRESS_CONFIG.TOTAL_WEEKS * 7)) * 100;
    const actualProgress = (completed / PROGRESS_CONFIG.TOTAL_WEEKS) * 100;
    const efficiency = expectedProgress > 0 ? (actualProgress / expectedProgress * 100).toFixed(1) : 0;
    
    updateElement('efficiency', `${efficiency}%`);
    updateEfficiencyIndicator(efficiency);
}

function getDaysSinceStart() {
    if (!this.statistics.startDate) return 0;
    
    const start = new Date(this.statistics.startDate);
    const now = new Date();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function estimateCompletionDate(completedWeeks) {
    const remainingWeeks = PROGRESS_CONFIG.TOTAL_WEEKS - completedWeeks;
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + (remainingWeeks * 7));
    return formatDate(completionDate);
}

// ============================================
// 9. STREAK MANAGEMENT
// ============================================
function checkDailyStreak() {
    const today = new Date().toDateString();
    const lastActive = this.statistics.lastActive;
    
    if (lastActive) {
        const lastDate = new Date(lastActive).toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (lastDate === yesterdayString) {
            // Continue streak
            this.statistics.currentStreak++;
        } else if (lastDate !== today) {
            // Break streak
            this.statistics.currentStreak = 0;
        }
    } else {
        // First day
        this.statistics.currentStreak = 1;
    }
    
    // Update longest streak
    if (this.statistics.currentStreak > this.statistics.longestStreak) {
        this.statistics.longestStreak = this.statistics.currentStreak;
    }
    
    // Update last active
    this.statistics.lastActive = today;
    
    // Save
    this.saveStatistics();
    
    // Update display
    updateElement('currentStreak', this.statistics.currentStreak);
    updateElement('longestStreak', this.statistics.longestStreak);
}

// ============================================
// 10. EXPORT & REPORTING
// ============================================
function exportProgressReport() {
    const report = generateProgressReport();
    downloadReport(report);
}

function generateProgressReport() {
    const completed = document.querySelectorAll('.week-checkbox:checked').length;
    const percentage = Math.round((completed / PROGRESS_CONFIG.TOTAL_WEEKS) * 100);
    
    return {
        metadata: {
            generatedAt: new Date().toISOString(),
            version: '1.0.0',
            program: 'Quantum Optimization Program'
        },
        progress: {
            weeksCompleted: completed,
            totalWeeks: PROGRESS_CONFIG.TOTAL_WEEKS,
            percentageComplete: percentage,
            hoursStudied: completed * PROGRESS_CONFIG.HOURS_PER_WEEK,
            startDate: this.statistics.startDate,
            estimatedCompletion: estimateCompletionDate(completed)
        },
        achievements: {
            unlocked: this.achievements,
            totalPoints: calculateTotalPoints(),
            level: getPlayerLevel(calculateTotalPoints())
        },
        statistics: this.statistics,
        monthlyBreakdown: {
            month1: calculateMonthProgress()[0],
            month2: calculateMonthProgress()[1],
            month3: calculateMonthProgress()[2],
            month4: calculateMonthProgress()[3]
        },
        skills: calculateSkillsProgress().current,
        recommendations: generateRecommendations(percentage)
    };
}

function downloadReport(report) {
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', `quantum_progress_report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);
    
    showNotification('📊 Reporte exportado correctamente', 'success');
}

function generateCertificate() {
    const completed = document.querySelectorAll('.week-checkbox:checked').length;
    
    if (completed < PROGRESS_CONFIG.TOTAL_WEEKS) {
        showNotification('⚠️ Debes completar todas las semanas para generar el certificado', 'warning');
        return;
    }
    
    // Generate certificate (placeholder - would generate PDF in production)
    const certificate = {
        name: 'Usuario', // Would get from user profile
        program: 'Programa de Optimización en Computación Cuántica',
        completionDate: new Date().toISOString(),
        totalHours: PROGRESS_CONFIG.TOTAL_WEEKS * PROGRESS_CONFIG.HOURS_PER_WEEK,
        grade: 'Excelente',
        certificateId: generateCertificateId()
    };
    
    showNotification('🎓 ¡Certificado generado! Se descargará en breve...', 'success');
    console.log('Certificate:', certificate);
}

// ============================================
// 11. UTILITY FUNCTIONS
// ============================================
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        if (typeof value === 'number') {
            animateNumber(element, value);
        } else {
            element.textContent = value;
        }
    }
}

function animateNumber(element, target) {
    const start = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (target - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getProgressLevel(percentage) {
    if (percentage >= PROGRESS_CONFIG.MILESTONES.MASTER) {
        return { name: 'Maestro Cuántico', color: '#10b981' };
    } else if (percentage >= PROGRESS_CONFIG.MILESTONES.EXPERT) {
        return { name: 'Experto', color: '#0891b2' };
    } else if (percentage >= PROGRESS_CONFIG.MILESTONES.ADVANCED) {
        return { name: 'Avanzado', color: '#7c3aed' };
    } else if (percentage >= PROGRESS_CONFIG.MILESTONES.INTERMEDIATE) {
        return { name: 'Intermedio', color: '#2563eb' };
    } else {
        return { name: 'Principiante', color: '#94a3b8' };
    }
}

function getPlayerLevel(points) {
    if (points >= 500) return 'Nivel Diamante';
    if (points >= 300) return 'Nivel Platino';
    if (points >= 200) return 'Nivel Oro';
    if (points >= 100) return 'Nivel Plata';
    if (points >= 50) return 'Nivel Bronce';
    return 'Nivel Inicial';
}

function updateProgressBadge(level) {
    const badge = document.getElementById('progressBadge');
    if (badge) {
        badge.textContent = level.name;
        badge.style.backgroundColor = level.color;
    }
}

function updateEfficiencyIndicator(efficiency) {
    const indicator = document.getElementById('efficiencyIndicator');
    if (indicator) {
        if (efficiency >= 90) {
            indicator.className = 'efficiency-indicator excellent';
        } else if (efficiency >= 70) {
            indicator.className = 'efficiency-indicator good';
        } else if (efficiency >= 50) {
            indicator.className = 'efficiency-indicator average';
        } else {
            indicator.className = 'efficiency-indicator needs-improvement';
        }
    }
}

function calculateTotalPoints() {
    return this.achievements.reduce((total, achievementId) => {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        return total + (achievement ? achievement.points : 0);
    }, 0);
}

function generateRecommendations(percentage) {
    const recommendations = [];
    
    if (percentage < 25) {
        recommendations.push('Establece un horario fijo de estudio para crear consistencia');
        recommendations.push('Comienza con las secciones más básicas de mecánica analítica');
    } else if (percentage < 50) {
        recommendations.push('Excelente progreso inicial. Mantén el ritmo actual');
        recommendations.push('Considera formar un grupo de estudio para las secciones más complejas');
    } else if (percentage < 75) {
        recommendations.push('Estás en la recta final. No te detengas ahora');
        recommendations.push('Revisa los conceptos de los primeros meses para reforzar');
    } else {
        recommendations.push('¡Casi lo logras! Prepara tu proyecto final');
        recommendations.push('Considera aplicar a posiciones en computación cuántica');
    }
    
    return recommendations;
}

function generateCertificateId() {
    return 'QCP-' + Date.now().toString(36).toUpperCase();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} animate-slideIn`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to container
    const container = document.getElementById('notificationContainer') || document.body;
    container.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.add('animate-fadeOut');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-popup animate-bounceIn';
    notification.innerHTML = `
        <div class="achievement-popup-icon">${achievement.name.split(' ')[0]}</div>
        <div class="achievement-popup-content">
            <h3>¡Logro Desbloqueado!</h3>
            <p>${achievement.name}</p>
            <p class="achievement-popup-description">${achievement.description}</p>
            <p class="achievement-popup-points">+${achievement.points} puntos</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-fadeOut');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function playAchievementSound() {
    // Optional: Add sound effect
    const audio = new Audio('assets/sounds/achievement.mp3');
    audio.play().catch(e => console.log('Sound play failed:', e));
}

// ============================================
// 12. EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Week checkboxes
    document.querySelectorAll('.week-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            this.updateAllDisplays();
        });
    });
    
    // Export button
    const exportBtn = document.getElementById('exportProgressBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => exportProgressReport());
    }
    
    // Certificate button
    const certBtn = document.getElementById('generateCertificateBtn');
    if (certBtn) {
        certBtn.addEventListener('click', () => generateCertificate());
    }
    
    // Reset button
    const resetBtn = document.getElementById('resetProgressBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => resetProgress());
    }
    
    // Back button
    const backBtn = document.getElementById('backToMainBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

function resetProgress() {
    if (!confirm('¿Estás seguro de que quieres reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
        return;
    }
    
    // Clear all data
    this.progress = {};
    this.achievements = [];
    this.statistics = {
        totalTime: 0,
        sessionsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActive: null,
        startDate: new Date().toISOString()
    };
    
    // Clear checkboxes
    document.querySelectorAll('.week-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear timeline
    document.querySelectorAll('.week-box').forEach(box => {
        box.classList.remove('completed');
    });
    
    // Save and update
    this.saveData();
    this.updateAllDisplays();
    
    showNotification('🔄 Progreso reiniciado', 'info');
}

// ============================================
// 13. INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Initializing Progress Dashboard...');
    
    // Create tracker instance
    window.progressTracker = new ProgressTracker();
    
    // Apply saved progress to checkboxes
    Object.keys(window.progressTracker.progress).forEach(weekId => {
        const checkbox = document.getElementById(weekId);
        if (checkbox) {
            checkbox.checked = window.progressTracker.progress[weekId];
        }
    });
    
    // Update all displays
    window.progressTracker.updateAllDisplays();
    
    console.log('✅ Progress Dashboard ready!');
});

// ============================================
// 14. PUBLIC API
// ============================================
window.ProgressAPI = {
    tracker: null,
    exportReport: exportProgressReport,
    generateCertificate: generateCertificate,
    resetProgress: resetProgress,
    updateProgress: function() {
        if (this.tracker) {
            this.tracker.updateAllDisplays();
        }
    },
    getStatistics: function() {
        return this.tracker ? this.tracker.statistics : null;
    },
    getAchievements: function() {
        return this.tracker ? this.tracker.achievements : [];
    }
};

console.log('✨ Progress Tracking System v1.0.0 loaded successfully!');