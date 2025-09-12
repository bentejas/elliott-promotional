# AWS SES (Simple Email Service) Setup Guide

This guide will walk you through setting up AWS SES for sending quote request emails from your Elliott Promotional Products application.

## Prerequisites

- AWS Account with existing IAM user (you mentioned you already have access key and secret)
- Domain or verified email addresses for sending emails
- Your existing AWS credentials should have SES permissions (we'll update the IAM policy)

## Step 1: IAM Permissions Setup

You mentioned you'll update the IAM user permissions to include SES. Add this policy to your existing IAM user:

### SES IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:GetSendStatistics",
        "ses:GetSendQuota"
      ],
      "Resource": "*"
    }
  ]
}
```

## Step 2: SES Configuration in AWS Console

### 2.1 Navigate to SES

1. Go to AWS Console → Services → Simple Email Service (SES)
2. Make sure you're in the correct region (we default to `us-east-2`)

### 2.2 Verify Email Addresses or Domain

#### Option A: Verify Individual Email Addresses (Easier for testing)

1. Go to **Verified identities** in SES console
2. Click **Create identity**
3. Choose **Email address**
4. Enter your sender email (e.g., `noreply@elliottpromotional.com`)
5. Click **Create identity**
6. Check the email inbox and click the verification link

#### Option B: Verify Your Domain (Recommended for production)

1. Go to **Verified identities** in SES console
2. Click **Create identity**
3. Choose **Domain**
4. Enter your domain (e.g., `elliottpromotional.com`)
5. Follow the DNS verification steps provided by AWS

### 2.3 Request Production Access (Important!)

⚠️ **By default, SES is in "Sandbox Mode"** which means:

- You can only send emails to verified email addresses
- Daily sending limit is 200 emails
- Sending rate is 1 email per second

To send to any email address (like your customers):

1. Go to **Account dashboard** in SES console
2. Click **Request production access**
3. Fill out the form with:
   - **Mail type**: Transactional
   - **Website URL**: Your website URL
   - **Use case description**: "Sending quote request confirmations and internal notifications for promotional products business"
   - **Additional contact addresses**: Your business email addresses
   - **Preferred contact language**: English

This usually takes 24-48 hours for approval.

## Step 3: Environment Variables

Add these variables to your `.env` file:

```env
# AWS SES Configuration
SES_FROM_EMAIL=noreply@elliottpromotional.com
QUOTE_RECIPIENT_EMAILS=quotes@elliottpromotional.com,sales@elliottpromotional.com,manager@elliottpromotional.com

# Your existing AWS credentials (should already be set)
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
```

### Environment Variable Details

- **SES_FROM_EMAIL**: Must be a verified email address or from a verified domain
- **QUOTE_RECIPIENT_EMAILS**: Comma-separated list of emails that will receive quote requests
- **AWS_REGION**: The region where your SES is configured (default: us-east-2)

## Step 4: Testing the Setup

### 4.1 Test Email Sending

1. Start your application: `npm run dev`
2. Navigate to a product page and add items to cart
3. Go to `/request-quote` and fill out the form
4. Submit the quote request

### 4.2 Check Logs

Monitor your application logs for:

- ✅ `Quote request email sent successfully to [email]`
- ✅ `Confirmation email sent successfully to [customer_email]`
- ❌ Any error messages

### 4.3 Verify Email Delivery

1. **Internal Team**: Check that quote request emails arrive at addresses in `QUOTE_RECIPIENT_EMAILS`
2. **Customer**: Check that confirmation email arrives at the customer's email address

## Step 5: Production Considerations

### 5.1 Domain Authentication (Recommended)

For better deliverability, set up:

1. **SPF Record**: Add to DNS
2. **DKIM**: Enable in SES console
3. **DMARC**: Configure domain policy

### 5.2 Monitoring

Set up CloudWatch alarms for:

- Bounce rate
- Complaint rate
- Send rate
- Daily send quota

### 5.3 Email Templates

The application includes professional HTML email templates with:

- Responsive design
- Customer information display
- Product details with images
- Professional branding

## Troubleshooting

### Common Issues

1. **"Email address not verified"**
   - Solution: Verify the sender email address in SES console

2. **"MessageRejected: Email address not verified"**
   - Solution: If in sandbox mode, verify recipient email addresses OR request production access

3. **"AccessDenied" errors**
   - Solution: Check IAM permissions include SES actions

4. **Emails not being received**
   - Check spam/junk folders
   - Verify email addresses are correct
   - Check SES sending statistics for bounces/complaints

### Checking SES Status

```bash
# Check SES sending statistics (if you have AWS CLI)
aws ses get-send-statistics --region us-east-1

# Check verified identities
aws ses list-verified-email-addresses --region us-east-1
```

## Default Configuration

If environment variables are not set, the system uses these defaults:

- **FROM_EMAIL**: `noreply@elliottpromotional.com`
- **RECIPIENT_EMAILS**: `quotes@elliottpromotional.com`, `sales@elliottpromotional.com`
- **REGION**: `us-east-1`

⚠️ **Important**: Always set custom values in production!

## Email Features

### Quote Request Email (Internal Team)

- Professional HTML template with company branding
- Complete customer information
- Product details with images, colors, sizes, quantities
- Quote summary with totals
- Responsive design for mobile viewing

### Confirmation Email (Customer)

- Thank you message with next steps
- Professional branding
- Clear expectations (24-hour response time)
- Encouragement to contact for urgent questions

## Support

If you encounter issues:

1. Check AWS SES console for sending statistics
2. Review application logs for error details
3. Verify all environment variables are set correctly
4. Ensure SES is not in sandbox mode for production use
