import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Trophy, 
  Gift, 
  History, 
  Coins, 
  Crown,
  Zap,
  Star,
  Medal,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface UserRewards {
  total_points: number;
  lifetime_points: number;
  current_streak: number;
  longest_streak: number;
  badges: string[];
}

interface Transaction {
  id: string;
  points_change: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  rank: number;
  badges: string[];
}

const RewardsWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRewardsData();
    }
  }, [user]);

  const fetchRewardsData = async () => {
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
      }

      // Fetch transactions
      const { data: transactionData } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionData) {
        setTransactions(transactionData);
      }

      // Fetch leaderboard (top 10 users)
      const { data: leaderboardData } = await supabase
        .from('user_rewards')
        .select('user_id, total_points, badges')
        .order('total_points', { ascending: false })
        .limit(10);

      if (leaderboardData) {
        const leaderboardWithRanks = leaderboardData.map((entry, index) => ({
          ...entry,
          rank: index + 1,
          badges: Array.isArray(entry.badges) ? entry.badges as string[] : []
        }));
        setLeaderboard(leaderboardWithRanks);
      }
    } catch (error) {
      console.error('Error fetching rewards data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load rewards data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const redeemPoints = async (points: number, description: string) => {
    try {
      // Create redemption transaction
      await supabase
        .from('point_transactions')
        .insert([{
          user_id: user.id,
          points_change: -points,
          transaction_type: 'redeemed',
          description
        }]);

      // Update user points
      await supabase
        .from('user_rewards')
        .update({ 
          total_points: Math.max(0, (userRewards?.total_points || 0) - points)
        })
        .eq('user_id', user.id);

      toast({
        title: 'Points Redeemed!',
        description: `You've successfully redeemed ${points} points for ${description}.`,
      });

      // Refresh data
      fetchRewardsData();
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast({
        title: 'Redemption Failed',
        description: 'Failed to redeem points. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const rewards = [
    {
      id: 'consultation_10',
      title: '₹10 off Doctor Consultation',
      points: 100,
      icon: Gift,
      description: 'Apply ₹10 discount on your next consultation',
      color: 'primary'
    },
    {
      id: 'consultation_25',
      title: '₹25 off Doctor Consultation', 
      points: 250,
      icon: Medal,
      description: 'Apply ₹25 discount on your next consultation',
      color: 'secondary'
    },
    {
      id: 'consultation_50',
      title: '₹50 off Doctor Consultation',
      points: 500,
      icon: Crown,
      description: 'Apply ₹50 discount on your next consultation',
      color: 'gold'
    }
  ];

  const getUserRank = () => {
    const userEntry = leaderboard.find(entry => entry.user_id === user?.id);
    return userEntry?.rank || 'Unranked';
  };

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
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="reward-gradient p-3 rounded-2xl">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Rewards Wallet</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Your points, achievements, and exclusive rewards
            </p>
          </div>

          {/* Wallet Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="reward-card card-hover">
              <CardContent className="p-6 text-center">
                <div className="reward-gradient p-3 rounded-full w-fit mx-auto mb-4">
                  <Coins className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">{userRewards?.total_points || 0}</h3>
                <p className="text-sm text-muted-foreground">Available Points</p>
              </CardContent>
            </Card>

            <Card className="reward-card card-hover">
              <CardContent className="p-6 text-center">
                <div className="gold-gradient p-3 rounded-full w-fit mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">{userRewards?.lifetime_points || 0}</h3>
                <p className="text-sm text-muted-foreground">Lifetime Points</p>
              </CardContent>
            </Card>

            <Card className="reward-card card-hover">
              <CardContent className="p-6 text-center">
                <div className="primary-gradient p-3 rounded-full w-fit mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">#{getUserRank()}</h3>
                <p className="text-sm text-muted-foreground">Leaderboard Rank</p>
              </CardContent>
            </Card>

            <Card className="reward-card card-hover">
              <CardContent className="p-6 text-center">
                <div className="secondary-gradient p-3 rounded-full w-fit mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">{userRewards?.current_streak || 0}</h3>
                <p className="text-sm text-muted-foreground">Daily Streak</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="rewards" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rewards" className="flex items-center space-x-2">
                <Gift className="h-4 w-4" />
                <span>Redeem Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>Transaction History</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
                <Crown className="h-4 w-4" />
                <span>Leaderboard</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rewards" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewards.map((reward) => {
                  const Icon = reward.icon;
                  const canRedeem = (userRewards?.total_points || 0) >= reward.points;
                  
                  return (
                    <Card key={reward.id} className="reward-card hover-lift">
                      <CardHeader className="text-center">
                        <div className={`${reward.color === 'primary' ? 'primary-gradient' :
                                          reward.color === 'secondary' ? 'secondary-gradient' :
                                          'gold-gradient'} p-4 rounded-2xl w-fit mx-auto mb-4`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <Badge 
                          variant="outline" 
                          className={`text-lg px-4 py-2 ${canRedeem ? 'border-primary text-primary' : 'border-muted text-muted-foreground'}`}
                        >
                          {reward.points} Points
                        </Badge>
                        <Button 
                          className="w-full" 
                          disabled={!canRedeem}
                          onClick={() => redeemPoints(reward.points, reward.title)}
                        >
                          {canRedeem ? 'Redeem Now' : 'Need More Points'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your point earning and redemption history</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${transaction.points_change > 0 ? 'bg-quiz-correct/10' : 'bg-quiz-incorrect/10'}`}>
                              {transaction.points_change > 0 ? (
                                <TrendingUp className={`h-4 w-4 text-quiz-correct`} />
                              ) : (
                                <Gift className={`h-4 w-4 text-quiz-incorrect`} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={transaction.points_change > 0 ? "secondary" : "destructive"}
                            className="text-lg px-3 py-1"
                          >
                            {transaction.points_change > 0 ? '+' : ''}{transaction.points_change} pts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No transactions yet. Start taking quizzes to earn points!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Players</CardTitle>
                  <CardDescription>See how you rank against other users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((entry) => (
                      <div 
                        key={entry.user_id} 
                        className={`flex items-center justify-between p-4 rounded-lg border ${entry.user_id === user?.id ? 'bg-primary/10 border-primary' : 'border-border'}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                            entry.rank === 1 ? 'bg-gold text-gold-foreground' :
                            entry.rank === 2 ? 'bg-silver text-silver-foreground' :
                            entry.rank === 3 ? 'bg-bronze text-bronze-foreground' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {entry.rank}
                          </div>
                          <div>
                            <p className="font-medium">
                              {entry.user_id === user?.id ? 'You' : `User ${entry.user_id.slice(-4)}`}
                            </p>
                            <div className="flex space-x-1">
                              {(entry.badges as string[] || []).slice(0, 3).map((badge, i) => (
                                <span key={i} className="text-sm">🏆</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {entry.total_points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </Layout>
  );
};

export default RewardsWallet;