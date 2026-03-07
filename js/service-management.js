let serviceData = [];
const GITHUB_DATA_PATH = 'assets/data/service-data.json';

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

    // Load GitHub client
    try {
        await auth.loadGitHubClient();
        await loadData();
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
        renderTable();
    }));
});

async function loadData() {
    showLoading('데이터를 불러오는 중입니다...');
    try {
        if (!ghClient.globalConfigured) {
            const t = localStorage.getItem('github_token');
            const r = localStorage.getItem('github_repo');
            const b = localStorage.getItem('github_branch');
            if (t && r) {
                ghClient.configure(t, r, b || 'main');
            } else {
                alert('GitHub 설정이 필요합니다. 상단 메뉴에서 GitHub 설정을 진행해주세요.');
                hideLoading();
                return;
            }
        }

        const url = `https://raw.githubusercontent.com/${ghClient.repo}/${ghClient.branch}/${GITHUB_DATA_PATH}?t=${Date.now()}`;
        const response = await fetch(url);
        if (response.ok) {
            serviceData = await response.json();
            // Assign IDs if missing
            serviceData.forEach((item, idx) => {
                if (!item.id) item.id = Date.now() + idx;
            });
        } else if (response.status === 404) {
            // File not found, start fresh
            serviceData = [];
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } catch (e) {
        console.warn('Network error loading service data, checking local storage', e);
        const local = localStorage.getItem('serviceData');
        if (local) serviceData = JSON.parse(local);
    }
    hideLoading();

    // Sort descending by id
    serviceData.sort((a, b) => (b.id || 0) - (a.id || 0));
    renderTable();
}

async function saveDataToGH() {
    showLoading('데이터를 저장하는 중입니다...');
    try {
        localStorage.setItem('serviceData', JSON.stringify(serviceData)); // Backup local

        const content = JSON.stringify(serviceData, null, 2);
        const file = new File([content], 'service-data.json', { type: 'application/json' });

        const res = await ghClient.uploadFile(GITHUB_DATA_PATH, file, `Update service data: ${new Date().toISOString()}`);
        if (res.success) {
            alert('저장되었습니다.');
        } else {
            alert('저장 실패: ' + res.message);
        }
    } catch (e) {
        alert('GitHub 저장 중 오류 발생: ' + e.message);
    }
    hideLoading();
}

function saveService() {
    const idField = document.getElementById('service_id').value;
    const f_receive_date = document.getElementById('f_receive_date').value;
    const f_status = document.getElementById('f_status').value;
    const f_customer_name = document.getElementById('f_customer_name').value;
    const f_address = document.getElementById('f_address').value;
    const f_vehicle_info = document.getElementById('f_vehicle_info').value;
    const f_reserve_date = document.getElementById('f_reserve_date').value;
    const f_car_model = document.getElementById('f_car_model').value;
    const f_phone = document.getElementById('f_phone').value;
    const f_symptom = document.getElementById('f_symptom').value;
    const f_method = document.getElementById('f_method').value;
    const f_complete_date = document.getElementById('f_complete_date').value;
    const f_manager = document.getElementById('f_manager').value;
    const f_cost = document.getElementById('f_cost').value;
    const f_details = document.getElementById('f_details').value;

    const item = {
        id: idField ? parseInt(idField) : Date.now(),
        receive_date: f_receive_date,
        status: f_status,
        customer_name: f_customer_name,
        address: f_address,
        vehicle_info: f_vehicle_info,
        reserve_date: f_reserve_date,
        car_model: f_car_model,
        phone: f_phone,
        symptom: f_symptom,
        method: f_method,
        complete_date: f_complete_date,
        manager: f_manager,
        cost: f_cost,
        details: f_details,
        created_at: idField ? undefined : new Date().toISOString()
    };

    if (idField) {
        // Edit
        const index = serviceData.findIndex(s => s.id == idField);
        if (index > -1) {
            serviceData[index] = { ...serviceData[index], ...item };
        }
    } else {
        // Add
        serviceData.unshift(item); // Add to top
    }

    resetForm();
    renderTable();
    saveDataToGH();
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

function deleteService(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const index = serviceData.findIndex(s => s.id == id);
    if (index > -1) {
        serviceData.splice(index, 1);
        resetForm();
        renderTable();
        saveDataToGH();
    }
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
    renderTable();
}

function renderTable() {
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

    let displayId = filtered.length;

    filtered.forEach(item => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${displayId--}</td>
            <td>${item.status || ''}</td>
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
