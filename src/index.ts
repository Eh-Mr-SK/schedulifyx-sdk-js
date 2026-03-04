/**
 * SchedulifyX SDK v3.0 - Official JavaScript/TypeScript SDK
 * 
 * Three-Tier Architecture:
 * - Tier 1 (Embed): Tenants, webhooks, usage, client tokens
 * - Tier 2 (Publishing): Posts, accounts, analytics, media, queue, profiles, X/Twitter
 * - Tier 3 (Full Engagement): Comments, inbox, mentions
 * 
 * Available API Scopes:
 *   T1: tenants:read, tenants:write, webhooks:read, webhooks:write
 *   T2: posts:read, posts:write, posts:publish, accounts:read, analytics:read,
 *       media:read, media:write, queue:read, queue:write, profiles:read, profiles:write
 *   T3: comments:read, comments:write, inbox:read, inbox:write, mentions:read
 * 
 * @see https://app.schedulifyx.com/docs
 */

// ==================== TYPES ====================

export interface SchedulifyXConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface Tenant {
  id: string;
  externalId: string;
  email?: string;
  name?: string;
  metadata?: Record<string, unknown>;
  isActive: boolean;
  connectedAccounts?: number;
  totalPosts?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TenantAccount {
  id: string;
  platform: string;
  accountName: string;
  accountUsername: string;
  avatarUrl: string | null;
  isActive: boolean;
  followersCount: number;
  followingCount?: number;
  mediaCount?: number;
  createdAt: string;
}

export interface ClientToken {
  token: string;
  expiresAt: string;
  expiresIn: number;
  components: string[];
  origins: string[];
  usage: {
    sdk: string;
    example: string;
  };
}

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
  responseStatus?: number;
  responseTimeMs?: number;
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

export interface Usage {
  requestsToday: number;
  rateLimitPerMin: number;
  monthlyRequests: number;
  monthlyLimit: number;
  monthlyRemaining: number;
  socialSets: {
    used: number;
    limit: number | 'unlimited';
    remaining: number | 'unlimited';
  };
  lastUsedAt: string | null;
  resetsAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// --- Tier 2: Posts ---

export interface PostPlatform {
  platform: string;
  accountId?: string;
  status?: string;
  platformPostId?: string;
  error?: string;
  platformSettings?: Record<string, unknown>;
}

export interface Post {
  id: string;
  content: string;
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
  scheduledFor: string | null;
  publishedAt: string | null;
  source: string | null;
  postType: string;
  isDraft: boolean;
  isThread: boolean;
  tenantUserId: string | null;
  createdAt: string;
  updatedAt: string | null;
  platforms: PostPlatform[];
}

// --- Tier 2: Accounts ---

export interface Account {
  id: string;
  platform: string;
  accountName: string;
  accountUsername: string;
  avatarUrl: string;
  isActive: boolean;
  followersCount: number;
  tenantUserId: string | null;
  createdAt: string;
}

export interface AccountDetail extends Account {
  platformAccountId: string;
  followingCount: number;
  mediaCount: number;
  bio: string | null;
  website: string | null;
  isVerified: boolean;
  profileUrl: string | null;
}

// --- Tier 2: Analytics ---

export interface AnalyticsOverview {
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  connectedAccounts: number;
}

export interface AccountAnalyticsEntry {
  followers: number;
  following: number;
  postsCount: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  engagementRate: number;
  recordedAt: string;
}

export interface DetailedAnalytics {
  posts: { total: number; published: number; scheduled: number; failed: number };
  accounts: { id: string; platform: string; name: string; followers: number; following: number }[];
  engagement: { likes: number; comments: number; shares: number; views: number; avgEngagementRate: number } | null;
}

// --- Tier 2: Media ---

export interface MediaItem {
  id: string;
  fileName: string;
  fileType: 'image' | 'video' | 'audio';
  fileSize: number | null;
  mimeType: string;
  url: string | null;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  folder: string;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- Tier 2: Queue ---

export interface QueueSlot {
  dayOfWeek: number;
  time: string;
}

export interface QueueSchedule {
  id: string;
  accountId: string;
  timezone: string;
  slots: QueueSlot[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  account?: { platform: string; name: string; username: string; avatarUrl: string };
}

// --- Tier 2: Profiles ---

export interface Profile {
  id: string;
  name: string;
  description: string | null;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string;
}

// --- Tier 2: X/Twitter ---

export interface XConfig {
  hasByokCredentials: boolean;
  accounts: { id: string; accountName: string; accountUsername: string; mode: 'byok' | 'wallet' }[];
  info: { description: string; modes: { byok: string; wallet: string }; setupUrl: string };
}

// --- Tier 3: Comments ---

export interface Comment {
  id: string;
  platformCommentId: string;
  platform: string;
  message: string | null;
  authorName: string | null;
  authorUsername: string | null;
  authorProfilePicture: string;
  likeCount: number;
  replyCount: number;
  sentiment: 'positive' | 'negative' | 'neutral' | null;
  moderationStatus: string;
  isHidden: boolean;
  postId: string | null;
  parentCommentId?: string | null;
  platformCreatedAt: string;
  createdAt: string;
}

export interface CommentReply {
  id: string;
  commentId: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface CommentStats {
  total: number;
  bySentiment: { positive: number; negative: number; neutral: number };
  hidden: number;
  replied: number;
}

// --- Tier 3: Inbox ---

export interface Conversation {
  id: string;
  brandId: string;
  accountId: string;
  accountName?: string;
  platform: string;
  platformConversationId: string;
  participantId?: string;
  participantName?: string;
  participantUsername?: string;
  participantProfilePicture?: string;
  lastMessageContent?: string;
  lastMessageAt: string;
  unreadCount: number;
  status: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  message: string;
  senderName: string;
  senderUsername: string;
  platformMessageId: string;
  platformCreatedAt: string;
  createdAt: string;
}

export interface InboxStats {
  conversations: { total: number; open: number; unread: number };
  messages: { total: number; inbound: number; outbound: number; responseRate: number };
}

// --- Tier 3: Mentions ---

export interface Mention {
  id: string;
  platform: string;
  mentionType: string;
  authorUsername: string;
  authorName: string;
  authorProfileUrl: string;
  content: string;
  mediaUrl: string | null;
  mediaType: string | null;
  permalink: string;
  likeCount: number;
  commentCount: number;
  status: string;
  isUgcSaved: boolean;
  createdAt: string;
}

export interface MentionStats {
  total: number;
  unread: number;
  responded: number;
  ugcSaved: number;
}

// ==================== ERROR CLASS ====================

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

// ==================== MAIN SDK CLASS ====================

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

