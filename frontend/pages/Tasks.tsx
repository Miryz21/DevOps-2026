import React from 'react';
import { AppData, Task, Priority, AreaType } from '../types';
import { api } from '../services/api';

interface TasksPageProps {
  data: AppData | null;
  onDataUpdate: () => void;
  onOpenTask: (task: Task) => void;
  onNewTask: () => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ data, onDataUpdate, onOpenTask, onNewTask }) => {

  if (!data) return <div>Loading...</div>;

  const handleToggle = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
        await api.toggleTaskCompletion(taskId);
        onDataUpdate();
    } catch (err) {
        console.error(err);
    }
  };

  const pendingTasks = data.tasks.filter(t => !t.completed);
  const completedTasks = data.tasks.filter(t => t.completed);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 h-full overflow-y-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Tasks</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 text-sm">
            <span className="material-icons text-base">calendar_today</span>
            <span>Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <span className="material-icons text-[20px]">search</span>
            </span>
            <input className="pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-neutral-surface-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-shadow shadow-sm outline-none" placeholder="Search tasks..." type="text"/>
          </div>
          <button onClick={onNewTask} className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-primary/30 flex items-center gap-2 transition-all active:scale-95">
            <span className="material-icons text-sm">add</span>
            <span>Add Task</span>
          </button>
        </div>
      </header>

      {/* Grouped Tasks */}
      {data.areas.map(area => {
        const areaTasks = pendingTasks.filter(t => t.area === area.name);
        if (areaTasks.length === 0) return null;

        return (
            <section key={area.id} className="mb-10 animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${area.color} shadow-sm`}></span>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{area.name} Area</h3>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-md text-xs font-semibold">{areaTasks.length}</span>
                    </div>
                </div>
                <div className="grid gap-3">
                    {areaTasks.map(task => (
                        <div 
                            key={task.id} 
                            onClick={() => onOpenTask(task)}
                            className="group bg-white dark:bg-neutral-surface-dark rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer flex items-start gap-4"
                        >
                            <div className="pt-1" onClick={(e) => handleToggle(task.id, e)}>
                                <div className="w-5 h-5 rounded border border-slate-300 text-primary cursor-pointer hover:border-primary flex items-center justify-center"></div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{task.title}</h4>
                                    {task.priority && (
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${
                                            task.priority === Priority.High ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 
                                            task.priority === Priority.Medium ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 
                                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>{task.priority} Priority</span>
                                    )}
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-1">{task.description}</p>
                                {task.dueDate && (
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="flex items-center text-xs text-slate-400">
                                            <span className="material-icons text-[14px] mr-1">schedule</span>
                                            {new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
      })}

      {/* Completed */}
      {completedTasks.length > 0 && (
         <section className="border-t border-slate-200 dark:border-slate-800 pt-8 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 mb-4 cursor-pointer">
                <span className="material-icons text-slate-400 text-lg">expand_more</span>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed Tasks ({completedTasks.length})</h3>
            </div>
            <div className="grid gap-3">
                {completedTasks.map(task => (
                     <div key={task.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-start gap-4" onClick={() => handleToggle(task.id, {} as any)}>
                        <div className="pt-1">
                            <div className="w-5 h-5 rounded border border-slate-300 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <span className="material-icons text-sm text-slate-500">check</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <h4 className="font-medium text-slate-500 line-through">{task.title}</h4>
                            </div>
                        </div>
                     </div>
                ))}
            </div>
         </section>
      )}
    </div>
  );
};

export default TasksPage;
