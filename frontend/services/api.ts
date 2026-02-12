import { AppData, Task, Note, User, Area } from '../types';
import { INITIAL_DATA } from '../mockData';

const STORAGE_KEY = 'focusflow_db_v1';
const DELAY_MS = 600; // Simulate network latency

// Helper to get data from local storage or init
const getDb = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
};

// Helper to save data
const saveDb = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const api = {
  getUser: async (): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = getDb();
        resolve(db.user);
      }, DELAY_MS);
    });
  },

  getTasks: async (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = getDb();
        resolve(db.tasks);
      }, DELAY_MS);
    });
  },

  getNotes: async (): Promise<Note[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = getDb();
        resolve(db.notes);
      }, DELAY_MS);
    });
  },

  getDashboardData: async (): Promise<AppData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = getDb();
        resolve(db);
      }, DELAY_MS);
    });
  },

  createArea: async (name: string, color: string): Promise<Area> => {
     return new Promise((resolve) => {
         setTimeout(() => {
             const db = getDb();
             const newArea: Area = {
                 id: 'area_' + Math.random().toString(36).substr(2, 9),
                 name,
                 color
             };
             db.areas.push(newArea);
             saveDb(db);
             resolve(newArea);
         }, 300);
     });
  },

  toggleTaskCompletion: async (taskId: string): Promise<Task> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = getDb();
        const taskIndex = db.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex > -1) {
          db.tasks[taskIndex].completed = !db.tasks[taskIndex].completed;
          saveDb(db);
          resolve(db.tasks[taskIndex]);
        } else {
          reject('Task not found');
        }
      }, 300);
    });
  },

  createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = getDb();
        const newTask: Task = { 
          ...task, 
          id: Math.random().toString(36).substr(2, 9),
          createdAt: task.createdAt || new Date().toISOString()
        };
        db.tasks.unshift(newTask);
        saveDb(db);
        resolve(newTask);
      }, 300);
    });
  },

  updateTask: async (task: Task): Promise<Task> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const db = getDb();
              const idx = db.tasks.findIndex(t => t.id === task.id);
              if (idx !== -1) {
                  db.tasks[idx] = task;
                  saveDb(db);
              }
              resolve(task);
          }, 300);
      });
  },

  createNote: async (note: Omit<Note, 'id' | 'lastEdited'>): Promise<Note> => {
     return new Promise((resolve) => {
      setTimeout(() => {
        const db = getDb();
        const newNote: Note = { 
            ...note, 
            id: Math.random().toString(36).substr(2, 9),
            lastEdited: new Date().toISOString(),
            createdAt: note.createdAt || new Date().toISOString()
        };
        db.notes.unshift(newNote);
        saveDb(db);
        resolve(newNote);
      }, 300);
    });
  },

  updateNote: async (note: Note): Promise<Note> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const db = getDb();
              const idx = db.notes.findIndex(n => n.id === note.id);
              if (idx !== -1) {
                  db.notes[idx] = { ...note, lastEdited: new Date().toISOString() };
                  saveDb(db);
              }
              resolve(note);
          }, 300);
      })
  }
};
