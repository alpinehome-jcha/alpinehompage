/**
 * GitHub Client for saving data directly to the repository.
 * Uses the GitHub REST API to commit files.
 * Updated: Force Raw URL (2026-02-13)
 */
if (typeof GitHubClient === 'undefined') {
    class GitHubClient {
        constructor() {
            this.token = localStorage.getItem('github_token') || '';
            let repo = localStorage.getItem('github_repo') || '';

            // Auto-sanitize on load (in case it was saved incorrectly before)
            repo = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
            if (repo.endsWith('/')) repo = repo.slice(0, -1);

            this.repo = repo;
            this.branch = localStorage.getItem('github_branch') || 'main'; // Default to main
        }

        isConfigured() {
            return this.token && this.repo;
        }

        configure(token, repo, branch) {
            // Aggressive sanitization: remove ALL whitespace/newlines
            this.token = token ? token.replace(/\s+/g, '') : '';
            this.repo = repo ? repo.trim() : '';
            this.branch = branch ? branch.trim() : 'main';

            // Sanitization: Remove full URL if pasted
            this.repo = this.repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
            if (this.repo.endsWith('/')) this.repo = this.repo.slice(0, -1);

            localStorage.setItem('github_token', this.token);
            localStorage.setItem('github_repo', this.repo);
            localStorage.setItem('github_branch', this.branch);
        }

        async testConnection() {
            if (!this.isConfigured()) return { success: false, message: 'Configuration missing' };

            try {
                // 1. Check Repo
                const repoUrl = `https://api.github.com/repos/${this.repo}`;
                const repoResp = await fetch(repoUrl, {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    cache: 'no-store'
                });

                if (!repoResp.ok) {
                    if (repoResp.status === 401) return { success: false, message: 'Invalid Token (401). Check if token has expired.' };
                    if (repoResp.status === 404) return { success: false, message: `Repository '${this.repo}' Not Found (404). Check owner/repo name.` };
                    return { success: false, message: `GitHub API Error: ${repoResp.status}` };
                }

                const repoData = await repoResp.json();

                // 2. Check Branch
                const branchUrl = `https://api.github.com/repos/${this.repo}/branches/${this.branch}`;
                const branchResp = await fetch(branchUrl, {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    cache: 'no-store'
                });

                if (!branchResp.ok) {
                    return { success: false, message: `Branch '${this.branch}' not found. Please check branch name (main vs master).` };
                }

                return { success: true, message: `Connected to ${repoData.full_name} (Branch: ${this.branch})` };

            } catch (error) {
                console.error('Connection Test Error:', error);
                return { success: false, message: `Network/CORS Error: ${error.message}. Check Internet or Repo Name format.` };
            }
        }

        _encodePath(path) {
            return path.split('/').map(encodeURIComponent).join('/');
        }

        async getFileSha(path) {
            if (!this.isConfigured()) throw new Error('GitHub Settings not configured.');

            const encodedPath = this._encodePath(path);
            const url = `https://api.github.com/repos/${this.repo}/contents/${encodedPath}?ref=${this.branch}&_t=${Date.now()}`;
            let response;
            try {
                response = await fetch(url, {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        // Removed Cache-Control to reduce preflight complexity
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    cache: 'no-store'
                });
            } catch (error) {
                console.error('SHA Fetch Failed URL:', url);
                // Include Token Length in error for debugging (safe)
                const tokenLen = this.token ? this.token.length : 0;
                throw new Error(`Network Error (SHA): ${error.message}. Repo: ${this.repo}, TokenLen: ${tokenLen}`);
            }

            if (response.status === 404) return null; // File doesn't exist yet
            if (!response.ok) throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);

            const data = await response.json();
            return data.sha;
        }

        async commitFile(path, content, message) {
            if (!this.isConfigured()) throw new Error('GitHub Settings not configured.');

            // 1. Get SHA of existing file (if any)
            const sha = await this.getFileSha(path);

            // 2. Encode content to Base64 (handle UTF-8 correctly)
            // btoa fails with unicode, so we need a workaround
            const utf8Bytes = new TextEncoder().encode(content);
            let binaryString = '';
            utf8Bytes.forEach(byte => binaryString += String.fromCharCode(byte));
            const contentBase64 = btoa(binaryString);

            // 3. Create Commit Payload
            const payload = {
                message: message,
                content: contentBase64,
                branch: this.branch
            };

            if (sha) {
                payload.sha = sha;
            }

            // 4. Send Request
            const encodedPath = this._encodePath(path);
            const url = `https://api.github.com/repos/${this.repo}/contents/${encodedPath}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(`GitHub Commit Failed: ${errData.message}`);
            }

            return await response.json();
        }

        async uploadFile(path, file, message) {
            if (!this.isConfigured()) throw new Error('GitHub Settings not configured.');

            // Optimized Base64 conversion using FileReader
            const contentBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result;
                    // Remove data URL prefix (e.g., "data:image/png;base64,")
                    const base64 = result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = error => reject(new Error('File reading failed: ' + error));
                reader.readAsDataURL(file);
            });

            // 3. Get SHA if exists (to update)
            const sha = await this.getFileSha(path);

            // 4. Create Payload
            const payload = {
                message: message,
                content: contentBase64,
                branch: this.branch
            };

            if (sha) {
                payload.sha = sha;
            }

            // 5. Send Request
            const encodedPath = this._encodePath(path);
            const url = `https://api.github.com/repos/${this.repo}/contents/${encodedPath}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(payload)
            });
            console.log(`GitHub API Response for ${path}: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(`GitHub Upload Failed: ${errData.message}`);
            }

            const data = await response.json();
            // Ensure download_url exists (Manual construction if missing)
            if (!data.content) data.content = {};
            if (!data.content.download_url) {
                data.content.download_url = `https://raw.githubusercontent.com/${this.repo}/${this.branch}/${encodedPath}`;
            }
            return data;
        }
    }
}

// Export instance
window.GitHubClient = GitHubClient;
}

if (typeof ghClient === 'undefined') {
    window.ghClient = new GitHubClient();
}
