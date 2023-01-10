// Admin Dashboard JavaScript

// Global variables
let currentUser = null;
let charts = {};

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    initAdminDashboard();
    initThemeToggle();
    initCharts();
    initNavigation();
    initMessageFilters();
    initSettings();
});

// Initialize admin dashboard
function initAdminDashboard() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showDashboard();
    } else {
        showLoginModal();
    }
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
}

// Login functionality
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in real app, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid credentials!', 'error');
    }
});

// Logout functionality
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('theme');
    showLoginModal();
    showNotification('Logged out successfully!', 'info');
}

// Theme toggle for admin
function initThemeToggle() {
    const themeToggle = document.getElementById('adminThemeToggle');
    const body = document.body;
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateAdminThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateAdminThemeIcon(newTheme);
        
        // Update charts with new theme
        updateChartsTheme();
    });
}

function updateAdminThemeIcon(theme) {
    const themeToggle = document.getElementById('adminThemeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'light') {
        icon.className = 'fas fa-moon';
        themeToggle.title = 'Switch to Dark Mode';
    } else {
        icon.className = 'fas fa-sun';
        themeToggle.title = 'Switch to Light Mode';
    }
}

// Navigation functionality
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('section[id$="Section"]');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get section name
            const sectionName = this.dataset.section;
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show selected section
            const targetSection = document.getElementById(sectionName + 'Section');
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            
            // Update page title
            updatePageTitle(sectionName);
        });
    });
}

function updatePageTitle(sectionName) {
    const titles = {
        'dashboard': 'Dashboard',
        'analytics': 'Analytics',
        'content': 'Content Management',
        'products': 'Products',
        'messages': 'Messages',
        'users': 'Users',
        'settings': 'Settings'
    };
    
    const subtitles = {
        'dashboard': 'Welcome to Fincha Sugar Factory Admin Panel',
        'analytics': 'Website analytics and performance metrics',
        'content': 'Manage website content and pages',
        'products': 'Manage products and services',
        'messages': 'View and manage contact messages',
        'users': 'User management and permissions',
        'settings': 'System settings and configuration'
    };
    
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
    document.getElementById('pageSubtitle').textContent = subtitles[sectionName] || 'Welcome to Fincha Sugar Factory Admin Panel';
}

