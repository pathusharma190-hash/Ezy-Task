
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Menu,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Calendar,
  LayoutDashboard,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { Task, Status, Priority, Project, Member } from './types';
import Board from './components/Board';
import Sidebar from './components/Sidebar';
import TaskModal from './components/TaskModal';
import Dashboard from './components/Dashboard';
import ProjectModal from './components/ProjectModal';

const DUMMY_MEMBERS: Member[] = [
  { id: 'm1', name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', role: 'Designer' },
  { id: 'm2', name: 'Jordan Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', role: 'Manager' },
  { id: 'm3', name: 'Sam Taylor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam', role: 'Developer' },
];

const DUMMY_PROJECTS: Project[] = [
  { id: 'p1', name: 'Core Strategy', color: 'bg-emerald-500' },
  { id: 'p2', name: 'Operations', color: 'bg-indigo-500' },
  { id: 'p3', name: 'Growth', color: 'bg-rose-500' }
];

const DUMMY_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Finalize Q4 Roadmap',
    description: 'Prepare the presentation for the stakeholders meeting.',
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH,
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    tags: ['strategy'],
    subtasks: [{ id: 's1', title: 'Gather data', completed: true }],
    assigneeId: 'm2',
    attachments: ['Roadmap_Draft.pdf'],
    createdAt: Date.now() - 1000000,
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Brand Refresh Guidelines',
    description: 'Update the color palette for the new campaign.',
    status: Status.TODO,
    priority: Priority.MEDIUM,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    tags: ['design'],
    subtasks: [],
    assigneeId: 'm1',
    attachments: [],
    createdAt: Date.now() - 2000000,
  }
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members] = useState<Member[]>(DUMMY_MEMBERS);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'board' | 'list'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTasks = localStorage.getItem('ezytask_tasks');
    const savedProjects = localStorage.getItem('ezytask_projects');
    const savedTheme = localStorage.getItem('ezytask_theme') as 'light' | 'dark';
    
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects);
      if (parsedProjects.length > 0) setActiveProjectId(parsedProjects[0].id);
    } else {
      setProjects(DUMMY_PROJECTS);
      setActiveProjectId(DUMMY_PROJECTS[0].id);
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(DUMMY_TASKS);
    }

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ezytask_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ezytask_projects', JSON.stringify(projects));
  }, [projects]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('ezytask_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || Status.TODO,
      priority: taskData.priority || Priority.MEDIUM,
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      attachments: taskData.attachments || [],
      assigneeId: taskData.assigneeId,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
    setIsModalOpen(false);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleCreateProject = (name: string, color: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      color
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const filteredTasks = tasks.filter(task => 
    (task.projectId === activeProjectId) &&
    (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getActiveTabTitle = () => {
    const currentProj = projects.find(p => p.id === activeProjectId);
    switch (activeTab) {
      case 'dashboard': return currentProj ? `${currentProj.name}` : 'Overview';
      case 'board': return 'Board';
      case 'list': return 'List';
      default: return 'EZY Task';
    }
  };

  const isOverdue = (dueDate: string, status: Status) => {
    if (status === Status.DONE) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden font-inter transition-colors duration-300`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab as any} 
        projects={projects}
        activeProjectId={activeProjectId}
        setActiveProjectId={(id) => {
          setActiveProjectId(id);
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }}
        onCreateProject={() => setIsProjectModalOpen(true)}
      />

      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-slate-900 bg-white/70 dark:bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500 lg:hidden transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {getActiveTabTitle()}
              </h1>
              <p className="hidden md:block text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">
                {filteredTasks.length} items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Find..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 md:pl-11 pr-3 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-32 md:w-64 text-sm transition-all placeholder-slate-400 dark:placeholder-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 md:p-2.5 bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-all"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button 
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] md:text-xs font-bold tracking-wide transition-all shadow-xl shadow-indigo-600/10 dark:shadow-indigo-600/20"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">CREATE</span>
              <span className="sm:hidden">NEW</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-gradient-to-b from-white to-slate-50 dark:from-[#020617] dark:to-[#01040a] transition-colors duration-300">
          {activeTab === 'dashboard' && (
            <Dashboard 
              tasks={filteredTasks} 
              onEditTask={(task) => {
                setEditingTask(task);
                setIsModalOpen(true);
              }}
              onViewAll={() => setActiveTab('list')}
            />
          )}
          {activeTab === 'board' && (
            <Board 
              tasks={filteredTasks} 
              onUpdateTask={updateTask} 
              onDeleteTask={deleteTask}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsModalOpen(true);
              }}
              members={members}
            />
          )}
          {activeTab === 'list' && (
            <div className="max-w-4xl mx-auto space-y-3 animate-fade-in">
               {[...filteredTasks].sort((a,b) => a.dueDate.localeCompare(b.dueDate)).map(task => (
                 <div 
                   key={task.id} 
                   className="p-4 md:p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl flex items-center justify-between group hover:border-indigo-500 dark:hover:border-slate-700 hover:shadow-lg dark:hover:bg-slate-900/60 transition-all cursor-pointer"
                   onClick={() => {
                     setEditingTask(task);
                     setIsModalOpen(true);
                   }}
                 >
                    <div className="flex items-center gap-3 md:gap-5 min-w-0">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTask(task.id, { status: task.status === Status.DONE ? Status.TODO : Status.DONE });
                        }}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          task.status === Status.DONE 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-slate-300 dark:border-slate-700 group-hover:border-indigo-500'
                        }`}
                      >
                        {task.status === Status.DONE && <CheckCircle2 size={12} className="text-white" />}
                      </button>
                      <div className="truncate">
                        <h3 className={`font-semibold tracking-tight truncate ${task.status === Status.DONE ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-900 dark:text-slate-200'}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-[10px] md:text-[11px] text-slate-500 font-medium uppercase tracking-tighter">{task.status}</p>
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isOverdue(task.dueDate, task.status) ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                            <Calendar size={10} />
                            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6 shrink-0">
                      {task.assigneeId && (
                        <img 
                          src={members.find(m => m.id === task.assigneeId)?.avatar} 
                          alt="assignee" 
                          className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-slate-200 dark:border-slate-700"
                        />
                      )}
                      <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                        task.priority === Priority.HIGH ? 'bg-rose-500/10 text-rose-600 dark:text-rose-500' : 
                        task.priority === Priority.MEDIUM ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500' : 
                        'bg-blue-500/10 text-blue-600 dark:text-blue-500'
                      }`}>
                        {task.priority}
                      </span>
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 dark:group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                    </div>
                 </div>
               ))}
               {filteredTasks.length === 0 && (
                 <div className="py-20 text-center opacity-30 uppercase text-[10px] font-black tracking-[0.3em] text-slate-500 dark:text-slate-700">
                   Empty
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-900 px-6 flex items-center justify-around z-20">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Dash</span>
          </button>
          <button 
            onClick={() => setActiveTab('board')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'board' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
          >
            <LayoutGrid size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Board</span>
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'list' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
          >
            <ListIcon size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">List</span>
          </button>
        </nav>
      </main>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={editingTask ? (data) => updateTask(editingTask.id, data) : addTask}
        task={editingTask}
        members={members}
      />

      <ProjectModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleCreateProject}
      />
    </div>
  );
};

export default App;
