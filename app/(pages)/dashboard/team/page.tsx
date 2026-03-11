"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useSnackbar } from "@/app/components/Snackbar";
import {
  Users,
  Mail,
  Shield,
  Crown,
  UserPlus,
  Trash2,
  Copy,
  Clock,
  CheckCircle,
} from "lucide-react";

interface TeamMember {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  accepted_at: string | null;
  created_at: string;
  email?: string;
  name?: string;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  created_at: string;
}

interface Team {
  team_id: string;
  role: string;
  teams: {
    id: string;
    name: string;
    created_at: string;
  };
}

const roleIcons: Record<string, React.ReactNode> = {
  owner: <Crown size={14} className="text-amber-500" />,
  admin: <Shield size={14} className="text-blue-500" />,
  member: <Users size={14} className="text-gray-400" />,
};

const roleBadgeStyles: Record<string, string> = {
  owner: "bg-amber-100 text-amber-800",
  admin: "bg-blue-100 text-blue-800",
  member: "bg-gray-100 text-gray-600",
};

export default function TeamPage() {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamPlan, setNewTeamPlan] = useState("free");
  const [newTeamMaxUsers, setNewTeamMaxUsers] = useState("5");
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const fetchTeams = useCallback(async () => {
    const res = await fetch("/api/teams");
    if (res.ok) {
      const data = await res.json();
      setTeams(data);
      if (data.length > 0 && !currentTeamId) {
        setCurrentTeamId(data[0].team_id);
        setCurrentRole(data[0].role);
      }
    }
    setLoading(false);
  }, [currentTeamId]);

  const fetchMembers = useCallback(async () => {
    if (!currentTeamId) return;
    const res = await fetch(`/api/teams/members?teamId=${currentTeamId}`);
    if (res.ok) {
      const data = await res.json();
      setMembers(data);
    }
  }, [currentTeamId]);

  const fetchInvites = useCallback(async () => {
    if (!currentTeamId) return;
    const res = await fetch(`/api/teams/invite?teamId=${currentTeamId}`);
    if (res.ok) {
      const data = await res.json();
      setInvites(data);
    }
  }, [currentTeamId]);

  useEffect(() => {
    fetchTeams();
    // Get current user email
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setCurrentUserId(session.user.id);
    });
  }, [fetchTeams]);

  useEffect(() => {
    if (currentTeamId) {
      fetchMembers();
      fetchInvites();
    }
  }, [currentTeamId, fetchMembers, fetchInvites]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCreatingTeam(true);

    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newTeamName.trim(),
        plan: newTeamPlan,
        maxUsers: parseInt(newTeamMaxUsers) || 5,
      }),
    });

    if (res.ok) {
      const team = await res.json();
      showSnackbar("Team created!");
      setNewTeamName("");
      setNewTeamPlan("free");
      setNewTeamMaxUsers("5");
      setShowCreateTeam(false);
      setCurrentTeamId(team.id);
      await fetchTeams();
    } else {
      const err = await res.json();
      showSnackbar(err.error || "Failed to create team", "error");
    }
    setCreatingTeam(false);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !currentTeamId) return;
    setInviting(true);

    const res = await fetch("/api/teams/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: currentTeamId,
        email: inviteEmail.trim(),
        role: inviteRole,
      }),
    });

    if (res.ok) {
      showSnackbar(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
      fetchInvites();
    } else {
      const err = await res.json();
      showSnackbar(err.error || "Failed to send invite", "error");
    }
    setInviting(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    const res = await fetch("/api/teams/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId: currentTeamId, memberId }),
    });

    if (res.ok) {
      showSnackbar("Member removed");
      fetchMembers();
    } else {
      const err = await res.json();
      showSnackbar(err.error || "Failed to remove member", "error");
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    const res = await fetch("/api/teams/invite", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteId }),
    });

    if (res.ok) {
      showSnackbar("Invite revoked");
      fetchInvites();
    } else {
      showSnackbar("Failed to revoke invite", "error");
    }
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(link);
    showSnackbar("Invite link copied!");
  };

  const isAdmin = currentRole === "owner" || currentRole === "admin";
  const currentTeam = teams.find((t) => t.team_id === currentTeamId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  // No team yet — show create prompt
  if (teams.length === 0) {
    return (
      <motion.div
        className="max-w-lg mx-auto mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white rounded-lg shadow-lg text-center p-10">
          <div className="size-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="size-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Create Your Team
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Set up a team to collaborate with colleagues on loan portfolio
            management.
          </p>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Team Name
              </label>
              <input
                type="text"
                placeholder="e.g. Advisory Group"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Plan
                </label>
                <select
                  value={newTeamPlan}
                  onChange={(e) => setNewTeamPlan(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="team">Team</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Max Users
                </label>
                <input
                  type="number"
                  min="1"
                  value={newTeamMaxUsers}
                  onChange={(e) => setNewTeamMaxUsers(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={creatingTeam}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-navy-800 rounded-md hover:bg-navy-900 disabled:opacity-50 transition-all duration-200"
            >
              {creatingTeam ? "Creating..." : "Create Team"}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Team switcher + create */}
      {(teams.length > 1 || !showCreateTeam) && (
        <div className="flex items-center gap-2 flex-wrap">
          {teams.map((t) => (
            <button
              key={t.team_id}
              onClick={() => {
                setCurrentTeamId(t.team_id);
                setCurrentRole(t.role);
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                currentTeamId === t.team_id
                  ? "bg-navy-800 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {t.teams.name}
            </button>
          ))}
          <button
            onClick={() => setShowCreateTeam((v) => !v)}
            className="px-4 py-1.5 text-sm font-medium rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-navy-800 hover:text-navy-800 transition-all duration-200"
          >
            + New Team
          </button>
        </div>
      )}

      {/* Create team form (inline) */}
      {showCreateTeam && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Create New Team</h3>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Team Name
              </label>
              <input
                type="text"
                placeholder="e.g. Advisory Group"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Plan
                </label>
                <select
                  value={newTeamPlan}
                  onChange={(e) => setNewTeamPlan(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="team">Team</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Max Users
                </label>
                <input
                  type="number"
                  min="1"
                  value={newTeamMaxUsers}
                  onChange={(e) => setNewTeamMaxUsers(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowCreateTeam(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingTeam}
                className="px-4 py-2 text-sm font-medium text-white bg-navy-800 rounded-md hover:bg-navy-900 disabled:opacity-50 transition-all duration-200"
              >
                {creatingTeam ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Team header */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-blue-900 rounded-md flex items-center justify-center">
                <Users className="size-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-lg font-medium text-blue-900">
                  {currentTeam?.teams.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {members.length}{" "}
                  {members.length === 1 ? "member" : "members"}{" "}
                  {invites.length > 0 &&
                    `· ${invites.length} pending invite${invites.length > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${roleBadgeStyles[currentRole]}`}
            >
              {roleIcons[currentRole]}
              {currentRole}
            </span>
          </div>
        </div>

        {/* Sharing info */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 text-xs text-blue-800">
          All team members share access to companies and loans added by anyone
          in the team.
        </div>

        {/* Members list */}
        <div className="divide-y divide-gray-100">
          {members.map((member) => (
            <div
              key={member.id}
              className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 bg-navy-800 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {member.email?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {member.email || `User ${member.user_id.slice(0, 8)}`}
                    {member.user_id === currentUserId && " (you)"}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {roleIcons[member.role]}
                    <span className="text-xs text-gray-500 capitalize">
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
              {isAdmin && member.role !== "owner" && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pending invites */}
      {invites.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock size={14} />
              Pending Invites
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="px-6 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {invite.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {invite.role} · Expires{" "}
                      {new Date(invite.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyInviteLink(invite.token)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Copy invite link"
                  >
                    <Copy size={14} />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleRevokeInvite(invite.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Revoke invite"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite form — only for owners/admins */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <UserPlus size={14} />
              Invite Team Member
            </h3>
          </div>
          <form onSubmit={handleInvite} className="p-6">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                disabled={inviting}
                className="px-6 py-2 text-sm font-medium text-white bg-navy-800 rounded-md hover:bg-navy-900 disabled:opacity-50 transition-all duration-200"
              >
                {inviting ? "Sending..." : "Send Invite"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              They&apos;ll receive a link to join your team. The invite expires
              in 7 days.
            </p>
          </form>
        </div>
      )}
    </motion.div>
  );
}
