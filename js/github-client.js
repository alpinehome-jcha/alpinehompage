/**
 * GitHub Client for saving data to the repository.
 * Commits are performed server-side (Supabase RPC + admin password
 * verification) via the "alpine-home".admin_github_* functions —
 * the GitHub token itself never touches the browser.
 */
if (typeof GitHubClient === 'undefined') {
    async function _ghGetAdminPassword() {
        return sessionStorage.getItem('adminPassword');
    }

    class GitHubClient {
        constructor() {
            this.repo = '';
            this.branch = 'main';
            this._configured = false;
        }

        async _adminCall(rpcName, params) {
            const adminUser = sessionStorage.getItem('currentUser');
            const adminPass = await _ghGetAdminPassword();
            if (!adminPass) throw new Error('관리자 비밀번호가 필요합니다.');

            const client = await loadSupabase();
            const { data, error } = await client.rpc(rpcName, {
                p_admin_username: adminUser,
                p_admin_password: adminPass,
                ...params
            });

            if (error) throw new Error(error.message);
            if (data && data.error) throw new Error(data.error);
            return data;
        }

        isConfigured() {
            return this._configured;
        }

        async configure(token, repo, branch) {
            repo = repo ? repo.trim() : '';
            repo = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
            if (repo.endsWith('/')) repo = repo.slice(0, -1);
            branch = branch ? branch.trim() : 'main';

            await this._adminCall('admin_set_github_config', {
                p_token: token ? token.replace(/\s+/g, '') : '',
                p_repo: repo,
                p_branch: branch
            });

            this.repo = repo;
            this.branch = branch;
            this._configured = true;
        }

        async refreshStatus() {
            // 토큰 값은 절대 반환하지 않는 공개 상태 조회라 관리자 인증 불필요
            const client = await loadSupabase();
            const { data, error } = await client.rpc('admin_github_status');
            if (error) throw new Error(error.message);

            this._configured = !!data.configured;
            this.repo = data.repo || '';
            this.branch = data.branch || 'main';
            return data;
        }

        async testConnection() {
            try {
                const data = await this._adminCall('admin_github_test_connection', {});
                return { success: true, message: data.message };
            } catch (error) {
                return { success: false, message: error.message };
            }
        }

        _encodePath(path) {
            return path.split('/').map(encodeURIComponent).join('/');
        }

        async getFileSha(path) {
            const data = await this._adminCall('admin_github_get_sha', { p_path: path });
            return data.sha;
        }

        async commitFile(path, content, message = 'Update file via Web Client') {
            const utf8Bytes = new TextEncoder().encode(content);
            let binaryString = '';
            utf8Bytes.forEach(byte => binaryString += String.fromCharCode(byte));
            const contentBase64 = btoa(binaryString);

            return await this._adminCall('admin_github_put_file', {
                p_path: encodeURI(path),
                p_content_base64: contentBase64,
                p_message: message
            });
        }

        async uploadFile(path, file, message = 'Upload file via Web Client') {
            let contentBase64;

            if (typeof file === 'string') {
                const utf8Bytes = new TextEncoder().encode(file);
                let binaryString = '';
                utf8Bytes.forEach(byte => binaryString += String.fromCharCode(byte));
                contentBase64 = btoa(binaryString);
            } else {
                contentBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const result = reader.result;
                        resolve(result.split(',')[1]);
                    };
                    reader.onerror = error => reject(new Error('File reading failed: ' + error));
                    reader.readAsDataURL(file);
                });
            }

            const data = await this._adminCall('admin_github_put_file', {
                p_path: encodeURI(path),
                p_content_base64: contentBase64,
                p_message: message
            });

            if (!data.content) data.content = {};
            if (!data.content.download_url) {
                const encodedPath = this._encodePath(path);
                data.content.download_url = `https://raw.githubusercontent.com/${this.repo}/${this.branch}/${encodedPath}`;
            }
            return data;
        }
    }
    // Export instance inside the block where class is defined
    window.GitHubClient = GitHubClient;
}


if (typeof ghClient === 'undefined') {
    window.ghClient = new GitHubClient();
    window.ghClient.refreshStatus().catch(() => {});
}
