import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import ListIcon from "@mui/icons-material/List";
import CachedIcon from "@mui/icons-material/Cached";
import CircleIcon from "@mui/icons-material/Circle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useContextApp } from "@/app/contextApp";
import { Project, Task } from "@/app/Data/AllProjects";
import { getIconComponent } from "@/app/functions/IconsActions";
import DoneIcon from "@mui/icons-material/Done";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import { BiTaskX } from "react-icons/bi";
import { dividerClasses } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { LibraryAdd } from "@mui/icons-material";

export default function TaskList() {
  const {
    chosenProjectObject: { chosenProject },
    tabsOptionsObject: { tabsOptions },
    allTasksObject: { allTasks },
  } = useContextApp();

  // const allTasks = allProjects.flatMap((project) => project.tasks);

  const filteredTasks = useMemo(() => {
    // 1. Filter by project
    let tasks = chosenProject
      ? allTasks.filter((task) => task.projectName === chosenProject.title)
      : allTasks;

    // 2. If there are no tasks at all
    if (tasks.length === 0) {
      return {
        tasks: [],
        emptyState: "no-tasks",
      };
    }

    // 3. Filter by selected tab
    const isCompletedTab = tabsOptions[1].isSelected;

    tasks = tasks.filter((task) =>
      isCompletedTab
        ? task.status === "Completed"
        : task.status === "In Progress",
    );

    // 4. There are tasks, but none for this tab
    if (tasks.length === 0) {
      return {
        tasks: [],
        emptyState: isCompletedTab ? "no-completed" : "no-in-progress",
      };
    }

    // 5. We have tasks to display
    return {
      tasks,
      emptyState: null,
    };
  }, [allTasks, chosenProject, tabsOptions]);

  return (
    <div className="ml-12 max-sm:ml-0 mt-11 flex flex-col gap-4">
      <Tabs />

      <div className="flex flex-col gap-4">
        {filteredTasks.emptyState === "no-tasks" && (
          <div>
            {" "}
            <div className="flex flex-col gap-2 justify-center items-center text-slate-400 opacity-80 hover:text-orange-400  mt-50 text-xl">
              <LibraryAdd fontSize="large" />
              <span>No task created yet...</span>
            </div>
          </div>
        )}

        {filteredTasks.emptyState === "no-completed" && (
          <div>
            <div className="flex flex-col justify-center items-center mt-50 text-2xl text-slate-400">
              <h1>No tasks completed yet</h1>
              <AssignmentLateIcon
                fontSize="large"
                className="text-slate-400 mt-6"
              />
            </div>
          </div>
        )}

        {filteredTasks.emptyState === "no-in-progress" && (
          <div className="flex flex-col justify-center items-center mt-50 text-2xl text-orange-600">
            <h1>All the tasks are completed</h1>
            <TaskAltIcon fontSize="large" className="text-green-600 mt-6" />
          </div>
        )}

        {filteredTasks.tasks.map((task, index) => (
          <SingleTask key={index} task={task} />
        ))}
      </div>
    </div>
  );
}

