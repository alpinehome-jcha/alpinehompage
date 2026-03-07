let serviceData = [];
let supabaseClient = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check if admin
    auth.checkAuthAndRedirect();
    if (auth.getRole() !== 'admin') {
        alert('관리자만 접근 가능한 페이지입니다.');
        window.location.href = '../index.html';
        return;
    }

    // Set default dates
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    document.getElementById('search_start').value = threeMonthsAgo.toISOString().split('T')[0];
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
});

async function loadData() {
    showLoading('데이터를 불러오는 중입니다...');

    try {
        const { data, error } = await supabaseClient
            .from('service_management')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        serviceData = data || [];
    } catch (e) {
        console.error('Supabase 데이터 로드 중 오류 발생', e);
        // Fallback to local storage if DB fails temporarily
        const local = localStorage.getItem('serviceData');
        if (local) serviceData = JSON.parse(local);
        alert('서버에서 데이터를 불러오지 못했습니다. (오류: ' + e.message + ')');
    }
    hideLoading();
    renderTable(1);
}

async function saveService() {
    const idField = document.getElementById('service_id').value;

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
        details: document.getElementById('f_details').value || null
    };

    showLoading('데이터를 저장하는 중입니다...');

    try {
        if (idField) {
            // Edit Existing Record
            const { error } = await supabaseClient
                .from('service_management')
                .update(item)
                .eq('id', parseInt(idField));

            if (error) throw error;
        } else {
            // Add New Record
            const { error } = await supabaseClient
                .from('service_management')
                .insert([item]);

            if (error) throw error;
        }

        alert('저장되었습니다.');
        resetForm();
        await loadData(); // Reload table from DB

    } catch (e) {
        console.error('Supabase DB 저장 에러:', e);
        alert('저장에 실패했습니다. 관리자에게 문의하세요.\n\n오류: ' + e.message);
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

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteService(id) {
    if (!confirm('정말 이 기록을 삭제하시겠습니까? (삭제 후 복구 불가능합니다)')) return;

    showLoading('데이터를 삭제하는 중입니다...');
    try {
        const { error } = await supabaseClient
            .from('service_management')
            .delete()
            .eq('id', parseInt(id));

        if (error) throw error;

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
            <td style="text-align:right;">${item.cost || ''}</td>
            <td>${item.complete_date || ''}</td>
            <td style="padding:4px;"><button class="btn btn-edit" style="width:100%; padding: 4px; font-size: 0.8rem;" onclick="editService(${item.id})">수정</button></td>
            <td style="padding:4px;"><button class="btn btn-delete" style="width:100%; padding: 4px; font-size: 0.8rem;" onclick="deleteService(${item.id})">삭제</button></td>
        `;
        tbody.appendChild(tr);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="17" style="padding: 20px; text-align: center; color: #999;">검색된 데이터가 없습니다.</td></tr>`;
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
        '서비스비용': item.cost || '',
        '서비스완료일': item.complete_date || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    const collW = [
        { wch: 5 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
        { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 30 },
        { wch: 30 }, { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 12 }
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
