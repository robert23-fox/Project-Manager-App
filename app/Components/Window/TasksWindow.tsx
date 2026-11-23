import { useContextApp } from "@/app/contextApp";
import * as z from "zod";
import { Project, Task } from "@/app/Data/AllProjects";
import {
  createContext,
  MouseEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import TasksDropDown from "../DropDowns/TasksDropDown";
import {
  CloseOutlined,
  KeyboardArrowDown,
  LibraryBooks,
} from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getIconComponent } from "@/app/functions/IconsActions";

const schema = z.object({
  taskName: z
    .string()
    .min(1, { message: "Task name is required" })
    .max(30, { message: "Task name must have 30 characters or less" }),
});
import { v4 as uuidv4 } from "uuid";
import { allIconsArray } from "@/app/Data/AllIcons";
import toast from "react-hot-toast";
import { DeleteTaskProps } from "@/app/types/AppTypes";
import { updateTaskAndProjects } from "@/app/functions/taskFunctions";

export type PriorityLevel = "Low" | "Medium" | "High";

export type FormDataTask = z.infer<typeof schema>;

export type SortingDropDownPosition = {
  left: number;
  top: number;
  width: number;
};

export type Priority = {
  id: number;
  name: PriorityLevel;
  icon: React.ReactNode;
  isSelected: boolean;
};

export type ProjectWithSelection = Project & {
  isSelected: boolean;
};

export type SelectionOption = "priority" | "project";

export type SelectionErrorsOption = {
  id: number;
  label: string;
  message: string;
  show: boolean;
};

