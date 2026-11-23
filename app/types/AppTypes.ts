import { Project, Task } from "../Data/AllProjects";

export type AppType = {
  openSideBarObject: {
    openSideBar: boolean;
    setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  };

  sideBarMenuObject: {
    sideBarMenu: SidebarMenuItem[];
    setSideBarMenu: React.Dispatch<React.SetStateAction<SidebarMenuItem[]>>;
  };

  openProjectWindowObject: {
    openProjectWindow: boolean;
    setOpenProjectWindow: React.Dispatch<React.SetStateAction<boolean>>;
  };
  allIconsDataObject: {
    allIconsData: IconData[];
    setAllIconsData: React.Dispatch<React.SetStateAction<IconData[]>>;
  };
  selectedIconObject: {
    selectedIcon: IconData | null;
    setSelectedIcon: React.Dispatch<React.SetStateAction<IconData | null>>;
  };
  openIconsWindowObject: {
    openIconsWindow: boolean;
    setOpenIconsWindow: React.Dispatch<React.SetStateAction<boolean>>;
  };
  allProjectsObject: {
    allProjects: Project[];
    setAllProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  };
  openDropDownObject: {
    openDropDown: boolean;
    setOpenDropDown: React.Dispatch<React.SetStateAction<boolean>>;
  };
  dropDownPositionsObject: {
    dropDownPositions: { top: number; left: number };
    setDropDownPositions: React.Dispatch<
      React.SetStateAction<{ top: number; left: number }>
    >;
  };
  selectedProjectObject: {
    selectedProject: Project | null;
    setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
  };
  openConfirmationWindowObject: {
    openConfirmationWindow: boolean;
    setOpenConfirmationWindow: React.Dispatch<React.SetStateAction<boolean>>;
  };
  sortingOptionsObject: {
    sortingOptions: OptionSorting[];
    setSortingOptions: React.Dispatch<React.SetStateAction<OptionSorting[]>>;
  };
  openSortingDropDownObject: {
    openSortingDropDown: boolean;
    setOpenSortingDropDown: React.Dispatch<React.SetStateAction<boolean>>;
  };
  sortingDropDownPositionsObject: {
    sortingDropDownPositions: { top: number; left: number; width?: number };
    setSortingDropDownPositions: React.Dispatch<
      React.SetStateAction<{ top: number; left: number; width?: number }>
    >;
  };
  chosenProjectObject: {
    chosenProject: Project | null;
    setChosenProject: React.Dispatch<React.SetStateAction<Project | null>>;
  };

  tabsOptionsObject: {
    tabsOptions: TabOptions[];
    setTabsOptions: React.Dispatch<React.SetStateAction<TabOptions[]>>;
  };
  openProjectsDropDownObject: {
    openProjectsDropDown: boolean;
    setOpenProjectsDropDown: React.Dispatch<React.SetStateAction<boolean>>;
  };
  openTasksWindowObject: {
    openTasksWindow: boolean;
    setOpenTasksWindow: React.Dispatch<React.SetStateAction<boolean>>;
  };
  selectedWindowObject: {
    selectedWindow: OptionsWindow | null;
    setSelectedWindow: React.Dispatch<
      React.SetStateAction<OptionsWindow | null>
    >;
  };
  allTasksObject: {
    allTasks: Task[];
    setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  };
  selectedTaskObject: {
    selectedTask: Task | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  };
  projectClickedObject: {
    projectClicked: Project | null;
    setProjectClicked: React.Dispatch<React.SetStateAction<Project | null>>;
  };
  initialSortingOptionsObject: {
    initialSortingOptions: OptionSorting[];
    setInitialSortingOptions: React.Dispatch<
      React.SetStateAction<OptionSorting[]>
    >;
  };
};

export type DeleteTaskProps = {
  taskToDelete: Task;
  allProjects: Project[];
  chosenProject: Project | null;
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setChosenProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setAllProjects: React.Dispatch<React.SetStateAction<Project[]>>;
};

export type OptionsWindow = "project" | "task";

export type SidebarMenuItem = {
  id: number;
  name: string;
  isSelected: boolean;
};

export interface IconData {
  id: number;
  name: string;
  icon: React.ReactNode;
  isSelected: boolean;
}

export type OptionSorting = {
  category: string;
  options: { label: string; value: string; selected: boolean }[];
};

export type TabOptions = {
  id: number;
  name: string;
  isSelected: boolean;
};

// export interface ProjectWithSelection extends Project {
//   isSelected: boolean
// }
