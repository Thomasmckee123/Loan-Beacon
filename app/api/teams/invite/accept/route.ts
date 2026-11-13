import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/teams/invite/accept — accept an invite by token
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { token } = await request.json();
  if (!token) return NextResponse.json({ error: 'Token is required' }, { status: 400 });

  // Validate invite, add member and mark accepted atomically in the DB
  // (security definer fn; invitees cannot update team_invites directly)
  const { data: teamId, error } = await supabase.rpc("accept_team_invite", { p_token: token });

  if (error) {
    if (error.code === "P0002" || error.code === "22P02") {
      return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });
    }
    if (error.code === "42501") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.code === "PGRST202") {
      // accept_team_invite missing: supabase/migration-fix-rls.sql not applied
      return NextResponse.json(
        { error: "Invite acceptance unavailable: database migration not applied" },
        { status: 503 }
      );
    }
    if (error.code === "23505") {
      return NextResponse.json({ error: "You are already a member of this team" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, teamId });
}
