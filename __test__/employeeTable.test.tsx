import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeTable from "@/app/employeeTable/page"; // Adjust the path as needed
import { fetchAllEmployeeClients, fetchEmployeeData } from "@/actions/action";

jest.mock("@/actions/action", () => ({
  __esModule: true,
  fetchEmployeeData: jest.fn(),
  fetchAllEmployeeClients: jest.fn(),
  deleteEmployee: jest.fn(),
}));
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: jest.fn(),
    };
  },
}));

// describe("Employee Table", () => {
//   it("renders without crashing", async () => {
//     render(<EmployeeTable />);
describe("EmployeeTable", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("renders the employee table", async () => {
    const mockEmployeeData = [
      {
        employee_id: 1,
        employee_name: "John Doe",
        employee_email: "john@example.com",
        employee_phone: "1234567890",
        employee_designation: "Manager",
      },
    ];
    const mockClientData = [
      {
        client_id: 1,
        client_name: "Client 1",
        employee_id: 1,
      },
    ];

    (fetchEmployeeData as jest.Mock).mockResolvedValueOnce(mockEmployeeData);
    (fetchAllEmployeeClients as jest.Mock).mockResolvedValueOnce(
      mockClientData
    );

    render(<EmployeeTable />);

    // Wait for data to be fetched and rendered
  });
});
