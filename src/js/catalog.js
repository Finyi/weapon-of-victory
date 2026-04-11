let allEquipment = [];
let filteredEquipment = [];
let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 12;

let canLoadMore = true;
let isLoadingMore = false;
const loadMoreThreshold = 400;

const countryFlagOverrides = {
    'ussr': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_Soviet_Union.svg/1920px-Flag_of_the_Soviet_Union.svg.png',
};

function getCountryFlagUrl(code) {
    if (!code) return '';
    const normalized = code.toLowerCase();
    if (countryFlagOverrides[normalized]) {
        return countryFlagOverrides[normalized];
    }
    return `https://flagcdn.com/w40/${normalized}.png`;
}

const categories = [
    'all',
    'tanks',
    'ifv',
    'crv',
    'apc',
    'mrap',
    'artillery-and-mlrs',
    'srbm',
    'radar',
    'air-defense',
    'fighters',
    'strike-fighters',
    'reconnaissance-aircrafts',
    'transport-aircrafts',
    'helicopters',
    'uav'
];
const validCategories = categories;

const specLabels = {
    'weight': 'Вага',
    'crew': 'Екіпаж',
    'engine': 'Двигун',
    'power': 'Потужність двигуна',
    'maxSpeed': 'Макс. швидкість',
    'caliber': 'Калібр',
    'rateOfFire': 'Скорострільність',
    'range': 'Дальність',
    'guidance': 'Система наведення',
    'armament': 'Озброєння (снаряди, ракети та ін.)',
    'numbermissiles': 'Макс. Кількість споряджених ракет',
    'radarRange': 'Дальність роботи РЛС',
    'frequencyRange': 'Діапазон частот',
    'maxHeight': 'Макс. висота цілі',
    'maxSpeedTarget': 'Макс. швидкість цілі',
    'typeTarget': 'Тип цілі',
    'combatRadius': 'Бойовий радіус',
    'radarType': 'Тип РЛС',
    'maxCombatLoad': 'Макс. бойове навантаження'
};

const getById = id => document.getElementById(id);

async function loadEquipment() {
    try {
        const response = await fetch('data/equipment.json');
        const data = await response.json();
        allEquipment = data.equipment;
        filteredEquipment = allEquipment;

        updateFilterCounts();
        applyUrlFilters();
    } catch (error) {
        console.error('Помилка завантаження даних:', error);
        getById('equipmentGrid').innerHTML = '<p style="font-size: 16pt; text-align: left; color: red;">Виникла помилка :(</p>';
    }
}

function getCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    return category && validCategories.includes(category) ? category : null;
}

function applyUrlFilters() {
    const urlCategory = getCategoryFromUrl();
    if (urlCategory) {
        filterEquipment(urlCategory);
    } else {
        renderEquipment();
        updateFilterButtons();
    }
}

function renderEquipment() {
    const grid = getById('equipmentGrid');
    if (grid) {
        grid.innerHTML = '';
    }

    if (filteredEquipment.length === 0) {
        if (grid) {
            grid.innerHTML = '<p style="font-size: 16pt; text-align: left; color: var(--text-muted);">Нічого не знайдено</p>';
        }
        return;
    }

    currentPage = 1;
    canLoadMore = filteredEquipment.length > itemsPerPage;
    displayEquipmentPage(currentPage);
    updateFilterButtons();
    updateScrollListener();
}

