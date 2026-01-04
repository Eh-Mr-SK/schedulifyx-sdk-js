/**
 * SchedulifyX SDK - Official JavaScript/TypeScript SDK
 * https://app.schedulifyx.com/docs/
 */
interface SchedulifyXConfig {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
}
interface Post {
    id: string;
    content: string;
    mediaUrls?: string[];
    status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
    publishAt?: string;
    publishNow?: boolean;
    accountIds: string[];
    platformOverrides?: Record<string, {
        content?: string;
    }>;
    createdAt: string;
    updatedAt: string;
}
interface Account {
    id: string;
    platform: string;
    platformAccountId: string;
    name: string;
    username?: string;
    profilePicture?: string;
    isActive: boolean;
    createdAt: string;
}
interface Analytics {
    accountId: string;
    followers: number;
    following: number;
    posts: number;
    engagement: number;
    updatedAt: string;
}
interface AnalyticsOverview {
    totalPosts: number;
    scheduledPosts: number;
    publishedPosts: number;
    failedPosts: number;
    totalAccounts: number;
    activeAccounts: number;
}
interface Usage {
    requestsToday: number;
    dailyLimit: number;
    remainingToday: number;
    monthlyRequests: number;
    lastUsedAt: string | null;
}
interface Tenant {
    id: string;
    externalId: string;
    email?: string;
    name?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
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
    httpStatus?: number;
    responseBody?: string;
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
interface MediaUploadResponse {
    uploadUrl: string;
    mediaUrl: string;
    expiresIn: number;
}
interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}
interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
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
    posts: {
        /**
         * List all posts with optional filters
         */
        list: (params?: {
            status?: "draft" | "scheduled" | "publishing" | "published" | "failed";
            accountId?: string;
            limit?: number;
            offset?: number;
        }) => Promise<PaginatedResponse<Post>>;
        /**
         * Get a single post by ID
         */
        get: (postId: string) => Promise<{
            data: Post;
        }>;
        /**
         * Create a new post
         */
        create: (data: {
            content: string;
            accountIds: string[];
            publishAt?: string;
            publishNow?: boolean;
            mediaUrls?: string[];
            platformOverrides?: Record<string, {
                content?: string;
            }>;
        }) => Promise<{
            data: Post;
        }>;
        /**
         * Update an existing post
         */
        update: (postId: string, data: {
            content?: string;
            publishAt?: string;
            mediaUrls?: string[];
        }) => Promise<{
            data: Post;
        }>;
        /**
         * Delete a post
         */
        delete: (postId: string) => Promise<{
            success: boolean;
        }>;
        /**
         * Publish a post immediately
         */
        publish: (postId: string) => Promise<{
            data: Post;
        }>;
    };
    accounts: {
        /**
         * List all connected social accounts
         */
        list: (params?: {
            platform?: string;
            limit?: number;
            offset?: number;
        }) => Promise<PaginatedResponse<Account>>;
        /**
         * Get a single account by ID
         */
        get: (accountId: string) => Promise<{
            data: Account;
        }>;
        /**
         * Get Pinterest boards for a Pinterest account
         */
        getPinterestBoards: (accountId: string) => Promise<{
            data: {
                id: string;
                name: string;
            }[];
        }>;
    };
    analytics: {
        /**
         * Get analytics overview
         */
        overview: () => Promise<{
            data: AnalyticsOverview;
        }>;
        /**
         * Get analytics for a specific account
         */
        forAccount: (accountId: string, params?: {
            days?: number;
        }) => Promise<{
            data: Analytics[];
        }>;
        /**
         * Get all analytics data
         */
        list: (params?: {
            accountId?: string;
            startDate?: string;
            endDate?: string;
        }) => Promise<{
            data: Analytics[];
        }>;
    };
    media: {
        /**
         * Get a presigned URL for uploading media
         */
        getUploadUrl: (data: {
            filename: string;
            contentType: string;
        }) => Promise<{
            data: MediaUploadResponse;
        }>;
        /**
         * Helper to upload a file and return the media URL
         */
        upload: (file: Blob, filename: string, contentType: string) => Promise<string>;
    };
    /**
     * Get API usage statistics
     */
    usage: () => Promise<{
        data: Usage;
    }>;
    queue: {
        /**
         * Get queue schedule for an account
         */
        getSlots: (accountId: string) => Promise<{
            data: {
                exists: boolean;
                schedule?: QueueSchedule;
                nextSlots?: string[];
            };
        }>;
        /**
         * Create or update queue schedule
         */
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
        /**
         * Delete queue schedule
         */
        deleteSlots: (accountId: string) => Promise<{
            data: {
                deleted: boolean;
                message: string;
            };
        }>;
        /**
         * Get the next available slot
         */
        getNextSlot: (accountId: string) => Promise<{
            data: {
                accountId: string;
                nextSlot: string;
                timezone: string;
            };
        }>;
        /**
         * Preview upcoming slots
         */
        preview: (accountId: string, count?: number) => Promise<{
            data: {
                accountId: string;
                timezone: string;
                count: number;
                slots: string[];
            };
        }>;
        /**
         * Get all queue schedules
         */
        getAll: () => Promise<{
            data: QueueSchedule[];
        }>;
    };
    webhooks: {
        /**
         * List all webhooks
         */
        list: () => Promise<{
            data: Webhook[];
        }>;
        /**
         * Get a specific webhook
         */
        get: (webhookId: string) => Promise<{
            data: Webhook;
        }>;
        /**
         * Create a new webhook
         */
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
        /**
         * Update a webhook
         */
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
        /**
         * Delete a webhook
         */
        delete: (webhookId: string) => Promise<{
            data: {
                deleted: boolean;
                id: string;
            };
        }>;
        /**
         * Rotate webhook secret
         */
        rotateSecret: (webhookId: string) => Promise<{
            data: {
                secret: string;
                message: string;
            };
        }>;
        /**
         * Test a webhook by sending a test event
         */
        test: (webhookId: string, eventType?: string) => Promise<{
            data: {
                success: boolean;
                eventId: string;
            };
        }>;
        /**
         * Get webhook event history
         */
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
        /**
         * Get available event types
         */
        getEventTypes: () => Promise<{
            data: WebhookEventType[];
        }>;
    };
    tenants: {
        /**
         * List all tenants
         */
        list: (params?: {
            limit?: number;
            offset?: number;
            search?: string;
        }) => Promise<PaginatedResponse<Tenant>>;
        /**
         * Get a single tenant
         */
        get: (tenantId: string) => Promise<{
            data: Tenant;
        }>;
        /**
         * Create a new tenant
         */
        create: (data: {
            externalId: string;
            email?: string;
            name?: string;
            metadata?: Record<string, unknown>;
        }) => Promise<{
            data: Tenant;
        }>;
        /**
         * Update a tenant
         */
        update: (tenantId: string, data: {
            email?: string;
            name?: string;
            metadata?: Record<string, unknown>;
        }) => Promise<{
            data: Tenant;
        }>;
        /**
         * Delete a tenant
         */
        delete: (tenantId: string) => Promise<{
            success: boolean;
        }>;
        /**
         * Get OAuth URL for tenant to connect a platform
         */
        getConnectUrl: (tenantId: string, platform: string) => Promise<{
            data: {
                url: string;
            };
        }>;
        /**
         * List tenant's connected accounts
         */
        listAccounts: (tenantId: string) => Promise<{
            data: Account[];
        }>;
        /**
         * Disconnect a tenant's account
         */
        disconnectAccount: (tenantId: string, accountId: string) => Promise<{
            success: boolean;
        }>;
        /**
         * Connect Bluesky account for tenant
         */
        connectBluesky: (tenantId: string, data: {
            identifier: string;
            appPassword: string;
        }) => Promise<{
            data: Account;
        }>;
        /**
         * Connect Mastodon account for tenant
         */
        connectMastodon: (tenantId: string, data: {
            instance: string;
            accessToken: string;
        }) => Promise<{
            data: Account;
        }>;
    };
}

export { type Account, type Analytics, type AnalyticsOverview, type ApiError, type MediaUploadResponse, type PaginatedResponse, type Post, type QueueSchedule, type QueueSlot, SchedulifyX, type SchedulifyXConfig, SchedulifyXError, type Tenant, type Usage, type Webhook, type WebhookEvent, type WebhookEventType, SchedulifyX as default };
