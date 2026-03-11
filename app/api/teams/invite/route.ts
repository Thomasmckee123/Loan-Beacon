import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/teams/invite?teamId=xxx — get pending invites for a team
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');
  if (!teamId) return NextResponse.json({ error: 'teamId is required' }, { status: 400 });

  const { data: invites, error } = await supabase
    .from('team_invites')
    .select('*')
    .eq('team_id', teamId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(invites);
}

// POST /api/teams/invite — send an invite
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { teamId, email, role = 'member' } = await request.json();

  if (!teamId || !email?.trim()) {
    return NextResponse.json({ error: 'teamId and email are required' }, { status: 400 });
  }

  // Check caller is owner/admin
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single();

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    return NextResponse.json({ error: 'Only owners and admins can invite members' }, { status: 403 });
  }

  // Enforce max_users
  const { data: team } = await supabase
    .from('teams')
    .select('max_users')
    .eq('id', teamId)
    .single();

  const { count: memberCount } = await supabase
    .from('team_members')
    .select('id', { count: 'exact', head: true })
    .eq('team_id', teamId);

  const { count: pendingCount } = await supabase
    .from('team_invites')
    .select('id', { count: 'exact', head: true })
    .eq('team_id', teamId)
    .is('accepted_at', null);

  const totalUsed = (memberCount ?? 0) + (pendingCount ?? 0);

  if (team?.max_users && totalUsed >= team.max_users) {
    return NextResponse.json(
      { error: `Team is at capacity (${team.max_users} users). Upgrade your plan or increase the limit.` },
      { status: 400 }
    );
  }

  // Create invite
  const { data: invite, error } = await supabase
    .from('team_invites')
    .insert({
      team_id: teamId,
      email: email.trim().toLowerCase(),
      role,
      invited_by: user.id,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'This email has already been invited' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: Send invitation email via Resend with invite.token link
  // For now, the invite token is returned so the frontend can show/copy the link

  return NextResponse.json(invite, { status: 201 });
}

// DELETE /api/teams/invite — revoke an invite
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { inviteId } = await request.json();

  const { error } = await supabase
    .from('team_invites')
    .delete()
    .eq('id', inviteId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
