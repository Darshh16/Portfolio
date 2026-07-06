// Three.js Animated Mascot for Hero Section
// Written in Vanilla JS, lazy-loading libraries and pausing when inactive.

class MascotSystem {
    constructor() {
        this.container = document.getElementById('mascot-container');
        if (!containerExists(this.container)) return;

        // Configuration
        this.modelPath = window.mascotModelUrl || '/static/models/Waving Gesture.fbx';
        this.isMuted = false;
        this.isPaused = false;
        this.isModelLoaded = false;
        
        // Three.js Core Objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        this.mascot = null;
        this.mixer = null;
        this.clips = {};
        
        // Raycasting
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(-9999, -9999);
        this.hovered = false;

        // Position
        this.floorY = -1.5;
        this.cornerX = 2.3;
        
        // Base scale for FBX models (which are often HUGE)
        this.baseScale = 0.01; 
        
        this.currentState = 'idle';
        this.stateTime = 0;
        this.stateDuration = 4.0;
        
        this.init();
    }

    async init() {
        try {
            await this.loadDependencies();
            this.setupScene();
            await this.loadMascot();
            this.setupListeners();
            this.animate();
            console.log('Mascot system (FBX) initialized successfully.');
        } catch (error) {
            console.error('Failed to initialize Mascot System:', error);
        }
    }

    loadDependencies() {
        return new Promise((resolve, reject) => {
            // Load fflate first (required by FBXLoader)
            const scriptFflate = document.createElement('script');
            scriptFflate.src = 'https://cdn.jsdelivr.net/npm/fflate@0.8.0/umd/index.js';
            
            scriptFflate.onload = () => {
                // Then load FBXLoader
                const scriptFBX = document.createElement('script');
                scriptFBX.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js';
                scriptFBX.onload = resolve;
                scriptFBX.onerror = () => reject(new Error('Failed to load FBXLoader.js'));
                document.head.appendChild(scriptFBX);
            };
            
            scriptFflate.onerror = () => reject(new Error('Failed to load fflate'));
            document.head.appendChild(scriptFflate);
        });
    }

    setupScene() {
        const rect = this.container.getBoundingClientRect();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, rect.width / rect.height, 0.1, 100);
        this.camera.position.set(0, 0, 5.5);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(rect.width, rect.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        
        const canvas = this.renderer.domElement;
        canvas.id = 'mascot-canvas';
        this.container.appendChild(canvas);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(3, 5, 4);
        dirLight.castShadow = true;
        this.scene.add(dirLight);

        const rimLight = new THREE.DirectionalLight(0xef4444, 1.0);
        rimLight.position.set(-4, 3, -3);
        this.scene.add(rimLight);
    }

    loadMascot() {
        return new Promise((resolve, reject) => {
            if (!THREE.FBXLoader) {
                reject(new Error("FBXLoader is not defined"));
                return;
            }
            
            const loader = new THREE.FBXLoader();
            loader.load(
                this.modelPath,
                (object) => {
                    this.mascot = object;
                    
                    // Center and scale the model
                    this.mascot.scale.set(this.baseScale, this.baseScale, this.baseScale);
                    this.mascot.position.set(this.cornerX, this.floorY, 1.0);
                    this.mascot.rotation.y = -0.5;
                    
                    // Enable shadows
                    this.mascot.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    this.scene.add(this.mascot);

                    // Setup Animations
                    if (object.animations && object.animations.length > 0) {
                        console.log('Loaded animations:', object.animations.map(a => a.name));
                        this.mixer = new THREE.AnimationMixer(this.mascot);
                        
                        object.animations.forEach((clip) => {
                            this.clips[clip.name.toLowerCase()] = this.mixer.clipAction(clip);
                        });
                        
                        // Play the first animation found
                        if (object.animations[0]) {
                            this.playClip(object.animations[0].name.toLowerCase());
                        }
                    } else {
                        console.warn('No animations found in FBX file.');
                    }
                    
                    this.isModelLoaded = true;
                    resolve();
                },
                (xhr) => {
                    console.log(`Loading FBX: ${(xhr.loaded / xhr.total * 100).toFixed(1)}% loaded`);
                },
                (error) => {
                    console.error('Error loading FBX:', error);
                    reject(error);
                }
            );
        });
    }

    playClip(name) {
        if (!this.mixer || !this.clips[name]) return;
        
        Object.keys(this.clips).forEach(key => {
            if (key !== name) {
                this.clips[key].fadeOut(0.3);
            }
        });
        
        const action = this.clips[name];
        action.reset().fadeIn(0.3).play();
    }

    setupListeners() {
        const toggleBtn = document.getElementById('mascot-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleMute(toggleBtn));
        }

        window.addEventListener('resize', () => this.onResize());

        document.addEventListener('visibilitychange', () => {
            this.isPaused = document.hidden;
        });

        // Global pointer position tracking for Raycasting
        window.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.mouse.x = (x / rect.width) * 2 - 1;
                this.mouse.y = -(y / rect.height) * 2 + 1;
            } else {
                this.mouse.set(-9999, -9999);
            }
        });

        // Global click handler
        window.addEventListener('click', (e) => {
            const ignoreTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'LABEL'];
            if (ignoreTags.includes(e.target.tagName) || e.target.closest('a') || e.target.closest('button')) {
                return;
            }

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(this.mascot, true);

            if (intersects.length > 0) {
                this.triggerReaction();
            }
        });
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const rect = this.container.getBoundingClientRect();
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(rect.width, rect.height);
    }

    toggleMute(btnElement) {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            btnElement.classList.add('muted');
            this.container.style.opacity = '0';
            setTimeout(() => { this.container.style.display = 'none'; }, 400);
        } else {
            btnElement.classList.remove('muted');
            this.container.style.display = 'block';
            setTimeout(() => { this.container.style.opacity = '1'; }, 50);
            this.clock.getDelta();
        }
    }

    triggerReaction() {
        // Just play the next animation in the list as a reaction
        const allClips = Object.keys(this.clips);
        if (allClips.length > 1) {
            // Find a different clip than current
            const randomClip = allClips[Math.floor(Math.random() * allClips.length)];
            this.playClip(randomClip);
            this.currentState = 'stunt';
            this.stateTime = 0;
            this.stateDuration = 2.0; 
        }
    }

    updateStateMachine(delta) {
        if (!this.mixer) return;
        
        this.stateTime += delta;
        
        // Raycasting for Hover state
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.mascot, true);
        const cursor = document.getElementById('custom-cursor');
        
        if (intersects.length > 0) {
            if (!this.hovered) {
                this.hovered = true;
                if (cursor) cursor.classList.add('grow');
                document.body.style.cursor = 'pointer';
            }
        } else {
            if (this.hovered) {
                this.hovered = false;
                if (cursor) cursor.classList.remove('grow');
                document.body.style.cursor = 'none';
            }
        }
        
        // Revert to idle after stunt
        if (this.currentState === 'stunt' && this.stateTime > this.stateDuration) {
            this.currentState = 'idle';
            if (Object.keys(this.clips)[0]) {
                this.playClip(Object.keys(this.clips)[0]);
            }
        }
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        if (this.isPaused || this.isMuted) return;

        const delta = Math.min(this.clock.getDelta(), 0.1);
        
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        if (this.isModelLoaded) {
            this.updateStateMachine(delta);
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

function containerExists(container) {
    if (!container) return false;
    return true;
}

function tryInitializeMascot() {
    if (typeof THREE !== 'undefined') {
        window.mascotSystem = new MascotSystem();
    } else {
        setTimeout(tryInitializeMascot, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    tryInitializeMascot();
});
