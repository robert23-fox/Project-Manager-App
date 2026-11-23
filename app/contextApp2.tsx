"use client";

import React, { createContext, useContext, useState } from "react";

// setting the structure of the context
type AppType = {
  openSlideBarObject: {
    openSlideBar: boolean;
    setOpenSlideBar: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

// setting the default state
const defaultState: AppType = {
  openSlideBarObject: {
    openSlideBar: false,
    setOpenSlideBar: () => {},
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
  const [openSlideBar, setOpenSlideBar] = useState(false);

  return (
    <ContextApp.Provider
      value={{ openSlideBarObject: { openSlideBar, setOpenSlideBar } }}
    >
      {children}
    </ContextApp.Provider>
  );
}

// creating the hook
export function useContextApp() {
  return useContext(ContextApp);
}
