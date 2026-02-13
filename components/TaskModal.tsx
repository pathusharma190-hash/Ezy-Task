import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Plus, Trash2, CheckCircle2, User, Paperclip } from 'lucide-react';
import { Task, Status, Priority, SubTask, Member } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task: Task | null;
  members: Member[];
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task, members }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(Status.TODO);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setSubtasks(task.subtasks);
      setAttachments(task.attachments || []);
      setAssigneeId(task.assigneeId || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus(Status.TODO);
      setPriority(Priority.MEDIUM);
      setDueDate(new Date().toISOString().split('T')[0]);
      setSubtasks([]);
      setAttachments([]);
      setAssigneeId('');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setAttachments([...attachments, fileName]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in transition-all">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
          <h2 className="text-lg font-black tracking-tighter uppercase text-slate-900 dark:text-white">{task ? 'Edit Item' : 'New Task Item'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          <div className="space-y-6">
            <input 
              type="text" 
              placeholder="Give your task a clear title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-black bg-transparent border-none focus:ring-0 placeholder-slate-200 dark:placeholder-slate-800 text-slate-900 dark:text-white tracking-tight"
              required
            />
            
            <textarea 
              placeholder="Briefly describe the objective..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Flag size={12} strokeWidth={3} /> Importance
              </label>
              <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl">
                {Object.values(Priority).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                      priority === p 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 dark:shadow-indigo-600/20' 
                        : 'text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} strokeWidth={3} /> Deadline
              </label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl px-5 py-2 text-[13px] font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User size={12} strokeWidth={3} /> Assignee
              </label>
              <select 
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl px-5 py-2 text-[13px] font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 appearance-none"
              >
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Paperclip size={12} strokeWidth={3} /> Documents
              </label>
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl px-5 py-2 text-[13px] font-bold text-slate-400 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                   <span>Attach File</span>
                   <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Attachments
              </label>
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <Paperclip size={10} />
                    {file}
                    <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-rose-500">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Breakdown Actions
            </label>
            
            <div className="space-y-2">
              {subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl group transition-colors hover:bg-slate-100 dark:hover:bg-slate-900/40">
                  <button 
                    type="button"
                    onClick={() => setSubtasks(subtasks.map(s => s.id === sub.id ? { ...s, completed: !s.completed } : s))}
                    className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                      sub.completed ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-700 hover:text-slate-600 dark:hover:text-slate-500'
                    }`}
                  >
                    {sub.completed && <CheckCircle2 size={12} strokeWidth={3} />}
                  </button>
                  <span className={`flex-1 text-[13px] font-medium tracking-tight ${sub.completed ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {sub.title}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setSubtasks(subtasks.filter(s => s.id !== sub.id))}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 dark:text-slate-700 hover:text-rose-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Add a specific action item..." 
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), (newSubtaskTitle && (setSubtasks([...subtasks, { id: crypto.randomUUID(), title: newSubtaskTitle, completed: false }]), setNewSubtaskTitle(''))))}
                className="flex-1 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700 dark:text-slate-100"
              />
              <button 
                type="button"
                onClick={() => (newSubtaskTitle && (setSubtasks([...subtasks, { id: crypto.randomUUID(), title: newSubtaskTitle, completed: false }]), setNewSubtaskTitle('')))}
                className="px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-[#0f172a] flex items-center justify-end gap-6">
          <button 
            type="button"
            onClick={onClose}
            className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave({ title, description, status, priority, dueDate, subtasks, attachments, assigneeId })}
            className="px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/10 dark:shadow-indigo-600/30 transition-all active:scale-95"
          >
            Finalize Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;