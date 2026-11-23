"use client";
import React, { useEffect, useRef } from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import LogoutIcon from "@mui/icons-material/Logout";
import { useContextApp } from "../contextApp";
import { SidebarMenuItem } from "../types/AppTypes";
import { SvgIconProps } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

function SideBar() {
  const {
    openSideBarObject: { openSideBar, setOpenSideBar },
    sideBarMenuObject: { sideBarMenu, setSideBarMenu },
    sortingOptionsObject: { setSortingOptions },
    initialSortingOptionsObject: { initialSortingOptions },
  } = useContextApp();

  const sideBarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOtside(event: MouseEvent) {
      if (
        sideBarMenuRef.current &&
        !sideBarMenuRef.current.contains(event.target as Node)
      ) {
        setOpenSideBar(false);
      }
    }

    if (openSideBar) {
      document.addEventListener("mousedown", handleClickOtside);
    } else {
      document.removeEventListener("mousedown", handleClickOtside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOtside);
    };
  }, [openSideBar, setOpenSideBar]);

  useEffect(() => {
    sideBarMenu.map((item) => {
      if (item.isSelected) {
        setSortingOptions(initialSortingOptions);
      }
    });
  }, [setSortingOptions, sideBarMenu, initialSortingOptions]);

  return (
    <div
      ref={sideBarMenuRef}
      className={`${openSideBar ? "w-[280px] fixed shadow-xl" : "w-[97px] max-sm:hidden max-[940px]:hidden"} h-screen py-8 bg-white flex flex-col items-center justify-between border-r-slate-500 z-60`}
    >
      <Logo />
      <Menu
        openSideBar={openSideBar}
        sideBarMenu={sideBarMenu}
        setSideBarMenu={setSideBarMenu}
      />
      <Profile openSideBar={openSideBar} />
    </div>
  );
}

function Logo() {
  const {
    openSideBarObject: { openSideBar },
  } = useContextApp();
  return (
    <div className="flex items-center justify-center">
      <TaskAltIcon
        className="text-orange-600 font-bold"
        sx={{ fontSize: "41px" }}
      />
      {openSideBar && (
        <div className="text-xl flex items-center gap-1 ">
          <span className="font-bold">Project</span>
          <span className="text-slate-600">Master</span>
        </div>
      )}
    </div>
  );
}

// Profile Image
type ProfileProps = {
  openSideBar: boolean;
};
function Profile({ openSideBar }: ProfileProps) {
  const { user } = useUser();

  if (!user) {
    return <div className="bg-orange-600 w-9 h-9 rounded-md"></div>;
  }

  return (
    <div className="flex items-center gap-2">
      <Image
        alt=""
        className="rounded-md"
        src={user.imageUrl}
        width={33}
        height={33}
      />
      {openSideBar && (
        <ul>
          <li className="font-bold text-[14px]">
            {user.lastName} {user.firstName}
          </li>
          <li className="text-slate-400 text-[11px]">
            {user.primaryEmailAddress?.emailAddress}
          </li>
        </ul>
      )}
    </div>
  );
}

type MenuProps = {
  openSideBar: boolean;
  sideBarMenu: SidebarMenuItem[];
  setSideBarMenu: React.Dispatch<React.SetStateAction<SidebarMenuItem[]>>;
};

function Menu({ openSideBar, sideBarMenu, setSideBarMenu }: MenuProps) {
  const iconMap: Record<string, React.ComponentType<SvgIconProps>> = {
    "1": BorderAllIcon,
    "2": SplitscreenIcon,
    "3": LogoutIcon,
  };

  function handleClickedItem(id: number) {
    const updateMenuSideBar = sideBarMenu.map((item) => {
      if (item.id === id) {
        return { ...item, isSelected: true };
      }

      return { ...item, isSelected: false };
    });

    setSideBarMenu(updateMenuSideBar);
  }
  return (
    <div className="flex flex-col gap-6 items-baseline">
      {sideBarMenu.map((menuItem) => {
        const IconCompenent = iconMap[menuItem.id.toString()];

        return (
          <div
            onClick={() => {
              if (menuItem.id === 1 || menuItem.id === 2) {
                handleClickedItem(menuItem.id);
              }
            }}
            key={menuItem.id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <IconCompenent
              sx={{ fontSize: "25px" }}
              className={` ${menuItem.isSelected ? "text-orange-600" : "text-slate-300"}`}
            />

            {openSideBar && (
              <span
                className={`${menuItem.isSelected ? "text-orange-600" : "text-slate-300"}`}
              >
                {menuItem.name}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SideBar;
