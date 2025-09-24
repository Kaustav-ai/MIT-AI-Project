import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Trophy, 
  Flame, 
  Play, 
  Target, 
  Calendar,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserRewards {
  total_points: number;
  current_streak: number;
  longest_streak: number;
  badges: string[];
}

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  bestCategory: string;
}

const QuizDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user rewards
      const { data: rewards } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (rewards) {
        setUserRewards({
          ...rewards,
          badges: Array.isArray(rewards.badges) ? rewards.badges as string[] : []
        });
      } else {
        // Create initial rewards record
        const { data: newRewards } = await supabase
          .from('user_rewards')
          .insert([{ user_id: user.id }])
          .select()
          .single();
        if (newRewards) {
          setUserRewards({
            ...newRewards,
            badges: Array.isArray(newRewards.badges) ? newRewards.badges as string[] : []
          });
        }
      }

      // Fetch quiz statistics
      const { data: sessions } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);

      if (sessions) {
        const totalQuizzes = sessions.length;
        const averageScore = sessions.length > 0 
          ? sessions.reduce((acc, session) => acc + (session.correct_answers / session.total_questions), 0) / sessions.length * 100
          : 0;
        
        // Find best category
        const categoryStats = sessions.reduce((acc, session) => {
          if (!acc[session.category]) {
            acc[session.category] = { total: 0, correct: 0 };
          }
          acc[session.category].total += session.total_questions;
          acc[session.category].correct += session.correct_answers;
          return acc;
        }, {} as Record<string, { total: number; correct: number }>);

        const bestCategory = Object.entries(categoryStats)
          .map(([category, stats]) => ({
            category,
            percentage: (stats.correct / stats.total) * 100
          }))
          .sort((a, b) => b.percentage - a.percentage)[0]?.category || 'General Health';

        setQuizStats({ totalQuizzes, averageScore, bestCategory });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your progress data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const quizCategories = [
    { 
      name: 'General Health', 
      icon: Target, 
      color: 'primary',
      description: 'Basic health knowledge and wellness tips',
      difficulty: 'Easy'
    },
    { 
      name: 'Nutrition', 
      icon: Star, 
      color: 'secondary',
      description: 'Food, vitamins, and dietary guidelines',
      difficulty: 'Medium'
    },
    { 
      name: 'Exercise', 
      icon: Zap, 
      color: 'accent',
      description: 'Fitness, workouts, and physical activity',
      difficulty: 'Easy'
    },
    { 
      name: 'Mental Health', 
      icon: Brain, 
      color: 'info',
      description: 'Mental wellness and stress management',
      difficulty: 'Medium'
    }
  ];

  const achievements = [
    { name: 'First Steps', icon: '🎯', earned: userRewards?.badges?.includes('first_steps') },
    { name: 'Quiz Master', icon: '🏆', earned: userRewards?.badges?.includes('quiz_master') },
    { name: 'Perfect Score', icon: '⭐', earned: userRewards?.badges?.includes('perfect_score') },
    { name: 'Streak Champion', icon: '🔥', earned: userRewards?.badges?.includes('streak_champion') }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen quiz-gradient p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="primary-gradient p-3 rounded-2xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Health Quiz Challenge</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Test your health knowledge, earn points, and unlock achievements!
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="quiz-card card-hover">
              <CardContent className="p-6 text-center">
                <div className="reward-gradient p-3 rounded-full w-fit mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">{userRewards?.total_points || 0}</h3>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </CardContent>
            </Card>

            <Card className="quiz-card card-hover">
              <CardContent className="p-6 text-center">
                <div className="gold-gradient p-3 rounded-full w-fit mx-auto mb-4">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">{userRewards?.current_streak || 0}</h3>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </CardContent>
            </Card>

            <Card className="quiz-card card-hover">
              <CardContent className="p-6 text-center">
                <div className="secondary-gradient p-3 rounded-full w-fit mx-auto mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">{quizStats?.totalQuizzes || 0}</h3>
                <p className="text-sm text-muted-foreground">Quizzes Completed</p>
              </CardContent>
            </Card>

            <Card className="quiz-card card-hover">
              <CardContent className="p-6 text-center">
                <div className="primary-gradient p-3 rounded-full w-fit mx-auto mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">
                  {quizStats?.averageScore ? Math.round(quizStats.averageScore) : 0}%
                </h3>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Challenge */}
          <Card className="quiz-card border-2 border-primary/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="gold-gradient p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Daily Challenge</CardTitle>
                  <CardDescription>Complete today's quiz for bonus points!</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">5 questions • 2 minutes</span>
                </div>
                <Badge variant="secondary" className="achievement-badge bg-gold text-gold-foreground border-gold">
                  +50 Bonus Points
                </Badge>
              </div>
              <Link to="/quiz/daily">
                <Button className="w-full quiz-hover" size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Start Daily Challenge
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quiz Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground text-center">Choose Your Challenge</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quizCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.name} className="quiz-card quiz-hover">
                    <CardHeader className="text-center">
                      <div className={`${category.color === 'primary' ? 'primary-gradient' : 
                                        category.color === 'secondary' ? 'secondary-gradient' : 
                                        category.color === 'accent' ? 'bg-accent' : 
                                        'bg-info'} p-4 rounded-2xl w-fit mx-auto mb-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge variant="outline" className="w-fit mx-auto">
                        {category.difficulty}
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <Link to={`/quiz/category/${category.name.toLowerCase().replace(' ', '-')}`}>
                        <Button variant="outline" className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Start Quiz
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <Card className="quiz-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Trophy className="h-6 w-6 text-primary" />
                <span>Your Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.name}
                    className={`achievement-badge ${achievement.earned 
                      ? 'bg-gold border-gold text-gold-foreground' 
                      : 'bg-muted/50 border-muted text-muted-foreground'
                    } text-center p-4 rounded-xl`}
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <p className="font-medium text-sm">{achievement.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
};

export default QuizDashboard;