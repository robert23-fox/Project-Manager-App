"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AppType,
  IconData,
  OptionSorting,
  OptionsWindow,
  SidebarMenuItem,
  TabOptions,
} from "./types/AppTypes";
import { allIconsArray } from "./Data/AllIcons";
import { Project, projectsData, Task } from "./Data/AllProjects";

// Setting the default state
const defaultState: AppType = {
  openSideBarObject: { openSideBar: false, setOpenSideBar: () => {} },
  sideBarMenuObject: { sideBarMenu: [], setSideBarMenu: () => {} },
  openProjectWindowObject: {
    openProjectWindow: false,
    setOpenProjectWindow: () => {},
  },
  allIconsDataObject: { allIconsData: [], setAllIconsData: () => {} },
  selectedIconObject: {
    selectedIcon: null,
    setSelectedIcon: () => {},
  },
  openIconsWindowObject: {
    openIconsWindow: false,
    setOpenIconsWindow: () => {},
  },
  allProjectsObject: {
    allProjects: [],
    setAllProjects: () => {},
  },
  openDropDownObject: {
    openDropDown: false,
    setOpenDropDown: () => {},
  },
  dropDownPositionsObject: {
    dropDownPositions: { top: 0, left: 0 },
    setDropDownPositions: () => {},
  },
  selectedProjectObject: {
    selectedProject: null,
    setSelectedProject: () => {},
  },
  openConfirmationWindowObject: {
    openConfirmationWindow: false,
    setOpenConfirmationWindow: () => {},
  },
  sortingOptionsObject: {
    sortingOptions: [],
    setSortingOptions: () => {},
  },
  openSortingDropDownObject: {
    openSortingDropDown: false,
    setOpenSortingDropDown: () => {},
  },
  sortingDropDownPositionsObject: {
    sortingDropDownPositions: { top: 0, left: 0 },
    setSortingDropDownPositions: () => {},
  },
  chosenProjectObject: {
    chosenProject: null,
    setChosenProject: () => {},
  },
  tabsOptionsObject: {
    tabsOptions: [],
    setTabsOptions: () => {},
  },
  openProjectsDropDownObject: {
    openProjectsDropDown: false,
    setOpenProjectsDropDown: () => {},
  },
  openTasksWindowObject: {
    openTasksWindow: false,
    setOpenTasksWindow: () => {},
  },
  selectedWindowObject: {
    selectedWindow: null,
    setSelectedWindow: () => {},
  },
  allTasksObject: {
    allTasks: [],
    setAllTasks: () => {},
  },
  selectedTaskObject: {
    selectedTask: null,
    setSelectedTask: () => {},
  },
  projectClickedObject: {
    projectClicked: null,
    setProjectClicked: () => {},
  },
  initialSortingOptionsObject: {
    initialSortingOptions: [],
    setInitialSortingOptions: () => {},
  },
};

// Creating the context
const ContextApp = createContext<AppType>(defaultState);

