import React, { useRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useContextApp } from "@/app/contextApp";
import { KeyboardArrowUpOutlined } from "@mui/icons-material";

function ProjectsSubHeader() {
  return (
    <div className="mt-20 flex justify-between font-bold items-center text-slate-800">
      <MyProjectsText />
      <SortByButton />
    </div>
  );
}

function MyProjectsText() {
  return (
    <p className="text-[26px] font-bold max-sm:text-[23px]">My Projects</p>
  );
}

function SortByButton() {
  const {
    openSortingDropDownObject: { openSortingDropDown, setOpenSortingDropDown },
    sortingDropDownPositionsObject: { setSortingDropDownPositions },
    sortingOptionsObject: { sortingOptions },
  } = useContextApp();

  const sortRef = useRef<HTMLDivElement>(null);

  function openSortingDropDownFunction(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (sortRef.current) {
      const rect = sortRef.current.getBoundingClientRect();
      const { top, left, width } = rect;

      setSortingDropDownPositions({
        top: top + window.scrollY + 30,
        left: left + window.scrollX,
        width: width,
      });
    }

    setOpenSortingDropDown(true);
  }

  let sortingLabel = "";

  const flatten = sortingOptions
    .flatMap((category) => category.options)
    .find((option) => option.selected);

  if (flatten) {
    if (flatten.label === "A-Z" || flatten.label === "Z-A") {
      sortingLabel = `Order ${flatten.label}`;
    } else {
      sortingLabel = `${flatten.label} Projects`;
    }
  }

  return (
    <div className="flex text-[15px] max-sm:text-[14px] font-semibold gap-3 max-sm:gap-1 items-center">
      <span className="text-slate-300">Sort By</span>
      <div
        ref={sortRef}
        className="flex gap-1 items-center cursor-pointer"
        onClick={openSortingDropDownFunction}
      >
        <span
          className={`${openSortingDropDown ? "text-orange-600" : "text-slate-800"}`}
        >
          {sortingLabel}
        </span>
        {openSortingDropDown ? (
          <KeyboardArrowUpOutlined
            sx={{ fontSize: "19px" }}
            className="text-orange-600"
          />
        ) : (
          <KeyboardArrowDownIcon sx={{ fontSize: "19px" }} />
        )}
      </div>
    </div>
  );
}

export default ProjectsSubHeader;
