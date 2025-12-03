/* script.js - vanilla JS para funcionalidades solicitadas
   Funcionalidades:
   - Carrossel automático e controle manual
   - Filtros por geração e tipo
   - Hover thumbnails trocam imagem principal
   - Adicionar ao carrinho (contador)
   - Modal de compra rápida
   - Dropdown de usuário e hamburger toggle
*/

// =================================
// CONFIGURAÇÃO E INICIALIZAÇÃO
// =================================

// Config
const cfg = window.RETRO_CONFIG?.selectors || {
  carousel:'#main-carousel',
  indicators:'.indicator',
  productGrid:'#products-grid',
  addCartBtn:'.add-cart',
  cartCount:'#cart-count',
  buyNow:'.buy-now',
  quickBuyModal:'#quick-buy-modal',
  userMenu:'#user-menu',
  btnHamburger:'#btn-hamburger'
};

// Verifica se estamos na página de login
function isLoginPage() {
  return document.querySelector('.login-container') !== null;
}

// Verifica se estamos na página de checkout
function isCheckoutPage() {
  return document.querySelector('.checkout-page') !== null;
}

// =================================
// FUNCIONALIDADES DA PÁGINA DE LOGIN
// =================================

function initLoginPage() {
  console.log('Inicializando página de login...');
  
  // Toggle entre abas Login/Cadastro
  const loginTabs = document.querySelectorAll('.login-tab');
  const loginForms = document.querySelectorAll('.login-form');
  
  if (loginTabs.length > 0) {
    loginTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // Atualizar abas ativas
        loginTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Mostrar formulário correspondente
        loginForms.forEach(form => {
          form.classList.remove('active');
          if (form.id === `${targetTab}-form`) {
            form.classList.add('active');
          }
        });
      });
    });
  }
  
  // Toggle visibilidade da senha
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      const icon = this.querySelector('svg');
      
      if (input.type === 'password') {
        input.type = 'text';
        // Ícone de olho fechado
        icon.innerHTML = '<path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
      } else {
        input.type = 'password';
        // Ícone de olho aberto
        icon.innerHTML = '<path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
      }
    });
  });
  
  // Validação de força da senha (cadastro)
  const registerPassword = document.getElementById('register-password');
  if (registerPassword) {
    registerPassword.addEventListener('input', function() {
      const strengthBar = document.querySelector('.strength-bar');
      const strengthText = document.querySelector('.strength-text');
      
      if (!strengthBar || !strengthText) return;
      
      const password = this.value;
      let strength = 0;
      
      // Verificar comprimento
      if (password.length >= 8) strength += 25;
      
      // Verificar letras maiúsculas e minúsculas
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
      
      // Verificar números
      if (/\d/.test(password)) strength += 25;
      
      // Verificar caracteres especiais
      if (/[^a-zA-Z\d]/.test(password)) strength += 25;
      
      // Atualizar barra e texto
      strengthBar.style.width = `${strength}%`;
      
      if (strength < 50) {
        strengthBar.style.backgroundColor = '#ff4444';
        strengthText.textContent = 'Força da senha: Fraca';
      } else if (strength < 75) {
        strengthBar.style.backgroundColor = '#ffa726';
        strengthText.textContent = 'Força da senha: Média';
      } else {
        strengthBar.style.backgroundColor = '#4caf50';
        strengthText.textContent = 'Força da senha: Forte';
      }
    });
  }
  
  // Validação de confirmação de senha
  const confirmPassword = document.getElementById('register-confirm');
  if (confirmPassword && registerPassword) {
    confirmPassword.addEventListener('input', function() {
      if (this.value !== registerPassword.value) {
        this.style.borderColor = '#ff4444';
      } else {
        this.style.borderColor = 'rgba(255,255,255,0.07)';
      }
    });
  }
  
  // Modal de recuperação de senha
  const forgotPasswordLink = document.querySelector('.forgot-password');
  const forgotModal = document.getElementById('forgot-password-modal');
  const forgotClose = document.getElementById('forgot-close');
  const cancelRecovery = document.getElementById('cancel-recovery');
  
  if (forgotPasswordLink && forgotModal) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      forgotModal.classList.add('show');
    });
    
    const closeForgotModal = () => {
      forgotModal.classList.remove('show');
    };
    
    if (forgotClose) forgotClose.addEventListener('click', closeForgotModal);
    if (cancelRecovery) cancelRecovery.addEventListener('click', closeForgotModal);
    
    // Fechar modal clicando fora
    forgotModal.addEventListener('click', function(e) {
      if (e.target === this) closeForgotModal();
    });
  }
  
  // Simulação de login/cadastro
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('.btn-login');
      const originalText = submitBtn.textContent;
      
      // Simular loading
      submitBtn.textContent = 'Entrando...';
      submitBtn.disabled = true;
      
      // Simular requisição
      setTimeout(() => {
        // Aqui seria a lógica real de autenticação
        alert('Login simulado com sucesso! Redirecionando...');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Redirecionar para a página inicial
        window.location.href = 'index.html';
      }, 1500);
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('.btn-login');
      const originalText = submitBtn.textContent;
      
      // Validar senha
      const password = document.getElementById('register-password').value;
      const confirm = document.getElementById('register-confirm').value;
      
      if (password !== confirm) {
        alert('As senhas não coincidem!');
        return;
      }
      
      // Simular loading
      submitBtn.textContent = 'Criando conta...';
      submitBtn.disabled = true;
      
      // Simular requisição
      setTimeout(() => {
        alert('Conta criada com sucesso! Faça login para continuar.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Voltar para aba de login
        document.querySelector('.login-tab[data-tab="login"]').click();
      }, 1500);
    });
  }
  
  // Login social (simulação)
  const socialButtons = document.querySelectorAll('.btn-social');
  socialButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
      alert(`Login com ${provider} seria implementado aqui!`);
    });
  });
  
  console.log('Página de login inicializada com sucesso!');
}

