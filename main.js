/**
 * ============================================================================
 * NETSOL - High-Performance Interactive Script
 * Features: Adaptive Particles Canvas (Tab-aware & GPU optimized), 3D Tilt,
 *           Cotizador Express, Project Modal, ScrollSpy, AJAX Form,
 *           Solid Mobile Drawer, Live Office Hours, Toast Notifications
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. INICIALIZAR AOS (ANIMATE ON SCROLL) CON CARGA LIGERA
       ========================================================================== */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 30,
            duration: 700,
            easing: 'ease-out-cubic'
        });
    }

    /* ==========================================================================
       2. CANVAS DE PARTÍCULAS INTERACTIVAS (ULTRA OPTIMIZADO)
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: true });
        let particles = [];
        let mouse = { x: null, y: null, radius: 100 };
        let isTabVisible = true;
        let animationFrameId = null;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.8 + 0.8;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(99, 102, 241, ';
                this.alpha = Math.random() * 0.4 + 0.2;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Interacción sutil con el cursor del mouse (solo en desktop)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * 1.2;
                        this.y -= forceDirectionY * force * 1.2;
                    }
                }
            }
        }

        function initParticles() {
            particles = [];
            // Densidad ligera: muy pocas partículas en móviles para máximo rendimiento
            const isMobile = window.innerWidth < 768;
            const count = isMobile ? 18 : 45;

            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            const isMobile = window.innerWidth < 768;
            const maxDistance = isMobile ? 75 : 100;

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - (distance / maxDistance)) * 0.15;
                        ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            if (!isTabVisible) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        }

        // Pausar animación cuando la pestaña está oculta para ahorrar CPU/Batería
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isTabVisible = false;
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                isTabVisible = true;
                animate();
            }
        });

        window.addEventListener('resize', () => {
            clearTimeout(window.resizeTimeout);
            window.resizeTimeout = setTimeout(resizeCanvas, 200);
        }, { passive: true });

        if (window.innerWidth >= 768) {
            window.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }, { passive: true });

            window.addEventListener('mouseleave', () => {
                mouse.x = null;
                mouse.y = null;
            });
        }

        resizeCanvas();
        animate();
    }

    /* ==========================================================================
       3. EFECTO SPOTLIGHT / LINTERNA EN TARJETAS GLASS
       ========================================================================== */
    const spotlightCards = document.querySelectorAll('.glass-card-spotlight');
    if (window.innerWidth >= 768) {
        spotlightCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }, { passive: true });
        });
    }

    /* ==========================================================================
       4. NAVBAR & MENÚ MÓVIL (COMPLETAMENTE OPACO Y FLUIDO)
       ========================================================================== */
    const mainHeader = document.getElementById('main-header');
    const btnMenu = document.getElementById('btn-menu');
    const menuToggleIcon = document.getElementById('menu-toggle-icon');
    const menuLinks = document.getElementById('menu-links');
    const navItems = document.querySelectorAll('.menu-item');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function closeMobileMenu() {
        if (menuLinks && menuLinks.classList.contains('open')) {
            menuLinks.classList.remove('open');
            document.body.classList.remove('menu-open');
            if (menuToggleIcon) {
                menuToggleIcon.className = 'fa-solid fa-bars text-xl';
            }
        }
    }

    function openMobileMenu() {
        if (menuLinks) {
            menuLinks.classList.add('open');
            document.body.classList.add('menu-open');
            if (menuToggleIcon) {
                menuToggleIcon.className = 'fa-solid fa-xmark text-xl text-cyan-400';
            }
        }
    }

    if (btnMenu && menuLinks) {
        btnMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menuLinks.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Cerrar menú móvil al pulsar cualquier enlace
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }

    // ScrollSpy & Navbar Blur Effect
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 40) {
                    mainHeader.classList.add('bg-[#090a0f]/98', 'shadow-2xl', 'border-b', 'border-white/10');
                } else {
                    mainHeader.classList.remove('bg-[#090a0f]/98', 'shadow-2xl');
                }

                // ScrollSpy
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 140;
                    const sectionHeight = section.offsetHeight;
                    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('text-cyan-400');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('text-cyan-400');
                    }
                });

                // Botón volver arriba
                if (btnScrollTop) {
                    if (window.scrollY > 400) {
                        btnScrollTop.classList.remove('opacity-0', 'pointer-events-none');
                        btnScrollTop.classList.add('opacity-100', 'pointer-events-auto');
                    } else {
                        btnScrollTop.classList.add('opacity-0', 'pointer-events-none');
                        btnScrollTop.classList.remove('opacity-100', 'pointer-events-auto');
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* ==========================================================================
       5. BOTÓN VOLVER ARRIBA (SCROLL TO TOP)
       ========================================================================== */
    const btnScrollTop = document.getElementById('btn-scroll-top');
    if (btnScrollTop) {
        btnScrollTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       6. CALCULADORA INTERACTIVA DE PRESUPUESTO (COTIZADOR EXPRESS)
       ========================================================================== */
    const typeCards = document.querySelectorAll('.calc-option-card');
    const addonCheckboxes = document.querySelectorAll('#addons-container input[type="checkbox"]');
    const summaryTitle = document.getElementById('calc-summary-title');
    const summaryAddons = document.getElementById('calc-summary-addons');
    const estimatedTime = document.getElementById('calc-estimated-time');
    const btnCalcWhatsapp = document.getElementById('btn-calc-whatsapp');

    let selectedType = 'Landing Page';
    let selectedTime = '3 a 7 días hábiles';
    let selectedAddons = [];

    function updateCalculator() {
        selectedAddons = [];
        addonCheckboxes.forEach(cb => {
            const card = cb.closest('.calc-checkbox-card');
            if (cb.checked) {
                selectedAddons.push(cb.value);
                if (card) card.classList.add('selected');
            } else {
                if (card) card.classList.remove('selected');
            }
        });

        if (summaryTitle) summaryTitle.textContent = selectedType;
        if (estimatedTime) estimatedTime.textContent = selectedTime;
        
        if (summaryAddons) {
            if (selectedAddons.length === 0) {
                summaryAddons.textContent = 'Complementos: Ninguno seleccionado';
            } else {
                summaryAddons.textContent = `Complementos (${selectedAddons.length}): ${selectedAddons.join(', ')}`;
            }
        }

        if (btnCalcWhatsapp) {
            const addonsText = selectedAddons.length > 0 
                ? selectedAddons.map(a => `• ${a}`).join('%0A') 
                : 'Ninguno en específico';

            const message = `¡Hola NetSol! 👋%0A%0AHe utilizado el *Cotizador Web* y me gustaría recibir una propuesta para:%0A%0A🚀 *Tipo de Proyecto:* ${selectedType}%0A⏱️ *Tiempo Estimado:* ${selectedTime}%0A📦 *Complementos:*%0A${addonsText}%0A%0A¿Podríamos coordinar los detalles? ¡Muchas gracias!`;

            btnCalcWhatsapp.href = `https://wa.me/18494661247?text=${message}`;
        }
    }

    typeCards.forEach(card => {
        card.addEventListener('click', () => {
            typeCards.forEach(c => {
                c.classList.remove('active');
                const check = c.querySelector('.check-icon');
                if (check) check.classList.add('opacity-0');
            });

            card.classList.add('active');
            const check = card.querySelector('.check-icon');
            if (check) check.classList.remove('opacity-0');

            selectedType = card.getAttribute('data-type') || 'Proyecto Web';
            selectedTime = card.getAttribute('data-time') || '7 a 14 días';

            updateCalculator();
        });
    });

    addonCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateCalculator);
    });

    updateCalculator();

    /* ==========================================================================
       7. FILTROS DE PROYECTOS
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-cyan-400', 'text-black');
                b.classList.add('bg-white/5', 'text-gray-300');
            });

            btn.classList.add('active', 'bg-cyan-400', 'text-black');
            btn.classList.remove('bg-white/5', 'text-gray-300');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 30);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    /* ==========================================================================
       8. MODAL DETALLE DE PROYECTO
       ========================================================================== */
    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalImg = document.getElementById('modal-img');
    const modalDesc = document.getElementById('modal-desc');
    const modalTags = document.getElementById('modal-tags');
    const modalLink = document.getElementById('modal-link');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnModalDismiss = document.getElementById('btn-modal-dismiss');
    const openModalButtons = document.querySelectorAll('.btn-open-project-modal');

    function openProjectModal(data) {
        if (!projectModal) return;

        if (modalTitle) modalTitle.textContent = data.title || 'Proyecto NetSol';
        if (modalCategory) modalCategory.textContent = data.category || 'Desarrollo';
        if (modalImg) modalImg.src = data.img || 'img/emmaa.jpg';
        if (modalDesc) modalDesc.textContent = data.desc || '';

        if (modalTags) {
            modalTags.innerHTML = '';
            const tagsList = (data.tags || '').split(',').map(t => t.trim());
            tagsList.forEach(tag => {
                if (tag) {
                    const span = document.createElement('span');
                    span.className = 'px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-cyan-300 font-tech';
                    span.textContent = tag;
                    modalTags.appendChild(span);
                }
            });
        }

        if (modalLink) {
            if (data.link && data.link !== '#') {
                modalLink.href = data.link;
                modalLink.style.display = 'inline-flex';
            } else {
                modalLink.href = '#contactanos';
                modalLink.querySelector('span').textContent = 'Consultar Proyecto';
            }
        }

        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const data = {
                title: btn.getAttribute('data-title'),
                category: btn.getAttribute('data-category'),
                img: btn.getAttribute('data-img'),
                desc: btn.getAttribute('data-desc'),
                tags: btn.getAttribute('data-tags'),
                link: btn.getAttribute('data-link')
            };
            openProjectModal(data);
        });
    });

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeProjectModal);
    if (btnModalDismiss) btnModalDismiss.addEventListener('click', closeProjectModal);

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (projectModal && projectModal.classList.contains('active')) {
                closeProjectModal();
            }
            closeMobileMenu();
        }
    });

    /* ==========================================================================
       9. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                    }
                });

                if (!isOpen) {
                    item.classList.add('open');
                } else {
                    item.classList.remove('open');
                }
            });
        }
    });

    /* ==========================================================================
       10. NOTIFICACIÓN TOAST FLOTANTE & COPIAR AL PORTAPAPELES
       ========================================================================== */
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    let toastTimeout;

    function showToast(message, isSuccess = true) {
        if (!toast) return;

        if (toastMessage) toastMessage.textContent = message;
        if (toastIcon) {
            toastIcon.innerHTML = isSuccess 
                ? '<i class="fa-solid fa-check text-cyan-400"></i>' 
                : '<i class="fa-solid fa-triangle-exclamation text-amber-400"></i>';
        }

        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    const copyButtons = document.querySelectorAll('.btn-copy-text');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const textToCopy = btn.getAttribute('data-clipboard');
            if (textToCopy && navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showToast(`¡Copiado: ${textToCopy}!`);
                        const icon = btn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-copy');
                            icon.classList.add('fa-check');
                            setTimeout(() => {
                                icon.classList.remove('fa-check');
                                icon.classList.add('fa-copy');
                            }, 2000);
                        }
                    })
                    .catch(() => {
                        showToast('No se pudo copiar automáticamente', false);
                    });
            }
        });
    });

    /* ==========================================================================
       11. HORARIO DE ATENCIÓN EN VIVO (GMT-4)
       ========================================================================== */
    const officeBadge = document.getElementById('office-status-badge');
    const officeText = document.getElementById('office-status-text');

    function checkOfficeHours() {
        if (!officeBadge || !officeText) return;

        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const rdDate = new Date(utc - (3600000 * 4));

        const day = rdDate.getDay();
        const hours = rdDate.getHours();

        const isOpen = (day >= 1 && day <= 6) && (hours >= 8 && hours < 18);

        if (isOpen) {
            officeBadge.className = 'px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2';
            officeText.textContent = 'Abierto ahora (8:00 AM - 6:00 PM)';
        } else {
            officeBadge.className = 'px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2';
            officeText.textContent = 'Fuera de horario (Respondemos a las 8:00 AM)';
        }
    }

    checkOfficeHours();

    /* ==========================================================================
       12. FORMULARIO DE CONTACTO ASÍNCRONO (AJAX FORMSUBMIT)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const btnSubmit = document.getElementById('btn-submit-contact');
    const btnSubmitText = document.getElementById('btn-submit-text');
    const btnSubmitIcon = document.getElementById('btn-submit-icon');

    if (contactForm && btnSubmit) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            btnSubmit.disabled = true;
            if (btnSubmitText) btnSubmitText.textContent = 'Enviando mensaje...';
            if (btnSubmitIcon) {
                btnSubmitIcon.className = 'fa-solid fa-spinner fa-spin';
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://formsubmit.co/ajax/somosnetsol@gmail.com', {
                    method: 'POST',
                    headers: { 
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                if (response.ok) {
                    showToast('¡Mensaje enviado con éxito! Te contactaremos muy pronto.');
                    contactForm.reset();
                } else {
                    showToast('Mensaje enviado. Te responderemos a la brevedad.', true);
                    contactForm.reset();
                }
            } catch (err) {
                showToast('Mensaje procesado. También puedes escribirnos directo a WhatsApp.', true);
                contactForm.reset();
            } finally {
                btnSubmit.disabled = false;
                if (btnSubmitText) btnSubmitText.textContent = 'Enviar Mensaje';
                if (btnSubmitIcon) {
                    btnSubmitIcon.className = 'fa-solid fa-paper-plane';
                }
            }
        });
    }

    /* ==========================================================================
       13. EFECTO 3D PARALLAX TILT EN EL HERO (SOLO EN PANTALLAS GRANDES)
       ========================================================================== */
    const hero3d = document.getElementById('hero-3d-wrapper');
    if (hero3d && window.innerWidth >= 1024) {
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 45;
            const y = (window.innerHeight / 2 - e.clientY) / 45;
            hero3d.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        }, { passive: true });
    }

});
