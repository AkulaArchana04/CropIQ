import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { api, Profile, CropRecommendation, DiseaseDetection } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentRecommendations, setRecentRecommendations] = useState<CropRecommendation[]>([]);
  const [recentDetections, setRecentDetections] = useState<DiseaseDetection[]>([]);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const [profileData, recommendations, detections] = await Promise.all([
          api.profiles.get(),
          api.recommendations.list(),
          api.diseaseDetections.list(3),
        ]);

        setProfile(profileData);
        setRecentRecommendations(recommendations.slice(0, 3));
        setRecentDetections(detections);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  const quickActions = [
    { title: t('dashboard.getRecs'), description: t('crop.subtitle'), icon: '🌱', link: '/recommendations', color: 'primary' },
    { title: t('dashboard.scanDisease'), description: t('disease.uploadPlant'), icon: '🔍', link: '/disease-scanner', color: 'accent' },
    { title: t('dashboard.marketInsights'), description: t('market.title'), icon: '📈', link: '/market', color: 'cta' },
    { title: t('dashboard.weather'), description: t('weather.currentWeather'), icon: '🌤️', link: '/weather', color: 'success' },
  ];

  const farmingTips = [
    {
      title: 'Optimal Planting Time',
      tip: 'Plant your Kharif crops after the first good monsoon shower for better germination rates.',
      icon: '⏰'
    },
    {
      title: 'Soil Health Check',
      tip: 'Test your soil pH every 6 months. Most crops thrive in slightly acidic to neutral pH (6.0-7.0).',
      icon: '🧪'
    },
    {
      title: 'Water Management',
      tip: 'Use drip irrigation to save water and ensure consistent moisture levels for your crops.',
      icon: '💧'
    }
  ];

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen warm-gradient">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('dashboard.welcome')}, {profile?.full_name || user.user_metadata?.full_name || 'Farmer'}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="earth-card p-6 text-center">
            <div className="text-3xl mb-2">🌾</div>
            <div className="text-2xl font-bold text-foreground">{recentRecommendations.length}</div>
            <div className="text-sm text-muted-foreground">{t('dashboard.cropRec')}</div>
          </Card>
          
          <Card className="earth-card p-6 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-2xl font-bold text-foreground">{recentDetections.length}</div>
            <div className="text-sm text-muted-foreground">{t('dashboard.diseaseScans')}</div>
          </Card>
          
          <Card className="earth-card p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-success">87%</div>
            <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
          </Card>
          
          <Card className="earth-card p-6 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-cta">₹2.5L</div>
            <div className="text-sm text-muted-foreground">Estimated Savings</div>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="earth-card p-6 hover-glow transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="text-4xl mb-4">{action.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <Button className={`w-full bg-${action.color}`} size="sm">
                    {t('dashboard.getStarted')}
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">{t('dashboard.recentActivity')}</h2>
            <div className="space-y-4">
              {recentRecommendations.length > 0 ? (
                recentRecommendations.map((rec, index) => (
                  <Card key={index} className="earth-card p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🌱</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Crop Recommendation</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(rec.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="earth-card p-6 text-center">
                  <div className="text-4xl mb-4">🌱</div>
                  <p className="text-muted-foreground">No recent activity. Start by getting crop recommendations!</p>
                  <Link to="/recommendations">
                    <Button className="mt-4 bg-primary">Get Started</Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">{t('dashboard.farmingTips')}</h2>
            <div className="space-y-4">
              {farmingTips.map((tip, index) => (
                <Card key={index} className="earth-card p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{tip.icon}</div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip.tip}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
