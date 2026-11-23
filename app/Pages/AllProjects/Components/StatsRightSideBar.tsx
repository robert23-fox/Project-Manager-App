import React, { useMemo } from "react";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import { useContextApp } from "@/app/contextApp";
import { Project } from "@/app/Data/AllProjects";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { getIconComponent } from "@/app/functions/IconsActions";
import { PiProjectorScreenLight } from "react-icons/pi";

export default function StatsRightSideBar() {
  const {
    allProjectsObject: { allProjects },
  } = useContextApp();

  const { completedProjects, completedTasks, completionPercentage } =
    useMemo(() => {
      const completedProjects: Project[] = [];
      let totalTasks = 0;
      let completedTasks = 0;

      allProjects.forEach((project) => {
        const projectCompleted =
          project.tasks.length > 0 &&
          project.tasks.every((task) => task.status === "Completed");

        if (projectCompleted) completedProjects.push(project);

        project.tasks.forEach((task) => {
          totalTasks++;
          if (task.status === "Completed") completedTasks++;
        });
      });

      const percentage =
        completedProjects.length > 0
          ? Math.round((completedProjects.length / allProjects.length) * 100)
          : 0;

      return {
        completedProjects: completedProjects,
        completedTasks,
        completionPercentage: percentage,
      };
    }, [allProjects]);

  console.log("completed projects", completedProjects);
  return (
    <div className="w-[22%] flex justify-end items-center max-lg:hidden">
      {/* White background */}
      <div className="h-[92%] w-[94%] bg-white rounded-l-3xl p-3 flex flex-col">
        {/* Header */}
        <Header />
        {/* Circular Chart and the labals */}
        <div className="flex flex-col gap-11 items-center justify-center mt-6">
          <CircularChart percentage={completionPercentage} />
          <ProjectCompletedLabels
            completedProjects={completedProjects}
            completedTasks={completedTasks}
          />
        </div>
        {/* Project List */}
        {completedProjects.length === 0 ? (
          <NoProjectsCompleted />
        ) : (
          <ProjectsList completedProjects={completedProjects} />
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <h2 className="text-[22px] font-bold text-center mt-7">
      Project Completed
    </h2>
  );
}

function CircularChart({ percentage }: { percentage: number }) {
  return (
    <div className="w-40 h-40 mt-7 mb-1">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={{
          ...buildStyles({
            textSize: "16px",
            textColor: "#f97316",
            pathColor: "rgba(234, 88, 12, 1)",
            trailColor: "#f1f5f9",
          }),
          text: {
            dominantBaseline: "central",
            textAnchor: "middle",
          },
        }}
      />
    </div>
  );
}

function ProjectCompletedLabels({
  completedProjects,
  completedTasks,
}: {
  completedProjects: Project[];
  completedTasks: number;
}) {
  return (
    <div className="flex justify-center flex-col gap-1 items-center">
      <p className="font-bold text-[17px]">
        {completedProjects.length} Completed
      </p>
      <p className="text-[13px] text-slate-400">{completedTasks} Tasks done</p>
    </div>
  );
}

function ProjectsList({ completedProjects }: { completedProjects: Project[] }) {
  return (
    <ul className="flex flex-col gap-3 mt-16 mx-4 overflow-auto">
      {completedProjects.map((project, projectIndex) => (
        <SingleProject key={projectIndex} project={project} />
      ))}

      <hr className="w-[80%] mx-auto text-slate-100 opacity-50"></hr>
    </ul>
  );
}

function SingleProject({ project }: { project: Project }) {
  return (
    <li className="p-3 flex gap-3 items-center">
      <div className="w-8 h-8 bg-orange-100 rounded-md justify-center items-center flex text-white">
        {getIconComponent(project.icon)}
        {/* <SplitscreenIcon /> */}
      </div>

      <ul>
        <li className="text-[14px] font-semibold">{project.title}</li>
        <li className="text-[12px] text-slate-400">
          {`${project.tasks.length} ${project.tasks.length > 0 ? "tasks" : "task"}`}
        </li>
      </ul>
    </li>
  );
}

function NoProjectsCompleted() {
  return (
    <div className="text-slate-300 flex flex-col items-center justify-center p-10 gap-2 mt-20">
      <PiProjectorScreenLight className="text-[80px] " />
      <h3 className="text-sm">No Projects accomplished yet...</h3>
    </div>
  );
}
