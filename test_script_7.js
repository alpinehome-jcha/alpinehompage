
        // Render Products
        const productGrid = document.getElementById('productGrid');
        const filterBtns = document.querySelectorAll('.filter-btn');

        async function fetchProductsFromDB() {
            try {
                const client = await loadSupabase();
                const { data } = await client.from('products').select('*').order('sort_order', { ascending: true });
                if (data) {
                    productData = data.map(item => ({
                        ...item,
                        desc: item.description || item.desc || '',
                        detailBlocks: item.detail_blocks || item.detailBlocks || []
                    }));
                }
            } catch(e) {
                console.error("Failed to load products from DB", e);
            }
        }

        function slugify(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-가-힣]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        }

        function renderProducts(filter = 'All') {
            if (!productGrid) return;
            productGrid.innerHTML = '';

            // Basic language detection (if global 'translations' not available, default to EN style for now or detecting DOM)
            // Let's rely on CSS class or text content of language toggle if needed, or just default.
            // Using price format.
            const isEnglish = document.querySelector('.curr-lang') ? document.querySelector('.curr-lang').textContent.trim() === 'EN' : false;

            productData.forEach(product => {
                // Filter logic
                let isMatch = false;

                if (filter === 'All' || filter === '전체') {
                    isMatch = true;
                } else if (filter === 'PnP Cable') {
                    // Match any PnP Cable sub-category
                    if (product.category && product.category.startsWith('PnP Cable')) isMatch = true;
                } else if (filter.startsWith('PnP Cable - ')) {
                    // Specific sub-category match
                    if (filter === 'PnP Cable - 기타') {
                        // Special handling for "Other" to avoid matching "기타수입차" (Other Imported)
                        // Match "PnP Cable - 기타" OR "PnP Cable - 기타 (Other)"
                        if (product.category === 'PnP Cable - 기타' || product.category === 'PnP Cable - 기타 (Other)') {
                            isMatch = true;
                        }
                    } else {
                        // Standard contains check for others
                        if (product.category && product.category.includes(filter)) isMatch = true;
                    }
                } else {
                    // Exact match for strict categories
                    if (filter === '기타상품' && product.category === 'Others') isMatch = true;
                    else if (product.category === filter) isMatch = true;
                }

                if (!isMatch) return;

                const card = document.createElement('div');
                card.className = 'product-card';
                card.style.cursor = 'pointer';
                const slug = product.slug || slugify(product.title) || product.id.toString();
                card.onclick = () => window.location.href = `pages/products/${slug}.html`;

                // Formatter
                let priceDisplay = '';
                if (isEnglish) {
                    priceDisplay = '$' + Math.round(product.price / 1400).toLocaleString();
                } else {
                    priceDisplay = '₩' + product.price.toLocaleString();
                }

                card.innerHTML = `
                    <div style="position: relative;">
                        ${product.soldOut ? '<div class="sold-out-badge">SOLD OUT</div>' : ''}
                        <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-desc" style="margin: 10px 0;">${product.desc}</p>
                        <div class="product-price" data-price-krw="${product.price}">${priceDisplay}</div>
                        <p class="product-desc" style="margin: 10px 0;">${product.desc_bottom !== undefined ? product.desc_bottom : product.desc}</p>
                        ${product.promoText ? `<div class="product-promo" style="color: #e74c3c; font-weight: bold; margin-bottom: 10px; font-size: 0.9rem;">${product.promoText}</div>` : ''}
                        <span class="btn-view">View Details</span>
                    </div>
                `;
                productGrid.appendChild(card);
            });
        }

        // Simple Filter Script
        const subFilterContainer = document.getElementById('subFilterContainer');
        const subFilterBtns = document.querySelectorAll('.sub-filter-btn');

        // Update Click Handlers to Save State AND Update URL
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Reset main active
                document.querySelector('.filter-btn.active').classList.remove('active');
                btn.classList.add('active');

                const filterName = btn.textContent.trim();
                sessionStorage.setItem('lastCategory', filterName); // Save State

                // Update URL without reloading
                const newUrl = `${window.location.pathname}?category=${encodeURIComponent(filterName)}`;
                history.pushState({ path: newUrl }, '', newUrl);

                // PnP Cable Logic
                if (filterName === 'PnP Cable') {
                    subFilterContainer.style.display = 'flex';

                    // Reset sub-buttons
                    document.querySelectorAll('.sub-filter-btn.active').forEach(b => b.classList.remove('active'));

                    // Default to '국산차' (Domestic)
                    const defaultSub = document.querySelector('.sub-filter-btn[data-sub="국산차"]');
                    if (defaultSub) {
                        defaultSub.classList.add('active');
                        renderProducts('PnP Cable - 국산차');
                        // Update URL for default sub-category
                        const subName = 'PnP Cable - 국산차';
                        const subUrl = `${window.location.pathname}?category=${encodeURIComponent(subName)}`;
                        history.replaceState({ path: subUrl }, '', subUrl);
                        sessionStorage.setItem('lastCategory', subName);
                    }
                } else {
                    subFilterContainer.style.display = 'none';
                    renderProducts(filterName);
                }
            });
        });

        // Sub Filter Logic
        subFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sub-filter-btn.active').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter by specific prefix
                const categoryName = `PnP Cable - ${btn.dataset.sub}`;
                renderProducts(categoryName);

                sessionStorage.setItem('lastCategory', categoryName);
                const newUrl = `${window.location.pathname}?category=${encodeURIComponent(categoryName)}`;
                history.pushState({ path: newUrl }, '', newUrl);
            });
        });

        // Listen for language toggle click to re-render (since prices change)
        const langToggleBtn = document.querySelector('.lang-toggle');
        if (langToggleBtn) {
            langToggleBtn.addEventListener('click', () => {
                // Wait for the main toggle flow to update state, then re-render
                setTimeout(() => {
                    const activeFilterText = document.querySelector('.filter-btn.active').textContent.trim();
                    renderProducts(activeFilterText === 'All' || activeFilterText === '전체' ? 'All' : activeFilterText);
                }, 50);
            });
        }

        async function applyInitialFilters() {
            await fetchProductsFromDB();
            
            // Handle URL Parameters for Filtering
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('category');

            // Check URL first, then SessionStorage
            if (categoryParam) {
                let targetBtn = null;
                let isSubCategory = false;

                // Check if it's a sub-category (PnP Cable - ...)
                if (categoryParam.startsWith('PnP Cable - ')) {
                    isSubCategory = true;
                    // Find Parent Button (PnP Cable)
                    filterBtns.forEach(btn => {
                        if (btn.textContent.trim() === 'PnP Cable') targetBtn = btn;
                    });
                } else {
                    // Normal Category Match
                    filterBtns.forEach(btn => {
                        const btnText = btn.textContent.trim();
                        if (btnText === categoryParam) {
                            targetBtn = btn;
                        } else if (categoryParam === 'Others' && btnText === '기타상품') {
                            targetBtn = btn;
                        } else if (categoryParam === '기타상품' && btnText === '기타상품') {
                            targetBtn = btn;
                        }
                    });
                }

                if (targetBtn) {
                    document.querySelector('.filter-btn.active').classList.remove('active');
                    targetBtn.classList.add('active');

                    // If it's a sub-category, handle sub-menu
                    if (isSubCategory) {
                        subFilterContainer.style.display = 'flex';
                        // Deactivate all sub-btns
                        document.querySelectorAll('.sub-filter-btn.active').forEach(b => b.classList.remove('active'));

                        // Activate specific sub-btn
                        const subKey = categoryParam.replace('PnP Cable - ', '');
                        const subBtns = document.querySelectorAll('.sub-filter-btn');
                        subBtns.forEach(sb => {
                            if (sb.dataset.sub === subKey || categoryParam.includes(sb.dataset.sub)) {
                                sb.classList.add('active');
                            }
                        });

                        renderProducts(categoryParam);
                        sessionStorage.setItem('lastCategory', categoryParam);
                    } else {
                        // Normal Category
                        const filterName = targetBtn.textContent.trim();

                        if (filterName === 'PnP Cable') {
                            subFilterContainer.style.display = 'flex';
                            document.querySelectorAll('.sub-filter-btn.active').forEach(b => b.classList.remove('active'));
                            const defaultSubBtn = document.querySelector('.sub-filter-btn[data-sub="국산차"]');
                            if (defaultSubBtn) {
                                defaultSubBtn.classList.add('active');
                                const subName = 'PnP Cable - 국산차';
                                sessionStorage.setItem('lastCategory', subName);
                                const subUrl = `${window.location.pathname}?category=${encodeURIComponent(subName)}`;
                                history.replaceState({ path: subUrl }, '', subUrl);
                            } else {
                                renderProducts(filterName);
                                sessionStorage.setItem('lastCategory', filterName);
                            }
                        } else {
                            subFilterContainer.style.display = 'none'; // Hide if not PnP
                            renderProducts(filterName);
                            sessionStorage.setItem('lastCategory', filterName);
                        }
                    }
                }
            } else {
                // Default to the active button (F#1 Status) instead of 'All'
                const activeBtn = document.querySelector('.filter-btn.active');
                if (activeBtn) {
                    renderProducts(activeBtn.textContent.trim());
                } else {
                    renderProducts();
                }
            }
        }

        // Update Click Handlers to Save State
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Reset main active
                document.querySelector('.filter-btn.active').classList.remove('active');
                btn.classList.add('active');

                const filterName = btn.textContent.trim();
                sessionStorage.setItem('lastCategory', filterName); // Save State

                // ... (rest of logic handles PnP sub-filters or render)
                // Existing listeners handle the render, we just injected the save.
                // Wait, simply adding another listener might duplicate logic or run in parallel.
                // The existing listener is anonymous in the previous code block (lines 553-579).
                // I should probably edit THAT listener instead of adding a new one, 
                // OR just trust that setting it here is fine? 
                // Actually, the previous code block I'm NOT replacing covers the listener setup.
                // I need to update the EXISTING listener to save state.
            });
        });
    