# Stripe Payment Integration Setup

This guide explains how to set up Stripe payment integration for the Shoe Hub application.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm installed
3. The application running locally

## Setup Steps

### 1. Stripe Account Setup

1. Create a Stripe account at https://stripe.com
2. Go to the Stripe Dashboard
3. Navigate to Developers > API keys
4. Copy your Publishable key and Secret key

### 2. Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Backend URL
VITE_BACKEND_URL=http://localhost:3000

# Frontend URL
VITE_FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the backend directory with:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Other existing variables...
```

### 3. Webhook Setup

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `http://localhost:3000/api/v1/stripe/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the webhook signing secret to your backend `.env` file

### 4. Testing

1. Start your backend server: `npm start` (in backend directory)
2. Start your frontend: `npm run dev` (in frontend directory)
3. Test the payment flow:
   - Add items to cart
   - Go to checkout
   - Select "Online Payment (Stripe)"
   - Use test card: 4242 4242 4242 4242
   - Complete payment

## Features

- ✅ Secure Stripe Checkout integration
- ✅ Support for credit/debit cards
- ✅ Automatic order creation after successful payment
- ✅ Webhook handling for payment confirmation
- ✅ Error handling and user feedback
- ✅ Responsive design matching your theme

## Test Cards

Use these test card numbers for testing:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

## Security Notes

- Never expose your Stripe secret key in frontend code
- Always use environment variables for sensitive data
- Implement proper webhook signature verification
- Use HTTPS in production

## Troubleshooting

1. **Payment fails**: Check your Stripe keys and webhook configuration
2. **Order not created**: Verify webhook endpoint is accessible
3. **Frontend errors**: Ensure environment variables are set correctly

## Production Deployment

1. Switch to live Stripe keys
2. Update webhook endpoint to production URL
3. Enable HTTPS
4. Set up proper error monitoring 