  // ==================== TIER 1: TENANTS ====================

  tenants = {
    /** List all tenants */
    list: async (params?: { limit?: number; offset?: number; search?: string }): Promise<PaginatedResponse<Tenant>> => {
      return this.request('GET', '/tenants', undefined, params);
    },

    /** Get a single tenant */
    get: async (tenantId: string): Promise<{ data: Tenant }> => {
      return this.request('GET', `/tenants/${tenantId}`);
    },

    /** Create a new tenant (maps to a user in your app) */
    create: async (data: { externalId: string; email?: string; name?: string; metadata?: Record<string, unknown> }): Promise<{ data: Tenant }> => {
      return this.request('POST', '/tenants', data);
    },

    /** Update a tenant */
    update: async (tenantId: string, data: { email?: string; name?: string; metadata?: Record<string, unknown>; isActive?: boolean }): Promise<{ data: Tenant }> => {
      return this.request('PATCH', `/tenants/${tenantId}`, data);
    },

    /** Delete a tenant and all their data */
    delete: async (tenantId: string): Promise<{ data: { deleted: boolean; id: string } }> => {
      return this.request('DELETE', `/tenants/${tenantId}`);
    },

    /** Get OAuth URL for tenant to connect a social platform */
    getConnectUrl: async (tenantId: string, platform: string, params?: { redirectUri?: string }): Promise<{ data: { url: string } }> => {
      return this.request('GET', `/tenants/${tenantId}/connect/${platform}`, undefined, params);
    },

    /** List tenant's connected social accounts */
    listAccounts: async (tenantId: string): Promise<{ data: TenantAccount[] }> => {
      return this.request('GET', `/tenants/${tenantId}/accounts`);
    },

    /** Disconnect a tenant's social account */
    disconnectAccount: async (tenantId: string, accountId: string): Promise<{ success: boolean }> => {
      return this.request('DELETE', `/tenants/${tenantId}/accounts/${accountId}`);
    },

    /** Connect Bluesky account for tenant (uses app password, no OAuth) */
    connectBluesky: async (tenantId: string, data: { identifier: string; appPassword: string }): Promise<{ data: TenantAccount }> => {
      return this.request('POST', `/tenants/${tenantId}/connect/bluesky`, data);
    },

    /** Connect Mastodon account for tenant (token-based) */
    connectMastodon: async (tenantId: string, data: { instanceUrl: string; accessToken: string }): Promise<{ data: TenantAccount }> => {
      return this.request('POST', `/tenants/${tenantId}/connect/mastodon`, data);
    },

    /**
     * Generate a client token for embedding UI components.
     * Use with @schedulifyx/embed SDK on the frontend.
     *
     * @example
     * ```typescript
     * const { data } = await client.tenants.generateClientToken('tenant-123', {
     *   components: ['post-creator', 'accounts', 'analytics'],
     *   expiresIn: 3600
     * });
     * // Send data.token to your frontend
     * ```
     */
    generateClientToken: async (tenantId: string, options?: { components?: string[]; expiresIn?: number; allowedOrigins?: string[] }): Promise<{ data: ClientToken }> => {
      return this.request('POST', `/tenants/${tenantId}/client-token`, options);
    },
  };

