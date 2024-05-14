"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchAllEmployeeClients } from "@/actions/action";
import { CheckCheck, CircleX, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmployeeClient {
  employee_id: number;
  employee_name: string;
  client_id: number;
  client_name: string;
  client_added_date: string;
  removed_date: string;
  isactive: boolean;
}

interface GroupedEmployeeClients {
  [employeeId: number]: {
    employee_id: number;
    employee_name: string;
    clients: {
      client_id: number;
      client_name: string;
      client_added_date: string;
      removed_date: string;
      isactive: boolean;
    }[];
  };
}

const ActiveTable = () => {
  const [employeeClients, setEmployeeClients] = useState<EmployeeClient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const clientsData = await fetchAllEmployeeClients();
        setEmployeeClients(clientsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEmployee();
  }, []);

  const groupedEmployeeClients = employeeClients.reduce(
    (acc: GroupedEmployeeClients, curr) => {
      const employeeId = curr.employee_id;
      if (!acc[employeeId]) {
        acc[employeeId] = {
          employee_id: curr.employee_id,
          employee_name: curr.employee_name,
          clients: [],
        };
      }
      acc[employeeId].clients.push({
        client_id: curr.client_id,
        client_name: curr.client_name,
        client_added_date: curr.client_added_date,
        removed_date: curr.removed_date,
        isactive: curr.isactive,
      });
      return acc;
    },
    {} as GroupedEmployeeClients
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = Object.values(groupedEmployeeClients).filter(
    (employee) =>
      employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 gap-4 max-h-auto min-h-screen">
      <div className="m-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employee..."
            className="pl-8 bg-white-100 py-4 sm:w-[200px] md:w-[200px] lg:w-[260px] focus-visible:ring-transparent border-none focus:outline-none appearance-none"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      {filteredEmployees.map((employee) => (
        <Card key={employee.employee_id} className="">
          <CardHeader>
            <CardTitle>
              Employee {employee.employee_id} : {employee.employee_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h3 className="text-lg font-semibold mb-2">Assigned Clients:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {employee.clients.map((client: any) => (
                  <div
                    key={client.client_id}
                    className="bg-gray-100 p-4 rounded-md"
                  >
                    <p>
                      <span className="font-bold">Client Name:</span>{" "}
                      {client.client_name}
                    </p>
                    <p>
                      <span className="font-bold">Client Added Date:</span>{" "}
                      {client.client_added_date}
                    </p>
                    <p>
                      <span className="font-bold">Removed Date:</span>{" "}
                      {client.removed_date}
                    </p>
                    <div className="flex items-center">
                      <span className="font-bold mr-2">Status:</span>
                      {client.isactive ? (
                        <CheckCheck className="text-green-500 h-5 w-5" />
                      ) : (
                        <CircleX className="text-red-500 h-5 w-5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActiveTable;
