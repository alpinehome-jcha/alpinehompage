let serviceData = [];
let supabaseClient = null;
let currentImages = []; // Array to track currently loaded images for the item being edited

// ê´€ë¦¬ì ë¹„ë?ë²ˆí˜¸ ìºì‹œ (?ë™ ?°ë™, RPC ?œë²„ì¸?ê²€ì¦ìš©)
let _cachedAdminPass = null;
let _cachedAdminUser = null;

async function getAdminPassword() {
    if (_cachedAdminPass) return _cachedAdminPass;
    const authStateStr = sessionStorage.getItem('authState');
    if (authStateStr) {
        try {
            const authState = JSON.parse(authStateStr);
            if (authState.adminPassword) {
                _cachedAdminPass = authState.adminPassword;
                _cachedAdminUser = authState.currentUser;
                return _cachedAdminPass;
            }
        } catch (e) {
            console.error('Failed to parse authState', e);
        }
    }
    // Fallback logic
    _cachedAdminPass = '6198107276aa!!';
    _cachedAdminUser = 'alpineaudio';
    return _cachedAdminPass;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check if admin or service_admin
    auth.checkAuthAndRedirect();
    const role = auth.getRole();
    if (role !== 'admin' && role !== 'service_admin') {
        alert('ê´€ë¦¬ì ?ëŠ” ?œë¹„??ê´€ë¦¬ìë§??‘ê·¼ ê°€?¥í•œ ?˜ì´ì§€?…ë‹ˆ??');
        window.location.href = '../index.html';
        return;
    }

    // Set default dates
    const today = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    document.getElementById('search_start').value = '2020-01-01';
    document.getElementById('search_end').value = today.toISOString().split('T')[0];
    document.getElementById('f_receive_date').value = today.toISOString().split('T')[0];

    // Load Supabase and Data
    try {
        if (typeof loadSupabase === 'function') {
            supabaseClient = await loadSupabase();
            await loadData();
        } else {
            alert('Supabase ?´ë¼?´ì–¸?¸ë? ì´ˆê¸°?”í•  ???†ìŠµ?ˆë‹¤. (auth.js ?¤ë¥˜)');
        }
    } catch (e) {
        console.error('Initial load failed', e);
        alert('?°ì´??ë¡œë“œ???¤íŒ¨?ˆìŠµ?ˆë‹¤: ' + e.message);
    }

    // Checkbox event listeners
    const chks = document.querySelectorAll('.chk-status');
    const chkAll = document.getElementById('chk_all');
    chks.forEach(c => c.addEventListener('change', () => {
        const allChecked = Array.from(chks).every(x => x.checked);
        if (chkAll) chkAll.checked = allChecked;
        renderTable(1);
    }));

    // File input change listener for preview
    const fImages = document.getElementById('f_images');
    if (fImages) {
        fImages.addEventListener('change', () => {
            renderImagePreviews();
        });
    }
});

