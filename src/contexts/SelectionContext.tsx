import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface SelectedBallotItem {
  id: number;
  ballotId: number;
  name: string;
  description: string;
  isNewSelection?: boolean;
  listItems?: {
    id: number;
    number: number;
    name: string;
    title: string;
    image: string;
    position: number;
  }[];
}

interface SelectionContextType {
  location: string | null;
  joinedTeamIds: number[];
  selectedBallotItem: SelectedBallotItem | null;
  selectedBallotItemsByBallotId: Record<number, SelectedBallotItem>;
  setSelectedBallotItemsByBallotId: (updater: (prev: Record<number, SelectedBallotItem>) => Record<number, SelectedBallotItem>) => void;
  setLocation: (location: string | null) => void;
  setJoinedTeamIds: (ids: number[]) => void;
  addJoinedTeam: (id: number) => void;
  removeJoinedTeam: (id: number) => void;
  setSelectedBallotItem: (item: SelectedBallotItem | null, isNewSelection?: boolean) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

interface SelectionProviderProps {
  children: ReactNode;
}

export function SelectionProvider({ children }: SelectionProviderProps) {
  const { user } = useAuth();
  // Default location: "ლოკაციის გარეშე"
  const [location, setLocation] = useState<string | null>('ლოკაციის გარეშე');
  // Default joined team: "გუნდის გარეშე" (id: 1)
  const [joinedTeamIds, setJoinedTeamIds] = useState<number[]>([1]);
  const [selectedBallotItem, _setSelectedBallotItem] = useState<SelectedBallotItem | null>(null);
  const [selectedBallotItemsByBallotId, setSelectedBallotItemsByBallotId] = useState<
    Record<number, SelectedBallotItem>
  >({});

  // Sync user location with location when user logs in or location changes
  useEffect(() => {
    if (user) {
      setLocation(user.location.name);
    } else {
      setLocation('ლოკაციის გარეშე');
    }
  }, [user?.location.name, user]);

  // Sync user team with joinedTeamIds when user logs in or team changes
  useEffect(() => {
    if (user) {
      const teamId = user.teamMember.team.id;
      setJoinedTeamIds(prev => {
        if (!prev.includes(teamId)) {
          return [teamId, ...prev.filter(id => id !== 1)];
        }
        if (prev[0] !== teamId) {
          return [teamId, ...prev.filter(id => id !== teamId && id !== 1)];
        }
        return prev.filter(id => id !== 1 || prev.length === 1);
      });
    } else {
      setJoinedTeamIds([1]);
    }
  }, [user?.teamMember.team.id, user]);

  const setSelectedBallotItem = (item: SelectedBallotItem | null, isNewSelection: boolean = false) => {
    _setSelectedBallotItem(item);
    if (item) {
      setSelectedBallotItemsByBallotId((prev) => ({
        ...prev,
        [item.ballotId]: {
          ...item,
          isNewSelection,
        },
      }));
    }
  };

  const addJoinedTeam = (id: number) => {
    setJoinedTeamIds(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const removeJoinedTeam = (id: number) => {
    setJoinedTeamIds(prev => prev.filter(teamId => teamId !== id));
  };

  const value: SelectionContextType = {
    location,
    joinedTeamIds,
    selectedBallotItem,
    selectedBallotItemsByBallotId,
    setSelectedBallotItemsByBallotId,
    setLocation,
    setJoinedTeamIds,
    addJoinedTeam,
    removeJoinedTeam,
    setSelectedBallotItem,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}

