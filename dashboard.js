// Simple dashboard interactions (reverted to lightweight version)

// Fill navbar username and greeting
document.addEventListener('DOMContentLoaded', () => {
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';
    const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : 'Guest User';
    const nameDisplay = document.querySelector('.username-display');
    const greetingName = document.getElementById('dashboard-greeting-name');
    const avatarImg = document.querySelector('.avatar-img');
    if (nameDisplay) nameDisplay.textContent = fullName;
    if (greetingName) greetingName.textContent = fullName;
    const savedAvatar = localStorage.getItem('userAvatarDataUrl');
    if (avatarImg && savedAvatar) avatarImg.src = savedAvatar;
});

// Sidebar tab switching
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const tabContents = document.querySelectorAll('.tab-content');
    const allNavItems = document.querySelectorAll('.nav-list-item[data-tab-target]');

    function hideAllTabContents() {
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
            content.style.opacity = '0';
            content.style.visibility = 'hidden';
        });
    }
    
    function showTabContent(tabId) {
        // Try direct id match (e.g., 'dashboard')
        let selectedTab = document.getElementById(tabId);
        // Fallback to id with '-content' suffix (e.g., 'explore-content')
        if (!selectedTab) selectedTab = document.getElementById(`${tabId}-content`);
        // Fallback to data attribute (e.g., data-tab-id="explore")
        if (!selectedTab) selectedTab = document.querySelector(`.tab-content[data-tab-id="${tabId}"]`);
        if (selectedTab) {
            hideAllTabContents();
            selectedTab.classList.add('active');
            selectedTab.style.display = 'block';
            selectedTab.style.opacity = '1';
            selectedTab.style.visibility = 'visible';
        }
    }
    
    function deactivateAllNavItems() {
        allNavItems.forEach(navItem => navItem.classList.remove('active'));
    }
    
    // Initial state
    hideAllTabContents();
    showTabContent('dashboard');
    const defaultNav = document.querySelector('.nav-list-item[data-tab-target="dashboard"]');
    if (defaultNav) defaultNav.classList.add('active');

    // Toggle sidebar button
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('hidden');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }

    // Event delegation for tab switching
    if (sidebar) {
        sidebar.addEventListener('click', function(event) {
            const navItem = event.target.closest('.nav-list-item[data-tab-target]');
            if (!navItem) return;
                const tabId = navItem.dataset.tabTarget;
            if (!tabId) return;
                    deactivateAllNavItems();
                    navItem.classList.add('active');
                    showTabContent(tabId);
            if (window.innerWidth <= 768) sidebar.classList.remove('hidden');
        });
    }
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Dữ liệu giả định cho các chủ đề học
const exploreTopics = {
    'metaverse': {
        name: 'Metaverse',
        description: 'A metaverse is a virtual world in which users interact while represented by avatars, typically in a 3D display, with the experience focused on social and economic connection.',
        modules: [
            { name: "Module 1: Intro: What is Metaverse?", lessons: [
                { title: "Video 1: What is Metaverse?", url: "https://youtu.be/jFUVZDPrB7U?si=cR2M_WwLMClG64gT" },
                { title: "Video 2: Another look at Metaverse", url: "https://www.youtube.com/watch?v=6dYVFSZcXb0" },
                { title: "Video 3: Metaverse Explained", url: "https://youtu.be/U8HQ5ihX9cE?si=zQ8n8YT5L5KgB_lq" },
                { title: "Video 4: The Metaverse Economy", url: "https://youtu.be/XLP4YTpUpBI?si=Ers1d7tGlmVYNDPV" }
            ]},
            { name: "Module 2: Industrial Metaverse", lessons: [
                { title: "Video 1: Cool things in Industrial Metaverse", url: "https://youtu.be/wAlcX7QaWkc?si=6_J3TgvM0BmTtwnD" },
                { title: "Video 2: Industrial Metaverse Applications", url: "https://youtu.be/gRHP2IiNXKo?si=nkJjDjuv18U52KmY" },
                { title: "Video 3: The Digital Twin", url: "https://youtu.be/IsQVAXRbDs4?si=_sC3RpyYB28x3rql" },
                { title: "Video 4: Industrial Metaverse Use Cases", url: "https://youtu.be/KGDWtPeMpDs?si=nSSEtq6OfpEyoMxd" }
            ]},
            { name: "Module 3: Applications", lessons: [
                { title: "Article 1: Metaverse Development", url: "https://metaversedevelopment.world/" },
                { title: "Video 1: Metaverse in Gaming", url: "https://youtu.be/GAkB98ewcjI?si=BqJPdQvWNb6kFsy9" },
                { title: "Video 2: Social VR", url: "https://youtu.be/jyoFmq9Ud04" },
                { title: "Video 3: Metaverse in Education", url: "https://youtu.be/2XTklBA8Rkk?si=kaiSnMGeL5S_pUlt" },
                { title: "Video 4: Metaverse in Art", url: "https://youtu.be/Ahi1WA2yfdw?si=g_0y2MPFEAGcwwp4" }
            ]},
            { name: "Module 4: Challenges", lessons: [
                { title: "Video 1: Challenges of the Metaverse", url: "https://youtu.be/RgJwPco3wew?si=7o9ksgJ4NJ94-3-f" },
                { title: "Video 2: Security in the Metaverse", url: "https://youtu.be/YunxhXF2-A0?si=i9r78PPLt1mBZ523" },
                { title: "Video 3: The Dark Side of the Metaverse", url: "https://youtu.be/zR0y0LTmzT0?si=AGqBes8wg_Bj_T0i" },
                { title: "Video 4: The Future of Metaverse", url: "https://youtu.be/zdxpZDP4Ddk?si=eZbQ3gdhwqk7TX8U" },
                { title: "Article 1: Metaverse Challenges", url: "https://hedera.com/learning/metaverse/metaverse-challenges" }
            ]},
            { name: "Module 5: Case Study: Apple", lessons: [
                { title: "Article 1: Apple Vision Pro", url: "https://www.apple.com/apple-vision-pro/" },
                { title: "PDF 1: Spatial Banking UX", url: "https://www.theuxda.com/storage/app/media/blog/PDF/Spatial-Banking-UX-design-for-Apple-Vision-Pro-by-UXDA.pdf" },
                { title: "Article 2: Apple Vision Pro for Business", url: "https://www.apple.com/newsroom/2024/04/apple-vision-pro-brings-a-new-era-of-spatial-computing-to-business/" },
                { title: "Video 1: A Look at Apple Vision Pro", url: "https://youtu.be/86Gy035z_KA?si=JF6e-M-VUJucY8HQ" }
            ]},
            { name: "Module 6: Case Study: Meta", lessons: [
                { title: "Video 1: Meta's Metaverse Vision", url: "https://youtu.be/uVEALvpoiMQ?si=ASmONNXE3VtGM--p" },
                { title: "Video 2: Inside Meta's AR/VR Labs", url: "https://youtu.be/afdnbXXbBTg?si=7_wDlj7a_PDIN3Qs" },
                { title: "Video 3: The Reality Labs", url: "https://youtu.be/KLOcj5qvOio?si=EZ30xO6t_LJWk9Xk" },
                { title: "Video 4: What is Meta's Horizon Worlds?", url: "https://youtu.be/BrNu2a9uhR0?si=Au69IcrpPt9H1mHW" }
            ]},
            { name: "Module 7: Case Study: Second Life", lessons: [
                { title: "Video 1: Intro to Second Life", url: "https://youtu.be/XQkYBbM9YyM?si=j46NVT1rXxOYdrzd" },
                { title: "Video 2: Second Life Today", url: "https://youtu.be/55emfRyqoTI?si=YA4Ucd2MRH169znS" },
                { title: "Video 3: The Community of Second Life", url: "https://youtu.be/rLSbHFOl29Q?si=wmmbSBlYX6FN61ge" }
            ]},
            { name: "Module 8: Case Study: Startups", lessons: [
                { title: "Video 1: Building a Metaverse Startup", url: "https://youtu.be/8Qfm4L17ggM" },
                { title: "Video 2: Startup Showcase", url: "https://youtu.be/bY0YmqzUWHU" },
                { title: "Video 3: The Future of Metaverse Startups", url: "https://youtu.be/zF70Hvln8D4?si=Iagt0y_dr7XW0_jl" }
            ]},
            { name: "Module 9: What to do with Metaverse Development", lessons: [
                { title: "Video 1: Career Paths", url: "https://youtu.be/LEgHRAQ1HmE?si=ifWGRFxdpgF2CPN0" },
                { title: "Article 1: How to create a Metaverse", url: "https://www.intelivita.com/blog/how-to-create-metaverse/" },
                { title: "Video 2: Development Tools", url: "https://youtu.be/Rnk_akgSjqg?si=fdIxelGxcSBlBTOu" }
            ]}
        ]
    },
    'sustainable-energy': {
        name: 'Sustainable Energy',
        description: 'Energy is sustainable if it "meets the needs of the present without compromising the ability of future generations to meet their own needs."',
        modules: [
            { name: "Module 1: Intro: What is Sustainable Energy", lessons: [
                { title: "Video 1: Intro to Sustainable Energy", url: "https://youtu.be/VfowJHJz6-s?si=9nKsA8wgXDSJ6Obf" },
                { title: "Video 2: Sustainable Energy Explained", url: "https://youtu.be/v6k7yBBhuZo" },
                { title: "Video 3: Sources of Sustainable Energy", url: "https://youtu.be/c7xlTRW8ZLA" }
            ]},
            { name: "Module 2: Industry of Clean Energy", lessons: []},
            { name: "Module 3: Solutions: Solar, Wind, Tidal Energy", lessons: []},
            { name: "Module 4: Solutions: Geothermal and Nuclear Energy", lessons: []},
            { name: "Module 5: Solutions: Hydropower, Hydro and Carbon", lessons: []},
            { name: "Module 6: Solutions: Biofuels", lessons: []},
            { name: "Module 7: Challenges", lessons: []},
            { name: "Module 8: Energy Storage and Grids", lessons: []},
            { name: "Module 9: Case Studies: Startups", lessons: []}
        ]
    },
    'autonomous-vehicles': {
        name: 'Autonomous Vehicles',
        description: 'Understand the future of transportation; AV are vehicles equipped with technology to sense their environment and operate without human intervention.',
        modules: [
            { name: "Module 1: Intro: What is AV?", lessons: [
                { title: "Video 1: What are Autonomous Vehicles?", url: "https://youtu.be/UI-j-B99D9E?si=BMLnxxNVqxopnaWa" },
                { title: "Video 2: Self-Driving Cars Explained", url: "https://youtu.be/Zl3YSPilT-w?si=d7697J53KxunfKp2" },
                { title: "Video 3: Levels of Autonomy", url: "https://www.youtube.com/watch?v=tGgGdqr2aIc&feature=youtu.be" },
                { title: "Video 4: How Self-Driving Cars Work", url: "https://youtu.be/Hr6GPYCHTfA" }
            ]},
            { name: "Module 2: Industry of Autonomous Vehicles", lessons: [
                { title: "Video 1: AVs in Logistics", url: "https://youtu.be/RwKijQggRkA" },
                { title: "Video 2: Autonomous Delivery", url: "https://youtu.be/zHpenVvUEyc" },
                { title: "Video 3: The Future of Transportation", url: "https://youtu.be/WdFH_Zj07yM" },
                { title: "Video 4: Autonomous Farming", url: "https://youtu.be/Z8C2vn1VVzU?si=ro3S5xORSmMPoHmV" }
            ]},
            { name: "Module 3: Challenges", lessons: []},
            { name: "Module 4: Case Studies: Tesla", lessons: []},
            { name: "Module 5: Case Studies: Waymo", lessons: []},
            { name: "Module 6: Case Studies: Startups", lessons: []}
        ]
    }
};

