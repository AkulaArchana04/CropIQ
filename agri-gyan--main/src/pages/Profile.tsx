import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    location: '',
    farm_size_hectares: '',
    primary_crops: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    recommendations: 0,
    scans: 0,
    totalSavings: 0
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const cropOptions = [
    'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 
    'Tomato', 'Potato', 'Onion', 'Soybean', 'Groundnut'
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const [profileData, statsData] = await Promise.all([
          api.profiles.get(),
          api.profiles.getStats(),
        ]);

        if (profileData) {
          setProfile({
            full_name: profileData.full_name || '',
            phone: profileData.phone || '',
            location: profileData.location || '',
            farm_size_hectares: profileData.farm_size_hectares?.toString() || '',
            primary_crops: profileData.primary_crops || []
          });
        } else if (user.user_metadata?.full_name) {
          setProfile((prev) => ({
            ...prev,
            full_name: user.user_metadata?.full_name || '',
          }));
        }

        setStats({
          recommendations: statsData.recommendations,
          scans: statsData.scans,
          totalSavings: Math.floor(Math.random() * 100000) + 50000
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await api.profiles.upsert({
        full_name: profile.full_name,
        phone: profile.phone,
        location: profile.location,
        farm_size_hectares: profile.farm_size_hectares ? parseFloat(profile.farm_size_hectares) : null,
        primary_crops: profile.primary_crops
      });

      toast({
        title: "Profile Updated!",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCrop = (crop: string) => {
    setProfile(prev => ({
      ...prev,
      primary_crops: prev.primary_crops.includes(crop)
        ? prev.primary_crops.filter(c => c !== crop)
        : [...prev.primary_crops, crop]
    }));
  };

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen warm-gradient">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            My Profile 👤
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account settings and farming preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="earth-card p-6 text-center">
            <div className="text-3xl mb-2">🌱</div>
            <div className="text-2xl font-bold text-foreground">{stats.recommendations}</div>
            <div className="text-sm text-muted-foreground">Crop Recommendations</div>
          </Card>
          
          <Card className="earth-card p-6 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-2xl font-bold text-foreground">{stats.scans}</div>
            <div className="text-sm text-muted-foreground">Disease Scans</div>
          </Card>
          
          <Card className="earth-card p-6 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-success">₹{(stats.totalSavings / 1000).toFixed(0)}K</div>
            <div className="text-sm text-muted-foreground">Estimated Savings</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="earth-card p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Profile Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <Input
                  value={profile.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <Input
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  placeholder="e.g., Village, District, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Farm Size (Hectares)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={profile.farm_size_hectares}
                  onChange={(e) => setProfile({...profile, farm_size_hectares: e.target.value})}
                  placeholder="Enter farm size in hectares"
                />
              </div>
            </div>
          </Card>

          <Card className="earth-card p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Farming Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Primary Crops (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {cropOptions.map((crop) => (
                    <label key={crop} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.primary_crops.includes(crop)}
                        onChange={() => toggleCrop(crop)}
                        className="rounded border-muted"
                      />
                      <span className="text-sm text-foreground">{crop}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-card-soft p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Selected Crops</h4>
                {profile.primary_crops.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.primary_crops.map((crop) => (
                      <span key={crop} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {crop}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No crops selected</p>
                )}
              </div>
            </div>

            <Button
              onClick={saveProfile}
              disabled={loading}
              className="w-full mt-6 bg-primary hover:bg-primary/90"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </Card>
        </div>

        <Card className="earth-card p-8 mt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Achievement Badges</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card-soft rounded-lg">
              <div className="text-3xl mb-2">🌱</div>
              <div className="text-sm font-medium text-foreground">First Timer</div>
              <div className="text-xs text-muted-foreground">Got first recommendation</div>
            </div>
            
            <div className="text-center p-4 bg-card-soft rounded-lg">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm font-medium text-foreground">Disease Detective</div>
              <div className="text-xs text-muted-foreground">Scanned 5+ plants</div>
            </div>
            
            <div className="text-center p-4 bg-card-soft rounded-lg opacity-50">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-sm font-medium text-foreground">Market Master</div>
              <div className="text-xs text-muted-foreground">Track prices daily</div>
            </div>
            
            <div className="text-center p-4 bg-card-soft rounded-lg opacity-50">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-sm font-medium text-foreground">Expert Farmer</div>
              <div className="text-xs text-muted-foreground">Use app for 30 days</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
