import { useContextApp } from "@/app/contextApp";
import { deleteProject } from "@/app/functions/projectActions";
import { deleteTask } from "@/app/functions/taskFunctions";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

export default function ConfirmationWindow({}: Props) {
  const {
    openConfirmationWindowObject: {
      openConfirmationWindow,
      setOpenConfirmationWindow,
    },
    selectedProjectObject: { selectedProject, setSelectedProject },
    allProjectsObject: { allProjects, setAllProjects },
    chosenProjectObject: { chosenProject, setChosenProject },
    selectedTaskObject: { selectedTask },
    allTasksObject: { allTasks, setAllTasks },
  } = useContextApp();

  const [buttonOptions, setButtonOptions] = useState([
    { id: 1, name: "Cancel" },
    { id: 2, name: "Delete" },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [header, setHeader] = useState("");
  const [message, setMessage] = useState("");

  const confirmationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        confirmationContainer.current &&
        !confirmationContainer.current.contains(event.target as Node)
      ) {
        setOpenConfirmationWindow(false);
      }
    }

    if (openConfirmationWindow) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openConfirmationWindow, setOpenConfirmationWindow]);

  function handleCancel() {
    setOpenConfirmationWindow(false);
    setSelectedProject(null);
  }

  async function handleDelete() {
    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (selectedProject) {
        deleteProject(
          selectedProject,
          setSelectedProject,
          setOpenConfirmationWindow,
          allProjects,
          setAllProjects,
          setAllTasks,
        );
        toast.success("Project deleted successfully");
      } else if (selectedTask) {
        deleteTask({
          taskToDelete: selectedTask,
          allProjects,
          chosenProject,
          setAllTasks,
          setChosenProject,
          setAllProjects,
        });
        toast.success("Task deleted successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong when deleting the project...");
    } finally {
      setIsLoading(false);
      setOpenConfirmationWindow(false);
      // Set the chosen project only if we're going to delete a project

      selectedTask === null && setChosenProject(null);
    }
  }

  useEffect(() => {
    if (selectedProject) {
      setHeader("Project");
      setMessage(
        ` Are you sure you want to remove this project? This action cannot be undone, and will remove all projects associated with it `,
      );
    } else if (selectedTask) {
      setHeader("Task");
      setMessage(
        ` Are you sure you want to delete this task? This action cannot be undone.`,
      );
    }
  }, [selectedProject, selectedTask]);

  return (
    <div
      ref={confirmationContainer}
      className={`flex flex-col justify-center items-start p-10 gap-5 rounded-lg w-[48%] max-sm:w-[91%] z-90 left-1/2 top-[47%] -translate-y-1/2 -translate-x-1/2 absolute bg-white border-slate-50 shandow-md ${openConfirmationWindow ? "block" : "hidden"}`}
    >
      <div className="flex flex-row font-semibold text-lg">
        <p className="">{`Delete ${header}:`}</p>
        <span className="mx-2 text-slate-400">{`${selectedProject?.title ?? selectedTask?.title}`}</span>
      </div>
      <p>{message}</p>
      <div className="flex flex-row w-full justify-end gap-5 items-right">
        {buttonOptions.map((button) => (
          <button
            key={button.id}
            className={`${button.name === "Delete" ? "bg-orange-600 text-white border-orange-200 hover:bg-orange-500" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"} p-2 px-5 rounded-lg  border hover:scale-105`}
            onClick={button.name === "Cancel" ? handleCancel : handleDelete}
          >
            {isLoading ? `${button.name} ...` : button.name}
          </button>
        ))}
      </div>
    </div>
  );
}
