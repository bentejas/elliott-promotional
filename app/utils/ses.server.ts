import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { CartItem } from "./cart";

// SES Client Configuration
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Environment variables
const FROM_EMAIL =
  process.env.SES_FROM_EMAIL || "noreply@elliottpromotional.com";
const QUOTE_RECIPIENT_EMAILS = process.env.QUOTE_RECIPIENT_EMAILS?.split(
  ","
) || ["quotes@elliottpromotional.com", "sales@elliottpromotional.com"];

interface QuoteRequestData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerMessage: string;
  cartItems: CartItem[];
}

export async function sendQuoteRequestEmail(
  data: QuoteRequestData
): Promise<void> {
  const {
    customerName,
    customerEmail,
    customerPhone,
    customerMessage,
    cartItems,
  } = data;

  // Calculate total items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalProducts = cartItems.length;

  // Generate cart items HTML
  const cartItemsHtml = cartItems
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 16px; vertical-align: top;">
            <div style="display: flex; align-items: flex-start; gap: 16px;">
              ${
                item.imgSrc
                  ? `<img src="${item.imgSrc}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;" />`
                  : '<div style="width: 80px; height: 80px; background-color: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 12px;">No Image</div>'
              }
              <div style="flex: 1;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${item.title}</h3>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">Product Code: ${item.productCode}</p>
                ${
                  item.selectedColor
                    ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">Color: ${item.selectedColor}</p>`
                    : ""
                }
                ${
                  item.selectedSize
                    ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">Size: ${item.selectedSize}</p>`
                    : ""
                }
                <p style="margin: 0; font-size: 14px; font-weight: 500; color: #111827;">Quantity: ${item.quantity}</p>
              </div>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  // Email subject
  const subject = `New Quote Request from ${customerName} - ${totalProducts} Product${totalProducts !== 1 ? "s" : ""} (${totalItems} Items)`;

  // HTML email template
  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote Request</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">New Quote Request</h1>
            <p style="margin: 16px 0 0 0; color: #d1d5db; font-size: 16px;">Elliott Promotional Products</p>
          </div>

          <!-- Customer Information -->
          <div style="padding: 32px;">
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">Customer Information</h2>
              <div style="display: grid; gap: 12px;">
                <div>
                  <strong style="color: #374151;">Name:</strong>
                  <span style="color: #6b7280; margin-left: 8px;">${customerName}</span>
                </div>
                <div>
                  <strong style="color: #374151;">Email:</strong>
                  <span style="color: #6b7280; margin-left: 8px;">${customerEmail}</span>
                </div>
                <div>
                  <strong style="color: #374151;">Phone:</strong>
                  <span style="color: #6b7280; margin-left: 8px;">${customerPhone}</span>
                </div>
                ${
                  customerMessage
                    ? `
                <div>
                  <strong style="color: #374151;">Message:</strong>
                  <div style="margin-top: 8px; padding: 12px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; line-height: 1.5;">${customerMessage}</p>
                  </div>
                </div>
                `
                    : ""
                }
              </div>
            </div>

            <!-- Quote Summary -->
            <div style="margin-bottom: 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">Quote Summary</h2>
              <div style="background-color: #fef3f2; border-radius: 8px; padding: 16px; border: 1px solid #fecaca;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 16px; color: #374151;">Total Products:</span>
                  <span style="font-size: 18px; font-weight: 600; color: #dc2626;">${totalProducts}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                  <span style="font-size: 16px; color: #374151;">Total Items:</span>
                  <span style="font-size: 18px; font-weight: 600; color: #dc2626;">${totalItems}</span>
                </div>
              </div>
            </div>

            <!-- Products Requested -->
            <div>
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">Products Requested</h2>
              <div style="border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                <table style="width: 100%; border-collapse: collapse;">
                  ${cartItemsHtml}
                </table>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              This quote request was submitted through the Elliott Promotional Products website.
            </p>
            <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
              Please respond to the customer within 24 hours for the best experience.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Plain text version (fallback)
  const textBody = `
New Quote Request from ${customerName}

Customer Information:
- Name: ${customerName}
- Email: ${customerEmail}
- Phone: ${customerPhone}
${customerMessage ? `- Message: ${customerMessage}` : ""}

Quote Summary:
- Total Products: ${totalProducts}
- Total Items: ${totalItems}

Products Requested:
${cartItems
  .map(
    (item) =>
      `- ${item.title} (${item.productCode})${item.selectedColor ? ` - Color: ${item.selectedColor}` : ""}${item.selectedSize ? ` - Size: ${item.selectedSize}` : ""} - Quantity: ${item.quantity}`
  )
  .join("\n")}

This quote request was submitted through the Elliott Promotional Products website.
  `;

  // Send email to all recipients
  const sendEmailPromises = QUOTE_RECIPIENT_EMAILS.map(
    async (recipientEmail) => {
      const command = new SendEmailCommand({
        Source: FROM_EMAIL,
        Destination: {
          ToAddresses: [recipientEmail.trim()],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: htmlBody,
              Charset: "UTF-8",
            },
            Text: {
              Data: textBody,
              Charset: "UTF-8",
            },
          },
        },
      });

      try {
        const result = await sesClient.send(command);
        console.log(
          `Quote request email sent successfully to ${recipientEmail}:`,
          result.MessageId
        );
        return {
          success: true,
          recipient: recipientEmail,
          messageId: result.MessageId,
        };
      } catch (error) {
        console.error(
          `Failed to send quote request email to ${recipientEmail}:`,
          error
        );
        return { success: false, recipient: recipientEmail, error: error };
      }
    }
  );

  // Wait for all emails to be sent
  const results = await Promise.all(sendEmailPromises);

  // Check if any emails failed
  const failedEmails = results.filter((result) => !result.success);
  if (failedEmails.length > 0) {
    console.error("Some quote request emails failed to send:", failedEmails);
    throw new Error(
      `Failed to send quote request to ${failedEmails.length} recipient(s)`
    );
  }

  console.log(
    `Quote request email sent successfully to ${results.length} recipient(s)`
  );
}

