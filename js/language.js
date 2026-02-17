/**
 * Language Management - EN/AR Toggle with RTL Support
 * Handles language switching with localStorage persistence
 */

class LanguageManager {
    constructor() {
        this.currentLang = this.getStoredLanguage() || this.getDefaultLanguage();
        this.translations = {};
        this.init();
    }

    /**
     * Initialize language manager
     */
    async init() {
        await this.loadTranslations();
        this.applyLanguage(this.currentLang);
        this.attachEventListeners();
    }

    /**
     * Get stored language from localStorage
     */
    getStoredLanguage() {
        return localStorage.getItem('vloracode-lang');
    }

    /**
     * Get default language (can be based on browser language)
     */
    getDefaultLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('ar') ? 'ar' : 'en';
    }

    /**
     * Load translation files
     */
    async loadTranslations() {
        try {
            const [enResponse, arResponse] = await Promise.all([
                fetch('./translations/en.json'),
                fetch('./translations/ar.json')
            ]);

            this.translations.en = await enResponse.json();
            this.translations.ar = await arResponse.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Use fallback inline translations
            this.loadFallbackTranslations();
        }
    }

    /**
     * Fallback translations if JSON files fail to load
     */
    loadFallbackTranslations() {
        this.translations = {
            en: {
                nav: {
                    home: "Home",
                    services: "Services",
                    technologies: "Technologies",
                    portfolio: "Portfolio",
                    contact: "Contact"
                },
                hero: {
                    title: "Transform Your Ideas Into",
                    titleHighlight: "Digital Reality",
                    subtitle: "Expert web and mobile application development solutions tailored to elevate your business to new heights.",
                    cta1: "Get Started",
                    cta2: "View Portfolio"
                },
                services: {
                    title: "Our Services",
                    subtitle: "Comprehensive development solutions for modern businesses",
                    web: {
                        title: "Web Development",
                        description: "Custom web applications built with cutting-edge technologies for optimal performance and user experience."
                    },
                    mobile: {
                        title: "Mobile Apps",
                        description: "Native and cross-platform mobile applications that deliver seamless experiences across all devices."
                    },
                    uiux: {
                        title: "UI/UX Design",
                        description: "Beautiful, intuitive interfaces designed with user-centric approach to maximize engagement."
                    },
                    consulting: {
                        title: "Tech Consulting",
                        description: "Strategic technology guidance to help you make informed decisions for your digital transformation."
                    }
                },
                whyUs: {
                    title: "Why Choose VloraCode?",
                    subtitle: "What sets us apart from the competition",
                    expertise: {
                        title: "Deep Technical Expertise",
                        description: "Years of experience with cutting-edge technologies and best practices."
                    },
                    quality: {
                        title: "Quality Focused",
                        description: "We never compromise on code quality, performance, and security."
                    },
                    support: {
                        title: "Ongoing Support",
                        description: "Continuous support and maintenance to ensure your success."
                    },
                    innovation: {
                        title: "Innovation Driven",
                        description: "Always staying ahead with the latest trends and technologies."
                    }
                },
                technologies: {
                    title: "Technologies We Master",
                    subtitle: "Powerful tools to build exceptional applications",
                    web: "Web Technologies",
                    mobile: "Mobile Technologies",
                    backend: "Backend & Database",
                    cloud: "Cloud & DevOps"
                },
                portfolio: {
                    title: "Our Project Specialties",
                    subtitle: "Proven expertise in delivering complex systems",
                    viewProject: "View Project",
                    project1: {
                        title: "E-commerce Platform",
                        description: "Complete online shopping solutions with payment integration, inventory management, and mobile apps"
                    },
                    project2: {
                        title: "E-learning System",
                        description: "Comprehensive educational platforms with course management, assessments, and student tracking"
                    },
                    project3: {
                        title: "Clinical Management System",
                        description: "Advanced healthcare systems for patient records, appointments, and medical workflows"
                    },
                    project4: {
                        title: "Learning Center Management",
                        description: "Complete training center solutions with scheduling, attendance, and certification management"
                    },
                    project5: {
                        title: "POS System",
                        description: "Advanced point of sale solutions for retail and restaurant businesses with inventory and sales tracking"
                    },
                    project6: {
                        title: "Inventory Management System",
                        description: "Comprehensive warehouse and stock management with real-time tracking and automated reordering"
                    }
                },
                contact: {
                    title: "Let's Build Something Amazing",
                    subtitle: "Get in touch with us to discuss your project",
                    name: "Your Name",
                    email: "Your Email",
                    message: "Tell us about your project",
                    send: "Send Message",
                    sending: "Sending...",
                    success: "Message sent successfully!",
                    error: "Failed to send message. Please try again.",
                    phoneLabel: "Phone",
                    emailLabel: "Email",
                    officeLabel: "Office",
                    officeAddress: "123 Innovation Street\nTech City, TC 12345"
                },
                footer: {
                    tagline: "Building tomorrow's digital experiences today",
                    quickLinks: "Quick Links",
                    services: "Services",
                    connect: "Connect With Us",
                    copyright: "© 2026 VloraCode. All rights reserved.",
                    madeWith: "Made with",
                    by: "by VloraCode Team"
                }
            },
            ar: {
                nav: {
                    home: "الرئيسية",
                    services: "الخدمات",
                    technologies: "التقنيات",
                    portfolio: "الأعمال",
                    contact: "تواصل معنا"
                },
                hero: {
                    title: "حول أفكارك إلى",
                    titleHighlight: "واقع رقمي",
                    subtitle: "حلول احترافية لتطوير تطبيقات الويب والهاتف المحمول مصممة خصيصاً للارتقاء بعملك إلى آفاق جديدة.",
                    cta1: "ابدأ الآن",
                    cta2: "عرض الأعمال"
                },
                services: {
                    title: "خدماتنا",
                    subtitle: "حلول تطوير شاملة للأعمال الحديثة",
                    web: {
                        title: "تطوير الويب",
                        description: "تطبيقات ويب مخصصة مبنية بأحدث التقنيات لتحقيق أفضل أداء وتجربة مستخدم."
                    },
                    mobile: {
                        title: "تطبيقات الجوال",
                        description: "تطبيقات جوال أصلية ومتعددة المنصات توفر تجربة سلسة على جميع الأجهزة."
                    },
                    uiux: {
                        title: "تصميم واجهات المستخدم",
                        description: "واجهات جميلة وبديهية مصممة بنهج يركز على المستخدم لتعظيم التفاعل."
                    },
                    consulting: {
                        title: "الاستشارات التقنية",
                        description: "إرشادات تقنية استراتيجية لمساعدتك على اتخاذ قرارات مستنيرة للتحول الرقمي."
                    }
                },
                whyUs: {
                    title: "لماذا تختار VloraCode؟",
                    subtitle: "ما يميزنا عن المنافسين",
                    expertise: {
                        title: "خبرة تقنية عميقة",
                        description: "سنوات من الخبرة مع أحدث التقنيات وأفضل الممارسات."
                    },
                    quality: {
                        title: "التركيز على الجودة",
                        description: "لا نتنازل أبداً عن جودة الكود والأداء والأمان."
                    },
                    support: {
                        title: "دعم مستمر",
                        description: "دعم وصيانة مستمرة لضمان نجاحك."
                    },
                    innovation: {
                        title: "مدفوعون بالابتكار",
                        description: "دائماً في المقدمة مع أحدث الاتجاهات والتقنيات."
                    }
                },
                technologies: {
                    title: "التقنيات التي نتقنها",
                    subtitle: "أدوات قوية لبناء تطبيقات استثنائية",
                    web: "تقنيات الويب",
                    mobile: "تقنيات الجوال",
                    backend: "الخادم وقواعد البيانات",
                    cloud: "السحابة والعمليات"
                },
                portfolio: {
                    title: "تخصصاتنا في المشاريع",
                    subtitle: "خبرة مثبتة في تقديم الأنظمة المعقدة",
                    viewProject: "عرض المشروع",
                    project1: {
                        title: "منصة التجارة الإلكترونية",
                        description: "حلول متكاملة للتسوق عبر الإنترنت مع تكامل الدفع وإدارة المخزون وتطبيقات الجوال"
                    },
                    project2: {
                        title: "نظام التعليم الإلكتروني",
                        description: "منصات تعليمية شاملة مع إدارة الدورات والتقييمات وتتبع الطلاب"
                    },
                    project3: {
                        title: "نظام إدارة العيادات",
                        description: "أنظمة رعاية صحية متقدمة لسجلات المرضى والمواعيد وسير العمل الطبي"
                    },
                    project4: {
                        title: "نظام إدارة مراكز التدريب",
                        description: "حلول كاملة لمراكز التدريب مع الجدولة والحضور وإدارة الشهادات"
                    },
                    project5: {
                        title: "نظام نقاط البيع",
                        description: "حلول متطورة لنقاط البيع للمتاجر والمطاعم مع تتبع المخزون والمبيعات"
                    },
                    project6: {
                        title: "نظام إدارة المخزون",
                        description: "إدارة شاملة للمستودعات والمخزون مع التتبع في الوقت الفعلي وإعادة الطلب التلقائي"
                    }
                },
                contact: {
                    title: "لنبني شيئاً رائعاً معاً",
                    subtitle: "تواصل معنا لمناقشة مشروعك",
                    name: "اسمك",
                    email: "بريدك الإلكتروني",
                    message: "أخبرنا عن مشروعك",
                    send: "إرسال الرسالة",
                    sending: "جاري الإرسال...",
                    success: "تم إرسال الرسالة بنجاح!",
                    error: "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.",
                    phoneLabel: "الهاتف",
                    emailLabel: "البريد الإلكتروني",
                    officeLabel: "المكتب",
                    officeAddress: "123 شارع الابتكار\nالمدينة التقنية، TC 12345"
                },
                footer: {
                    tagline: "نبني تجارب الغد الرقمية اليوم",
                    quickLinks: "روابط سريعة",
                    services: "الخدمات",
                    connect: "تواصل معنا",
                    copyright: "© 2026 VloraCode. جميع الحقوق محفوظة.",
                    madeWith: "صنع بـ",
                    by: "من قبل فريق VloraCode"
                }
            }
        };
    }

    /**
   * Apply language to document
   */
    applyLanguage(lang) {
        this.currentLang = lang;

        // Set HTML attributes
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Update document body font family
        if (lang === 'ar') {
            document.body.style.fontFamily = 'var(--font-family-arabic)';
        } else {
            document.body.style.fontFamily = 'var(--font-family-latin)';
        }

        // Update page title and meta tags
        this.updateMetaTags();

        // Update all translatable elements
        this.updateTranslations();
        this.updateLanguageToggle();

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
    }

    /**
     * Update meta tags based on language
     */
    updateMetaTags() {
        const titles = {
            en: 'VloraCode - Expert Web & Mobile App Development',
            ar: 'VloraCode - خبراء تطوير تطبيقات الويب والجوال'
        };

        const descriptions = {
            en: 'VloraCode specializes in creating cutting-edge web and mobile applications. Transform your ideas into digital reality with our expert development team.',
            ar: 'VloraCode متخصصون في إنشاء تطبيقات الويب والجوال المتطورة. حول أفكارك إلى واقع رقمي مع فريق التطوير الخبير لدينا.'
        };

        // Update page title
        document.title = titles[this.currentLang];

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', descriptions[this.currentLang]);
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', titles[this.currentLang]);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute('content', descriptions[this.currentLang]);
        }

        // Update Twitter Card tags
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', titles[this.currentLang]);
        }

        const twitterDescription = document.querySelector('meta[property="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.setAttribute('content', descriptions[this.currentLang]);
        }
    }

    /**
     * Update all elements with data-i18n attribute
     */
    updateTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);

            if (translation) {
                // Check if it's an input placeholder
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.setAttribute('placeholder', translation);
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    /**
     * Get translation by key path (e.g., 'nav.home')
     */
    getTranslation(keyPath) {
        const keys = keyPath.split('.');
        let value = this.translations[this.currentLang];

        for (const key of keys) {
            if (value && typeof value === 'object') {
                value = value[key];
            } else {
                return keyPath; // Return key if translation not found
            }
        }

        return value || keyPath;
    }

    /**
     * Toggle between English and Arabic
     */
    toggle() {
        const newLang = this.currentLang === 'en' ? 'ar' : 'en';
        this.applyLanguage(newLang);
        localStorage.setItem('vloracode-lang', newLang);

        // Add transition animation
        this.animateLanguageTransition();
    }

    /**
     * Update language toggle button
     */
    updateLanguageToggle() {
        const toggleBtn = document.getElementById('lang-toggle');
        if (!toggleBtn) return;

        const langText = toggleBtn.querySelector('.lang-text');
        if (langText) {
            langText.textContent = this.currentLang === 'en' ? 'AR' : 'EN';
        }

        toggleBtn.setAttribute('aria-label',
            this.currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English'
        );
    }

    /**
     * Animate language transition
     */
    animateLanguageTransition() {
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const toggleBtn = document.getElementById('lang-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Set specific language
     */
    setLanguage(lang) {
        if (lang === 'en' || lang === 'ar') {
            this.applyLanguage(lang);
            localStorage.setItem('vloracode-lang', lang);
        }
    }

    /**
     * Translate a key programmatically
     */
    t(key) {
        return this.getTranslation(key);
    }
}

// Initialize language manager when DOM is ready
let languageManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        languageManager = new LanguageManager();
    });
} else {
    (async () => {
        languageManager = new LanguageManager();
    })();
}

// Export for use in other scripts
window.LanguageManager = LanguageManager;
window.languageManager = languageManager;
