document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis for smooth scroll
    const lenis = new Lenis({
        lerp: 0.2, // Snappier response
        wheelMultiplier: 1.2,
        smoothWheel: true,
        normalizeWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const loaderWrapper = document.querySelector('.loader-wrapper');
    if (loaderWrapper) {
        gsap.to(loaderWrapper, {
            opacity: 0,
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                loaderWrapper.style.display = 'none';
            }
        });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Inject God-Tier Elements
    const injectElements = () => {
        // Scroll Progress Bar
        const scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        document.body.appendChild(scrollProgress);

        gsap.to(scrollProgress, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });

        // Custom Cursor
        if (window.innerWidth > 768) {
            document.body.style.cursor = 'none';
            document.querySelectorAll('a, button, input, textarea, select, .btn').forEach(el => {
                el.style.cursor = 'none';
            });

            let cursorDot = document.querySelector('.cursor-dot');
            let cursorCircle = document.querySelector('.cursor-circle');

            if (!cursorDot) {
                cursorDot = document.createElement('div');
                cursorDot.className = 'cursor-dot';
                document.body.appendChild(cursorDot);
            }
            if (!cursorCircle) {
                cursorCircle = document.createElement('div');
                cursorCircle.className = 'cursor-circle';
                document.body.appendChild(cursorCircle);
            }

            // Quick mouse tracking
            gsap.set([cursorDot, cursorCircle], { xPercent: -50, yPercent: -50 });

            const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            const mouse = { x: pos.x, y: pos.y };
            const speed = 0.35;

            const xSetDot = gsap.quickSetter(cursorDot, "x", "px");
            const ySetDot = gsap.quickSetter(cursorDot, "y", "px");
            const xSetCircle = gsap.quickSetter(cursorCircle, "x", "px");
            const ySetCircle = gsap.quickSetter(cursorCircle, "y", "px");

            window.addEventListener("mousemove", e => {
                mouse.x = e.x;
                mouse.y = e.y;
                xSetDot(mouse.x);
                ySetDot(mouse.y);
            });

            gsap.ticker.add(() => {
                const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
                pos.x += (mouse.x - pos.x) * dt;
                pos.y += (mouse.y - pos.y) * dt;
                xSetCircle(pos.x);
                ySetCircle(pos.y);
            });

            // Hover interactions
            document.querySelectorAll('a, .nav-link').forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover-link'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover-link'));
            });

            document.querySelectorAll('button, .btn, .service-card, .software-card, .business-card, input, textarea, select').forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover-btn'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover-btn'));
            });
        }
    };
    injectElements();

    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenu) {
        document.body.appendChild(mobileMenu);
    }

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
    });

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = mobileMenu.classList.contains('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (isActive) {
                // Close menu
                gsap.to(mobileMenu, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    onComplete: () => {
                        mobileMenu.classList.remove('active');
                    }
                });
                icon.classList.replace('fa-times', 'fa-bars');
            } else {
                // Open menu
                mobileMenu.classList.add('active');
                gsap.fromTo(mobileMenu,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
                );
                icon.classList.replace('fa-bars', 'fa-times');
            }
        });
    }

    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu?.classList.contains('active')) {
                gsap.to(mobileMenu, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    onComplete: () => {
                        mobileMenu.classList.remove('active');
                    }
                });
                const icon = mobileMenuBtn?.querySelector('i');
                icon?.classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // Smooth Text Reveal Effect
    const splitTextReveal = (element) => {
        if (element.dataset.revealed) return;
        element.dataset.revealed = 'true';

        const text = element.innerText;
        element.innerHTML = '';
        element.style.overflow = 'hidden';
        element.style.display = 'inline-block';
        element.style.verticalAlign = 'top';

        const words = text.trim().split(/\s+/);
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.overflow = 'hidden';

            const innerSpan = document.createElement('span');
            innerSpan.style.display = 'inline-block';
            innerSpan.innerText = word;

            wordSpan.appendChild(innerSpan);
            element.appendChild(wordSpan);

            if (wordIndex < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }

            gsap.fromTo(innerSpan,
                { y: '100%', opacity: 0 },
                {
                    y: '0%',
                    opacity: 1,
                    duration: 1,
                    ease: 'expo.out',
                    delay: wordIndex * 0.05
                }
            );
        });
    };

    // Apply reveal to hero title on load
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        setTimeout(() => splitTextReveal(heroTitle), 500);
    }

    gsap.from('.logo', {
        opacity: 0,
        x: -50,
        duration: 0.6,
        ease: 'expo.out'
    });

    gsap.from('.nav-links a', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        stagger: 0.05,
        ease: 'expo.out'
    });

    gsap.from('.badge', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.2,
        ease: 'expo.out'
    });

    gsap.from('.hero h1', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: 0.4,
        ease: 'expo.out'
    });

    gsap.from('.hero p', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.6,
        ease: 'expo.out'
    });

    gsap.from('.hero-btns', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.8,
        ease: 'expo.out'
    });

    document.querySelectorAll('.section-header').forEach(header => {
        const title = header.querySelector('h2');
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                onEnter: () => title && splitTextReveal(title)
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'expo.out'
        });
    });

    document.querySelectorAll('.service-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%'
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            delay: index % 3 * 0.1,
            ease: 'expo.out'
        });
    });

    gsap.from('.why-content', {
        scrollTrigger: { trigger: '.why-grid', start: 'top 80%' },
        opacity: 0,
        x: -80,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.why-image', {
        scrollTrigger: { trigger: '.why-grid', start: 'top 80%' },
        opacity: 0,
        x: 80,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    gsap.from('.feature-item', {
        scrollTrigger: { trigger: '.why-features', start: 'top 85%' },
        opacity: 0,
        x: -40,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
    });

    gsap.from('.cta-content', {
        scrollTrigger: { trigger: '.cta-section', start: 'top 80%' },
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out'
    });

    document.querySelectorAll('.cta-btns .btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { y: -5, scale: 1.02, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });

    gsap.from('.footer-grid > div', {
        scrollTrigger: { trigger: '.footer', start: 'top 90%' },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    gsap.from('.page-header-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.story-image', {
        scrollTrigger: { trigger: '.story-grid', start: 'top 80%' },
        opacity: 0,
        x: -60,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.story-content', {
        scrollTrigger: { trigger: '.story-grid', start: 'top 80%' },
        opacity: 0,
        x: 60,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });

    document.querySelectorAll('.value-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0,
            y: 50,
            rotate: -2,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out'
        });
    });

    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 85%' },
            opacity: 0,
            x: -60,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power3.out'
        });
    });

    document.querySelectorAll('.stat-item').forEach((stat, index) => {
        gsap.from(stat, {
            scrollTrigger: { trigger: '.stats-section', start: 'top 80%' },
            opacity: 0,
            y: 40,
            scale: 0.9,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'power3.out'
        });
    });

    document.querySelectorAll('.service-detailed-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0,
            y: 80,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    document.querySelectorAll('.software-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    document.querySelectorAll('.business-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0,
            x: index % 2 === 0 ? -60 : 60,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    gsap.from('.contact-info', {
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
        opacity: 0,
        x: -60,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.contact-form-wrapper', {
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
        opacity: 0,
        x: 60,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.contact-card', {
        scrollTrigger: { trigger: '.contact-cards', start: 'top 85%' },
        opacity: 0,
        x: -40,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
    });

    document.querySelectorAll('.quick-contact-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: { trigger: '.quick-contact', start: 'top 85%' },
            opacity: 0,
            y: 40,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    gsap.from('.map-placeholder', {
        scrollTrigger: { trigger: '.map-section', start: 'top 85%' },
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.form-group', {
        scrollTrigger: { trigger: '.contact-form', start: 'top 85%' },
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
    });

    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                borderColor: '#6366F1',
                boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
                duration: 0.3
            });
        });
        input.addEventListener('blur', () => {
            gsap.to(input, {
                borderColor: '#E2E8F0',
                boxShadow: 'none',
                duration: 0.3
            });
        });
    });

    gsap.to('.hero-img', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        ease: 'none'
    });

    gsap.to('.page-header-bg img', {
        scrollTrigger: {
            trigger: '.page-header',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        ease: 'none'
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, { color: '#6366F1', x: 5, duration: 0.3, ease: 'power2.out' });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link, { color: '#64748B', x: 0, duration: 0.3, ease: 'power2.out' });
        });
    });

    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            gsap.to('.logo-icon', { rotation: 360, duration: 0.6, ease: 'power2.out' });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    gsap.to(window, {
                        scrollTo: { y: target, offsetY: 80 },
                        duration: 1,
                        ease: 'power3.out'
                    });
                    mobileMenu?.classList.remove('active');
                    const icon = mobileMenuBtn?.querySelector('i');
                    icon?.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    });

    document.querySelectorAll('.stat-number').forEach(stat => {
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            onEnter: () => {
                const target = parseInt(stat.textContent);
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + (stat.dataset.suffix || '');
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + (stat.dataset.suffix || '');
                    }
                }, 16);
            },
            once: true
        });
    });

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
        });
    });

    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, { y: -5, scale: 1.1, duration: 0.3, ease: 'power2.out' });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });

    document.querySelectorAll('img').forEach(img => {
        gsap.from(img, {
            scrollTrigger: { trigger: img, start: 'top 90%' },
            opacity: 0,
            scale: 1.1,
            duration: 1,
            ease: 'power3.out'
        });
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const serviceSelect = document.getElementById('service');
        const otherServiceGroup = document.getElementById('other-service-group');
        const otherServiceInput = document.getElementById('other-service');

        if (serviceSelect && otherServiceGroup && otherServiceInput) {
            serviceSelect.addEventListener('change', (e) => {
                if (e.target.value === 'other') {
                    otherServiceGroup.style.display = 'block';
                    otherServiceInput.required = true;
                    gsap.fromTo(otherServiceGroup,
                        { opacity: 0, height: 0, y: -10 },
                        { opacity: 1, height: 'auto', y: 0, duration: 0.3, ease: 'power2.out' }
                    );
                } else {
                    otherServiceGroup.style.display = 'none';
                    otherServiceInput.required = false;
                    otherServiceInput.value = '';
                }
            });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
                submitBtn.style.opacity = '0.7';
                submitBtn.style.pointerEvents = 'none';
            }

            const formData = new FormData(contactForm);
            const accessKey = formData.get('access_key');

            try {
                if (accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE') {
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    if (!data.success) throw new Error('Submission failed');
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                gsap.to(contactForm, {
                    opacity: 0,
                    y: -20,
                    duration: 0.4,
                    onComplete: () => {
                        contactForm.style.display = 'none';
                        const successDiv = document.getElementById('form-success');
                        if (successDiv) {
                            successDiv.style.display = 'block';
                            gsap.fromTo(successDiv,
                                { opacity: 0, y: 20 },
                                { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' }
                            );
                        }
                    }
                });
            } catch (error) {
                alert('Something went wrong. Please try again later.');
                if (submitBtn) {
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.pointerEvents = 'all';
                }
            }
        });
    }
});