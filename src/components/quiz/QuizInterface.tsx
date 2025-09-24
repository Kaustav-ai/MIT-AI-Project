import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Star,
  Brain,
  Lightbulb,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  category: string;
  difficulty: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  points: number;
}

interface QuizInterfaceProps {
  category?: string;
  difficulty?: string;
  isDaily?: boolean;
}

const QuizInterface = ({ category = 'General Health', difficulty = 'easy', isDaily = false }: QuizInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleQuizComplete();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  const fetchQuestions = async () => {
    try {
      let query = supabase
        .from('quiz_questions')
        .select('*')
        .eq('category', category)
        .eq('difficulty', difficulty)
        .limit(5);

      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Shuffle questions and parse options from JSON
        const parsedQuestions = data.map(q => ({
          ...q,
          options: Array.isArray(q.options) ? q.options as string[] : JSON.parse(q.options as string)
        }));
        const shuffledQuestions = parsedQuestions.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quiz questions.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    try {
      // Create quiz session
      const { data: session, error } = await supabase
        .from('quiz_sessions')
        .insert([{
          user_id: user.id,
          total_questions: questions.length,
          category,
          difficulty
        }])
        .select()
        .single();

      if (error) throw error;
      
      setSessionId(session.id);
      setQuizStarted(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to start quiz.',
        variant: 'destructive'
      });
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    // Store user answer
    setUserAnswers([...userAnswers, selectedAnswer]);

    // Record attempt in database
    try {
      await supabase
        .from('user_quiz_attempts')
        .insert([{
          user_id: user.id,
          question_id: currentQuestion.id,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
          points_earned: isCorrect ? currentQuestion.points : 0,
          quiz_session_id: sessionId
        }]);
    } catch (error) {
      console.error('Error recording answer:', error);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    setQuizCompleted(true);
    
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === questions[index]?.correct_answer
    ).length;
    
    const totalPoints = questions
      .filter((_, index) => userAnswers[index] === questions[index]?.correct_answer)
      .reduce((sum, q) => sum + q.points, 0);

    try {
      // Update quiz session
      await supabase
        .from('quiz_sessions')
        .update({
          correct_answers: correctAnswers,
          total_points: totalPoints,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      // Update user rewards
      const { data: currentRewards } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (currentRewards) {
        const today = new Date().toISOString().split('T')[0];
        const lastQuizDate = currentRewards.last_quiz_date;
        const isConsecutive = lastQuizDate && 
          new Date(lastQuizDate).getTime() === new Date(today).getTime() - 24 * 60 * 60 * 1000;
        
        const newStreak = lastQuizDate === today ? currentRewards.current_streak :
                         isConsecutive ? currentRewards.current_streak + 1 : 1;

        await supabase
          .from('user_rewards')
          .update({
            total_points: currentRewards.total_points + totalPoints,
            lifetime_points: currentRewards.lifetime_points + totalPoints,
            current_streak: newStreak,
            longest_streak: Math.max(currentRewards.longest_streak, newStreak),
            last_quiz_date: today
          })
          .eq('user_id', user.id);
      }

      // Add point transaction
      await supabase
        .from('point_transactions')
        .insert([{
          user_id: user.id,
          points_change: totalPoints,
          transaction_type: 'earned',
          description: `Quiz completed: ${category} (${difficulty})`,
          related_session_id: sessionId
        }]);

      toast({
        title: 'Quiz Completed! 🎉',
        description: `You earned ${totalPoints} points! Score: ${correctAnswers}/${questions.length}`,
      });

    } catch (error) {
      console.error('Error completing quiz:', error);
    }

    setShowResult(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResult(false);
    setTimeLeft(300);
    setQuizStarted(false);
    setQuizCompleted(false);
    setSessionId('');
    fetchQuestions();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="quiz-card">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="quiz-card border-2 border-primary/30">
          <CardHeader className="text-center">
            <div className="primary-gradient p-4 rounded-2xl w-fit mx-auto mb-4">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {isDaily ? 'Daily Health Challenge' : `${category} Quiz`}
            </CardTitle>
            <CardDescription className="text-lg">
              Test your knowledge and earn points!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">{questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-secondary">{formatTime(timeLeft)}</div>
                <div className="text-sm text-muted-foreground">Time Limit</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-accent">
                  {questions.reduce((sum, q) => sum + q.points, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Max Points</div>
              </div>
            </div>
            <Button onClick={startQuiz} className="w-full" size="lg">
              <Trophy className="h-5 w-5 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult) {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === questions[index]?.correct_answer
    ).length;
    const totalPoints = questions
      .filter((_, index) => userAnswers[index] === questions[index]?.correct_answer)
      .reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Results Summary */}
        <Card className="quiz-card border-2 border-primary/30">
          <CardHeader className="text-center">
            <div className="success-gradient p-4 rounded-2xl w-fit mx-auto mb-4">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Great job on completing the quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{correctAnswers}/{questions.length}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">{percentage}%</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-accent">+{totalPoints}</div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={restartQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => navigate('/quiz')}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Review Your Answers</h3>
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correct_answer;
            
            return (
              <Card key={question.id} className={`quiz-card border-l-4 ${isCorrect ? 'border-l-quiz-correct' : 'border-l-quiz-incorrect'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex-1">
                      Question {index + 1}: {question.question}
                    </CardTitle>
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-quiz-correct flex-shrink-0 ml-4" />
                    ) : (
                      <XCircle className="h-6 w-6 text-quiz-incorrect flex-shrink-0 ml-4" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          optionIndex === question.correct_answer ? 'bg-quiz-correct/10 border-quiz-correct' :
                          optionIndex === userAnswer && !isCorrect ? 'bg-quiz-incorrect/10 border-quiz-incorrect' :
                          'border-border'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                            optionIndex === question.correct_answer ? 'bg-quiz-correct text-white border-quiz-correct' :
                            optionIndex === userAnswer && !isCorrect ? 'bg-quiz-incorrect text-white border-quiz-incorrect' :
                            'border-border'
                          }`}>
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {optionIndex === question.correct_answer && (
                            <CheckCircle className="h-5 w-5 text-quiz-correct" />
                          )}
                          {optionIndex === userAnswer && !isCorrect && (
                            <XCircle className="h-5 w-5 text-quiz-incorrect" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {question.explanation && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-muted-foreground mb-1">Explanation</p>
                          <p className="text-sm">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Category: {question.category}</span>
                    <Badge variant="outline">
                      {isCorrect ? `+${question.points}` : '0'} points
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="quiz-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
              <Badge variant="secondary">
                {currentQuestion.category}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`font-mono ${timeLeft < 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold leading-relaxed">
              {currentQuestion.question}
            </h2>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="capitalize">
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                {currentQuestion.points} points
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all hover:scale-[1.02] ${
                  selectedAnswer === index
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium ${
                    selectedAnswer === index
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              size="lg"
              className="min-w-32"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizInterface;