"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useTaskFormContext } from "../Window/TasksWindow";
import PriorityListComponent from "./TasksDropDown/PriorityListComponent";
import ProjectsListComponent from "./TasksDropDown/ProjectsListComponent";

type TasksDropDownProps = {
  dropdownRef: RefObject<HTMLDivElement | null>;
};

export default function TasksDropDown({ dropdownRef }: TasksDropDownProps) {
  const {
    clickedSelectionObject: { clickedSelection },
    taskDropDownPositionsObject: { taskDropDownPositions },
    openTasksDropDownObject: { openTasksDropDown, setOpenTasksDropDown },
  } = useTaskFormContext();

  // const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Wait until the component is mounted in the browser.
  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePositions =
    clickedSelection === "priority"
      ? { top: 80, left: -415 }
      : { top: 80, left: 10 };

  // Avoid accessing document before mounting.
  if (!mounted) return null;

  // Render the dropdown directly under document.body.
  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        top: taskDropDownPositions.top + updatePositions.top,
        left: taskDropDownPositions.left + updatePositions.left,
        width: taskDropDownPositions.width,
      }}
      className={`${openTasksDropDown ? "block" : "hidden"} z-90`}
    >
      {clickedSelection === "priority" ? (
        <PriorityListComponent />
      ) : (
        <ProjectsListComponent />
      )}
    </div>,
    document.body,
  );
}
