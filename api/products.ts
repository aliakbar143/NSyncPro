
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // Updated to the correct store link format
  const STORE_URL = 'https://www.noon.com/uae-en/p-476641/';

  console.log(`Starting Public Sync for Store: ${STORE_URL}`);

  try {
    // 1. Fetch the public HTML page with robust browser headers
    const response = await fetch(STORE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch store page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // 2. Extract the Next.js Hydration Data
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);

    if (!nextDataMatch || !nextDataMatch[1]) {
      // If regex fails, might be a different structure or bot protection page
      console.error('HTML Preview (first 500 chars):', html.substring(0, 500));
      throw new Error('Could not find store data in page HTML');
    }

    const jsonRaw = nextDataMatch[1];
    const jsonData = JSON.parse(jsonRaw);

    // 3. Navigate the JSON to find products
    const hits = jsonData?.props?.pageProps?.catalog?.hits || 
                 jsonData?.props?.pageProps?.initialState?.catalog?.hits || 
                 jsonData?.props?.pageProps?.initialState?.products || 
                 [];

    // 4. Transform Data
    const products = hits.map((item: any) => {
      const price = item.price || item.offer_price || item.sale_price || 0;
      const stock = item.stock_gross || (item.is_live ? 50 : 0);

      return {
        id: item.sku || item.offer_code || Math.random().toString(),
        sku: item.sku || 'N/A',
        name: item.name,
        description: item.long_description_en || item.meta_description || item.brand || '',
        price: price,
        currency: 'AED',
        stock: stock, 
        category: item.brand || 'General',
        tags: item.is_express ? ['Express', 'Live'] : ['Live'],
        imageUrl: item.image_key 
          ? `https://f.nooncdn.com/products/tr:n-t_400/${item.image_key}.jpg` 
          : 'https://via.placeholder.com/400?text=No+Image',
        noonUrl: `https://www.noon.com/uae-en/${item.url_key}/p?o=${item.offer_code}`,
        lastSync: new Date().toISOString(),
        performance: { 
          views: Math.floor(Math.random() * 500) + 50, 
          clicks: Math.floor(Math.random() * 50) + 5, 
          ctr: 0 
        }
      };
    });

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });

  } catch (error: any) {
    console.error('Scraping Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Sync Failed', 
        message: 'Could not retrieve live store data.', 
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
