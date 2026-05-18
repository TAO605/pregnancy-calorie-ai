# Stripe Premium Subscription Setup

This file documents the production setup for the optional Premium subscription system.

## Vercel Environment Variables

Add these variables to the Vercel project in Production:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ANNUAL`
- `STRIPE_PRICE_MONTHLY`
- `SITE_URL`

Keep all Stripe secret values on Vercel only. Do not paste them into `index.html`, `premium.html`, or browser JavaScript.

## Stripe Test Mode Steps

1. Open Stripe Dashboard and switch to Test mode.
2. Create two recurring subscription prices:
   - Annual plan: `$49.99 / year`, 7-day free trial.
   - Monthly plan: `$7.99 / month`, 7-day free trial.
3. Copy the annual Price ID into `STRIPE_PRICE_ANNUAL`.
4. Copy the monthly Price ID into `STRIPE_PRICE_MONTHLY`.
5. Copy the test secret key into `STRIPE_SECRET_KEY`.
6. Add a webhook endpoint:
   - URL: `https://aipregnancycaloriecalculator.online/api/subscription/webhook`
   - Events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
7. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
8. Redeploy Vercel Production.

## Production Switch

1. Repeat the same product and price setup in Stripe Live mode.
2. Replace Vercel Production variables with Live mode values.
3. Redeploy Production.
4. Run a real low-risk transaction or Stripe live verification flow before public promotion.

## Safety Rules

- The free calculator remains fully usable for guests and free accounts.
- Stripe Checkout handles payment details. The website never stores card data.
- Stripe Webhook events are signature-verified before updating subscription status.
- Subscription state is stored on `pcc_users` as `subscription_status`, `subscription_plan`, and `subscription_expires_at`.