  // ==================== TIER 1: WEBHOOKS ====================

  webhooks = {
    /** List all webhooks */
    list: async (): Promise<{ data: Webhook[] }> => {
      return this.request('GET', '/webhooks');
    },

    /** Get a specific webhook */
    get: async (webhookId: string): Promise<{ data: Webhook }> => {
      return this.request('GET', `/webhooks/${webhookId}`);
    },

    /** Create a new webhook */
    create: async (data: { name: string; url: string; events: string[]; isActive?: boolean; retryCount?: number; timeoutSeconds?: number }): Promise<{ data: Webhook; message: string }> => {
      return this.request('POST', '/webhooks', data);
    },

    /** Update a webhook */
    update: async (webhookId: string, data: { name?: string; url?: string; events?: string[]; isActive?: boolean; retryCount?: number; timeoutSeconds?: number }): Promise<{ data: Webhook }> => {
      return this.request('PATCH', `/webhooks/${webhookId}`, data);
    },

    /** Delete a webhook */
    delete: async (webhookId: string): Promise<{ data: { deleted: boolean; id: string } }> => {
      return this.request('DELETE', `/webhooks/${webhookId}`);
    },

    /** Rotate webhook secret */
    rotateSecret: async (webhookId: string): Promise<{ data: { secret: string; message: string } }> => {
      return this.request('POST', `/webhooks/${webhookId}/rotate-secret`);
    },

    /** Test a webhook by sending a test event */
    test: async (webhookId: string, eventType?: string): Promise<{ data: { success: boolean; responseStatus: number; responseTimeMs: number; responseBody?: string; error?: string } }> => {
      return this.request('POST', `/webhooks/${webhookId}/test`, { eventType });
    },

    /** Get webhook event history */
    getEvents: async (webhookId: string, params?: { limit?: number; offset?: number }): Promise<{ data: WebhookEvent[]; pagination: { total: number; limit: number; offset: number } }> => {
      return this.request('GET', `/webhooks/${webhookId}/events`, undefined, params);
    },

    /** Get available event types */
    getEventTypes: async (): Promise<{ data: WebhookEventType[] }> => {
      return this.request('GET', '/webhooks/events/types');
    },
  };

