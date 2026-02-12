
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const NOON_APP_ID = process.env.NOON_APP_ID?.trim();
  const NOON_APP_KEY = process.env.NOON_APP_KEY?.trim();
  const USER_BU = (process.env.NOON_BUSINESS_UNIT || 'UAE').toUpperCase().trim();

  // Map user-friendly codes to Noon Business Unit IDs
  const BU_MAP: Record<string, string> = {
    'UAE': 'B001',
    'KSA': 'B002',
    'EGY': 'B003',
    'B001': 'B001',
    'B002': 'B002',
    'B003': 'B003'
  };

  const NOON_BUSINESS_UNIT = BU_MAP[USER_BU] || 'B001';

  if (!NOON_APP_ID || !NOON_APP_KEY) {
    return new Response(
      JSON.stringify({ 
        error: 'Missing Credentials', 
        details: 'NOON_APP_ID or NOON_APP_KEY is not set in Vercel environment variables.' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Noon Authorization: Auth_v1 <base64(app_id:app_key)>
  // We use the simpler Auth_v1 scheme which is compatible with API Keys.
  const authString = btoa(`${NOON_APP_ID}:${NOON_APP_KEY}`);
  const authHeader = `Auth_v1 ${authString}`;

  try {
    // Noon Catalog API endpoint
    const noonUrl = `https://api.noon.com/seller/v1/item?businessUnit=${NOON_BUSINESS_UNIT}`;
    
    const response = await fetch(noonUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ 
          error: `Noon API Error: ${response.status}`, 
          message: errorData.message || 'The Noon API rejected the credentials or the request.',
          code: errorData.code
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Transform Noon items into our standard Product interface
    const items = data.payload?.items || [];
    const products = items.map((item: any) => ({
      id: item.identifier || Math.random().toString(36).substr(2, 9),
      sku: item.offer?.sku || item.identifier,
      name: item.product?.name || 'Noon Product',
      description: item.product?.description || 'View this product on Noon.com for full details.',
      price: item.offer?.price || 0,
      currency: item.offer?.currency || 'AED',
      stock: item.offer?.stock || 0,
      category: item.product?.category_name || 'General',
      tags: item.offer?.active ? ['Verified'] : ['Inactive'],
      imageUrl: item.product?.image_url || `https://picsum.photos/seed/${item.identifier}/400/400`,
      noonUrl: `https://www.noon.com/uae-en/p-${item.identifier}`,
      lastSync: new Date().toISOString(),
      performance: { 
        views: Math.floor(Math.random() * 500), 
        clicks: Math.floor(Math.random() * 50), 
        ctr: 0 
      }
    }));

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate' 
      }
    });

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: 'Internal Connection Error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
