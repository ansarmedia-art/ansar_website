// Admin Panel Application
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { 
    getAuth, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Initialize Firebase (config loaded from firebase-init.js)
let db, auth;

// Wait for config to be available
window.addEventListener('load', () => {
    if (window.firebaseConfig) {
        const app = initializeApp(window.firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        
        // Check auth state
        onAuthStateChanged(auth, (user) => {
            if (user) {
                initializeAdmin();
            } else {
                redirectToLogin();
            }
        });
    }
});

function redirectToLogin() {
    window.location.href = 'index.html';
}

function initializeAdmin() {
    setupEventListeners();
    loadDashboard();
}

function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchPanel(e.target.dataset.panel);
        });
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        signOut(auth).then(() => {
            redirectToLogin();
        });
    });

    // Add buttons
    document.getElementById('addPageBtn').addEventListener('click', () => {
        showPageForm();
    });
    document.getElementById('addNewsBtn').addEventListener('click', () => {
        showNewsForm();
    });
    document.getElementById('addEventBtn').addEventListener('click', () => {
        showEventForm();
    });
    document.getElementById('addGalleryBtn').addEventListener('click', () => {
        showGalleryForm();
    });
}

function switchPanel(panelName) {
    // Hide all panels
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // Show selected panel
    document.getElementById(panelName).classList.add('active');
    event.target.classList.add('active');
    
    // Load panel content
    switch(panelName) {
        case 'pages':
            loadPages();
            break;
        case 'news':
            loadNews();
            break;
        case 'events':
            loadEvents();
            break;
        case 'gallery':
            loadGallery();
            break;
        case 'settings':
            loadSettings();
            break;
        case 'dashboard':
            loadDashboard();
            break;
    }
}

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        const pagesSnapshot = await getDocs(collection(db, 'pages'));
        const newsSnapshot = await getDocs(collection(db, 'news'));
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        
        const statsHtml = `
            <div class="stat-card">
                <h3>Total Pages</h3>
                <div class="number">${pagesSnapshot.size}</div>
            </div>
            <div class="stat-card">
                <h3>News Articles</h3>
                <div class="number">${newsSnapshot.size}</div>
            </div>
            <div class="stat-card">
                <h3>Events</h3>
                <div class="number">${eventsSnapshot.size}</div>
            </div>
        `;
        
        document.getElementById('statsGrid').innerHTML = statsHtml;
        
        const recentItems = `
            <div class="form-group" style="background: #e8f4f8; border-left: 4px solid #3498db;">
                <h3>Quick Actions</h3>
                <p>Use the menu on the left to manage:</p>
                <ul style="margin-left: 20px; margin-top: 10px;">
                    <li>Pages - Edit main website pages</li>
                    <li>News - Add/edit news articles</li>
                    <li>Events - Manage school events</li>
                    <li>Gallery - Add images and galleries</li>
                    <li>Settings - Configure website settings</li>
                </ul>
            </div>
        `;
        
        document.getElementById('dashboardContent').innerHTML = recentItems;
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Error loading dashboard', 'error');
    }
}

