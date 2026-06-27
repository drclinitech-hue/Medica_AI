import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-destructive">Failed to load profile.</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Personal Information</h3>
            <p className="text-sm text-muted-foreground">Your account details and demographic information.</p>
          </div>
          <div className="p-6 pt-0 grid gap-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Name</span>
              <span>{profile.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Email</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Role</span>
              <span className="capitalize">{profile.role}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Age</span>
              <span>{profile.age || 'Not provided'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Gender</span>
              <span>{profile.gender || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
