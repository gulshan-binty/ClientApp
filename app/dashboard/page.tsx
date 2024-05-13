// Dashboard.js

import DashboardHeader from "../components/header";
import DashbordCard from "../components/dashbordCard";
import DashboardTable from "../components/dashboardTable";
import Image from "../components/image";

const Dashboard = async () => {
  return (
    <div className="flex flex-col flex-1 max-h-auto min-h-screen">
      {/* Header */}
      <DashboardHeader />

      {/* Content area */}
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Main content */}
        <DashbordCard />

        {/* Client Support Information */}
        <DashboardTable />
      </div>

      {/* Add Project Modal */}
      {/* {isAddProjectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Add Project</h2>

          </div>
        </div>
      )} */}
    </div>
  );
};

export default Dashboard;
