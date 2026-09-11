
        document.addEventListener('DOMContentLoaded', async () => {
            // Render Dealers
            const containers = {
                'Alpine Sound Master': document.getElementById('list_sound_master'),
                'Team Alpine': document.getElementById('list_team_alpine'),
                'Alpine Style Distributor': document.getElementById('list_style_dist'),
                'Alpine Regional Distributor': document.getElementById('list_regional_dist'),
                'Alpine Dealer': document.getElementById('list_dealer')
            };

            let dealerList = [];
            if (typeof fetchDealerList === 'function') {
                dealerList = await fetchDealerList();
            }

            if (dealerList && dealerList.length > 0) {
                // Region Order
                const REGION_ORDER = [
                    '서울',
                    '경기북부(고양,파주,의정부,양주)',
                    '경기서부(김포,부천,광명,안산)',
                    '경기중앙(성남,안양,용인,과천)',
                    '경기동부(남양주,하남,이천,양평)',
                    '경기남부(수원,화성,평택,안성)',
                    '인천', '대전', '세종', '충북', '충남', '강원', '전북', '광주', '전남', '대구', '울산', '경북', '부산', '경남', '제주'
                ];

                // Fallback Regions for original IDs (Safety net)
                const fallbackRegions = {
                    1: '경기중앙(성남,안양,용인,과천)', // Anyang
                    2: '부산', // Busan
                    3: '대구', // Daegu
                    4: '인천', // Incheon
                    5: '광주', // Gwangju
                    6: '대전'  // Daejeon
                };

                // Helper to get effective region
                function getRegion(d) {
                    if (d.region) return d.region;
                    if (fallbackRegions[d.id]) return fallbackRegions[d.id];

                    // Smart Fallback from Address
                    if (d.address) {
                        const addr = d.address;
                        if (addr.includes('서울') || addr.includes('Seoul')) return '서울';
                        if (addr.includes('인천') || addr.includes('Incheon')) return '인천';
                        if (addr.includes('대전') || addr.includes('Daejeon')) return '대전';
                        if (addr.includes('대구') || addr.includes('Daegu')) return '대구';
                        if (addr.includes('제주') || addr.includes('Jeju')) return '제주';

                        // Gyeonggi details
                        // Priority Check: Gyeonggi Gwangju vs Gwangju Metro
                        if (addr.includes('경기') && addr.includes('광주')) return '경기동부(남양주,하남,이천,양평)'; // Gwangju-si, Gyeonggi-do

                        // Standard Gwangju Metro check (if not caught above)
                        if (addr.includes('광주') || addr.includes('Gwangju')) return '광주';

                        if (addr.includes('고양') || addr.includes('파주') || addr.includes('의정부') || addr.includes('양주')) return '경기북부(고양,파주,의정부,양주)';
                        if (addr.includes('김포') || addr.includes('부천') || addr.includes('광명') || addr.includes('안산')) return '경기서부(김포,부천,광명,안산)';
                        if (addr.includes('성남') || addr.includes('안양') || addr.includes('용인') || addr.includes('과천')) return '경기중앙(성남,안양,용인,과천)';
                        if (addr.includes('남양주') || addr.includes('하남') || addr.includes('이천') || addr.includes('양평')) return '경기동부(남양주,하남,이천,양평)';
                        if (addr.includes('수원') || addr.includes('화성') || addr.includes('평택') || addr.includes('안성')) return '경기남부(수원,화성,평택,안성)';
                        if (addr.includes('경기') || addr.includes('Gyeonggi')) return '경기중앙(성남,안양,용인,과천)'; // Default Gyeonggi
                    }
                    return '기타';
                }

                // Data Correction Loop (Fix Bad Data on Load)
                dealerList.forEach(d => {
                    // Fix: Auto Gallery (Oto Gallery) location
                    if (d.name && (d.name.includes('오토갤러리') || d.name.includes('Auto Gall') || d.name.includes('Autogallery'))) {
                        d.region = '서울'; // Force region correction
                    }

                    // Fix: Luxury Car Club (럭셔리카클럽)
                    if (d.name && (d.name.includes('럭셔리카') || d.name.includes('Luxury Car'))) {
                        d.region = '경기남부(수원,화성,평택,안성)';
                    }
                });

                // Sort by Region Order
                dealerList.sort((a, b) => {
                    const rA = getRegion(a);
                    const rB = getRegion(b);
                    let idxA = REGION_ORDER.indexOf(rA);
                    let idxB = REGION_ORDER.indexOf(rB);

                    // If not in list, put at the end
                    if (idxA === -1) idxA = 999;
                    if (idxB === -1) idxB = 999;

                    return idxA - idxB;
                });

                // --- Map Logic (Leaflet) ---
                // Show Map only for Admin
                const userRole = sessionStorage.getItem('userRole');
                if (userRole === 'admin') {
                    const mapDiv = document.getElementById('map');
                    if (mapDiv) mapDiv.style.display = 'block';

                    // Center roughly on South Korea
                    const map = L.map('map').setView([36.5, 127.8], 7);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: 'ⓒ OpenStreetMap'
                    }).addTo(map);

                    // Region Centers for Fallback (Lat/Lng)
                    const REGION_CENTERS = {
                        '서울': [37.5665, 126.9780],
                        '경기북부': [37.7460, 127.0540], // Uijeongbu approx
                        '경기서부': [37.4200, 126.7800], // Bucheon/Gwangmyeong
                        '경기중앙': [37.3943, 126.9568], // Anyang
                        '경기동부': [37.5500, 127.2500], // Hanam/Namyangju
                        '경기남부': [37.1500, 127.0500], // Osan/Pyeongtaek
                        '인천': [37.4563, 126.7052],
                        '대전': [36.3504, 127.3845],
                        '세종': [36.4800, 127.2890],
                        '충북': [36.6350, 127.4914], // Cheongju
                        '충남': [36.6588, 126.6728], // Hongseong (Provincial Gov)
                        '강원': [37.8854, 127.7298], // Chuncheon
                        '전북': [35.8242, 127.1480], // Jeonju
                        '광주': [35.1595, 126.8526],
                        '전남': [34.8161, 126.4629], // Muan (Provincial Gov)
                        '대구': [35.8714, 128.6014],
                        '울산': [35.5384, 129.3114],
                        '경북': [36.5760, 128.5056], // Andong (Provincial Gov)
                        '부산': [35.1796, 129.0756],
                        '경남': [35.2383, 128.6922], // Changwon
                        '제주': [33.4996, 126.5312]
                    };

                    // Collision Detection & Prevention
                    const placedMarkers = [];
                    const MIN_DIST = 0.04; // Minimum distance in degrees (approx visible separation at zoom 7)

                    function getAdjustedPosition(lat, lng) {
                        let newLat = lat;
                        let newLng = lng;
                        let collision = true;
                        let attempt = 0;

                        // Spiral parameters
                        const angleStep = 0.5; // rad
                        const distStep = 0.005; // degrees

                        while (collision && attempt < 100) {
                            collision = false;
                            for (const pos of placedMarkers) {
                                const dLat = newLat - pos.lat;
                                const dLng = newLng - pos.lng;
                                // Euclidean distance approximation is sufficient here
                                const dist = Math.sqrt(dLat * dLat + dLng * dLng);
                                if (dist < MIN_DIST) {
                                    collision = true;
                                    break;
                                }
                            }

                            if (collision) {
                                attempt++;
                                // Move in a spiral pattern
                                const angle = attempt * angleStep;
                                const radius = attempt * distStep;
                                newLat = lat + Math.cos(angle) * radius; // Lat usually y
                                newLng = lng + Math.sin(angle) * radius; // Lng usually x
                            }
                        }

                        placedMarkers.push({ lat: newLat, lng: newLng });
                        return { lat: newLat, lng: newLng };
                    }

                    dealerList.forEach(d => {
                        let lat, lng;

                        // STRICT REGION MODE: Always use Region Center
                        const r = getRegion(d);
                        let key = r;
                        if (r.startsWith('경기')) key = r.substring(0, 4); // Match keys: 경기북부, 경기남부 etc.

                        if (REGION_CENTERS[key]) {
                            lat = REGION_CENTERS[key][0];
                            lng = REGION_CENTERS[key][1];
                        } else {
                            // Default center if unknown region (Sea of OKhotsk to hide?)
                            lat = 36.5;
                            lng = 127.8;
                        }

                        // Adjust position to prevent overlap
                        const pos = getAdjustedPosition(lat, lng);

                        // Determing Icon Class
                        let pinClass = 'pin-orange'; // Default
                        if (d.category === 'Alpine Sound Master' || d.category === 'Team Alpine') {
                            pinClass = 'pin-blue';
                        } else if (d.category === 'Alpine Style Distributor') {
                            pinClass = 'pin-green';
                        }

                        const startIcon = L.divIcon({
                            className: 'custom-div-icon',
                            html: `<div class="custom-pin ${pinClass}"></div>`,
                            iconSize: [16, 16],
                            iconAnchor: [8, 8],
                            popupAnchor: [0, -10]
                        });

                        const marker = L.marker([pos.lat, pos.lng], { icon: startIcon }).addTo(map);

                        // Popup text
                        const popupContent = `<b>${d.name}</b><br>${d.category}<br>${d.phone}<br><button onclick="scrollToDealer(${d.id})" style="margin-top:5px; padding:2px 5px; cursor:pointer;">Show Details</button>`;
                        marker.bindPopup(popupContent);
                    });
                } // End Admin Check

                // Global function for scroll (keep accessible)
                window.scrollToDealer = function (id) {
                    const card = document.querySelector(`.dealer-card[data-id="${id}"]`);
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.classList.add('highlight');
                        setTimeout(() => card.classList.remove('highlight'), 2000);
                    }
                };

                dealerList.forEach(dealer => {
                    const container = containers[dealer.category];
                    if (container) {
                        const card = document.createElement('div');
                        card.className = 'dealer-card';
                        card.setAttribute('data-id', dealer.id);

                        // Calculate distance for verification (Optional: remove in prod)
                        // const dist = Math.sqrt(getDistSq(dealer)).toFixed(0); 

                        // Badge HTML if exists
                        const hasSns = (dealer.homepage || dealer.blog_url || dealer.tistory_url || dealer.instagram_url || dealer.youtube_url || dealer.facebook_url);
                        const shiningClass = hasSns ? 'shining' : '';
                        const badgeHtml = dealer.badge ? `<span class="badge-certified ${shiningClass}">${dealer.badge}</span>` : '';

                        // Construct SNS links bar
                        let snsHtml = '';
                        const snsLinks = [];

                        if (dealer.homepage) {
                            snsLinks.push(`
                                <a href="${dealer.homepage}" target="_blank" class="sns-link homepage" title="홈페이지 방문">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sns-icon-svg"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                </a>
                            `);
                        }
                        if (dealer.blog_url) {
                            snsLinks.push(`
                                <a href="${dealer.blog_url}" target="_blank" class="sns-link blog" title="네이버 블로그 방문">
                                    <img src="../assets/images/icon-blog.png" alt="Naver Blog" style="width: 14px; height: 14px; object-fit: contain;">
                                </a>
                            `);
                        }
                        if (dealer.tistory_url) {
                            snsLinks.push(`
                                <a href="${dealer.tistory_url}" target="_blank" class="sns-link tistory" title="티스토리 방문">
                                    <svg viewBox="0 0 24 24" width="14" height="14" class="sns-icon-svg" fill="currentColor" style="color: #EB533E;"><rect width="24" height="24" rx="4" fill="#EB533E"/><path d="M6 6h12v3h-4.5v9h-3v-9H6V6z" fill="#FFF"/></svg>
                                </a>
                            `);
                        }
                        if (dealer.instagram_url) {
                            snsLinks.push(`
                                <a href="${dealer.instagram_url}" target="_blank" class="sns-link instagram" title="인스타그램 방문">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sns-icon-svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                            `);
                        }
                        if (dealer.youtube_url) {
                            snsLinks.push(`
                                <a href="${dealer.youtube_url}" target="_blank" class="sns-link youtube" title="유튜브 방문">
                                    <svg viewBox="0 0 24 24" width="14" height="14" class="sns-icon-svg" fill="currentColor" style="color: #FF0000;"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                </a>
                            `);
                        }
                        if (dealer.facebook_url) {
                            snsLinks.push(`
                                <a href="${dealer.facebook_url}" target="_blank" class="sns-link facebook" title="페이스북 방문">
                                    <svg viewBox="0 0 24 24" width="14" height="14" class="sns-icon-svg" fill="currentColor" style="color: #1877F2;"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                            `);
                        }

                        if (snsLinks.length > 0) {
                            snsHtml = `<div class="sns-bar">${snsLinks.join('')}</div>`;
                        }

                        card.innerHTML = `
                            <div class="dealer-card-header">
                                ${badgeHtml}
                                ${snsHtml}
                            </div>
                            <h3 class="dealer-name">${dealer.name}</h3>
                            <div class="dealer-info">
                                <span>${dealer.address}</span>
                                <span>${dealer.phone}</span>
                                <span class="dealer-desc">${dealer.desc}</span>
                            </div>
                         `;

                        container.appendChild(card);
                        
                        // Add JSON-LD for this dealer
                        const script = document.createElement('script');
                        script.type = 'application/ld+json';
                        
                        const schemaData = {
                            "@context": "https://schema.org",
                            "@type": "AutoPartsStore",
                            "name": dealer.name,
                            "telephone": dealer.phone,
                            "address": dealer.address,
                            "serviceType": ["Car Audio Installation", "Dashcam Setup", "DSP Tuning"]
                        };
                        
                        if (dealer.lat && dealer.lng) {
                            schemaData.geo = {
                                "@type": "GeoCoordinates",
                                "latitude": dealer.lat,
                                "longitude": dealer.lng
                            };
                        }
                        
                        script.text = JSON.stringify(schemaData);
                        document.head.appendChild(script);
                    }
                });
            }

            // Hide empty categories
            Object.values(containers).forEach(container => {
                if (container && container.children.length === 0) {
                    container.style.display = 'none';
                    // Hide the header immediately preceding the list
                    const header = container.previousElementSibling;
                    if (header && header.classList.contains('category-title')) {
                        header.style.display = 'none';
                    }
                }
            });
        });
    
