import { useContextApp } from "@/app/contextApp";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

export default function MoreDropDown() {
  const {
    openDropDownObject: { openDropDown, setOpenDropDown },
    dropDownPositionsObject: { dropDownPositions, setDropDownPositions },
    selectedProjectObject: { selectedProject },
    openConfirmationWindowObject: { setOpenConfirmationWindow },
    openProjectWindowObject: { setOpenProjectWindow },
  } = useContextApp();

  const [dropDownOptions, setDropDownOptions] = useState([
    { id: 1, name: "Edit", icon: <EditOutlined /> },
    { id: 2, name: "Delete", icon: <DeleteOutlined /> },
  ]);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenDropDown(false);
      }
    }

    function handleResize() {
      setOpenConfirmationWindow(false);
    }

    if (openDropDown) {
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
  }, [openDropDown, setOpenDropDown, setOpenConfirmationWindow]);

  function clickedItemHandler(id: number) {
    if (id === 1) {
      // Open the project window
      setOpenProjectWindow(true);
    }
    if (id === 2) {
      // Open the window to confirm the deletion
      setOpenConfirmationWindow(true);
    }

    // Close the drop down menu
    setOpenDropDown(false);
  }

  return (
    <div
      ref={menuRef}
      style={{ top: dropDownPositions.top, left: dropDownPositions.left }}
      className={`bg-white fixed z-90 top-14 left-24 px-5 border-slate-50 py-6 w-[130px] selected-none shadow-md rounded-lg flex flex-col gap-7 ${openDropDown ? "block" : "hidden"}`}
    >
      {dropDownOptions.map((dropDownOption) => (
        <div
          key={dropDownOption.id}
          className={`flex gap-1 items-center text-slate cursor-pointer hover:text-orange-600 ${dropDownOption.id === 2 && "hover:text-red-600"}`}
          onClick={() => clickedItemHandler(dropDownOption.id)}
        >
          {/* Edit Icon*/}
          {dropDownOption.icon}
          <span className="text-[14px]">{dropDownOption.name}</span>
        </div>
      ))}
    </div>
  );
}
