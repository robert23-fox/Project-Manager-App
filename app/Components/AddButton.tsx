"use client";

import React from "react";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import { useContextApp } from "../contextApp";

export default function AddButton({ children }: { children: React.ReactNode }) {
  const {
    openSideBarObject: { openSideBar, setOpenSideBar },
    openProjectWindowObject: { openProjectWindow, setOpenProjectWindow },
    openTasksWindowObject: { openTasksWindow, setOpenTasksWindow },
    selectedWindowObject: { setSelectedWindow },
    selectedTaskObject: { setSelectedTask },
  } = useContextApp();

  function handleClick() {
    if (children === "New Project") {
      setOpenProjectWindow(!openProjectWindow);
      setSelectedWindow("project");
    } else if (children === "New Task") {
      setOpenTasksWindow(!openTasksWindow);
      setSelectedWindow("task");
    }
  }

  return (
    <div className="flex gap-3 items-center justify-center">
      <button
        onClick={handleClick}
        className="bg-orange-600 text-white px-2 pr-3 py-2 text-[14px] rounded-md flex gap-1 items-center hover:opacity-85 active:opacity-70 max-sm:pr-2"
      >
        <AddIcon sx={{ fontSize: "22px" }} />
        <span className="max-sm:hidden">{children}</span>
      </button>
      <div className="bg-slate-200 p-2 rounded-md hover:bg-orange-100 transition-colors group duratione-300 curspor-pointer hidden max-sm:block">
        <MenuIcon
          onClick={() => setOpenSideBar(!openSideBar)}
          className="text-slate-400 h-9 cursor-pointer group-hover:text-orange-600 transition-colors duration-300 max-[940px]:block"
        />
      </div>
    </div>
  );
}
