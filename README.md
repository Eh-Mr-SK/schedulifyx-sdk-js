# schedulifyx-sdk

Official JavaScript/TypeScript SDK for [SchedulifyX API](https://app.schedulifyx.com/docs/) — Three-tier API access for social media integration.

## Architecture

SchedulifyX uses a **Three-Tier API Access Model**:

| Tier | Access | Cost |
|------|--------|------|
| **Tier 1 — Embed** (default) | Tenants, webhooks, pre-built UI components | Free |
| **Tier 2 — Publishing API** | Posts, accounts, analytics, queue, profiles | Free (approval required) |
| **Tier 3 — Full Engagement** | Inbox, comments, mentions + all Tier 2 | $149/year |

- **This SDK** (server-side): Manage tenants, generate client tokens, configure webhooks (all tiers). With Tier 2+ keys, also access posts, accounts, analytics, and more via REST.
- **Embed SDK** (`@schedulifyx/embed`, client-side): Render pre-built UI components — available on all tiers, no approval needed.

## Installation

```bash
npm install schedulifyx-sdk
# or
yarn add schedulifyx-sdk
# or
pnpm add schedulifyx-sdk
```

## Quick Start

```typescript
import { SchedulifyX } from 'schedulifyx-sdk';

const client = new SchedulifyX('sk_live_YOUR_API_KEY');

// 1. Create a tenant (maps to a user in your app)
const tenant = await client.tenants.create({
  externalId: 'user_123',
  email: 'user@example.com',
  name: 'John Doe'
});

// 2. Generate a client token for embedding UI components
const { data: tokenData } = await client.tenants.generateClientToken(tenant.data.id, {
  components: ['post-creator', 'accounts', 'analytics'],
  expiresIn: 3600
});

// 3. Send tokenData.token to your frontend for the Embed SDK
```

## Configuration

```typescript
import { SchedulifyX } from 'schedulifyx-sdk';

// Simple initialization with API key string
const client = new SchedulifyX('sk_live_YOUR_API_KEY');

// With options
const client = new SchedulifyX({
  apiKey: 'sk_live_YOUR_API_KEY',
  baseUrl: 'https://api.schedulifyx.com', // optional, default
  timeout: 30000 // optional, in ms, default 30000
});
```

## API Reference

### Tenants

Tenants represent users in your application. Each tenant can connect social accounts and use embedded components.

```typescript
// Create a tenant
const tenant = await client.tenants.create({
  externalId: 'user_123',
  email: 'user@example.com',
  name: 'John Doe',
  metadata: { plan: 'pro' }
});

// List tenants
const tenants = await client.tenants.list({ limit: 20, search: 'john' });

// Get single tenant
const t = await client.tenants.get('tenant_uuid');

// Update tenant
await client.tenants.update('tenant_uuid', { name: 'Jane Doe' });

// Delete tenant (removes all their data)
await client.tenants.delete('tenant_uuid');
```

### Social Account Connection

Accounts are connected permanently via OAuth — they survive client token expiry.

```typescript
// Get OAuth URL for tenant to connect a platform
const { data } = await client.tenants.getConnectUrl('tenant_uuid', 'instagram', {
  redirectUri: 'https://yourapp.com/callback'
});
// Redirect user's browser to data.url

// List tenant's connected accounts
const accounts = await client.tenants.listAccounts('tenant_uuid');

// Disconnect an account
await client.tenants.disconnectAccount('tenant_uuid', 'account_uuid');

// Connect Bluesky (no OAuth, uses app password)
await client.tenants.connectBluesky('tenant_uuid', {
  identifier: 'user.bsky.social',
  appPassword: 'xxxx-xxxx-xxxx-xxxx'
});

// Connect Mastodon (token-based)
await client.tenants.connectMastodon('tenant_uuid', {
  instanceUrl: 'https://mastodon.social',
  accessToken: 'token_here'
});
```

### Client Tokens

Generate short-lived tokens for your frontend to render embedded UI components.

```typescript
// Generate client token (max 1 hour TTL)
const { data } = await client.tenants.generateClientToken('tenant_uuid', {
  components: ['post-creator', 'accounts', 'inbox', 'analytics'],
  expiresIn: 3600,
  allowedOrigins: ['https://yourapp.com']
});

console.log(data.token);      // Pass to frontend Embed SDK
console.log(data.expiresAt);  // ISO timestamp
```

### Webhooks

```typescript
// Create a webhook
const webhook = await client.webhooks.create({
  name: 'My Webhook',
  url: 'https://your-server.com/webhooks',
  events: ['post.published', 'post.failed', 'account.connected']
});

// List webhooks
const webhooks = await client.webhooks.list();

// Update a webhook
await client.webhooks.update('wh_123', { events: ['post.published'], isActive: false });

// Rotate secret
const rotated = await client.webhooks.rotateSecret('wh_123');

// Test a webhook
await client.webhooks.test('wh_123', 'post.published');

// Get event history
const events = await client.webhooks.getEvents('wh_123');

// Get available event types
const types = await client.webhooks.getEventTypes();

// Delete a webhook
await client.webhooks.delete('wh_123');
```

### Usage

```typescript
const usage = await client.usage();
console.log(`${usage.data.monthlyRequests}/${usage.data.monthlyLimit} monthly requests used`);
console.log(`${usage.data.monthlyRemaining} remaining this month`);
```

## Error Handling

```typescript
import { SchedulifyX, SchedulifyXError } from 'schedulifyx-sdk';

try {
  await client.tenants.create({ externalId: 'user_123' });
} catch (error) {
  if (error instanceof SchedulifyXError) {
    console.error('API Error:', error.code, error.message);
    console.error('Status:', error.status);
    console.error('Details:', error.details);
  }
}
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  Tenant,
  TenantAccount,
  ClientToken,
  Webhook,
  WebhookEvent,
  WebhookEventType,
  Usage,
  PaginatedResponse,
  SchedulifyXConfig
} from 'schedulifyx-sdk';
```

## Migration from v1.x

v2.0 introduced the three-tier access model. Direct data API methods were removed from the default (Tier 1) SDK, but are now available again with higher-tier API keys:

| Method | Tier 1 (Embed) | Tier 2 (Publishing) | Tier 3 (Engagement) |
|---|---|---|---|
| `client.posts.*` | Use embedded component | ✅ REST API | ✅ REST API |
| `client.accounts.*` | Use embedded component | ✅ REST API | ✅ REST API |
| `client.analytics.*` | Use embedded component | ✅ REST API | ✅ REST API |
| `client.queue.*` | Use embedded component | ✅ REST API | ✅ REST API |
| `client.xTwitter.*` | Use embedded component | ✅ REST API | ✅ REST API |
| `client.profiles.*` | Use embedded component | ✅ REST API | ✅ REST API |
| `client.comments.*` | Use embedded component | — | ✅ REST API |
| `client.inbox.*` | Use embedded component | — | ✅ REST API |
| `client.mentions.*` | Use embedded component | — | ✅ REST API |

**New in v2.0:**
- `client.tenants.generateClientToken()` — Generate tokens for embed SDK
- Persistent account connections via OAuth (accounts survive token expiry)
- Request Tier 2/3 access from your [API Keys dashboard](https://app.schedulifyx.com/settings/api)

See the [Embed Components documentation](https://app.schedulifyx.com/docs/embed-components) for frontend integration or the [Publishing API docs](https://app.schedulifyx.com/docs/api-posts) for REST access.

## License

MIT