  // ==================== TIER 1: USAGE ====================

  /** Get API usage statistics */
  usage = async (): Promise<{ data: Usage }> => {
    return this.request('GET', '/usage');
  };

  // ==================== TIER 2: POSTS ====================

  posts = {
    /** List posts. Requires scope: posts:read */
    list: async (params?: { status?: string; platform?: string; limit?: number; offset?: number; tenantUserId?: string }): Promise<PaginatedResponse<Post>> => {
      return this.request('GET', '/posts', undefined, params);
    },

    /** Get a single post. Requires scope: posts:read */
    get: async (postId: string): Promise<{ data: Post }> => {
      return this.request('GET', `/posts/${postId}`);
    },

    /**
     * Create a new post. Requires scope: posts:write
     *
     * @example
     * ```typescript
     * const { data } = await client.posts.create({
     *   content: 'Hello from the API!',
     *   platforms: [{ accountId: 'acc-123', platform: 'instagram' }],
     *   mode: 'schedule',
     *   scheduledFor: '2025-01-15T10:00:00Z'
     * });
     * ```
     */
    create: async (data: {
      content?: string;
      platforms: { accountId: string; platform: string; platformSettings?: Record<string, unknown> }[];
      scheduledFor?: string;
      mediaUrls?: string[];
      tenantUserId?: string;
      mode?: 'publish' | 'schedule' | 'draft';
    }): Promise<{ data: Post }> => {
      return this.request('POST', '/posts', data);
    },

    /** Update a post (draft/scheduled only). Requires scope: posts:write */
    update: async (postId: string, data: { content?: string; scheduledFor?: string; status?: 'draft' | 'scheduled' }): Promise<{ data: Post }> => {
      return this.request('PATCH', `/posts/${postId}`, data);
    },

    /** Delete a post (draft/scheduled only). Requires scope: posts:write */
    delete: async (postId: string): Promise<{ data: { deleted: boolean; id: string } }> => {
      return this.request('DELETE', `/posts/${postId}`);
    },

    /** Publish a post immediately. Requires scope: posts:publish */
    publish: async (postId: string): Promise<{ data: { queued: boolean; postId: string; jobId: string } }> => {
      return this.request('POST', `/posts/${postId}/publish`);
    },
  };

  // ==================== TIER 2: ACCOUNTS ====================

  accounts = {
    /** List connected social accounts. Requires scope: accounts:read */
    list: async (params?: { platform?: string; active?: boolean; tenantUserId?: string; limit?: number; offset?: number }): Promise<PaginatedResponse<Account>> => {
      return this.request('GET', '/accounts', undefined, params as Record<string, string | number | boolean | undefined>);
    },

    /** Get account details. Requires scope: accounts:read */
    get: async (accountId: string): Promise<{ data: AccountDetail }> => {
      return this.request('GET', `/accounts/${accountId}`);
    },

    /** Get Pinterest boards for an account. Requires scope: accounts:read */
    getPinterestBoards: async (accountId: string): Promise<{ data: { boards: { id: string; name: string; description: string; privacy: string; pinCount: number }[] } }> => {
      return this.request('GET', `/accounts/${accountId}/pinterest-boards`);
    },
  };

  // ==================== TIER 2: ANALYTICS ====================

  analytics = {
    /** Get analytics overview. Requires scope: analytics:read */
    overview: async (): Promise<{ data: AnalyticsOverview }> => {
      return this.request('GET', '/analytics/overview');
    },

    /** Get account analytics time series. Requires scope: analytics:read */
    account: async (accountId: string, params?: { days?: number }): Promise<{ data: AccountAnalyticsEntry[] }> => {
      return this.request('GET', `/analytics/account/${accountId}`, undefined, params);
    },

    /** Get detailed analytics. Requires scope: analytics:read */
    detailed: async (params?: { accountId?: string; startDate?: string; endDate?: string }): Promise<{ data: DetailedAnalytics }> => {
      return this.request('GET', '/analytics', undefined, params);
    },
  };