// Initialize charts
function initCharts() {
    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        charts.traffic = new Chart(trafficCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Website Traffic',
                    data: [1200, 1900, 3000, 5000, 2000, 3000],
                    borderColor: '#2c5530',
                    backgroundColor: 'rgba(44, 85, 48, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // Production Chart
    const productionCtx = document.getElementById('productionChart');
    if (productionCtx) {
        charts.production = new Chart(productionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Sugar Production', 'Ethanol Production', 'Energy Generation'],
                datasets: [{
                    data: [270000, 8100, 31],
                    backgroundColor: ['#2c5530', '#4a7c59', '#f4a261'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
    
    // Visitor Chart
    const visitorCtx = document.getElementById('visitorChart');
    if (visitorCtx) {
        charts.visitor = new Chart(visitorCtx, {
            type: 'bar',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{
                    label: 'Daily Visitors',
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 1500],
                    backgroundColor: '#2c5530',
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // Page Views Chart
    const pageViewsCtx = document.getElementById('pageViewsChart');
    if (pageViewsCtx) {
        charts.pageViews = new Chart(pageViewsCtx, {
            type: 'pie',
            data: {
                labels: ['Home', 'About', 'Products', 'Services', 'Contact'],
                datasets: [{
                    data: [40, 25, 20, 10, 5],
                    backgroundColor: ['#2c5530', '#4a7c59', '#6b8e6b', '#f4a261', '#e76f51'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Traffic Sources Chart
    const trafficSourcesCtx = document.getElementById('trafficSourcesChart');
    if (trafficSourcesCtx) {
        charts.trafficSources = new Chart(trafficSourcesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Search', 'Social', 'Referral'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: ['#2c5530', '#4a7c59', '#f4a261', '#e76f51'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Update charts theme
function updateChartsTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#ffffff' : '#2d3436';
    const gridColor = isDark ? '#404040' : '#e0e0e0';
    
    Object.values(charts).forEach(chart => {
        if (chart && chart.options) {
            if (chart.options.scales) {
                chart.options.scales.x.ticks.color = textColor;
                chart.options.scales.y.ticks.color = textColor;
                chart.options.scales.x.grid.color = gridColor;
                chart.options.scales.y.grid.color = gridColor;
            }
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            chart.update();
        }
    });
}

// Resize charts when sidebar is toggled
function resizeCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}

// Message filters
function initMessageFilters() {
    const messageFilter = document.getElementById('messageFilter');
    const messageItems = document.querySelectorAll('.message-item');
    
    if (messageFilter) {
        messageFilter.addEventListener('change', function() {
            const filter = this.value;
            
            messageItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'flex';
                } else if (filter === 'unread') {
                    item.style.display = item.classList.contains('unread') ? 'flex' : 'none';
                } else if (filter === 'read') {
                    item.style.display = item.classList.contains('unread') ? 'none' : 'flex';
                }
            });
        });
    }
}

// Settings functionality
function initSettings() {
    const settingsForms = document.querySelectorAll('.settings-form');
    
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (this.closest('#settingsSection')) {
                // General settings
                const siteName = document.getElementById('siteName').value;
                const siteDescription = document.getElementById('siteDescription').value;
                const contactEmail = document.getElementById('contactEmail').value;
                
                // Save settings (in real app, this would be server-side)
                localStorage.setItem('siteName', siteName);
                localStorage.setItem('siteDescription', siteDescription);
                localStorage.setItem('contactEmail', contactEmail);
                
                showNotification('Settings saved successfully!', 'success');
            } else {
                // Security settings
                const newPassword = document.getElementById('adminPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (newPassword !== confirmPassword) {
                    showNotification('Passwords do not match!', 'error');
                    return;
                }
                
                if (newPassword.length < 6) {
                    showNotification('Password must be at least 6 characters!', 'error');
                    return;
                }
                
                // Save password (in real app, this would be hashed and stored securely)
                localStorage.setItem('adminPassword', newPassword);
                
                showNotification('Password updated successfully!', 'success');
                this.reset();
            }
        });
    });
}

// Content management
function openContentModal() {
    showNotification('Content management modal would open here', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'info': 'info-circle',
        'warning': 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'info': '#3498db',
        'warning': '#f39c12'
    };
    return colors[type] || '#3498db';
}

// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Update main content margin
            if (sidebar.classList.contains('collapsed')) {
                mainContent.style.marginLeft = '80px';
            } else {
                mainContent.style.marginLeft = '280px';
            }
            
            // Resize charts after transition
            setTimeout(() => {
                resizeCharts();
            }, 300);
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('collapsed');
            mainContent.style.marginLeft = '0';
        } else {
            // Restore collapsed state on desktop
            if (sidebar.classList.contains('collapsed')) {
                mainContent.style.marginLeft = '80px';
            } else {
                mainContent.style.marginLeft = '280px';
            }
        }
    });
});

// Auto-refresh data (simulate real-time updates)
setInterval(function() {
    // Update message badge
    const messageBadge = document.getElementById('messageBadge');
    if (messageBadge) {
        const currentCount = parseInt(messageBadge.textContent);
        const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
        messageBadge.textContent = newCount;
        messageBadge.style.display = newCount > 0 ? 'inline' : 'none';
    }
    
    // Update stats (simulate real-time data)
    const statNumbers = document.querySelectorAll('.stat-content h3');
    statNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
        const change = Math.floor(Math.random() * 10) - 5;
        const newValue = Math.max(0, currentValue + change);
        stat.textContent = newValue.toLocaleString();
    });
}, 30000); // Update every 30 seconds

// Export data functionality
function exportData(type) {
    let data = {};
    
    switch(type) {
        case 'analytics':
            data = {
                visitors: 12450,
                pageViews: 45600,
                bounceRate: 35.2,
                avgSessionTime: '2m 45s'
            };
            break;
        case 'messages':
            data = {
                totalMessages: 89,
                unreadMessages: 12,
                responseRate: 95.5
            };
            break;
        default:
            data = { message: 'No data available' };
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification(`${type} data exported successfully!`, 'success');
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const items = document.querySelectorAll('.content-item, .message-item');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? 'flex' : 'none';
            });
        });
    }
}

// Initialize search
initSearch();

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + K for search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }
});

// Print functionality
function printReport() {
    window.print();
}

// Fullscreen toggle
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Help system
function showHelp() {
    showNotification('Help system would open here', 'info');
}

// Add these functions to global scope for HTML onclick handlers
window.exportData = exportData;
window.printReport = printReport;
window.toggleFullscreen = toggleFullscreen;
window.showHelp = showHelp;
