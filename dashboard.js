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
    ,
    'ai': {
        name: 'Artificial Intelligence',
        description: 'Master machine learning algorithms and AI applications.',
        modules: [
            { name: 'Module 1: Intro to AI', lessons: [
                { title: 'Video: What is AI?', url: 'https://youtu.be/2ePf9rue1Ao' },
                { title: 'Video: Machine Learning Basics', url: 'https://youtu.be/GwIo3gDZCVQ' }
            ]},
            { name: 'Module 2: Neural Networks', lessons: [
                { title: 'Video: Neural Networks Explained', url: 'https://youtu.be/aircAruvnKk' }
            ]}
        ]
    },
    'robotics': {
        name: 'Robotics',
        description: 'Build and program robots for real-world tasks.',
        modules: [
            { name: 'Module 1: Robotics Overview', lessons: [
                { title: 'Video: Intro to Robotics', url: 'https://youtu.be/v5j7s4d3N5o' }
            ]}
        ]
    },
    'quantum-computing': {
        name: 'Quantum Computing',
        description: 'Understand the basics of quantum computation.',
        modules: [
            { name: 'Module 1: Qubits and Superposition', lessons: [
                { title: 'Video: What is Quantum Computing?', url: 'https://youtu.be/scy4ZyfmvYc' }
            ]}
        ]
    },
    'digital-twin': {
        name: 'Digital Twin',
        description: 'Mirror physical systems to improve operations.',
        modules: [
            { name: 'Module 1: Digital Twin Basics', lessons: [
                { title: 'Video: What is a Digital Twin?', url: 'https://youtu.be/N7tZfCYNhgM' }
            ]}
        ]
    },
    'web-development': {
        name: 'Web Development',
        description: 'Build interactive and responsive websites from scratch.',
        modules: [
            { name: 'Module 1: HTML & CSS', lessons: [
                { title: 'Video: HTML Crash Course', url: 'https://youtu.be/pQN-pnXPaVg' }
            ]}
        ]
    },
    'financial-accounting': {
        name: 'Financial Accounting',
        description: 'Master financial principles and manage business finances.',
        modules: [
            { name: 'Module 1: Accounting Basics', lessons: [
                { title: 'Video: Intro to Accounting', url: 'https://youtu.be/_ZxLm3c7GkE' }
            ]}
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
    const exploreCards = document.querySelectorAll('.explore-card');
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

    exploreCards.forEach(card => {
        card.addEventListener('click', () => {
            const exploreId = card.getAttribute('data-explore-id');
            if (exploreTopics[exploreId]) {
                currentTopicId = exploreId;
                exploreGridView.style.display = 'none';
                exploreDetailContent.style.display = 'block';
                document.getElementById('explore-topic-title').textContent = exploreTopics[exploreId].name;
                renderModules(exploreId);
            }
        });
    });

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
        watchedBtn.classList.add('active-watched');
        skipBtn.classList.remove('active-skip');
    });

    skipBtn.addEventListener('click', () => {
        markLessonCompleted(true);
        skipBtn.classList.add('active-skip');
        watchedBtn.classList.remove('active-watched');
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

    // Reset visual selection only when user clicks the center Next Lesson label
    const nextLabelClickable = document.getElementById('next-lesson-label');
    if (nextLabelClickable) {
        nextLabelClickable.addEventListener('click', () => {
            watchedBtn.classList.remove('active-watched');
            skipBtn.classList.remove('active-skip');
        });
    }

    function renderModules(topicId) {
        const modules = exploreTopics[topicId].modules;
        modulesContainer.innerHTML = '';
        modules.forEach((module, moduleIndex) => {
            const isModuleCompleted = module.lessons.every(lesson => lesson.completed);
            const moduleHtml = `
                <div class="module-accordion${isModuleCompleted ? ' completed' : ''}" data-module-index="${moduleIndex}">
                    <div class="module-header">
                        <span>${module.name}</span>
                        <span class="icon">&gt;</span>
                    </div>
                    <div class="module-content">
                        <ul>
                            ${module.lessons.map((lesson, lessonIndex) => `
                                <li data-lesson-index="${lessonIndex}">
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
                const topic = exploreTopics[currentTopicId];
                let lessonCount = 0;
                let found = false;

                // Find the global index of the clicked lesson
                for (let mod of topic.modules) {
                    for (let lesson of mod.lessons) {
                        if (lesson.title === li.textContent.trim()) {
                            currentLessonIndex = lessonCount;
                            found = true;
                            break;
                        }
                        lessonCount++;
                    }
                    if (found) break;
                }
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

        // Next lesson label in center
        const nextLabel = document.getElementById('next-lesson-label');
        if (nextLabel) {
            if (lessonIndex < flatLessons.length - 1) {
                nextLabel.textContent = `Next: ${flatLessons[lessonIndex + 1].title}`;
            } else {
                nextLabel.textContent = '';
            }
        }
    }

    function updateModuleCompletion() {
        for (const topicId in exploreTopics) {
            exploreTopics[topicId].modules.forEach(module => {
                const lessonsCompleted = module.lessons.every(lesson => lesson.completed);
                module.completed = lessonsCompleted;
            });
        }
        // Cập nhật class hiển thị màu cho module đã hoàn thành nếu đang ở trang chi tiết
        document.querySelectorAll('.module-accordion').forEach((acc, i) => {
            const idx = parseInt(acc.getAttribute('data-module-index'), 10);
            if (!Number.isNaN(idx)) {
                const mod = exploreTopics[currentTopicId]?.modules[idx];
                if (mod) {
                    if (mod.completed) acc.classList.add('completed');
                    else acc.classList.remove('completed');
                }
            }
        });
        // Cập nhật thanh tiến độ trên các card
        Object.keys(exploreTopics).forEach(topicId => {
            const topic = exploreTopics[topicId];
            if (!topic || !topic.modules || topic.modules.length === 0) return;
            const total = topic.modules.length;
            const completed = topic.modules.filter(m => m.completed).length;
            const pct = Math.round((completed / total) * 100);
            const fill = document.querySelector(`.progress-fill[data-progress-for="${topicId}"]`);
            if (fill) fill.style.width = `${pct}%`;
        });
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
            updateModuleCompletion();
            saveProgress();
            renderModules(currentTopicId);
        }
    }
});

// Các hàm này được định nghĩa và gán vào window để có thể truy cập toàn cục 
// (do được gọi qua onclick trong HTML sử dụng type="module")

/**
 * Hiển thị thông tin người dùng giả lập.
 * Trong ứng dụng thực tế, hàm này sẽ lấy dữ liệu từ API hoặc Firestore.
 */
function loadUserInfo() {
    const defaultName = "Guest User";
    // Cập nhật tất cả các vị trí hiển thị tên
    document.getElementById('userName').textContent = defaultName;
    const dashboardUserName = document.getElementById('dashboard-user-name');
    if (dashboardUserName) {
        dashboardUserName.textContent = defaultName;
    }
    const userNameDisplay = document.getElementById('user-name-display');
    if (userNameDisplay) {
        userNameDisplay.textContent = defaultName;
    }
    
    // Giả lập User ID
    const userId = "USER-7890-XYZ";
    const userIdDisplay = document.getElementById('current-user-id');
    if (userIdDisplay) {
        userIdDisplay.textContent = userId;
    }
}


/**
 * Xử lý chuyển đổi giữa các tab nội bộ trong Dashboard (Home, My Plan, My Process).
 * @param {string} tabId - ID của tab nội bộ muốn hiển thị ('home', 'plan', 'process').
 */
function showInnerTab(tabId) {
    // Loại bỏ active khỏi tất cả các tab content
    document.querySelectorAll('.inner-tab-content').forEach(el => {
        el.classList.remove('active');
    });
    // Loại bỏ active khỏi tất cả các tab item
    document.querySelectorAll('.inner-tabs-nav .inner-tab-item').forEach(el => {
        el.classList.remove('active');
    });

    // Thêm active cho tab content và tab item được chọn
    const contentElement = document.getElementById(`inner-content-${tabId}`);
    const itemElement = document.querySelector(`.inner-tab-item[data-inner-tab="${tabId}"]`);
    
    if (contentElement) {
        contentElement.classList.add('active');
    }
    if (itemElement) {
        itemElement.classList.add('active');
    }
}


/**
 * Xử lý thu gọn/mở rộng Sidebar.
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.querySelector('#sidebar-toggle i');
    
    sidebar.classList.toggle('collapsed');
    
    // Tùy chỉnh icon (giữ nguyên fa-bars cho cả hai trạng thái để đơn giản)
    if (sidebar.classList.contains('collapsed')) {
        // Icon đang là fa-bars, không cần đổi
    } else {
        // Icon đang là fa-bars, không cần đổi
    }
}


// =========================================
// HÀM XỬ LÝ PROFILE
// =========================================

/**
 * Hiển thị form chỉnh sửa tên.
 */
function showNameEdit() {
    const editForm = document.getElementById('name-edit-form');
    const editBtn = document.getElementById('edit-name-btn');
    if (editForm && editBtn) {
        editForm.classList.remove('hidden');
        editBtn.classList.add('hidden');
        const userNameDisplay = document.getElementById('user-name-display').textContent;
        document.getElementById('new-name').value = userNameDisplay.trim();
    }
}

/**
 * Hủy bỏ việc chỉnh sửa tên.
 */
function cancelNameEdit() {
    const editForm = document.getElementById('name-edit-form');
    const editBtn = document.getElementById('edit-name-btn');
    if (editForm && editBtn) {
        editForm.classList.add('hidden');
        editBtn.classList.remove('hidden');
    }
}

/**
 * Lưu tên mới (giả lập).
 */
function saveName() {
    const newNameInput = document.getElementById('new-name');
    if (!newNameInput) return;

    const newName = newNameInput.value;
    if (newName.trim() !== "") {
        // Giả lập lưu tên
        document.getElementById('user-name-display').textContent = newName;
        document.getElementById('userName').textContent = newName;
        const dashboardUserName = document.getElementById('dashboard-user-name');
        if (dashboardUserName) {
            dashboardUserName.textContent = newName;
        }
        cancelNameEdit();
        console.log(`Tên đã được lưu: ${newName}`);
    } else {
        console.error("Tên không được để trống.");
    }
}

/**
 * Xem trước avatar mới sau khi chọn file.
 * @param {Event} event - Sự kiện thay đổi input file.
 */
function previewAvatar(event) {
    const file = event.target.files[0];
    const profileAvatar = document.getElementById('profile-avatar');
    const navbarAvatar = document.querySelector('.navbar-user .user-avatar');
    
    if (file && profileAvatar && navbarAvatar) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileAvatar.src = e.target.result;
            // Cập nhật avatar trên Navbar
            navbarAvatar.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}


// =========================================
// KHỞI TẠO VÀ XỬ LÝ SỰ KIỆN CHÍNH
// =========================================

/**
 * Xử lý chuyển đổi giữa các tab chính trong Sidebar.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Khởi tạo chức năng chuyển đổi tab chính (Sidebar items)
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab-target');
            
            // Ẩn tất cả nội dung tab
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            // Hiển thị nội dung tab được chọn
            const targetContent = document.getElementById(`${tabId}-content`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Cập nhật trạng thái active của sidebar item
            document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Đảm bảo tab nội bộ 'home' được kích hoạt khi quay lại dashboard
            if (tabId === 'dashboard') {
                showInnerTab('home');
            }
        });
    });

    // 2. Khởi tạo tab Home nội bộ khi trang tải lần đầu
    showInnerTab('home');

    // 3. Tải và hiển thị thông tin người dùng giả lập
    loadUserInfo();
});


// Gán các hàm vào đối tượng window để chúng có thể được truy cập từ HTML (do sử dụng type="module")
window.showInnerTab = showInnerTab;
window.toggleSidebar = toggleSidebar;

// Also attach a defensive event listener in case onclick is removed later
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebar();
        });
    }
});
window.showNameEdit = showNameEdit;
window.cancelNameEdit = cancelNameEdit;
window.saveName = saveName;
window.previewAvatar = previewAvatar;
