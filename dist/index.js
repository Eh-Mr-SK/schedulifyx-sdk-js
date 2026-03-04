"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  SchedulifyX: () => SchedulifyX,
  SchedulifyXError: () => SchedulifyXError,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var SchedulifyXError = class extends Error {
  constructor(message, code, status, details) {
    super(message);
    this.name = "SchedulifyXError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
};
var SchedulifyX = class {
  constructor(config) {
    // ==================== TIER 1: TENANTS ====================
    this.tenants = {
      /** List all tenants */
      list: async (params) => {
        return this.request("GET", "/tenants", void 0, params);
      },
      /** Get a single tenant */
      get: async (tenantId) => {
        return this.request("GET", `/tenants/${tenantId}`);
      },
      /** Create a new tenant (maps to a user in your app) */
      create: async (data) => {
        return this.request("POST", "/tenants", data);
      },
      /** Update a tenant */
      update: async (tenantId, data) => {
        return this.request("PATCH", `/tenants/${tenantId}`, data);
      },
      /** Delete a tenant and all their data */
      delete: async (tenantId) => {
        return this.request("DELETE", `/tenants/${tenantId}`);
      },
      /** Get OAuth URL for tenant to connect a social platform */
      getConnectUrl: async (tenantId, platform, params) => {
        return this.request("GET", `/tenants/${tenantId}/connect/${platform}`, void 0, params);
      },
      /** List tenant's connected social accounts */
      listAccounts: async (tenantId) => {
        return this.request("GET", `/tenants/${tenantId}/accounts`);
      },
      /** Disconnect a tenant's social account */
      disconnectAccount: async (tenantId, accountId) => {
        return this.request("DELETE", `/tenants/${tenantId}/accounts/${accountId}`);
      },
      /** Connect Bluesky account for tenant (uses app password, no OAuth) */
      connectBluesky: async (tenantId, data) => {
        return this.request("POST", `/tenants/${tenantId}/connect/bluesky`, data);
      },
      /** Connect Mastodon account for tenant (token-based) */
      connectMastodon: async (tenantId, data) => {
        return this.request("POST", `/tenants/${tenantId}/connect/mastodon`, data);
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
      generateClientToken: async (tenantId, options) => {
        return this.request("POST", `/tenants/${tenantId}/client-token`, options);
      }
    };
    // ==================== TIER 1: WEBHOOKS ====================
    this.webhooks = {
      /** List all webhooks */
      list: async () => {
        return this.request("GET", "/webhooks");
      },
      /** Get a specific webhook */
      get: async (webhookId) => {
        return this.request("GET", `/webhooks/${webhookId}`);
      },
      /** Create a new webhook */
      create: async (data) => {
        return this.request("POST", "/webhooks", data);
      },
      /** Update a webhook */
      update: async (webhookId, data) => {
        return this.request("PATCH", `/webhooks/${webhookId}`, data);
      },
      /** Delete a webhook */
      delete: async (webhookId) => {
        return this.request("DELETE", `/webhooks/${webhookId}`);
      },
      /** Rotate webhook secret */
      rotateSecret: async (webhookId) => {
        return this.request("POST", `/webhooks/${webhookId}/rotate-secret`);
      },
      /** Test a webhook by sending a test event */
      test: async (webhookId, eventType) => {
        return this.request("POST", `/webhooks/${webhookId}/test`, { eventType });
      },
      /** Get webhook event history */
      getEvents: async (webhookId, params) => {
        return this.request("GET", `/webhooks/${webhookId}/events`, void 0, params);
      },
      /** Get available event types */
      getEventTypes: async () => {
        return this.request("GET", "/webhooks/events/types");
      }
    };
    // ==================== TIER 1: USAGE ====================
    /** Get API usage statistics */
    this.usage = async () => {
      return this.request("GET", "/usage");
    };
    // ==================== TIER 2: POSTS ====================
    this.posts = {
      /** List posts. Requires scope: posts:read */
      list: async (params) => {
        return this.request("GET", "/posts", void 0, params);
      },
      /** Get a single post. Requires scope: posts:read */
      get: async (postId) => {
        return this.request("GET", `/posts/${postId}`);
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
      create: async (data) => {
        return this.request("POST", "/posts", data);
      },
      /** Update a post (draft/scheduled only). Requires scope: posts:write */
      update: async (postId, data) => {
        return this.request("PATCH", `/posts/${postId}`, data);
      },
      /** Delete a post (draft/scheduled only). Requires scope: posts:write */
      delete: async (postId) => {
        return this.request("DELETE", `/posts/${postId}`);
      },
      /** Publish a post immediately. Requires scope: posts:publish */
      publish: async (postId) => {
        return this.request("POST", `/posts/${postId}/publish`);
      }
    };
    // ==================== TIER 2: ACCOUNTS ====================
    this.accounts = {
      /** List connected social accounts. Requires scope: accounts:read */
      list: async (params) => {
        return this.request("GET", "/accounts", void 0, params);
      },
      /** Get account details. Requires scope: accounts:read */
      get: async (accountId) => {
        return this.request("GET", `/accounts/${accountId}`);
      },
      /** Get Pinterest boards for an account. Requires scope: accounts:read */
      getPinterestBoards: async (accountId) => {
        return this.request("GET", `/accounts/${accountId}/pinterest-boards`);
      }
    };
    // ==================== TIER 2: ANALYTICS ====================
    this.analytics = {
      /** Get analytics overview. Requires scope: analytics:read */
      overview: async () => {
        return this.request("GET", "/analytics/overview");
      },
      /** Get account analytics time series. Requires scope: analytics:read */
      account: async (accountId, params) => {
        return this.request("GET", `/analytics/account/${accountId}`, void 0, params);
      },
      /** Get detailed analytics. Requires scope: analytics:read */
      detailed: async (params) => {
        return this.request("GET", "/analytics", void 0, params);
      }
    };
    // ==================== TIER 2: MEDIA ====================
    this.media = {
      /** List media items. Requires scope: media:read */
      list: async (params) => {
        return this.request("GET", "/media", void 0, params);
      },
      /** Get a single media item. Requires scope: media:read */
      get: async (mediaId) => {
        return this.request("GET", `/media/${mediaId}`);
      },
      /** Upload media from URL. Requires scope: media:write */
      upload: async (data) => {
        return this.request("POST", "/media", data);
      }
    };
    // ==================== TIER 2: QUEUE ====================
    this.queue = {
      /** Get queue schedule for an account. Requires scope: queue:read */
      getSlots: async (accountId) => {
        return this.request("GET", "/queue/slots", void 0, { accountId });
      },
      /** Create or update queue schedule. Requires scope: queue:write */
      setSlots: async (data) => {
        return this.request("PUT", "/queue/slots", data);
      },
      /** Delete queue schedule. Requires scope: queue:write */
      deleteSlots: async (accountId) => {
        return this.request("DELETE", "/queue/slots", void 0, { accountId });
      },
      /** Preview upcoming queue slots. Requires scope: queue:read */
      preview: async (accountId, count) => {
        return this.request("GET", "/queue/preview", void 0, { accountId, count });
      },
      /** Get next available queue slot. Requires scope: queue:read */
      nextSlot: async (accountId) => {
        return this.request("GET", "/queue/next-slot", void 0, { accountId });
      },
      /** Get all queue schedules. Requires scope: queue:read */
      all: async () => {
        return this.request("GET", "/queue/all");
      }
    };
    // ==================== TIER 2: PROFILES ====================
    this.profiles = {
      /** List all profiles. Requires scope: profiles:read */
      list: async () => {
        return this.request("GET", "/profiles");
      },
      /** Get a single profile. Requires scope: profiles:read */
      get: async (profileId) => {
        return this.request("GET", `/profiles/${profileId}`);
      },
      /** Create a new profile. Requires scope: profiles:write */
      create: async (data) => {
        return this.request("POST", "/profiles", data);
      },
      /** Update a profile. Requires scope: profiles:write */
      update: async (profileId, data) => {
        return this.request("PUT", `/profiles/${profileId}`, data);
      },
      /** Delete a profile. Requires scope: profiles:write */
      delete: async (profileId) => {
        return this.request("DELETE", `/profiles/${profileId}`);
      }
    };
    // ==================== TIER 2: X/TWITTER ====================
    this.x = {
      /** Get X/Twitter configuration. Requires scope: accounts:read */
      getConfig: async () => {
        return this.request("GET", "/x/config");
      },
      /** Set BYOK (Bring Your Own Key) credentials. Requires scope: accounts:write */
      setCredentials: async (data) => {
        return this.request("POST", "/x/credentials", data);
      },
      /** Switch X account mode (BYOK or Wallet). Requires scope: accounts:write */
      setMode: async (data) => {
        return this.request("POST", "/x/mode", data);
      }
    };
    // ==================== TIER 3: COMMENTS ====================
    this.comments = {
      /** List comments. Requires scope: comments:read */
      list: async (params) => {
        return this.request("GET", "/comments", void 0, params);
      },
      /** Get a single comment. Requires scope: comments:read */
      get: async (commentId) => {
        return this.request("GET", `/comments/${commentId}`);
      },
      /** Get replies to a comment. Requires scope: comments:read */
      getReplies: async (commentId) => {
        return this.request("GET", `/comments/${commentId}/replies`);
      },
      /** Reply to a comment. Requires scope: comments:write */
      reply: async (commentId, message) => {
        return this.request("POST", `/comments/${commentId}/reply`, { message });
      },
      /** Get comment statistics. Requires scope: comments:read */
      stats: async () => {
        return this.request("GET", "/comments/stats/overview");
      }
    };
    // ==================== TIER 3: INBOX ====================
    this.inbox = {
      /** List conversations. Requires scope: inbox:read */
      list: async (params) => {
        return this.request("GET", "/inbox/conversations", void 0, params);
      },
      /** Get a single conversation. Requires scope: inbox:read */
      get: async (conversationId) => {
        return this.request("GET", `/inbox/conversations/${conversationId}`);
      },
      /** Get messages in a conversation. Requires scope: inbox:read */
      getMessages: async (conversationId, params) => {
        return this.request("GET", `/inbox/conversations/${conversationId}/messages`, void 0, params);
      },
      /** Reply to a conversation. Requires scope: inbox:write */
      reply: async (conversationId, message) => {
        return this.request("POST", `/inbox/conversations/${conversationId}/reply`, { message });
      },
      /** Get inbox statistics. Requires scope: inbox:read */
      stats: async () => {
        return this.request("GET", "/inbox/stats");
      }
    };
    // ==================== TIER 3: MENTIONS ====================
    this.mentions = {
      /** List mentions. Requires scope: mentions:read */
      list: async (params) => {
        return this.request("GET", "/mentions", void 0, params);
      },
      /** Get mention statistics. Requires scope: mentions:read */
      stats: async () => {
        return this.request("GET", "/mentions/stats");
      }
    };
    if (typeof config === "string") {
      this.apiKey = config;
      this.baseUrl = "https://api.schedulifyx.com";
      this.timeout = 3e4;
    } else {
      this.apiKey = config.apiKey;
      this.baseUrl = config.baseUrl || "https://api.schedulifyx.com";
      this.timeout = config.timeout || 3e4;
    }
  }
  async request(method, endpoint, body, queryParams) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== void 0) {
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
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : void 0,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SchedulifyXError(
          errorData.error?.message || `HTTP ${response.status}`,
          errorData.error?.code || "http_error",
          response.status,
          errorData.error?.details
        );
      }
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof SchedulifyXError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new SchedulifyXError("Request timeout", "timeout", 408);
      }
      throw new SchedulifyXError(
        error instanceof Error ? error.message : "Network error",
        "network_error",
        0
      );
    }
  }
};
var index_default = SchedulifyX;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SchedulifyX,
  SchedulifyXError
});
