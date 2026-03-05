import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, buildMaturityEmailHtml } from '@/lib/email';
import { formatCurrency } from '@/lib/utils';

/**
 * GET /api/check-maturity
 *
 * Checks for loans maturing within 30 days and sends email
 * notifications to the loan owner. Protected by a CRON_SECRET
 * header so only your cron service can trigger it.
 *
 * Set up a daily cron job to hit this endpoint:
 *   - Vercel Cron: add to vercel.json
 *   - External: use cron-job.org, EasyCron, etc.
 */
export async function GET(request: Request) {
  // Verify the request is from the cron service
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // Find loans maturing within the next 30 days that haven't had a notification sent
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const todayStr = today.toISOString().split('T')[0];
    const cutoffStr = thirtyDaysFromNow.toISOString().split('T')[0];

    // Get all loans maturing within 30 days
    const { data: loans, error: loansError } = await supabase
      .from('loans')
      .select('*, companies(name)')
      .gte('maturity_date', todayStr)
      .lte('maturity_date', cutoffStr);

    if (loansError) {
      console.error('Error fetching loans:', loansError);
      return NextResponse.json({ error: 'Failed to fetch loans' }, { status: 500 });
    }

    if (!loans || loans.length === 0) {
      return NextResponse.json({ message: 'No loans maturing within 30 days', sent: 0 });
    }

    // Check which loans already have notifications sent
    const loanIds = loans.map((l) => l.id);
    const { data: existingNotifications } = await supabase
      .from('notifications_sent')
      .select('loan_id')
      .in('loan_id', loanIds)
      .eq('notification_type', 'maturity_30_day');

    const alreadyNotifiedLoanIds = new Set(
      (existingNotifications || []).map((n) => n.loan_id)
    );

    // Filter to only loans that haven't been notified yet
    const loansToNotify = loans.filter((l) => !alreadyNotifiedLoanIds.has(l.id));

    if (loansToNotify.length === 0) {
      return NextResponse.json({ message: 'All maturing loans already notified', sent: 0 });
    }

    // Get user emails for the loans we need to notify
    const userIds = [...new Set(loansToNotify.map((l) => l.user_id))];
    const userEmails: Record<string, string> = {};

    for (const userId of userIds) {
      const { data: userData } = await supabase.auth.admin.getUserById(userId);
      if (userData?.user?.email) {
        userEmails[userId] = userData.user.email;
      }
    }

    // Send emails and log notifications
    let sentCount = 0;
    const errors: string[] = [];

    for (const loan of loansToNotify) {
      const userEmail = userEmails[loan.user_id];
      if (!userEmail) {
        errors.push(`No email for user ${loan.user_id}, skipping loan ${loan.id}`);
        continue;
      }

      const daysRemaining = Math.ceil(
        (new Date(loan.maturity_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      const companyName = (loan.companies as { name: string })?.name || 'Unknown Company';

      const maturityDateFormatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(loan.maturity_date));

      try {
        // Send the email
        await sendEmail({
          to: userEmail,
          subject: `⚠️ Loan maturing in ${daysRemaining} days — ${companyName}`,
          html: buildMaturityEmailHtml({
            companyName,
            loanType: loan.type,
            lender: loan.lender,
            amount: formatCurrency(loan.amount),
            maturityDate: maturityDateFormatted,
            daysRemaining,
          }),
        });

        // Log that we sent the notification
        await supabase.from('notifications_sent').insert({
          user_id: loan.user_id,
          loan_id: loan.id,
          notification_type: 'maturity_30_day',
          recipient_email: userEmail,
        });

        sentCount++;
      } catch (emailError) {
        const message = emailError instanceof Error ? emailError.message : String(emailError);
        errors.push(`Failed to send email for loan ${loan.id}: ${message}`);
      }
    }

    return NextResponse.json({
      message: `Maturity check complete`,
      sent: sentCount,
      skipped: loansToNotify.length - sentCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Check-maturity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
