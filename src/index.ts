/**
 * SchedulifyX SDK - Official JavaScript/TypeScript SDK
 * https://app.schedulifyx.com/docs/
 */

// Types
export interface SchedulifyXConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface Post {
  id: string;
  content: string;
  mediaUrls?: string[];
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
  publishAt?: string;
  publishNow?: boolean;
  accountIds: string[];
  platformOverrides?: Record<string, { content?: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  platform: string;
  platformAccountId: string;
  name: string;
  username?: string;
  profilePicture?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Analytics {
  accountId: string;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  updatedAt: string;
}

export interface AnalyticsOverview {
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  failedPosts: number;
  totalAccounts: number;
  activeAccounts: number;
}

export interface Usage {
  requestsToday: number;
  dailyLimit: number;
  remainingToday: number;
  monthlyRequests: number;
  lastUsedAt: string | null;
}

export interface Tenant {
  id: string;
  externalId: string;
  email?: string;
  name?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface QueueSlot {
  dayOfWeek: number; // 0-6, Sunday = 0
  time: string; // HH:MM format
}

export interface QueueSchedule {
  id: string;
  accountId: string;
  timezone: string;
  slots: QueueSlot[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Webhook Types
export interface Webhook {
  id: string;
  name: string;
  url: string;
  secret?: string;
  events: string[];
  isActive: boolean;
  retryCount: number;
  timeoutSeconds: number;
  lastTriggeredAt?: string;
  lastSuccessAt?: string;
  lastFailureAt?: string;
  stats: {
    totalTriggers: number;
    totalSuccesses: number;
    totalFailures: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEvent {
  id: string;
  webhookId: string;
  eventType: string;
  status: 'pending' | 'delivered' | 'failed';
  httpStatus?: number;
  responseBody?: string;
  errorMessage?: string;
  attempts: number;
  deliveredAt?: string;
  createdAt: string;
}

export interface WebhookEventType {
  event: string;
  category: string;
  action: string;
  description: string;
}

export interface MediaUploadResponse {
  uploadUrl: string;
  mediaUrl: string;
  expiresIn: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Error class
export class SchedulifyXError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(message: string, code: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'SchedulifyXError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Main SDK Class
export class SchedulifyX {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: SchedulifyXConfig | string) {
    if (typeof config === 'string') {
      this.apiKey = config;
      this.baseUrl = 'https://api.schedulifyx.com';
      this.timeout = 30000;
    } else {
      this.apiKey = config.apiKey;
      this.baseUrl = config.baseUrl || 'https://api.schedulifyx.com';
      this.timeout = config.timeout || 30000;
    }
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    queryParams?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: ApiError };
        throw new SchedulifyXError(
          errorData.error?.message || `HTTP ${response.status}`,
          errorData.error?.code || 'http_error',
          response.status,
          errorData.error?.details
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof SchedulifyXError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new SchedulifyXError('Request timeout', 'timeout', 408);
      }
      throw new SchedulifyXError(
        error instanceof Error ? error.message : 'Network error',
        'network_error',
        0
      );
    }
  }

  // ==================== POSTS ====================

  posts = {
    /**
     * List all posts with optional filters
     */
    list: async (params?: {
      status?: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
      accountId?: string;
      limit?: number;
      offset?: number;
    }): Promise<PaginatedResponse<Post>> => {
      return this.request('GET', '/posts', undefined, params);
    },

    /**
     * Get a single post by ID
     */
    get: async (postId: string): Promise<{ data: Post }> => {
      return this.request('GET', `/posts/${postId}`);
    },

    /**
     * Create a new post
     */
    create: async (data: {
      content: string;
      accountIds: string[];
      publishAt?: string;
      publishNow?: boolean;
      mediaUrls?: string[];
      platformOverrides?: Record<string, { content?: string }>;
    }): Promise<{ data: Post }> => {
      return this.request('POST', '/posts', data);
    },

    /**
     * Update an existing post
     */
    update: async (postId: string, data: {
      content?: string;
      publishAt?: string;
      mediaUrls?: string[];
    }): Promise<{ data: Post }> => {
      return this.request('PATCH', `/posts/${postId}`, data);
    },

    /**
     * Delete a post
     */
    delete: async (postId: string): Promise<{ success: boolean }> => {
      return this.request('DELETE', `/posts/${postId}`);
    },

    /**
     * Publish a post immediately
     */
    publish: async (postId: string): Promise<{ data: Post }> => {
      return this.request('POST', `/posts/${postId}/publish`);
    },
  };

  // ==================== ACCOUNTS ====================

  accounts = {
    /**
     * List all connected social accounts
     */
    list: async (params?: {
      platform?: string;
      limit?: number;
      offset?: number;
    }): Promise<PaginatedResponse<Account>> => {
      return this.request('GET', '/accounts', undefined, params);
    },

    /**
     * Get a single account by ID
     */
    get: async (accountId: string): Promise<{ data: Account }> => {
      return this.request('GET', `/accounts/${accountId}`);
    },

    /**
     * Get Pinterest boards for a Pinterest account
     */
    getPinterestBoards: async (accountId: string): Promise<{ data: { id: string; name: string }[] }> => {
      return this.request('GET', `/accounts/${accountId}/pinterest-boards`);
    },
  };

  // ==================== ANALYTICS ====================

  analytics = {
    /**
     * Get analytics overview
     */
    overview: async (): Promise<{ data: AnalyticsOverview }> => {
      return this.request('GET', '/analytics/overview');
    },

    /**
     * Get analytics for a specific account
     */
    forAccount: async (accountId: string, params?: {
      days?: number;
    }): Promise<{ data: Analytics[] }> => {
      return this.request('GET', `/analytics/account/${accountId}`, undefined, params);
    },

    /**
     * Get all analytics data
     */
    list: async (params?: {
      accountId?: string;
      startDate?: string;
      endDate?: string;
    }): Promise<{ data: Analytics[] }> => {
      return this.request('GET', '/analytics', undefined, params);
    },
  };

  // ==================== MEDIA ====================

  media = {
    /**
     * Get a presigned URL for uploading media
     */
    getUploadUrl: async (data: {
      filename: string;
      contentType: string;
    }): Promise<{ data: MediaUploadResponse }> => {
      return this.request('POST', '/media/upload-url', data);
    },

    /**
     * Helper to upload a file and return the media URL
     */
    upload: async (file: Blob, filename: string, contentType: string): Promise<string> => {
      const { data } = await this.media.getUploadUrl({ filename, contentType });
      
      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file as BodyInit,
      });

      return data.mediaUrl;
    },
  };

  // ==================== USAGE ====================

  /**
   * Get API usage statistics
   */
  usage = async (): Promise<{ data: Usage }> => {
    return this.request('GET', '/usage');
  };

  // ==================== QUEUE ====================

  queue = {
    /**
     * Get queue schedule for an account
     */
    getSlots: async (accountId: string): Promise<{ data: { exists: boolean; schedule?: QueueSchedule; nextSlots?: string[] } }> => {
      return this.request('GET', '/queue/slots', undefined, { accountId });
    },

    /**
     * Create or update queue schedule
     */
    setSlots: async (data: {
      accountId: string;
      timezone: string;
      slots: QueueSlot[];
      isActive?: boolean;
    }): Promise<{ data: { success: boolean; schedule: QueueSchedule; nextSlots: string[] } }> => {
      return this.request('PUT', '/queue/slots', data);
    },

    /**
     * Delete queue schedule
     */
    deleteSlots: async (accountId: string): Promise<{ data: { deleted: boolean; message: string } }> => {
      return this.request('DELETE', '/queue/slots', undefined, { accountId });
    },

    /**
     * Get the next available slot
     */
    getNextSlot: async (accountId: string): Promise<{ data: { accountId: string; nextSlot: string; timezone: string } }> => {
      return this.request('GET', '/queue/next-slot', undefined, { accountId });
    },

    /**
     * Preview upcoming slots
     */
    preview: async (accountId: string, count?: number): Promise<{ data: { accountId: string; timezone: string; count: number; slots: string[] } }> => {
      return this.request('GET', '/queue/preview', undefined, { accountId, count });
    },

    /**
     * Get all queue schedules
     */
    getAll: async (): Promise<{ data: QueueSchedule[] }> => {
      return this.request('GET', '/queue/all');
    },
  };

  // ==================== WEBHOOKS ====================

  webhooks = {
    /**
     * List all webhooks
     */
    list: async (): Promise<{ data: Webhook[] }> => {
      return this.request('GET', '/webhooks');
    },

    /**
     * Get a specific webhook
     */
    get: async (webhookId: string): Promise<{ data: Webhook }> => {
      return this.request('GET', `/webhooks/${webhookId}`);
    },

    /**
     * Create a new webhook
     */
    create: async (data: {
      name: string;
      url: string;
      events: string[];
      isActive?: boolean;
      retryCount?: number;
      timeoutSeconds?: number;
    }): Promise<{ data: Webhook; message: string }> => {
      return this.request('POST', '/webhooks', data);
    },

    /**
     * Update a webhook
     */
    update: async (webhookId: string, data: {
      name?: string;
      url?: string;
      events?: string[];
      isActive?: boolean;
      retryCount?: number;
      timeoutSeconds?: number;
    }): Promise<{ data: Webhook }> => {
      return this.request('PATCH', `/webhooks/${webhookId}`, data);
    },

    /**
     * Delete a webhook
     */
    delete: async (webhookId: string): Promise<{ data: { deleted: boolean; id: string } }> => {
      return this.request('DELETE', `/webhooks/${webhookId}`);
    },

    /**
     * Rotate webhook secret
     */
    rotateSecret: async (webhookId: string): Promise<{ data: { secret: string; message: string } }> => {
      return this.request('POST', `/webhooks/${webhookId}/rotate-secret`);
    },

    /**
     * Test a webhook by sending a test event
     */
    test: async (webhookId: string, eventType?: string): Promise<{ data: { success: boolean; eventId: string } }> => {
      return this.request('POST', `/webhooks/${webhookId}/test`, { eventType });
    },

    /**
     * Get webhook event history
     */
    getEvents: async (webhookId: string, params?: {
      limit?: number;
      offset?: number;
    }): Promise<{ data: WebhookEvent[]; pagination: { total: number; limit: number; offset: number } }> => {
      return this.request('GET', `/webhooks/${webhookId}/events`, undefined, params);
    },

    /**
     * Get available event types
     */
    getEventTypes: async (): Promise<{ data: WebhookEventType[] }> => {
      return this.request('GET', '/webhooks/events/types');
    },
  };

  // ==================== TENANTS (Multi-tenant) ====================

  tenants = {
    /**
     * List all tenants
     */
    list: async (params?: {
      limit?: number;
      offset?: number;
      search?: string;
    }): Promise<PaginatedResponse<Tenant>> => {
      return this.request('GET', '/tenants', undefined, params);
    },

    /**
     * Get a single tenant
     */
    get: async (tenantId: string): Promise<{ data: Tenant }> => {
      return this.request('GET', `/tenants/${tenantId}`);
    },

    /**
     * Create a new tenant
     */
    create: async (data: {
      externalId: string;
      email?: string;
      name?: string;
      metadata?: Record<string, unknown>;
    }): Promise<{ data: Tenant }> => {
      return this.request('POST', '/tenants', data);
    },

    /**
     * Update a tenant
     */
    update: async (tenantId: string, data: {
      email?: string;
      name?: string;
      metadata?: Record<string, unknown>;
    }): Promise<{ data: Tenant }> => {
      return this.request('PATCH', `/tenants/${tenantId}`, data);
    },

    /**
     * Delete a tenant
     */
    delete: async (tenantId: string): Promise<{ success: boolean }> => {
      return this.request('DELETE', `/tenants/${tenantId}`);
    },

    /**
     * Get OAuth URL for tenant to connect a platform
     */
    getConnectUrl: async (tenantId: string, platform: string): Promise<{ data: { url: string } }> => {
      return this.request('GET', `/tenants/${tenantId}/connect/${platform}`);
    },

    /**
     * List tenant's connected accounts
     */
    listAccounts: async (tenantId: string): Promise<{ data: Account[] }> => {
      return this.request('GET', `/tenants/${tenantId}/accounts`);
    },

    /**
     * Disconnect a tenant's account
     */
    disconnectAccount: async (tenantId: string, accountId: string): Promise<{ success: boolean }> => {
      return this.request('DELETE', `/tenants/${tenantId}/accounts/${accountId}`);
    },

    /**
     * Connect Bluesky account for tenant
     */
    connectBluesky: async (tenantId: string, data: {
      identifier: string;
      appPassword: string;
    }): Promise<{ data: Account }> => {
      return this.request('POST', `/tenants/${tenantId}/connect/bluesky`, data);
    },

    /**
     * Connect Mastodon account for tenant
     */
    connectMastodon: async (tenantId: string, data: {
      instance: string;
      accessToken: string;
    }): Promise<{ data: Account }> => {
      return this.request('POST', `/tenants/${tenantId}/connect/mastodon`, data);
    },
  };
}

// Default export for convenience
export default SchedulifyX;
