import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/Tasks';
import NotesPage from './pages/Notes';
import AreaDetails from './pages/AreaDetails';
import Login from './pages/Login';
import TaskModal from './components/TaskModal';
import NoteModal from './components/NoteModal';
import { api } from './services/api';
import { AppData, Task, Note, AreaType, Priority } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [appData, setAppData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal States
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Load initial data on mount (if authenticated, or after login)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDashboardData();
      setAppData(data);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
        fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setAppData(null);
      setCurrentPage('dashboard');
  };

  const handleCreateArea = async (name: string, color: string) => {
      await api.createArea(name, color);
      fetchData();
  };

  const handleCreateTask = () => {
      setEditingTask({
          id: '', // Empty ID signals creation
          title: '',
          description: '',
          area: currentPage.startsWith('area:') ? (currentPage.split(':')[1] as AreaType) : (appData?.areas[0]?.name || 'Work'),
          priority: Priority.Medium,
          completed: false,
          createdAt: new Date().toISOString()
      } as Task);
  };

  const handleCreateNote = () => {
      setEditingNote({
          id: '',
          title: '',
          content: '',
          area: currentPage.startsWith('area:') ? (currentPage.split(':')[1] as AreaType) : (appData?.areas[0]?.name || 'Work'),
          lastEdited: new Date().toISOString(),
          createdAt: new Date().toISOString()
      } as Note);
  };

  const handleSaveTask = async (task: Task) => {
      if (task.id === '') {
          await api.createTask(task);
      } else {
          await api.updateTask(task);
      }
      fetchData();
  };

  const handleSaveNote = async (note: Note) => {
      if (note.id === '') {
          await api.createNote(note);
      } else {
          await api.updateNote(note);
      }
      fetchData();
  };

  const handleToggleTask = async (taskId: string) => {
      await api.toggleTaskCompletion(taskId);
      fetchData();
  };


  // Simple Router
  const renderPage = () => {
    if (isLoading && !appData) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (currentPage.startsWith('area:')) {
        const areaName = currentPage.split(':')[1];
        const areaInfo = appData?.areas.find(a => a.name === areaName);
        const areaColor = areaInfo?.color || 'bg-slate-500';
        return (
            <AreaDetails 
                area={areaName} 
                color={areaColor}
                tasks={appData?.tasks.filter(t => t.area === areaName) || []}
                notes={appData?.notes.filter(n => n.area === areaName) || []}
                onOpenTask={setEditingTask}
                onOpenNote={setEditingNote}
                onToggleTask={handleToggleTask}
            />
        );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard 
            data={appData} 
            onNavigate={setCurrentPage}
            onNewTask={handleCreateTask}
            onNewNote={handleCreateNote}
        />;
      case 'tasks':
        return <TasksPage 
            data={appData} 
            onDataUpdate={fetchData} 
            onOpenTask={setEditingTask}
            onNewTask={handleCreateTask}
        />;
      case 'notes':
        return <NotesPage 
            data={appData} 
            onOpenNote={setEditingNote}
            onNewNote={handleCreateNote}
        />;
      default:
        return <Dashboard 
            data={appData} 
            onNavigate={setCurrentPage}
            onNewTask={handleCreateTask}
            onNewNote={handleCreateNote}
        />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        user={appData?.user || null} 
        onLogout={handleLogout}
        areas={appData?.areas || []}
        onCreateArea={handleCreateArea}
      />
      
      <main className="flex-1 md:ml-64 relative h-full overflow-hidden flex flex-col transition-all">
        {renderPage()}
      </main>

      {/* Modals */}
      <TaskModal 
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveTask}
        areas={appData?.areas || []}
      />
      <NoteModal 
        note={editingNote}
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        onSave={handleSaveNote}
        areas={appData?.areas || []}
      />
      
      {/* Mobile nav toggle placeholder */}
      <button className="md:hidden fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50">
         <span className="material-icons">menu</span>
      </button>
    </div>
  );
};

export default App;