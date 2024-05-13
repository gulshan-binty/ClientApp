// ClientTable.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ClientTable from "@/app/clientTable/page";
import { deleteClient, fetchData } from "@/actions/action";
import Swal from "sweetalert2";

jest.mock("@/actions/action", () => ({
  deleteClient: jest.fn(),
  fetchData: jest.fn(),
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
describe("ClientTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the client table", async () => {
    const mockData = [
      {
        client_id: 1,
        client_name: "John Doe",
        client_email: "john@example.com",
        client_phone: "1234567890",
      },
    ];

    (fetchData as jest.Mock).mockResolvedValueOnce(mockData);

    render(<ClientTable />);

    // Wait for the data to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("deletes a client", async () => {
    const mockData = [
      {
        client_id: 1,
        client_name: "John Doe",
        client_email: "john@example.com",
        client_phone: "1234567890",
      },
    ];

    (fetchData as jest.Mock).mockResolvedValueOnce(mockData);
    (deleteClient as jest.Mock).mockResolvedValueOnce({ ok: true });
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });

    render(<ClientTable />);

    // Find the delete button for the first client
    const deleteButton = await screen.findByTestId("delete-button-1");

    // Simulate clicking the delete button
    fireEvent.click(deleteButton);

    // Wait for the deletion to complete
    await waitFor(() => {
      expect(deleteClient).toHaveBeenCalledWith(1);
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });
});
