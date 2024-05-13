"use client";
// ClientTable.tsx

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCheck,
  CircleX,
  Search,
  SquarePen,
  Trash2,
  UserRoundPlus,
} from "lucide-react";
import {
  deleteEmployee,
  fetchAllEmployeeClients,
  fetchEmployeeData,
} from "@/actions/action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { Input } from "@/components/ui/input";
interface employee {
  employee_id: number;
  employee_name: string;
  employee_email: string;
  employee_phone: string;
  employee_designation: string;
  employee_image: string;
}
interface EmployeeClient {
  employee_id: number;
  client_id: number;
  client_name: string;
  isActive: boolean; // Added isActive property
}
const activeTable = () => {
  const [employee, setEmployee] = useState<employee[]>([]);
  const [clientData, setClientData] = useState([]);
  const [employeeClients, setEmployeeClients] = useState<EmployeeClient[]>([]);
  const [showAllClients, setShowAllClients] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await fetchEmployeeData();
        setEmployee(data);
        const clientsData = await fetchAllEmployeeClients();
        setEmployeeClients(clientsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEmployee();
  }, []);

  const toggleShowAllClients = () => {
    setShowAllClients(!showAllClients);
  };

  const toggleShowLessClients = () => {
    setShowAllClients(false);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employee.filter((employee: any) =>
    employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  return (
    <Card className="max-h-auto min-h-screen">
      <CardHeader>
        <CardTitle>Employee List</CardTitle>
        <div className="flex justify-end gap-5">
          <form className="flex-1 sm:flex-initial ">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employee..."
                className="pl-8 bg-slate-100 py-4 sm:w-[200px] md:w-[200px] lg:w-[260px] focus-visible:ring-transparent border-none focus:outline-none appearance-none"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </form>

          <Link
            href="/createEmployee"
            className="text-white bg-indigo-400 focus:outline-none p-2 rounded-md font-semibold"
          >
            Create Employee
          </Link>
        </div>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Id</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Assigned Clients</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((e) => (
              <TableRow key={e.employee_id}>
                <TableCell className="font-medium">{e.employee_id}</TableCell>

                <TableCell>{e.employee_name}</TableCell>

                <TableCell className="font-extralight">
                  {employeeClients
                    .filter((client) => client.employee_id === e.employee_id)
                    .slice(0, showAllClients ? undefined : 3)
                    .map((client) => (
                      <div
                        className="font-medium text-gray-700"
                        key={client.client_id}
                      >
                        {client.client_name}
                      </div>
                    ))}
                  {employeeClients.filter(
                    (client) => client.employee_id === e.employee_id
                  ).length > 3 && (
                    <React.Fragment>
                      {!showAllClients && (
                        <button onClick={toggleShowAllClients}>View All</button>
                      )}
                      {showAllClients && (
                        <button onClick={toggleShowLessClients}>
                          Show Less
                        </button>
                      )}
                    </React.Fragment>
                  )}
                </TableCell>

                <TableCell className="flex items-center gap-3 ">
                  {employeeClients
                    .filter((client) => client.employee_id === e.employee_id)
                    .every((client) => client.isActive) ? (
                    <span className="text-red-500">
                      {/* Render cross sign if any client is inactive */}
                      <CircleX className="h-5 w-5" />
                    </span>
                  ) : (
                    <span className="text-green-500">
                      {/* Render tick sign if all clients are active */}
                      <CheckCheck className="h-5 w-5" />
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(employee.length / itemsPerPage)}
          onPageChange={(event) => setCurrentPage(event.selected)}
          containerClassName={"flex justify-center items-center mt-4"}
          pageClassName={"mx-2 px-3 py-2 bg-gray-200 rounded"}
          activeClassName={"bg-indigo-400 text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </CardContent>
    </Card>
  );
};

export default activeTable;