  // ==================== TIER 2: MEDIA ====================

  media = {
    /** List media items. Requires scope: media:read */
    list: async (params?: { type?: 'image' | 'video' | 'audio'; folder?: string; limit?: number; offset?: number }): Promise<PaginatedResponse<MediaItem>> => {
      return this.request('GET', '/media', undefined, params);
    },

    /** Get a single media item. Requires scope: media:read */
    get: async (mediaId: string): Promise<{ data: MediaItem }> => {
      return this.request('GET', `/media/${mediaId}`);
    },

    /** Upload media from URL. Requires scope: media:write */
    upload: async (data: { url: string; fileName?: string; folder?: string }): Promise<{ data: MediaItem }> => {
      return this.request('POST', '/media', data);
    },
  };

  // ==================== TIER 2: QUEUE ====================

  queue = {
    /** Get queue schedule for an account. Requires scope: queue:read */
    getSlots: async (accountId: string): Promise<{ data: { exists: boolean; schedule: QueueSchedule | null; nextSlots: string[]; account: { id: string; platform: string; name: string } } }> => {
      return this.request('GET', '/queue/slots', undefined, { accountId });
    },

    /** Create or update queue schedule. Requires scope: queue:write */
    setSlots: async (data: { accountId: string; timezone: string; slots: QueueSlot[]; isActive?: boolean }): Promise<{ data: { success: boolean; schedule: QueueSchedule; nextSlots: string[] } }> => {
      return this.request('PUT', '/queue/slots', data);
    },

    /** Delete queue schedule. Requires scope: queue:write */
    deleteSlots: async (accountId: string): Promise<{ data: { deleted: boolean; message: string } }> => {
      return this.request('DELETE', '/queue/slots', undefined, { accountId });
    },

    /** Preview upcoming queue slots. Requires scope: queue:read */
    preview: async (accountId: string, count?: number): Promise<{ data: { accountId: string; timezone: string; count: number; slots: string[] } }> => {
      return this.request('GET', '/queue/preview', undefined, { accountId, count });
    },

    /** Get next available queue slot. Requires scope: queue:read */
    nextSlot: async (accountId: string): Promise<{ data: { accountId: string; nextSlot: string; timezone: string } }> => {
      return this.request('GET', '/queue/next-slot', undefined, { accountId });
    },

    /** Get all queue schedules. Requires scope: queue:read */
    all: async (): Promise<{ data: QueueSchedule[] }> => {
      return this.request('GET', '/queue/all');
    },
  };

  // ==================== TIER 2: PROFILES ====================

  profiles = {
    /** List all profiles. Requires scope: profiles:read */
    list: async (): Promise<{ data: Profile[] }> => {
      return this.request('GET', '/profiles');
    },

    /** Get a single profile. Requires scope: profiles:read */
    get: async (profileId: string): Promise<{ data: Profile }> => {
      return this.request('GET', `/profiles/${profileId}`);
    },

    /** Create a new profile. Requires scope: profiles:write */
    create: async (data: { name: string; description?: string; color?: string }): Promise<{ data: Profile }> => {
      return this.request('POST', '/profiles', data);
    },

    /** Update a profile. Requires scope: profiles:write */
    update: async (profileId: string, data: { name?: string; description?: string; color?: string }): Promise<{ data: Profile }> => {
      return this.request('PUT', `/profiles/${profileId}`, data);
    },

    /** Delete a profile. Requires scope: profiles:write */
    delete: async (profileId: string): Promise<{ data: { deleted: boolean; id: string } }> => {
      return this.request('DELETE', `/profiles/${profileId}`);
    },
  };

  // ==================== TIER 2: X/TWITTER ====================

