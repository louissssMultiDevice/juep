// Enhanced Features JavaScript
class EnhancedFeatures {
    constructor() {
        this.startTime = Date.now();
        this.init();
    }

    init() {
        this.setupRealTimeClock();
        this.setupBatterySimulation();
        this.setupSystemMonitoring();
        this.setupPasswordValidation();
        this.setupCharts();
        this.setupLocationDetection();
    }

    // Real-time Clock
    setupRealTimeClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        
        // Server Time
        const serverTime = document.getElementById('serverTime');
        if (serverTime) {
            serverTime.textContent = now.toLocaleTimeString('id-ID');
        }

        // Current Date
        const currentDate = document.getElementById('currentDate');
        if (currentDate) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            currentDate.textContent = now.toLocaleDateString('id-ID', options);
        }

        // Uptime Counter
        const uptimeCounter = document.getElementById('uptimeCounter');
        if (uptimeCounter) {
            const uptime = Date.now() - this.startTime;
            uptimeCounter.textContent = this.formatUptime(uptime);
        }
    }

    formatUptime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Battery Simulation
    setupBatterySimulation() {
        this.updateBattery();
        setInterval(() => this.updateBattery(), 5000);
    }

    updateBattery() {
        const user = window.enhancedAuth?.currentUser;
        let batteryLevel = user?.batteryLevel || 75;
        
        // Simulate battery drain/charge
        const change = Math.random() * 4 - 2; // -2 to +2
        batteryLevel = Math.max(10, Math.min(100, batteryLevel + change));
        
        // Update all battery indicators
        this.updateBatteryElement('batteryLevel', batteryLevel);
        this.updateBatteryElement('batteryPercent', batteryLevel);
        this.updateBatteryElement('profileBattery', batteryLevel);
        this.updateBatteryElement('dashboardBatteryPercent', batteryLevel);
        
        // Update battery fill
        const fillElements = document.querySelectorAll('.battery-fill');
        fillElements.forEach(el => {
            el.style.width = `${batteryLevel}%`;
            
            // Update color based on level
            if (batteryLevel < 20) {
                el.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            } else if (batteryLevel < 50) {
                el.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            } else {
                el.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            }
        });

        // Update battery status
        const statusElements = document.querySelectorAll('#batteryStatus, #batteryStatus');
        statusElements.forEach(el => {
            if (el) {
                el.textContent = batteryLevel < 95 ? 'Mengisi Daya' : 'Penuh';
            }
        });

        // Update battery time
        const timeElements = document.querySelectorAll('#batteryTime, #batteryTimeLeft');
        timeElements.forEach(el => {
            if (el) {
                const hours = Math.floor(batteryLevel / 4.16); // Approximate
                const minutes = Math.floor((batteryLevel % 4.16) / 0.069);
                el.textContent = `${hours}j ${minutes}m`;
            }
        });
    }

    updateBatteryElement(id, level) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = `${Math.round(level)}%`;
        }
    }

    // System Monitoring
    setupSystemMonitoring() {
        this.updateSystemStats();
        setInterval(() => this.updateSystemStats(), 3000);
    }

    updateSystemStats() {
        // Online users
        const onlineUsers = document.getElementById('onlineUsers');
        if (onlineUsers) {
            const users = Math.floor(Math.random() * 10) + 20; // 20-30 users
            onlineUsers.textContent = users;
        }

        // Response time
        const responseTime = document.getElementById('responseTime');
        if (responseTime) {
            const time = Math.floor(Math.random() * 50) + 10; // 10-60ms
            responseTime.textContent = `${time}ms`;
        }

        // Server response
        const serverResponse = document.getElementById('serverResponse');
        if (serverResponse) {
            const response = Math.floor(Math.random() * 40) + 5; // 5-45ms
            serverResponse.textContent = `${response}ms`;
        }

        // Database queries
        const dbQueries = document.getElementById('dbQueries');
        if (dbQueries) {
            const queries = Math.floor(Math.random() * 100) + 100; // 100-200/min
            dbQueries.textContent = `${queries}/min`;
        }

        // Network ping
        const networkPing = document.getElementById('networkPing');
        if (networkPing) {
            const ping = Math.floor(Math.random() * 30) + 10; // 10-40ms
            networkPing.textContent = `${ping}ms`;
        }

        // Network speed
        const networkSpeed = document.getElementById('networkSpeed');
        if (networkSpeed) {
            const speed = Math.floor(Math.random() * 50) + 50; // 50-100 Mbps
            networkSpeed.textContent = `${speed} Mbps`;
        }

        // Network latency
        const networkLatency = document.getElementById('networkLatency');
        if (networkLatency) {
            const latency = Math.floor(Math.random() * 20) + 15; // 15-35ms
            networkLatency.textContent = `${latency}ms`;
        }
    }

    // Password Validation
    setupPasswordValidation() {
        const newPassword = document.getElementById('newPassword');
        const confirmPassword = document.getElementById('confirmPassword');

        if (newPassword) {
            newPassword.addEventListener('input', (e) => this.validatePassword(e.target.value));
        }

        if (confirmPassword) {
            confirmPassword.addEventListener('input', (e) => this.checkPasswordMatch(e.target.value));
        }
    }

    validatePassword(password) {
        const strengthBars = document.querySelectorAll('.strength-bar');
        const requirements = {
            length: document.getElementById('reqLength'),
            upper: document.getElementById('reqUpper'),
            lower: document.getElementById('reqLower'),
            number: document.getElementById('reqNumber'),
            special: document.getElementById('reqSpecial')
        };

        // Reset
        strengthBars.forEach(bar => bar.classList.remove('active'));
        Object.values(requirements).forEach(req => req.classList.remove('valid'));

        let strength = 0;

        // Check length
        if (password.length >= 8) {
            requirements.length.classList.add('valid');
            strength++;
        }

        // Check uppercase
        if (/[A-Z]/.test(password)) {
            requirements.upper.classList.add('valid');
            strength++;
        }

        // Check lowercase
        if (/[a-z]/.test(password)) {
            requirements.lower.classList.add('valid');
            strength++;
        }

        // Check numbers
        if (/[0-9]/.test(password)) {
            requirements.number.classList.add('valid');
            strength++;
        }

        // Check special characters
        if (/[^A-Za-z0-9]/.test(password)) {
            requirements.special.classList.add('valid');
            strength++;
        }

        // Update strength bars
        for (let i = 0; i < strength; i++) {
            if (strengthBars[i]) {
                strengthBars[i].classList.add('active');
                
                // Set color based on strength
                if (strength < 3) {
                    strengthBars[i].classList.add('weak');
                } else if (strength < 5) {
                    strengthBars[i].classList.add('medium');
                } else {
                    strengthBars[i].classList.add('strong');
                }
            }
        }
    }

    checkPasswordMatch(confirmPassword) {
        const newPassword = document.getElementById('newPassword')?.value;
        const matchElement = document.getElementById('passwordMatch');

        if (!matchElement) return;

        if (!confirmPassword) {
            matchElement.textContent = '';
            matchElement.className = 'password-match';
            return;
        }

        if (newPassword === confirmPassword) {
            matchElement.textContent = '✓ Password cocok';
            matchElement.className = 'password-match valid';
        } else {
            matchElement.textContent = '✗ Password tidak cocok';
            matchElement.className = 'password-match invalid';
        }
    }

    // Charts
    setupCharts() {
        this.createUsageChart();
        this.createActivityChart();
        this.createTimeChart();
    }

    createUsageChart() {
        const ctx = document.getElementById('usageChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                datasets: [{
                    label: 'Penggunaan Sistem',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.4,
                    fill: true
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
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    createActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pesan', 'Tugas', 'Presensi', 'Nilai', 'Forum'],
                datasets: [{
                    label: 'Aktivitas',
                    data: [65, 59, 80, 81, 56],
                    backgroundColor: [
                        '#4361ee',
                        '#f72585',
                        '#4cc9f0',
                        '#7209b7',
                        '#3a0ca3'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createTimeChart() {
        const ctx = document.getElementById('timeChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Belajar', 'Tugas', 'Forum', 'Lainnya'],
                datasets: [{
                    data: [40, 25, 20, 15],
                    backgroundColor: [
                        '#4361ee',
                        '#f72585',
                        '#4cc9f0',
                        '#7209b7'
                    ]
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

    // Location Detection
    setupLocationDetection() {
        this.detectLocation();
    }

    detectLocation() {
        const locationElement = document.getElementById('userLocation');
        const profileLocation = document.getElementById('profileLocation');

        // Try HTML5 Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    this.reverseGeocode(lat, lng);
                },
                (error) => {
                    // Fallback to IP-based location
                    this.getIPBasedLocation();
                }
            );
        } else {
            this.getIPBasedLocation();
        }
    }

    reverseGeocode(lat, lng) {
        // Simulate reverse geocoding
        const locations = [
            'Jakarta, Indonesia',
            'Bandung, Indonesia',
            'Surabaya, Indonesia',
            'Medan, Indonesia'
        ];
        
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        this.updateLocation(randomLocation);
    }

    getIPBasedLocation() {
        // Simulate IP-based location detection
        const locations = [
            'Jakarta, Indonesia',
            'Bandung, Indonesia', 
            'Surabaya, Indonesia'
        ];
        
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        this.updateLocation(randomLocation);
    }

    updateLocation(location) {
        const locationElement = document.getElementById('userLocation');
        const profileLocation = document.getElementById('profileLocation');

        if (locationElement) locationElement.textContent = location;
        if (profileLocation) profileLocation.textContent = location;
    }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedFeatures = new EnhancedFeatures();
});