// Creating the provider
export default function ContextAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [sideBarMenu, setSideBarMenu] = useState<SidebarMenuItem[]>([
    {
      id: 1,
      name: "All Projects",
      isSelected: true,
    },
    {
      id: 2,
      name: "All Tasks",
      isSelected: false,
    },
    {
      id: 3,
      name: "Logout",
      isSelected: false,
    },
  ]);
  const [openProjectWindow, setOpenProjectWindow] = useState<boolean>(false);
  const [allIconsData, setAllIconsData] = useState<IconData[]>(allIconsArray);
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [openIconsWindow, setOpenIconsWindow] = useState<boolean>(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [dropDownPositions, setDropDownPositions] = useState({
    top: 0,
    left: 0,
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [openConfirmationWindow, setOpenConfirmationWindow] =
    useState<boolean>(false);

  const sortingOptionsArray = [
    {
      category: "Order",
      options: [
        { label: "A-Z", value: "asc", selected: true },
        { label: "Z-A", value: "desc", selected: false },
      ],
    },
    {
      category: "Date",
      options: [
        { label: "Newest", value: "newest", selected: false },
        { label: "Oldest", value: "oldest", selected: false },
      ],
    },
  ];

  const [sortingOptions, setSortingOptions] = useState<OptionSorting[]>([
    ...sortingOptionsArray,
  ]);

  const [initialSortingOptions, setInitialSortingOptions] = useState<
    OptionSorting[]
  >([...sortingOptionsArray]);

  const [openSortingDropDown, setOpenSortingDropDown] =
    useState<boolean>(false);

  const [sortingDropDownPositions, setSortingDropDownPositions] = useState({
    top: 0,
    left: 0,
  });
  const [chosenProject, setChosenProject] = useState<Project | null>(null);
  const [tabsOptions, setTabsOptions] = useState<TabOptions[]>([
    { id: 1, name: "On Going Tasks", isSelected: true },
    { id: 2, name: "Completed Tasks", isSelected: false },
  ]);
  const [openProjectsDropDown, setOpenProjectsDropDown] =
    useState<boolean>(false);
  const [openTasksWindow, setOpenTasksWindow] = useState<boolean>(false);
  const [selectedWindow, setSelectedWindow] = useState<OptionsWindow | null>(
    null,
  );

  const [allTasks, setAllTasks] = useState<Task[]>(
    allProjects.flatMap((project) => project.tasks),
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [projectClicked, setProjectClicked] = useState<Project | null>(null);

  // Simulate the fetching of the project
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        //Update the state;
        const extractAllTasks = projectsData.flatMap(
          (project) => project.tasks,
        );

        setAllTasks(extractAllTasks);
        setAllProjects(projectsData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  //Update the window size
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 940;
      setIsMobileView(mobile);

      if (!mobile) {
        setOpenSideBar(false);
      }
    }

    // initial check
    handleResize();

    //Event listener for window resize
    window.addEventListener("resize", handleResize);

    //cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setOpenSideBar(false);
  }, [sideBarMenu]);

  return (
    <ContextApp.Provider
      value={{
        openSideBarObject: { openSideBar, setOpenSideBar },
        sideBarMenuObject: { sideBarMenu, setSideBarMenu },
        openProjectWindowObject: { openProjectWindow, setOpenProjectWindow },
        allIconsDataObject: { allIconsData, setAllIconsData },
        selectedIconObject: { selectedIcon, setSelectedIcon },
        openIconsWindowObject: { openIconsWindow, setOpenIconsWindow },
        allProjectsObject: { allProjects, setAllProjects },
        openDropDownObject: { openDropDown, setOpenDropDown },
        dropDownPositionsObject: { dropDownPositions, setDropDownPositions },
        selectedProjectObject: { selectedProject, setSelectedProject },
        openConfirmationWindowObject: {
          openConfirmationWindow,
          setOpenConfirmationWindow,
        },
        sortingOptionsObject: { sortingOptions, setSortingOptions },
        openSortingDropDownObject: {
          openSortingDropDown,
          setOpenSortingDropDown,
        },
        sortingDropDownPositionsObject: {
          sortingDropDownPositions,
          setSortingDropDownPositions,
        },
        chosenProjectObject: { chosenProject, setChosenProject },
        tabsOptionsObject: { tabsOptions, setTabsOptions },
        openProjectsDropDownObject: {
          openProjectsDropDown,
          setOpenProjectsDropDown,
        },
        openTasksWindowObject: {
          openTasksWindow,
          setOpenTasksWindow,
        },
        selectedWindowObject: {
          selectedWindow,
          setSelectedWindow,
        },
        allTasksObject: {
          allTasks,
          setAllTasks,
        },
        selectedTaskObject: {
          selectedTask,
          setSelectedTask,
        },
        projectClickedObject: {
          projectClicked,
          setProjectClicked,
        },
        initialSortingOptionsObject: {
          initialSortingOptions,
          setInitialSortingOptions,
        },
      }}
    >
      {children}
    </ContextApp.Provider>
  );
}

//creating the hook
export function useContextApp() {
  return useContext(ContextApp);
}
