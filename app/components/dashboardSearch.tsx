"use client";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import React, { useState } from "react";
import Modal from "react-modal";

interface SearchResult {
  id: number;
  employee_id: number;
  client_id: number;
  employee_name: string;
  client_name: string;
  isactive: boolean;
  client_phone?: string; // Add this line
  client_email?: string; // Add this line
  employee_phone?: string; // Add this line
  employee_email?: string; // Add this line
  employee_designation?: string; // Add this line
}
const DashboardSearch = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [associatedData, setAssociatedData] = useState<SearchResult[]>([]);
  const [showAssociatedData, setShowAssociatedData] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/dashboardSearch?search=${encodeURIComponent(search)}`
      );
      if (response.ok) {
        const data: SearchResult[] = await response.json();
        setResults(data);
        setShowResults(true);
      } else {
        console.error("Failed to fetch results");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setShowResults(false);
  };

  const handleResultClick = async (result: SearchResult) => {
    setSelectedResult(result);
    setShowAssociatedData(true);

    try {
      // Fetch associated clients for the employee
      const employeeResponse = await fetch(
        `/api/dashboardSearch?detailId=employee_${result.employee_id}`
      );
      const employeeData: SearchResult[] = await employeeResponse.json();

      // Fetch associated employees for the client
      const clientResponse = await fetch(
        `/api/dashboardSearch?detailId=client_${result.client_id}`
      );
      const clientData: SearchResult[] = await clientResponse.json();

      if (employeeResponse.ok && clientResponse.ok) {
        setAssociatedData([...employeeData, ...clientData]);
      } else {
        console.error("Failed to fetch associated data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCloseModal = () => {
    setSelectedResult(null);
    setShowAssociatedData(false);
    setAssociatedData([]);
  };

  return (
    <div className="relative p-4">
      <form
        className="flex items-center justify-center mb-4"
        onSubmit={handleSearch}
      >
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients or employees..."
            className="pl-10 pr-10 py-3 w-full focus-visible:ring-transparent border border-gray-300 rounded-md focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <X
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer"
              onClick={handleClearSearch}
            />
          )}
        </div>
      </form>
      {showResults && (
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border border-gray-300 rounded-md shadow-lg p-4 max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.id}
                className="mb-4 p-2 border-b last:border-none cursor-pointer"
                onClick={() => handleResultClick(result)}
              >
                <h3 className="font-semibold text-lg">
                  Employee: {result.employee_name} - Client:{" "}
                  {result.client_name}
                </h3>
                <p>{result.isactive ? "Active" : "Inactive"}</p>
              </div>
            ))
          ) : (
            <p>No matching results found</p>
          )}
        </div>
      )}
      {showAssociatedData && (
        <Modal
          isOpen={true}
          onRequestClose={handleCloseModal}
          contentLabel="Detail View"
          className="bg-white rounded-md shadow-lg p-4 max-w-6xl w-full mx-auto mt-20 relative"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Associated Data</h2>
            <X className="cursor-pointer" onClick={handleCloseModal} />
          </div>
          <div className="flex">
            <div className="w-1/2 pr-4">
              <h3 className="text-lg font-semibold mb-2">
                Employees for Client: {selectedResult?.client_name}
              </h3>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200">Employee</th>
                    <th className="py-2 px-4 bg-gray-200">Phone</th>
                    <th className="py-2 px-4 bg-gray-200">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedResult && (
                    <tr>
                      <td className="py-2 px-4 border-b">
                        {selectedResult.employee_name}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {selectedResult.employee_phone}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {selectedResult.employee_email}
                      </td>
                    </tr>
                  )}
                  {associatedData
                    .filter(
                      (data) =>
                        data.client_id === selectedResult?.client_id &&
                        data.employee_id !== selectedResult?.employee_id
                    )
                    .map((employee) => (
                      <tr key={employee.id}>
                        <td className="py-2 px-4 border-b">
                          {employee.employee_name}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {employee.employee_phone}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {employee.employee_email}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="w-1/2 pl-4">
              <h3 className="text-lg font-semibold mb-2">
                Clients for Employee: {selectedResult?.employee_name}
              </h3>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200">Client</th>
                    <th className="py-2 px-4 bg-gray-200">Phone</th>
                    <th className="py-2 px-4 bg-gray-200">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedResult && (
                    <tr>
                      <td className="py-2 px-4 border-b">
                        {selectedResult.client_name}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {selectedResult.client_phone}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {selectedResult.client_email}
                      </td>
                    </tr>
                  )}
                  {associatedData
                    .filter(
                      (data) =>
                        data.employee_id === selectedResult?.employee_id &&
                        data.client_id !== selectedResult?.client_id
                    )
                    .map((client) => (
                      <tr key={client.id}>
                        <td className="py-2 px-4 border-b">
                          {client.client_name}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {client.client_phone}
                        </td>
                        <td className="py-2 px -4 border-b">
                          {client.client_email}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default DashboardSearch;
