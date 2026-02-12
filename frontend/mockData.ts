import { AppData, Priority } from './types';

const now = new Date();
const oneDay = 24 * 60 * 60 * 1000;

export const INITIAL_DATA: AppData = {
  user: {
    id: 'u1',
    name: 'Alex Morgan',
    email: 'alex@prodspace.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    plan: 'Pro',
  },
  areas: [
    { id: 'area_work', name: 'Work', color: 'bg-blue-500' },
    { id: 'area_study', name: 'Study', color: 'bg-purple-500' },
    { id: 'area_personal', name: 'Personal', color: 'bg-green-500' },
  ],
  tasks: [
    {
      id: 't1',
      title: 'Finalize Q3 Financial Report',
      description: 'Review the sales charts and attach the executive summary PDF before sending to the board.',
      area: 'Work',
      priority: Priority.High,
      completed: false,
      dueDate: now.toISOString(),
      tags: ['Finance', 'Q3'],
      createdAt: new Date(now.getTime() - oneDay * 2).toISOString(),
    },
    {
      id: 't2',
      title: 'Email Client regarding Project Alpha',
      description: 'Clarify the requirements for the mobile responsive view.',
      area: 'Work',
      priority: Priority.Medium,
      completed: false,
      createdAt: new Date(now.getTime() - oneDay * 1).toISOString(),
    },
    {
      id: 't3',
      title: 'Read Chapter 4: UX Principles',
      description: 'Focus on Gestalt principles and visual hierarchy section.',
      area: 'Study',
      completed: false,
      tags: ['Reading'],
      createdAt: new Date(now.getTime() - oneDay * 5).toISOString(),
    },
    {
      id: 't4',
      title: 'Grocery Shopping',
      description: 'Milk, eggs, bread, coffee beans.',
      area: 'Personal',
      priority: Priority.Low,
      completed: false,
      createdAt: new Date(now.getTime() - oneDay * 0.5).toISOString(),
    },
    {
      id: 't5',
      title: 'Morning Gym Session',
      area: 'Personal',
      completed: true,
      dueDate: new Date(now.getTime() - oneDay).toISOString(),
      createdAt: new Date(now.getTime() - oneDay * 3).toISOString(),
    }
  ],
  notes: [
    {
      id: 'n1',
      title: 'Q4 Marketing Strategy',
      content: 'Focus on organic growth channels. Need to finalize the budget allocation for social media ads by Friday.\n- Review Q3 analytics\n- Competitor analysis report\n- Content calendar draft for December',
      area: 'Work',
      lastEdited: new Date(now.getTime() - 7200000).toISOString(),
      createdAt: new Date(now.getTime() - oneDay * 4).toISOString(),
    },
    {
      id: 'n2',
      title: 'App Redesign Concepts',
      content: 'Thinking about a darker theme option for the mobile app. Users have been requesting it on the feedback board.',
      area: 'Work',
      lastEdited: new Date(now.getTime() - oneDay).toISOString(),
      tags: ['Ideas'],
      createdAt: new Date(now.getTime() - oneDay * 6).toISOString(),
    },
    {
      id: 'n3',
      title: 'Grocery List',
      content: '- Almond milk\n- Spinach\n- Chicken breast\n- Coffee beans (light roast)',
      area: 'Personal',
      lastEdited: new Date('2023-10-24').toISOString(),
      createdAt: new Date('2023-10-24').toISOString(),
    },
    {
      id: 'n4',
      title: 'React Hooks Guide',
      content: 'Notes on useEffect dependency arrays and memoization techniques for performance optimization.',
      area: 'Study',
      lastEdited: new Date('2023-10-22').toISOString(),
      previewImage: 'https://picsum.photos/seed/react/400/200',
      tags: ['Dev'],
      createdAt: new Date('2023-10-22').toISOString(),
    }
  ],
  recentActivity: [
    { id: 'a1', title: 'Meeting Notes - Q3', type: 'note', area: 'Work', timestamp: new Date(now.getTime() - 120000).toISOString() },
    { id: 'a2', title: 'Update website banner', type: 'task', area: 'Personal', timestamp: new Date(now.getTime() - 3600000).toISOString() },
    { id: 'a3', title: 'Grocery List', type: 'note', area: 'Personal', timestamp: new Date(now.getTime() - 10800000).toISOString() },
    { id: 'a4', title: 'Design System Review', type: 'task', area: 'Work', timestamp: new Date(now.getTime() - 18000000).toISOString() },
  ]
};
