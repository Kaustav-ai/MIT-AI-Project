import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import QuizInterface from '@/components/quiz/QuizInterface';

const CategoryQuiz = () => {
  const { category } = useParams<{ category: string }>();
  
  const categoryMap: Record<string, { name: string; difficulty: string }> = {
    'general-health': { name: 'General Health', difficulty: 'easy' },
    'nutrition': { name: 'Nutrition', difficulty: 'medium' },
    'exercise': { name: 'Exercise', difficulty: 'easy' },
    'mental-health': { name: 'Mental Health', difficulty: 'medium' },
    'heart-health': { name: 'Heart Health', difficulty: 'hard' }
  };

  const categoryInfo = categoryMap[category || 'general-health'] || categoryMap['general-health'];

  return (
    <Layout showChatButton={false}>
      <div className="min-h-screen quiz-gradient py-8">
        <QuizInterface 
          category={categoryInfo.name}
          difficulty={categoryInfo.difficulty}
          isDaily={false}
        />
      </div>
    </Layout>
  );
};

export default CategoryQuiz;