import { v4 as uuidv4 } from "uuid";

export type Task = {
  id: string;
  title: string;
  icon: string;
  projectName: string;
  status: "Planned" | "In Progress" | "Completed" | "Canceled";
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  updatedAt: string;
};

// Define the structure for a project
export type Project = {
  id: string;
  clerkUserId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  icon: string;

  tasks: Task[];
};

// Sample data with three tasks
export const projectsData: Project[] = [
  {
    id: uuidv4(),
    clerkUserId: "123",
    title: "Project Title 1",
    createdAt: "2026-04-21T10:00:00Z",
    updatedAt: "2026-05-21T13:00:00Z",
    icon: "LocalLibrary",

    tasks: [
      {
        id: uuidv4(),
        title: "Create the UI Design of the task",
        icon: "Movie",
        projectName: "Project Title 1",
        status: "In Progress",
        priority: "Low",
        createdAt: "2026-08-21T10:00:00Z",
        updatedAt: "2026-08-21T14:30:00Z",
      },
      {
        id: uuidv4(),
        title: "Develop the Backend API",
        icon: "Code",
        projectName: "Project Title 1",
        status: "In Progress",
        priority: "High",
        createdAt: "2026-08-21T11:00:00Z",
        updatedAt: "2026-08-21T15:00:00Z",
      },
      {
        id: uuidv4(),
        title: "Develop the Backend API",
        icon: "Code",
        projectName: "Project Title 1",
        status: "In Progress",
        priority: "High",
        createdAt: "2026-08-21T11:00:00Z",
        updatedAt: "2026-08-21T15:00:00Z",
      },
      {
        id: uuidv4(),
        title: "Develop the Backend API",
        icon: "Code",
        projectName: "Project Title 1",
        status: "In Progress",
        priority: "High",
        createdAt: "2026-08-21T11:00:00Z",
        updatedAt: "2026-08-21T15:00:00Z",
      },
    ],
  },
  {
    id: uuidv4(),
    clerkUserId: "123",
    title: "Project Title 2",
    createdAt: "2026-08-21T10:00:00Z",
    updatedAt: "2026-08-21T13:00:00Z",
    icon: "Link",

    tasks: [
      {
        id: uuidv4(),
        title: "Create the UI Design of the task",
        icon: "Movie",
        projectName: "Project Title 2",
        status: "Completed",
        priority: "Low",
        createdAt: "2026-08-21T10:00:00Z",
        updatedAt: "2026-08-21T14:30:00Z",
      },
      {
        id: uuidv4(),
        title: "Develop the Backend API",
        icon: "Code",
        projectName: "Project Title 2",
        status: "Completed",
        priority: "High",
        createdAt: "2026-08-21T11:00:00Z",
        updatedAt: "2026-08-21T15:00:00Z",
      },
    ],
  },

  {
    id: uuidv4(),
    clerkUserId: "123",
    title: "Project Title 3",
    createdAt: "2026-08-21T10:00:00Z",
    updatedAt: "2026-08-21T13:00:00Z",
    icon: "Link",

    tasks: [],
  },
];
