/**
 * Edge-compatible JWT verification for middleware
 * Uses Web Crypto API instead of Node.js crypto
 */

const JWT_SECRET = process.env.JWT_SECRET || 'rawgle-dev-secret-key-change-in-production';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'rawgle-admin-secret-key-change-in-production';

/**
 * Base64 URL encode (Pure Edge Runtime - no Buffer)
 */
function base64UrlEncode(str: string): string {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64 URL decode (Pure Edge Runtime - no Buffer)
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * Sign data using Web Crypto API (Edge-compatible)
 */
async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataToSign = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, dataToSign);
  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureBase64 = btoa(String.fromCharCode(...signatureArray));

  return signatureBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Verify and decode a JWT token (Edge-compatible)
 */
export async function verifyTokenEdge(token: string | null | undefined): Promise<any | null> {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // Validate that we have all parts
    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('[JWT Edge] Token verification failed:', error);
    return null;
  }
}

/**
 * Verify admin token (Edge-compatible)
 */
export async function verifyAdminTokenEdge(token: string | null | undefined): Promise<any | null> {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // Validate that we have all parts
    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`, ADMIN_JWT_SECRET);

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    // Verify issuer and audience for admin tokens
    if (payload.iss !== 'rawgle-admin' || payload.aud !== 'rawgle-cms') {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('[JWT Edge] Admin token verification failed:', error);
    return null;
  }
}
