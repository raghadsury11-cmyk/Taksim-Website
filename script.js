// ================= GLOBAL APPLICATION CART STATE =================
let shoppingCart = [];
let totalAccumulatedPrice = 0;

// ================= DARK / LIGHT THEME TOGGLE =================
const themeToggleBtn = document.getElementById('theme-toggle-btn');

function updateThemeButton(isDark) {
    if (!themeToggleBtn) return;

    if (isDark) {
        themeToggleBtn.innerHTML = `
            <span class="theme-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </span>
            <span class="theme-label">نهاري</span>`;
    } else {
        themeToggleBtn.innerHTML = `
            <span class="theme-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </span>
            <span class="theme-label">ليلي</span>`;
    }
}

function applySavedTheme() {
    const isDark = localStorage.getItem('siteTheme') === 'dark';

    if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
    }

    updateThemeButton(isDark);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('siteTheme', 'light');
            themeToggleBtn.innerHTML = `
                <span class="theme-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                </span>
                <span class="theme-label">ليلي</span>`;
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('siteTheme', 'dark');
            themeToggleBtn.innerHTML = `
                <span class="theme-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </span>
                <span class="theme-label">نهاري</span>`;
        }
    });
}

// ================= INDEX PAGE: redirect to menu with filter =================
function redirectToMenu(filterValue) {
    window.location.href = `menu.html?filter=${filterValue}`;
}

// ================= MENU PAGE: show category wrapper =================
function showCategoryWrapper(filterValue) {
    setFilter(filterValue);

    const fullMenuView = document.getElementById('full-menu-view');
    if (!fullMenuView) return;

    if (filterValue === 'all-category') {
        // Show search + category tabs
        document.getElementById('search-and-tabs').style.display = 'block';
    } else {
        // Hide search + category tabs for specific categories
        document.getElementById('search-and-tabs').style.display = 'none';
    }

    fullMenuView.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ================= FILTERING SYSTEM =================
function setFilter(filterValue) {
    const url = new URL(window.location);
    url.searchParams.set('filter', filterValue);
    window.history.pushState({}, '', url);

    document.querySelectorAll('.cat-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`.cat-tab-btn[data-filter="${filterValue}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    applyFilters();
}

function applyFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const activeFilter = urlParams.get('filter') || 'all-category';

    const searchInput = document.getElementById('menu-search-input')?.value.toLowerCase() || '';
    const allCards = document.querySelectorAll('.dish-card');

    allCards.forEach(card => {
        const cardSection = card.getAttribute('data-section') || '';
        const cardTag = card.getAttribute('data-tag') || '';
        const title = card.querySelector('.dish-front h3')?.innerText.toLowerCase() || '';

        const filterMatch = (activeFilter === 'all-category')
            || cardSection.includes(activeFilter)
            || cardTag.includes(activeFilter);

        const searchMatch = title.includes(searchInput);

        if (filterMatch && searchMatch) {
            card.classList.remove('hidden-card');
            void card.offsetWidth;
            card.classList.add('fade-in-card');
        } else {
            card.classList.remove('fade-in-card');
            card.classList.add('hidden-card');
        }
    });
}

// For the search bar (only shown in all-category mode)
function filterMenuDishes() {
    applyFilters();
}

// For category tab buttons
function filterCategoryTags(tag, event) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentSection = urlParams.get('filter') || 'all-category';

    // Update URL with tag as filter
    const url = new URL(window.location);
    url.searchParams.set('filter', tag === 'all-tags' ? 'all-category' : tag);
    window.history.pushState({}, '', url);

    document.querySelectorAll('.cat-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    applyFilters();
}

// ================= CARD FLIP — auto-unflip others (Edit 2) =================
function toggleCardFlip(cardInnerElement) {
    const isFlipped = cardInnerElement.classList.contains('flipped');

    // Unflip all cards first
    document.querySelectorAll('.dish-card-inner.flipped').forEach(el => {
        el.classList.remove('flipped');
    });

    // If the clicked card was not flipped, flip it
    if (!isFlipped) {
        cardInnerElement.classList.add('flipped');
    }
}

// ================= SHOPPING CART =================
function updateCartTotals() {
    totalAccumulatedPrice = shoppingCart.reduce((total, item) => total + item.price, 0);

    const floatingTotal = document.getElementById('floating-total-cost');
    const popupTotal = document.getElementById('popup-total-cost');

    if (floatingTotal) floatingTotal.innerText = totalAccumulatedPrice;
    if (popupTotal) popupTotal.innerText = totalAccumulatedPrice;
}

function refreshDishRemoveButtons() {
    document.querySelectorAll('.remove-from-cart-btn[data-item-name]').forEach(button => {
        const itemName = button.getAttribute('data-item-name');
        button.disabled = !shoppingCart.some(item => item.name === itemName);
    });
}

function addToCart(itemName, itemPrice) {
    shoppingCart.push({ name: itemName, price: itemPrice });
    updateCartTotals();
    renderCartPopupList();
    refreshDishRemoveButtons();
}

function removeFromCart(itemName) {
    const itemIndex = shoppingCart.findIndex(item => item.name === itemName);
    if (itemIndex === -1) return;

    shoppingCart.splice(itemIndex, 1);
    updateCartTotals();
    renderCartPopupList();
    refreshDishRemoveButtons();
}

function removeCartItem(itemIndex) {
    if (itemIndex < 0 || itemIndex >= shoppingCart.length) return;

    shoppingCart.splice(itemIndex, 1);
    updateCartTotals();
    renderCartPopupList();
    refreshDishRemoveButtons();
}

function clearCart() {
    shoppingCart = [];
    updateCartTotals();
    renderCartPopupList();
    refreshDishRemoveButtons();
}

function submitOrder() {
    alert('شكرًا لطلبك! سيتم تجهيز وجبتك فوراً.');
    clearCart();

    const modal = document.getElementById('cart-popup-modal');
    if (modal) modal.style.display = 'none';
}

function renderCartPopupList() {
    const listContainer = document.getElementById('cart-items-list');
    if (!listContainer) return;

    if (shoppingCart.length === 0) {
        listContainer.innerHTML = `<p style="color:#666;text-align:center;">السلة فارغة حالياً. أضف بعض الأطباق اللذيذة!</p>`;
        return;
    }

    listContainer.innerHTML = '';
    shoppingCart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item-row';
        li.innerHTML = `<span>${item.name}</span><strong>${item.price} د.ل</strong>`;
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-cart-item-btn';
        removeButton.setAttribute('aria-label', `إزالة ${item.name} من السلة`);
        removeButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        `;
        removeButton.addEventListener('click', () => removeCartItem(index));
        li.appendChild(removeButton);
        listContainer.appendChild(li);
    });
}

function initializeDishRemoveButtons() {
    document.querySelectorAll('.dish-card .add-to-cart-btn').forEach(addButton => {
        const onclickValue = addButton.getAttribute('onclick') || '';
        const itemMatch = onclickValue.match(/addToCart\('([^']+)',\s*([0-9.]+)\)/);
        if (!itemMatch || addButton.closest('.dish-card-actions')) return;

        const itemName = itemMatch[1];
        const actionsWrapper = document.createElement('div');
        actionsWrapper.className = 'dish-card-actions';

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-from-cart-btn';
        removeButton.setAttribute('data-item-name', itemName);
        removeButton.setAttribute('aria-label', `إزالة ${itemName} من السلة`);
        removeButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            إزالة من السلة
        `;
        removeButton.addEventListener('click', () => removeFromCart(itemName));

        addButton.parentNode.insertBefore(actionsWrapper, addButton);
        actionsWrapper.appendChild(addButton);
        actionsWrapper.appendChild(removeButton);
    });

    refreshDishRemoveButtons();
}

