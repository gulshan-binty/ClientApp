"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Briefcase } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchData, fetchEmployeeData } from "@/actions/action";

const DashbordCard = () => {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await fetchData();
        setClients(data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const data = await fetchEmployeeData();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchClients();
    fetchEmployees();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clients</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clients.length}</div>
          <p className="text-xs text-muted-foreground">
            Total number of clients
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employees.length}</div>
          <p className="text-xs text-muted-foreground">
            Total number of employees
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashbordCard;