// =================================
// FUNCIONALIDADES GLOBAIS (header, footer)
// =================================

function initGlobalFeatures() {
  console.log('Inicializando funcionalidades globais...');
  
  // User dropdown
  const userBtn = document.querySelector('.user-dropdown .icon-btn');
  const userMenu = document.getElementById('user-menu');
  
  if (userBtn && userMenu) {
    userBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!isExpanded));
      userMenu.style.display = isExpanded ? 'none' : 'block';
    });
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function() {
      if (userMenu) userMenu.style.display = 'none';
      if (userBtn) userBtn.setAttribute('aria-expanded', 'false');
    });
    
    // Prevenir que clicks dentro do dropdown fechem ele
    userMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  // Hamburger menu (para mobile)
  const hamburger = document.getElementById('btn-hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      const bars = this.querySelectorAll('.bar');
      
      if (this.classList.contains('active')) {
        bars[0].style.transform = 'translateY(6px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-6px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });
  }
  
  // Footer year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  console.log('Funcionalidades globais inicializadas!');
}

// =================================
// FUNCIONALIDADES DA PÁGINA INICIAL (CATÁLOGO)
// =================================

function initCatalogPage() {
  console.log('Inicializando página de catálogo...');
  
  /* ---------- CARROSSEL ---------- */
  const carouselRoot = document.querySelector(cfg.carousel);
  if (carouselRoot) {
    const track = carouselRoot.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const prevBtn = carouselRoot.querySelector('.carousel-nav.prev');
    const nextBtn = carouselRoot.querySelector('.carousel-nav.next');
    const indicators = Array.from(carouselRoot.querySelectorAll('.indicator'));
    let index = 0;
    let autoplay = true;
    const delay = 4500;
    let timer;

    function goTo(i){
      index = (i + slides.length) % slides.length;
      const offset = -index * 100;
      track.style.transform = `translateX(${offset}%)`;
      indicators.forEach((b,idx)=> b.classList.toggle('active', idx===index));
      slides.forEach((s,idx)=> s.setAttribute('aria-hidden', idx!==index));
    }

    function next(){ goTo(index+1) }
    function prev(){ goTo(index-1) }

    nextBtn?.addEventListener('click', ()=>{ autoplay=false; next(); resetTimer(); });
    prevBtn?.addEventListener('click', ()=>{ autoplay=false; prev(); resetTimer(); });
    indicators.forEach((btn,idx)=> btn.addEventListener('click', ()=>{ autoplay=false; goTo(idx); resetTimer(); }));

    function resetTimer(){
      clearInterval(timer);
      if (autoplay) timer = setInterval(next, delay);
      else timer = setInterval(()=>{ autoplay=true; next(); }, delay*4);
    }

    // start
    goTo(0);
    timer = setInterval(next, delay);

    // pause on hover
    carouselRoot.addEventListener('mouseenter', ()=>{ clearInterval(timer); });
    carouselRoot.addEventListener('mouseleave', ()=>{ if(autoplay) resetTimer(); });
  }

  /* ---------- FILTROS E CATEGORIAS ---------- */
  const productGrid = document.querySelector(cfg.productGrid);
  const productCards = productGrid ? Array.from(productGrid.querySelectorAll('.product-card')) : [];
  const filterInputs = Array.from(document.querySelectorAll('.filter-checkbox'));
  const categoryButtons = Array.from(document.querySelectorAll('.pill-btn'));
  const noResults = productGrid?.querySelector('.no-results');

  // maintain active filters state
  const state = {
    gens: new Set(),
    type: null,
    search: ''
  };

  function applyFilters(){
    let visibleCount = 0;
    productCards.forEach(card=>{
      const gen = card.getAttribute('data-gen') || '';
      const type = card.getAttribute('data-type') || '';
      // generation filter: if any gen filters selected, card must match any selected
      if (state.gens.size > 0 && ![...state.gens].includes(gen)){
        card.style.display = 'none'; return;
      }
      // type filter
      if (state.type && state.type !== type){
        card.style.display = 'none'; return;
      }
      // search filter (name + tags)
      const name = card.querySelector('.product-name')?.textContent?.toLowerCase()||'';
      const tags = (card.getAttribute('data-tags')||'').toLowerCase();
      if (state.search && !(name.includes(state.search) || tags.includes(state.search))){
        card.style.display = 'none'; return;
      }
      card.style.display = ''; visibleCount++;
    });
    if (noResults) noResults.hidden = visibleCount > 0;
  }

  // checkbox listeners
  filterInputs.forEach(cb=>{
    cb.addEventListener('change', (e)=>{
      const val = e.target.getAttribute('data-value');
      if (e.target.checked) state.gens.add(val);
      else state.gens.delete(val);
      applyFilters();
    });
  });

  // category buttons
  categoryButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const t = btn.getAttribute('data-type');
      // toggle
      if (state.type === t){ state.type = null; btn.removeAttribute('data-active'); }
      else {
        state.type = t;
        // visual
        categoryButtons.forEach(b=> b.setAttribute('data-active', b===btn));
      }
      applyFilters();
    });
  });

  // search box
  const searchInput = document.getElementById('search-input');
  if (searchInput){
    let typing;
    searchInput.addEventListener('input', (e)=>{
      clearTimeout(typing);
      typing = setTimeout(()=>{
        state.search = e.target.value.trim().toLowerCase();
        applyFilters();
      }, 300);
    });
    // prevent form submit default (optional)
    searchInput.closest('form')?.addEventListener('submit', (ev)=>{ ev.preventDefault(); });
  }

  /* ---------- THUMBNAILS HOVER TO CHANGE MAIN IMAGE ---------- */
  productCards.forEach(card=>{
    const main = card.querySelector('.thumb-main');
    const thumbs = Array.from(card.querySelectorAll('.thumb'));
    thumbs.forEach(t=>{
      t.addEventListener('mouseenter', ()=>{ main.src = t.src; });
      // for accessibility: keyboard focus
      t.addEventListener('focus', ()=>{ main.src = t.src; });
    });

    // small mini-carousel on hover with arrow keys for each card (left/right)
    let idx = 0;
    card.addEventListener('keydown', (e)=>{
      const images = [main.src].concat(thumbs.map(x=>x.src));
      if (e.key === 'ArrowRight'){ idx = (idx+1) % images.length; main.src = images[idx]; }
      if (e.key === 'ArrowLeft'){ idx = (idx-1 + images.length) % images.length; main.src = images[idx]; }
    });
  });

  /* ---------- CARRINHO: adicionar e contador ---------- */
  const cartCountEl = document.querySelector(cfg.cartCount);
  let cartCount = 0;
  function updateCartUI(){
    if (cartCountEl) cartCountEl.textContent = cartCount;
  }
  // add to cart buttons
  const addBtns = Array.from(document.querySelectorAll(cfg.addCartBtn));
  addBtns.forEach(b=>{
    b.addEventListener('click', (e)=>{
      const id = b.getAttribute('data-product-id') || 'unknown';
      cartCount++;
      updateCartUI();
      // micro feedback: pulse animation
      b.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:220});
      // tooltip simple
      b.setAttribute('title','Adicionado!');
      setTimeout(()=> b.setAttribute('title','Adicionar ao carrinho'),900);
    });
  });

  /* ---------- MODAL COMPRA RÁPIDA (buy now) ---------- */
  const modal = document.querySelector(cfg.quickBuyModal);
  const modalName = modal?.querySelector('.modal-product-name');
  const modalPrice = modal?.querySelector('.modal-product-price');
  const confirmBuy = modal?.querySelector('#confirm-buy');
  const cancelBuy = modal?.querySelector('#cancel-buy');
  const modalClose = modal?.querySelector('#modal-close');

  function openModal(productEl){
    const name = productEl.querySelector('.product-name')?.textContent || 'Produto';
    const price = productEl.querySelector('.product-price')?.textContent || '';
    if (modalName) modalName.textContent = name;
    if (modalPrice) modalPrice.textContent = price;
    modal.classList.add('show'); modal.parentElement.classList.add('show'); // overlay + modal
    modal.parentElement.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    modal?.parentElement.classList.remove('show');
    modal?.classList.remove('show');
    modal?.parentElement.setAttribute('aria-hidden','true');
  }

  // bind buy now
  const buyNowBtns = Array.from(document.querySelectorAll(cfg.buyNow));
  buyNowBtns.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const pid = btn.getAttribute('data-product-id');
      const card = document.querySelector(`.product-card [data-product-id="${pid}"]`)?.closest('.product-card') || btn.closest('.product-card');
      if (card) openModal(card);
    });
  });

  modalClose?.addEventListener('click', closeModal);
  cancelBuy?.addEventListener('click', closeModal);
  if (confirmBuy){
    confirmBuy.addEventListener('click', ()=>{
      // simulate purchase: increase cart or reset? Aqui só feedback
      cartCount++;
      updateCartUI();
      closeModal();
      // small confirmation
      alert('Compra confirmada! Obrigado :)');
      window.location.href = "checkout.html";
    });
  }

  // close modal when clicking overlay but not when clicking modal itself
  document.querySelectorAll('.modal-overlay').forEach(ov=>{
    ov.addEventListener('click', (ev)=>{
      if (ev.target === ov) closeModal();
    });
  });

  /* ---------- INITIAL UI SETUP ---------- */
  updateCartUI();

  console.log('Página de catálogo inicializada com sucesso!');
}