async function loadData() {
    showLoading('?°ì´?°ë? ë¶ˆëŸ¬?¤ëŠ” ì¤‘ì…?ˆë‹¤...');

    try {
        const supaPass = await getAdminPassword();
        if (!supaPass) throw new Error('ê´€ë¦¬ì ë¹„ë?ë²ˆí˜¸ê°€ ?„ìš”?©ë‹ˆ??');
        const currentUser = _cachedAdminUser;
        const adminUser = (currentUser && currentUser !== 'guest') ? currentUser : 'alpineaudio';

        const { data: result, error } = await supabaseClient.schema('alpine-home').rpc('admin_list_service_records', {
            p_admin_username: adminUser,
            p_admin_password: supaPass
        });

        if (error) throw error;
        if (result && result.error) throw new Error(result.error);

        const data = (result && result.data) || [];

        if (data && data.length > 0) {
            serviceData = data;
            // localStorage.setItem('serviceData', JSON.stringify(serviceData)); // Removed for privacy/security
        }
    } catch (e) {
        console.error('Supabase ?°ì´??ë¡œë“œ ì¤??¤ë¥˜ ë°œìƒ:', e);
        const local = localStorage.getItem('serviceData');
        if (local) serviceData = JSON.parse(local);
        
        let errorMsg = e.message || e;
        if (e.code === 'PGRST102') errorMsg = "JSON ?Œì‹± ?¤ë¥˜(PGRST102) - ?Œë¼ë¯¸í„° ?€??ë¶ˆì¼ì¹?;
        if (errorMsg === 'unauthorized') errorMsg = "?¸ì¦ ?¤íŒ¨: ê´€ë¦¬ì ë¹„ë?ë²ˆí˜¸ê°€ ?€?¸ìŠµ?ˆë‹¤.";
        
        alert('?œë²„ DB(Supabase)?ì„œ ìµœì‹  ?°ì´?°ë? ë¶ˆëŸ¬?¤ì? ëª»í–ˆ?µë‹ˆ??\nê³¼ê±° ?¤í”„?¼ì¸ ?°ì´?°ë? ?œì‹œ?©ë‹ˆ??\n(?¤ë¥˜ ?ì¸: ' + errorMsg + ')');
    }

    // ?‘ìˆ˜??receive_date) ê¸°ì??¼ë¡œ ìµœì‹  ??ª©??ë¨¼ì? ?¤ë„ë¡??•ë ¬ (?´ë¦¼ì°¨ìˆœ)
    if (serviceData && serviceData.length > 0) {
        serviceData.sort((a, b) => {
            const dateA = a.receive_date || '';
            const dateB = b.receive_date || '';
            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;
            return (b.id || 0) - (a.id || 0);
        });
    }
    hideLoading();
    renderTable(1);
}

async function saveService() {
    const idField = document.getElementById('service_id').value;

    showLoading('?¬ì§„ ?…ë¡œ??ë°??°ì´?°ë? ?€?¥í•˜??ì¤‘ì…?ˆë‹¤...');

    try {
        // Upload new images and merge with existing ones
        const newImageUrls = await uploadImages();
        const finalImages = [...currentImages, ...newImageUrls];

        const item = {
            receive_date: document.getElementById('f_receive_date').value || null,
            status: document.getElementById('f_status').value || null,
            customer_name: document.getElementById('f_customer_name').value || null,
            address: document.getElementById('f_address').value || null,
            vehicle_info: document.getElementById('f_vehicle_info').value || null,
            reserve_date: document.getElementById('f_reserve_date').value || null,
            car_model: document.getElementById('f_car_model').value || null,
            phone: document.getElementById('f_phone').value || null,
            symptom: document.getElementById('f_symptom').value || null,
            method: document.getElementById('f_method').value || null,
            complete_date: document.getElementById('f_complete_date').value || null,
            manager: document.getElementById('f_manager').value || null,
            cost: document.getElementById('f_cost').value || null,
            details: document.getElementById('f_details').value || null,
            recovery_status: document.getElementById('f_recovery_status').value || null,
            failure_cause: document.getElementById('f_failure_cause').value || null,
            images: finalImages
        };

        // 1. Removed LocalStorage save per security policy
        // 2. Try saving to Supabase DB (ê´€ë¦¬ì ?¸ì¦ RPC ê²½ìœ )
        const supaPass = await getAdminPassword();
        if (!supaPass) throw new Error('ê´€ë¦¬ì ë¹„ë?ë²ˆí˜¸ê°€ ?„ìš”?©ë‹ˆ??');
        const adminUser = _cachedAdminUser || 'alpineaudio';

        const { data: result, error } = await supabaseClient.schema('alpine-home').rpc('admin_upsert_service_record', {
            p_admin_username: adminUser,
            p_admin_password: supaPass,
            p_id: idField ? parseInt(idField) : null,
            p_record: item
        });

        if (error) throw error;
        if (result && result.error) throw new Error(result.error);

        alert('?€?¥ë˜?ˆìŠµ?ˆë‹¤.');
        resetForm();
        await loadData(); // Reload table from DB

    } catch (e) {
        console.error('Supabase DB ?€???ëŸ¬:', e);
        alert('?œë²„ ?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.\n(ë³´ì•ˆ ?•ì±…???˜í•´ ë¡œì»¬???„ì‹œ ?€?¥ë˜ì§€ ?ŠìŠµ?ˆë‹¤.)\n\n?¤ë¥˜: ' + e.message);
    }
    hideLoading();
}

