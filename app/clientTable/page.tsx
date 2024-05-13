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
import { Search, SquarePen, Trash2 } from "lucide-react";
import {
  deleteClient,
  fetchAllEmployeeClients,
  fetchData,
} from "@/actions/action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { Input } from "@/components/ui/input";
interface Client {
  client_id: number;
  client_name: string;
  client_image: string;
  client_email: string;
  client_phone: string;
}

const ClientTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const clientsData = await fetchData();
        setClients(clientsData);
        const employeesData = await fetchAllEmployeeClients();
        setEmployeeData(employeesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataFromAPI();
  }, []);

  const handleDelete = async (clientId: number) => {
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
        const response = await deleteClient(clientId);
        if (response.ok) {
          setClients((prevClients) =>
            prevClients.filter((client) => client.client_id !== clientId)
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

  const handleEdit = (clientId: number) => {
    router.push(`/editClient/${clientId}`); // Update route for editing
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredClients = clients.filter((client) =>
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const [showAllClients, setShowAllClients] = useState(false);
  const toggleShowAllClients = () => {
    setShowAllClients(!showAllClients);
  };

  const toggleShowLessClients = () => {
    setShowAllClients(false);
  };
  return (
    <Card className="max-h-auto min-h-screen">
      <CardHeader>
        <CardTitle>Client List</CardTitle>
        <div className="flex justify-end gap-5">
          <form className="flex-1 sm:flex-initial">
            <div className="relative ">
              <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8 py-4 bg-slate-100 sm:w-[200px] md:w-[200px] lg:w-[260px] focus-visible:ring-transparent border-none focus:outline-none appearance-none"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </form>
          <Link
            href="/createClient"
            className="text-white bg-indigo-400 focus:outline-none p-2 rounded-md font-semibold"
          >
            Create Client
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
              <TableHead>Client Id</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Client Image</TableHead>
              <TableHead>Client Email</TableHead>
              <TableHead>Client Phone</TableHead>
              <TableHead>Assigned Employee</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((client) => (
              <TableRow key={client.client_id}>
                <TableCell className="font-medium">
                  {client.client_id}
                </TableCell>
                <TableCell>{client.client_name}</TableCell>
                <TableCell>
                  <img
                    src={client.client_image}
                    alt=""
                    height={80}
                    width={80}
                  />
                </TableCell>
                <TableCell>{client.client_email}</TableCell>
                <TableCell>{client.client_phone}</TableCell>
                <TableCell className="font-extralight">
                  {employeeData
                    .filter(
                      (employee: any) => employee.client_id === client.client_id
                    )
                    .slice(0, showAllClients ? undefined : 3)
                    .map((employee: any) => (
                      <div
                        className="font-medium text-gray-700"
                        key={employee.employee_id}
                      >
                        {employee.employee_name}
                      </div>
                    ))}
                  {employeeData.filter(
                    (employee: any) => employee.client_id === client.client_id
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
                <TableCell className="flex items-center gap-3">
                  <button onClick={() => handleEdit(client.client_id)}>
                    <SquarePen className="h-4 w-4 font-thin text-gray-900" />
                  </button>
                  <button
                    data-testid={`delete-button-${client.client_id}`}
                    onClick={() => handleDelete(client.client_id)}
                  >
                    <Trash2 className="h-4 w-4 font-thin text-gray-900" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(filteredClients.length / itemsPerPage)}
          onPageChange={(event) => setCurrentPage(event.selected)}
          containerClassName={"flex justify-center items-center mt-4"}
          pageClassName={"mx-2 px-4 py-2 bg-gray-200 rounded"}
          activeClassName={"bg-indigo-400 text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </CardContent>
    </Card>
  );
};

export default ClientTable;
