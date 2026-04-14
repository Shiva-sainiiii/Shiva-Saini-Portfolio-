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

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    // Resize
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
}

// Navbar Smooth Scroll
function initNavbar() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            // Active nav
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Feedback Form
function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };
        
        try {
            await saveFeedback(formData);
            form.reset();
            alert('🎉 Feedback saved! Thank you!');
            
            // GSAP shake animation
            gsap.to(form, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
        } catch (error) {
            alert('Oops! Something went wrong. Try again!');
        }
    });
}

// AI Chat
function initAIChat() {
    const chatContainer = document.getElementById('ai-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesDiv = document.getElementById('chat-messages');
    
    // Toggle chat
    setTimeout(() => {
        chatContainer.classList.add('active');
        gsap.from(chatContainer, { scale: 0, rotation: 180, duration: 0.5 });
    }, 2000);

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // User message
        addMessage(message, 'user');
        chatInput.value = '';

        // AI response
        const aiResponse = await getAIResponse(message);
        addMessage(aiResponse, 'ai');
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    init3