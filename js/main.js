// ============================================
// MenkAi S.A.S - Main JavaScript
// ============================================

(function () {
    'use strict';

    // --- Particle Background ---
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        document.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Mouse interaction
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        this.x -= dx * 0.01;
                        this.y -= dy * 0.01;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles based on screen size
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-dark-800/90', 'border-dark-400');
            navbar.classList.remove('bg-dark-800/60', 'border-transparent');
        } else {
            navbar.classList.remove('bg-dark-800/90', 'border-dark-400');
            navbar.classList.add('bg-dark-800/60', 'border-transparent');
        }
    });

    // --- Mobile Menu ---
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    let menuOpen = false;

    navToggle.addEventListener('click', function () {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('hidden', !menuOpen);

        const spans = navToggle.querySelectorAll('span');
        if (menuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(function (link) {
        link.addEventListener('click', function () {
            menuOpen = false;
            mobileMenu.classList.add('hidden');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    // --- Counter Animation ---
    function animateCounters() {
        const counters = document.querySelectorAll('[data-target]');
        counters.forEach(function (counter) {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            updateCounter();
        });
    }

    // --- Scroll Animation (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(function (el) {
        observer.observe(el);
    });

    // Counter animation on hero visible
    const heroSection = document.getElementById('hero');
    let countersAnimated = false;
    const heroObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !countersAnimated) {
            countersAnimated = true;
            animateCounters();
            heroObserver.unobserve(heroSection);
        }
    }, { threshold: 0.3 });
    heroObserver.observe(heroSection);

    // --- Contact Form ---
    // IMPORTANT: Replace this URL with your actual Google Apps Script Web App URL
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEk98nRcPwfliDeF42aU7CjZ7NZfj3jcqRwT05UValWfBwRXRtGTWmwzytKtoFMZUA/exec';

    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');
    const formStatus = document.getElementById('form-status');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Show loading
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        btnLoading.classList.add('flex');
        submitBtn.disabled = true;

        // Gather form data
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            servicio: document.getElementById('servicio').value,
            mensaje: document.getElementById('mensaje').value,
            timestamp: new Date().toISOString()
        };

        // Send to Apps Script
        fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(function () {
            // With no-cors mode we can't read the response, but submission goes through
            formStatus.textContent = 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.';
            formStatus.className = 'mt-4 px-4 py-3 rounded-lg text-sm bg-green-500/10 border border-green-500/20 text-green-400';
            formStatus.classList.remove('hidden');
            form.reset();
        })
        .catch(function () {
            formStatus.textContent = 'Hubo un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.';
            formStatus.className = 'mt-4 px-4 py-3 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-400';
            formStatus.classList.remove('hidden');
        })
        .finally(function () {
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            btnLoading.classList.remove('flex');
            submitBtn.disabled = false;

            setTimeout(function () {
                formStatus.classList.add('hidden');
            }, 6000);
        });
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY + 100;
        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(function (link) {
                link.classList.remove('text-dark-50');
                if (link.getAttribute('href') === '#' + id && scrollY >= top && scrollY < top + height) {
                    link.classList.add('text-dark-50');
                }
            });
        });
    });
})();