export async function sendQuoteConfirmationEmail(
  customerEmail: string,
  customerName: string
): Promise<void> {
  const subject = "Quote Request Received - Elliott Promotional Products";

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote Request Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Quote Request Received</h1>
            <p style="margin: 16px 0 0 0; color: #d1d5db; font-size: 16px;">Elliott Promotional Products</p>
          </div>

          <!-- Content -->
          <div style="padding: 32px;">
            <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">Thank you, ${customerName}!</h2>
            
            <p style="margin: 0 0 16px 0; color: #6b7280; line-height: 1.6;">
              We've received your quote request and our team will review it shortly. You can expect to hear back from us within 24 hours with a detailed quote.
            </p>

            <div style="background-color: #f0f9ff; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #bae6fd;">
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #0c4a6e;">What happens next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li style="margin-bottom: 8px;">Our team will review your product selections and requirements</li>
                <li style="margin-bottom: 8px;">We'll prepare a detailed quote with pricing and delivery information</li>
                <li style="margin-bottom: 8px;">You'll receive a personalized quote via email within 24 hours</li>
                <li>We'll follow up to discuss any questions or customizations</li>
              </ul>
            </div>

            <p style="margin: 16px 0 0 0; color: #6b7280; line-height: 1.6;">
              If you have any urgent questions or need to make changes to your request, please don't hesitate to contact us directly.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; color: #374151; font-weight: 600;">Elliott Promotional Products</p>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              Bringing your brand to life with premium promotional products.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textBody = `
Thank you, ${customerName}!

We've received your quote request and our team will review it shortly. You can expect to hear back from us within 24 hours with a detailed quote.

What happens next?
- Our team will review your product selections and requirements
- We'll prepare a detailed quote with pricing and delivery information  
- You'll receive a personalized quote via email within 24 hours
- We'll follow up to discuss any questions or customizations

If you have any urgent questions or need to make changes to your request, please don't hesitate to contact us directly.

Elliott Promotional Products
Bringing your brand to life with premium promotional products.
  `;

  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: {
      ToAddresses: [customerEmail],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: "UTF-8",
        },
        Text: {
          Data: textBody,
          Charset: "UTF-8",
        },
      },
    },
  });

  try {
    const result = await sesClient.send(command);
    console.log(
      `Confirmation email sent successfully to ${customerEmail}:`,
      result.MessageId
    );
  } catch (error) {
    console.error(
      `Failed to send confirmation email to ${customerEmail}:`,
      error
    );
    throw new Error("Failed to send confirmation email to customer");
  }
}
