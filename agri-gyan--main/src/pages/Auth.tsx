import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUp, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        toast({
          title: "Account created!",
          description: "Welcome to AgriAI. You're now signed in.",
        });
        navigate('/dashboard');
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You've been successfully signed in.",
        });
        navigate('/dashboard');
      }
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

  return (
    <div className="min-h-screen earth-gradient flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8 earth-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">🌾</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isSignUp ? 'Join AgriAI' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp 
              ? 'Start your smart farming journey today' 
              : 'Sign in to your farming dashboard'
            }
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-earth text-center">
          <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🌱</span>
              <span>Smart Recommendations</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🔍</span>
              <span>Disease Detection</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">📈</span>
              <span>Market Insights</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
