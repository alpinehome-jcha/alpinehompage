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

    async getFileSha(path) {
        if (!this.isConfigured()) throw new Error('GitHub Settings not configured.');

        const url = `https://api.github.com/repos/${this.repo}/contents/${path}?ref=${this.branch}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

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
}

// Export instance
const ghClient = new GitHubClient();
