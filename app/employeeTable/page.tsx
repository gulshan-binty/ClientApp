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
import { Search, SquarePen, Trash2, UserRoundPlus } from "lucide-react";
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

const employeeTable = () => {
  const [employee, setEmployee] = useState<employee[]>([]);
  const [clientData, setClientData] = useState([]);
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
        const clientData = await fetchAllEmployeeClients(); // Function to fetch client data
        setClientData(clientData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEmployee();
  }, []);

  const handleDelete = async (employeeId: number) => {
    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#667eea",
      cancelButtonColor: "#c53030",
      confirmButtonText: "Yes, delete it!",
      width: "25em",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteEmployee(employeeId);
        if (response.ok) {
          setEmployee((prevClients) =>
            prevClients.filter(
              (employee) => employee.employee_id !== employeeId
            )
          );
          // Swal.fire("Deleted!", "Your client has been deleted.", "success");
        } else {
          console.error("Failed to delete client");
          Swal.fire("Error!", "Failed to delete client.", "error");
        }
      } catch (error) {
        // Handle errors during the deletion process
        console.error("Error deleting client:", error);
        Swal.fire(
          "Error!",
          "An error occurred while deleting client.",
          "error"
        );
      }
    }
  };

  const handleEdit = (employeeId: number) => {
    router.push(`/editEmployee/${employeeId}`);
  };
  const handleClient = (employeeId: number) => {
    router.push(`/assign_client/${employeeId}`);
  };
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
          Manage your employee and view their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Id</TableHead>
              <TableHead>Employee Image</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Employee Email</TableHead>
              <TableHead>Employee Phone</TableHead>
              <TableHead>Employee Designation</TableHead>
              <TableHead>Assigned Clients</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((e) => (
              <TableRow key={e.employee_id}>
                <TableCell className="font-medium">{e.employee_id}</TableCell>
                <TableCell>
                  <img src={e.employee_image} alt="" height={80} width={80} />
                </TableCell>
                <TableCell>{e.employee_name}</TableCell>
                <TableCell>{e.employee_email}</TableCell>
                <TableCell>{e.employee_phone}</TableCell>
                <TableCell>{e.employee_designation}</TableCell>
                <TableCell className="font-extralight">
                  {clientData
                    .filter(
                      (client: any) =>
                        client.employee_id === e.employee_id &&
                        client.isactive === true
                    )
                    .slice(0, showAllClients ? undefined : 3)
                    .map((client: any) => (
                      <div
                        className="font-medium text-gray-700"
                        key={client.client_id}
                      >
                        {client.client_name}
                      </div>
                    ))}
                  {clientData.filter(
                    (client: any) =>
                      client.employee_id === e.employee_id &&
                      client.isactive === true
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
                  <button onClick={() => handleEdit(e.employee_id)}>
                    <SquarePen className="h-4 w-4 font-thin text-gray-900" />
                  </button>
                  <button onClick={() => handleDelete(e.employee_id)}>
                    <Trash2 className="h-4 w-4 font-thin text-gray-900" />
                  </button>
                  <button
                    data-testid={`delete-button-${e.employee_id}`}
                    onClick={() => handleClient(e.employee_id)}
                  >
                    <UserRoundPlus className="h-4 w-4 font-thin text-gray-900" />
                  </button>
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

export default employeeTable;
