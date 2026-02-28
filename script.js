document.addEventListener("DOMContentLoaded", () => {
    // 1. Setup Intersection Observers for fade-in animations on scroll
    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, fadeObserverOptions);

    const targets = document.querySelectorAll('.fade-in-section');
    targets.forEach(target => {
        fadeObserver.observe(target);
    });

    // 2. Dynamic Copyright Year
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2.2 Navigation Scroll Effect
    const nav = document.querySelector("nav");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            nav.classList.add("scrolled-nav");
        } else {
            nav.classList.remove("scrolled-nav");
        }
    });

    // 2.5 Canvas Typewriter Code Background
    (function initCodeCanvas() {
        const canvas = document.getElementById("code-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const FONT_SIZE = 16;
        const FONT = `bold ${FONT_SIZE}px 'Courier New', monospace`;
        const LINE_HEIGHT = FONT_SIZE * 2.8; // Generous spacing between rows

        const snippets = [
            "func buildExperience() -> UIViewController { }",
            "let future = async { await success() }",
            "Widget build(BuildContext context) {",
            "Provider.of<ThemeData>(context, listen: false)",
            "@State private var isAnimating: Bool = false",
            "void update(float deltaTime) { render(scene); }",
            "struct ContentView: View { var body: some View {",
            "if (isAwesome) { portfolio.ship() }",
            "useEffect(() => { animate(entry) }, [visible])",
            "let skills: [String] = [\"Swift\", \"Flutter\", \"Unity\"]",
            "@Published var projects: [Project] = []",
            "GameScene.run(SKAction.repeatForever(.rotate))",
            "import SwiftUI // Crafting native experiences",
            "flutter pub get && flutter run --release",
            "Navigator.pushNamed(context, '/projects')",
            "git commit -m 'feat: ship something great'",
        ];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        // Each slot = one independent row of typewriter animation
        const ROWS = Math.floor(window.innerHeight / LINE_HEIGHT);
        const slots = [];

        function randomSnippet() {
            return snippets[Math.floor(Math.random() * snippets.length)];
        }

        function createSlot(index) {
            return {
                x: 24 + Math.random() * Math.max(0, canvas.width - 300),
                y: LINE_HEIGHT * index + LINE_HEIGHT,
                text: randomSnippet(),
                shown: 0,       // characters currently shown
                charsAlpha: [], // individual character opacity
                phase: "typing",// typing | holding | fading
                timer: 0,
                speed: 0.3 + Math.random() * 0.4, // chars per frame tick (slower)
                holdTime: 30 + Math.random() * 50,
                fadeSpeed: 0.01 + Math.random() * 0.01,
                delay: Math.floor(Math.random() * 200), // initial delay before start
            };
        }

        for (let i = 0; i < ROWS; i++) {
            slots.push(createSlot(i));
        }

        function isDark() {
            return document.documentElement.getAttribute("data-theme") === "dark";
        }

        function tick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const textColor = isDark() ? "255,255,255" : "0,0,0";

            slots.forEach(slot => {
                // Initial delay
                if (slot.delay > 0) {
                    slot.delay--;
                    return;
                }

                ctx.font = FONT;

                if (slot.charsAlpha.length < slot.text.length) {
                    slot.charsAlpha.length = slot.text.length;
                    slot.charsAlpha.fill(0);
                }

                if (slot.phase === "typing") {
                    slot.timer += slot.speed;
                    let newShown = Math.min(Math.floor(slot.timer), slot.text.length);

                    for (let c = slot.shown; c < newShown; c++) {
                        slot.charsAlpha[c] = 1;
                    }
                    slot.shown = newShown;

                    // Gradually fade older characters to create a trail
                    for (let c = 0; c < slot.shown - 1; c++) {
                        slot.charsAlpha[c] = Math.max(0, slot.charsAlpha[c] - 0.015);
                    }

                    if (slot.shown >= slot.text.length) {
                        slot.phase = "holding";
                        slot.timer = 0;
                    }

                } else if (slot.phase === "holding") {
                    for (let c = 0; c < slot.shown; c++) {
                        slot.charsAlpha[c] = Math.max(0, slot.charsAlpha[c] - 0.015);
                    }
                    slot.timer++;
                    if (slot.timer >= slot.holdTime) {
                        slot.phase = "fading";
                    }

                } else if (slot.phase === "fading") {
                    let stillVisible = false;
                    for (let c = 0; c < slot.shown; c++) {
                        slot.charsAlpha[c] = Math.max(0, slot.charsAlpha[c] - slot.fadeSpeed);
                        if (slot.charsAlpha[c] > 0) stillVisible = true;
                    }
                    if (!stillVisible) {
                        // Reset with a new snippet on this row
                        slot.x = 24 + Math.random() * Math.max(0, canvas.width - 300);
                        slot.text = randomSnippet();
                        slot.shown = 0;
                        slot.charsAlpha = [];
                        slot.phase = "typing";
                        slot.timer = 0;
                        slot.delay = Math.floor(10 + Math.random() * 60);
                    }
                }

                // Draw visible portion of text character by character
                let currentX = slot.x;
                for (let c = 0; c < slot.shown; c++) {
                    let alpha = slot.charsAlpha[c];
                    if (alpha > 0) {
                        ctx.fillStyle = `rgba(${textColor}, ${alpha})`;
                        let char = slot.text[c];
                        ctx.fillText(char, currentX, slot.y);
                        currentX += ctx.measureText(char).width;
                    } else {
                        currentX += ctx.measureText(slot.text[c]).width;
                    }
                }

                // Draw blinking cursor at end (only while typing)
                if (slot.phase === "typing") {
                    const cursorVisible = Math.floor(Date.now() / 400) % 2 === 0;
                    if (cursorVisible) {
                        ctx.fillStyle = `rgba(${textColor}, 0.8)`;
                        ctx.fillRect(currentX + 2, slot.y - FONT_SIZE + 3, 2, FONT_SIZE - 2);
                    }
                }
            });

            requestAnimationFrame(tick);
        }

        tick();
    })();

    // 3. Theme Toggle Logic
    const themeToggleBtn = document.getElementById("theme-toggle");
    const iconMoon = document.getElementById("icon-moon");
    const iconSun = document.getElementById("icon-sun");

    // Check for saved user preference, if any (defaults to light mode)
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
        if (currentTheme === "dark") {
            iconMoon.classList.remove("hidden");
            iconSun.classList.add("hidden");
            themeToggleBtn.setAttribute("aria-checked", "true");
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");

            if (theme === "dark") {
                // Switch to Light
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("theme", "light");
                iconMoon.classList.add("hidden");
                iconSun.classList.remove("hidden");
                themeToggleBtn.setAttribute("aria-checked", "false");
            } else {
                // Switch to Dark
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
                iconMoon.classList.remove("hidden");
                iconSun.classList.add("hidden");
                themeToggleBtn.setAttribute("aria-checked", "true");
            }
        });
    }

    // 4. Mobile Menu Logic
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (mobileMenuBtn && mobileMenu) {
        const icon = mobileMenuBtn.querySelector('i');

        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
            const isActive = mobileMenu.classList.contains("active");
            document.body.style.overflow = isActive ? "hidden" : "";

            // Toggle FontAwesome class
            if (isActive) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                document.body.style.overflow = "";
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 4.5 Contact Form Handle
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            // Optional: you can add custom JS validation here before submission
            // Formspree will handle the redirect, or you can use fetch() to submit via AJAX.
        });
    }

    // 5. Typewriter Effect Logic for Hero Section
    const TxtType = function (el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function () {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        let that = this;
        let delta = 150 - Math.random() * 50; // Typing speed

        if (this.isDeleting) { delta /= 2; } // Deleting speed

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period; // Pause at end of word
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500; // Pause before new word
        }

        setTimeout(function () {
            that.tick();
        }, delta);
    };

    const typeElements = document.querySelectorAll('.typewrite');
    typeElements.forEach(el => {
        const toRotate = el.getAttribute('data-type');
        const period = el.getAttribute('data-period');
        if (toRotate) {
            new TxtType(el, JSON.parse(toRotate), period);
        }
    });
});
