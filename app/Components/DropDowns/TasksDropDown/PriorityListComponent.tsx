import { useEffect, useRef } from "react";
import { Priority, useTaskFormContext } from "../../Window/TasksWindow";

export default function PriorityListComponent() {
  const {
    priorityListObject: { priorityList },
    openTasksDropDownObject: { openTasksDropDown, setOpenTasksDropDown },
    priorityObject: { setPriority },
  } = useTaskFormContext();

  const taskDropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        taskDropDownRef.current &&
        !taskDropDownRef.current.contains(event.target as Node)
      ) {
        setOpenTasksDropDown(false);
        setPriority(null);
      }
    }

    function handleResize() {
      setOpenTasksDropDown(false);
    }

    if (openTasksDropDown) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleResize);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [openTasksDropDown, setOpenTasksDropDown]);

  return (
    <div
      ref={taskDropDownRef}
      className="bg-white w-[200px] shadow-lg absolute z-90 rounded-lg"
    >
      {priorityList.map((singlePriority, index) => (
        <SinglePriority
          key={index}
          singlePriority={singlePriority}
          index={index}
        />
      ))}
    </div>
  );
}

function SinglePriority({
  singlePriority,
  index,
}: {
  singlePriority: Priority;
  index: number;
}) {
  const {
    priorityObject: { setPriority },
    priorityListObject: { setPriorityList },
    openTasksDropDownObject: { setOpenTasksDropDown },
  } = useTaskFormContext();

  function updateThePriority(index: number) {
    //Update de priority state
    setPriority(singlePriority);
    // Update the priority list array
    setPriorityList((prevState) =>
      prevState.map((sPriority, i) => ({
        ...sPriority,
        isSelected: index === i,
      })),
    );

    // Close the drop down
    setOpenTasksDropDown(false);
  }

  return (
    <div
      onClick={() => updateThePriority(index)}
      className={`${singlePriority.isSelected && "bg-orange-50 border border-orange-200"} flex items-center gap-2 p-[7px] rounded-md curosr-pointer`}
    >
      <div>{singlePriority.icon}</div>
      <p className="text-slate-500 hover:text-orange-600 text-[14px]">
        {singlePriority.name}
      </p>
    </div>
  );
}
