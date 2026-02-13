
import React from 'react';
import { Status, Task, Member } from '../types';
import TaskCard from './TaskCard';
import { MoreHorizontal } from 'lucide-react';

interface BoardProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  members: Member[];
}

const Board: React.FC<BoardProps> = ({ tasks, onUpdateTask, onDeleteTask, onEditTask, members }) => {
  const columns: { title: string; status: Status }[] = [
    { title: 'TO DO', status: Status.TODO },
    { title: 'IN PROGRESS', status: Status.IN_PROGRESS },
    { title: 'DONE', status: Status.DONE },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    const taskId = e.dataTransfer.getData('taskId');
    onUpdateTask(taskId, { status });
  };

  return (
    <div className="flex gap-8 h-full min-w-max pb-4">
      {columns.map((col) => (
        <div 
          key={col.status} 
          className="w-80 flex flex-col h-full animate-fade-in"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.status)}
        >
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-3">
              <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-50 uppercase">{col.title}</h2>
              <span className="bg-slate-200 dark:bg-slate-900/60 text-slate-600 dark:text-slate-500 text-[10px] px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-800 font-bold">
                {tasks.filter(t => t.status === col.status).length}
              </span>
            </div>
            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-900 rounded-md text-slate-400 dark:text-slate-700 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
             {tasks.filter(t => t.status === col.status).map(task => (
               <div 
                 key={task.id} 
                 draggable 
                 onDragStart={(e) => handleDragStart(e, task.id)}
                 className="cursor-grab active:cursor-grabbing"
               >
                 <TaskCard 
                   task={task} 
                   onStatusChange={(status) => onUpdateTask(task.id, { status })}
                   onDelete={() => onDeleteTask(task.id)}
                   onEdit={() => onEditTask(task)}
                   member={members.find(m => m.id === task.assigneeId)}
                 />
               </div>
             ))}
             
             {tasks.filter(t => t.status === col.status).length === 0 && (
               <div className="h-32 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 transition-colors hover:border-slate-400 dark:hover:border-slate-700">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Drop items here</span>
               </div>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Board;
