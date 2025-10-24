// Enhanced Authentication System dengan Advanced Features
class EnhancedAuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.sessionTimeout = 30 * 60 * 1000; // 30 menit
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.setupSessionMonitoring();
        this.protectRoutes();
    }

    checkAuthStatus() {
        const userData = localStorage.getItem('currentUser');
        const sessionExpiry = localStorage.getItem('sessionExpiry');
        
        if (userData && sessionExpiry && Date.now() < parseInt(sessionExpiry)) {
            this.currentUser = JSON.parse(userData);
            this.isLoggedIn = true;
            this.updateSessionExpiry();
            this.updateUI();
            
            // Redirect jika di halaman login
            if (window.location.pathname.includes('index.html')) {
                this.redirectToDashboard();
            }
        } else {
            this.handleSessionExpired();
        }
    }

    setupSessionMonitoring() {
        // Monitor user activity
        document.addEventListener('mousemove', () => this.updateSessionExpiry());
        document.addEventListener('keypress', () => this.updateSessionExpiry());
        document.addEventListener('click', () => this.updateSessionExpiry());

        // Check session every minute
        setInterval(() => {
            const sessionExpiry = localStorage.getItem('sessionExpiry');
            if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
                this.handleSessionExpired();
            }
        }, 60000);
    }

    updateSessionExpiry() {
        if (this.isLoggedIn) {
            const expiryTime = Date.now() + this.sessionTimeout;
            localStorage.setItem('sessionExpiry', expiryTime.toString());
        }
    }

    protectRoutes() {
        const publicPages = ['index.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (!publicPages.includes(currentPage) && !this.isLoggedIn) {
            this.redirectToLogin();
        }
        
        if (publicPages.includes(currentPage) && this.isLoggedIn) {
            this.redirectToDashboard();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked;

        if (!username || !password) {
            this.showNotification('Harap isi semua field', 'error');
            return;
        }

        this.simulateLogin({ username, password, rememberMe });
    }

    simulateLogin(credentials) {
        const loginBtn = document.querySelector('.btn-login');
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memverifikasi...';
        loginBtn.disabled = true;

        // Simulate API call dengan delay realistis
        setTimeout(() => {
            const userData = {
                id: Date.now(),
                username: credentials.username,
                email: `${credentials.username.toLowerCase()}@gmail.com`,
                fullName: this.capitalizeName(credentials.username),
                role: 'student',
                class: '7F',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.username)}&background=4361ee&color=fff`,
                joinDate: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                loginCount: (Math.floor(Math.random() * 50) + 1),
                batteryLevel: Math.floor(Math.random() * 30) + 70,
                stats: {
                    messages: Math.floor(Math.random() * 1000),
                    tasksCompleted: Math.floor(Math.random() * 200),
                    attendance: Math.floor(Math.random() * 20) + 80,
                    performance: Math.floor(Math.random() * 30) + 70
                },
                location: this.getRandomLocation(),
                deviceInfo: this.getDeviceInfo()
            };

            this.completeLogin(userData);
            
        }, 2000);
    }

    completeLogin(userData) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        this.currentUser = userData;
        this.isLoggedIn = true;
        this.updateSessionExpiry();

        // Update user statistics
        this.updateUserStats(userData);

        this.showNotification(`Selamat datang kembali, ${userData.fullName}!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    handleLogout() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            // Simulate logout process
            this.showNotification('Melakukan logout...', 'info');
            
            setTimeout(() => {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('sessionExpiry');
                this.currentUser = null;
                this.isLoggedIn = false;
                
                this.showNotification('Logout berhasil', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }, 1000);
        }
    }

    redirectToDashboard() {
        if (!window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'dashboard.html';
        }
    }

    redirectToLogin() {
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }

    handleSessionExpired() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionExpiry');
        this.currentUser = null;
        this.isLoggedIn = false;
        
        if (!window.location.pathname.includes('index.html')) {
            this.showNotification('Sesi telah berakhir, silakan login kembali', 'warning');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    updateUserStats(userData) {
        const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
        
        if (!stats[userData.id]) {
            stats[userData.id] = {
                totalLogins: 0,
                totalTimeSpent: 0,
                lastActivity: new Date().toISOString(),
                pagesVisited: []
            };
        }
        
        stats[userData.id].totalLogins++;
        stats[userData.id].lastActivity = new Date().toISOString();
        
        localStorage.setItem('userStats', JSON.stringify(stats));
    }

    getRandomLocation() {
        const locations = [
            'Jakarta, Indonesia',
            'Bandung, Indonesia', 
            'Surabaya, Indonesia',
            'Medan, Indonesia',
            'Makassar, Indonesia'
        ];
        return locations[Math.floor(Math.random() * locations.length)];
    }

    getDeviceInfo() {
        return {
            browser: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            cores: navigator.hardwareConcurrency || 'Unknown'
        };
    }

    capitalizeName(name) {
        return name.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    showNotification(message, type = 'info') {
        // Implementation sama seperti sebelumnya
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        const autoRemove = setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }
}

// Initialize enhanced auth system
const enhancedAuth = new EnhancedAuthSystem();
window.enhancedAuth = enhancedAuth;