type TaskFormType = {
  clickedSelectionObject: {
    clickedSelection: SelectionOption | null;
    setClickedSelection: React.Dispatch<
      React.SetStateAction<SelectionOption | null>
    >;
  };

  openTasksDropDownObject: {
    openTasksDropDown: boolean;
    setOpenTasksDropDown: React.Dispatch<React.SetStateAction<boolean>>;
  };

  taskDropDownPositionsObject: {
    taskDropDownPositions: SortingDropDownPosition;
    setTaskDropDownPositions: React.Dispatch<
      React.SetStateAction<SortingDropDownPosition>
    >;
  };

  priorityObject: {
    priority: Priority | null;
    setPriority: React.Dispatch<React.SetStateAction<Priority | null>>;
  };

  projectObject: {
    project: Project | null;
    setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  };

  priorityListObject: {
    priorityList: Priority[];
    setPriorityList: React.Dispatch<React.SetStateAction<Priority[]>>;
  };

  updateAllProjectsObject: {
    updateAllProjects: ProjectWithSelection[];
    setUpdateAllProjects: React.Dispatch<
      React.SetStateAction<ProjectWithSelection[]>
    >;
  };
  selectionErrorsObject: {
    selectionErrors: SelectionErrorsOption[];
    setSelectionErrors: React.Dispatch<
      React.SetStateAction<SelectionErrorsOption[]>
    >;
  };
  isLoadingObject: {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

const TaskFormState: TaskFormType = {
  clickedSelectionObject: {
    clickedSelection: null,
    setClickedSelection: () => {},
  },

  openTasksDropDownObject: {
    openTasksDropDown: false,
    setOpenTasksDropDown: () => {},
  },

  taskDropDownPositionsObject: {
    taskDropDownPositions: {
      left: 0,
      top: 0,
      width: 0,
    },
    setTaskDropDownPositions: () => {},
  },

  priorityObject: {
    priority: null,
    setPriority: () => {},
  },

  projectObject: {
    project: null,
    setProject: () => {},
  },

  priorityListObject: {
    priorityList: [],
    setPriorityList: () => {},
  },
  updateAllProjectsObject: {
    updateAllProjects: [],
    setUpdateAllProjects: () => {},
  },
  selectionErrorsObject: {
    selectionErrors: [],
    setSelectionErrors: () => {},
  },
  isLoadingObject: {
    isLoading: false,
    setIsLoading: () => {},
  },
};

const TaskFormContext = createContext<TaskFormType>(TaskFormState);

export function useTaskFormContext() {
  return useContext(TaskFormContext);
}

export default function TasksWindow() {
  const {
    allProjectsObject: { allProjects, setAllProjects },
    openTasksWindowObject: { openTasksWindow, setOpenTasksWindow },
    selectedIconObject: { selectedIcon, setSelectedIcon },
    chosenProjectObject: { chosenProject, setChosenProject },
    allTasksObject: { allTasks, setAllTasks },
    selectedTaskObject: { selectedTask, setSelectedTask },
    openIconsWindowObject: { openIconsWindow },
    projectClickedObject: { projectClicked, setProjectClicked },
  } = useContextApp();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    formState: { errors },
    reset,
  } = useForm<FormDataTask>({ resolver: zodResolver(schema) });

  const [clickedSelection, setClickedSelection] =
    useState<SelectionOption | null>(null);

  const [openTasksDropDown, setOpenTasksDropDown] = useState(false);

  const [taskDropDownPositions, setTaskDropDownPositions] =
    useState<SortingDropDownPosition>({
      left: 0,
      top: 0,
      width: 0,
    });

  const [priority, setPriority] = useState<Priority | null>(null);

  const [project, setProject] = useState<Project | null>(null);

  const [priorityList, setPriorityList] = useState<Priority[]>([
    {
      id: 1,
      name: "Low",
      icon: <CircleIcon className="text-[14px] text-green-500" />,
      isSelected: false,
    },
    {
      id: 2,
      name: "Medium",
      icon: <CircleIcon className="text-[14px] text-yellow-500" />,
      isSelected: false,
    },
    {
      id: 3,
      name: "High",
      icon: <CircleIcon className="text-[14px] text-red-500" />,
      isSelected: false,
    },
  ]);

  const [updateAllProjects, setUpdateAllProjects] = useState<
    ProjectWithSelection[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setUpdateAllProjects((prevProjects) => {
      return allProjects.map((project) => {
        const existingProject = prevProjects.find(
          (prevProject) => prevProject.id === project.id,
        );

        return {
          ...project,
          isSelected: existingProject?.isSelected ?? false,
        };
      });
    });
  }, [allProjects]);

  const taskWindowContainer = useRef<HTMLDivElement>(null);
  const tasksDropDownContainer = useRef<HTMLDivElement>(null);

  const [selectionErrors, setSelectionErrors] = useState([
    {
      id: 1,
      label: "priority",
      message: "Please select the priority",
      show: false,
    },
    {
      id: 2,
      label: "project",
      message: "Please select a project",
      show: false,
    },
  ]);

  // Handle resize and clicks outside the task window
  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      const target = event.target as Node;

      // If the icon picker is open, don't close the task window.
      if (openIconsWindow) return;

      const clickedInsideWindow = taskWindowContainer.current?.contains(target);

      const clickedInsideDropDown =
        tasksDropDownContainer.current?.contains(target);

      if (!clickedInsideWindow && !clickedInsideDropDown) {
        setOpenTasksWindow(false);
        setSelectedTask(null);
      }
    }

    function handleResize() {
      if (openIconsWindow) return;

      setOpenTasksWindow(false);
      setSelectedTask(null);
    }

    if (openTasksWindow) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [openTasksWindow, openIconsWindow, setOpenTasksWindow, setSelectedTask]);

  useLayoutEffect(() => {
    if (!selectedTask) {
      if (projectClicked) {
        setProject(projectClicked);
        setUpdateAllProjects((prevState) =>
          prevState.map((proj) => ({
            ...proj,
            isSelected: proj.id === projectClicked.id ? true : false,
          })),
        );
      } else {
        setProject(null);
      }
      reset();
      // Reset the priority and project states
      setPriority(null);
      setProject(null);
    } else {
      // update the input name
      setValue("taskName", selectedTask.title);

      // extract the priority from the priority list and update the priority state
      const getPriority = priorityList.find(
        (priority) => priority.name === selectedTask.priority,
      );
      if (getPriority) {
        setPriority(getPriority);
      }

      // extract the project from updateAllProjects list and update the project state
      const getProject = updateAllProjects.find(
        (project) =>
          project.title.toLowerCase() ===
          selectedTask.projectName.toLowerCase(),
      );
      if (getProject) {
        setProject(getProject);
      }

      //update the icon
      const findIconInAllIconsArray = allIconsArray.find(
        (icon) => icon.name === selectedTask.icon,
      );
      if (findIconInAllIconsArray) {
        setSelectedIcon(findIconInAllIconsArray);
      }
    }
    // Set the timeout
    setTimeout(() => setFocus("taskName"), 0);
    // Set all the show properties to false
    setSelectionErrors((prevState) =>
      prevState.map((error) => ({ ...error, show: false })),
    );
  }, [selectedTask]);

  const onSubmit: SubmitHandler<FormDataTask> = (data) => {
    if (project) {
      const findProject = updateAllProjects.find(
        (proj) => proj.id === project.id,
      );

      const findTask = findProject?.tasks.find(
        (task) => task.title.toLowerCase() === data.taskName.toLowerCase(),
      );

      if (findTask) {
        setError("taskName", {
          type: "manual",
          message: "Task already exists",
        });

        setFocus("taskName");
        return;
      }
    }

    const newErrors = selectionErrors.map((error) => {
      if (error.label === "priority" && !priority) {
        return { ...error, show: true };
      }

      if (error.label === "project" && !project) {
        return { ...error, show: true };
      }

      return { ...error, show: false };
    });

    // if the show properties are false when user clickes in submit
    // Then update or add a task
    if (newErrors.every((error) => error.show === false)) {
      console.log("success");
      tasksFunctions(data);
    }

    setSelectionErrors(newErrors);

    // Add your form submission login here
  };

  async function tasksFunctions(data: FormDataTask) {
    try {
      setIsLoading(true);
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Add new task
      // addNewTask(data);

      if (!selectedTask) {
        addNewTask(data);
      } else {
        const updateTask: Task = {
          ...selectedTask,
          title: data.taskName,
          icon: selectedIcon?.name || "LibraryBooksIcon",
          status: selectedTask.status,
          projectName: project?.title ?? selectedTask.projectName,
          priority: priority?.name ?? selectedTask.priority,
          updatedAt: new Date().toISOString(),
        };

        updateTaskAndProjects({
          updateTask,
          allProjects,
          chosenProject,
          setChosenProject,
          setAllTasks,
          setAllProjects,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.success(`Task ${selectedTask ? "edited" : "added"}  successfully`);
      setIsLoading(false);
      setOpenTasksWindow(false);
      setSelectedTask(null);
      setProjectClicked(null);
    }
  }

  function addNewTask(data: FormDataTask) {
    const newTask: Task = {
      id: uuidv4(),
      title: data.taskName,
      icon: selectedIcon ? selectedIcon?.name : "MenuBook",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: priority ? priority?.name : "Low",
      projectName: project?.title || "",
      status: "In Progress",
    };

    // Update all project array
    const updateAllProjects = allProjects.map((proj) => ({
      ...proj,
      tasks:
        proj.id === project?.id ? [...proj.tasks, newTask] : [...proj.tasks],
    }));

    // Update the chosen project state as well, so when the project is selected in all tasks page, I add the task, the number are going to be updated as well
    if (chosenProject && chosenProject.id === project?.id) {
      const copyChosenProject: Project = {
        ...chosenProject,
        tasks: [...chosenProject.tasks, newTask],
      };
      setChosenProject(copyChosenProject);
    }
    // Update the state
    setAllTasks([...allTasks, newTask]);

    setAllProjects(updateAllProjects);
  }

  return (
    <TaskFormContext.Provider
      value={{
        clickedSelectionObject: {
          clickedSelection,
          setClickedSelection,
        },

        openTasksDropDownObject: {
          openTasksDropDown,
          setOpenTasksDropDown,
        },

        taskDropDownPositionsObject: {
          taskDropDownPositions,
          setTaskDropDownPositions,
        },

        priorityObject: {
          priority,
          setPriority,
        },

        projectObject: {
          project,
          setProject,
        },

        priorityListObject: {
          priorityList,
          setPriorityList,
        },
        updateAllProjectsObject: {
          updateAllProjects,
          setUpdateAllProjects,
        },
        selectionErrorsObject: {
          selectionErrors,
          setSelectionErrors,
        },
        isLoadingObject: {
          isLoading,
          setIsLoading,
        },
      }}
    >
      <div
        ref={taskWindowContainer}
        className={`${openTasksWindow ? "block" : "hidden"} w-[48%] max-sm:w-[93%]  z-80 p-3 left-1/2 top-[47%] -translate-y-1/2 -translate-x-1/2 absolute flex flex-col gap-3 border border-slate-50 bg-white rounded-lg shadow-md`}
      >
        <TasksDropDown dropdownRef={tasksDropDownContainer} />
        <Header />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 pt-8 px-7 mt-3"
        >
          {/* Input and icon*/}
          <TaskInput register={register} errors={errors} />
          {/*Both selections components */}
          <div className="flex flex-row items-center justify-between gap-5">
            <PrioritySelection />
            <ProjectsSelection />
          </div>
          <Footer />
        </form>
      </div>
    </TaskFormContext.Provider>
  );
}

function Header() {
  const {
    openTasksWindowObject: { setOpenTasksWindow },
    selectedTaskObject: { selectedTask, setSelectedTask },
    projectClickedObject: { setProjectClicked },
  } = useContextApp();

  return (
    <div className="flex justify-between items-center pt-7 px-7 ">
      <div
        onClick={() => {
          setOpenTasksWindow(false);
          setSelectedTask(null);
          setProjectClicked(null);
        }}
        className="flex items-center gap-2 cursor-pointer scale-105 hover:opacity-75 "
      >
        {/*Project Icon*/}
        <div className="p-[7px] bg-orange-200 rounded-lg flex items-center justify-center text-orange-600">
          <PlaylistAddIcon />
        </div>
        {/*Project Header*/}
        <span className="font-semibold text-lg text-slate-900">
          {selectedTask ? "Edit Task" : "Add New Task"}
        </span>
      </div>

      <CloseOutlined
        sx={{ fontSize: "18px" }}
        className="text-slate-300 cursor-pointer hover:text-red-300 hover:scale-105"
        onClick={() => {
          setOpenTasksWindow(false);
          setSelectedTask(null);
          setProjectClicked(null);
        }}
      />
    </div>
  );
}

function TaskInput({
  register,
  errors,
}: {
  register: UseFormRegister<FormDataTask>;
  errors: FieldErrors<FormDataTask>;
}) {
  const {
    selectedIconObject: { selectedIcon },
    openIconsWindowObject: { setOpenIconsWindow },
  } = useContextApp();

  return (
    <div>
      <span className="text-[14px] font-medium text-slate-600">Task Name</span>
      <div className="flex gap-3 justify-between">
        <div className="w-full">
          <input
            {...register("taskName")}
            type="text"
            placeholder="Enter Task Name..."
            className="p-2.5 text-[13px] w-full rounded-md border outline-none text-slate-800"
          />
          {errors.taskName && (
            <p className="text-[11px] text-red-500">
              {errors.taskName.message}
            </p>
          )}
        </div>

        {/*Icon*/}
        <div
          onClick={() => setOpenIconsWindow(true)}
          className="w-12 h-10 text-white bg-orange-600 flex items-center justify-center rounded-lg cursor-pointer"
        >
          {selectedIcon ? (
            getIconComponent(selectedIcon?.name, "text-white")
          ) : (
            <LibraryBooks />
          )}
        </div>
      </div>
    </div>
  );
}

function PrioritySelection() {
  const {
    clickedSelectionObject: { setClickedSelection },
    taskDropDownPositionsObject: { setTaskDropDownPositions },
    openTasksDropDownObject: { openTasksDropDown, setOpenTasksDropDown },
    priorityObject: { priority },
    selectionErrorsObject: { selectionErrors, setSelectionErrors },
  } = useTaskFormContext();

  const prioritySelectionRef = useRef<HTMLDivElement>(null);

  function updatePosition() {
    if (!prioritySelectionRef.current) return;

    const rect = prioritySelectionRef.current.getBoundingClientRect();
    setTaskDropDownPositions({
      top: rect.top,
      left: rect.left,
      width: rect.width,
    });
  }

  useEffect(() => {
    if (!openTasksDropDown) return;

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [openTasksDropDown]);

  function handleClickedSelection() {
    // open the drop down
    setOpenTasksDropDown(!openTasksDropDown);
    // Update the clicked selection state
    setClickedSelection("priority");
    // Hide the error if it is shown
    setSelectionErrors((prevState) =>
      prevState.map((error) => ({
        ...error,
        show: error.label === "priority" && false,
      })),
    );
  }
  return (
    <div
      ref={prioritySelectionRef}
      onClick={handleClickedSelection}
      className="flex flex-col gap-2 w-full relative cursor-pointer"
    >
      {/* Priority span*/}
      <span className="text-[14px] font-medium text-slate-600">
        Task Priority
      </span>
      {/*selection placeholder and the array icon*/}
      <div className="flex justify-between items-center border h-[42px] px-2 rounded-md">
        <span className="w-full text-[13px] text-slate-400">
          {priority ? (
            <div className="flex gap-1 items-center">
              <div>{priority.icon}</div>
              <span className="mt-[3px]">{priority.name}</span>
            </div>
          ) : (
            <span>Select Priority</span>
          )}
        </span>

        {/*arrow icon*/}
        <KeyboardArrowDown className="absolute top-[40px] right-3 text-slate-400" />
      </div>
      {selectionErrors[0].show && (
        <span className="text-red-500 text-[11px]">
          {selectionErrors[0].message}
        </span>
      )}
    </div>
  );
}

function ProjectsSelection() {
  const {
    clickedSelectionObject: { setClickedSelection },
    taskDropDownPositionsObject: { setTaskDropDownPositions },
    openTasksDropDownObject: { openTasksDropDown, setOpenTasksDropDown },
    projectObject: { project },
    selectionErrorsObject: { selectionErrors, setSelectionErrors },
  } = useTaskFormContext();

  const projectsSelectionRef = useRef<HTMLDivElement>(null);

  function updatePosition() {
    if (!projectsSelectionRef.current) return;

    const rect = projectsSelectionRef.current.getBoundingClientRect();
    setTaskDropDownPositions({
      top: rect.top,
      left: rect.left,
      width: rect.width,
    });
  }

  useEffect(() => {
    if (!openTasksDropDown) return;

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [openTasksDropDown]);

  function handleClickedSelectionProjects() {
    // updatePosition();
    setClickedSelection("project");
    setOpenTasksDropDown(!openTasksDropDown);
    // Hide the error if is shown
    setSelectionErrors((prevState) =>
      prevState.map((error) => ({
        ...error,
        show: error.label === "project" && false,
      })),
    );
  }

  return (
    <div
      ref={projectsSelectionRef}
      onClick={handleClickedSelectionProjects}
      className="flex flex-col gap-2 w-full relative cursor-pointer"
    >
      <span className="text-[14px] font-medium text-slate-600">Project</span>
      <div className="flex justify-between items-center border h-[42px] px-2 rounded-md">
        <span className="w-full text-[13px] text-slate-400">
          {project ? (
            <div className="flex gap-1 items-center">
              <span>{getIconComponent(project.icon)}</span>

              <span>{project.title}</span>
            </div>
          ) : (
            <span>Select Project</span>
          )}

          <KeyboardArrowDown className="absolute top-10 right-3 text-slate-400" />
        </span>
      </div>
      {selectionErrors[1].show && (
        <span className="text-red-500 text-[11px]">
          {selectionErrors[1].message}
        </span>
      )}
    </div>
  );
}

function Footer() {
  const {
    openTasksWindowObject: { setOpenTasksWindow },
    selectedTaskObject: { selectedTask, setSelectedTask },
    selectedIconObject: { setSelectedIcon },
    projectClickedObject: { setProjectClicked },
  } = useContextApp();
  const {
    isLoadingObject: { isLoading },
  } = useTaskFormContext();
  return (
    <div className="w-[102%] p-3 mt-8 mb-4 flex gap-3 justify-end items-center">
      {/*Cancel Button*/}
      <button
        onClick={() => {
          setOpenTasksWindow(false);
          setSelectedTask(null);
          setSelectedIcon(null);
          setProjectClicked(null);
        }}
        className="border border-slate-200 text-slate-400 text-[13px] p-2 px-6 rounded-md hover:border-slate-300 transition-all scale-105 hover:text-red-300"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-700 text-white text-[13px] p-2 px-4 rounded-md transition-all"
      >
        {isLoading ? "Saving..." : selectedTask ? "Edit Task" : "Add Task"}
      </button>
    </div>
  );
}
