const fs = require('fs');
const path = require('path');

const filePath = path.resolve('pages', 'admin.html');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

function replaceExact(content, search, replacement) {
    const s = search.replace(/\r\n/g, '\n');
    const r = replacement.replace(/\r\n/g, '\n');
    const idx = content.indexOf(s);
    if (idx === -1) {
        console.error("Could not find string:\n" + s);
        return content;
    }
    return content.slice(0, idx) + r + content.slice(idx + s.length);
}

// 1. saveDealer for dealers (lines ~1891-1905)
const target1 = `                        p_tistory_url: newItem.tistory_url
                    });

                    if (!isEdit) {`;
const replace1 = `                        p_tistory_url: newItem.tistory_url
                    });

                    if (error || (data && data.error)) {
                        if ((data && data.error === 'unauthorized') || (error && error.message && error.message.includes('unauthorized'))) {
                            _cachedAdminPass = null;
                            alert('비밀번호가 틀렸거나 권한이 없습니다.');
                        } else {
                            alert('저장 실패: ' + (error ? error.message : data.error));
                        }
                        if (overlay) overlay.style.display = 'none';
                        return;
                    }

                    if (!isEdit) {`;
content = replaceExact(content, target1, replace1);

// 2. deleteDealerFromSupabase (lines ~2739-2755)
const target2 = `        async function deleteDealerFromSupabase(username) {
            try {
                const supaPass = await getAdminPassword();
                if (!supaPass) return;
                const adminUser = (window.authState && window.authState.currentUser) ? window.authState.currentUser : 'alpineaudio';
                const client = await getSupaAdmin();
                const { error } = await client.rpc('admin_delete_dealer', {
                    p_admin_username: adminUser,
                    p_admin_password: supaPass,
                    p_username: username
                });
                if (error) console.warn('[Supabase] 삭제 실패:', error.message);
                else console.log('[Supabase] DB 삭제 완료:', username);
            } catch (e) {
                console.warn('[Supabase] 예외 발생:', e.message);
            }
        }`;
const replace2 = `        async function deleteDealerFromSupabase(username) {
            try {
                const supaPass = await getAdminPassword();
                if (!supaPass) return false;
                const adminUser = (window.authState && window.authState.currentUser) ? window.authState.currentUser : 'alpineaudio';
                const client = await getSupaAdmin();
                const { data, error } = await client.rpc('admin_delete_dealer', {
                    p_admin_username: adminUser,
                    p_admin_password: supaPass,
                    p_username: username
                });
                if (error || (data && data.error)) {
                    if ((data && data.error === 'unauthorized') || (error && error.message && error.message.includes('unauthorized'))) {
                        _cachedAdminPass = null;
                        alert('비밀번호가 틀렸거나 권한이 없습니다.');
                    } else {
                        alert('삭제 오류: ' + (error ? error.message : data.error));
                    }
                    return false;
                }
                console.log('[Supabase] DB 삭제 완료:', username);
                return true;
            } catch (e) {
                console.warn('[Supabase] 예외 발생:', e.message);
                return false;
            }
        }`;
content = replaceExact(content, target2, replace2);

// 3. deleteCurrent for service_admin (lines ~2144-2146)
const target3 = `                if (deletedUsername) {
                    await deleteDealerFromSupabase(deletedUsername);
                }`;
const replace3 = `                if (deletedUsername) {
                    const success = await deleteDealerFromSupabase(deletedUsername);
                    if (!success) {
                        if (overlay) overlay.style.display = 'none';
                        return;
                    }
                }`;
content = replaceExact(content, target3, replace3);

// 4. deleteCurrent for dealers (lines ~2160-2180)
const target4 = `                // 현재 삭제 대상의 username 찾기
                const deletedDealer = dealers.find(d => d.id === currentId);
                const deletedUsername = deletedDealer ? deletedDealer.username : null;

                dealers = dealers.filter(d => d.id !== currentId);

                // Supabase에서 삭제 (dealers + users 동시 삭제)
                if (deletedUsername) {
                    const supaPass = await getAdminPassword();
                    if (supaPass) {
                        const adminUser = window.authState.currentUser;
                        const client = await getSupaAdmin();
                        const { error } = await client.rpc('admin_delete_dealer', {
                            p_admin_username: adminUser,
                            p_admin_password: supaPass,
                            p_username: deletedUsername
                        });
                        if (error) console.warn('[Supabase] 삭제 실패:', error.message);
                    }
                }
            }`;
const replace4 = `                // 현재 삭제 대상의 username 찾기
                const deletedDealer = dealers.find(d => d.id === currentId);
                const deletedUsername = deletedDealer ? deletedDealer.username : null;

                // Supabase에서 먼저 삭제 시도
                if (deletedUsername) {
                    const supaPass = await getAdminPassword();
                    if (supaPass) {
                        const adminUser = window.authState.currentUser;
                        const client = await getSupaAdmin();
                        const { data, error } = await client.rpc('admin_delete_dealer', {
                            p_admin_username: adminUser,
                            p_admin_password: supaPass,
                            p_username: deletedUsername
                        });
                        if (error || (data && data.error)) {
                            console.warn('[Supabase] 삭제 실패:', error || data.error);
                            if ((data && data.error === 'unauthorized') || (error && error.message && error.message.includes('unauthorized'))) {
                                _cachedAdminPass = null;
                                alert('비밀번호가 틀렸거나 권한이 없습니다.');
                            } else {
                                alert('오류가 발생했습니다: ' + (error ? error.message : data.error));
                            }
                            return; // 중단
                        }
                    } else {
                        return; // 비밀번호 취소 시 중단
                    }
                }
                
                dealers = dealers.filter(d => d.id !== currentId);
            }`;
content = replaceExact(content, target4, replace4);

fs.writeFileSync(filePath, content, 'utf8');
console.log('PATCH_SUCCESS');
