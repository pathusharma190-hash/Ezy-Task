
import React from 'react';
import { 
  Calendar, 
  Trash2, 
  ArrowRight,
  Layers,
  Paperclip,
  AlertCircle
} from 'lucide-react';
import { Task, Status, Priority, Member } from '../types';

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: Status) => void;
  onDelete: () => void;
  onEdit: () => void;
  member?: Member;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete, onEdit, member }) => {
  const priorityColors = {
    [Priority.HIGH]: 'text-rose-600 dark:text-rose-500 bg-rose-500/5 border-rose-500/10',
    [Priority.MEDIUM]: 'text-amber-600 dark:text-amber-500 bg-amber-500/5 border-amber-500/10',
    [Priority.LOW]: 'text-blue-600 dark:text-sky-500 bg-sky-500/5 border-sky-500/10',
  };

  const nextStatus = task.status === Status.TODO ? Status.IN_PROGRESS : Status.DONE;

  const isOverdue = () => {
    if (task.status === Status.DONE) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  };

  const isDueToday = () => {
    if (task.status === Status.DONE) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate === today;
  };

  return (
    <div 
      onClick={onEdit}
      className="group relative bg-white dark:bg-[#0f172a]/40 border border-slate-200 dark:border-slate-800/40 hover:border-indigo-500 dark:hover:border-slate-600/60 rounded-2xl p-5 transition-all duration-300 cursor-pointer backdrop-blur-sm shadow-sm hover:shadow-xl dark:hover:shadow-black/50"
    >
      <div className="flex items-start justify-between mb-4">
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        
        <div className="flex items-center gap-2">
          {member && (
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-800"
              title={member.name}
            />
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-300 dark:text-slate-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <h3 className={`font-bold text-slate-900 dark:text-slate-100 mb-1.5 leading-tight tracking-tight text-[15px] group-hover:text-indigo-600 dark:group-hover:text-white transition-colors ${task.status === Status.DONE ? 'line-through text-slate-400 dark:text-slate-600' : ''}`}>
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium">
          {task.description}
        </p>
      )}

      {task.subtasks.length > 0 && (
        <div className="mb-5 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
          <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-600 mb-2 font-black uppercase tracking-widest">
            <span>Actions</span>
            <span>{Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)}%</span>
          </div>
          <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-700 ease-out" 
              style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/40 mt-auto">
        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
            isOverdue() ? 'bg-rose-500/10 text-rose-600' : 
            isDueToday() ? 'bg-amber-500/10 text-amber-600' : ''
          }`}>
            {isOverdue() ? <AlertCircle size={12} /> : <Calendar size={12} strokeWidth={2.5} />}
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          {task.attachments.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Paperclip size={12} strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{task.attachments.length}</span>
            </div>
          )}
        </div>

        {task.status !== Status.DONE && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(nextStatus);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-600 hover:text-white border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-lg transition-all group/btn shadow-sm dark:shadow-none"
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover/btn:text-white transition-colors">Move</span>
            <ArrowRight size={12} className="text-slate-400 group-hover/btn:text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
