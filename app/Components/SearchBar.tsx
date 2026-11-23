import React from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  return (
    <div className="flex items-center">
      {/* Search Icon */}
      <div className="border-b-2 border-orange-600 h-[39px] w-11 justify-center flex items-center">
        <SearchIcon
          className="text-slate-400 outline-none"
          sx={{ fontSize: "26px" }}
        />
      </div>

      {/* Search Input */}
      <div className="border-b-2 border-slate-200">
        <input
          type="text"
          placeholder="Search a project..."
          className=" placeholder:text-slate-400 text-slate-600 p-2 bg-transparent text-[14px] outline-none"
        />
      </div>
    </div>
  );
}
