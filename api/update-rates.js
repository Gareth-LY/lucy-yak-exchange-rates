export default async function handler(req, res) {
    try {
      // Fetch live rates from Frankfurter (free, no API key needed)
      const ratesRes = await fetch('https://api.frankfurter.app/latest?base=EUR&symbols=GBP,RON,BGN,CZK,HUF,PLN,DKK,SEK,NOK');
      
      if (!ratesRes.ok) {
        throw new Error(`Frankfurter API error: ${ratesRes.status}`);
      }
  
      const data = await ratesRes.json();
  
      // Invert to get "1 unit of currency X = Y EUR"
      const eurRates = { EUR: 1 };
      for (const [currency, rate] of Object.entries(data.rates)) {
        eurRates[currency] = parseFloat((1 / rate).toFixed(6));
      }
  
      // Update shop metafield via Admin API
      const shopifyRes = await fetch('https://lucy-yak.myshopify.com/admin/api/2025-07/metafields.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "eur_exchange_rates",
            value: JSON.stringify(eurRates),
            type: "json",
            owner_resource: "shop",
          }
        }),
      });
  
      const text = await shopifyRes.text();
      console.log('Shopify response:', shopifyRes.status, text);
  
      if (!shopifyRes.ok) {
        throw new Error(`Shopify API error: ${shopifyRes.status} — ${text}`);
      }
  
      const result = JSON.parse(text);
      return res.status(200).json({ success: true, rates: eurRates });
  
    } catch (error) {
      console.error('update-rates error:', error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  