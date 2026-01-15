
import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'c4',
    title: 'Maîtriser n8n & Make pour l\'Automatisation',
    description: 'Apprenez à construire des workflows complexes connectant des centaines d\'applications sans code.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=450',
    instructor: 'David Tech',
    category: 'Automatisation',
    level: 'Intermédiaire',
    rating: 4.9,
    studentsCount: 3200,
    isFree: false,
    price: 49.99,
    status: 'published',
    reviews: [
      { id: 'r1', userId: 'u101', userName: 'Thomas Leroy', rating: 5, comment: 'Grâce à ce cours, j\'ai automatisé tout mon CRM. Le passage sur les Webhooks est une pépite !', date: '12/05/2024', status: 'approved' },
      { id: 'r2', userId: 'u102', userName: 'Sophie Martin', rating: 4, comment: 'Très complet. Le tuteur IA m\'a aidé à débloquer un bug sur n8n en 2 minutes.', date: '15/05/2024', status: 'approved' }
    ],
    lessons: [
      { id: 'l7', title: 'Introduction aux Noeuds', content: 'n8n est un outil puissant d\'automatisation...', duration: '15:00', type: 'video', isFreePreview: true },
      { id: 'l8', title: 'Requêtes HTTP & Webhooks', content: 'Connecter des APIs externes est le cœur de l\'automatisation...', duration: '25:00', type: 'text' }
    ]
  },
  {
    id: 'c5',
    title: 'Google AI Studio & Vibe Coding',
    description: 'Exploitez les modèles Gemini et les principes du Vibe Coding pour créer des apps IA rapidement.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450',
    instructor: 'Sarah Gemini',
    category: 'IA Coding',
    level: 'Avancé',
    rating: 5.0,
    studentsCount: 1500,
    isFree: true,
    status: 'published',
    reviews: [
      { id: 'r3', userId: 'u103', userName: 'Marc Antoine', rating: 5, comment: 'Le Vibe Coding est une révolution. Je ne code plus, je discute avec mon IDE.', date: '10/05/2024', status: 'approved' },
      { id: 'r4', userId: 'u104', userName: 'Julie Vernes', rating: 5, comment: 'Gemini 3 Pro est bluffant de précision. Ce cours est indispensable pour rester à la page.', date: '18/05/2024', status: 'approved' }
    ],
    lessons: [
      { id: 'l9', title: 'Les Fondamentaux du Vibe Coding', content: 'Qu\'est-ce que le Vibe Coding et pourquoi cela change tout ?', duration: '12:00', type: 'video', isFreePreview: true },
      { id: 'l10', title: 'Prompt Engineering avec Gemini 3', content: 'Techniques avancées pour la génération multi-modale.', duration: '20:00', type: 'quiz' }
    ]
  },
  {
    id: 'c1',
    title: 'Développement Web Moderne avec React 19',
    description: 'Maîtrisez React 19, les Hooks et la gestion d\'état avancée avec des projets concrets.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800&h=450',
    instructor: 'Alex Rivera',
    category: 'Développement',
    level: 'Intermédiaire',
    rating: 4.8,
    studentsCount: 12500,
    isFree: false,
    price: 29.99,
    status: 'published',
    reviews: [
      { id: 'r5', userId: 'u105', userName: 'Kevin Durant', rating: 5, comment: 'React 19 change la donne. Les nouveaux hooks sont expliqués avec une clarté rare.', date: '20/05/2024', status: 'approved' }
    ],
    lessons: [
      { id: 'l1', title: 'Introduction à React 19', content: 'Dans cette leçon, nous couvrons les nouveaux concepts...', duration: '12:00', type: 'video', isFreePreview: true },
      { id: 'l2', title: 'Le rendu concurrent', content: 'Le rendu concurrent permet à React d\'interrompre un rendu long...', duration: '15:30', type: 'text' }
    ]
  }
];
