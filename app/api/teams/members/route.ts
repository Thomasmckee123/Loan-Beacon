import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/teams/members?teamId=xxx — get members of a team
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');
  if (!teamId) return NextResponse.json({ error: 'teamId is required' }, { status: 400 });

  // Verify user is a member of this team
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single();

  if (!membership) return NextResponse.json({ error: 'Not a member of this team' }, { status: 403 });

  // Get all members with their auth user info
  const { data: members, error } = await supabase
    .from('team_members')
    .select('id, user_id, role, accepted_at, created_at')
    .eq('team_id', teamId)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch user metadata for each member from auth
  const enrichedMembers = await Promise.all(
    members.map(async (member) => {
      // Use a raw query to get user email from auth.users via RPC or just return the id
      // Since we can't query auth.users from client, we'll use the admin approach in a different way
      // For now, return what we have — the frontend can match with cached data
      return member;
    })
  );

  return NextResponse.json(enrichedMembers);
}

// DELETE /api/teams/members — remove a member from team
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { teamId, memberId } = await request.json();

  // Check caller is owner/admin
  const { data: callerMembership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single();

  if (!callerMembership || !['owner', 'admin'].includes(callerMembership.role)) {
    return NextResponse.json({ error: 'Only owners and admins can remove members' }, { status: 403 });
  }

  // Don't allow removing the owner
  const { data: targetMember } = await supabase
    .from('team_members')
    .select('role')
    .eq('id', memberId)
    .single();

  if (targetMember?.role === 'owner') {
    return NextResponse.json({ error: 'Cannot remove the team owner' }, { status: 400 });
  }

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