function displayEquipmentPage(page) {
    const grid = document.getElementById('equipmentGrid');
    const startIndex = (page - 1) * itemsPerPage;
    const pageEquipment = filteredEquipment.slice(startIndex, startIndex + itemsPerPage);

    pageEquipment.forEach(equipment => {
        const card = document.createElement('div');
        card.className = 'equipment-card';
        card.onclick = () => openModal(equipment);

        const imageHTML = equipment.image 
            ? `<img loading="lazy" src="${equipment.image}" alt="${equipment.name}">`
            : '<div class="equipment-card-image-placeholder"></div>';

        card.innerHTML = `
            <div class="equipment-card-image">
                ${imageHTML}
            </div>
            <div class="equipment-card-content">
                <div class="equipment-card-name">${equipment.name}</div>
                <div class="equipment-card-type">${equipment.type}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function loadNextPage() {
    if (!canLoadMore || isLoadingMore) return;
    isLoadingMore = true;
    currentPage += 1;
    displayEquipmentPage(currentPage);
    canLoadMore = filteredEquipment.length > currentPage * itemsPerPage;
    isLoadingMore = false;
}

function updateScrollListener() {
    window.removeEventListener('scroll', handleScroll);
    if (canLoadMore) {
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }
}

function handleScroll() {
    const scrollPosition = window.innerHeight + window.pageYOffset;
    const pageHeight = document.documentElement.scrollHeight;

    if (pageHeight - scrollPosition < loadMoreThreshold) {
        loadNextPage();
    }
}

function getEquipmentImages(equipment) {
    if (Array.isArray(equipment.images) && equipment.images.length > 0) {
        return equipment.images.filter(src => typeof src === 'string' && src.trim().length > 0);
    }

    const images = [];
    if (equipment.image) images.push(equipment.image);
    if (equipment.image2) images.push(equipment.image2);
    if (equipment.image3) images.push(equipment.image3);
    if (equipment.image4) images.push(equipment.image4);
    return images.filter(src => typeof src === 'string' && src.trim().length > 0);
}

function openModal(equipment) {
    const modal = getById('equipmentModal');
    const modalTitle = getById('modalTitle');
    const modalType = getById('modalType');
    const manufacturerEl = getById('modalManufacturer');

    if (modalTitle) modalTitle.textContent = equipment.name;
    if (modalType) modalType.textContent = equipment.type;

    if (manufacturerEl && equipment.manufacturer) {
        const flagSrc = getCountryFlagUrl(equipment.manufacturerFlag);
        const flagHTML = flagSrc ? `<img src="${flagSrc}" alt="${equipment.manufacturer}" class="manufacturer-flag">` : '';
        manufacturerEl.innerHTML = `
            <div class="operator-badge manufacturer-badge">
                ${flagHTML}
                <span>${equipment.manufacturer}</span>
            </div>
        `;
        manufacturerEl.style.display = 'block';
    } else {
        manufacturerEl.style.display = 'none';
        manufacturerEl.innerHTML = '';
    }

    const modalImage = document.getElementById('modalImage');
    const modalThumbnails = document.getElementById('modalThumbnails');
    const modalNoImage = document.getElementById('modalNoImage');

    const images = getEquipmentImages(equipment);
    if (images.length > 0) {
        modalNoImage.style.display = 'none';
        modalImage.src = images[0];
        modalImage.style.display = 'block';

        modalThumbnails.innerHTML = images.map((imgSrc, index) => `
            <img src="${imgSrc}" alt="${equipment.name} preview ${index + 1}" class="${index === 0 ? 'active' : ''}" data-src="${imgSrc}">
        `).join('');

        modalThumbnails.querySelectorAll('img').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const src = thumb.dataset.src;
                modalImage.src = src;

                modalThumbnails.querySelectorAll('img').forEach(img => img.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    } else {
        modalImage.style.display = 'none';
        modalThumbnails.innerHTML = '';
        modalNoImage.style.display = 'flex';
    }

    const operatorsHTML = equipment.operators
        .map(op => {
            const flagSrc = getCountryFlagUrl(op.flag);
            return `
            <div class="operator-badge">
                <img src="${flagSrc}" alt="${op.name}" class="operator-flag">
                <span>${op.name}</span>
            </div>
        `;
        }).join('');

    getById('modalOperators').innerHTML = `
        <div class="modal-operators-title">Оператори</div>
        <div class="modal-operators-list">
            ${operatorsHTML}
        </div>
    `;

    const specsHTML = Object.entries(equipment.specs || {})
        .map(([key, value]) => `
                <div class="spec-item">
                    <div class="spec-label">${specLabels[key] || key}</div>
                    <div class="spec-value">${value}</div>
                </div>
            `)
        .join('');

    getById('modalSpecs').innerHTML = specsHTML || '<p style="color: var(--text-muted);">Немає даних</p>';

    getById('modalDescription').textContent = equipment.description;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = getById('equipmentModal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = '';
}

function filterEquipment(category) {
    currentFilter = category;
    currentPage = 1;
    if (category === 'all') {
        filteredEquipment = allEquipment;
    } else {
        filteredEquipment = allEquipment.filter(eq => eq.category === category);
    }
    renderEquipment();
    updateFilterButtons();
}

function searchEquipment(query) {
    const searchQuery = query.toLowerCase();
    
    const baseEquipment = currentFilter === 'all' 
        ? allEquipment 
        : allEquipment.filter(eq => eq.category === currentFilter);
    
    filteredEquipment = baseEquipment.filter(eq => 
        eq.name.toLowerCase().includes(searchQuery) ||
        eq.type.toLowerCase().includes(searchQuery)
    );
    
    currentPage = 1;
    renderEquipment();
}

function updateFilterCounts() {
    categories.forEach(category => {
        const count = category === 'all'
            ? allEquipment.length
            : allEquipment.filter(eq => eq.category === category).length;

        const btn = document.querySelector(`[data-filter="${category}"]`);
        if (btn) {
            btn.textContent = btn.textContent.split('(')[0] + `(${count})`;
        }
    });
}

function updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeButton = document.querySelector(`[data-filter="${currentFilter}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadEquipment();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterEquipment(btn.dataset.filter);
        });
    });

    const searchInput = getById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchEquipment(e.target.value);
        });
    }

    const closeButton = document.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    const equipmentModal = getById('equipmentModal');
    if (equipmentModal) {
        equipmentModal.addEventListener('click', (e) => {
            if (e.target.id === 'equipmentModal') {
                closeModal();
            }
        });
    }
});
