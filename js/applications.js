// Application Management System
class ApplicationManager {
    constructor() {
        this.applications = JSON.parse(localStorage.getItem('applications')) || [];
        this.initializeDefaultApplications();
    }

    initializeDefaultApplications() {
        if (this.applications.length === 0) {
            this.applications = [
                {
                    id: 1,
                    applicantName: 'Sarah Johnson',
                    program: 'CGHS Program',
                    submissionDate: '2023-03-18',
                    status: 'Under Review',
                    priority: 'High',
                    email: 'sarah@example.com',
                    phone: '+1-555-0123',
                    documents: ['resume.pdf', 'cover_letter.pdf'],
                    notes: 'Strong candidate with relevant experience'
                },
                {
                    id: 2,
                    applicantName: 'Michael Chen',
                    program: 'Mental Health Certification',
                    submissionDate: '2023-03-15',
                    status: 'Approved',
                    priority: 'Medium',
                    email: 'michael@example.com',
                    phone: '+1-555-0124',
                    documents: ['application.pdf', 'transcript.pdf'],
                    notes: 'Application approved, awaiting payment'
                },
                {
                    id: 3,
                    applicantName: 'Anna Thompson',
                    program: 'Crisis Intervention Training',
                    submissionDate: '2023-03-12',
                    status: 'Pending',
                    priority: 'Low',
                    email: 'anna@example.com',
                    phone: '+1-555-0125',
                    documents: ['application.pdf'],
                    notes: 'Waiting for additional documentation'
                },
                {
                    id: 4,
                    applicantName: 'James Wilson',
                    program: 'Advanced Therapy Techniques',
                    submissionDate: '2023-03-10',
                    status: 'Under Review',
                    priority: 'High',
                    email: 'james@example.com',
                    phone: '+1-555-0126',
                    documents: ['resume.pdf', 'portfolio.pdf', 'references.pdf'],
                    notes: 'Experienced professional seeking advanced certification'
                },
                {
                    id: 5,
                    applicantName: 'Patricia Lee',
                    program: 'Basic Counseling Skills',
                    submissionDate: '2023-03-08',
                    status: 'Rejected',
                    priority: 'Low',
                    email: 'patricia@example.com',
                    phone: '+1-555-0127',
                    documents: ['application.pdf'],
                    notes: 'Did not meet minimum requirements'
                }
            ];
            this.saveApplications();
        }
    }

    updateApplicationStatus(applicationId, newStatus, notes = '') {
        const application = this.applications.find(app => app.id === applicationId);
        if (application) {
            const oldStatus = application.status;
            application.status = newStatus;
            if (notes) {
                application.notes = notes;
            }
            application.lastUpdated = new Date().toISOString();
            
            this.saveApplications();
            window.authManager.logAction('application_update', 
                `Application ${applicationId} (${application.applicantName}) status changed from ${oldStatus} to ${newStatus}`);
            return true;
        }
        return false;
    }

    deleteApplication(applicationId) {
        const applicationIndex = this.applications.findIndex(app => app.id === applicationId);
        if (applicationIndex !== -1) {
            const application = this.applications[applicationIndex];
            this.applications.splice(applicationIndex, 1);
            this.saveApplications();
            window.authManager.logAction('application_deletion', 
                `Application ${applicationId} (${application.applicantName}) deleted`);
            return true;
        }
        return false;
    }

    getApplications() {
        return this.applications;
    }

    getApplicationById(id) {
        return this.applications.find(app => app.id === id);
    }

    saveApplications() {
        localStorage.setItem('applications', JSON.stringify(this.applications));
    }
}

// Global application manager instance
window.applicationManager = new ApplicationManager();