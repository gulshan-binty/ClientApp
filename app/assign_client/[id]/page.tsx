"use client";
import React, { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { addEmployeeClient, fetchData } from "@/actions/action"; // Import your action to add employee-client relationship
import { usePathname, useRouter } from "next/navigation";

const assignClient = () => {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    // Fetch clients data when component mounts
    const fetchClients = async () => {
      try {
        const data = await fetchData();
        setClients(
          data.map((client: any) => ({
            label: client.client_name,
            value: client.client_id,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchClients();
  }, []);

  const handleAssignClients = async () => {
    try {
      const pathParts = pathname.split("/");
      const id = pathParts.length > 2 && pathParts[2];
      for (const clientId of selectedClients) {
        await addEmployeeClient({
          employee_id: id,
          client_id: clientId,
        });
      }
      // Optionally, you can display a success message or perform any other action
      console.log("Clients assigned successfully!");
    } catch (error) {
      console.error("Error assigning clients:", error);
    }
    router.push("/employeeTable");
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex h-screen bg-white justify-center">
      <div className="mt-28 w-1/3">
        <h2 className="text-xl font-semibold text-indigo-800 mb-6">
          Assign Clients
        </h2>
        <label
          htmlFor="clients"
          className="mb-2 text-sm font-medium text-gray-600"
        >
          Clients
        </label>
        <Multiselect
          options={clients}
          onSelect={(selectedList) =>
            setSelectedClients(selectedList.map((client: any) => client.value))
          }
          onRemove={(selectedList) =>
            setSelectedClients(
              selectedClients.filter(
                (client) =>
                  !selectedList.map((item: any) => item.value).includes(client)
              )
            )
          }
          displayValue="label"
          className="mb-4"
        />
        <button
          onClick={handleAssignClients}
          className="px-4 py-2 mr-3 rounded-md bg-indigo-500 text-white hover:bg-indigo-700 focus:outline-none"
        >
          Assign Clients
        </button>
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 rounded-md bg-indigo-100 text-indigo-500 hover:bg-indigo-200 focus:outline-none "
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default assignClient;
