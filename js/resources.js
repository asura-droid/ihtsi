// Resource Management System
class ResourceManager {
    constructor() {
        this.resources = JSON.parse(localStorage.getItem('resources')) || [];
        this.initializeDefaultResources();
    }

    initializeDefaultResources() {
        if (this.resources.length === 0) {
            this.resources = [
                {
                    id: 1,
                    title: 'Introduction to Mental Health',
                    description: 'Basic guide to understanding mental health concepts',
                    type: 'PDF',
                    category: 'Education',
                    isPremium: false,
                    downloadUrl: '#',
                    uploadedBy: 'admin',
                    uploadDate: new Date().toISOString(),
                    approved: true
                },
                {
                    id: 2,
                    title: 'Advanced Therapy Techniques',
                    description: 'Professional techniques for therapy sessions',
                    type: 'Video',
                    category: 'Professional',
                    isPremium: true,
                    downloadUrl: '#',
                    uploadedBy: 'admin',
                    uploadDate: new Date().toISOString(),
                    approved: true
                },
                {
                    id: 3,
                    title: 'Crisis Intervention Handbook',
                    description: 'Emergency response protocols and procedures',
                    type: 'PDF',
                    category: 'Emergency',
                    isPremium: true,
                    downloadUrl: '#',
                    uploadedBy: 'admin',
                    uploadDate: new Date().toISOString(),
                    approved: true
                }
            ];
            this.saveResources();
        }
    }

    addResource(resourceData) {
        const newResource = {
            id: Date.now(),
            ...resourceData,
            uploadedBy: window.authManager.currentUser?.username || 'unknown',
            uploadDate: new Date().toISOString(),
            approved: false
        };
        
        this.resources.push(newResource);
        this.saveResources();
        
        window.authManager.logAction('resource_upload', `Resource "${newResource.title}" uploaded`);
        
        // Auto-update resource library if on index page
        if (typeof updateResourceLibrary === 'function') {
            updateResourceLibrary();
        }
        
        return newResource;
    }

    approveResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (resource) {
            resource.approved = true;
            this.saveResources();
            window.authManager.logAction('resource_approval', `Resource "${resource.title}" approved`);
            
            if (typeof updateResourceLibrary === 'function') {
                updateResourceLibrary();
            }
            return true;
        }
        return false;
    }

    rejectResource(resourceId) {
        const resourceIndex = this.resources.findIndex(r => r.id === resourceId);
        if (resourceIndex !== -1) {
            const resource = this.resources[resourceIndex];
            window.authManager.logAction('resource_rejection', `Resource "${resource.title}" rejected and removed`);
            this.resources.splice(resourceIndex, 1);
            this.saveResources();
            
            if (typeof updateResourceLibrary === 'function') {
                updateResourceLibrary();
            }
            return true;
        }
        return false;
    }

    deleteResource(resourceId) {
        const resourceIndex = this.resources.findIndex(r => r.id === resourceId);
        if (resourceIndex !== -1) {
            const resource = this.resources[resourceIndex];
            window.authManager.logAction('resource_deletion', `Resource "${resource.title}" deleted`);
            this.resources.splice(resourceIndex, 1);
            this.saveResources();
            
            if (typeof updateResourceLibrary === 'function') {
                updateResourceLibrary();
            }
            return true;
        }
        return false;
    }

    getApprovedResources() {
        return this.resources.filter(r => r.approved);
    }

    getAllResources() {
        return this.resources;
    }

    canDownload(resourceId, user) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource || !resource.approved) return false;
        
        if (!resource.isPremium) return true;
        
        // Check if user has premium access (simplified - could be expanded)
        return user && (user.role === 'admin' || user.hasPremium);
    }

    saveResources() {
        localStorage.setItem('resources', JSON.stringify(this.resources));
    }
}

// Global resource manager instance
window.resourceManager = new ResourceManager();