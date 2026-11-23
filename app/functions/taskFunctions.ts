import { Project, Task } from "../Data/AllProjects";
import { DeleteTaskProps } from "../types/AppTypes";

export function deleteTask({
  taskToDelete,
  allProjects,
  chosenProject,
  setAllTasks,
  setChosenProject,
  setAllProjects,
}: DeleteTaskProps): void {
  // 1. Remove the task from all projects
  const updateProjects = allProjects.map((proj) => ({
    ...proj,
    tasks: proj.tasks.filter((task) => task.id !== taskToDelete.id),
  }));

  // 2. Update all Task array
  const updateAllTasks = updateProjects.flatMap((proj) => proj.tasks);
  setAllTasks(updateAllTasks);

  // 3. Update the chosen project if necessary
  if (
    chosenProject &&
    chosenProject.tasks.some((task) => task.id === taskToDelete.id)
  ) {
    const updatedChosenProject = {
      ...chosenProject,
      tasks: chosenProject.tasks.filter((task) => task.id !== taskToDelete.id),
    };

    setChosenProject(updatedChosenProject);
  }

  // 4. Update all projects
  setAllProjects(updateProjects);
}

export function updateTaskAndProjects({
  updateTask,
  allProjects,
  chosenProject,
  setChosenProject,
  setAllTasks,
  setAllProjects,
}: {
  updateTask: Task;
  allProjects: Project[];
  chosenProject: Project | null;
  setChosenProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setAllProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}) {
  // To update everything, we are going to follow 4 steps:
  //1- Create the task object we need to update;
  //2- Restructure the all Projects array to move the task that its project changed
  //3- Update the all tasks array that we are using to show all the tasks
  //4- Update the chosen project that we are using to select the project in the drop down

  //1 -
  // const updateTask: Task = {
  //   ...selectedTask,
  //   title: data.taskName,
  //   icon: selectedIcon?.name || "LibraryBooksIcon",
  //   status: selectedTask.status,
  //   projectName: project?.title ?? selectedTask.projectName,
  //   priority: priority?.name ?? selectedTask.priority,
  //   updatedAt: new Date().toISOString(),
  // };

  //2- Update the all projects tasks array to move the task that to the project id it has been changed
  const updatedProjects = allProjects.map((proj) => {
    if (proj.title === updateTask.projectName) {
      // If this is the correct project, either add or update the task
      const taskExists = proj.tasks.some((task) => task.id === updateTask.id);
      if (taskExists) {
        // Update the existing task
        return {
          ...proj,
          tasks: proj.tasks.map((task) =>
            task.id === updateTask.id ? updateTask : task,
          ),
        };
      } else {
        // Add the task to this project
        return { ...proj, tasks: [...proj.tasks, updateTask] };
      }
    } else {
      // For other projects, remove the task if it exists
      return {
        ...proj,
        tasks: proj.tasks.filter((task) => task.id !== updateTask.id),
      };
    }
  });

  //3- Update all tasks array

  if (chosenProject) {
    const updatedChosenProject = updatedProjects.find(
      (proj) => proj.id === chosenProject.id,
    );

    if (updatedChosenProject) {
      setChosenProject(updatedChosenProject);
    }
  }

  const updateAllTasks = updatedProjects.flatMap((proj) => proj.tasks);

  setAllTasks(updateAllTasks);
  setAllProjects(updatedProjects);
}