function editService(id) {
    const item = serviceData.find(s => s.id == id);
    if (!item) return;

    document.getElementById('service_id').value = item.id;
    document.getElementById('f_receive_date').value = item.receive_date || '';
    document.getElementById('f_status').value = item.status || '';
    document.getElementById('f_customer_name').value = item.customer_name || '';
    document.getElementById('f_address').value = item.address || '';
    document.getElementById('f_vehicle_info').value = item.vehicle_info || '';
    document.getElementById('f_reserve_date').value = item.reserve_date || '';
    document.getElementById('f_car_model').value = item.car_model || '';
    document.getElementById('f_phone').value = item.phone || '';
    document.getElementById('f_symptom').value = item.symptom || '';
    document.getElementById('f_method').value = item.method || '';
    document.getElementById('f_complete_date').value = item.complete_date || '';
    document.getElementById('f_manager').value = item.manager || '';
    document.getElementById('f_cost').value = item.cost || '';
    document.getElementById('f_details').value = item.details || '';
    document.getElementById('f_recovery_status').value = item.recovery_status || '';
    document.getElementById('f_failure_cause').value = item.failure_cause || '';

    // Load existing images and reset file selection
    currentImages = Array.isArray(item.images) ? [...item.images] : [];
    const fImages = document.getElementById('f_images');
    if (fImages) fImages.value = '';
    renderImagePreviews();

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteService(id) {
    if (!confirm('?•ë§ ??ê¸°ë¡???? œ?˜ì‹œê² ìŠµ?ˆê¹Œ? (?? œ ??ë³µêµ¬ ë¶ˆê??¥í•©?ˆë‹¤)')) return;

    showLoading('?°ì´?°ë? ?? œ?˜ëŠ” ì¤‘ì…?ˆë‹¤...');
    try {
        const supaPass = await getAdminPassword();
        if (!supaPass) throw new Error('ê´€ë¦¬ì ë¹„ë?ë²ˆí˜¸ê°€ ?„ìš”?©ë‹ˆ??');
        const adminUser = _cachedAdminUser || 'alpineaudio';

        const { data: result, error } = await supabaseClient.schema('alpine-home').rpc('admin_delete_service_record', {
            p_admin_username: adminUser,
            p_admin_password: supaPass,
            p_id: parseInt(id)
        });

        if (error) throw error;
        if (result && result.error) throw new Error(result.error);

        resetForm();
        await loadData();
    } catch (e) {
        console.error('Supabase DB ?? œ ?ëŸ¬:', e);
        alert('?? œ???¤íŒ¨?ˆìŠµ?ˆë‹¤. ê´€ë¦¬ì?ê²Œ ë¬¸ì˜?˜ì„¸??\n\n?¤ë¥˜: ' + e.message);
    }
    hideLoading();
}

function resetForm() {
    document.getElementById('service_id').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('f_receive_date').value = today;
    document.getElementById('f_status').value = '';
    document.getElementById('f_customer_name').value = '';
    document.getElementById('f_address').value = '';
    document.getElementById('f_vehicle_info').value = '';
    document.getElementById('f_reserve_date').value = '';
    document.getElementById('f_car_model').value = '';
    document.getElementById('f_phone').value = '';
    document.getElementById('f_symptom').value = '';
    document.getElementById('f_method').value = '';
    document.getElementById('f_complete_date').value = '';
    document.getElementById('f_manager').value = '';
    document.getElementById('f_cost').value = '';
    document.getElementById('f_details').value = '';
    document.getElementById('f_recovery_status').value = '';
    document.getElementById('f_failure_cause').value = '';

    // Clear photo previews
    currentImages = [];
    const fImages = document.getElementById('f_images');
    if (fImages) fImages.value = '';
    renderImagePreviews();
}

function toggleAllStatus(checkbox) {
    const chks = document.querySelectorAll('.chk-status');
    chks.forEach(c => c.checked = checkbox.checked);
    renderTable(1); // Reset to page 1 on filter change
}

let currentPage = 1;
const ITEMS_PER_PAGE = 15;

function renderTable(page) {
    if (page) currentPage = page;

    const tbody = document.getElementById('serviceTbody');
    tbody.innerHTML = '';

    const start = document.getElementById('search_start').value;
    const end = document.getElementById('search_end').value;
    const keyword = document.getElementById('search_keyword').value.toLowerCase();

    const activeStatuses = Array.from(document.querySelectorAll('.chk-status:checked')).map(c => c.value);

    let filtered = serviceData.filter(item => {
        // Status Filter
        if (item.status && !activeStatuses.includes(item.status)) {
            return false;
        }

        // Date Filter
        if (start && item.receive_date && item.receive_date < start) return false;
        if (end && item.receive_date && item.receive_date > end) return false;

        // Keyword Filter
        if (keyword) {
            const searchableText = `${item.customer_name} ${item.phone} ${item.car_model} ${item.vehicle_info} ${item.symptom}`.toLowerCase();
            if (!searchableText.includes(keyword)) return false;
        }

        return true;
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

    // Safety check if current page exceeds total pages
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    let displayId = totalItems - startIndex;

    paginatedItems.forEach(item => {
        const tr = document.createElement('tr');

        let statusColor = '#000'; // ê¸°ë³¸ ê²€?•ìƒ‰
        if (item.status === '?œë¹„?¤ì ‘??) statusColor = '#27ae60'; // ì´ˆë¡??
        else if (item.status === '?œë¹„?¤ì˜ˆ??) statusColor = '#e67e22'; // ì£¼í™©??
        else if (item.status === '?œë¹„?¤ë³´ë¥?) statusColor = '#7f8c8d'; // ?Œìƒ‰

        tr.innerHTML = `
            <td>${displayId--}</td>
            <td style="color:${statusColor}; font-weight:bold;">${item.status || ''}</td>
            <td>${item.receive_date || ''}</td>
            <td>${item.reserve_date || ''}</td>
            <td>${item.customer_name || ''}</td>
            <td style="text-align:left;">${item.address || ''}</td>
            <td>${item.phone || ''}</td>
            <td>${item.car_model || ''}</td>
            <td>${item.vehicle_info || ''}</td>
            <td style="text-align:left;">${item.symptom || ''}</td>
            <td style="text-align:left;">${item.method || ''}</td>
            <td>${item.manager || ''}</td>
            <td style="text-align:left;">${item.details || ''}</td>
            <td style="text-align:center;">${item.recovery_status || ''}</td>
            <td style="text-align:center;">${item.failure_cause || ''}</td>
            <td style="text-align:right;">${item.cost || ''}</td>
            <td>${item.complete_date || ''}</td>
            <td>${getImageColumnHtml(item.images)}</td>
            <td style="padding:4px 2px; white-space: nowrap;">
                <button class="btn btn-edit" style="display:inline-block; width:auto; padding: 3px 6px; font-size: 0.75rem; margin-right: 2px;" onclick="editService(${item.id})">?˜ì •</button>
                <button class="btn btn-delete" style="display:inline-block; width:auto; padding: 3px 6px; font-size: 0.75rem;" onclick="deleteService(${item.id})">?? œ</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="19" style="padding: 20px; text-align: center; color: #999;">ê²€?‰ëœ ?°ì´?°ê? ?†ìŠµ?ˆë‹¤.</td></tr>`;
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = document.getElementById('paginationContainer');
    if (!container) return;
    container.innerHTML = '';

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = () => renderTable(i);
        container.appendChild(btn);
    }
}

function downloadExcel() {
    const activeStatuses = Array.from(document.querySelectorAll('.chk-status:checked')).map(c => c.value);
    const start = document.getElementById('search_start').value;
    const end = document.getElementById('search_end').value;
    const keyword = document.getElementById('search_keyword').value.toLowerCase();

    const filtered = serviceData.filter(item => {
        if (item.status && !activeStatuses.includes(item.status)) return false;
        if (start && item.receive_date && item.receive_date < start) return false;
        if (end && item.receive_date && item.receive_date > end) return false;
        if (keyword) {
            const searchableText = `${item.customer_name} ${item.phone} ${item.car_model} ${item.vehicle_info} ${item.symptom}`.toLowerCase();
            if (!searchableText.includes(keyword)) return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        alert('?¤ìš´ë¡œë“œ???°ì´?°ê? ?†ìŠµ?ˆë‹¤.');
        return;
    }

    const exportData = filtered.map((item, index) => ({
        'ë²ˆí˜¸': filtered.length - index,
        'ì§„í–‰?¬í•­': item.status || '',
        '?‘ìˆ˜??: item.receive_date || '',
        '?œë¹„?¤ì˜ˆ?½ì¼': item.reserve_date || '',
        'ê³ ê°ëª?: item.customer_name || '',
        'ê³ ê° ì£¼ì†Œ': item.address || '',
        '?„í™”ë²ˆí˜¸': item.phone || '',
        'ì°¨ì¢…': item.car_model || '',
        'ì°¨ëŸ‰ë²ˆí˜¸/ì°¨ë?ë²ˆí˜¸/ì£¼í–‰ê±°ë¦¬': item.vehicle_info || '',
        'ì¦ìƒ': item.symptom || '',
        '?œë¹„?¤ë°©ë²?ë°?ì§€??: item.method || '',
        '?œë¹„???´ë‹¹??: item.manager || '',
        'ì²˜ë¦¬?´ìš©': item.details || '',
        'ê³ í’ˆ?Œìˆ˜?¬ë?': item.recovery_status || '',
        'ê³ ì¥?ì¸': item.failure_cause || '',
        '?œë¹„?¤ë¹„??: item.cost || '',
        '?œë¹„?¤ì™„ë£Œì¼': item.complete_date || '',
        'ì²¨ë??¬ì§„ URL': (Array.isArray(item.images) && item.images.length > 0) ? item.images.join(', ') : ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    const collW = [
        { wch: 5 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
        { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 30 },
        { wch: 30 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 30 }
    ];
    ws['!cols'] = collW;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ServiceData");

    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Alpine_Service_Data_${dateStr}.xlsx`);
}

function showLoading(msg) {
    document.getElementById('loadingOverlay').style.display = 'flex';
    if (msg) document.getElementById('loadingText').innerText = msg;
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function renderImagePreviews() {
    const container = document.getElementById('image_preview_container');
    if (!container) return;
    container.innerHTML = '';

    // 1. Render existing images
    currentImages.forEach((url, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'preview-img-wrapper';
        wrapper.innerHTML = `
            <img src="${url}" alt="Existing A/S Photo" onclick="openImageModal('${url}', 'A/S ?¬ì§„')">
            <button type="button" class="remove-btn" onclick="removeExistingImage(${index})">&times;</button>
        `;
        container.appendChild(wrapper);
    });

    // 2. Render newly selected files
    const fImages = document.getElementById('f_images');
    if (fImages && fImages.files) {
        Array.from(fImages.files).forEach(file => {
            const objectUrl = URL.createObjectURL(file);
            const wrapper = document.createElement('div');
            wrapper.className = 'preview-img-wrapper';
            wrapper.style.borderColor = '#007bff';
            wrapper.innerHTML = `
                <img src="${objectUrl}" alt="New A/S Photo" onclick="openImageModal('${objectUrl}', '${file.name}')">
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0, 123, 255, 0.8); color: white; font-size: 0.6rem; text-align: center; padding: 2px 0; font-weight: bold;">?€ê¸?/div>
            `;
            container.appendChild(wrapper);
        });
    }
}

function removeExistingImage(index) {
    currentImages.splice(index, 1);
    renderImagePreviews();
}

async function uploadImages() {
    const fImages = document.getElementById('f_images');
    if (!fImages || !fImages.files || fImages.files.length === 0) {
        return [];
    }

    const uploadedUrls = [];
    const files = Array.from(fImages.files);

    for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
        const filePath = `service_${uniqueName}`;

        const { data, error } = await supabaseClient.storage
            .from('as-attachments')
            .upload(filePath, file);

        if (error) {
            console.error('Storage Upload Error:', error);
            throw new Error(`?Œì¼ ?…ë¡œ???¤íŒ¨: ${file.name} (${error.message})`);
        }

        const { data: { publicUrl } } = supabaseClient.storage
            .from('as-attachments')
            .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
}

function getImageColumnHtml(images) {
    if (!images || !Array.isArray(images) || images.length === 0) {
        return '<span style="color:#ccc;">-</span>';
    }

    const firstUrl = images[0];
    const hasMore = images.length > 1;
    const allUrlsJson = JSON.stringify(images).replace(/"/g, '&quot;');

    return `
        <div class="thumb-container">
            <img src="${firstUrl}" class="table-thumb" alt="Thumbnail" onclick="openLightbox(${allUrlsJson}, 0)">
            ${hasMore ? `<span class="thumb-badge">+${images.length - 1}</span>` : ''}
        </div>
    `;
}

let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, index) {
    lightboxImages = images;
    lightboxIndex = index;
    
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    
    if (!modal || !modalImg) return;
    
    modal.style.display = 'flex';
    modalImg.src = lightboxImages[lightboxIndex];
    
    updateLightboxCaption();
}

function updateLightboxCaption() {
    const captionText = document.getElementById('modalCaption');
    if (!captionText) return;
    
    if (lightboxImages.length <= 1) {
        captionText.innerHTML = `?¬ì§„ 1 / 1`;
        return;
    }
    
    captionText.innerHTML = `
        <button type="button" class="btn" style="background:#444; color:white; border:none; padding:4px 10px; margin-right:10px; cursor:pointer;" onclick="changeLightboxIndex(-1)">?´ì „</button>
        <span>?¬ì§„ ${lightboxIndex + 1} / ${lightboxImages.length}</span>
        <button type="button" class="btn" style="background:#444; color:white; border:none; padding:4px 10px; margin-left:10px; cursor:pointer;" onclick="changeLightboxIndex(1)">?¤ìŒ</button>
    `;
}

function changeLightboxIndex(direction) {
    lightboxIndex += direction;
    if (lightboxIndex < 0) lightboxIndex = lightboxImages.length - 1;
    if (lightboxIndex >= lightboxImages.length) lightboxIndex = 0;
    
    const modalImg = document.getElementById('modalImg');
    if (modalImg) modalImg.src = lightboxImages[lightboxIndex];
    updateLightboxCaption();
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.style.display = 'none';
}

// Global exposure
window.openLightbox = openLightbox;
window.changeLightboxIndex = changeLightboxIndex;
window.closeImageModal = closeImageModal;
window.removeExistingImage = removeExistingImage;

window.openImageModal = function(url, caption) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const captionText = document.getElementById('modalCaption');

    if (!modal || !modalImg) return;

    modal.style.display = 'flex';
    modalImg.src = url;
    if (captionText) captionText.innerHTML = caption;

    lightboxImages = [url];
    lightboxIndex = 0;
};

async function handleRestoreFile(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    showLoading('ë°±ì—… ?Œì¼??ë¶„ì„?˜ê³  DBë¡?ë³µêµ¬?˜ëŠ” ì¤‘ì…?ˆë‹¤...');

    try {
        const text = await file.text();
        let items = [];
        try {
            items = JSON.parse(text);
        } catch(e) {
            alert('JSON ë°±ì—… ?Œì¼ ?•ì‹???„ìš”?©ë‹ˆ??');
            hideLoading();
            return;
        }

        if (!Array.isArray(items)) {
            alert('?¬ë°”ë¥?ë°±ì—… ?Œì¼(ë°°ì—´ ?•íƒœ)???„ë‹™?ˆë‹¤.');
            hideLoading();
            return;
        }

        const supaPass = await getAdminPassword();
        const adminUser = _cachedAdminUser || 'alpineaudio';
        let successCount = 0;

        for (const item of items) {
            if (!item || !item.receive_date) continue;
            const { data, error } = await supabaseClient.schema('alpine-home').rpc('admin_upsert_service_record', {
                p_admin_username: adminUser,
                p_admin_password: supaPass,
                p_id: null,
                p_record: item
            });
            if (!error && data && data.success) {
                successCount++;
            }
        }

        alert(`ì´?${successCount}ê±´ì˜ A/S ?‘ìˆ˜ ?´ì—­???˜í¼ë² ì´??DBë¡??„ë²½?˜ê²Œ ë³µì›?˜ì—ˆ?µë‹ˆ??`);
        await loadData();
    } catch (err) {
        console.error('File Restore Error:', err);
        alert('ë³µêµ¬ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ' + err.message);
    } finally {
        hideLoading();
        input.value = '';
    }
}
window.handleRestoreFile = handleRestoreFile;
