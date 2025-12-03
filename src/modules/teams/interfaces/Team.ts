export interface Team {
  id: number;
  name: string;
  logo?: string;
  number?: number;
  type: 'party' | 'movement' | 'ngo';
  isMember?: boolean;
  memberCount?: number;
}

