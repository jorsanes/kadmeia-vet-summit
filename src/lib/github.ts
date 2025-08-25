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
    // Use the secure GitHub proxy instead of direct API calls
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.functions.invoke('github-proxy', {
      body: {
        operation: 'getFile',
        path: path
      }
    });

    if (error) {
      throw new Error(`Failed to fetch file: ${error.message}`);
    }

    return data;
  }

  async updateFile(path: string, content: string, sha: string, message: string): Promise<void> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { error } = await supabase.functions.invoke('github-proxy', {
      body: {
        operation: 'updateFile',
        path: path,
        content: content,
        sha: sha,
        message: message
      }
    });

    if (error) {
      throw new Error(`Failed to update file: ${error.message}`);
    }
  }

  async createFile(path: string, content: string, message: string): Promise<void> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { error } = await supabase.functions.invoke('github-proxy', {
      body: {
        operation: 'createFile',
        path: path,
        content: content,
        message: message
      }
    });

    if (error) {
      throw new Error(`Failed to create file: ${error.message}`);
    }
  }

  async deleteFile(path: string, sha: string, message: string): Promise<void> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { error } = await supabase.functions.invoke('github-proxy', {
      body: {
        operation: 'deleteFile',
        path: path,
        sha: sha,
        message: message
      }
    });

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getTree(path: string = '', recursive: boolean = false): Promise<any[]> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.functions.invoke('github-proxy', {
      body: {
        operation: 'getTree',
        path: path,
        recursive: recursive
      }
    });

    if (error) {
      throw new Error(`Failed to get tree: ${error.message}`);
    }

    return data;
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