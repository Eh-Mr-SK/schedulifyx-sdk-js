# schedulifyx-sdk

Official JavaScript/TypeScript SDK for [SchedulifyX API](https://app.schedulifyx.com/docs/) - Social media scheduling made easy.

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

// List all posts
const posts = await client.posts.list();
console.log(posts.data);

// Create a scheduled post
const post = await client.posts.create({
  content: 'Hello from the SDK! 🚀',
  platforms: [{ platform: 'twitter', accountId: 'acc_123' }],
  scheduledFor: '2024-12-20T10:00:00Z'
});

// Publish immediately
await client.posts.publish(post.data.id);
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

### Posts

```typescript
// List posts with filters
const posts = await client.posts.list({
  status: 'scheduled',
  accountId: 'acc_123',
  limit: 20,
  offset: 0
});

// Get single post
const post = await client.posts.get('post_123');

// Create post
const newPost = await client.posts.create({
  content: 'Hello world!',
  platforms: [
    { platform: 'twitter', accountId: 'acc_123' },
    { platform: 'instagram', accountId: 'acc_456' }
  ],
  scheduledFor: '2024-12-20T10:00:00Z',
  mediaUrls: ['https://example.com/image.jpg']
});

// Update post
await client.posts.update('post_123', {
  content: 'Updated content',
  scheduledFor: '2024-12-21T10:00:00Z'
});

// Delete post
await client.posts.delete('post_123');

// Publish immediately
await client.posts.publish('post_123');
```

### Accounts

```typescript
// List all connected accounts
const accounts = await client.accounts.list();

// Filter by platform
const instagramAccounts = await client.accounts.list({
  platform: 'instagram'
});

// Get single account
const account = await client.accounts.get('acc_123');

// Get Pinterest boards
const boards = await client.accounts.getPinterestBoards('acc_pinterest_123');
```

### Profiles

```typescript
// List publishing profiles
const profiles = await client.profiles.list();

// Create a profile
const profile = await client.profiles.create({
  name: 'Morning Posts',
  description: 'Profile for morning content',
  color: '#3B82F6'
});

// Update a profile
await client.profiles.update('profile_123', { name: 'Updated Name' });

// Delete a profile
await client.profiles.delete('profile_123');
```

### Analytics

```typescript
// Get overview
const overview = await client.analytics.overview();

// Get account-specific analytics
const accountAnalytics = await client.analytics.forAccount('acc_123', { days: 30 });

// Get all analytics
const allAnalytics = await client.analytics.list({
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

### Queue

```typescript
// Get queue schedule
const queue = await client.queue.getSlots('acc_123');

// Set queue schedule
await client.queue.setSlots({
  accountId: 'acc_123',
  timezone: 'America/New_York',
  slots: [
    { dayOfWeek: 1, time: '09:00' },
    { dayOfWeek: 1, time: '15:00' },
    { dayOfWeek: 3, time: '12:00' }
  ],
  isActive: true
});

// Get next available slot
const nextSlot = await client.queue.getNextSlot('acc_123');

// Preview upcoming slots
const preview = await client.queue.preview('acc_123', 10);

// Get all queue schedules
const all = await client.queue.getAll();

// Delete queue schedule
await client.queue.deleteSlots('acc_123');
```

### Webhooks

```typescript
// Create a webhook
const webhook = await client.webhooks.create({
  name: 'My Webhook',
  url: 'https://your-server.com/webhooks',
  events: ['post.published', 'post.failed']
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

### Comments

```typescript
const comments = await client.comments.list({ sentiment: 'positive', limit: 20 });
const comment = await client.comments.get('comment_123');
const replies = await client.comments.getReplies('comment_123');
await client.comments.reply('comment_123', { message: 'Thanks!' });
const stats = await client.comments.stats();
```

### Inbox

```typescript
const conversations = await client.inbox.list({ status: 'open', hasUnread: true });
const messages = await client.inbox.getMessages('conv_123');
await client.inbox.reply('conv_123', { message: 'Thanks for reaching out!' });
const inboxStats = await client.inbox.stats();
```

### Mentions

```typescript
const mentions = await client.mentions.list({ platform: 'instagram', status: 'unread' });
const mentionStats = await client.mentions.stats();
```

### X/Twitter BYOK

```typescript
const config = await client.xTwitter.getConfig();
await client.xTwitter.setCredentials({
  apiKey: '...', apiSecret: '...', accessToken: '...', accessTokenSecret: '...'
});
await client.xTwitter.switchMode({ accountId: 'acc_123', mode: 'byok' });
```

### Usage

```typescript
const usage = await client.usage();
console.log(`${usage.data.requestsToday}/${usage.data.dailyLimit} daily requests used`);
```

### Multi-Tenant

```typescript
// Create a tenant
const tenant = await client.tenants.create({
  externalId: 'user_123',
  email: 'user@example.com',
  name: 'John Doe'
});

// Get OAuth URL for tenant
const { data } = await client.tenants.getConnectUrl(tenant.data.id, 'instagram');

// List tenant's accounts
const accounts = await client.tenants.listAccounts(tenant.data.id);

// Connect Bluesky for tenant
await client.tenants.connectBluesky(tenant.data.id, {
  identifier: 'user.bsky.social',
  appPassword: 'xxxx-xxxx-xxxx-xxxx'
});

// Disconnect account
await client.tenants.disconnectAccount(tenant.data.id, 'acc_123');
```

## Error Handling

```typescript
import { SchedulifyX, SchedulifyXError } from 'schedulifyx-sdk';

try {
  await client.posts.create({...});
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
  Post,
  Account,
  Profile,
  Analytics,
  AnalyticsOverview,
  Usage,
  Tenant,
  QueueSlot,
  QueueSchedule,
  Webhook,
  WebhookEvent,
  WebhookEventType,
  Comment,
  CommentStats,
  Conversation,
  InboxMessage,
  InboxStats,
  Mention,
  MentionStats,
  PaginatedResponse,
  SchedulifyXConfig
} from 'schedulifyx-sdk';
```

## License

MIT
