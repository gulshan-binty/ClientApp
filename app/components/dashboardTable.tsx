"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { fetchAllEmployeeClients, fetchEmployeeData } from "@/actions/action";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

const DashboardTable = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeClients, setEmployeeClients] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Clients",
        data: [],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgba(53, 162, 235, 1)",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employees = await fetchEmployeeData();
        setEmployeeData(employees);

        const clientRelations = await fetchAllEmployeeClients();
        setEmployeeClients(clientRelations);

        const labels = employees.map((employee: any) => employee.employee_name);
        const data = employees.map((employee: any) => {
          const clientCount = clientRelations.filter(
            (relation: any) => relation.employee_id === employee.employee_id
          ).length;
          return clientCount;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: "Number of Clients",
              data,
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              borderColor: "rgba(53, 162, 235, 1)",
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const tooltipCustomizer = (context: any) => {
    const dataIndex = context.dataIndex;
    const employeeName = chartData.labels[dataIndex];

    const clientRelationsForEmployee = employeeClients.filter(
      (relation: any) => relation.employee_name === employeeName
    );

    const clientNames = clientRelationsForEmployee.map(
      (relation: any) => relation.client_name
    );

    const tooltipText = `${employeeName}:\n${clientNames.join(" , ")}`;
    return tooltipText;
  };

  return (
    <Card>
      <CardContent>
        <div className="h-96">
          <Line
            data={chartData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: tooltipCustomizer,
                  },
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTable;
