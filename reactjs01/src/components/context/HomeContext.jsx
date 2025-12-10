import { createContext, useContext, useState } from "react";

const HomeContext = createContext();

export function HomeProvider({ children }) {
  const [resetTrigger, setResetTrigger] = useState(0);

  const triggerReset = () => {
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <HomeContext.Provider value={{ resetTrigger, triggerReset }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
}
