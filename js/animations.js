/**
 * Animations & Interactions
 * Handles scroll animations, interactive elements, and micro-interactions
 */

class AnimationManager {
    constructor() {
        this.observers = [];
        this.init();
    }

    /**
     * Initialize animation manager
     */
    init() {
        this.setupScrollAnimations();
        this.setupSmoothScroll();
        this.setupHeaderScroll();
        this.setupParallax();
        this.setupCounters();
    }

    /**
     * Setup Intersection Observer for scroll animations
     */
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');

        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationType = entry.target.getAttribute('data-animate') || 'fadeInUp';
                    const delay = entry.target.getAttribute('data-delay') || 0;

                    setTimeout(() => {
                        entry.target.classList.add(`animate-${animationType}`);
                        entry.target.style.opacity = '1';
                    }, delay);

                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                if (href === '#') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Setup header scroll effects
     */
    setupHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide header on scroll down, show on scroll up
            if (scrollY > lastScrollY && scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    /**
     * Setup parallax effects
     */
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    /**
     * Setup animated counters
     */
    setupCounters() {
        const counters = document.querySelectorAll('[data-counter]');

        if (counters.length === 0) return;

        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-counter'));
            const duration = parseInt(element.getAttribute('data-duration')) || 2000;
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;

                if (current < target) {
                    element.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
        this.observers.push(observer);
    }

    /**
     * Add stagger animation to children
     */
    static staggerChildren(parent, delay = 100) {
        const children = parent.children;
        Array.from(children).forEach((child, index) => {
            child.style.animationDelay = `${index * delay}ms`;
        });
    }

    /**
     * Cleanup observers
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
    }
}

/**
 * Form Validation and Submission
 */
class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Display error
        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }

        return isValid;
    }

    showError(field, message) {
        field.classList.add('error');

        let errorEl = field.parentElement.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            field.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    clearError(field) {
        field.classList.remove('error');
        const errorEl = field.parentElement.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitBtn = this.form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = window.languageManager?.t('contact.sending') || 'Sending...';

        try {
            // Simulate API call (replace with actual endpoint)
            await this.submitForm(data);

            // Show success message
            this.showMessage('success', window.languageManager?.t('contact.success') || 'Message sent successfully!');
            this.form.reset();
        } catch (error) {
            // Show error message
            this.showMessage('error', window.languageManager?.t('contact.error') || 'Failed to send message. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async submitForm(data) {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', data);
                resolve();
            }, 1500);
        });
    }

    showMessage(type, message) {
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.textContent = message;

        this.form.insertBefore(messageEl, this.form.firstChild);

        setTimeout(() => {
            messageEl.classList.add('show');
        }, 10);

        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }
}

/**
 * Mobile Menu Handler
 */
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobile-menu-btn');
        this.menu = document.getElementById('mobile-menu');
        this.overlay = document.getElementById('menu-overlay');

        if (this.menuBtn && this.menu) {
            this.init();
        }
    }

    init() {
        this.menuBtn.addEventListener('click', () => this.toggle());

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        // Close on menu item click
        const menuLinks = this.menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.menu.classList.add('active');
        this.menuBtn.classList.add('active');
        if (this.overlay) this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.menu.classList.remove('active');
        this.menuBtn.classList.remove('active');
        if (this.overlay) this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    isOpen() {
        return this.menu.classList.contains('active');
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const animationManager = new AnimationManager();
    const contactForm = new FormHandler('contact-form');
    const mobileMenu = new MobileMenu();

    // Make available globally
    window.animationManager = animationManager;
    window.contactForm = contactForm;
    window.mobileMenu = mobileMenu;
});
