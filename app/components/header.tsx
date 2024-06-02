import DashboardSearch from "./dashboardSearch";

const DashboardHeader = () => {
  return (
    <header className="">
      <div className="flex justify-between items-center px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-600">
          Welcome to Your Dashboard
        </h2>
        <div className="flex items-center gap-2 sm:flex-col md:flex-row">
          <DashboardSearch />
          {/* <button
            onClick={openModal} // Open the modal when clicked
            className="text-white bg-indigo-500 focus:outline-none p-2 rounded-md font-semibold"
          >
            Add Project
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
