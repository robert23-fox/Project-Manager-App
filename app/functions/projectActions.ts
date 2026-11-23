import { v4 as uuidv4 } from "uuid";
import { Project, Task } from "../Data/AllProjects";
import { Dispatch, SetStateAction } from "react";
import { IconData } from "../types/AppTypes";
import { FormData } from "../Components/Window/ProjectWindow";
import toast from "react-hot-toast";

export function addNewProject(
  data: FormData,
  allProjects: Project[],
  setAllProjects: Dispatch<SetStateAction<Project[]>>,
  setOpenProjectWindow: Dispatch<SetStateAction<boolean>>,
  selectedIcon: IconData | null,
  reset: () => void,
) {
  try {
    const newProject: Project = {
      id: uuidv4(),
      clerkUserId: "123",
      title: data.projectName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: selectedIcon?.name || "LibraryBooks",
      tasks: [],
    };
    setAllProjects([...allProjects, newProject]);
    setOpenProjectWindow(false);
    reset();
  } catch (error) {
    console.log(error);
  }
}

export function deleteProject(
  selectedProject: Project | null,
  setSelectedProject: Dispatch<SetStateAction<Project | null>>,
  setOpenConfirmationWindow: Dispatch<SetStateAction<boolean>>,
  allProjects: Project[],
  setAllProjects: Dispatch<SetStateAction<Project[]>>,
  setAllTasks: Dispatch<SetStateAction<Task[]>>,
) {
  if (!selectedProject) return;

  const filteredProjects = allProjects.filter(
    (project) => project.id !== selectedProject.id,
  );

  const updatedTasks = filteredProjects.flatMap((project) => project.tasks);

  setAllProjects(filteredProjects);
  setAllTasks(updatedTasks);

  setSelectedProject(null);
  setOpenConfirmationWindow(false);
}

export function editProject(
  selectedProject: Project | null,
  setSelectedProject: Dispatch<SetStateAction<Project | null>>,
  data: FormData,
  selectedIcon: IconData | null,
  allProjects: Project[],
  setAllProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setOpenProjectWindow: React.Dispatch<React.SetStateAction<boolean>>,
  allTasks: Task[],
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>,
) {
  if (selectedProject) {
    const updateProject: Project = {
      ...selectedProject,
      title: data.projectName,
      icon: selectedIcon?.name || "LibraryBooks",
      tasks: selectedProject.tasks.map((task) => ({
        ...task,
        projectName: data.projectName,
      })),
    };

    const updateAllProjects = allProjects.map((project) => {
      if (project.id === selectedProject.id) {
        return updateProject;
      }

      return project;
    });

    // Update allTasks
    const updateAllTasks = allTasks.map((task) =>
      task.projectName === selectedProject.title
        ? { ...task, projectName: data.projectName }
        : task,
    );

    setAllTasks(updateAllTasks);

    setAllProjects(updateAllProjects);
    setSelectedProject(null);
    setOpenProjectWindow(false);
  }
}
