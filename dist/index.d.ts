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
interface SchedulifyXConfig {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
}
interface Tenant {
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
interface TenantAccount {
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
interface ClientToken {
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
interface Webhook {
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
interface WebhookEvent {
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
interface WebhookEventType {
    event: string;
    category: string;
    action: string;
    description: string;
}
interface Usage {
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
interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore?: boolean;
    };
}
interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
interface PostPlatform {
    platform: string;
    accountId?: string;
    status?: string;
    platformPostId?: string;
    error?: string;
    platformSettings?: Record<string, unknown>;
}
interface Post {
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
interface Account {
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
interface AccountDetail extends Account {
    platformAccountId: string;
    followingCount: number;
    mediaCount: number;
    bio: string | null;
    website: string | null;
    isVerified: boolean;
    profileUrl: string | null;
}
interface AnalyticsOverview {
    totalPosts: number;
    publishedPosts: number;
    scheduledPosts: number;
    connectedAccounts: number;
}
interface AccountAnalyticsEntry {
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
interface DetailedAnalytics {
    posts: {
        total: number;
        published: number;
        scheduled: number;
        failed: number;
    };
    accounts: {
        id: string;
        platform: string;
        name: string;
        followers: number;
        following: number;
    }[];
    engagement: {
        likes: number;
        comments: number;
        shares: number;
        views: number;
        avgEngagementRate: number;
    } | null;
}
interface MediaItem {
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
interface QueueSlot {
    dayOfWeek: number;
    time: string;
}
interface QueueSchedule {
    id: string;
    accountId: string;
    timezone: string;
    slots: QueueSlot[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    account?: {
        platform: string;
        name: string;
        username: string;
        avatarUrl: string;
    };
}
interface Profile {
    id: string;
    name: string;
    description: string | null;
    color: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt?: string;
}
interface XConfig {
    hasByokCredentials: boolean;
    accounts: {
        id: string;
        accountName: string;
        accountUsername: string;
        mode: 'byok' | 'wallet';
    }[];
    info: {
        description: string;
        modes: {
            byok: string;
            wallet: string;
        };
        setupUrl: string;
    };
}
interface Comment {
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
interface CommentReply {
    id: string;
    commentId: string;
    message: string;
    status: string;
    createdAt: string;
}
interface CommentStats {
    total: number;
    bySentiment: {
        positive: number;
        negative: number;
        neutral: number;
    };
    hidden: number;
    replied: number;
}
interface Conversation {
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
interface Message {
    id: string;
    direction: 'inbound' | 'outbound';
    message: string;
    senderName: string;
    senderUsername: string;
    platformMessageId: string;
    platformCreatedAt: string;
    createdAt: string;
}
interface InboxStats {
    conversations: {
        total: number;
        open: number;
        unread: number;
    };
    messages: {
        total: number;
        inbound: number;
        outbound: number;
        responseRate: number;
    };
}
interface Mention {
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
interface MentionStats {
    total: number;
    unread: number;
    responded: number;
    ugcSaved: number;
}
declare class SchedulifyXError extends Error {
    code: string;
    status: number;
    details?: Record<string, unknown>;
    constructor(message: string, code: string, status: number, details?: Record<string, unknown>);
}
declare class SchedulifyX {
    private apiKey;
    private baseUrl;
    private timeout;
    constructor(config: SchedulifyXConfig | string);
    private request;
    tenants: {
        /** List all tenants */
        list: (params?: {
            limit?: number;
            offset?: number;
            search?: string;
        }) => Promise<PaginatedResponse<Tenant>>;
        /** Get a single tenant */
        get: (tenantId: string) => Promise<{
            data: Tenant;
        }>;
        /** Create a new tenant (maps to a user in your app) */
        create: (data: {
            externalId: string;
            email?: string;
            name?: string;
            metadata?: Record<string, unknown>;
        }) => Promise<{
            data: Tenant;
        }>;
        /** Update a tenant */
        update: (tenantId: string, data: {
            email?: string;
            name?: string;
            metadata?: Record<string, unknown>;
            isActive?: boolean;
        }) => Promise<{
            data: Tenant;
        }>;
        /** Delete a tenant and all their data */
        delete: (tenantId: string) => Promise<{
            data: {
                deleted: boolean;
                id: string;
            };
        }>;
        /** Get OAuth URL for tenant to connect a social platform */
        getConnectUrl: (tenantId: string, platform: string, params?: {
            redirectUri?: string;
        }) => Promise<{
            data: {
                url: string;
            };
        }>;
        /** List tenant's connected social accounts */
        listAccounts: (tenantId: string) => Promise<{
            data: TenantAccount[];
        }>;
        /** Disconnect a tenant's social account */
        disconnectAccount: (tenantId: string, accountId: string) => Promise<{
            success: boolean;
        }>;
        /** Connect Bluesky account for tenant (uses app password, no OAuth) */
        connectBluesky: (tenantId: string, data: {
            identifier: string;
            appPassword: string;
        }) => Promise<{
            data: TenantAccount;
        }>;
        /** Connect Mastodon account for tenant (token-based) */
        connectMastodon: (tenantId: string, data: {
            instanceUrl: string;
            accessToken: string;
        }) => Promise<{
            data: TenantAccount;
        }>;
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
        generateClientToken: (tenantId: string, options?: {
            components?: string[];
            expiresIn?: number;
            allowedOrigins?: string[];
        }) => Promise<{
            data: ClientToken;
        }>;
    };
    webhooks: {
        /** List all webhooks */
        list: () => Promise<{
            data: Webhook[];
        }>;
        /** Get a specific webhook */
        get: (webhookId: string) => Promise<{
            data: Webhook;
        }>;
        /** Create a new webhook */
        create: (data: {
            name: string;
            url: string;
            events: string[];
            isActive?: boolean;
            retryCount?: number;
            timeoutSeconds?: number;
        }) => Promise<{
            data: Webhook;
            message: string;
        }>;
        /** Update a webhook */
        update: (webhookId: string, data: {
            name?: string;
            url?: string;
            events?: string[];
            isActive?: boolean;
            retryCount?: number;
            timeoutSeconds?: number;
        }) => Promise<{
            data: Webhook;
        }>;
        /** Delete a webhook */
        delete: (webhookId: string) => Promise<{
            data: {
                deleted: boolean;
                id: string;
            };
        }>;
        /** Rotate webhook secret */
        rotateSecret: (webhookId: string) => Promise<{
            data: {
                secret: string;
                message: string;
            };
        }>;
        /** Test a webhook by sending a test event */
        test: (webhookId: string, eventType?: string) => Promise<{
            data: {
                success: boolean;
                responseStatus: number;
                responseTimeMs: number;
                responseBody?: string;
                error?: string;
            };
        }>;
        /** Get webhook event history */
        getEvents: (webhookId: string, params?: {
            limit?: number;
            offset?: number;
        }) => Promise<{
            data: WebhookEvent[];
            pagination: {
                total: number;
                limit: number;
                offset: number;
            };
        }>;
        /** Get available event types */
        getEventTypes: () => Promise<{
            data: WebhookEventType[];
        }>;
    };
    /** Get API usage statistics */
    usage: () => Promise<{
        data: Usage;
    }>;
    posts: {
        /** List posts. Requires scope: posts:read */
        list: (params?: {
            status?: string;
            platform?: string;
            limit?: number;
            offset?: number;
            tenantUserId?: string;
        }) => Promise<PaginatedResponse<Post>>;
        /** Get a single post. Requires scope: posts:read */
        get: (postId: string) => Promise<{
            data: Post;
        }>;
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
        create: (data: {
            content?: string;
            platforms: {
                accountId: string;
                platform: string;
                platformSettings?: Record<string, unknown>;
            }[];
            scheduledFor?: string;
            mediaUrls?: string[];
            tenantUserId?: string;
            mode?: "publish" | "schedule" | "draft";
        }) => Promise<{
            data: Post;
        }>;
        /** Update a post (draft/scheduled only). Requires scope: posts:write */
        update: (postId: string, data: {
            content?: string;
            scheduledFor?: string;
            status?: "draft" | "scheduled";
        }) => Promise<{
            data: Post;
        }>;
        /** Delete a post (draft/scheduled only). Requires scope: posts:write */
        delete: (postId: string) => Promise<{
            data: {
                deleted: boolean;
                id: string;
            };
        }>;
        /** Publish a post immediately. Requires scope: posts:publish */
        publish: (postId: string) => Promise<{
            data: {
                queued: boolean;
                postId: string;
                jobId: string;
            };
        }>;
    };
    accounts: {
        /** List connected social accounts. Requires scope: accounts:read */
        list: (params?: {
            platform?: string;
            active?: boolean;
            tenantUserId?: string;
            limit?: number;
            offset?: number;
        }) => Promise<PaginatedResponse<Account>>;
        /** Get account details. Requires scope: accounts:read */
        get: (accountId: string) => Promise<{
            data: AccountDetail;
        }>;
        /** Get Pinterest boards for an account. Requires scope: accounts:read */
        getPinterestBoards: (accountId: string) => Promise<{
            data: {
                boards: {
                    id: string;
                    name: string;
                    description: string;
                    privacy: string;
                    pinCount: number;
                }[];
            };
        }>;
    };
    analytics: {
        /** Get analytics overview. Requires scope: analytics:read */
        overview: () => Promise<{
            data: AnalyticsOverview;
        }>;
        /** Get account analytics time series. Requires scope: analytics:read */
        account: (accountId: string, params?: {
            days?: number;
        }) => Promise<{
            data: AccountAnalyticsEntry[];
        }>;
        /** Get detailed analytics. Requires scope: analytics:read */
        detailed: (params?: {
            accountId?: string;
            startDate?: string;
            endDate?: string;
        }) => Promise<{
            data: DetailedAnalytics;
        }>;
    };
    media: {
        /** List media items. Requires scope: media:read */
        list: (params?: {
            type?: "image" | "video" | "audio";
            folder?: string;
            limit?: number;
            offset?: number;
        }) => Promise<PaginatedResponse<MediaItem>>;
        /** Get a single media item. Requires scope: media:read */
        get: (mediaId: string) => Promise<{
            data: MediaItem;
        }>;
        /** Upload media from URL. Requires scope: media:write */
        upload: (data: {
            url: string;
            fileName?: string;
            folder?: string;
        }) => Promise<{
            data: MediaItem;
        }>;
    };
    queue: {
        /** Get queue schedule for an account. Requires scope: queue:read */
        getSlots: (accountId: string) => Promise<{
            data: {
                exists: boolean;
                schedule: QueueSchedule | null;
                nextSlots: string[];
                account: {
                    id: string;
                    platform: string;
                    name: string;
                };
            };
        }>;
        /** Create or update queue schedule. Requires scope: queue:write */
        setSlots: (data: {
            accountId: string;
            timezone: string;
            slots: QueueSlot[];
            isActive?: boolean;
        }) => Promise<{
            data: {
                success: boolean;
                schedule: QueueSchedule;
                nextSlots: string[];
            };
        }>;
        /** Delete queue schedule. Requires scope: queue:write */
        deleteSlots: (accountId: string) => Promise<{
            data: {
                deleted: boolean;
                message: string;
            };
        }>;
        /** Preview upcoming queue slots. Requires scope: queue:read */
        preview: (accountId: string, count?: number) => Promise<{
            data: {
                accountId: string;
                timezone: string;
                count: number;
                slots: string[];
            };
        }>;
        /** Get next available queue slot. Requires scope: queue:read */
        nextSlot: (accountId: string) => Promise<{
            data: {
                accountId: string;
                nextSlot: string;
                timezone: string;
            };
        }>;
        /** Get all queue schedules. Requires scope: queue:read */
        all: () => Promise<{
            data: QueueSchedule[];
        }>;
    };
    profiles: {
        /** List all profiles. Requires scope: profiles:read */
        list: () => Promise<{
            data: Profile[];
        }>;
        /** Get a single profile. Requires scope: profiles:read */
        get: (profileId: string) => Promise<{
            data: Profile;
        }>;
        /** Create a new profile. Requires scope: profiles:write */
        create: (data: {
            name: string;
            description?: string;
            color?: string;
        }) => Promise<{
            data: Profile;
        }>;
        /** Update a profile. Requires scope: profiles:write */
        update: (profileId: string, data: {
            name?: string;
            description?: string;
            color?: string;
        }) => Promise<{
            data: Profile;
        }>;
        /** Delete a profile. Requires scope: profiles:write */
        delete: (profileId: string) => Promise<{
            data: {
                deleted: boolean;
                id: string;
            };
        }>;
    };
    x: {
        /** Get X/Twitter configuration. Requires scope: accounts:read */
        getConfig: () => Promise<{
            data: XConfig;
        }>;
        /** Set BYOK (Bring Your Own Key) credentials. Requires scope: accounts:write */
        setCredentials: (data: {
            apiKey: string;
            apiSecret: string;
            accessToken: string;
            accessTokenSecret: string;
        }) => Promise<{
            data: {
                saved: boolean;
                isVerified: boolean;
                message: string;
            };
        }>;
        /** Switch X account mode (BYOK or Wallet). Requires scope: accounts:write */
        setMode: (data: {
            accountId: string;
            mode: "byok" | "wallet";
        }) => Promise<{
            data: {
                accountId: string;
                mode: string;
                updated: boolean;
            };
        }>;
    };
    comments: {
        /** List comments. Requires scope: comments:read */
        list: (params?: {
            accountId?: string;
            postId?: string;
            platform?: string;
            status?: string;
            sentiment?: string;
            limit?: number;
            offset?: number;
            sortBy?: "newest" | "oldest" | "engagement";
        }) => Promise<PaginatedResponse<Comment>>;
        /** Get a single comment. Requires scope: comments:read */
        get: (commentId: string) => Promise<{
            data: Comment;
        }>;
        /** Get replies to a comment. Requires scope: comments:read */
        getReplies: (commentId: string) => Promise<{
            data: Comment[];
        }>;
        /** Reply to a comment. Requires scope: comments:write */
        reply: (commentId: string, message: string) => Promise<{
            data: CommentReply;
        }>;
        /** Get comment statistics. Requires scope: comments:read */
        stats: () => Promise<{
            data: CommentStats;
        }>;
    };
    inbox: {
        /** List conversations. Requires scope: inbox:read */
        list: (params?: {
            accountId?: string;
            platform?: string;
            status?: string;
            hasUnread?: boolean;
            limit?: number;
            offset?: number;
        }) => Promise<PaginatedResponse<Conversation>>;
        /** Get a single conversation. Requires scope: inbox:read */
        get: (conversationId: string) => Promise<{
            data: Conversation;
        }>;
        /** Get messages in a conversation. Requires scope: inbox:read */
        getMessages: (conversationId: string, params?: {
            limit?: number;
            offset?: number;
        }) => Promise<PaginatedResponse<Message>>;
        /** Reply to a conversation. Requires scope: inbox:write */
        reply: (conversationId: string, message: string) => Promise<{
            data: Message;
        }>;
        /** Get inbox statistics. Requires scope: inbox:read */
        stats: () => Promise<{
            data: InboxStats;
        }>;
    };
    mentions: {
        /** List mentions. Requires scope: mentions:read */
        list: (params?: {
            platform?: string;
            status?: string;
            mentionType?: string;
            limit?: number;
            offset?: number;
        }) => Promise<PaginatedResponse<Mention>>;
        /** Get mention statistics. Requires scope: mentions:read */
        stats: () => Promise<{
            data: MentionStats;
        }>;
    };
}

export { type Account, type AccountAnalyticsEntry, type AccountDetail, type AnalyticsOverview, type ApiError, type ClientToken, type Comment, type CommentReply, type CommentStats, type Conversation, type DetailedAnalytics, type InboxStats, type MediaItem, type Mention, type MentionStats, type Message, type PaginatedResponse, type Post, type PostPlatform, type Profile, type QueueSchedule, type QueueSlot, SchedulifyX, type SchedulifyXConfig, SchedulifyXError, type Tenant, type TenantAccount, type Usage, type Webhook, type WebhookEvent, type WebhookEventType, type XConfig, SchedulifyX as default };
