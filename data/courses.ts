
import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Modern Web Development with React 18',
    description: 'Master React 18, Hooks, and Advanced State Management with practical real-world projects.',
    thumbnail: 'https://picsum.photos/seed/react/800/450',
    instructor: 'Alex Rivera',
    category: 'Development',
    level: 'Intermediate',
    rating: 4.8,
    studentsCount: 12500,
    lessons: [
      { id: 'l1', title: 'Introduction to React 18', content: 'In this lesson, we will cover the core concepts of React 18...', duration: '12:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'l2', title: 'The Power of Concurrent Rendering', content: 'Concurrent rendering allows React to interrupt a long-running render...', duration: '15:30', type: 'text' },
      { id: 'l3', title: 'Quiz: Core Concepts', content: 'Test your knowledge on React hooks and rendering cycle.', duration: '5:00', type: 'quiz' }
    ]
  },
  {
    id: 'c2',
    title: 'Artificial Intelligence Fundamentals',
    description: 'A comprehensive guide to Neural Networks, LLMs, and Generative AI for beginners.',
    thumbnail: 'https://picsum.photos/seed/ai/800/450',
    instructor: 'Dr. Sarah Chen',
    category: 'Data Science',
    level: 'Beginner',
    rating: 4.9,
    studentsCount: 8400,
    lessons: [
      { id: 'l4', title: 'What is AI?', content: 'Exploring the history and evolution of machine intelligence.', duration: '10:00', type: 'video' },
      { id: 'l5', title: 'Understanding Transformers', content: 'Deep dive into the architecture that powers GPT and Gemini.', duration: '20:00', type: 'text' }
    ]
  },
  {
    id: 'c3',
    title: 'UI/UX Design Masterclass',
    description: 'Learn the principles of visual hierarchy, color theory, and user-centered design.',
    thumbnail: 'https://picsum.photos/seed/design/800/450',
    instructor: 'Jordan Smith',
    category: 'Design',
    level: 'Beginner',
    rating: 4.7,
    studentsCount: 5600,
    lessons: [
      { id: 'l6', title: 'Design Thinking Process', content: 'Empathize, Define, Ideate, Prototype, Test.', duration: '18:00', type: 'video' }
    ]
  }
];
