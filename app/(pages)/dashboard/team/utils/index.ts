export interface TeamMember {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  accepted_at: string | null;
  created_at: string;
  email?: string;
  name?: string;
}

export interface Invite {
  id: string;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface Team {
  team_id: string;
  role: string;
  teams: {
    id: string;
    name: string;
    created_at: string;
  };
}

export interface TeamState {
  loading: boolean;
  teams: Team[];
  members: TeamMember[];
  invites: Invite[];
  currentTeamId: string | null;
  currentRole: string;
  currentUserId: string;
  inviteEmail: string;
  inviteRole: string;
  inviting: boolean;
  showCreateTeam: boolean;
  newTeamName: string;
  newTeamPlan: string;
  newTeamMaxUsers: string;
  creatingTeam: boolean;
}

export type TeamAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TEAMS"; payload: Team[] }
  | { type: "SET_MEMBERS"; payload: TeamMember[] }
  | { type: "SET_INVITES"; payload: Invite[] }
  | { type: "SET_CURRENT_TEAM"; payload: { teamId: string; role: string } }
  | { type: "SET_CURRENT_USER_ID"; payload: string }
  | { type: "SET_INVITE_EMAIL"; payload: string }
  | { type: "SET_INVITE_ROLE"; payload: string }
  | { type: "SET_INVITING"; payload: boolean }
  | { type: "TOGGLE_CREATE_TEAM" }
  | { type: "SET_NEW_TEAM_NAME"; payload: string }
  | { type: "SET_NEW_TEAM_PLAN"; payload: string }
  | { type: "SET_NEW_TEAM_MAX_USERS"; payload: string }
  | { type: "SET_CREATING_TEAM"; payload: boolean }
  | { type: "RESET_CREATE_FORM" }
  | { type: "RESET_INVITE_FORM" };

export const initialTeamState: TeamState = {
  loading: true,
  teams: [],
  members: [],
  invites: [],
  currentTeamId: null,
  currentRole: "",
  currentUserId: "",
  inviteEmail: "",
  inviteRole: "member",
  inviting: false,
  showCreateTeam: false,
  newTeamName: "",
  newTeamPlan: "free",
  newTeamMaxUsers: "5",
  creatingTeam: false,
};

export function teamReducer(state: TeamState, action: TeamAction): TeamState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_TEAMS":
      return { ...state, teams: action.payload };
    case "SET_MEMBERS":
      return { ...state, members: action.payload };
    case "SET_INVITES":
      return { ...state, invites: action.payload };
    case "SET_CURRENT_TEAM":
      return { ...state, currentTeamId: action.payload.teamId, currentRole: action.payload.role };
    case "SET_CURRENT_USER_ID":
      return { ...state, currentUserId: action.payload };
    case "SET_INVITE_EMAIL":
      return { ...state, inviteEmail: action.payload };
    case "SET_INVITE_ROLE":
      return { ...state, inviteRole: action.payload };
    case "SET_INVITING":
      return { ...state, inviting: action.payload };
    case "TOGGLE_CREATE_TEAM":
      return { ...state, showCreateTeam: !state.showCreateTeam };
    case "SET_NEW_TEAM_NAME":
      return { ...state, newTeamName: action.payload };
    case "SET_NEW_TEAM_PLAN":
      return { ...state, newTeamPlan: action.payload };
    case "SET_NEW_TEAM_MAX_USERS":
      return { ...state, newTeamMaxUsers: action.payload };
    case "SET_CREATING_TEAM":
      return { ...state, creatingTeam: action.payload };
    case "RESET_CREATE_FORM":
      return {
        ...state,
        newTeamName: "",
        newTeamPlan: "free",
        newTeamMaxUsers: "5",
        showCreateTeam: false,
        creatingTeam: false,
      };
    case "RESET_INVITE_FORM":
      return { ...state, inviteEmail: "", inviting: false };
    default:
      return state;
  }
}


