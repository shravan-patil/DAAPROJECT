let hierarchy = {};
let currentMaster = null;

// Load CSV and organize into { Master Category → { Category → [parts] } }
fetch('vintage_car_parts.csv')  // FIXED: Added back the .then() chain
    .then(response => response.text())
    .then(csvText => {
        const data = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;

        data.forEach(row => {
            const master = row['Master Category'];
            const category = row['Category'];
            if (!hierarchy[master]) hierarchy[master] = {};
            if (!hierarchy[master][category]) hierarchy[master][category] = [];
            hierarchy[master][category].push({
                part: row['Part'],
                description: row['Description'],
                price: parseFloat(row['Price']) || 0,
                imageUrl: row['Link'] || ''  // ADDED: Image URL from CSV
            });
        });

        // Default view after CSV is loaded
        showAll();
    })
    .catch(error => {
        console.error('Error loading CSV:', error);
        document.getElementById('productsGrid').innerHTML = '<h2>Error loading product data</h2>';
    });

// Show all master categories
function showAll() {
    const container = document.getElementById('productsGrid');
    container.innerHTML = '<h2>All Major Categories</h2>';
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';

    Object.keys(hierarchy).forEach(master => {
        const card = document.createElement('div');
        card.className = 'nav-card';
        card.textContent = master;
        card.onclick = () => showMasterCategory(master);
        cardsContainer.appendChild(card);
    });

    container.appendChild(cardsContainer);
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn').classList.add('active');
}

// Show subcategories for a master category
function showMasterCategory(master) {
    const container = document.getElementById('productsGrid');
    currentMaster = master;

    if (!hierarchy[master]) {
        container.innerHTML = `<h2>No data available for ${master}</h2>`;
        return;
    }

    container.innerHTML = `<h2>${master} Categories</h2>`;
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';

    Object.keys(hierarchy[master]).forEach(cat => {
        const card = document.createElement('div');
        card.className = 'nav-card';
        card.textContent = cat;
        card.onclick = () => showParts(master, cat);
        cardsContainer.appendChild(card);
    });

    container.appendChild(cardsContainer);
    
    // Back button
    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back to All Categories';
    backBtn.className = 'back-btn';
    backBtn.onclick = showAll;
    container.appendChild(backBtn);
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(master.toLowerCase().replace(' parts', '') + 'Btn');
    if (activeBtn) activeBtn.classList.add('active');
}

// Show parts of a category
function showParts(master, category) {
    const container = document.getElementById('productsGrid');
    container.innerHTML = `<h2>${category}</h2>`;
    
    const productsGrid = document.createElement('div');
    productsGrid.className = 'products';

    hierarchy[master][category].forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // FIXED: Added image support with fallback
        const imageHtml = p.imageUrl 
            ? `<img src="${p.imageUrl}" alt="${p.part}" style="width: 100%; height: 200px; object-fit: cover;" onerror="this.outerHTML='<div class=\\'product-image\\'></div>'">` 
            : '<div class="product-image"></div>';
        
        card.innerHTML = `
            ${imageHtml}
            <div class="product-info">
                <div class="product-name">${p.part}</div>
                <div class="product-description">${p.description}</div>
                <div class="product-footer">
                    <div class="product-price">$${p.price.toFixed(2)}</div>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        `;

        card.querySelector('.add-to-cart').addEventListener('click', () => {
            addToCart({
                part: p.part,
                description: p.description,
                master: master,
                category: category,
                price: p.price
            });
        });

        productsGrid.appendChild(card);
    });

    container.appendChild(productsGrid);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.textContent = `Back to ${master}`;
    backBtn.className = 'back-btn';
    backBtn.onclick = () => showMasterCategory(master);
    container.appendChild(backBtn);
}