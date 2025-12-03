export interface Delegate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: Date;
  reward?: number;
}