  x = {
    /** Get X/Twitter configuration. Requires scope: accounts:read */
    getConfig: async (): Promise<{ data: XConfig }> => {
      return this.request('GET', '/x/config');
    },

    /** Set BYOK (Bring Your Own Key) credentials. Requires scope: accounts:write */
    setCredentials: async (data: { apiKey: string; apiSecret: string; accessToken: string; accessTokenSecret: string }): Promise<{ data: { saved: boolean; isVerified: boolean; message: string } }> => {
      return this.request('POST', '/x/credentials', data);
    },

    /** Switch X account mode (BYOK or Wallet). Requires scope: accounts:write */
    setMode: async (data: { accountId: string; mode: 'byok' | 'wallet' }): Promise<{ data: { accountId: string; mode: string; updated: boolean } }> => {
      return this.request('POST', '/x/mode', data);
    },
  };

  // ==================== TIER 3: COMMENTS ====================

  comments = {
    /** List comments. Requires scope: comments:read */
    list: async (params?: { accountId?: string; postId?: string; platform?: string; status?: string; sentiment?: string; limit?: number; offset?: number; sortBy?: 'newest' | 'oldest' | 'engagement' }): Promise<PaginatedResponse<Comment>> => {
      return this.request('GET', '/comments', undefined, params);
    },

    /** Get a single comment. Requires scope: comments:read */
    get: async (commentId: string): Promise<{ data: Comment }> => {
      return this.request('GET', `/comments/${commentId}`);
    },

    /** Get replies to a comment. Requires scope: comments:read */
    getReplies: async (commentId: string): Promise<{ data: Comment[] }> => {
      return this.request('GET', `/comments/${commentId}/replies`);
    },

    /** Reply to a comment. Requires scope: comments:write */
    reply: async (commentId: string, message: string): Promise<{ data: CommentReply }> => {
      return this.request('POST', `/comments/${commentId}/reply`, { message });
    },

    /** Get comment statistics. Requires scope: comments:read */
    stats: async (): Promise<{ data: CommentStats }> => {
      return this.request('GET', '/comments/stats/overview');
    },
  };

  // ==================== TIER 3: INBOX ====================

  inbox = {
    /** List conversations. Requires scope: inbox:read */
    list: async (params?: { accountId?: string; platform?: string; status?: string; hasUnread?: boolean; limit?: number; offset?: number }): Promise<PaginatedResponse<Conversation>> => {
      return this.request('GET', '/inbox/conversations', undefined, params);
    },

    /** Get a single conversation. Requires scope: inbox:read */
    get: async (conversationId: string): Promise<{ data: Conversation }> => {
      return this.request('GET', `/inbox/conversations/${conversationId}`);
    },

    /** Get messages in a conversation. Requires scope: inbox:read */
    getMessages: async (conversationId: string, params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<Message>> => {
      return this.request('GET', `/inbox/conversations/${conversationId}/messages`, undefined, params);
    },

    /** Reply to a conversation. Requires scope: inbox:write */
    reply: async (conversationId: string, message: string): Promise<{ data: Message }> => {
      return this.request('POST', `/inbox/conversations/${conversationId}/reply`, { message });
    },

    /** Get inbox statistics. Requires scope: inbox:read */
    stats: async (): Promise<{ data: InboxStats }> => {
      return this.request('GET', '/inbox/stats');
    },
  };

  // ==================== TIER 3: MENTIONS ====================

  mentions = {
    /** List mentions. Requires scope: mentions:read */
    list: async (params?: { platform?: string; status?: string; mentionType?: string; limit?: number; offset?: number }): Promise<PaginatedResponse<Mention>> => {
      return this.request('GET', '/mentions', undefined, params);
    },

    /** Get mention statistics. Requires scope: mentions:read */
    stats: async (): Promise<{ data: MentionStats }> => {
      return this.request('GET', '/mentions/stats');
    },
  };
}

// Default export for convenience
export default SchedulifyX;
