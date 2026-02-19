import { AppData, Priority } from './types';

const now = new Date();
const oneDay = 24 * 60 * 60 * 1000;

export const INITIAL_DATA: AppData = {
  user: {
    id: 1,
    full_name: 'Alex Morgan',
    email: 'alex@prodspace.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  areas: [
    { id: 1, name: 'Work', color: 'bg-blue-500', user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, name: 'Study', color: 'bg-purple-500', user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, name: 'Personal', color: 'bg-green-500', user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  tasks: [
    {
      id: 1,
      title: 'Finalize Q3 Financial Report',
      description: 'Review the sales charts and attach the executive summary PDF before sending to the board.',
      area_id: 1,
      priority: Priority.High,
      completed: false,
      due_date: now.toISOString(),
      user_id: 1,
      created_at: new Date(now.getTime() - oneDay * 2).toISOString(),
      updated_at: new Date(now.getTime() - oneDay * 2).toISOString(),
    },
    {
      id: 2,
      title: 'Email Client regarding Project Alpha',
      description: 'Clarify the requirements for the mobile responsive view.',
      area_id: 1,
      priority: Priority.Medium,
      completed: false,
      user_id: 1,
      created_at: new Date(now.getTime() - oneDay * 1).toISOString(),
      updated_at: new Date(now.getTime() - oneDay * 1).toISOString(),
    },
    {
      id: 3,
      title: 'Read Chapter 4: UX Principles',
      description: 'Focus on Gestalt principles and visual hierarchy section.',
      area_id: 2,
      completed: false,
      user_id: 1,
      created_at: new Date(now.getTime() - oneDay * 5).toISOString(),
      updated_at: new Date(now.getTime() - oneDay * 5).toISOString(),
    },
    {
      id: 4,
      title: 'Grocery Shopping',
      description: 'Milk, eggs, bread, coffee beans.',
      area_id: 3,
      priority: Priority.Low,
      completed: false,
      user_id: 1,
      created_at: new Date(now.getTime() - oneDay * 0.5).toISOString(),
      updated_at: new Date(now.getTime() - oneDay * 0.5).toISOString(),
    },
    {
      id: 5,
      title: 'Morning Gym Session',
      area_id: 3,
      completed: true,
      due_date: new Date(now.getTime() - oneDay).toISOString(),
      user_id: 1,
      created_at: new Date(now.getTime() - oneDay * 3).toISOString(),
      updated_at: new Date(now.getTime() - oneDay * 3).toISOString(),
    }
  ],
  notes: [
    {
      id: 1,
      title: 'Q4 Marketing Strategy',
      content: 'Focus on organic growth channels. Need to finalize the budget allocation for social media ads by Friday.\n- Review Q3 analytics\n- Competitor analysis report\n- Content calendar draft for December',
      area_id: 1,
      user_id: 1,
      created_at: new Date(now.getTime() - oneDay * 4).toISOString(),
      updated_at: new Date(now.getTime() - 7200000).toISOString(),
    },
    {
      id: 2,
      title: 'App Redesign Concepts',
      content: 'Thinking about a darker theme option for the mobile app. Users have been requesting it on the feedback board.',
      area_id: 1,
      user_id: 1,
      created_at: new Date(now.getTime() - oneDay * 6).toISOString(),
      updated_at: new Date(now.getTime() - oneDay).toISOString(),
    },
    {
      id: 3,
      title: 'Grocery List',
      content: '- Almond milk\n- Spinach\n- Chicken breast\n- Coffee beans (light roast)',
      area_id: 3,
      user_id: 1,
      created_at: new Date('2023-10-24').toISOString(),
      updated_at: new Date('2023-10-24').toISOString(),
    },
    {
      id: 4,
      title: 'React Hooks Guide',
      content: 'Notes on useEffect dependency arrays and memoization techniques for performance optimization.',
      area_id: 2,
      user_id: 1,
      created_at: new Date('2023-10-22').toISOString(),
      updated_at: new Date('2023-10-22').toISOString(),
    }
  ]
};
