export const fetchData = async () => {
  const response = await fetch("/api/client");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};
export const fetchEmployeeData = async () => {
  const response = await fetch("/api/employee");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

// clientApi.ts
export const addClient = async (formData: any) => {
  try {
    const response = await fetch("/api/client", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to add client");
    }

    return response.json();
  } catch (error) {
    console.error("Error adding client:", error);
    throw error;
  }
};

export const addEmployee = async (formData: any) => {
  try {
    const response = await fetch("/api/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to add client");
    }

    return response.json();
  } catch (error) {
    console.error("Error adding client:", error);
    throw error;
  }
};
export const deleteClient = async (clientId: any) => {
  try {
    const response = await fetch(`/api/client/${clientId}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};
export const deleteEmployee = async (employeeId: any) => {
  try {
    const response = await fetch(`/api/employee/${employeeId}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

export const updateClient = async (clientId: any, formData: any) => {
  try {
    const response = await fetch(`/api/client/${clientId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update client");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export const updateEmployee = async (employeeId: any, formData: FormData) => {
  try {
    const response = await fetch(`/api/employee/${employeeId}`, {
      method: "PUT",
      body: formData, // Send formData directly without stringifying
    });

    if (!response.ok) {
      throw new Error("Failed to update employee");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export const addEmployeeClient = async (formData: any) => {
  try {
    debugger;
    console.log("client data: ", JSON.stringify(formData));
    const response = await fetch("/api/employee_client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to add employee client");
    }

    return response.json();
  } catch (error) {
    console.error("Error adding employee client:", error);
    throw error;
  }
};

export const fetchEmployeeClients = async (employeeId: any) => {
  try {
    const response = await fetch(`/api/employee_client/${employeeId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch assigned clients");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching assigned clients:", error);
    throw error;
  }
};
export const fetchAllEmployeeClients = async () => {
  try {
    const response = await fetch(`/api/employee_client`);

    if (!response.ok) {
      throw new Error("Failed to fetch assigned clients");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching assigned clients:", error);
    throw error;
  }
};

export const fetchClientById = async (clientId: string) => {
  try {
    const response = await fetch(`/api/client/${clientId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch client");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error;
  }
};

export async function removeEmployeeClients(employeeId: any) {
  try {
    const response = await fetch(`/api/employee_client/${employeeId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to remove employee clients");
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing employee clients:", error);
    throw error;
  }
}

// Function to update remove date for a specific employee-client relationship
export const updateEmployeeClientRemoveDate = async (employeeId: string) => {
  try {
    const response = await fetch(`/api/employee_client/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ removed_date: new Date().toISOString() }), // Current date
    });

    if (!response.ok) {
      throw new Error("Failed to update employee-client relationship");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating employee-client relationship:", error);
    throw error;
  }
};
// This function will remove the client for the given employee ID and set the removed date
export async function removeEmployeeClientWithRemoveDate(
  employeeId: string,
  clientId: string
) {
  try {
    const response = await fetch(`/api/employee_client/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientId }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove employee client");
    }

    return response.json();
  } catch (error) {
    console.error("Error removing employee client:", error);
    throw error;
  }
}
export const updateEmployeeClientAddDate = async (
  employeeId: string,
  clientIds: string[]
) => {
  try {
    const response = await fetch(`/api/employee_client/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientIds }),
    });

    if (!response.ok) {
      throw new Error("Failed to update employee-client relationship");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating employee-client relationship:", error);
    throw error;
  }
};
// utils/api.js
export const updateRemoveDate = async (
  employeeId: string,
  clientId: string,
  removeDate: any
) => {
  try {
    // Create a new Date instance for the current date and time
    const response = await fetch(`/api/employee_client/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ remove_date: removeDate }),
    });

    if (!response.ok) {
      throw new Error("Failed to update remove date");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating remove date:", error);
    throw error;
  }
};
