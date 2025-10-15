import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <SidebarContext.Provider
      value={{ user, setUser, selectedTopic, setSelectedTopic }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
