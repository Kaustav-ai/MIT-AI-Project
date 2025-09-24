import Layout from '@/components/Layout';
import QuizInterface from '@/components/quiz/QuizInterface';

const DailyQuiz = () => {
  return (
    <Layout showChatButton={false}>
      <div className="min-h-screen quiz-gradient py-8">
        <QuizInterface 
          category="General Health" 
          difficulty="easy" 
          isDaily={true}
        />
      </div>
    </Layout>
  );
};

export default DailyQuiz;