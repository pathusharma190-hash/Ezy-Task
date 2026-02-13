
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Status {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  tags: string[];
  subtasks: SubTask[];
  assigneeId?: string;
  attachments: string[];
  createdAt: number;
}

export interface AIInsight {
  summary: string;
  priorityTasks: string[];
  productivityTip: string;
}
