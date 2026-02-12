import React from 'react';
import { AppData, AreaType } from '../types';

interface DashboardProps {
  data: AppData | null;
  onNavigate: (page: string) => void;
  onNewTask: () => void;
  onNewNote: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onNavigate, onNewTask, onNewNote }) => {
  if (!data) return <div className="p-8 text-center">Loading dashboard...</div>;

  const activeTasks = data.tasks.filter(t => !t.completed).length;
  const totalNotes = data.notes.length;
  const mostActiveArea = data.areas[0]?.name || 'Work';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full h-full overflow-y-auto">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Good morning, {data.user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Here is your daily brief for <span className="font-medium text-primary">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>.</p>
        </div>
        <div className="flex items-center gap-3">
             <button onClick={onNewNote} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all bg-white dark:bg-neutral-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary text-primary">
                <span className="material-icons text-lg text-primary">note_add</span>
                New Note
             </button>
             <button onClick={onNewTask} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all bg-primary text-white hover:bg-primary-hover shadow-primary/30">
                <span className="material-icons text-lg text-white">add_task</span>
                New Task
             </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-neutral-surface-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><span className="material-icons">check_circle</span></div>
                <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-icons text-[14px]">trending_up</span> +2
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{activeTasks}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Tasks</span>
            </div>
        </div>

         <div className="bg-white dark:bg-neutral-surface-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 h-full w-1 bg-slate-300 dark:bg-slate-600"></div>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"><span className="material-icons">description</span></div>
            </div>
            <div className="flex flex-col">
                <span className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{totalNotes}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Notes</span>
            </div>
        </div>

         <div className="bg-white dark:bg-neutral-surface-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 h-full w-1 bg-indigo-500"></div>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400"><span className="material-icons">center_focus_strong</span></div>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 dark:text-white mb-2 truncate">{mostActiveArea}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Most Active Area</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Areas */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Areas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.areas.map(area => (
                    <div 
                        key={area.id}
                        onClick={() => onNavigate(`area:${area.name}`)}
                        className="group bg-white dark:bg-neutral-surface-dark rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <span className={`w-3 h-3 rounded-full ${area.color} shadow-sm`}></span>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{area.name}</h3>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">Tasks and notes related to {area.name}.</p>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                             <div className="flex items-center gap-1"><span className="material-icons text-base">format_list_bulleted</span> {data.tasks.filter(t=>t.area === area.name && !t.completed).length} Pending</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <div className="bg-white dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {data.recentActivity.map((activity) => {
                    const activityArea = data.areas.find(a => a.name === activity.area);
                    const colorClass = activityArea ? activityArea.color.replace('bg-', 'text-') : 'text-slate-500';
                    const bgClass = activityArea ? activityArea.color.replace('bg-', 'bg-').replace('500', '50') : 'bg-slate-50';
                    
                    return (
                        <div key={activity.id} className="group flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer last:border-0">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${bgClass} ${colorClass} dark:bg-opacity-20`}>
                                <span className="material-icons">{activity.type === 'note' ? 'description' : 'check_circle_outline'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{activity.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                    <span className={`w-2 h-2 rounded-full ${activityArea?.color || 'bg-slate-400'}`}></span>
                                    {activity.area} <span>•</span> <span>{new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
