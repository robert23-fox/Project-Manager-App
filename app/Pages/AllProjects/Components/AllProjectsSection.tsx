import React, { useMemo } from "react";
import SingleProjectCard from "./SingleProjectCard";
import { useContextApp } from "@/app/contextApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ProjectEmptyScreen from "@/app/Components/EmptyScreens/ProjectEmptyScreen";
import { sortProjects } from "@/app/functions/sortingFunction";

export default function AllProjectsSection() {
  const {
    allProjectsObject: { allProjects },
    openDropDownObject: { openDropDown },
    sortingOptionsObject: { sortingOptions },
  } = useContextApp();

  const selectedOption = sortingOptions
    .flatMap((category) => category.options)
    .find((option) => option.selected);

  console.log("SELECTED OPTION:", selectedOption);
  console.log("SELECTED VALUE:", selectedOption?.value);

  const sortedProjects = sortProjects(allProjects, selectedOption?.value);

  console.log("SORTED PROJECTS:", sortedProjects);

  return (
    <div
      className={`mt-6 overflow-x-auto ${openDropDown ? "overflow-hidden" : "overflow-auto"}`}
    >
      {allProjects.length === 0 ? (
        <ProjectEmptyScreen />
      ) : (
        <ul className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {sortedProjects.map((project) => (
            <SingleProjectCard key={project.id} project={project} />
          ))}
        </ul>
      )}
    </div>
  );
}

// export default function AllProjectsSection() {
//   const {
//     allProjectsObject: { allProjects },
//     openDropDownObject: { openDropDown },
//     sortingOptionsObject: { sortingOptions },
//   } = useContextApp();

//   // console.log(allProjects);

//   // const sortedProjects = useMemo(() => {
//   //   const selectedOption = sortingOptions
//   //     .flatMap((category) => category.options)
//   //     .find((option) => option.selected);

//   //   return sortProjects(allProjects, selectedOption?.value);
//   // }, [allProjects, sortingOptions]);
//   const selectedOption = sortingOptions
//     .flatMap((category) => category.options)
//     .find((option) => option.selected);

//   console.log("selected:", selectedOption);

//   const sortedProjects = sortProjects(allProjects, selectedOption?.value);

//   console.log("allProjects:", allProjects);
//   console.log("sortedProjects:", sortedProjects);

//   return (
//     <div>
//       {allProjects.length === 0 ? (
//         <ProjectEmptyScreen />
//       ) : (
//         <ul
//           className={`h-[78%]  flex gap-4 flex-wrap mt-6 max-sm:grid max-sm:grid-cols-1 ${openDropDown ? "overflow-hidden" : "overflow-auto"}`}
//         >
//           {sortedProjects.map((project) => (
//             <SingleProjectCard key={project.id} project={project} />
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
