// 3D Animated Background
function init3DBackground() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.y += 0.002;
        particlesMesh.rotation.x += mouseY * 0.001;
        particlesMesh.rotation.z += mouseX * 0.001;
        
        renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// GSAP Animations
function initAnimations() {
    gsap.from('.hero-title', { duration: 1.5, y: 100, opacity: 0, ease: 'power3.out' });
    gsap.from('.hero-subtitle', { duration: 1.5, y: 100, opacity: 0, delay: 0.3, ease: 'power3.out' });
    gsap.from('.hero-buttons', { duration: 1.5, y: 100, opacity: 0, delay: 0.6, ease: 'power3.out' });
    
    gsap.from('.project-card', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 80%'
        }
    });

    gsap.from('.skill-tag', {
        duration: 0.8,
        scale: 0,
        rotation: 180,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 80%'
        }
    });
}

// Navbar Smooth Scroll + Active
function initNavbar() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            // Remove active from all
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Auto active on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + section.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Feedback Form (Firebase)
function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        try {
            await saveFeedback(formData);
            form.reset();
            
            // Success Animation
            gsap.to(form, { 
                scale: 0.95, 
                duration: 0.1, 
                yoyo: true, 
                repeat: 1 
            });
            
            // Success Message
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '✅ Saved! Thank you! ✨';
            btn.style.background = 'linear-gradient(45deg, #10b981, #059669)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 3000);
            
        } catch (error) {
            alert('❌ Network error! Check console.');
        }
    });
}

// AI Chat (OpenRouter)
function initAIChat() {
    const chatContainer = document.getElementById('ai-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesDiv = document.getElementById('chat-messages');
    
    // Auto-open chat after 2s
    setTimeout(() => {
        chatContainer.style.display = 'block';
        gsap.from(chatContainer, { 
            scale: 0, 
            rotation: 180, 
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
    }, 2000);

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        sendBtn.disabled = true;
        sendBtn.textContent = '🤖 AI typing...';

        try {
            // Get AI response
            const aiResponse = await getAIResponse(message);
            addMessage(aiResponse, 'ai');
        } catch (error) {
            addMessage('🤖 Oops! AI crashed! Try again! 😅', 'ai');
        } finally {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send';
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        // Animate message
        gsap.from(messageDiv, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Custom Cursor (Bonus!)
function initCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(102,126,234,0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

// INTERSECTION OBSERVER for scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out'
                });
            }
        });
    });

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        observer.observe(section);
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    init3DBackground();
    initAnimations();
    initNavbar();
    initFeedbackForm();
    initAIChat();
    initCursor();
    initScrollAnimations();
    
    console.log('🚀 Portfolio loaded! Ready to impress! 💥');
});
