
document.getElementById("scrapeBtn").addEventListener("click", async () => {
  const statusEl = document.getElementById("status");
  statusEl.textContent = "Analyzing page...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scrapeNoonData,
  }, (results) => {
    if (chrome.runtime.lastError) {
      statusEl.textContent = "Error: " + chrome.runtime.lastError.message;
      return;
    }
    
    const result = results[0].result;
    if (result && result.success) {
      statusEl.textContent = `Found ${result.count} products! Copied to clipboard.`;
      statusEl.style.color = "green";
    } else {
      statusEl.textContent = "Failed: " + (result?.message || "No data found");
      statusEl.style.color = "red";
    }
  });
});

function scrapeNoonData() {
  try {
    let products = [];

    // STRATEGY 1: Try the Hidden JSON Data (Cleanest)
    try {
      const nextData = document.getElementById('__NEXT_DATA__');
      if (nextData) {
        const json = JSON.parse(nextData.innerText);
        const hits = json?.props?.pageProps?.catalog?.hits || 
                     json?.props?.pageProps?.initialState?.catalog?.hits || 
                     json?.props?.pageProps?.initialState?.products || 
                     [];
        
        if (hits.length > 0) {
          products = hits.map((item) => {
             const price = item.price || item.offer_price || item.sale_price || 0;
             const stock = item.stock_gross || (item.is_live ? 50 : 0);
             return {
              id: item.sku || item.offer_code || Math.random().toString(),
              sku: item.sku || 'N/A',
              name: item.name,
              description: item.long_description_en || item.brand || '',
              price: price, currency: 'AED', stock: stock, 
              category: item.brand || 'General',
              tags: item.is_express ? ['Express', 'Live'] : ['Live'],
              imageUrl: item.image_key ? `https://f.nooncdn.com/products/tr:n-t_400/${item.image_key}.jpg` : '',
              noonUrl: `https://www.noon.com/uae-en/${item.url_key}/p?o=${item.offer_code}`,
              lastSync: new Date().toISOString(),
              performance: { views: 0, clicks: 0, ctr: 0 }
            };
          });
        }
      }
    } catch (err) {
      console.log("Strategy 1 failed, trying fallback...");
    }

    // STRATEGY 2: Visual DOM Scraper (Fallback)
    // If JSON failed or found 0 products, look at the actual HTML elements
    if (products.length === 0) {
      // Find all anchor tags that look like product links
      const productLinks = Array.from(document.querySelectorAll('a[href*="/p/"]'));
      
      // Filter to ensure they are actual product cards (usually contain an image)
      const uniqueCards = new Map();

      productLinks.forEach(link => {
        // Find image inside
        const img = link.querySelector('img');
        if (!img) return;

        // Find price text somewhere in the container text
        const textContent = link.innerText;
        const priceMatch = textContent.match(/(\d{1,4}(\.\d{1,2})?)\s*AED/) || textContent.match(/AED\s*(\d{1,4}(\.\d{1,2})?)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

        // Use the link href as a unique key to avoid duplicates
        if (!uniqueCards.has(link.href)) {
          const urlParts = link.href.split('/');
          // Try to guess a name from alt tag or URL
          let name = img.alt;
          if (!name || name === "product") {
             // Fallback: use URL slug
             name = urlParts[urlParts.length - 2]?.replace(/-/g, ' ') || "Unknown Product";
          }

          uniqueCards.set(link.href, {
            id: Math.random().toString(36).substr(2, 9),
            sku: 'N-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            name: name,
            description: 'Imported via Visual Scraper',
            price: price,
            currency: 'AED',
            stock: 10, // Default for scraped
            category: 'Imported',
            tags: ['Scraped'],
            imageUrl: img.src,
            noonUrl: link.href,
            lastSync: new Date().toISOString(),
            performance: { views: 0, clicks: 0, ctr: 0 }
          });
        }
      });

      products = Array.from(uniqueCards.values());
    }

    if (products.length === 0) {
      return { success: false, message: "No products found. Please ensure you are on a page showing products grid." };
    }

    // Copy to clipboard logic
    const jsonString = JSON.stringify(products);
    const textArea = document.createElement("textarea");
    textArea.value = jsonString;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    return { success: true, count: products.length };

  } catch (e) {
    return { success: false, message: e.toString() };
  }
}
