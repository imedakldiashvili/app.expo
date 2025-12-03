import { mockTeams, mockActiveElections, mockLocations, mockUsers, MockUser, mockBankAccounts, BankAccount } from './mockData';
import { Team } from '../modules/teams';

// Services: simple sync "API" over mock data

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export function getMockTeams(page: number = 1, pageSize: number = 10): PaginatedResponse<Team> {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = mockTeams.slice(startIndex, endIndex);
  
  // Calculate memberCount from mockUsers for each team
  const teamsWithMemberCount = paginatedData.map(team => {
    const memberCount = mockUsers.filter(user => user.teamMember.team.id === team.id).length;
    return {
      ...team,
      memberCount,
    };
  });
  
  return {
    data: teamsWithMemberCount,
    page,
    pageSize,
    total: mockTeams.length,
    hasMore: endIndex < mockTeams.length,
  };
}

// Legacy function for backward compatibility
export function getAllMockTeams(): Team[] {
  // Calculate memberCount from mockUsers for each team
  return mockTeams.map(team => {
    const memberCount = mockUsers.filter(user => user.teamMember.team.id === team.id).length;
    return {
      ...team,
      memberCount,
    };
  });
}

export function getActiveElections() {
  return mockActiveElections;
}

export function getDelegates(currentUserId: string): MockUser[] {
  return mockUsers.filter(user => user.referalId === currentUserId);
}

export { mockLocations, mockUsers, mockBankAccounts, BankAccount, verification } from './mockData';


