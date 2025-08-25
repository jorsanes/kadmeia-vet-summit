import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// GitHub configuration - stored in code for security
const GITHUB_CONFIG = {
  owner: 'kadmeia-org',
  repo: 'kadmeia-web',
  branch: 'main'
};

interface GitHubFileContent {
  content: string;
  sha: string;
}

interface GitHubOperation {
  operation: 'getFile' | 'updateFile' | 'createFile' | 'deleteFile' | 'getTree';
  path?: string;
  content?: string;
  sha?: string;
  message?: string;
  recursive?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Get the user from the JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid authentication token');
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      throw new Error('Admin access required');
    }

    const githubToken = Deno.env.get('GITHUB_TOKEN');
    if (!githubToken) {
      throw new Error('GitHub token not configured');
    }

    const operation: GitHubOperation = await req.json();

    const githubHeaders = {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };

    const baseUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`;

    let response: Response;
    let result: any;

    switch (operation.operation) {
      case 'getFile':
        if (!operation.path) throw new Error('Path is required for getFile');
        
        response = await fetch(
          `${baseUrl}/contents/${operation.path}?ref=${GITHUB_CONFIG.branch}`,
          { headers: githubHeaders }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        
        const fileData = await response.json();
        if (fileData.type !== 'file') {
          throw new Error('Path is not a file');
        }
        
        result = {
          content: atob(fileData.content.replace(/\n/g, '')),
          sha: fileData.sha
        };
        break;

      case 'updateFile':
        if (!operation.path || !operation.content || !operation.sha || !operation.message) {
          throw new Error('Path, content, sha, and message are required for updateFile');
        }
        
        response = await fetch(
          `${baseUrl}/contents/${operation.path}`,
          {
            method: 'PUT',
            headers: githubHeaders,
            body: JSON.stringify({
              message: operation.message,
              content: btoa(unescape(encodeURIComponent(operation.content))),
              sha: operation.sha,
              branch: GITHUB_CONFIG.branch
            })
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to update file: ${response.statusText}`);
        }
        
        result = await response.json();
        break;

      case 'createFile':
        if (!operation.path || !operation.content || !operation.message) {
          throw new Error('Path, content, and message are required for createFile');
        }
        
        response = await fetch(
          `${baseUrl}/contents/${operation.path}`,
          {
            method: 'PUT',
            headers: githubHeaders,
            body: JSON.stringify({
              message: operation.message,
              content: btoa(unescape(encodeURIComponent(operation.content))),
              branch: GITHUB_CONFIG.branch
            })
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to create file: ${response.statusText}`);
        }
        
        result = await response.json();
        break;

      case 'deleteFile':
        if (!operation.path || !operation.sha || !operation.message) {
          throw new Error('Path, sha, and message are required for deleteFile');
        }
        
        response = await fetch(
          `${baseUrl}/contents/${operation.path}`,
          {
            method: 'DELETE',
            headers: githubHeaders,
            body: JSON.stringify({
              message: operation.message,
              sha: operation.sha,
              branch: GITHUB_CONFIG.branch
            })
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to delete file: ${response.statusText}`);
        }
        
        result = await response.json();
        break;

      case 'getTree':
        // First get the commit SHA for the branch
        const branchResponse = await fetch(`${baseUrl}/branches/${GITHUB_CONFIG.branch}`, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!branchResponse.ok) {
          throw new Error(`Failed to get branch info: ${branchResponse.statusText}`);
        }

        const branchData = await branchResponse.json();
        const commitSha = branchData.commit.sha;

        // Get the tree
        const treeUrl = `${baseUrl}/git/trees/${commitSha}${operation.recursive ? '?recursive=1' : ''}`;
        const treeResponse = await fetch(treeUrl, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!treeResponse.ok) {
          throw new Error(`Failed to get tree: ${treeResponse.statusText}`);
        }

        const treeData = await treeResponse.json();
        
        // Filter by path if specified
        if (operation.path) {
          result = treeData.tree.filter((item: any) => 
            item.path.startsWith(operation.path)
          );
        } else {
          result = treeData.tree;
        }
        break;

      default:
        throw new Error(`Unknown operation: ${operation.operation}`);
    }

    console.log(`GitHub proxy: ${operation.operation} completed successfully for user ${user.id}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GitHub proxy error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.message.includes('authentication') || error.message.includes('Admin access') ? 401 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});