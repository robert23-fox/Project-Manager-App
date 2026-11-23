import { useContextApp } from "@/app/contextApp";
import { CloseOutlined, LibraryBooks } from "@mui/icons-material";
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getIconComponent } from "@/app/functions/IconsActions";
import { addNewProject, editProject } from "@/app/functions/projectActions";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { allIconsArray } from "@/app/Data/AllIcons";
import toast from "react-hot-toast";
import { Project } from "@/app/Data/AllProjects";

const schema = z.object({
  projectName: z
    .string()
    .min(1, { message: "Project name is required" })
    .max(30, { message: "Project name must be 30 characters or less" }),
});

export type FormData = z.infer<typeof schema>;

export default function ProjectWindow() {
  const {
    openProjectWindowObject: { openProjectWindow, setOpenProjectWindow },
    allProjectsObject: { allProjects, setAllProjects },
    selectedIconObject: { selectedIcon, setSelectedIcon },
    selectedProjectObject: { selectedProject, setSelectedProject },
    openIconsWindowObject: { openIconsWindow },
    chosenProjectObject: { chosenProject, setChosenProject },
    allTasksObject: { allTasks, setAllTasks },
  } = useContextApp();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const existingProject = allProjects.find(
      (project) =>
        project.title.toLowerCase() === data.projectName.toLowerCase(),
    );

    if (existingProject && !selectedProject) {
      setError("projectName", {
        type: "manual",
        message: "Project already exists",
      });

      setFocus("projectName");
      return;
    } else {
      projectsFunction(data);
    }
  };

  async function projectsFunction(data: FormData) {
    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!selectedProject) {
        addNewProject(
          data,
          allProjects,
          setAllProjects,
          setOpenProjectWindow,
          selectedIcon,
          reset,
        );
      } else {
        editProject(
          selectedProject,
          setSelectedProject,
          data,
          selectedIcon,
          allProjects,
          setAllProjects,
          setOpenProjectWindow,
          allTasks,
          setAllTasks,
        );
      }
      // console.log("Form submitted with data:", data);
    } catch (error) {
      console.log(error);
      toast.error(
        `Something went wrong when ${selectedProject ? "editing" : "adding"} the project...`,
      );
    } finally {
      setIsLoading(false);

      // Update the chosen project
      if (selectedProject && chosenProject) {
        // if the project we want to edit is the same that is selected in the all tasks page
        if (chosenProject.id === selectedProject.id) {
          const updateChosenProject: Project = {
            ...chosenProject,
            title: data.projectName,
          };

          setChosenProject(updateChosenProject);
        }
      }
      toast.success(
        `Project ${selectedProject ? "edited" : "added"} successfully`,
      );
    }
  }

  const handleClose = () => {
    console.log("Closing window and resetting form");
    setOpenProjectWindow(false);
    reset();
  };

  useEffect(() => {
    if (!openProjectWindow) return;

    if (selectedProject) {
      setValue("projectName", selectedProject.title);

      const projectIcon = allIconsArray.find(
        (icon) => icon.name === selectedProject.icon,
      );

      setSelectedIcon((prev) => prev ?? projectIcon ?? null);
    } else {
      reset();
      setSelectedIcon(null);
    }
  }, [openProjectWindow, selectedProject, setValue, reset, setSelectedIcon]);

  const windowContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openIconsWindow) return;
      if (
        windowContainer.current &&
        !windowContainer.current.contains(event.target as Node)
      ) {
        setOpenProjectWindow(false);
        setSelectedProject(null);
      }
    }

    if (openProjectWindow) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    openProjectWindow,
    openIconsWindow,
    setOpenProjectWindow,
    setSelectedProject,
  ]);

  return (
    <div
      ref={windowContainer}
      className={`${openProjectWindow ? "block" : "hidden"} w-[48%] max-sm:w-[93%] z-80 p-3 left-1/2 top-[47%] -translate-y-1/2 -translate-x-1/2 absolute flex flex-col gap-3 border border-slate-50 bg-white rounded-lg shadow-md`}
    >
      <Header handleClose={handleClose} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 pt-8 px-7 mt-3"
      >
        <ProjectInput register={register} errors={errors} />
        <Footer handleClose={handleClose} isLoading={isLoading} />
      </form>
    </div>
  );
}

