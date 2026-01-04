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
  Schedulify: () => Schedulify,
  SchedulifyError: () => SchedulifyError,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var SchedulifyError = class extends Error {
  constructor(message, code, status, details) {
    super(message);
    this.name = "SchedulifyError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
};
var Schedulify = class {
  constructor(config) {
    // ==================== POSTS ====================
    this.posts = {
      /**
       * List all posts with optional filters
       */
      list: async (params) => {
        return this.request("GET", "/posts", void 0, params);
      },
      /**
       * Get a single post by ID
       */
      get: async (postId) => {
        return this.request("GET", `/posts/${postId}`);
      },
      /**
       * Create a new post
       */
      create: async (data) => {
        return this.request("POST", "/posts", data);
      },
      /**
       * Update an existing post
       */
      update: async (postId, data) => {
        return this.request("PATCH", `/posts/${postId}`, data);
      },
      /**
       * Delete a post
       */
      delete: async (postId) => {
        return this.request("DELETE", `/posts/${postId}`);
      },
      /**
       * Publish a post immediately
       */
      publish: async (postId) => {
        return this.request("POST", `/posts/${postId}/publish`);
      }
    };
    // ==================== ACCOUNTS ====================
    this.accounts = {
      /**
       * List all connected social accounts
       */
      list: async (params) => {
        return this.request("GET", "/accounts", void 0, params);
      },
      /**
       * Get a single account by ID
       */
      get: async (accountId) => {
        return this.request("GET", `/accounts/${accountId}`);
      },
      /**
       * Get Pinterest boards for a Pinterest account
       */
      getPinterestBoards: async (accountId) => {
        return this.request("GET", `/accounts/${accountId}/pinterest-boards`);
      }
    };
    // ==================== ANALYTICS ====================
    this.analytics = {
      /**
       * Get analytics overview
       */
      overview: async () => {
        return this.request("GET", "/analytics/overview");
      },
      /**
       * Get analytics for a specific account
       */
      forAccount: async (accountId, params) => {
        return this.request("GET", `/analytics/account/${accountId}`, void 0, params);
      },
      /**
       * Get all analytics data
       */
      list: async (params) => {
        return this.request("GET", "/analytics", void 0, params);
      }
    };
    // ==================== MEDIA ====================
    this.media = {
      /**
       * Get a presigned URL for uploading media
       */
      getUploadUrl: async (data) => {
        return this.request("POST", "/media/upload-url", data);
      },
      /**
       * Helper to upload a file and return the media URL
       */
      upload: async (file, filename, contentType) => {
        const { data } = await this.media.getUploadUrl({ filename, contentType });
        await fetch(data.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: file
        });
        return data.mediaUrl;
      }
    };
    // ==================== USAGE ====================
    /**
     * Get API usage statistics
     */
    this.usage = async () => {
      return this.request("GET", "/usage");
    };
    // ==================== QUEUE ====================
    this.queue = {
      /**
       * Get queue schedule for a profile
       */
      getSlots: async (profileId) => {
        return this.request("GET", "/queue/slots", void 0, { profileId });
      },
      /**
       * Create or update queue schedule
       */
      setSlots: async (data) => {
        return this.request("PUT", "/queue/slots", data);
      },
      /**
       * Delete queue schedule
       */
      deleteSlots: async (profileId) => {
        return this.request("DELETE", "/queue/slots", void 0, { profileId });
      },
      /**
       * Get the next available slot
       */
      getNextSlot: async (profileId) => {
        return this.request("GET", "/queue/next-slot", void 0, { profileId });
      },
      /**
       * Preview upcoming slots
       */
      preview: async (profileId, count) => {
        return this.request("GET", "/queue/preview", void 0, { profileId, count });
      }
    };
    // ==================== TENANTS (Multi-tenant) ====================
    this.tenants = {
      /**
       * List all tenants
       */
      list: async (params) => {
        return this.request("GET", "/tenants", void 0, params);
      },
      /**
       * Get a single tenant
       */
      get: async (tenantId) => {
        return this.request("GET", `/tenants/${tenantId}`);
      },
      /**
       * Create a new tenant
       */
      create: async (data) => {
        return this.request("POST", "/tenants", data);
      },
      /**
       * Update a tenant
       */
      update: async (tenantId, data) => {
        return this.request("PATCH", `/tenants/${tenantId}`, data);
      },
      /**
       * Delete a tenant
       */
      delete: async (tenantId) => {
        return this.request("DELETE", `/tenants/${tenantId}`);
      },
      /**
       * Get OAuth URL for tenant to connect a platform
       */
      getConnectUrl: async (tenantId, platform) => {
        return this.request("GET", `/tenants/${tenantId}/connect/${platform}`);
      },
      /**
       * List tenant's connected accounts
       */
      listAccounts: async (tenantId) => {
        return this.request("GET", `/tenants/${tenantId}/accounts`);
      },
      /**
       * Disconnect a tenant's account
       */
      disconnectAccount: async (tenantId, accountId) => {
        return this.request("DELETE", `/tenants/${tenantId}/accounts/${accountId}`);
      },
      /**
       * Connect Bluesky account for tenant
       */
      connectBluesky: async (tenantId, data) => {
        return this.request("POST", `/tenants/${tenantId}/connect/bluesky`, data);
      },
      /**
       * Connect Mastodon account for tenant
       */
      connectMastodon: async (tenantId, data) => {
        return this.request("POST", `/tenants/${tenantId}/connect/mastodon`, data);
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
        throw new SchedulifyError(
          errorData.error?.message || `HTTP ${response.status}`,
          errorData.error?.code || "http_error",
          response.status,
          errorData.error?.details
        );
      }
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof SchedulifyError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new SchedulifyError("Request timeout", "timeout", 408);
      }
      throw new SchedulifyError(
        error instanceof Error ? error.message : "Network error",
        "network_error",
        0
      );
    }
  }
};
var index_default = Schedulify;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Schedulify,
  SchedulifyError
});