let currentTopicId = '';
let currentLessonIndex = 0;

// Firebase configuration
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
let db;
let auth;
let userId;

if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userId = user.uid;
        } else {
            await signInAnonymously(auth);
            userId = auth.currentUser?.uid || crypto.randomUUID();
        }
        console.log('User ID:', userId);
        const userIdDisplay = document.getElementById('userIdDisplay');
        if (userIdDisplay) {
            userIdDisplay.textContent = `User ID: ${userId}`;
        }
        await loadProgress();
    });
} else {
    console.error("Firebase config is missing. App will run without persistence.");
    userId = 'anonymous';
    document.getElementById('userIdDisplay').textContent = `User ID: ${userId} (Anonymous)`;
    // Load progress locally
    loadProgress();
}

async function loadProgress() {
    if (!db || userId === 'anonymous') return;
    try {
        const progressDocRef = doc(db, 'artifacts', appId, 'users', userId, 'progress', 'topics');
        const progressSnapshot = await new Promise(resolve => {
            onSnapshot(progressDocRef, (doc) => {
                if (doc.exists()) {
                    resolve(doc.data());
                } else {
                    resolve({});
                }
            });
        });

        // Merge fetched progress with local data
        for (const topicId in progressSnapshot) {
            if (exploreTopics[topicId]) {
                exploreTopics[topicId].modules.forEach((module, modIndex) => {
                    const savedModule = progressSnapshot[topicId].modules[modIndex];
                    if (savedModule) {
                        module.lessons.forEach((lesson, lessonIndex) => {
                            const savedLesson = savedModule.lessons[lessonIndex];
                            if (savedLesson) {
                                lesson.completed = savedLesson.completed;
                            }
                        });
                    }
                });
            }
        }
        updateModuleCompletion();
    } catch (e) {
        console.error("Error loading progress: ", e);
    }
}

