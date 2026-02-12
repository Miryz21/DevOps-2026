export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Pro';
}

// Changed from Enum to string type to support dynamic areas
export type AreaType = string;

export interface Area {
  id: string;
  name: string;
  color: string; // Tailwind class, e.g., "bg-blue-500"
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  area: string;
  priority?: Priority;
  completed: boolean;
  dueDate?: string; // ISO date string
  assignee?: User;
  tags?: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  createdAt: string; // ISO date string
}

export interface Note {
  id: string;
  title: string;
  content: string; // Simplified markdown/text
  area: string;
  lastEdited: string; // ISO date string
  previewImage?: string;
  tags?: string[];
  createdAt: string; // ISO date string
}

export interface Activity {
  id: string;
  title: string;
  type: 'note' | 'task';
  area: string;
  timestamp: string;
}

export interface AppData {
  user: User;
  tasks: Task[];
  notes: Note[];
  areas: Area[];
  recentActivity: Activity[];
}
