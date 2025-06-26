# Supabase Setup Guide

This guide will help you connect your Hyrizona mobile app to Supabase for user authentication and data storage.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Your Supabase project URL and anon key

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `hyrizona-app` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the region closest to your users
5. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon public key
3. Update the `services/supabase.ts` file:

```typescript
const supabaseUrl = 'YOUR_PROJECT_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

## Step 3: Create Database Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('seeker', 'poster')),
  location TEXT,
  avatar TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, email, user_type)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.raw_user_meta_data->>'user_type'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Step 4: Update User Context

Replace the mock authentication in `contexts/UserContext.tsx` with real Supabase calls:

```typescript
// In UserContext.tsx, replace the login function:
const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    setIsLoading(true);
    const result = await authService.login(email, password);
    
    if (result.success && result.user) {
      setUser(result.user);
      await saveUserToStorage(result.user);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    return { success: false, error: 'Login failed. Please try again.' };
  } finally {
    setIsLoading(false);
  }
};

// Replace the register function:
const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
  try {
    setIsLoading(true);
    const result = await authService.register(userData);
    
    if (result.success && result.user) {
      setUser(result.user);
      await saveUserToStorage(result.user);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    return { success: false, error: 'Registration failed. Please try again.' };
  } finally {
    setIsLoading(false);
  }
};

// Replace the logout function:
const logout = async () => {
  try {
    await authService.logout();
    await AsyncStorage.removeItem('user');
    setUser(null);
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Test user registration with a valid email and strong password
3. Test user login with the created credentials
4. Verify that user data appears in the profile section
5. Test logout functionality

## Step 6: Environment Variables (Optional)

For better security, you can use environment variables:

1. Create a `.env` file in your project root:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Update `services/supabase.ts`:
```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
```

## Features Implemented

✅ **Strong Password Policy**: Passwords must contain:
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

✅ **Email Validation**: Proper email format validation using regex

✅ **Real-time Validation**: Form validation with error messages

✅ **Password Strength Indicator**: Visual indicator showing password strength

✅ **User Context**: Global state management for user data

✅ **Profile Integration**: User details displayed in profile section

✅ **Logout Functionality**: Secure logout with confirmation

✅ **Supabase Ready**: Complete Supabase integration setup

## Next Steps

1. Add email verification functionality
2. Implement password reset
3. Add social authentication (Google, Apple)
4. Add profile image upload
5. Implement user settings and preferences
6. Add job posting and application functionality

## Troubleshooting

- **Authentication errors**: Check your Supabase URL and anon key
- **Database errors**: Verify that the profiles table was created correctly
- **RLS errors**: Ensure Row Level Security policies are properly configured
- **Network errors**: Check your internet connection and Supabase project status 