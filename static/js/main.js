// Three.js Background Animation (Optimized for Performance)
const initThreeJS = () => {
    // Disable Three.js on mobile devices for better performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        console.log('Three.js disabled on mobile for performance');
        return;
    }

    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false, // Disabled for performance
        powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    container.innerHTML = ''; // Clear previous canvas
    container.appendChild(renderer.domElement);

    // Particles - Reduced count for better performance
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 1024 ? 800 : 1500; // Fewer particles on smaller screens
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15; // Spread
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff, // Monochrome White
        transparent: true,
        opacity: 0.4,
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

    // Resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }, 250);
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

const initUI = () => {
    // Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            // Ensure cursor is visible when moving
            cursor.style.opacity = '1';
        });

        // Add hover effect to interactive elements
        const hoverElements = document.querySelectorAll('a, button, input, textarea, .project-card, .group');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
        });
    }

    // Lenis Smooth Scroll - DISABLED cause of issues
    // if (typeof Lenis !== 'undefined') { ... } 

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');

    if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
        // Open mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });

        // Close mobile menu
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        });

        // Close menu when clicking on a link
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initGSAP();
    initUI();
});
