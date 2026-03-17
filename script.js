/**
 * Main Web Application Scripts
 * Combines scroll reveals, modal management, and carousel functionality.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Inicia os ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* =========================================================================
       Scroll Reveal Animation
       ========================================================================= */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        if (!revealElements.length) return;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // Adiciona a classe ativa se o elemento estiver visível
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    // Inicializa as animações na carga da página e no scroll
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    /* =========================================================================
       Modal Management System
       ========================================================================= */
    
    // Função para abrir o modal
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('opacity-0', 'pointer-events-none');
        
        const innerDiv = modal.querySelector('div');
        if (innerDiv) {
            innerDiv.classList.remove('scale-95', 'opacity-0');
            innerDiv.classList.add('scale-100', 'opacity-100');
        }
        
        // Previne scroll do body quando modal está aberto
        document.body.style.overflow = 'hidden';
    };

    // Função para fechar o modal
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const innerDiv = modal.querySelector('div');
        if (innerDiv) {
            innerDiv.classList.remove('scale-100', 'opacity-100');
            innerDiv.classList.add('scale-95', 'opacity-0');
        }
        
        setTimeout(() => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            // Restaura o scroll do body
            document.body.style.overflow = 'auto';
        }, 300);
    };

    // Adiciona event listeners aos botões que abrem os modais
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-modal-target');
            openModal(targetId);
        });
    });

    // Adiciona event listeners para fechar modais (botões X e clique fora)
    const modals = document.querySelectorAll('[id^="modal-"]');
    modals.forEach(modal => {
        // Fechar ao clicar fora do conteúdo central
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });

        // Associar o botão de fechar dentro do modal
        const closeBtn = modal.querySelector('[data-modal-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeModal(modal.id);
            });
        }
    });

    // Fechar modais ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (!modal.classList.contains('opacity-0')) {
                    closeModal(modal.id);
                }
            });
        }
    });


    /* =========================================================================
       Testimonials Carousel Logic
       ========================================================================= */
    const wrapper = document.getElementById('testimonialWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotContainer = document.getElementById('dotContainer');
    
    // Assegura que todos os elementos necessários existem antes de iniciar a lógica do carrossel
    if (wrapper && prevBtn && nextBtn && dotContainer) {
        let currentIndex = 0;
        const cards = Array.from(wrapper.children);
        
        const getNumVisibleCards = () => window.innerWidth >= 768 ? 3 : 1;

        const createDots = () => {
            const numVisible = getNumVisibleCards();
            const numDots = Math.max(1, cards.length - (numVisible - 1));
            
            dotContainer.innerHTML = ''; // Limpa as bolinhas anteriores
            
            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('div');
                dot.className = `dot ${i === currentIndex ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Ir para o depoimento ${i + 1}`);
                dot.role = "button";
                dot.tabIndex = 0;
                
                // Trata o clique ou Enter nas bolinhas
                dot.onclick = () => { 
                    currentIndex = i; 
                    updateCarousel(); 
                };
                dot.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        currentIndex = i; 
                        updateCarousel(); 
                    }
                };
                
                dotContainer.appendChild(dot);
            }
        };

        const updateCarousel = () => {
            // Se não houver cartões, não tenta atualizar
            if (!cards.length) return;
            
            // Assume que todos os cartões têm a mesma largura e o gap é de 32px (2rem do tailwind gap-8)
            const gapWidth = 32;
            const cardWidth = cards[0].offsetWidth + gapWidth;
            
            wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // Atualiza estado ativo das bolinhas de navegação
            Array.from(dotContainer.children).forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        nextBtn.onclick = () => {
            const numVisible = getNumVisibleCards();
            // Volta para 0 quando atinge o fim dos elementos não visíveis
            currentIndex = (currentIndex < cards.length - numVisible) ? currentIndex + 1 : 0;
            updateCarousel();
        };

        prevBtn.onclick = () => {
            const numVisible = getNumVisibleCards();
            // Vai para o último elemento válido quando no início
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : Math.max(0, cards.length - numVisible);
            updateCarousel();
        };

        // Recalcula carrossel em redimensionamento de janela (para Responsividade)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentIndex = 0; // Opcional: reiniciar index em resize, ou manter (adiciona complexidade mantendo a view proporcional)
                createDots();
                updateCarousel();
            }, 250);
        });

        // Setup inicial
        createDots();
        // Um pequeno timeout garantindo que fontes e CSS foram rendenrizados antes de calcular as larguras
        setTimeout(updateCarousel, 100); 
    }
});
