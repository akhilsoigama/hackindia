// DashboardLayout.tsx
import { Suspense } from "react";

import { Outlet } from "react-router-dom";
import Sidebar from "../../section/Sidebar";
import Navbaar from "../../section/Navbaar";

interface DashboardLayoutProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

const DashboardLayout = ({ isMobileOpen, toggleMobileSidebar }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <Suspense fallback={<div>Loading Sidebar...</div>}>
        <Sidebar isMobileOpen={isMobileOpen} toggleMobileSidebar={toggleMobileSidebar} />
      </Suspense>

      <div className="flex-1 flex flex-col">
        <Suspense fallback={<div>Loading Navbaar...</div>}>
          <Navbaar toggleMobileSidebar={toggleMobileSidebar} />
        </Suspense>

        <div className="flex-1">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
