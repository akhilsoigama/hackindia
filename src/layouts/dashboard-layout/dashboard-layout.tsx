// DashboardLayout.tsx
import { Suspense } from "react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Sidebar from "../../section/Sidebar";
import Navbaar from "../../section/Navbaar";
import { Translated } from "../../components/common/translator/translator";
import { ParticleButton } from "../../components/ui/particle-button";

interface DashboardLayoutProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

const DashboardLayout = ({ isMobileOpen, toggleMobileSidebar }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/dashboard";

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden " style={{ boxSizing: 'border-box' }}>
      <Suspense fallback={<div><Translated text="Loading Sidebar..."/></div>}>
        <Sidebar isMobileOpen={isMobileOpen} toggleMobileSidebar={toggleMobileSidebar} useUiSidebar={true} />
      </Suspense>

      <div className="flex min-h-screen w-full max-w-full flex-1 flex-col overflow-x-hidden" style={{ minWidth: 0, boxSizing: 'border-box' }}>
        <Suspense fallback={<div><Translated text="Loading Navbaar..."/></div>}>
          <Navbaar toggleMobileSidebar={toggleMobileSidebar} />
        </Suspense>

        <div className="flex-1 w-full max-w-full overflow-x-hidden" style={{ minWidth: 0, boxSizing: 'border-box' }}>
          {showBackButton && (
            <div className="px-3 pt-3 sm:px-4 sm:pt-4">
              <ParticleButton
                onClick={() => navigate(-1)}
                successDuration={600}
                variant="default"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
              >
                <FaArrowLeft className="h-3.5 w-3.5" />
                <Translated text="Back" />
              </ParticleButton>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
