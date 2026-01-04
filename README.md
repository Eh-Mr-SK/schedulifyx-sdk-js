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
import { Schedulify } from 'schedulifyx-sdk';

const client = new Schedulify('sk_live_YOUR_API_KEY');

// List all posts
const posts = await client.posts.list();
console.log(posts.data);

// Create a scheduled post
const post = await client.posts.create({
  content: 'Hello from the SDK! 🚀',
  accountIds: ['acc_123'],
  publishAt: '2024-12-20T10:00:00Z'
});

// Publish immediately
await client.posts.publish(post.data.id);
```

## Configuration

```typescript
import { Schedulify } from '@schedulify/sdk';

// Simple initialization
const client = new Schedulify('sk_live_YOUR_API_KEY');

// With options
const client = new Schedulify({
  apiKey: 'sk_live_YOUR_API_KEY',
  baseUrl: 'https://api.schedulifyx.com', // optional
  timeout: 30000 // optional, in ms
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
  accountIds: ['acc_123', 'acc_456'],
  publishAt: '2024-12-20T10:00:00Z',
  mediaUrls: ['https://example.com/image.jpg'],
  platformOverrides: {
    twitter: { content: 'Hello Twitter! #launch' }
  }
});

// Update post
await client.posts.update('post_123', {
  content: 'Updated content',
  publishAt: '2024-12-21T10:00:00Z'
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

### Media Upload

```typescript
// Get presigned upload URL
const { data } = await client.media.getUploadUrl({
  filename: 'my-image.jpg',
  contentType: 'image/jpeg'
});

// Upload using the presigned URL
await fetch(data.uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'image/jpeg' },
  body: imageBuffer
});

// Use mediaUrl in your post
await client.posts.create({
  content: 'Check out this image!',
  accountIds: ['acc_123'],
  mediaUrls: [data.mediaUrl]
});

// Or use the convenience helper (Node.js)
const mediaUrl = await client.media.upload(imageBuffer, 'image.jpg', 'image/jpeg');
```

### Analytics

```typescript
// Get overview
const overview = await client.analytics.overview();

// Get account-specific analytics
const accountAnalytics = await client.analytics.forAccount('acc_123', {
  days: 30
});

// Get all analytics
const allAnalytics = await client.analytics.list({
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

### Queue

```typescript
// Get queue schedule
const queue = await client.queue.getSlots('profile_123');

// Set queue schedule
await client.queue.setSlots({
  profileId: 'profile_123',
  timezone: 'America/New_York',
  slots: [
    { dayOfWeek: 1, time: '09:00' },
    { dayOfWeek: 1, time: '15:00' },
    { dayOfWeek: 2, time: '09:00' }
  ],
  active: true
});

// Get next available slot
const nextSlot = await client.queue.getNextSlot('profile_123');

// Preview upcoming slots
const preview = await client.queue.preview('profile_123', 10);
```

### Usage

```typescript
const usage = await client.usage();
console.log(`${usage.data.requestsToday}/${usage.data.dailyLimit} daily requests used`);
```

### Multi-Tenant (Enterprise)

```typescript
// Create a tenant
const tenant = await client.tenants.create({
  externalId: 'user_123',
  email: 'user@example.com',
  name: 'John Doe'
});

// Get OAuth URL for tenant
const { data } = await client.tenants.getConnectUrl(tenant.data.id, 'instagram');
// Redirect user to data.url

// List tenant's accounts
const accounts = await client.tenants.listAccounts(tenant.data.id);

// Disconnect account
await client.tenants.disconnectAccount(tenant.data.id, 'acc_123');
```

## Error Handling

```typescript
import { Schedulify, SchedulifyError } from '@schedulify/sdk';

try {
  await client.posts.create({...});
} catch (error) {
  if (error instanceof SchedulifyError) {
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
  Analytics, 
  Tenant, 
  QueueSchedule,
  SchedulifyConfig 
} from 'schedulifyx-sdk';
```

## License

MIT
