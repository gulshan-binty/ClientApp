// Dashboard.js

import DashboardHeader from "../components/header";
import DashbordCard from "../components/dashbordCard";
import DashboardTable from "../components/dashboardTable";

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
    </div>
  );
};

export default Dashboard;