function toggleCartPopup() {
    const modal = document.getElementById('cart-popup-modal');
    if (!modal) return;
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

window.addEventListener('click', function(event) {
    const modal = document.getElementById('cart-popup-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// ================= BACK TO TOP BUTTON =================
const scrollTopBtn = document.getElementById('scroll-to-top-btn');
window.addEventListener('scroll', () => {
    if (!scrollTopBtn) return;
    if (document.documentElement.scrollTop > 400 || document.body.scrollTop > 400) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= TESTIMONIALS AUTO CAROUSEL =================
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;

    // Clone all cards for infinite loop
    const cards = Array.from(track.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });

    let offset = 0;
    const speed = 0.4; // px per frame
    let isPaused = false;

    // Pause on hover
    track.addEventListener('mouseenter', () => isPaused = true);
    track.addEventListener('mouseleave', () => isPaused = false);

    function animate() {
        if (!isPaused) {
            offset += speed;
            const totalWidth = track.scrollWidth / 2;
            if (offset >= totalWidth) offset = 0;
            track.style.transform = `translateX(${offset}px)`;
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// ================= INITIAL PAGE LOAD =================
window.addEventListener('DOMContentLoaded', () => {
    // Set theme button initial state
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = `
            <span class="theme-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </span>
            <span class="theme-label">ليلي</span>`;
    }

    applySavedTheme();
    renderCartPopupList();
    updateCartTotals();
    initializeDishRemoveButtons();
    initTestimonialsCarousel();

    if (document.getElementById('full-menu-view')) {
        const urlParams = new URLSearchParams(window.location.search);
        const initialFilter = urlParams.get('filter') || 'all-category';

        if (initialFilter === 'all-category') {
            document.getElementById('search-and-tabs').style.display = 'block';
        } else {
            document.getElementById('search-and-tabs').style.display = 'none';
        }

        setFilter(initialFilter);
    }
});
