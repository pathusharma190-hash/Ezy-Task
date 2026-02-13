
import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  BarChart3, 
  ArrowUpRight,
  Target,
  Layers,
  Calendar
} from 'lucide-react';
import { Task, Status, Priority } from '../types';

interface DashboardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onViewAll: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onEditTask, onViewAll }) => {
  const completedCount = tasks.filter(t => t.status === Status.DONE).length;
  const inProgressCount = tasks.filter(t => t.status === Status.IN_PROGRESS).length;
  const highPriorityCount = tasks.filter(t => t.priority === Priority.HIGH).length;
  const totalTasks = tasks.length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Prioritize upcoming tasks that are not done
  const upcomingTasks = [...tasks]
    .filter(t => t.status !== Status.DONE)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const isOverdue = (dueDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total', value: totalTasks, icon: Layers, color: 'text-slate-400 dark:text-slate-500' },
          { label: 'Efficiency', value: `${completionRate}%`, icon: CheckCircle, color: 'text-emerald-500' },
          { label: 'Active', value: inProgressCount, icon: Clock, color: 'text-indigo-500 dark:text-indigo-400' },
          { label: 'Urgent', value: highPriorityCount, icon: AlertCircle, color: 'text-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:shadow-xl dark:hover:bg-slate-900/60 transition-all group">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className={`p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-slate-100 dark:bg-slate-800/50 ${stat.color}`}>
                <stat.icon size={16} className="md:w-5 md:h-5" />
              </div>
              <ArrowUpRight size={14} className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 dark:group-hover:text-slate-400 transition-colors" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">{stat.label}</p>
            <h4 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Performance Chart Visualization */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <div>
              <h3 className="text-base md:text-lg font-black tracking-tight mb-1 text-slate-900 dark:text-white uppercase">Activity</h3>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Weekly cycle performance</p>
            </div>
            <div className="flex gap-2">
               <div className="px-2 md:px-3 py-1 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/20 rounded-full text-[8px] md:text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Live</div>
            </div>
          </div>
          
          <div className="h-48 md:h-64 flex items-end justify-between gap-2 md:gap-4 px-2 md:px-4">
            {[40, 70, 45, 90, 65, 85, 60].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 md:gap-3 group">
                <div className="w-full relative bg-slate-100 dark:bg-slate-800/30 rounded-full overflow-hidden h-full">
                  <div 
                    className="absolute bottom-0 w-full bg-indigo-500/20 dark:bg-indigo-600/40 group-hover:bg-indigo-500 transition-all duration-700 ease-out rounded-full"
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Stream */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">Focus Next</h3>
            <button onClick={onViewAll} className="text-[9px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">View All</button>
          </div>
          
          <div className="flex-1 space-y-4 md:space-y-6">
            {upcomingTasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => onEditTask(task)}
                className="flex items-start gap-3 md:gap-4 cursor-pointer group"
              >
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                  task.priority === Priority.HIGH ? 'bg-rose-500' : 
                  task.priority === Priority.MEDIUM ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <h5 className="text-[12px] md:text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors truncate tracking-tight">{task.title}</h5>
                  <div className="flex items-center gap-3 mt-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                    <span className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-rose-500 font-black' : 'text-slate-400 dark:text-slate-600'}`}>
                      <Calendar size={10} /> 
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {isOverdue(task.dueDate) && ' • OVERDUE'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-10 md:py-20">
                <BarChart3 size={32} className="mb-4 text-slate-400" />
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">All caught up</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goal Target Section */}
      <div className="bg-gradient-to-br from-indigo-500/5 to-white dark:from-indigo-600/10 dark:to-transparent border border-slate-200 dark:border-indigo-500/10 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-sm">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-black tracking-tighter mb-2 md:mb-3 text-slate-900 dark:text-white uppercase">Your Potential</h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">
            Consistent execution rhythm. Keep maintaining this focus to hit end-cycle milestones.
          </p>
        </div>
        <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%" cy="50%" r="40%"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800/40"
            />
            <circle
              cx="50%" cy="50%" r="40%"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="100 100"
              strokeDashoffset={100 - completionRate}
              pathLength="100"
              strokeLinecap="round"
              fill="transparent"
              className="text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg md:text-xl font-black tracking-tighter text-slate-900 dark:text-white">{completionRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
