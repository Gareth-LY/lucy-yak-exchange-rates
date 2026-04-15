# Lucy & Yak — EUR Exchange Rate Updater

Vercel cron job that fetches daily EUR exchange rates and stores them 
in a Shopify shop metafield for use in the europe-cart-validation function.

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and add your Shopify Admin API token
3. Connect to Vercel and add `SHOPIFY_ADMIN_TOKEN` as an environment variable
4. Deploy — the cron will run daily at 6am UTC

## Metafield

- Namespace: `custom`
- Key: `eur_exchange_rates`
- Type: `json`

## Currencies tracked

EUR, GBP, RON, BGN, CZK, HUF, PLN, DKK, SEK, NOK
