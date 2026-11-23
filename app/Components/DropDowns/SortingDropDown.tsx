import { useContextApp } from "@/app/contextApp";
import { sortAllTasks, sortProjects } from "@/app/functions/sortingFunction";
import { useEffect, useRef } from "react";

export default function SortingDropDown() {
  const {
    allProjectsObject: { allProjects, setAllProjects },
    allTasksObject: { allTasks, setAllTasks },
    sortingOptionsObject: { sortingOptions, setSortingOptions },
    openSortingDropDownObject: { openSortingDropDown, setOpenSortingDropDown },
    sortingDropDownPositionsObject: { sortingDropDownPositions },
    sideBarMenuObject: { sideBarMenu },
  } = useContextApp();

  const sortingContainer = useRef<HTMLDivElement>(null);

  // This effect is for clicking outisede the sorting menu and handling resized window
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        sortingContainer.current &&
        !sortingContainer.current.contains(e.target as Node)
      ) {
        setOpenSortingDropDown(false);
      }
    }

    function handleResize() {
      // close the drop down menu when the window is resized
      setOpenSortingDropDown(false);
    }

    if (openSortingDropDown) {
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
  }, [openSortingDropDown, setOpenSortingDropDown]);

  function handleOptionSelected(categoryIndex: number, optionIndex: number) {
    // Update the selection in the sorting options array
    const updateSortingOptions = sortingOptions.map((category, cIndex) => ({
      ...category,
      options: category.options.map((option, oIndex) => ({
        ...option,
        selected: cIndex === categoryIndex && oIndex === optionIndex,
      })),
    }));

    // get the option object that has the isSelected property as true
    const selectedOption = updateSortingOptions
      .flatMap((option) => option.options)
      .find((option) => option.selected);

    if (sideBarMenu[0].isSelected) {
      const allSortedProjects = sortProjects(
        allProjects,
        selectedOption?.value,
      );

      setAllProjects(allSortedProjects);
    } else if (sideBarMenu[1].isSelected) {
      const allSortedTasks = sortAllTasks(allTasks, selectedOption?.value);

      setAllTasks(allSortedTasks);
    }

    setSortingOptions(updateSortingOptions);
  }

  //Triger the sorting whenever the allTasks is updated
  useEffect(() => {
    // Get the option value
    const currentSortingOption = sortingOptions
      .flatMap((category) => category.options)
      .find((option) => option.selected);
    const selectedOption = currentSortingOption;

    const sortedTasks = sortAllTasks(allTasks, selectedOption?.value);
    if (JSON.stringify(sortedTasks) !== JSON.stringify(allTasks)) {
      setAllTasks(sortedTasks);
    }
  }, [sortingOptions, allTasks]);

  return (
    <div
      ref={sortingContainer}
      style={{
        top: sortingDropDownPositions.top,
        left: sortingDropDownPositions.left,
      }}
      className={`${openSortingDropDown ? "block" : "hidden"} absolute  bg-white text-sm top-[200px] right-95 z-60 px-5 border-slate-50 py-6 w-40 selected-none shadow-md rounded-lg flex flex-col`}
    >
      {sortingOptions.map((category, categoryIndex) => (
        <div
          key={categoryIndex}
          className="flex flex-col gap-1 text-slate-700 cursor-pointer"
        >
          <span
            className={`text-[13px] font-bold ${category.category === "Date" ? "mt-5" : ""}`}
          >
            {category.category}
          </span>
          <div>
            {category.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <span
                  onClick={() =>
                    handleOptionSelected(categoryIndex, optionIndex)
                  }
                  className={`${option.selected ? "text-orange-600" : "text-slate-500"} cursor-pointer hover:text-orange-600`}
                >
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
