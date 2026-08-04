import re

path = r'd:\안티그래피티 work\alpinehompage\pages\admin.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. saveDealer for service_admin
content = re.sub(
    r"(p_category: 'Service Admin'\s*\}\);\s*)(if \(isNew\))",
    r"\1\n                    if (error || (data && data.error)) {\n                        if ((data && data.error === 'unauthorized') || (error && error.message && error.message.includes('unauthorized'))) {\n                            _cachedAdminPass = null;\n                            alert('비밀번호가 틀렸거나 권한이 없습니다.');\n                        } else {\n                            alert('저장 실패: ' + (error ? error.message : data.error));\n                        }\n                        if (overlay) overlay.style.display = 'none';\n                        return;\n                    }\n\n                    \2",
    content
)

# 2. saveDealer for dealers
content = re.sub(
    r"(p_tistory_url: newItem.tistory_url\s*\}\);\s*)(if \(!isEdit\))",
    r"\1\n                    if (error || (data && data.error)) {\n                        if ((data && data.error === 'unauthorized') || (error && error.message && error.message.includes('unauthorized'))) {\n                            _cachedAdminPass = null;\n                            alert('비밀번호가 틀렸거나 권한이 없습니다.');\n                        } else {\n                            alert('저장 실패: ' + (error ? error.message : data.error));\n                        }\n                        if (overlay) overlay.style.display = 'none';\n                        return;\n                    }\n\n                    \2",
    content
)

# 3. deleteDealerFromSupabase
content = re.sub(
    r"(async function deleteDealerFromSupabase\(username\) \{.*?(?=^\s*\})\}?)",
    r"""async function deleteDealerFromSupabase(username) {
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
        }""",
    content,
    flags=re.DOTALL | re.MULTILINE
)

# 4. deleteCurrent (dealers)
content = re.sub(
    r"const deletedUsername = deletedDealer \? deletedDealer\.username : null;\s*dealers = dealers\.filter\(d => d\.id !== currentId\);\s*// Supabase[^\n]*\s*if \(deletedUsername\) \{.*?\}\s*\}",
    r"""const deletedUsername = deletedDealer ? deletedDealer.username : null;

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
            }""",
    content,
    flags=re.DOTALL
)

# 5. deleteCurrent (service_admin)
content = re.sub(
    r"if \(deletedUsername\) \{\s*await deleteDealerFromSupabase\(deletedUsername\);\s*\}",
    r"""if (deletedUsername) {
                    const success = await deleteDealerFromSupabase(deletedUsername);
                    if (!success) {
                        if (overlay) overlay.style.display = 'none';
                        return;
                    }
                }""",
    content
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("PATCH_SUCCESS")
