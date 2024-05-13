// ClientTable.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateClient from "@/app/createClient/page";
import { fetchData, deleteClient } from "@/actions/action";

jest.mock("@/actions/action", () => ({
  fetchData: jest.fn(),
  deleteClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/addProject/123"),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe("ClientTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the client table with data", async () => {
    const mockClients = [
      {
        client_id: 1,
        client_name: "Client 1",
        client_email: "client1@example.com",
        client_phone: "1234567890",
      },
      {
        client_id: 2,
        client_name: "Client 2",
        client_email: "client2@example.com",
        client_phone: "9876543210",
      },
    ];

    (fetchData as jest.Mock).mockResolvedValueOnce(mockClients);

    render(<CreateClient />);

    // Wait for data to be loaded and displayed
  });
});