// ===== PAGES MANAGEMENT =====
async function loadPages() {
    try {
        const snapshot = await getDocs(collection(db, 'pages'));
        let html = '<div class="items-list">';
        
        if (snapshot.empty) {
            html += '<p>No pages yet. Click "+ Add Page" to create one.</p>';
        } else {
            snapshot.forEach(docSnapshot => {
                const data = docSnapshot.data();
                html += `
                    <div class="item-card">
                        <div class="item-content">
                            <h3>${data.title}</h3>
                            <p>Slug: ${data.slug}</p>
                            <p>${data.subtitle || 'No subtitle'}</p>
                        </div>
                        <div class="item-actions">
                            <button class="btn-primary" onclick="editPage('${docSnapshot.id}')">Edit</button>
                            <button class="btn-danger" onclick="deletePage('${docSnapshot.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        }
        html += '</div>';
        document.getElementById('pagesList').innerHTML = html;
    } catch (error) {
        console.error('Error loading pages:', error);
        showAlert('Error loading pages', 'error');
    }
}

function showPageForm(docId = null) {
    let formHtml = `
        <form id="pageForm" onsubmit="savePage(event, '${docId || ''}')">
            <div class="form-group">
                <label>Page Title *</label>
                <input type="text" name="title" required placeholder="Page Title">
            </div>
            <div class="form-group">
                <label>Page Slug *</label>
                <input type="text" name="slug" required placeholder="about-us">
            </div>
            <div class="form-group">
                <label>Subtitle</label>
                <input type="text" name="subtitle" placeholder="Page subtitle">
            </div>
            <div class="form-group">
                <label>Hero Image URL</label>
                <input type="url" name="heroImage" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
                <label>Page Content</label>
                <textarea name="content" placeholder="Enter page content (HTML allowed)"></textarea>
            </div>
            <div class="form-group">
                <label>Meta Description (SEO)</label>
                <textarea name="metaDescription" placeholder="Brief description for search engines"></textarea>
            </div>
            <div class="form-group">
                <label>Keywords (SEO)</label>
                <input type="text" name="keywords" placeholder="keyword1, keyword2, keyword3">
            </div>
            <div class="button-group">
                <button type="submit" class="btn-success">Save Page</button>
                <button type="button" class="btn-secondary" onclick="cancelForm()">Cancel</button>
            </div>
        </form>
    `;
    
    if (docId) {
        // Load existing page data
        doc(db, 'pages', docId).then(docSnapshot => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                // Populate form fields
                setTimeout(() => {
                    document.querySelector('input[name="title"]').value = data.title;
                    document.querySelector('input[name="slug"]').value = data.slug;
                    document.querySelector('input[name="subtitle"]').value = data.subtitle || '';
                    document.querySelector('input[name="heroImage"]').value = data.heroImage || '';
                    document.querySelector('textarea[name="content"]').value = data.content || '';
                    document.querySelector('textarea[name="metaDescription"]').value = data.metaDescription || '';
                    document.querySelector('input[name="keywords"]').value = data.keywords || '';
                }, 0);
            }
        });
    }
    
    document.getElementById('pagesList').innerHTML = formHtml;
}

async function savePage(event, docId) {
    event.preventDefault();
    const form = event.target;
    
    const pageData = {
        title: form.title.value,
        slug: form.slug.value,
        subtitle: form.subtitle.value,
        heroImage: form.heroImage.value,
        content: form.content.value,
        metaDescription: form.metaDescription.value,
        keywords: form.keywords.value,
        updatedAt: new Date()
    };
    
    try {
        if (docId) {
            await updateDoc(doc(db, 'pages', docId), pageData);
            showAlert('Page updated successfully', 'success');
        } else {
            await addDoc(collection(db, 'pages'), {
                ...pageData,
                createdAt: new Date()
            });
            showAlert('Page created successfully', 'success');
        }
        loadPages();
    } catch (error) {
        console.error('Error saving page:', error);
        showAlert('Error saving page', 'error');
    }
}

async function deletePage(docId) {
    if (confirm('Are you sure you want to delete this page?')) {
        try {
            await deleteDoc(doc(db, 'pages', docId));
            showAlert('Page deleted', 'success');
            loadPages();
        } catch (error) {
            console.error('Error deleting page:', error);
            showAlert('Error deleting page', 'error');
        }
    }
}

// Make functions global
window.editPage = async (docId) => {
    showPageForm(docId);
};

window.deletePage = deletePage;
window.savePage = savePage;

// ===== NEWS MANAGEMENT =====
async function loadNews() {
    try {
        const snapshot = await getDocs(collection(db, 'news'));
        let html = '<div class="items-list">';
        
        if (snapshot.empty) {
            html += '<p>No news articles yet. Click "+ Add News" to create one.</p>';
        } else {
            snapshot.forEach(docSnapshot => {
                const data = docSnapshot.data();
                const date = data.date ? new Date(data.date).toLocaleDateString() : 'No date';
                html += `
                    <div class="item-card">
                        <div class="item-content">
                            <h3>${data.title}</h3>
                            <p>Date: ${date}</p>
                            <p>${(data.excerpt || data.content || '').substring(0, 100)}...</p>
                        </div>
                        <div class="item-actions">
                            <button class="btn-primary" onclick="editNews('${docSnapshot.id}')">Edit</button>
                            <button class="btn-danger" onclick="deleteNews('${docSnapshot.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        }
        html += '</div>';
        document.getElementById('newsList').innerHTML = html;
    } catch (error) {
        console.error('Error loading news:', error);
        showAlert('Error loading news', 'error');
    }
}

function showNewsForm(docId = null) {
    let formHtml = `
        <form id="newsForm" onsubmit="saveNews(event, '${docId || ''}')">
            <div class="form-group">
                <label>Title *</label>
                <input type="text" name="title" required placeholder="News Title">
            </div>
            <div class="form-group">
                <label>Date *</label>
                <input type="date" name="date" required>
            </div>
            <div class="form-group">
                <label>Excerpt/Summary</label>
                <textarea name="excerpt" placeholder="Brief summary of the news"></textarea>
            </div>
            <div class="form-group">
                <label>Featured Image URL</label>
                <input type="url" name="image" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
                <label>Full Content</label>
                <textarea name="content" placeholder="Full news content"></textarea>
            </div>
            <div class="form-group">
                <label>Author</label>
                <input type="text" name="author" placeholder="Author name">
            </div>
            <div class="button-group">
                <button type="submit" class="btn-success">Save News</button>
                <button type="button" class="btn-secondary" onclick="cancelForm()">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('newsList').innerHTML = formHtml;
}

async function saveNews(event, docId) {
    event.preventDefault();
    const form = event.target;
    
    const newsData = {
        title: form.title.value,
        date: form.date.value,
        excerpt: form.excerpt.value,
        image: form.image.value,
        content: form.content.value,
        author: form.author.value,
        updatedAt: new Date()
    };
    
    try {
        if (docId) {
            await updateDoc(doc(db, 'news', docId), newsData);
            showAlert('News updated successfully', 'success');
        } else {
            await addDoc(collection(db, 'news'), {
                ...newsData,
                createdAt: new Date()
            });
            showAlert('News created successfully', 'success');
        }
        loadNews();
    } catch (error) {
        console.error('Error saving news:', error);
        showAlert('Error saving news', 'error');
    }
}

async function deleteNews(docId) {
    if (confirm('Are you sure you want to delete this news?')) {
        try {
            await deleteDoc(doc(db, 'news', docId));
            showAlert('News deleted', 'success');
            loadNews();
        } catch (error) {
            console.error('Error deleting news:', error);
            showAlert('Error deleting news', 'error');
        }
    }
}

window.editNews = (docId) => showNewsForm(docId);
window.deleteNews = deleteNews;
window.saveNews = saveNews;

// ===== EVENTS MANAGEMENT =====
async function loadEvents() {
    try {
        const snapshot = await getDocs(collection(db, 'events'));
        let html = '<div class="items-list">';
        
        if (snapshot.empty) {
            html += '<p>No events yet. Click "+ Add Event" to create one.</p>';
        } else {
            snapshot.forEach(docSnapshot => {
                const data = docSnapshot.data();
                const date = data.date ? new Date(data.date).toLocaleDateString() : 'No date';
                html += `
                    <div class="item-card">
                        <div class="item-content">
                            <h3>${data.title}</h3>
                            <p>Date: ${date}</p>
                            <p>${data.description || 'No description'}</p>
                        </div>
                        <div class="item-actions">
                            <button class="btn-primary" onclick="editEvent('${docSnapshot.id}')">Edit</button>
                            <button class="btn-danger" onclick="deleteEvent('${docSnapshot.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        }
        html += '</div>';
        document.getElementById('eventsList').innerHTML = html;
    } catch (error) {
        console.error('Error loading events:', error);
        showAlert('Error loading events', 'error');
    }
}

function showEventForm(docId = null) {
    let formHtml = `
        <form id="eventForm" onsubmit="saveEvent(event, '${docId || ''}')">
            <div class="form-group">
                <label>Event Title *</label>
                <input type="text" name="title" required placeholder="Event Title">
            </div>
            <div class="form-group">
                <label>Date *</label>
                <input type="date" name="date" required>
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" name="time" placeholder="Event time">
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" name="location" placeholder="Event location">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" placeholder="Event description"></textarea>
            </div>
            <div class="form-group">
                <label>Featured Image URL</label>
                <input type="url" name="image" placeholder="https://example.com/image.jpg">
            </div>
            <div class="button-group">
                <button type="submit" class="btn-success">Save Event</button>
                <button type="button" class="btn-secondary" onclick="cancelForm()">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('eventsList').innerHTML = formHtml;
}

async function saveEvent(event, docId) {
    event.preventDefault();
    const form = event.target;
    
    const eventData = {
        title: form.title.value,
        date: form.date.value,
        time: form.time.value,
        location: form.location.value,
        description: form.description.value,
        image: form.image.value,
        updatedAt: new Date()
    };
    
    try {
        if (docId) {
            await updateDoc(doc(db, 'events', docId), eventData);
            showAlert('Event updated successfully', 'success');
        } else {
            await addDoc(collection(db, 'events'), {
                ...eventData,
                createdAt: new Date()
            });
            showAlert('Event created successfully', 'success');
        }
        loadEvents();
    } catch (error) {
        console.error('Error saving event:', error);
        showAlert('Error saving event', 'error');
    }
}

async function deleteEvent(docId) {
    if (confirm('Are you sure you want to delete this event?')) {
        try {
            await deleteDoc(doc(db, 'events', docId));
            showAlert('Event deleted', 'success');
            loadEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            showAlert('Error deleting event', 'error');
        }
    }
}

window.editEvent = (docId) => showEventForm(docId);
window.deleteEvent = deleteEvent;
window.saveEvent = saveEvent;

// ===== GALLERY MANAGEMENT =====
async function loadGallery() {
    try {
        const snapshot = await getDocs(collection(db, 'gallery'));
        let html = '<div class="items-list">';
        
        if (snapshot.empty) {
            html += '<p>No gallery items yet. Click "+ Add Gallery Item" to create one.</p>';
        } else {
            snapshot.forEach(docSnapshot => {
                const data = docSnapshot.data();
                html += `
                    <div class="item-card">
                        <div class="item-content">
                            <h3>${data.title}</h3>
                            <p>Category: ${data.category || 'Uncategorized'}</p>
                            ${data.imageUrl ? `<img src="${data.imageUrl}" class="image-preview" alt="${data.title}">` : ''}
                        </div>
                        <div class="item-actions">
                            <button class="btn-primary" onclick="editGallery('${docSnapshot.id}')">Edit</button>
                            <button class="btn-danger" onclick="deleteGallery('${docSnapshot.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        }
        html += '</div>';
        document.getElementById('galleryList').innerHTML = html;
    } catch (error) {
        console.error('Error loading gallery:', error);
        showAlert('Error loading gallery', 'error');
    }
}

function showGalleryForm(docId = null) {
    let formHtml = `
        <form id="galleryForm" onsubmit="saveGallery(event, '${docId || ''}')">
            <div class="form-group">
                <label>Title *</label>
                <input type="text" name="title" required placeholder="Gallery Item Title">
            </div>
            <div class="form-group">
                <label>Category</label>
                <input type="text" name="category" placeholder="e.g., Events, Sports, Academics">
            </div>
            <div class="form-group">
                <label>Image URL *</label>
                <input type="url" name="imageUrl" required placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" placeholder="Image description"></textarea>
            </div>
            <div class="button-group">
                <button type="submit" class="btn-success">Save Item</button>
                <button type="button" class="btn-secondary" onclick="cancelForm()">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('galleryList').innerHTML = formHtml;
}

async function saveGallery(event, docId) {
    event.preventDefault();
    const form = event.target;
    
    const galleryData = {
        title: form.title.value,
        category: form.category.value,
        imageUrl: form.imageUrl.value,
        description: form.description.value,
        updatedAt: new Date()
    };
    
    try {
        if (docId) {
            await updateDoc(doc(db, 'gallery', docId), galleryData);
            showAlert('Gallery item updated successfully', 'success');
        } else {
            await addDoc(collection(db, 'gallery'), {
                ...galleryData,
                createdAt: new Date()
            });
            showAlert('Gallery item created successfully', 'success');
        }
        loadGallery();
    } catch (error) {
        console.error('Error saving gallery:', error);
        showAlert('Error saving gallery', 'error');
    }
}

async function deleteGallery(docId) {
    if (confirm('Are you sure you want to delete this gallery item?')) {
        try {
            await deleteDoc(doc(db, 'gallery', docId));
            showAlert('Gallery item deleted', 'success');
            loadGallery();
        } catch (error) {
            console.error('Error deleting gallery:', error);
            showAlert('Error deleting gallery', 'error');
        }
    }
}

window.editGallery = (docId) => showGalleryForm(docId);
window.deleteGallery = deleteGallery;
window.saveGallery = saveGallery;

// ===== SETTINGS =====
async function loadSettings() {
    try {
        const snapshot = await getDocs(collection(db, 'settings'));
        let settings = {};
        
        snapshot.forEach(docSnapshot => {
            settings[docSnapshot.id] = docSnapshot.data();
        });
        
        let formHtml = `
            <form id="settingsForm" onsubmit="saveSettings(event)">
                <div class="form-group">
                    <label>School Name</label>
                    <input type="text" name="schoolName" placeholder="Ansar English School" value="${settings.general?.schoolName || ''}">
                </div>
                <div class="form-group">
                    <label>School Email</label>
                    <input type="email" name="email" placeholder="info@ansarschool.in" value="${settings.general?.email || ''}">
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" placeholder="+91..." value="${settings.general?.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <textarea name="address" placeholder="School address">${settings.general?.address || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Logo URL</label>
                    <input type="url" name="logoUrl" placeholder="https://example.com/logo.png" value="${settings.general?.logoUrl || ''}">
                </div>
                <div class="form-group">
                    <label>Site Meta Description (SEO)</label>
                    <textarea name="siteDescription" placeholder="Website meta description">${settings.seo?.siteDescription || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Site Keywords (SEO)</label>
                    <input type="text" name="siteKeywords" placeholder="keyword1, keyword2" value="${settings.seo?.siteKeywords || ''}">
                </div>
                <div class="button-group">
                    <button type="submit" class="btn-success">Save Settings</button>
                </div>
            </form>
        `;
        
        document.getElementById('settingsContent').innerHTML = formHtml;
    } catch (error) {
        console.error('Error loading settings:', error);
        showAlert('Error loading settings', 'error');
    }
}

async function saveSettings(event) {
    event.preventDefault();
    const form = event.target;
    
    const generalData = {
        schoolName: form.schoolName.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value,
        logoUrl: form.logoUrl.value,
        updatedAt: new Date()
    };
    
    const seoData = {
        siteDescription: form.siteDescription.value,
        siteKeywords: form.siteKeywords.value,
        updatedAt: new Date()
    };
    
    try {
        await updateDoc(doc(db, 'settings', 'general'), generalData);
        await updateDoc(doc(db, 'settings', 'seo'), seoData);
        showAlert('Settings saved successfully', 'success');
    } catch (error) {
        console.error('Error saving settings:', error);
        showAlert('Error saving settings', 'error');
    }
}

window.saveSettings = saveSettings;

// ===== UTILITY FUNCTIONS =====
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function cancelForm() {
    const currentPanel = document.querySelector('.panel.active').id;
    switch(currentPanel) {
        case 'pages':
            loadPages();
            break;
        case 'news':
            loadNews();
            break;
        case 'events':
            loadEvents();
            break;
        case 'gallery':
            loadGallery();
            break;
    }
}

window.cancelForm = cancelForm;