function Header({ handleClose }: { handleClose: () => void }) {
  const {
    openProjectWindowObject: { setOpenProjectWindow },
    selectedIconObject: { setSelectedIcon },
    selectedProjectObject: { selectedProject, setSelectedProject },
  } = useContextApp();

  const projectIcon = selectedProject
    ? allIconsArray.find((icon) => icon.name === selectedProject.icon)?.icon
    : null;

  return (
    <div className="flex justify-between items-center pt-7 px-7">
      <div className="flex items-center gap-2">
        {/*Project Icon*/}
        <div className="p-[7px] bg-orange-200 rounded-lg flex items-center justify-center text-orange-600">
          {selectedProject ? projectIcon : <AddBoxIcon />}
        </div>
        {/*Project Header*/}
        <span className="font-semibold text-lg">
          {selectedProject ? "Edit Project" : "New Project"}
        </span>
      </div>

      <CloseOutlined
        sx={{ fontSize: "18px" }}
        className="text-slate-300 cursor-pointer"
        onClick={() => {
          handleClose();
          setSelectedIcon(null);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}

function ProjectInput({
  register,
  errors,
}: {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}) {
  const {
    openProjectWindowObject: { openProjectWindow },
    openIconsWindowObject: { openIconsWindow, setOpenIconsWindow },
    selectedIconObject: { selectedIcon, setSelectedIcon },
  } = useContextApp();

  useEffect(() => {
    if (openProjectWindow) {
      const inputElement = document.querySelector<HTMLInputElement>(
        "input[name=projectName]",
      );
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [openProjectWindow]);

  function handleOpenIconWindow() {
    setOpenIconsWindow(true);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] font-medium text-slate-600">
        Project Name
      </span>
      <div className="flex gap-3 justify-between">
        {/*Input*/}
        <div className="w-full">
          <input
            {...register("projectName")}
            type="text"
            placeholder="Enter Project Name..."
            className="p-2.5 text-[13px] w-full rounded-md border outline-none"
          />
          {errors.projectName && (
            <p className="text-[11px] text-red-500">
              {errors.projectName.message}
            </p>
          )}
        </div>

        {/*Icon*/}
        <div
          className="icon-window w-12 h-10 text-white flex items-center justify-center bg-orange-600 rounded-lg cursor-pointer"
          onClick={handleOpenIconWindow}
        >
          {selectedIcon ? (
            getIconComponent(selectedIcon?.name, "text-white")
          ) : (
            <LibraryBooks />
          )}
        </div>
      </div>
    </div>
  );
}

function Footer({
  handleClose,
  isLoading,
}: {
  handleClose: () => void;
  isLoading: boolean;
}) {
  const {
    openProjectWindowObject: { setOpenProjectWindow },
    selectedIconObject: { setSelectedIcon },
    selectedProjectObject: { selectedProject, setSelectedProject },
  } = useContextApp();

  return (
    <div className="w-[102%] p-3 mt-8 mb-4 flex gap-3 justify-end items-center">
      {/* Cancel Button */}
      <button
        onClick={() => {
          handleClose();
          setSelectedIcon(null);
          setSelectedProject(null);
        }}
        className="border border-slate-200 text-slate-400 text-[13px] p-2 px-6 rounded-md hover:border-slate-300 transition-all"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-700 text-white text-[13px] p-2 px-4 rounded-md transition-all"
      >
        {isLoading
          ? "Saving..."
          : selectedProject
            ? "Edit Project"
            : "Add Project"}
      </button>
    </div>
  );
}
