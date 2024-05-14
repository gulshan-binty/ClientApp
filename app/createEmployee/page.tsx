"use client";
import Multiselect from "multiselect-react-dropdown";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  fetchData,
  fetchEmployeeClients,
  addEmployeeClient,
  removeEmployeeClients,
} from "@/actions/action";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const AddProject = () => {
  const initialState = {
    employee_name: "",
    employee_phone: "",
    employee_email: "",
    employee_designation: "",
    employee_image: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ defaultValues: initialState });

  const router = useRouter();
  const pathname = usePathname();
  const employeeSchema = z.object({
    employee_name: z.string().nonempty("Employee Name is required"),
    employee_designation: z
      .string()
      .nonempty("Employee designation is required"),
    employee_phone: z.string().nonempty("Employee Phone is required"),
    employee_email: z
      .string()
      .nonempty("Employee Email is required")
      .email("Invalid email address"),
  });

  const [submitError, setSubmitError] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [assignedClientNames, setAssignedClientNames] = useState<string[]>([]);
  const [file, setFile] = useState<File | string>();
  const [imageUrl, setImageUrl] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDataAndAssignClients = async () => {
      try {
        // Fetch client data
        const clientData = await fetchData();
        setClients(clientData);

        // Fetch employee data if updating employee
        const pathParts = pathname.split("/");
        const id = pathParts.length > 2 ? pathParts[2] : null;

        if (id) {
          const employeeRes = await fetch(`/api/employee/${id}`);
          if (!employeeRes.ok) {
            throw new Error("Failed to fetch employee data");
          }
          const employeeData = await employeeRes.json();
          // Set form values using setValue from React Hook Form
          setValue("employee_name", employeeData[0].employee_name);
          setValue("employee_phone", employeeData[0].employee_phone);
          setValue("employee_email", employeeData[0].employee_email);
          setValue(
            "employee_designation",
            employeeData[0].employee_designation
          );

          // Fetch assigned client IDs for the employee
          const clientData = await fetchEmployeeClients(id);

          const activeClients = clientData.filter(
            (client: any) => client.isactive
          );

          const assignedClientIds = activeClients.map(
            (client: any) => client.client_id
          );

          const assignedClientNames = activeClients.map(
            (client: any) => client.client_name
          );

          setSelectedClients(assignedClientIds);
          setAssignedClientNames(assignedClientNames);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchDataAndAssignClients();
  }, [pathname, setValue]);

  const onSubmit = async (formData: any) => {
    try {
      employeeSchema.parse(formData);

      const pathParts = pathname.split("/");
      const id = pathParts.length > 2 && pathParts[2];

      const formDataToSend = new FormData();
      formDataToSend.append("employee_name", formData.employee_name);
      formDataToSend.append("employee_phone", formData.employee_phone);
      formDataToSend.append("employee_email", formData.employee_email);
      formDataToSend.append(
        "employee_designation",
        formData.employee_designation
      );
      if (file) {
        formDataToSend.append("employee_image", file);
      }

      const requestOptions = {
        method: "POST",
        body: formDataToSend,
      };
      const requestOption = {
        method: "PUT",
        body: formDataToSend,
      };
      if (id) {
        // Update existing employee
        const response = await fetch(`/api/employee/${id}`, requestOption);
        if (!response.ok) {
          throw new Error("Failed to update employee");
        }
        toast.success("Employee updated successfully");
        // await removeEmployeeClients(id);
      } else {
        // Add new employee
        const response = await fetch("/api/employee", requestOptions);
        if (!response.ok) {
          throw new Error("Failed to add employee");
        }

        toast.success("Employee added successfully");
      }
      if (selectedClients.length > 0) {
        await addEmployeeClient({
          employee_id: id,
          client_ids: selectedClients,
        });
        // Assign each selected client to the employee
        // for (const clientId of selectedClients) {
        //   // Add employee-client relationship
        //   await addEmployeeClient({
        //     employee_id: id,
        //     client_id: clientId,
        //   });
        // }
      }
      setTimeout(() => {
        router.push("/employeeTable");
      }, 1000);
    } catch (error) {
      console.error("Error saving employee:", error);
      setSubmitError("An error occurred while saving the employee.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const blob = new Blob([selectedFile], { type: selectedFile.type });
      const imageUrl = URL.createObjectURL(blob);
      setFile(selectedFile);
      setImageUrl(imageUrl);
    } else {
      setFile(undefined);
      setImageUrl("");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-h-auto min-h-screen flex flex-col w-full items-center px-4 pt-16 bg-white rounded-lg shadow-md">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <h2 className="text-xl font-semibold text-indigo-800 mb-6">
          General Details
        </h2>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="employee_name"
              className="mb-2 text-sm font-medium text-gray-600"
            >
              Employee Name
            </label>
            <input
              id="employee_name"
              type="text"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register("employee_name")}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="employee_designation"
              className="mb-2 text-sm font-medium text-gray-600"
            >
              Employee Designation
            </label>
            <input
              id="employee_designation"
              type="text"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register("employee_designation")}
            />
          </div>
        </div>
        <div className="flex flex-col mt-5">
          <label
            htmlFor="employee_designation"
            className="mb-2 text-sm font-medium text-gray-600"
          >
            Upload image
          </label>
          <input
            id="employee_image"
            type="file"
            name="file"
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            onChange={handleChange}
          />
          {/* Add preview of the image */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-2 max-h-40"
              height={200}
              width={200}
            />
          )}
        </div>

        <h2 className="text-xl text-indigo-800 font-semibold my-8">
          Contact Details
        </h2>
        <div className="flex gap-4">
          <div className="flex flex-col mb-4">
            <label
              htmlFor="employee_email"
              className="mb-2 text-sm font-medium text-gray-600"
            >
              Email Address
            </label>
            <input
              id="employee_email"
              type="email"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register("employee_email")}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="employee_phone"
              className="mb-2 text-sm font-medium text-gray-600"
            >
              Phone Number
            </label>
            <input
              id="employee_phone"
              type="tel"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register("employee_phone")}
            />
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-6">
            Assign Clients
          </h2>
          <label
            htmlFor="clients"
            className="mb-2 text-sm font-medium text-gray-600"
          >
            Clients
          </label>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Multiselect
              options={clients.map((client: any) => ({
                label: client.client_name,
                value: client.client_id,
              }))}
              selectedValues={assignedClientNames.map((clientName, index) => ({
                label: clientName,
                value: selectedClients[index],
              }))}
              onSelect={(selectedList) => {
                const updatedSelectedClients = selectedList.map(
                  (client: any) => client.value
                );
                const updatedAssignedClientNames = selectedList.map(
                  (client: any) => client.label
                );
                setSelectedClients(updatedSelectedClients);
                setAssignedClientNames(updatedAssignedClientNames);
              }}
              onRemove={(selectedItem) => {
                const updatedSelectedClients = selectedItem.map(
                  (client: any) => client.value
                );
                const updatedAssignedClientNames = selectedItem.map(
                  (client: any) => client.label
                );
                setSelectedClients(updatedSelectedClients);
                setAssignedClientNames(updatedAssignedClientNames);
              }}
              displayValue="label"
            />
          )}
        </div>
        {submitError && (
          <div className="text-red-500 text-sm mt-1">{submitError}</div>
        )}
        <div className="flex gap-3 justify-end mt-3">
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-700 focus:outline-none "
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 rounded-md bg-indigo-100 text-indigo-500 hover:bg-indigo-200 focus:outline-none "
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
