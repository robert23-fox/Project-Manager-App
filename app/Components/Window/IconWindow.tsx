import CloseIcon from "@mui/icons-material/Close";
import AppsIcon from "@mui/icons-material/Apps";
import AllIcons from "@/app/Data/AllIcons";
import { useContextApp } from "@/app/contextApp";
import { useEffect, useRef } from "react";

export default function IconWindow() {
  const {
    openIconsWindowObject: { openIconsWindow, setOpenIconsWindow },
  } = useContextApp();

  const iconContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (iconContainer.current && !iconContainer.current.contains(target)) {
        setOpenIconsWindow(false);
      }
    }

    if (openIconsWindow) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openIconsWindow, setOpenIconsWindow]);

  return (
    <div
      ref={iconContainer}
      className={`${
        openIconsWindow ? "block" : "hidden"
      } absolute p-3 h-[530px] w-[50%] max-sm:w-[90%] bg-white shadow-md left-1/2 top-28 rounded-lg -translate-x-1/2 z-80`}
    >
      <Header />

      <span className="mx-8 text-[13px] mt-12 text-slate-400">
        Please select the icons you'd like to use from the collection below:
      </span>

      <IconsArea />
    </div>
  );
}

function Header() {
  const {
    openIconsWindowObject: { setOpenIconsWindow },
  } = useContextApp();

  return (
    <div className="flex justify-between items-center pt-7 px-7 mb-8">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-orange-200 rounded-lg flex items-center justify-center">
          <AppsIcon
            sx={{ fontSize: 21 }}
            className="text-orange-400 text-[17px]"
          />
        </div>

        <span className="font-semibold text-lg">All Icons</span>
      </div>

      <CloseIcon
        onClick={() => setOpenIconsWindow(false)}
        className="text-slate-400 text-[18px] cursor-pointer"
      />
    </div>
  );
}

function IconsArea() {
  return (
    <div className="w-full flex flex-col items-center mt-3">
      <div className="border border-slate-100 w-[92%] h-[330px] overflow-auto rounded-md bg-slate-100">
        <AllIcons />
      </div>
    </div>
  );
}
