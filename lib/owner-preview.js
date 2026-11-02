import { AsyncLocalStorage } from 'node:async_hooks';
import { createHash } from 'node:crypto';
import { verifyPiUser, apiError } from './pi.js';

const context = new AsyncLocalStorage();
export function inOwnerPreview() { return Boolean(context.getStore()); }
export function previewStorageKey(key) {
  const scope = context.getStore();
  return scope && typeof key === 'string' && key.startsWith('sticker:mainnet:')
    ? key.replace('sticker:mainnet:', scope.prefix) : key;
}
export function ownerPreviewHandler(handler, { payments = false } = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, private');
    if (!req.headers['x-sticker-owner-preview']) return handler(req, res);
    try {
      if (process.env.STICKER_OWNER_PREVIEW_DISABLED === '1') {
        throw Object.assign(new Error('Private preview is disabled'), { status: 403 });
      }
      if (req.headers['x-sticker-owner-preview'] !== '1') {
        throw Object.assign(new Error('Invalid private preview mode'), { status: 400 });
      }
      const user = await verifyPiUser(req);
      // The account name comes only from Pi's verified identity response.
      if (user.username !== 'Giulex84') {
        throw Object.assign(new Error('Private preview is owner-only'), { status: 403 });
      }
      if (payments && req.body?.action) {
        throw Object.assign(new Error('Payments and payment recovery are disabled in private preview'), { status: 403 });
      }
      const subject = createHash('sha256').update(user.uid).digest('hex');
      return await context.run({ prefix: `sticker:owner-preview:v1:${subject}:` }, () => handler(req, res));
    } catch (error) { return apiError(res, error); }
  };
}
