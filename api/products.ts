
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const NOON_APP_ID = process.env.NOON_APP_ID?.trim();
  const NOON_APP_KEY = process.env.NOON_APP_KEY?.trim();
  const USER_BU = (process.env.NOON_BUSINESS_UNIT || 'UAE').toUpperCase().trim();

  // Logging for Vercel console to help the user debug
  console.log(`API Request started. BU: ${USER_BU}, ID Present: ${!!NOON_APP_ID}, Key Present: ${!!NOON_APP_KEY}`);

  const BU_MAP: Record<string, string> = {
    'UAE': 'B001',
    'KSA': 'B002',
    'EGY': 'B003'
  };

  const NOON_BUSINESS_UNIT = BU_MAP[USER_BU] || 'B001';

  if (!NOON_APP_ID || !NOON_APP_KEY) {
    return new Response(
      JSON.stringify({ 
        error: 'Missing Credentials', 
        message: 'You need to add NOON_APP_ID and NOON_APP_KEY to Vercel Environment Variables.' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Auth_v1 requires a base64 encoded string of id:key
  const authString = btoa(`${NOON_APP_ID}:${NOON_APP_KEY}`);
  const authHeader = `Auth_v1 ${authString}`;

  try {
    // The Noon Catalog V1 endpoint
    const noonUrl = `https://api.noon.com/seller/v1/item?businessUnit=${NOON_BUSINESS_UNIT}&limit=50`;
    
    const response = await fetch(noonUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Noon API Error: ${response.status}`, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `Noon API Error ${response.status}`, 
          message: 'The Noon API rejected your credentials. Ensure you copied the Secret Key correctly from the popup.',
          details: errorText
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const items = data.payload?.items || [];
    
    // Transform Noon items into our standard Product interface
    const products = items.map((item: any) => ({
      id: item.identifier || Math.random().toString(36).substr(2, 9),
      sku: item.offer?.sku || item.identifier,
      name: item.product?.name || 'Noon Product',
      description: item.product?.description || 'No description provided.',
      price: item.offer?.price || 0,
      currency: item.offer?.currency || 'AED',
      stock: item.offer?.stock || 0,
      category: item.product?.category_name || 'General',
      tags: item.offer?.active ? ['Active'] : ['Pending'],
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
        'Cache-Control': 's-maxage=300' 
      }
    });

  } catch (error: any) {
    console.error('Proxy Exception:', error);
    return new Response(
      JSON.stringify({ error: 'Server Connection Error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
