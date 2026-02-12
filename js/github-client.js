/**
 * GitHub Client for saving data directly to the repository.
 * Uses the GitHub REST API to commit files.
 */
class GitHubClient {
    constructor() {
        this.token = localStorage.getItem('github_token') || '';
        this.repo = localStorage.getItem('github_repo') || ''; // e.g. "username/repo"
        this.branch = 'main'; // Default branch
    }

    isConfigured() {
        return this.token && this.repo;
    }

    configure(token, repo) {
        this.token = token;
        this.repo = repo;
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_repo', repo);
    }

    async testConnection() {
        if (!this.isConfigured()) return { success: false, message: 'Configuration missing' };

        try {
            const url = `https://api.github.com/repos/${this.repo}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                cache: 'no-store'
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, message: `Connected to ${data.full_name} as ${data.permissions ? 'Authorized' : 'Viewer'}` };
            } else {
                if (response.status === 401) return { success: false, message: 'Invalid Token (401)' };
                if (response.status === 404) return { success: false, message: 'Repository Not Found (404)' };
                return { success: false, message: `GitHub API Error: ${response.status}` };
            }
        } catch (error) {
            return { success: false, message: `Network Error: ${error.message}. Check CORS/Internet.` };
        }
    }

    async getFileSha(path) {
        if (!this.isConfigured()) throw new Error('GitHub Settings not configured.');

        const url = `https://api.github.com/repos/${this.repo}/contents/${path}?ref=${this.branch}&_t=${Date.now()}`;
        let response;
        try {
            response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Cache-Control': 'no-cache'
                },
                cache: 'no-store'
            });
        } catch (error) {
            throw new Error(`Network/CORS Error: ${error.message}`);
        }

        if (response.status === 404) return null; // File doesn't exist yet
        if (!response.ok) throw new Error(`GitHub API Error: ${response.statusText}`);

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
        const url = `https://api.github.com/repos/${this.repo}/contents/${path}`;
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

        // 1. Read File as ArrayBuffer
        const buffer = await file.arrayBuffer();

        // 2. Convert to Base64
        // efficient way for large files
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const contentBase64 = btoa(binary);

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
        const url = `https://api.github.com/repos/${this.repo}/contents/${path}`;
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
            throw new Error(`GitHub Upload Failed: ${errData.message}`);
        }

        return await response.json();
    }
}

// Export instance
const ghClient = new GitHubClient();
