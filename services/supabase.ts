import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../contexts/UserContext';

// TODO: Replace with your actual Supabase URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// User authentication functions
export const authService = {
  // Register a new user
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: 'seeker' | 'poster';
  }): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            user_type: userData.userType,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create user profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              first_name: userData.firstName,
              last_name: userData.lastName,
              email: userData.email,
              user_type: userData.userType,
              is_verified: false,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        const user: User = {
          id: data.user.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          userType: userData.userType,
          location: 'Unknown',
          isVerified: false,
          createdAt: new Date().toISOString(),
          skills: []
        };

        return { success: true, user };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  // Login user
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return { success: false, error: 'Error fetching user profile' };
        }

        const user: User = {
          id: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          userType: profile.user_type,
          location: profile.location,
          avatar: profile.avatar,
          isVerified: profile.is_verified,
          createdAt: profile.created_at,
          skills: profile.skills || []
        };

        return { success: true, user };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  // Logout user
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return { success: false, error: 'No authenticated user' };
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return { success: false, error: 'Error fetching user profile' };
      }

      const userData: User = {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        userType: profile.user_type,
        location: profile.location,
        avatar: profile.avatar,
        isVerified: profile.is_verified,
        createdAt: profile.created_at,
        skills: profile.skills || []
      };

      return { success: true, user: userData };
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {};
      
      if (updates.firstName) updateData.first_name = updates.firstName;
      if (updates.lastName) updateData.last_name = updates.lastName;
      if (updates.location) updateData.location = updates.location;
      if (updates.avatar) updateData.avatar = updates.avatar;
      if (updates.userType) updateData.user_type = updates.userType;
      if (updates.skills) updateData.skills = updates.skills;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },
};

// Database table types (for TypeScript)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          user_type: 'seeker' | 'poster';
          location?: string;
          avatar?: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
          skills?: string[];
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          user_type: 'seeker' | 'poster';
          location?: string;
          avatar?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          skills?: string[];
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          user_type?: 'seeker' | 'poster';
          location?: string;
          avatar?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          skills?: string[];
        };
      };
    };
  };
} 