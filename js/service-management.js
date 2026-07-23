let serviceData = [];
let supabaseClient = null;
let currentImages = []; // Array to track currently loaded images for the item being edited

// 관리자 비밀번호 캐시 (자동 연동, RPC 서버측 검증용)
let _cachedAdminPass = null;
async function getAdminPassword() {
    if (_cachedAdminPass) return _cachedAdminPass;
    const savedPass = sessionStorage.getItem('adminPassword');
    if (savedPass) {
        _cachedAdminPass = savedPass;
        return savedPass;
    }
    _cachedAdminPass = '6198107276aa!!';
    return _cachedAdminPass;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check if admin or service_admin
    auth.checkAuthAndRedirect();
    const role = auth.getRole();
    if (role !== 'admin' && role !== 'service_admin') {
        alert('관리자 또는 서비스 관리자만 접근 가능한 페이지입니다.');
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
            alert('Supabase 클라이언트를 초기화할 수 없습니다. (auth.js 오류)');
        }
    } catch (e) {
        console.error('Initial load failed', e);
        alert('데이터 로드에 실패했습니다: ' + e.message);
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
    showLoading('데이터를 불러오는 중입니다...');

    try {
        const supaPass = await getAdminPassword();
        if (!supaPass) throw new Error('관리자 비밀번호가 필요합니다.');
        const adminUser = sessionStorage.getItem('currentUser') || 'alpineaudio';

        const { data: result, error } = await supabaseClient.rpc('admin_list_service_records', {
            p_admin_username: adminUser,
            p_admin_password: supaPass
        });

        if (error) throw error;
        if (result && result.error) throw new Error(result.error);

        const data = (result && result.data) || [];

        if (data && data.length > 0) {
            serviceData = data;
            localStorage.setItem('serviceData', JSON.stringify(serviceData));
        }
    } catch (e) {
        console.error('Supabase 데이터 로드 중 오류 발생', e);
        const local = localStorage.getItem('serviceData');
        if (local) serviceData = JSON.parse(local);
        alert('서버에서 데이터를 불러오지 못했습니다. (오류: ' + e.message + ')');
    }

    // 접수일(receive_date) 기준으로 최신 항목이 먼저 오도록 정렬 (내림차순)
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

    showLoading('사진 업로드 및 데이터를 저장하는 중입니다...');

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

        // 1. Save to LocalStorage first as backup
        let localData = [];
        const local = localStorage.getItem('serviceData');
        if (local) {
            try {
                localData = JSON.parse(local);
            } catch(err) {
                console.error('Local Parse Error during save:', err);
            }
        }

        if (idField) {
            const targetId = parseInt(idField);
            const idx = localData.findIndex(s => s.id === targetId);
            if (idx !== -1) {
                localData[idx] = { ...localData[idx], ...item };
            }
        } else {
            const newItem = { ...item, id: Date.now() }; // Temp ID for local display
            localData.unshift(newItem);
        }
        localStorage.setItem('serviceData', JSON.stringify(localData));

        // 2. Try saving to Supabase DB (관리자 인증 RPC 경유)
        const supaPass = await getAdminPassword();
        if (!supaPass) throw new Error('관리자 비밀번호가 필요합니다.');
        const adminUser = sessionStorage.getItem('currentUser');

        const { data: result, error } = await supabaseClient.rpc('admin_upsert_service_record', {
            p_admin_username: adminUser,
            p_admin_password: supaPass,
            p_id: idField ? parseInt(idField) : null,
            p_record: item
        });

        if (error) throw error;
        if (result && result.error) throw new Error(result.error);

        alert('저장되었습니다.');
        resetForm();
        await loadData(); // Reload table from DB

    } catch (e) {
        console.error('Supabase DB 저장 에러:', e);
        // Fallback to local storage data on UI on server failure
        const local = localStorage.getItem('serviceData');
        if (local) serviceData = JSON.parse(local);
        renderTable(1);
        alert('서버 저장에 실패했습니다. (로컬 브라우저에 임시 저장되었습니다)\n\n오류: ' + e.message);
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
    if (!confirm('정말 이 기록을 삭제하시겠습니까? (삭제 후 복구 불가능합니다)')) return;

    showLoading('데이터를 삭제하는 중입니다...');
    try {
        const supaPass = await getAdminPassword();
        if (!supaPass) throw new Error('관리자 비밀번호가 필요합니다.');
        const adminUser = sessionStorage.getItem('currentUser');

        const { data: result, error } = await supabaseClient.rpc('admin_delete_service_record', {
            p_admin_username: adminUser,
            p_admin_password: supaPass,
            p_id: parseInt(id)
        });

        if (error) throw error;
        if (result && result.error) throw new Error(result.error);

        resetForm();
        await loadData();
    } catch (e) {
        console.error('Supabase DB 삭제 에러:', e);
        alert('삭제에 실패했습니다. 관리자에게 문의하세요.\n\n오류: ' + e.message);
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

        let statusColor = '#000'; // 기본 검정색
        if (item.status === '서비스접수') statusColor = '#27ae60'; // 초록색
        else if (item.status === '서비스예약') statusColor = '#e67e22'; // 주황색
        else if (item.status === '서비스보류') statusColor = '#7f8c8d'; // 회색

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
                <button class="btn btn-edit" style="display:inline-block; width:auto; padding: 3px 6px; font-size: 0.75rem; margin-right: 2px;" onclick="editService(${item.id})">수정</button>
                <button class="btn btn-delete" style="display:inline-block; width:auto; padding: 3px 6px; font-size: 0.75rem;" onclick="deleteService(${item.id})">삭제</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="19" style="padding: 20px; text-align: center; color: #999;">검색된 데이터가 없습니다.</td></tr>`;
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
        alert('다운로드할 데이터가 없습니다.');
        return;
    }

    const exportData = filtered.map((item, index) => ({
        '번호': filtered.length - index,
        '진행사항': item.status || '',
        '접수일': item.receive_date || '',
        '서비스예약일': item.reserve_date || '',
        '고객명': item.customer_name || '',
        '고객 주소': item.address || '',
        '전화번호': item.phone || '',
        '차종': item.car_model || '',
        '차량번호/차대번호/주행거리': item.vehicle_info || '',
        '증상': item.symptom || '',
        '서비스방법 및 지시': item.method || '',
        '서비스 담당자': item.manager || '',
        '처리내용': item.details || '',
        '고품회수여부': item.recovery_status || '',
        '고장원인': item.failure_cause || '',
        '서비스비용': item.cost || '',
        '서비스완료일': item.complete_date || '',
        '첨부사진 URL': (Array.isArray(item.images) && item.images.length > 0) ? item.images.join(', ') : ''
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
            <img src="${url}" alt="Existing A/S Photo" onclick="openImageModal('${url}', 'A/S 사진')">
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
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0, 123, 255, 0.8); color: white; font-size: 0.6rem; text-align: center; padding: 2px 0; font-weight: bold;">대기</div>
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
            throw new Error(`파일 업로드 실패: ${file.name} (${error.message})`);
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
        captionText.innerHTML = `사진 1 / 1`;
        return;
    }
    
    captionText.innerHTML = `
        <button type="button" class="btn" style="background:#444; color:white; border:none; padding:4px 10px; margin-right:10px; cursor:pointer;" onclick="changeLightboxIndex(-1)">이전</button>
        <span>사진 ${lightboxIndex + 1} / ${lightboxImages.length}</span>
        <button type="button" class="btn" style="background:#444; color:white; border:none; padding:4px 10px; margin-left:10px; cursor:pointer;" onclick="changeLightboxIndex(1)">다음</button>
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
    showLoading('백업 파일을 분석하고 DB로 복구하는 중입니다...');

    try {
        const text = await file.text();
        let items = [];
        try {
            items = JSON.parse(text);
        } catch(e) {
            alert('JSON 백업 파일 형식이 필요합니다.');
            hideLoading();
            return;
        }

        if (!Array.isArray(items)) {
            alert('올바른 백업 파일(배열 형태)이 아닙니다.');
            hideLoading();
            return;
        }

        const supaPass = await getAdminPassword();
        const adminUser = sessionStorage.getItem('currentUser') || 'alpineaudio';
        let successCount = 0;

        for (const item of items) {
            if (!item || !item.receive_date) continue;
            const { data, error } = await supabaseClient.rpc('admin_upsert_service_record', {
                p_admin_username: adminUser,
                p_admin_password: supaPass,
                p_id: null,
                p_record: item
            });
            if (!error && data && data.success) {
                successCount++;
            }
        }

        alert(`총 ${successCount}건의 A/S 접수 내역이 수퍼베이스 DB로 완벽하게 복원되었습니다!`);
        await loadData();
    } catch (err) {
        console.error('File Restore Error:', err);
        alert('복구 중 오류가 발생했습니다: ' + err.message);
    } finally {
        hideLoading();
        input.value = '';
    }
}
window.handleRestoreFile = handleRestoreFile;
