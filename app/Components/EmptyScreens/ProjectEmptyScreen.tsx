import ListAltIcon from "@mui/icons-material/ListAlt";

export default function ProjectEmptyScreen() {
  return (
    <div className="flex flex-col items-center w-full h-[75vh] justify-center text-slate-300">
      <ListAltIcon sx={{ fontSize: "130px" }} />
      <h1 className="text-slate-400 text-lg font-semibold mt-5">
        No Project Created Yet...
      </h1>
      <p className="mt-5 text-sm">
        It looks like you haven't started any projects yet.
      </p>
      <p className=" text-sm">
        Create a new project to begin managing your tasks.
      </p>
    </div>
  );
}
