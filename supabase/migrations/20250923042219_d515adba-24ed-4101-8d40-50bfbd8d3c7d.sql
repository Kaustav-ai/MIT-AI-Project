-- Create quiz and rewards system tables

-- Table for quiz questions
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for user quiz attempts
CREATE TABLE public.user_quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id),
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  attempt_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quiz_session_id UUID NOT NULL
);

-- Table for quiz sessions
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for user points and rewards
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_quiz_date DATE,
  badges JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for point transactions
CREATE TABLE public.point_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points_change INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'bonus')),
  description TEXT NOT NULL,
  related_session_id UUID REFERENCES public.quiz_sessions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for achievements/badges
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz_questions (public read)
CREATE POLICY "Anyone can view quiz questions" 
ON public.quiz_questions 
FOR SELECT 
USING (true);

-- Create policies for user_quiz_attempts
CREATE POLICY "Users can view their own quiz attempts" 
ON public.user_quiz_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts" 
ON public.user_quiz_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all quiz attempts" 
ON public.user_quiz_attempts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for quiz_sessions
CREATE POLICY "Users can view their own quiz sessions" 
ON public.quiz_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz sessions" 
ON public.quiz_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz sessions" 
ON public.quiz_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all quiz sessions" 
ON public.quiz_sessions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for user_rewards
CREATE POLICY "Users can view their own rewards" 
ON public.user_rewards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rewards" 
ON public.user_rewards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards" 
ON public.user_rewards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all rewards" 
ON public.user_rewards 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for point_transactions
CREATE POLICY "Users can view their own transactions" 
ON public.point_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON public.point_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" 
ON public.point_transactions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_quiz_questions_updated_at
BEFORE UPDATE ON public.quiz_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_rewards_updated_at
BEFORE UPDATE ON public.user_rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample quiz questions
INSERT INTO public.quiz_questions (category, difficulty, question, options, correct_answer, explanation, points) VALUES
('General Health', 'easy', 'How many glasses of water should an average adult drink per day?', '["4-5 glasses", "6-8 glasses", "10-12 glasses", "15+ glasses"]', 1, 'The general recommendation is 6-8 glasses (about 2 liters) of water per day for proper hydration.', 10),
('Nutrition', 'medium', 'Which vitamin is primarily produced when skin is exposed to sunlight?', '["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"]', 3, 'Vitamin D is synthesized by the skin when exposed to UVB radiation from sunlight.', 15),
('Exercise', 'easy', 'What is the recommended minimum amount of moderate exercise per week for adults?', '["30 minutes", "75 minutes", "150 minutes", "300 minutes"]', 2, 'Adults should get at least 150 minutes of moderate-intensity aerobic activity per week.', 10),
('Mental Health', 'medium', 'Which of the following is NOT a common symptom of stress?', '["Headaches", "Improved memory", "Sleep problems", "Muscle tension"]', 1, 'Stress typically impairs memory and concentration, rather than improving it.', 15),
('Heart Health', 'hard', 'What is the ideal resting heart rate range for a healthy adult?', '["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm"]', 1, 'A normal resting heart rate for adults ranges from 60 to 100 beats per minute.', 20);

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, requirement_type, requirement_value, points_reward) VALUES
('First Steps', 'Complete your first quiz', '🎯', 'quizzes_completed', 1, 50),
('Knowledge Seeker', 'Complete 10 quizzes', '📚', 'quizzes_completed', 10, 100),
('Quiz Master', 'Complete 50 quizzes', '🏆', 'quizzes_completed', 50, 500),
('Perfect Score', 'Get 100% on a quiz', '⭐', 'perfect_scores', 1, 100),
('Streak Champion', 'Maintain a 7-day quiz streak', '🔥', 'streak_days', 7, 200),
('Point Collector', 'Earn 1000 total points', '💎', 'total_points', 1000, 100);