async function saveProgress() {
    if (!db || userId === 'anonymous') return;
    try {
        const progressDocRef = doc(db, 'artifacts', appId, 'users', userId, 'progress', 'topics');
        await setDoc(progressDocRef, exploreTopics, { merge: true });
        console.log("Progress saved successfully!");
    } catch (e) {
        console.error("Error saving progress: ", e);
    }
}

// Lấy tên người dùng từ localStorage và hiển thị trên dashboard
document.addEventListener('DOMContentLoaded', () => {
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.innerText = `Hey, ${firstName} ${lastName}!`;
    }
});

// Chuyển đổi giữa các tab sidebar
document.addEventListener('DOMContentLoaded', function() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            tabContents.forEach(content => content.style.display = 'none');
            
            this.classList.add('active');
            
            const targetId = this.getAttribute('data-tab-target');
            const targetContent = document.getElementById(`${targetId}-content`);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });

    const initialTab = document.querySelector('.sidebar-item[data-tab-target="dashboard"]');
    if (initialTab) {
        initialTab.classList.add('active');
        document.getElementById('dashboard-content').style.display = 'block';
    }

    const exploreGridView = document.getElementById('explore-grid-view');
    const exploreDetailContent = document.getElementById('explore-detail-content');
    const backToGridBtn = document.getElementById('back-to-explore-grid');
    const exploreGrid = document.querySelector('.explore-grid');
    const modulesContainer = document.getElementById('modules-container');
    const backToModulesBtn = document.getElementById('back-to-modules-btn');
    const lessonViewContent = document.getElementById('lesson-view-content');
    const lessonTitle = document.getElementById('lesson-title');
    const videoFrame = document.getElementById('video-frame');
    const videoDescription = document.getElementById('video-description');
    const watchedBtn = document.getElementById('watched-btn');
    const skipBtn = document.getElementById('skip-btn');
    const prevLessonBtn = document.getElementById('prev-lesson-btn');
    const nextLessonBtn = document.getElementById('next-lesson-btn');

    // Use event delegation to handle clicks on cards
    if (exploreGrid) {
        exploreGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.explore-card');
            if (!card) return;
            const exploreId = card.getAttribute('data-explore-id');
            // Fallback: build a temporary topic from card DOM if id not defined
            if (!exploreId || !exploreTopics[exploreId]) {
                const tmpId = 'custom-topic';
                const title = (card.querySelector('.card-title')?.textContent || 'Topic').trim();
                exploreTopics[tmpId] = {
                    name: title,
                    description: '',
                    modules: [
                        { name: 'Module 1', lessons: [] },
                        { name: 'Module 2', lessons: [] },
                        { name: 'Module 3', lessons: [] }
                    ]
                };
                currentTopicId = tmpId;
                exploreGridView.style.display = 'none';
                exploreDetailContent.style.display = 'block';
                document.getElementById('explore-topic-title').textContent = title;
                renderModules(tmpId);
                return;
            }
            currentTopicId = exploreId;
            exploreGridView.style.display = 'none';
            exploreDetailContent.style.display = 'block';
            document.getElementById('explore-topic-title').textContent = exploreTopics[exploreId].name;
            renderModules(exploreId);
        });
    }

    backToGridBtn.addEventListener('click', () => {
        exploreGridView.style.display = 'block';
        exploreDetailContent.style.display = 'none';
        lessonViewContent.style.display = 'none';
    });

    backToModulesBtn.addEventListener('click', () => {
        exploreDetailContent.style.display = 'block';
        lessonViewContent.style.display = 'none';
    });

    watchedBtn.addEventListener('click', () => {
        markLessonCompleted(true);
    });

    skipBtn.addEventListener('click', () => {
        markLessonCompleted(true);
    });

    prevLessonBtn.addEventListener('click', () => {
        if (currentLessonIndex > 0) {
            currentLessonIndex--;
            displayLesson(currentTopicId, currentLessonIndex);
        }
    });

    nextLessonBtn.addEventListener('click', () => {
        const topic = exploreTopics[currentTopicId];
        let totalLessons = topic.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
        if (currentLessonIndex < totalLessons - 1) {
            currentLessonIndex++;
            displayLesson(currentTopicId, currentLessonIndex);
        }
    });

    function renderModules(topicId) {
        const modules = exploreTopics[topicId].modules;
        modulesContainer.innerHTML = '';
        modules.forEach((module, moduleIndex) => {
            const isModuleCompleted = module.lessons.every(lesson => lesson.completed);
            const moduleHtml = `
                <div class="module-accordion" data-module-index="${moduleIndex}">
                    <div class="module-header">
                        <span class="${isModuleCompleted ? 'icon-tick-checked' : 'icon-tick-unchecked'}"></span>
                        <span>${module.name}</span>
                        <span class="icon">&gt;</span>
                    </div>
                    <div class="module-content">
                        <ul>
                            ${module.lessons.map((lesson, lessonIndex) => `
                                <li data-module-index="${moduleIndex}" data-lesson-index="${lessonIndex}">
                                    <span class="${lesson.completed ? 'icon-tick-checked' : 'icon-tick-unchecked'}"></span>
                                    ${lesson.title}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
            modulesContainer.innerHTML += moduleHtml;
        });
        attachAccordionListeners();
        attachLessonClickListeners();
    }

    function attachAccordionListeners() {
        document.querySelectorAll('.module-accordion').forEach(accordion => {
            const header = accordion.querySelector('.module-header');
            const content = accordion.querySelector('.module-content');
            header.addEventListener('click', () => {
                content.classList.toggle('open');
                header.querySelector('.icon').classList.toggle('rotated');
            });
        });
    }

    function attachLessonClickListeners() {
        document.querySelectorAll('.module-content li').forEach(li => {
            li.addEventListener('click', () => {
                const moduleIdx = parseInt(li.getAttribute('data-module-index'), 10);
                const lessonIdx = parseInt(li.getAttribute('data-lesson-index'), 10);
                if (Number.isNaN(moduleIdx) || Number.isNaN(lessonIdx)) return;

                // Compute flat index for currentLessonIndex
                const topic = exploreTopics[currentTopicId];
                let flatIndex = 0;
                for (let i = 0; i < topic.modules.length; i++) {
                    if (i < moduleIdx) {
                        flatIndex += topic.modules[i].lessons.length;
                    }
                }
                currentLessonIndex = flatIndex + lessonIdx;
                displayLesson(currentTopicId, currentLessonIndex);
            });
        });
    }

    function displayLesson(topicId, lessonIndex) {
        exploreDetailContent.style.display = 'none';
        lessonViewContent.style.display = 'block';

        const topic = exploreTopics[topicId];
        let flatLessons = topic.modules.flatMap(mod => mod.lessons);
        const lesson = flatLessons[lessonIndex];
        
        if (!lesson) {
            console.error("Lesson not found at index:", lessonIndex);
            return;
        }

        lessonTitle.textContent = lesson.title;
        videoDescription.textContent = lesson.description || 'This lesson provides an overview of the topic presented in the video or link.';

        let videoId = '';
        if (lesson.url.includes("youtu.be/") || lesson.url.includes("youtube.com/")) {
            const url = new URL(lesson.url);
            videoId = url.hostname === "youtu.be"
                ? url.pathname.slice(1)
                : url.searchParams.get("v");
            
            videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
            videoFrame.style.display = 'block';
    } else {
            videoFrame.style.display = 'none';
            videoDescription.textContent = `This lesson is an external resource: ${lesson.url}`;
            // Optional: you can display a link here
            const externalLink = document.createElement('a');
            externalLink.href = lesson.url;
            externalLink.textContent = "Visit External Link";
            externalLink.target = "_blank";
            videoDescription.appendChild(externalLink);
        }

        prevLessonBtn.disabled = lessonIndex === 0;
        nextLessonBtn.disabled = lessonIndex >= flatLessons.length - 1;
    }

    function updateModuleCompletion() {
        for (const topicId in exploreTopics) {
            exploreTopics[topicId].modules.forEach(module => {
                const lessonsCompleted = module.lessons.every(lesson => lesson.completed);
                module.completed = lessonsCompleted;
            });
        }
    }

    function markLessonCompleted(isCompleted) {
        const topic = exploreTopics[currentTopicId];
        let currentLesson = null;
        let lessonGlobalIndex = 0;
        
        for (const mod of topic.modules) {
            for (const lesson of mod.lessons) {
                if (lessonGlobalIndex === currentLessonIndex) {
                    currentLesson = lesson;
                    break;
                }
                lessonGlobalIndex++;
            }
            if (currentLesson) break;
        }

        if (currentLesson) {
            currentLesson.completed = isCompleted;
            if (typeof saveProgress === 'function') {
                try { saveProgress(); } catch {}
            }
            renderModules(currentTopicId);
        }
    }
});