// =================================
// FUNCIONALIDADES DO CHECKOUT
// =================================

function initCheckoutPage() {
  console.log('Inicializando página de checkout...');
  
  // Configuração do checkout
  const checkoutConfig = window.CHECKOUT_CONFIG || {
    shippingOptions: {
      economico: { price: 0, days: '5-8' },
      padrao: { price: 19.90, days: '3-5' },
      expresso: { price: 39.90, days: '1-2' }
    },
    couponCodes: {
      'FIVE5': 5,
      'TEN10': 10,
      'WELCOME15': 15
    }
  };

    // Estado do checkout
  const checkoutState = {
    currentStep: 1, // Começa na etapa de identificação (antes era 2)
    shippingMethod: 'economico',
    paymentMethod: 'credit',
    couponApplied: null,
    couponDiscount: 0,
    subtotal: 949.80,
    shippingPrice: 0,
    total: 949.80
  };

    // Remover 'novalidate' é opicional; preferimos forçar novalidate para evitar bloqueios de required
  document.querySelectorAll('.checkout-section form').forEach(f => {
    f.setAttribute('novalidate', 'novalidate');
    f.addEventListener('submit', function(e){ e.preventDefault(); });
  });



  // Inicializar funcionalidades do checkout
  setupCheckoutSteps();
  setupCepSearch();
  setupShippingOptions();
  setupPaymentTabs();
  setupCoupon();
  setupCheckoutActions();
  updateOrderSummary();
  
  console.log('Checkout inicializado com sucesso!');

  // =================================
  // FUNÇÕES DO CHECKOUT
  // =================================

  function setupCheckoutSteps() {
    updateProgressIndicator();
  }

  function updateProgressIndicator() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach(step => {
      const stepNumber = parseInt(step.getAttribute('data-step'));
      
      if (stepNumber < checkoutState.currentStep) {
        step.classList.add('completed');
        step.classList.add('active');
      } else if (stepNumber === checkoutState.currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
    
    // Mostrar/ocultar seções conforme a etapa atual
    document.querySelectorAll('.checkout-section').forEach(section => {
      section.style.display = 'none';
    });
    
    
    if (checkoutState.currentStep === 1) {
      const idSection = document.getElementById('identification-section');
      if (idSection) idSection.style.display = 'block';
    } else if (checkoutState.currentStep === 2) {
      const deliverySection = document.getElementById('delivery-section');
      if (deliverySection) deliverySection.style.display = 'block';
    } else if (checkoutState.currentStep === 3) {
      const paymentSection = document.getElementById('payment-section');
      if (paymentSection) paymentSection.style.display = 'block';
    } else if (checkoutState.currentStep === 4) {
      const reviewSection = document.getElementById('review-section');
      if (reviewSection) {
        reviewSection.style.display = 'block';
        updateReviewSection();
      }
    }
  }

  function setupCepSearch() {
    const cepInput = document.getElementById('cep');
    const cepSearchBtn = document.getElementById('cep-search');
    
    if (cepInput) {
      // Formatação automática do CEP
      cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 5) {
          value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        
        e.target.value = value;
        
        // Busca automática quando CEP estiver completo
        if (value.length === 9) {
          searchCep(value);
        }
      });
      
      // Busca manual pelo botão
      if (cepSearchBtn) {
        cepSearchBtn.addEventListener('click', function() {
          searchCep(cepInput.value);
        });
      }
    }
  }

  function searchCep(cep) {
    const formattedCep = cep.replace(/\D/g, '');
    
    if (formattedCep.length !== 8) {
      showCheckoutMessage('Por favor, digite um CEP válido com 8 dígitos.', 'error');
      return;
    }
    
    // Simulação de busca de CEP
    showCheckoutLoading('Buscando endereço...');
    
    setTimeout(() => {
      hideCheckoutLoading();
      
      // Dados simulados baseados no CEP
      const mockAddresses = {
        '01001000': { street: 'Praça da Sé', neighborhood: 'Sé', city: 'São Paulo', state: 'SP' },
        '20040000': { street: 'Rua da Alfândega', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'RJ' },
        '40010000': { street: 'Rua Chile', neighborhood: 'Centro', city: 'Salvador', state: 'BA' }
      };
      
      const address = mockAddresses[formattedCep] || {
        street: 'Rua Exemplo',
        neighborhood: 'Bairro Exemplo',
        city: 'Cidade Exemplo',
        state: 'SP'
      };
      
      // Preencher campos do endereço
      const streetInput = document.getElementById('street');
      const neighborhoodInput = document.getElementById('neighborhood');
      const cityInput = document.getElementById('city');
      const stateInput = document.getElementById('state');
      
      if (streetInput) streetInput.value = address.street;
      if (neighborhoodInput) neighborhoodInput.value = address.neighborhood;
      if (cityInput) cityInput.value = address.city;
      if (stateInput) stateInput.value = address.state;
      
      showCheckoutMessage('Endereço preenchido automaticamente! Verifique e ajuste se necessário.', 'success');
    }, 1500);
  }

  function setupShippingOptions() {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    
    shippingOptions.forEach(option => {
      option.addEventListener('change', function() {
        if (this.checked) {
          checkoutState.shippingMethod = this.value;
          updateShippingPrice();
          updateOrderSummary();
        }
      });
    });
  }

  function updateShippingPrice() {
    const shippingOption = checkoutConfig.shippingOptions[checkoutState.shippingMethod];
    checkoutState.shippingPrice = shippingOption.price;
    
    // Atualizar exibição no resumo
    const summaryShipping = document.getElementById('summary-shipping');
    if (summaryShipping) {
      summaryShipping.textContent = shippingOption.price === 0 ? 'Grátis' : `R$ ${shippingOption.price.toFixed(2)}`;
    }
    
    // Atualizar tempo de entrega no resumo
    const summaryDeliveryTime = document.getElementById('summary-delivery-time');
    if (summaryDeliveryTime) {
      summaryDeliveryTime.textContent = `${shippingOption.days} dias úteis`;
    }
  }

  function setupPaymentTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    
    tabHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Atualizar cabeçalhos das abas
        tabHeaders.forEach(h => h.classList.remove('active'));
        this.classList.add('active');
        
        // Atualizar conteúdo das abas
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        const tabContent = document.getElementById(`${tabId}-tab`);
        if (tabContent) tabContent.classList.add('active');
        
        // Atualizar método de pagamento no estado
        checkoutState.paymentMethod = tabId;
        updateOrderSummary();
      });
    });
    
    // Formatação de campos de cartão
    setupCardInputs();
  }

  function setupCardInputs() {
    // Formatação do número do cartão
    const cardNumberInputs = document.querySelectorAll('input[type="text"][id*="card-number"]');
    
    cardNumberInputs.forEach(input => {
      input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
          value = value.match(/.{1,4}/g).join(' ');
        }
        
        e.target.value = value.substring(0, 19);
      });
    });
    
    // Formatação da validade do cartão
    const expiryInputs = document.querySelectorAll('input[type="text"][id*="expiry"]');
    
    expiryInputs.forEach(input => {
      input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 2) {
          value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value.substring(0, 5);
      });
    });
    
    // Botão de copiar código PIX
    const copyPixBtn = document.getElementById('copy-pix');
    if (copyPixBtn) {
      copyPixBtn.addEventListener('click', function() {
        const pixCodeElement = document.getElementById('pix-code');
        if (!pixCodeElement) return;
        
        const pixCode = pixCodeElement.textContent;
        
        navigator.clipboard.writeText(pixCode).then(() => {
          const originalText = this.textContent;
          this.textContent = 'Copiado!';
          
          setTimeout(() => {
            this.textContent = originalText;
          }, 2000);
        });
      });
    }
    
    // Botão de gerar boleto
    const generateBoletoBtn = document.getElementById('generate-boleto');
    if (generateBoletoBtn) {
      generateBoletoBtn.addEventListener('click', function() {
        // Simular geração de boleto
        showCheckoutLoading('Gerando boleto...');
        
        setTimeout(() => {
          hideCheckoutLoading();
          showCheckoutMessage('Boleto gerado com sucesso! Verifique seu e-mail.', 'success');
        }, 2000);
      });
    }
  }

  function setupCoupon() {
    const applyCouponBtn = document.getElementById('apply-coupon');
    const couponInput = document.getElementById('coupon-code');
    
    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener('click', function() {
        applyCoupon(couponInput.value);
      });
      
      couponInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyCoupon(this.value);
        }
      });
    }
  }

  function applyCoupon(code) {
    const couponCode = code.toUpperCase().trim();
    const feedback = document.getElementById('coupon-feedback');
    
    if (!feedback) return;
    
    if (!couponCode) {
      feedback.textContent = 'Por favor, digite um código de cupom.';
      feedback.className = 'error';
      return;
    }
    
    if (checkoutConfig.couponCodes[couponCode]) {
      const discount = checkoutConfig.couponCodes[couponCode];
      checkoutState.couponApplied = couponCode;
      checkoutState.couponDiscount = discount;
      
      feedback.textContent = `Cupom aplicado! ${discount}% de desconto.`;
      feedback.className = 'success';
      
      updateOrderSummary();
    } else {
      checkoutState.couponApplied = null;
      checkoutState.couponDiscount = 0;
      
      feedback.textContent = 'Cupom inválido ou expirado.';
      feedback.className = 'error';
      
      updateOrderSummary();
    }
  }

  function updateOrderSummary() {
    // Atualizar preços
    updateShippingPrice();
    calculateTotals();
    
    // Atualizar endereço no resumo
    updateSummaryAddress();
    
    // Atualizar método de pagamento no resumo
    updateSummaryPayment();
  }

  function calculateTotals() {
    // Calcular desconto
    const discountAmount = (checkoutState.subtotal * checkoutState.couponDiscount) / 100;
    
    // Calcular total
    checkoutState.total = checkoutState.subtotal + checkoutState.shippingPrice - discountAmount;
    
    // Atualizar exibição
    const summaryDiscount = document.getElementById('summary-discount');
    const summaryTotal = document.getElementById('summary-total');
    
    if (summaryDiscount) {
      summaryDiscount.textContent = `R$ ${discountAmount.toFixed(2)}`;
    }
    
    if (summaryTotal) {
      summaryTotal.textContent = `R$ ${checkoutState.total.toFixed(2)}`;
    }
  }

  function updateSummaryAddress() {
    const street = document.getElementById('street')?.value || '';
    const number = document.getElementById('number')?.value || '';
    const neighborhood = document.getElementById('neighborhood')?.value || '';
    const city = document.getElementById('city')?.value || '';
    const state = document.getElementById('state')?.value || '';
    
    const summaryAddress = document.getElementById('summary-delivery-address');
    
    if (summaryAddress && street && number && neighborhood && city && state) {
      summaryAddress.textContent = `${street}, ${number} - ${neighborhood}, ${city}/${state}`;
    }
  }

  function updateSummaryPayment() {
    const paymentMethods = {
      'credit': 'Cartão de Crédito',
      'pix': 'PIX',
      'boleto': 'Boleto Bancário',
      'debit': 'Cartão de Débito'
    };
    
    const summaryPayment = document.getElementById('summary-payment-method');
    
    if (summaryPayment) {
      summaryPayment.textContent = paymentMethods[checkoutState.paymentMethod] || 'Método não selecionado';
    }
  }

  function updateReviewSection() {
    // Atualizar itens na revisão
    updateReviewItems();
    
    // Atualizar endereço na revisão
    updateReviewAddress();
    
    // Atualizar pagamento na revisão
    updateReviewPayment();
  }

  function updateReviewItems() {
    const reviewItemsContainer = document.querySelector('.review-items');
    if (!reviewItemsContainer) return;
    
    // Limpar itens existentes
    reviewItemsContainer.innerHTML = '';
    
    // Adicionar itens (simulação)
    const items = [
      { name: 'PlayStation clássico — Revisado', price: 799.90, qty: 1, image: 'img/ps1/ps1-1.png' },
      { name: 'Super Mario World (Cartucho SNES)', price: 149.90, qty: 1, image: 'img/supermario/mario-1.jpg' }
    ];
    
    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'review-item';
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="review-item-details">
          <div class="review-item-name">${item.name}</div>
          <div class="review-item-qty">Quantidade: ${item.qty}</div>
          <div class="review-item-price">R$ ${item.price.toFixed(2)}</div>
        </div>
      `;
      
      reviewItemsContainer.appendChild(itemElement);
    });
  }

  function updateReviewAddress() {
    const street = document.getElementById('street')?.value || '';
    const number = document.getElementById('number')?.value || '';
    const complement = document.getElementById('complement')?.value || '';
    const neighborhood = document.getElementById('neighborhood')?.value || '';
    const city = document.getElementById('city')?.value || '';
    const state = document.getElementById('state')?.value || '';
    
    const reviewAddress = document.getElementById('review-address');
    
    if (reviewAddress) {
      let addressHTML = `
        <p><strong>${street}, ${number}</strong></p>
        <p>${complement ? `Complemento: ${complement}<br>` : ''}
        ${neighborhood}<br>
        ${city} - ${state}</p>
      `;
      
      reviewAddress.innerHTML = addressHTML;
    }
  }

  function updateReviewPayment() {
    const paymentMethods = {
      'credit': 'Cartão de Crédito',
      'pix': 'PIX (5% de desconto aplicado)',
      'boleto': 'Boleto Bancário',
      'debit': 'Cartão de Débito'
    };
    
    const reviewPayment = document.getElementById('review-payment');
    
    if (reviewPayment) {
      reviewPayment.innerHTML = `
        <p><strong>${paymentMethods[checkoutState.paymentMethod]}</strong></p>
        ${checkoutState.couponApplied ? `<p>Cupom aplicado: ${checkoutState.couponApplied} (${checkoutState.couponDiscount}% off)</p>` : ''}
      `;
    }
  }

    function setupCheckoutActions() {
    // NOVO: Botão "Continuar para Entrega" (da etapa 1 para 2)
    // Adicionamos o listener para o primeiro botão do checkout.
    const continueToDeliveryBtn = document.getElementById('continue-to-delivery');
    if (continueToDeliveryBtn) {
      continueToDeliveryBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Previne o envio do formulário
        checkoutState.currentStep = 2; // Avança para a etapa de Entrega
        updateProgressIndicator();
      });
    }

    // Botão "Continuar para Pagamento" (da etapa 2 para 3)
    // A lógica original já avançava sem validar.
    const continueToPaymentBtn = document.getElementById('continue-to-payment');
    if (continueToPaymentBtn) {
      continueToPaymentBtn.addEventListener('click', function(e) {
        e.preventDefault();
        checkoutState.currentStep = 3; // Avança para a etapa de Pagamento
        updateProgressIndicator();
      });
    }

    // Botão "Continuar para Revisão" (da etapa 3 para 4)
    // A lógica original já avançava sem validar.
    const continueToReviewBtn = document.getElementById('continue-to-review');
    if (continueToReviewBtn) {
      continueToReviewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        checkoutState.currentStep = 4; // Avança para a etapa de Revisão
        updateProgressIndicator();
      });
    }

    // Botão "Finalizar Pedido" (da etapa 4 para a confirmação)
    // Este botão finaliza o processo, também sem validação.
    const confirmOrderBtn = document.getElementById('confirm-order');
    if (confirmOrderBtn) {
      confirmOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        processOrder(); // Simula o processamento do pedido
      });
    }

    // Mantém a configuração dos botões de "Voltar"
    setupBackButtons();
  }


  function validateDeliveryForm() {
    const requiredFields = ['street', 'number', 'neighborhood', 'city', 'state', 'phone'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field || !field.value.trim()) {
        isValid = false;
        if (field) field.style.borderColor = '#ff4444';
      } else if (field) {
        field.style.borderColor = '';
      }
    });
    
    if (!isValid) {
      showCheckoutMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
    }
    
    return isValid;
  }

  function validatePaymentForm() {
    // Validação básica - em uma implementação real, seria mais elaborada
    if (checkoutState.paymentMethod === 'credit' || checkoutState.paymentMethod === 'debit') {
      const cardNumberInput = document.getElementById(`${checkoutState.paymentMethod}-card-number`);
      if (!cardNumberInput) return true;
      
      const cardNumber = cardNumberInput.value;
      
      if (cardNumber.replace(/\s/g, '').length < 16) {
        showCheckoutMessage('Por favor, insira um número de cartão válido.', 'error');
        return false;
      }
    }
    
    return true;
  }

  function setupBackButtons() {
    // Botão "Voltar" para identificação
    const backToIdentificationBtn = document.getElementById('back-to-identification');
    if (backToIdentificationBtn) {
      backToIdentificationBtn.addEventListener('click', function() {
        checkoutState.currentStep = 1;
        updateProgressIndicator();
      });
    }
    
    // Botão "Voltar" para entrega
    const backToDeliveryBtn = document.getElementById('back-to-delivery');
    if (backToDeliveryBtn) {
      backToDeliveryBtn.addEventListener('click', function() {
        checkoutState.currentStep = 2;
        updateProgressIndicator();
      });
    }
    
    // Botão "Voltar" para pagamento
    const backToPaymentBtn = document.getElementById('back-to-payment');
    if (backToPaymentBtn) {
      backToPaymentBtn.addEventListener('click', function() {
        checkoutState.currentStep = 3;
        updateProgressIndicator();
      });
    }
  }

  function processOrder() {
    // Simular processamento
    showCheckoutLoading('Processando seu pedido...');
    
    setTimeout(() => {
      hideCheckoutLoading();
      
      // Gerar número de pedido aleatório
      const orderNumber = 'FOUR-' + new Date().getFullYear() + 
                        String(new Date().getMonth() + 1).padStart(2, '0') +
                        String(new Date().getDate()).padStart(2, '0') + 
                        '-' + Math.floor(100 + Math.random() * 900);
      
      // Exibir modal de confirmação
      showConfirmationModal(orderNumber);
    }, 3000);
  }

  function showConfirmationModal(orderNumber) {
    const modal = document.getElementById('confirmation-modal');
    const orderNumberElement = document.getElementById('order-number');
    const closeBtn = document.getElementById('confirmation-close');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const trackOrderBtn = document.getElementById('track-order');
    
    if (!modal) return;
    
    if (orderNumberElement) {
      orderNumberElement.textContent = orderNumber;
    }
    
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    // Configurar ações dos botões do modal
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      });
    }
    
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
      });
    }
    
    if (trackOrderBtn) {
      trackOrderBtn.addEventListener('click', function() {
        // Em uma implementação real, redirecionaria para página de rastreamento
        alert('Funcionalidade de rastreamento seria implementada aqui!');
      });
    }
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function showCheckoutMessage(message, type) {
    // Remover mensagens existentes
    const existingMessages = document.querySelectorAll('.checkout-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Criar nova mensagem
    const messageElement = document.createElement('div');
    messageElement.className = `checkout-message ${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
      padding: 12px;
      margin: 16px 0;
      border-radius: 8px;
      font-size: 14px;
      ${type === 'error' ? 'background: rgba(255, 68, 68, 0.1); color: #ff4444; border: 1px solid rgba(255, 68, 68, 0.3);' : ''}
      ${type === 'success' ? 'background: rgba(76, 175, 80, 0.1); color: #4caf50; border: 1px solid rgba(76, 175, 80, 0.3);' : ''}
    `;
    
    // Inserir no início da seção atual
    const currentSection = document.querySelector('.checkout-section[style*="display: block"]');
    if (currentSection) {
      currentSection.insertBefore(messageElement, currentSection.firstChild);
    }
    
    // Remover após 5 segundos
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 5000);
  }

  function showCheckoutLoading(message) {
    // Criar overlay de loading
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'checkout-loading';
    loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      color: white;
    `;
    
    loadingOverlay.innerHTML = `
      <div class="spinner"></div>
      <p style="margin-top: 16px;">${message}</p>
    `;
    
    // Estilo do spinner
    const style = document.createElement('style');
    style.textContent = `
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: var(--accent-blue);
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingOverlay);
  }

  function hideCheckoutLoading() {
    const loadingOverlay = document.getElementById('checkout-loading');
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  }
}

// =================================
// FUNÇÕES PARA OUTRAS PÁGINAS (produto, carrinho)
// =================================

// Trocar imagem principal
function trocarImagem(el) {
  const imagemExibida = document.getElementById("imagemExibida");
  if (imagemExibida) {
    imagemExibida.src = el.src;
  }
}

// Controle de quantidade
function alterarQtd(valor) {
  let qtd = document.getElementById("qtd");
  if (!qtd) return;
  
  let atual = parseInt(qtd.value);
  if (isNaN(atual)) atual = 1;
  atual += valor;
  if (atual < 1) atual = 1;
  qtd.value = atual;
}

// Abas interativas
function abrirAba(aba) {
  document.querySelectorAll(".aba-conteudo").forEach(div => {
    div.classList.remove("ativo");
  });
  
  const abaElement = document.getElementById(aba);
  if (abaElement) {
    abaElement.classList.add("ativo");
  }
}

// Calcular frete fake
function calcularFrete() {
  let cep = document.getElementById("cep");
  let resultado = document.getElementById("resultado-frete");
  
  if (!cep || !resultado) return;
  
  if (cep.value.length === 8) {
    resultado.textContent = "Entrega estimada: 5 dias úteis - R$ 29,90";
  } else {
    resultado.textContent = "Digite um CEP válido (8 dígitos)";
  }
}

// Adicionar ao carrinho (incrementa contador) - para página de produto
document.querySelectorAll(".btn-carrinho").forEach(btn => {
  btn.addEventListener("click", () => {
    let count = document.querySelector(".cart-count");
    if (count) {
      count.textContent = parseInt(count.textContent) + 1;
      alert("Produto adicionado ao carrinho!");
    }
  });
});

// Comprar agora - para página de produto
document.querySelectorAll(".btn-comprar").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Compra direta iniciada!");
  });
});

// =================================
// CARRINHO DE COMPRAS
// =================================

// Atualizar totais no carrinho
function updateCart() {
  let items = document.querySelectorAll(".cart-item");
  let subtotal = 0;

  items.forEach(item => {
    let unitPriceElement = item.querySelector(".unit-price");
    let qtyInput = item.querySelector(".qty-input");
    let totalElement = item.querySelector(".total-price");
    
    if (!unitPriceElement || !qtyInput || !totalElement) return;
    
    let unitPrice = parseFloat(unitPriceElement.textContent);
    let qty = parseInt(qtyInput.value);
    let total = unitPrice * qty;

    totalElement.textContent = total.toFixed(2);
    subtotal += total;
  });

  const subtotalElement = document.getElementById("subtotal");
  const grandTotalElement = document.getElementById("grand-total");
  const cartCountElement = document.getElementById("cart-count");
  
  if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
  if (grandTotalElement) grandTotalElement.textContent = subtotal.toFixed(2);
  if (cartCountElement) cartCountElement.textContent = `(${items.length} produtos)`;
}

// Eventos dos botões de quantidade
document.addEventListener("click", e => {
  if (e.target.classList.contains("qty-btn")) {
    let input = e.target.parentElement.querySelector(".qty-input");
    if (!input) return;
    
    let action = e.target.dataset.action;

    if (action === "increase") input.value = parseInt(input.value) + 1;
    if (action === "decrease" && input.value > 1) input.value = parseInt(input.value) - 1;

    updateCart();
  }

  // Remover item
  if (e.target.classList.contains("remove-btn")) {
    e.target.closest(".cart-item").remove();
    updateCart();
  }
});

// Atualizar em tempo real ao digitar
document.addEventListener("input", e => {
  if (e.target.classList.contains("qty-input")) {
    if (e.target.value < 1) e.target.value = 1;
    updateCart();
  }
});

// Inicializa o carrinho se existir na página
if (document.querySelector('.cart-layout')) {
  updateCart();
}

// =================================
// INICIALIZAÇÃO GERAL DA APLICAÇÃO
// =================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, inicializando aplicação...');
  
  // Inicializar funcionalidades globais (header, footer)
  initGlobalFeatures();
  
  // Inicializar funcionalidades específicas da página
  if (isLoginPage()) {
    initLoginPage();
  } else if (isCheckoutPage()) {
    initCheckoutPage();
  } else {
    initCatalogPage();
  }
  
  // small accessibility improvements
  document.querySelectorAll('button').forEach(b=> {
    b.addEventListener('keydown', (e)=> {
      if (e.key===' '){ 
        e.preventDefault(); 
        b.click(); 
      }
    });
  });
});