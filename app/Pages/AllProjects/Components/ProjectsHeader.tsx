import React, { useRef } from "react";
import AddProjectButton from "@/app/Components/AddButton";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useContextApp } from "@/app/contextApp";

function ProjectHeader() {
  return (
    <div className="flex justify-between">
      <SearchBar />
      <AddProjectButton>New Project</AddProjectButton>
    </div>
  );
}

function SearchBar() {
  const {
    openProjectsDropDownObject: {
      openProjectsDropDown,
      setOpenProjectsDropDown,
    },
    dropDownPositionsObject: { setDropDownPositions },
  } = useContextApp();

  const searchIconRef = useRef<HTMLDivElement>(null);

  function handleOpenDropDown(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (searchIconRef.current) {
      const rect = searchIconRef.current.getBoundingClientRect();
      const { top, left } = rect;

      setDropDownPositions({
        top: top + window.scrollX + 45,
        left: left + window.scrollY + 10,
      });
    }

    setOpenProjectsDropDown(!openProjectsDropDown);
  }

  return (
    <div className="flex items-center">
      {/* Search Icon */}
      <div
        ref={searchIconRef}
        className="border-b-2 border-orange-600 h-[39px] w-11 justify-center flex items-center"
        onClick={handleOpenDropDown}
      >
        <SearchIcon
          className="text-slate-400 outline-none"
          sx={{ fontSize: "26px" }}
        />
      </div>

      {/* Search Input */}
      <div className="border-b-2 w-[67%] border-slate-200">
        <input
          type="text"
          placeholder="Search a project..."
          className=" placeholder:text-slate-400 text-slate-600 p-2 bg-transparent text-[14px] outline-none"
        />
      </div>
    </div>
  );
}

// function AddProjectButton() {
//   return (
//     <button className="bg-orange-600 text-white px-2 pr-3 text-[14px] rounded-md flex gap-1 items-center hover:opacity-85 active:opacity-70 ">
//       <AddIcon sx={{ fontSize: "22px" }} />
//       <span>New Project</span>
//     </button>
//   );
// }

export default ProjectHeader;
