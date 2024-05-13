// AddProject.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddProject from "@/app/createEmployee/page";
import {
  addEmployee,
  fetchData,
  fetchEmployeeClients,
  removeEmployeeClients,
  updateEmployee,
} from "@/actions/action";

jest.mock("@/actions/action", () => ({
  addEmployee: jest.fn(),
  fetchData: jest.fn(),
  fetchAllEmployeeClients: jest.fn(),
  fetchEmployeeClients: jest.fn(),
  removeEmployeeClients: jest.fn(),
  updateEmployee: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/addProject"),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe("AddProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form", async () => {
    (fetchData as jest.Mock).mockResolvedValueOnce([]);

    render(<AddProject />);

    expect(screen.getByLabelText("Employee Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Employee Designation")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    // expect(screen.getByLabelText("Clients")).toBeInTheDocument();
  });

  it("adds a new employee", async () => {
    (fetchData as jest.Mock).mockResolvedValueOnce([]);
    (addEmployee as jest.Mock).mockResolvedValueOnce({ employee_id: 1 });

    render(<AddProject />);

    const employeeNameInput = screen.getByLabelText("Employee Name");
    const employeeDesignationInput = screen.getByLabelText(
      "Employee Designation"
    );
    const emailInput = screen.getByLabelText("Email Address");
    const phoneInput = screen.getByLabelText("Phone Number");
    const submitButton = screen.getByText("Submit");

    userEvent.type(employeeNameInput, "John Doe");
    userEvent.type(employeeDesignationInput, "Manager");
    userEvent.type(emailInput, "john@example.com");
    userEvent.type(phoneInput, "1234567890");

    fireEvent.click(submitButton);

    await waitFor(() => {
      // Inside your component, where updateEmployee is called
      addEmployee({
        employee_name: "Jane Smith",
        employee_designation: "Developer",
        employee_email: "jane@example.com",
        employee_phone: "9876543210",
      });
    });
  });

  it("updates an existing employee", async () => {
    (fetchData as jest.Mock).mockResolvedValueOnce([]);
    (fetchEmployeeClients as jest.Mock).mockResolvedValueOnce([]);
    (removeEmployeeClients as jest.Mock).mockResolvedValueOnce([]);
    (updateEmployee as jest.Mock).mockResolvedValueOnce({});

    jest.mock("next/navigation", () => ({
      usePathname: jest.fn().mockReturnValue("/addProject/123"),
      useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
        back: jest.fn(),
      }),
    }));

    render(<AddProject />);

    const employeeNameInput = screen.getByLabelText("Employee Name");
    const employeeDesignationInput = screen.getByLabelText(
      "Employee Designation"
    );
    const emailInput = screen.getByLabelText("Email Address");
    const phoneInput = screen.getByLabelText("Phone Number");
    const submitButton = screen.getByText("Submit");

    userEvent.type(employeeNameInput, "Jane Smith");
    userEvent.type(employeeDesignationInput, "Developer");
    userEvent.type(emailInput, "jane@example.com");
    userEvent.type(phoneInput, "9876543210");

    fireEvent.click(submitButton);
    await waitFor(() => {
      updateEmployee("123", {
        employee_name: "Jane Smith",
        employee_designation: "Developer",
        employee_email: "jane@example.com",
        employee_phone: "9876543210",
      });
    });
  });
});
