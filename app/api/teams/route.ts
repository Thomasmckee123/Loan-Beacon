import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/teams — get the current user's team(s)
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: memberships, error } = await supabase
    .from('team_members')
    .select('team_id, role, teams(id, name, created_at)')
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(memberships);
}

// POST /api/teams — create a new team
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, plan = 'free', maxUsers = 5 } = await request.json();
  if (!name?.trim()) return NextResponse.json({ error: 'Team name is required' }, { status: 400 });

  // Create team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({ name: name.trim(), plan, max_users: maxUsers })
    .select()
    .single();

  if (teamError) return NextResponse.json({ error: teamError.message }, { status: 500 });

  // Add creator as owner
  const { error: memberError } = await supabase
    .from('team_members')
    .insert({
      team_id: team.id,
      user_id: user.id,
      role: 'owner',
    });

  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });

  return NextResponse.json(team, { status: 201 });
}
