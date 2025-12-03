export interface Invitation {
  id: number;
  fromUser: {
    id: string;
    name: string;
    photo?: string | null;
    mobileNumber?: string;
    team?: {
      id: number;
      name: string;
      logo?: string;
    };
  };
  team: {
    id: number;
    name: string;
    logo?: string;
    type: 'party' | 'movement' | 'ngo';
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  expiryDate?: string;
  message?: string;
}

