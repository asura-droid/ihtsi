// Authentication and Admin Management System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.adminPassword = localStorage.getItem('adminPassword') || 'MANDEMS SKIES';
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.admins = JSON.parse(localStorage.getItem('admins')) || ['admin'];
        this.actionLog = JSON.parse(localStorage.getItem('actionLog')) || [];
        
        this.initializeDefaultUsers();
    }

    initializeDefaultUsers() {
        if (this.users.length === 0) {
            this.users = [
                { id: 1, username: 'admin', email: 'admin@ihtsip.com', role: 'admin', created: new Date().toISOString() },
                { id: 2, username: 'sarah_johnson', email: 'sarah@example.com', role: 'user', created: new Date().toISOString() },
                { id: 3, username: 'michael_chen', email: 'michael@example.com', role: 'user', created: new Date().toISOString() },
                { id: 4, username: 'anna_thompson', email: 'anna@example.com', role: 'user', created: new Date().toISOString() },
                { id: 5, username: 'james_wilson', email: 'james@example.com', role: 'user', created: new Date().toISOString() },
                { id: 6, username: 'patricia_lee', email: 'patricia@example.com', role: 'user', created: new Date().toISOString() }
            ];
            this.saveUsers();
        }
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username);
        if (user) {
            this.currentUser = user;
            this.isAdmin = user.role === 'admin';
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.logAction('login', `User ${username} logged in`);
            return true;
        }
        return false;
    }

    verifyAdminPassword(password) {
        if (password === this.adminPassword) {
            this.logAction('admin_access', `Admin panel accessed by ${this.currentUser?.username}`);
            return true;
        }
        return false;
    }

    changeAdminPassword(newPassword) {
        if (this.isAdmin) {
            this.adminPassword = newPassword;
            localStorage.setItem('adminPassword', newPassword);
            this.logAction('password_change', `Admin password changed by ${this.currentUser?.username}`);
            return true;
        }
        return false;
    }

    appointAdmin(userId) {
        if (this.isAdmin) {
            const user = this.users.find(u => u.id === userId);
            if (user) {
                user.role = 'admin';
                this.saveUsers();
                this.logAction('admin_appointment', `User ${user.username} appointed as admin by ${this.currentUser?.username}`);
                return true;
            }
        }
        return false;
    }

    removeAdmin(userId) {
        if (this.isAdmin) {
            const user = this.users.find(u => u.id === userId);
            if (user && user.username !== 'admin') { // Protect main admin
                user.role = 'user';
                this.saveUsers();
                this.logAction('admin_removal', `User ${user.username} removed from admin by ${this.currentUser?.username}`);
                return true;
            }
        }
        return false;
    }

    deleteUser(userId) {
        if (this.isAdmin) {
            const userIndex = this.users.findIndex(u => u.id === userId);
            if (userIndex !== -1 && this.users[userIndex].username !== 'admin') {
                const deletedUser = this.users.splice(userIndex, 1)[0];
                this.saveUsers();
                this.logAction('user_deletion', `User ${deletedUser.username} deleted by ${this.currentUser?.username}`);
                return true;
            }
        }
        return false;
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    logAction(action, description) {
        this.actionLog.push({
            timestamp: new Date().toISOString(),
            action,
            description,
            user: this.currentUser?.username || 'system'
        });
        localStorage.setItem('actionLog', JSON.stringify(this.actionLog));
    }

    logout() {
        this.logAction('logout', `User ${this.currentUser?.username} logged out`);
        this.currentUser = null;
        this.isAdmin = false;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
                this.isAdmin = this.currentUser.role === 'admin';
            }
        }
        return this.currentUser;
    }
}

// Global auth manager instance
window.authManager = new AuthManager();