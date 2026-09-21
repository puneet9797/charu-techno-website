document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ----------------------------------------------------
    // CONSTANTS & STATE
    // ----------------------------------------------------
    const STATE = {
        activeProcessStep: 1,
        activeProductFilter: 'all',
        processData: {
            1: {
                title: "Continuous Degumming Section",
                tag: "Phase 01 — Separation",
                icon: "droplet",
                desc: "Designed to remove phospholipids (gums), mucilage, trace metals, and impurities that affect oil stability and shelf-life. Degumming increases the efficiency of subsequent bleaching and deodorizing steps, yielding a cleaner and more stable oil.",
                substeps: [
                    { num: 1, title: "Pre-Heating & Conditioning", text: "Crude oil is heated to 60-80°C using plate heat exchangers to reduce viscosity and ensure proper conditioning." },
                    { num: 2, title: "Water / Acid Addition System", text: "Phosphoric or citric acid is injected and mixed thoroughly in an agitated reactor to convert non-hydratable gums (NHP) into hydratable forms." },
                    { num: 3, title: "Centrifugal Separation", text: "The mixture is sent to high-speed centrifugal separators where heavy gums are separated from light degummed oil." }
                ]
            },
            2: {
                title: "Neutralization Section",
                tag: "Phase 02 — Acidity Control",
                icon: "shield-alert",
                desc: "Removes free fatty acids (FFA) and acidic impurities like H2S, mercaptans, and naphthenic acids. Caustic soda (NaOH) is mixed with the oil to neutralize acids, forming water-soluble sodium soap salts.",
                substeps: [
                    { num: 1, title: "Caustic Soda Dosing", text: "Dilute caustic soda is carefully metered and mixed to match the FFA levels of the incoming oil." },
                    { num: 2, title: "Agitation & Soapstock Formation", text: "The agitator ensures proper mixing, and the conical bottom allows separation of oil and heavy soapstock." },
                    { num: 3, title: "Soap Separation", text: "Spent caustic soapstock is separated by centrifugal separator and sent for chemical processing (acid oil plant)." }
                ]
            },
            3: {
                title: "Continuous Bleaching System",
                tag: "Phase 03 — Clarification",
                icon: "sun",
                desc: "Removes coloring pigments (chlorophyll, carotenoids), trace metals, peroxides, and soaps. Operates under controlled high temperatures and deep vacuum settings to ensure oil stability and prevent oxidation.",
                substeps: [
                    { num: 1, title: "Bleaching Earth Dosing", text: "Neutralized oil is mixed with activated bleaching earth or activated carbon under high vacuum." },
                    { num: 2, title: "Contact Chamber Reaction", text: "The slurry flows through a contact reactor for 20-30 minutes, allowing pigments to adsorb onto the earth." },
                    { num: 3, title: "Pressure Leaf Filtration", text: "The oil passes through pressure leaf filters (PLFs). Leaves retain the earth cake, letting clear, bright oil through." }
                ]
            },
            4: {
                title: "Continuous De-Waxing System",
                tag: "Phase 04 — Crystallization",
                icon: "snowflake",
                desc: "Removes waxes, high-melting triglycerides, and solid impurities. This step is critical for high-wax oils like sunflower, corn, and rice bran oils to achieve excellent stability and prevent clouding at low temperatures.",
                substeps: [
                    { num: 1, title: "Feed Cooling & Heat Exchange", text: "Bleached oil is cooled gradually from ~70°C down to 8-12°C to prevent thermal shock and promote crystal growth." },
                    { num: 2, title: "Crystallization Chamber", text: "Cooled oil flows into crystallizers. Slow, gentle agitation allows wax crystals to grow to a filterable size over 3-6 hours." },
                    { num: 3, title: "Polishing Filtration", text: "The oil-wax mixture is pumped to filter presses or PLFs to remove wax cake, delivering crystal-clear oil." }
                ]
            },
            5: {
                title: "Continuous Deodorizing System",
                tag: "Phase 05 — De-odorization",
                icon: "wind",
                desc: "The final and most critical step in refining. Responsible for stripping volatile compounds, aldehydes, ketones, and remaining free fatty acids that cause off-flavors and odor. Yields fully stable, bland, and odorless edible oil.",
                substeps: [
                    { num: 1, title: "Deodorizer Column Stripping", text: "Oil enters a tray-type deodorizer tower operating under deep vacuum. Live steam is injected from the bottom to strip volatile compounds." },
                    { num: 2, title: "Thermal Destruction", text: "Oil is heated to 180-260°C under deep vacuum to destroy minor organic impurities thermally." },
                    { num: 3, title: "Heat Recovery & Cooling", text: "Deodorized oil passes through heat exchangers, transferring heat to incoming feed oil, and is cooled for storage." }
                ]
            }
        }
    };

    // ----------------------------------------------------
    // STICKY HEADER & ACTIVE SECTION NAV LINKS
    // ----------------------------------------------------
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header shrink
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Nav Link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // MOBILE NAVIGATION TOGGLE
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close nav menu on clicking links
        const navItems = navMenu.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ----------------------------------------------------
    // INTERACTIVE REFINING PROCESS PANEL LOGIC
    // ----------------------------------------------------
    const processButtons = document.querySelectorAll('.process-step-btn');
    const diagramNodes = document.querySelectorAll('.diagram-node');

    function updateProcessStep(stepNum) {
        STATE.activeProcessStep = parseInt(stepNum);
        
        // 1. Update active timeline buttons
        processButtons.forEach(btn => {
            if (parseInt(btn.getAttribute('data-step')) === STATE.activeProcessStep) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. Update active SVG nodes
        diagramNodes.forEach(node => {
            const nodeRect = node.querySelector('.process-node');
            if (parseInt(node.getAttribute('data-step')) === STATE.activeProcessStep) {
                nodeRect.classList.add('process-node-active');
            } else {
                nodeRect.classList.remove('process-node-active');
            }
        });

        // 3. Update active display card content
        const stepData = STATE.processData[STATE.activeProcessStep];
        if (stepData) {
            document.getElementById('panel-title').textContent = stepData.title;
            document.getElementById('panel-tag').textContent = stepData.tag;
            document.getElementById('panel-desc').textContent = stepData.desc;
            
            // Re-render icon
            const iconContainer = document.querySelector('.process-step-icon');
            iconContainer.innerHTML = `<i data-lucide="${stepData.icon}" id="panel-icon" style="width: 48px; height: 48px;"></i>`;
            lucide.createIcons();

            // Re-render substeps
            const substepsContainer = document.getElementById('panel-sub-steps');
            substepsContainer.innerHTML = '';
            stepData.substeps.forEach(sub => {
                const subItem = document.createElement('div');
                subItem.className = 'sub-step-item';
                subItem.innerHTML = `
                    <div class="sub-step-num">${sub.num}</div>
                    <div class="sub-step-content">
                        <h5>${sub.title}</h5>
                        <p>${sub.text}</p>
                    </div>
                `;
                substepsContainer.appendChild(subItem);
            });
        }
    }

    // Process Timeline Button Clicks
    processButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const stepNum = btn.getAttribute('data-step');
            updateProcessStep(stepNum);
        });
    });

    // SVG Node Clicks
    diagramNodes.forEach(node => {
        node.addEventListener('click', () => {
            const stepNum = node.getAttribute('data-step');
            updateProcessStep(stepNum);
        });
    });

    // ----------------------------------------------------
    // PORTFOLIO PRODUCT CATEGORY FILTER LOGIC
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all filter buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            STATE.activeProductFilter = filterValue;

            productCards.forEach(card => {
                const cardCat = card.getAttribute('data-cat');
                if (filterValue === 'all' || cardCat === filterValue) {
                    card.style.display = 'flex';
                    // Trigger scaling animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ----------------------------------------------------
    // CLIENTS SEARCHABLE TABLE LOGIC
    // ----------------------------------------------------
    const searchInput = document.getElementById('client-search-input');
    const tableBody = document.getElementById('clients-table-body');
    const tableRows = tableBody.querySelectorAll('tr:not(.no-results-row)');
    const countDisplay = document.getElementById('displayed-rows-count');
    const noResultsRow = document.getElementById('no-results');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            let visibleCount = 0;

            tableRows.forEach(row => {
                const nameCell = row.cells[1].textContent.toLowerCase();
                const locationCell = row.cells[2].textContent.toLowerCase();
                const projectCell = row.cells[3].textContent.toLowerCase();

                if (nameCell.includes(query) || locationCell.includes(query) || projectCell.includes(query)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            // Update stats label
            countDisplay.textContent = visibleCount;

            // Show 'no results' row if count is 0
            if (visibleCount === 0) {
                noResultsRow.style.display = 'table-row';
            } else {
                noResultsRow.style.display = 'none';
            }
        });
    }

    // ----------------------------------------------------
    // PROJECT GALLERY LIGHTBOX MODAL LOGIC
    // ----------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src');
            const caption = item.getAttribute('data-caption');

            if (lightbox && lightboxImg && lightboxCaption) {
                lightboxImg.src = src;
                lightboxCaption.textContent = caption;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Disable page scrolling
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
    }

    // Close lightbox on clicking dark backdrop
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Close lightbox on pressing escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // ----------------------------------------------------
    // CONTACT FORM CLIENT-SIDE VALIDATION LOGIC
    // ----------------------------------------------------
    const enquiryForm = document.getElementById('enquiry-form');
    const successMsg = document.getElementById('form-success');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form Inputs
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const phoneInput = document.getElementById('form-phone');
            const interestInput = document.getElementById('form-interest');
            const messageInput = document.getElementById('form-message');

            // Error Elements
            const errorName = document.getElementById('error-name');
            const errorEmail = document.getElementById('error-email');
            const errorPhone = document.getElementById('error-phone');
            const errorInterest = document.getElementById('error-interest');
            const errorMessage = document.getElementById('error-message');

            // Reset error displays
            let isValid = true;
            const inputs = [nameInput, emailInput, phoneInput, interestInput, messageInput];
            const errors = [errorName, errorEmail, errorPhone, errorInterest, errorMessage];
            
            errors.forEach(err => { if(err) err.style.display = 'none'; });
            inputs.forEach(input => { if(input) input.style.borderColor = ''; });

            // 1. Name validation
            if (!nameInput.value.trim()) {
                errorName.style.display = 'block';
                nameInput.style.borderColor = '#ef4444';
                isValid = false;
            }

            // 2. Email validation (RFC 5322 regex)
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                errorEmail.style.display = 'block';
                emailInput.style.borderColor = '#ef4444';
                isValid = false;
            }

            // 3. Phone validation
            if (!phoneInput.value.trim()) {
                errorPhone.style.display = 'block';
                phoneInput.style.borderColor = '#ef4444';
                isValid = false;
            }

            // 4. Interest select validation
            if (!interestInput.value) {
                errorInterest.style.display = 'block';
                interestInput.style.borderColor = '#ef4444';
                isValid = false;
            }

            // 5. Message validation
            if (!messageInput.value.trim()) {
                errorMessage.style.display = 'block';
                messageInput.style.borderColor = '#ef4444';
                isValid = false;
            }

            // Submits successfully
            if (isValid) {
                // Show success banner
                if (successMsg) {
                    successMsg.style.display = 'block';
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Clear form fields
                enquiryForm.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (successMsg) successMsg.style.display = 'none';
                }, 5000);
            }
        });
    }

    // ----------------------------------------------------
    // REVEAL ON SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once animation has triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // ----------------------------------------------------
    // INDUSTRIAL ATMOSPHERIC SPARKS & EMBERS CANVAS (HERO)
    // ----------------------------------------------------
    const sparksCanvas = document.getElementById('hero-sparks-canvas');
    if (sparksCanvas) {
        const ctx = sparksCanvas.getContext('2d');
        let width = (sparksCanvas.width = window.innerWidth);
        let height = (sparksCanvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = sparksCanvas.width = window.innerWidth;
            height = sparksCanvas.height = window.innerHeight;
        });

        const sparkColors = [
            'rgba(245, 158, 11, ',   // warm amber
            'rgba(251, 191, 36, ',   // bright gold
            'rgba(249, 115, 22, ',   // molten orange
            'rgba(255, 255, 255, '   // welding white
        ];

        class Spark {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : height + 10;
                this.size = Math.random() * 2.2 + 0.6;
                this.speedY = Math.random() * 1.2 + 0.4;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.alpha = Math.random() * 0.7 + 0.2;
                this.decay = Math.random() * 0.004 + 0.002;
                this.color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
                this.flicker = Math.random() * 0.2;
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX + Math.sin(this.y * 0.02) * 0.4;
                this.alpha -= this.decay;

                if (this.alpha <= 0 || this.y < -10) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const currentAlpha = Math.max(0, this.alpha + (Math.random() - 0.5) * this.flicker);
                ctx.fillStyle = `${this.color}${currentAlpha})`;
                ctx.shadowBlur = this.size * 4;
                ctx.shadowColor = '#f59e0b';
                ctx.fill();
                ctx.restore();
            }
        }

        const sparkCount = Math.min(45, Math.floor(window.innerWidth / 35));
        const sparks = Array.from({ length: sparkCount }, () => new Spark());

        let animationFrameId;
        let isHeroVisible = true;

        const heroElement = document.getElementById('hero');
        if (heroElement && 'IntersectionObserver' in window) {
            const heroObserver = new IntersectionObserver(([entry]) => {
                isHeroVisible = entry.isIntersecting;
                if (isHeroVisible && !animationFrameId) {
                    loop();
                }
            }, { threshold: 0.05 });
            heroObserver.observe(heroElement);
        }

        function loop() {
            if (!isHeroVisible) {
                animationFrameId = null;
                return;
            }
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < sparks.length; i++) {
                sparks[i].update();
                sparks[i].draw();
            }
            animationFrameId = requestAnimationFrame(loop);
        }

        loop();
    }
});
