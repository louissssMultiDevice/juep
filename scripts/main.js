// Main JavaScript File - Common functionality across all pages

class MainApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setupRobotAssistant();
        this.simulateSystemInfo();
        this.checkAuth();
    }

    setupTheme() {
        // Apply saved theme
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.updateThemeToggleIcon();
        }

        // Setup theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        this.currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeToggleIcon();
        this.playSound('click');
    }

    updateThemeToggleIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (this.currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }

    setupEventListeners() {
        // Setup any global event listeners here
        document.addEventListener('click', (e) => {
            // Close robot chat when clicking outside
            if (e.target.closest('.robot-assistant') === null) {
                const robotChat = document.getElementById('robotChat');
                if (robotChat && robotChat.classList.contains('active')) {
                    robotChat.classList.remove('active');
                }
            }
        });
    }

    setupRobotAssistant() {
        const robotToggle = document.getElementById('robotToggle');
        const robotChat = document.getElementById('robotChat');
        const chatClose = document.getElementById('chatClose');
        const sendMessage = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');

        if (robotToggle && robotChat) {
            robotToggle.addEventListener('click', () => {
                robotChat.classList.toggle('active');
                this.playSound('notification');
            });
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => {
                robotChat.classList.remove('active');
            });
        }

        if (sendMessage && chatInput) {
            sendMessage.addEventListener('click', () => this.handleRobotMessage());
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleRobotMessage();
                }
            });
        }
    }

    handleRobotMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();

        if (message) {
            this.addMessageToChat('user', message);
            chatInput.value = '';

            // Simulate AI response
            setTimeout(() => {
                const response = this.generateAIResponse(message);
                this.addMessageToChat('bot', response);
                this.speakText(response);
            }, 1000);
        }
    }

    addMessageToChat(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');

        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <span class="message-time">${timeString}</span>
        `;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Context-based responses
        if (lowerMessage.includes('siswa') || lowerMessage.includes('murid')) {
            return "Kelas 7F memiliki 32 siswa aktif. Anda bisa melihat daftar lengkapnya di halaman Kelas 7F.";
        } else if (lowerMessage.includes('guru') || lowerMessage.includes('pembimbing')) {
            return "Wali kelas 7F adalah Bu Sari Indah, S.Pd. Ada total 5 guru yang mengajar di kelas 7F.";
        } else if (lowerMessage.includes('jadwal') || lowerMessage.includes('pelajaran')) {
            return "Jadwal pelajaran kelas 7F tersedia di halaman Kelas 7F. Senin sampai Jumat, mulai jam 07:00 - 13:30.";
        } else if (lowerMessage.includes('tugas') || lowerMessage.includes('pr')) {
            return "Saat ini ada 5 tugas yang harus diselesaikan. Cek di dashboard untuk detail lebih lanjut.";
        } else if (lowerMessage.includes('nilai') || lowerMessage.includes('rapor')) {
            return "Nilai terbaru akan diumumkan minggu depan. Pastikan semua tugas sudah diselesaikan!";
        } else if (lowerMessage.includes('profile') || lowerMessage.includes('akun')) {
            return "Anda bisa mengatur profile dan pengaturan akun di halaman Profile.";
        } else if (lowerMessage.includes('baterai') || lowerMessage.includes('battery')) {
            return `Status baterai sistem: ${document.getElementById('batteryLevel')?.textContent || '75%'}`;
        } else if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('hi')) {
            return "Halo! Saya AI Assistant. Ada yang bisa saya bantu?";
        } else {
            return "Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang siswa, guru, jadwal, atau tugas.";
        }
    }

    speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            // Play notification sound before speaking
            this.playSound('notification');
            
            setTimeout(() => {
                speechSynthesis.speak(utterance);
            }, 500);
        }
    }

    playSound(type) {
        // Simple sound effects using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            if (type === 'click') {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                
            } else if (type === 'notification') {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
                
            } else if (type === 'success') {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(700, audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(900, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            }
        } catch (error) {
            console.log('Audio error:', error);
        }
    }

    simulateSystemInfo() {
        // Update battery level
        setInterval(() => {
            const batteryLevel = document.getElementById('batteryLevel');
            const batteryPercent = document.getElementById('batteryPercent');
            const profileBattery = document.getElementById('profileBattery');
            
            if (batteryLevel || batteryPercent || profileBattery) {
                const level = Math.floor(Math.random() * 20) + 70; // 70-90%
                const levelText = `${level}%`;
                
                if (batteryLevel) batteryLevel.textContent = levelText;
                if (batteryPercent) batteryPercent.textContent = levelText;
                if (profileBattery) profileBattery.textContent = levelText;
            }
        }, 10000);

        // Update IP address
        setInterval(() => {
            const ipAddress = document.getElementById('ipAddress');
            const profileIP = document.getElementById('profileIP');
            
            if (ipAddress || profileIP) {
                const ips = ['192.168.1.105', '192.168.1.110', '192.168.1.115'];
                const randomIP = ips[Math.floor(Math.random() * ips.length)];
                
                if (ipAddress) ipAddress.textContent = randomIP;
                if (profileIP) profileIP.textContent = randomIP;
            }
        }, 15000);
    }

    checkAuth() {
        // Check authentication status
        if (window.authSystem) {
            // If on login page and already logged in, redirect to dashboard
            if (window.location.pathname.includes('index.html') && authSystem.isLoggedIn) {
                window.location.href = 'dashboard.html';
            }
            
            // If on protected page and not logged in, redirect to login
            const protectedPages = ['dashboard.html', 'profile.html', 'class-7f.html'];
            const currentPage = window.location.pathname.split('/').pop();
            
            if (protectedPages.includes(currentPage) && !authSystem.isLoggedIn) {
                window.location.href = 'index.html';
            }
            
            // Update UI if logged in
            if (authSystem.isLoggedIn) {
                authSystem.updateUI();
            }
        }
    }
}

// Initialize main app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mainApp = new MainApp();
});

// Utility functions
const utils = {
    formatDate(date) {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatTime(date) {
        return new Date(date).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    generateAvatar(name, size = 100) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=4361ee&color=fff`;
    }
};

// Make utils available globally
window.utils = utils;
