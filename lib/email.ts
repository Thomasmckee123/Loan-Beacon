/**
 * Email sending utility using Resend.
 * https://resend.com/docs/send-with-nextjs
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'LoanBeacon <notifications@resend.dev>',
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Build the maturity warning email HTML
 */
export function buildMaturityEmailHtml(params: {
  companyName: string;
  loanType: string;
  lender: string;
  amount: string;
  maturityDate: string;
  daysRemaining: number;
}): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1e3a5f; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #f5c542; margin: 0; font-size: 24px;">LoanBeacon</h1>
        <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px;">Maturity Alert</p>
      </div>

      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="margin: 0; color: #92400e; font-weight: 600;">
            ⚠️ Loan maturing in ${params.daysRemaining} days
          </p>
        </div>

        <h2 style="color: #1e3a5f; margin: 0 0 16px;">Loan Details</h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 140px;">Company</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 500;">${params.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Loan Type</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 500;">${params.loanType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Lender</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 500;">${params.lender}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Amount</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 500;">${params.amount}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Maturity Date</td>
            <td style="padding: 8px 0; color: #dc2626; font-weight: 600;">${params.maturityDate}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Consider starting the refinancing process now to ensure continuity.
          </p>
        </div>
      </div>

      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
        Sent by LoanBeacon • Loan Maturity Tracking
      </p>
    </div>
  `;
}
