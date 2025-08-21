// GitHub API utilities for content management
import { decodeBase64Utf8, encodeBase64Utf8 } from './encoding';

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface FileContent {
  content: string;
  sha: string;
}

export class GitHubAPI {
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      'Authorization': `token ${this.config.token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };
  }

  private getBaseUrl() {
    return `https://api.github.com/repos/${this.config.owner}/${this.config.repo}`;
  }

  async getFile(path: string): Promise<FileContent> {
    const response = await fetch(
      `${this.getBaseUrl()}/contents/${path}?ref=${this.config.branch}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.type !== 'file') {
      throw new Error('Path is not a file');
    }

    return {
      content: decodeBase64Utf8(data.content),
      sha: data.sha
    };
  }

  async updateFile(path: string, content: string, sha: string, message: string): Promise<void> {
    const response = await fetch(
      `${this.getBaseUrl()}/contents/${path}`,
      {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          message,
          content: encodeBase64Utf8(content),
          sha,
          branch: this.config.branch
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update file: ${response.statusText}`);
    }
  }

  async createFile(path: string, content: string, message: string): Promise<void> {
    const response = await fetch(
      `${this.getBaseUrl()}/contents/${path}`,
      {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          message,
          content: encodeBase64Utf8(content),
          branch: this.config.branch
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create file: ${response.statusText}`);
    }
  }

  static getStoredConfig(): GitHubConfig | null {
    try {
      const stored = localStorage.getItem('kadmeia-github-config');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static storeConfig(config: GitHubConfig): void {
    localStorage.setItem('kadmeia-github-config', JSON.stringify(config));
  }

  static clearConfig(): void {
    localStorage.removeItem('kadmeia-github-config');
  }
}