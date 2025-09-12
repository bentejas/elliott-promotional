# Admin Authentication Setup

The admin panel is now protected with a login screen that requires both email selection and a gateway password.

## Environment Variables

Add these variables to your `.env` file:

```env
# Admin Authentication
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_EMAILS=admin@yourcompany.com,manager@yourcompany.com,owner@yourcompany.com

# Session Security (optional, will use default if not provided)
SESSION_SECRET=your_session_secret_key

# AWS SES (Simple Email Service) for Quote Requests
SES_FROM_EMAIL=noreply@yourdomain.com
QUOTE_RECIPIENT_EMAILS=quotes@yourcompany.com,sales@yourcompany.com,manager@yourcompany.com
```

## Configuration

### ADMIN_PASSWORD

- A secure password that all admin users will use to access the admin panel
- This is a gateway password shared by all admin users
- Make sure to use a strong, unique password

### ADMIN_EMAILS

- Comma-separated list of email addresses that are allowed to access the admin panel
- These emails will appear as options in the login screen dropdown
- Only these emails can access the admin panel (even with the correct password)

### SESSION_SECRET (Optional)

- Used to sign session cookies
- If not provided, a default will be used (not recommended for production)
- Should be a random, secure string

## Usage

1. Navigate to `/admin` - you'll be redirected to `/admin/login`
2. Select your email from the dropdown (only whitelisted emails appear)
3. Enter the gateway password
4. Click "Access Admin Panel"

## Security Features

- **Email Whitelist**: Only pre-approved email addresses can access the admin panel
- **Gateway Password**: Single shared password for all admin users
- **Session Management**: Secure cookie-based sessions with configurable expiry (1 week default)
- **Automatic Redirects**: Unauthenticated users are redirected to login
- **Logout Functionality**: Clear logout button in admin panel

## Routes

- `/admin` - Protected admin panel (redirects to login if not authenticated)
- `/admin/login` - Login screen with email selection and password input
- `/admin/logout` - Destroys session and redirects to login

## Default Configuration

If no environment variables are set, the system will use these defaults:

- **Password**: `admin123`
- **Emails**: `admin@elliottpromotional.com`, `manager@elliottpromotional.com`, `owner@elliottpromotional.com`

⚠️ **Important**: Always set custom values in production!