function Tabs() {
  const {
    chosenProjectObject: { chosenProject },
    allProjectsObject: { allProjects },
    tabsOptionsObject: { tabsOptions, setTabsOptions },
  } = useContextApp();

  function countOnGoingTasks() {
    // If chosen project is not null, count the tasks that are in progress by using the reducer method based on its status
    if (chosenProject) {
      return chosenProject.tasks.reduce((accTask, task) => {
        return accTask + (task.status === "In Progress" ? 1 : 0);
      }, 0);
    }

    // otherwise count the total of all tasks in the all Projects
    return allProjects.reduce((accProjects, project) => {
      return (
        accProjects +
        project.tasks.reduce((accTask, task) => {
          return accTask + (task.status === "In Progress" ? 1 : 0);
        }, 0)
      );
    }, 0);
  }

  function completedTasks() {
    // If chosen project is selected, calculate the difference between the on going tasks and the total of all tasks in the project
    if (chosenProject) {
      return chosenProject.tasks.length - countOnGoingTasks();
    }

    // The same for all project, but firest we need to count all the tasks in all projects
    return (
      allProjects.reduce((accProject, project) => {
        return accProject + project.tasks.length;
      }, 0) - countOnGoingTasks()
    );
  }

  function handleSwitchTabs(tabId: number) {
    setTabsOptions((prevState) =>
      prevState.map((item) => ({
        ...item,
        isSelected: item.id === tabId,
      })),
    );
  }
  return (
    <ul className="flex items-center gap-6 ml-3 mt-8 mb-5">
      {tabsOptions.map((tab) => (
        <li
          key={tab.id}
          className={` ${tab.isSelected === true ? "text-orange-400" : "text-slate-400"} flex gap-2 font-semibold cursor-pointer`}
          onClick={() => handleSwitchTabs(tab.id)}
        >
          <span>{tab.name}</span>
          <span
            className={`${tab.isSelected === true ? "bg-orange-600" : "bg-slate-200"} text-white px-2 rounded-md max-[420px]:hiddne`}
          >
            {tab.id === 1 ? countOnGoingTasks() : completedTasks()}
          </span>
        </li>
      ))}
    </ul>
  );
}
function SingleTask({ task }: { task: Task }) {
  const {
    selectedTaskObject: { setSelectedTask },
    openTasksWindowObject: { setOpenTasksWindow },
    selectedWindowObject: { setSelectedWindow },
    openConfirmationWindowObject: { setOpenConfirmationWindow },
    allProjectsObject: { allProjects, setAllProjects },
    chosenProjectObject: { chosenProject, setChosenProject },
    allTasksObject: { setAllTasks },
  } = useContextApp();

  const priorityColors = {
    Low: "text-green-500",
    Medium: "text-yellow-500",
    High: "text-red-500",
  };

  const checked = task.status === "Completed";

  function updateStatus() {
    const newStatus = checked ? "In Progress" : "Completed";

    // Update allProjects
    const updateProjects: Project[] = allProjects.map((proj) => ({
      ...proj,
      tasks: proj.tasks.map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t,
      ),
    }));

    if (chosenProject) {
      const updateChosenProject: Project = {
        ...chosenProject,
        tasks: chosenProject.tasks.map((t) =>
          t.id === task.id ? { ...t, status: newStatus } : t,
        ),
      };

      setChosenProject(updateChosenProject);
    }

    const updateAllTasks = updateProjects.flatMap((proj) => proj.tasks);
    setAllTasks(updateAllTasks);
    setAllProjects(updateProjects);
    // setChecked(!checked);
  }
  return (
    <div className="flex gap-2 items-center">
      <Checkbox
        sx={{ color: "orangered", "&.Mui-checked": { color: "orange" } }}
        checked={checked}
        onClick={updateStatus}
      />
      <div className="w-full bg-white rounded-lg border border-slate-100 flex gap-3 items-center justify-between p-5 py-6 hover:shadow-md transition-shadow duration-300 max-sm:p-4">
        <div className="flex gap-3 items-center">
          {/* Wallet Icon */}
          <div>
            <div className="bg-orange-200 rounded-lg p-2 flex items-center justify-center text-orange-600">
              {getIconComponent(task.icon)}
            </div>
          </div>

          {/* Wallet Name */}
          <div
            onClick={() => {
              // Update the selected task with the target task
              setSelectedTask(task);
              // Open up the task window
              setOpenTasksWindow(true);
              setSelectedWindow("task");
            }}
            className="flex flex-col"
          >
            <span className="font-bold cursor-pointer hover:text-orange-600">
              {task.title}
            </span>
            <div className="flex">
              <span className="text-slate-400 text-[13px] p-0.5">
                {task.projectName}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-36 font-bold items-center max-[740px]:hidden">
          <div className="flex gap-2 items-center max-sm:hidden">
            {task.status === "Completed" ? (
              <DoneIcon className="text-[24px] text-green-400" />
            ) : (
              <CachedIcon className="text-[24px] text-slate-400" />
            )}
            <span
              className={`${task.status === "Completed" ? "text-green-400" : "text-slate-400"} text-[14px]`}
            >
              {task.status}
            </span>
          </div>
        </div>

        {/* Priority */}
        <div className="flex gap-2 items-center max-sm:hidden">
          <CircleIcon
            className={`${priorityColors[task.priority]} text-[10px]`}
          />
          <span className="text-slate-400 text-[14px]">{task.priority}</span>
        </div>

        {/* Actions Buttons */}
        <div className="flex gap-2 items-center">
          {/* Edit Button */}
          <div
            onClick={() => {
              setSelectedTask(task);
              setOpenTasksWindow(true);
              setSelectedWindow("task");
            }}
            className="rounded-lg p-2 flex items-center justify-center cursor-pointer bg-orange-200 hover:bg-orange-300 transition-colors duration-300"
          >
            <EditNoteIcon
              sx={{ fontSize: "24px" }}
              className="text-orange-600"
            />
          </div>

          {/* Delete Button */}
          <div
            onClick={() => {
              setSelectedTask(task);
              setOpenConfirmationWindow(true);
            }}
            className="rounded-lg p-2 flex items-center justify-center cursor-pointer bg-slate-200 hover:bg-red-600 transition-colors duration-300 group"
          >
            <DeleteOutlineIcon
              sx={{ fontSize: "24px" }}
              className="text-slate-400 group-hover:text-white transition-colors duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
