
import React from 'react';
import { 
  LayoutGrid, 
  List, 
  Settings, 
  ChevronLeft,
  CircleCheck,
  LayoutDashboard,
  Plus
} from 'lucide-react';
import { Project } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: 'dashboard' | 'board' | 'list';
  setActiveTab: (tab: 'dashboard' | 'board' | 'list') => void;
  projects: Project[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  onCreateProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  activeTab, 
  setActiveTab,
  projects,
  activeProjectId,
  setActiveProjectId,
  onCreateProject
}) => {
  return (
    <aside 
      className={`fixed lg:static z-30 h-full bg-white dark:bg-[#020617] border-r border-slate-200 dark:border-slate-900 transition-all duration-500 ease-in-out ${
        isOpen ? 'w-64 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="h-20 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-600/20">
              <CircleCheck size={20} className="text-white" strokeWidth={2.5} />
            </div>
            {isOpen && <span className="font-black text-lg tracking-tighter text-slate-900 dark:text-white">EZY<span className="text-indigo-500">TASK</span></span>}
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-400 dark:text-slate-600 transition-colors"
          >
            <ChevronLeft size={16} className={!isOpen ? 'rotate-180' : ''} />
          </button>
        </div>

        <nav className="flex-1 py-10 px-4 space-y-2 overflow-y-auto">
          {/* Main View Nav - Hidden on mobile, handled by bottom nav */}
          <div className="hidden lg:block space-y-2 mb-8">
            <p className="px-4 text-[9px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.2em] mb-4">View</p>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all group ${
                activeTab === 'dashboard' 
                  ? 'bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800' 
                  : 'text-slate-500 hover:text-indigo-500 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              <LayoutDashboard size={18} className={activeTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-slate-400'} />
              {isOpen && <span className="tracking-wide">Overview</span>}
            </button>

            <button
              onClick={() => setActiveTab('board')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all group ${
                activeTab === 'board' 
                  ? 'bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800' 
                  : 'text-slate-500 hover:text-indigo-500 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              <LayoutGrid size={18} className={activeTab === 'board' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-slate-400'} />
              {isOpen && <span className="tracking-wide">Board View</span>}
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all group ${
                activeTab === 'list' 
                  ? 'bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800' 
                  : 'text-slate-500 hover:text-indigo-500 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              <List size={18} className={activeTab === 'list' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-slate-400'} />
              {isOpen && <span className="tracking-wide">Task List</span>}
            </button>
          </div>

          <div className="pt-4 lg:border-t lg:border-slate-100 lg:dark:border-slate-900">
            <div className={`flex items-center justify-between px-4 mb-4 ${!isOpen && 'flex-col gap-4'}`}>
              {isOpen && <p className="text-[9px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.2em]">Workspaces</p>}
              <button 
                onClick={onCreateProject}
                className={`p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-indigo-500 transition-all ${!isOpen && 'bg-indigo-500/10 p-2'}`}
                title="New Project"
              >
                <Plus size={isOpen ? 12 : 16} strokeWidth={3} />
              </button>
            </div>
            
            <div className={`space-y-1 ${!isOpen && 'flex flex-col items-center'}`}>
              {projects.map((workspace) => (
                <button 
                  key={workspace.id} 
                  onClick={() => setActiveProjectId(workspace.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all ${
                    activeProjectId === workspace.id
                      ? 'bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                  } ${!isOpen && 'justify-center px-0 w-10 h-10'}`}
                  title={workspace.name}
                >
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${workspace.color} ${activeProjectId === workspace.id && 'ring-4 ring-offset-2 ring-indigo-500/20'}`} />
                  {isOpen && <span className="truncate">{workspace.name}</span>}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-900/50">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all justify-center lg:justify-start">
            <Settings size={18} />
            {isOpen && <span className="tracking-wide">Preferences</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
