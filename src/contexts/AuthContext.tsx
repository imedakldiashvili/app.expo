import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers, MockUser, Location, Team, TeamMember, VerificationData } from '../api/mockData';

interface User {
  id: string;
  email: string;
  name: string;       // username / short name
  userName: string;
  mobileNumber: string;
  isVerified: boolean;
  skipVerified?: boolean; // true if user skipped verification
  fullName?: string | null; // optional full name from auth (nullable)
  person: {
    personalId: string;
    fullName: string;
  } | null; // null if isVerified = false
  image?: string | null; // Optional avatar image
  teamMember: TeamMember; // Required team
  location: Location; // Required location
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginWithPasscode: () => Promise<boolean>;
  updateUserTeam: (team: TeamMember) => Promise<void>;
  verifyUser: (verificationData?: VerificationData) => Promise<boolean>;
  skipVerification: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check stored auth data
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser: any = JSON.parse(storedUser);
          console.log('checkAuthStatus - parsed user:', parsedUser);
          
          // If user has old format (teamId instead of team), find team from mockUsers
          if (parsedUser.teamId && !parsedUser.teamMember) {
            const foundUser = mockUsers.find(u => u.id === parsedUser.id);
            if (foundUser) {
              parsedUser.teamMember = foundUser.teamMember;
              parsedUser.location = foundUser.location;
              delete parsedUser.teamId;
            }
          }
          
          if (!parsedUser.location) {
            parsedUser.location = { id: 0, name: 'ლოკაციის გარეშე' };
          }
          
