import { Team } from './Team';

export interface TeamMember {
  team: Team;
  isDelegate: boolean;
  isApproved: boolean;
  isLeader: boolean;
}

