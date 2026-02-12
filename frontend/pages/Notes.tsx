import React, { useState } from 'react';
import { AppData, Note, AreaType } from '../types';

interface NotesPageProps {
  data: AppData | null;
  onOpenNote: (note: Note) => void;
  onNewNote: () => void;
}

const NotesPage: React.FC<NotesPageProps> = ({ data, onOpenNote, onNewNote }) => {
  const [filter, setFilter] = useState<'All' | string>('All');

  if (!data) return <div>Loading...</div>;

  const filteredNotes = filter === 'All' ? data.notes : data.notes.filter(n => n.area === filter);

  return (
    <div className="h-full flex flex-col">
       {/* Header */}
       <header className="h-20 px-8 flex items-center justify-between bg-white/80 dark:bg-[#1a202c]/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10 sticky top-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notes</h1>
          <div className="flex items-center space-x-4">
              <div className="hidden md:flex relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-icons text-lg">search</span>
                  </span>
                  <input className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Search notes..." type="text"/>
              </div>
              <button onClick={onNewNote} className="flex items-center bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg shadow-md transition-all font-medium text-sm">
                  <span className="material-icons text-sm mr-2">add</span> New Note
              </button>
          </div>
       </header>

       <div className="flex-1 overflow-y-auto p-8">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
                <button 
                    onClick={() => setFilter('All')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        filter === 'All' 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm' 
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary'
                    }`}
                >
                    All
                </button>
                {data.areas.map((area) => (
                    <button 
                        key={area.id}
                        onClick={() => setFilter(area.name)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                            filter === area.name
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm' 
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary'
                        }`}
                    >
                        {area.name}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                {filteredNotes.map(note => {
                    const areaColor = data.areas.find(a => a.name === note.area)?.color.replace('bg-', 'text-') || 'text-slate-600';
                    const areaBg = data.areas.find(a => a.name === note.area)?.color.replace('bg-', 'bg-').replace('500', '50') || 'bg-slate-50';
                    
                    return (
                    <div 
                        key={note.id} 
                        onClick={() => onOpenNote(note)}
                        className="group relative bg-white dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-64 overflow-hidden"
                    >
                        {note.previewImage && (
                            <div className="h-24 bg-cover bg-center" style={{backgroundImage: `url('${note.previewImage}')`}}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent h-24 opacity-60"></div>
                            </div>
                        )}
                        <div className={`p-6 flex flex-col flex-1 ${note.previewImage ? 'pt-4' : ''}`}>
                            <div className="flex items-start justify-between mb-3">
                                <span className={`px-2.5 py-1 rounded text-xs font-semibold ${areaBg} ${areaColor} dark:bg-opacity-20`}>
                                    {note.area}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors truncate">{note.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-4 flex-1 whitespace-pre-wrap">{note.content}</p>
                            <div className="flex items-center text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800 w-full mt-auto">
                                <span className="material-icons text-sm mr-1">schedule</span>
                                {new Date(note.lastEdited).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                )})}
                
                {/* Create New Placeholder */}
                <button onClick={onNewNote} className="group relative rounded-xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 flex items-center justify-center mb-3 transition-colors text-slate-400 group-hover:text-primary">
                        <span className="material-icons text-2xl">add</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">Create New Note</h3>
                </button>
            </div>
       </div>
    </div>
  );
};

export default NotesPage;