          const user: User = parsedUser as User;
          setUser(user);
        } catch (parseError) {
          console.error('Failed to parse stored user:', parseError);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data by email and password
      const foundUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        const user: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.userName,
          userName: foundUser.userName,
          mobileNumber: foundUser.mobileNumber,
          isVerified: foundUser.isVerified,
          fullName: foundUser.person?.fullName || foundUser.userName,
          person: foundUser.person,
          image: foundUser.image || null,
          teamMember: foundUser.teamMember,
          location: foundUser.location,
        };
        
        // Debug: Log user data being saved
        console.log('Login - Saving user data:', {
          isVerified: user.isVerified,
          hasPerson: !!user.person,
          personalId: user.person?.personalId,
          fullUser: user,
        });
        
        setUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('user_id', user.id);
        await AsyncStorage.setItem('user_email', user.email);
        
        // Verify what was saved
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          console.log('Login - Verified saved user:', {
            isVerified: parsed.isVerified,
            hasPerson: !!parsed.person,
            personalId: parsed.person?.personalId,
          });
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        // User already exists, return false
        return false;
      }
      
      // Create new user (in real app, this would be done on backend)
      if (email && password && name) {
        const newUserId = String(mockUsers.length + 1);
        const newUser: User = {
          id: newUserId,
          email,
          name,
          userName: name.toLowerCase().replace(/\s/g, ''),
          mobileNumber: '', // Will be set during registration flow
          isVerified: false,
          fullName: name,
          person: null, // null because isVerified = false
          image: null,
          teamMember: {
            team: { id: 1, name: 'გუნდის გარეშე', number: 0, logo: 'https://picsum.photos/seed/nogroup/200/200', type: 'ngo', isMember: false, memberCount: 0 },
            isDelegate: false,
            isApproved: false,
            isLeader: false,
          },
          location: { id: 0, name: 'ლოკაციის გარეშე' },
        };
        
        // Add user to mockUsers array so login() can find it
        const newMockUser = {
          id: newUserId,
          userName: newUser.userName,
          email,
          mobileNumber: '',
          isVerified: false,
          person: null,
          password, // Store password for login
          image: undefined,
          teamMember: newUser.teamMember,
          location: newUser.location,
        };
        mockUsers.push(newMockUser);
        
        setUser(newUser);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        await AsyncStorage.setItem('user_id', newUser.id);
        await AsyncStorage.setItem('user_email', newUser.email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPasscode = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get user info from AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      const storedUserId = await AsyncStorage.getItem('user_id');
      const storedUserEmail = await AsyncStorage.getItem('user_email');
      
      if (storedUser) {
        // Try to parse stored user
        try {
          const parsedUser: any = JSON.parse(storedUser);
          console.log('loginWithPasscode - parsed user:', parsedUser);
          
          // If user has old format (teamId instead of team), find team from mockUsers
          if (parsedUser.teamId && !parsedUser.teamMember) {
            const foundUser = mockUsers.find(u => u.id === parsedUser.id);
            if (foundUser) {
              parsedUser.teamMember = foundUser.teamMember;
              parsedUser.location = foundUser.location;
              delete parsedUser.teamId;
            }
          }
          
          if (!parsedUser.location) {
            parsedUser.location = { id: 0, name: 'ლოკაციის გარეშე' };
          }
          
          const user: User = parsedUser as User;
          setUser(user);
          return true;
        } catch (parseError) {
          console.error('Failed to parse stored user:', parseError);
        }
      }
      
      // Fallback: find user by email in mock data
      if (storedUserEmail) {
        const foundUser = mockUsers.find(
          (u) => u.email.toLowerCase() === storedUserEmail.toLowerCase()
        );
        
        if (foundUser) {
          const user: User = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.userName,
            userName: foundUser.userName,
            mobileNumber: foundUser.mobileNumber,
            isVerified: foundUser.isVerified,
            fullName: foundUser.person?.fullName || foundUser.userName,
          person: foundUser.person,
          image: foundUser.image || null,
          teamMember: foundUser.teamMember,
          location: foundUser.location,
          };
          
          setUser(user);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Passcode login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      // Clear only user data, keep passcode and user info
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserTeam = async (team: TeamMember) => {
    try {
      if (user) {
        const updatedUser = {
          ...user,
          teamMember: team,
        };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update user team failed:', error);
    }
  };

  const verifyUser = async (verificationData?: VerificationData): Promise<boolean> => {
    try {
      if (!user) return false;

      // If verification data is provided, use it
      if (verificationData) {
        const verifiedUser: User = {
          ...user,
          isVerified: true,
          person: {
            personalId: verificationData.personalId,
            fullName: verificationData.fullName,
          },
          fullName: verificationData.fullName,
        };
        
        setUser(verifiedUser);
        await AsyncStorage.setItem('user', JSON.stringify(verifiedUser));
        return true;
      }

      // Find user in mockUsers to get verified data
      const foundUser = mockUsers.find(u => u.id === user.id);
      
      if (foundUser && foundUser.isVerified && foundUser.person) {
        // Update user with verified data
        const verifiedUser: User = {
          ...user,
          isVerified: true,
          person: foundUser.person,
          fullName: foundUser.person.fullName,
        };
        
        setUser(verifiedUser);
        await AsyncStorage.setItem('user', JSON.stringify(verifiedUser));
        return true;
      }
      
      // If user not found in mockUsers or not verified, create mock verification
      // In real app, this would be an API call
      const verifiedUser: User = {
        ...user,
        isVerified: true,
        person: {
          personalId: '12345678901',
          fullName: user.fullName || user.name,
        },
        fullName: user.fullName || user.name,
      };
      
      setUser(verifiedUser);
      await AsyncStorage.setItem('user', JSON.stringify(verifiedUser));
      return true;
    } catch (error) {
      console.error('Verification failed:', error);
      return false;
    }
  };

  const skipVerification = async (): Promise<boolean> => {
    try {
      if (!user) return false;

      // Mark user as skipped verification (but not verified)
      const skippedUser: User = {
        ...user,
        skipVerified: true,
        // isVerified remains false
        // person remains null
      };
      
      setUser(skippedUser);
      await AsyncStorage.setItem('user', JSON.stringify(skippedUser));
      return true;
    } catch (error) {
      console.error('Skip verification failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loginWithPasscode,
    updateUserTeam,
    verifyUser,
    skipVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
