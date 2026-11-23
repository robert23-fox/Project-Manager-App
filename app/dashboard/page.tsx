"use client";
import MoreDropDown from "../Components/DropDowns/MoreDropDown";
import ProjectsDropDown from "../Components/DropDowns/ProjectsDropDown";
import SortingDropDown from "../Components/DropDowns/SortingDropDown";
import SideBar from "../Components/SideBar";
import ConfirmationWindow from "../Components/Window/ConfirmationWindow";
import IconWindow from "../Components/Window/IconWindow";
import ProjectWindow from "../Components/Window/ProjectWindow";
import TasksWindow from "../Components/Window/TasksWindow";
import { useContextApp } from "../contextApp";
import AllProjects from "../Pages/AllProjects/AllProjects";
import AllTasksContainer from "../Pages/AllTasks/AllTasks";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const {
    openSideBarObject: { openSideBar },
    sideBarMenuObject: { sideBarMenu, setSideBarMenu },
    openProjectWindowObject: { openProjectWindow },
    openConfirmationWindowObject: { openConfirmationWindow },
  } = useContextApp();

  const componentMap: Record<number, React.ReactNode> = {
    1: <AllProjects />,
    2: <AllTasksContainer />,
  };

  const componentKey = sideBarMenu.findIndex((item) => item.isSelected);

  const selectedComponent = componentMap[componentKey + 1] || null;

  return (
    <div className="flex w-full h-screen poppins text-slate-800">
      <TasksWindow />
      <ProjectsDropDown />
      <SortingDropDown />
      <Toaster />
      <ConfirmationWindow />
      <MoreDropDown />
      <ProjectWindow />
      <IconWindow />
      {/* Soft Layer */}
      {(openSideBar || openProjectWindow || openConfirmationWindow) && (
        <div
          className={`w-full h-full ${openProjectWindow || openConfirmationWindow ? "z-70" : "z-50"} bg-slate-800 fixed opacity-30`}
        ></div>
      )}
      {/* Sidebar */}
      <SideBar />
      {/* Selected Component */}
      {selectedComponent && selectedComponent}
    </div>
  );
}
