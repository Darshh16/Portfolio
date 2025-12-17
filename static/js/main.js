// Three.js Background Animation (Original Particles)
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.innerHTML = ''; // Clear previous canvas
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15; // Spread
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x6366f1, // Primary color
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Rotate particles
        particlesMesh.rotation.y = elapsedTime * 0.05;
        // Interactive rotation
        particlesMesh.rotation.x = mouseY * 0.5;
        particlesMesh.rotation.y += mouseX * 0.5;

        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// GSAP Animations
const initGSAP = () => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Fade In
    gsap.from(".fade-in", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out"
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-black/80', 'backdrop-blur-md');
            navbar.classList.remove('p-6');
            navbar.classList.add('p-4');
        } else {
            navbar.classList.remove('bg-black/80', 'backdrop-blur-md');
            navbar.classList.remove('p-4');
            navbar.classList.add('p-6');
        }
    });

    // Typewriter Effect
    const words = ["Full Stack Developer", "Computer Engineering Student", "AI Enthusiast", "Problem Solver"];
    let i = 0;
    let timer;

    function typeWriter() {
        const heading = document.getElementById("typewriter");
        if (!heading) return;

        const word = words[i];
        const current = heading.textContent;

        if (current.length < word.length) {
            heading.textContent = word.substring(0, current.length + 1);
            timer = setTimeout(typeWriter, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        const heading = document.getElementById("typewriter");
        if (!heading) return;

        const current = heading.textContent;

        if (current.length > 0) {
            heading.textContent = current.substring(0, current.length - 1);
            timer = setTimeout(erase, 50);
        } else {
            i = (i + 1) % words.length;
            timer = setTimeout(typeWriter, 500);
        }
    }

    typeWriter();

    // Scroll Reveal Animation (Native Intersection Observer)
    // Exclude .fade-in because GSAP handles the initial hero animation
    const revealElements = document.querySelectorAll('section:not(#home) h2, section:not(#home) .glass-card, .skill-card, .columns-1 > div');

    // Add initial styles for reveal
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .reveal-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        .reveal-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);

    // Apply hidden class initially
    revealElements.forEach(el => el.classList.add('reveal-hidden'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));

    // Sticky Stacking Cards Animation
    const customCards = gsap.utils.toArray('.project-card');
    customCards.forEach((card, i) => {
        if (i === customCards.length - 1) return; // Skip last card

        const nextCard = customCards[i + 1];

        gsap.to(card, {
            scale: 0.9,
            opacity: 0.4,
            filter: 'blur(5px)',
            scrollTrigger: {
                trigger: nextCard,
                start: "top bottom",
                end: "top 20%",
                scrub: 1
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initGSAP();
});
