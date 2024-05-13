"use client";
import { addClient, updateClient } from "@/actions/action";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const AddProject = () => {
  const initialState = {
    client_name: "",
    client_phone: "",
    client_email: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ defaultValues: initialState });

  const router = useRouter();
  const pathname = usePathname();
  const clientSchema = z.object({
    client_name: z.string().nonempty("Client Name is required"),
    client_phone: z.string().nonempty("Client Phone is required"),
    client_email: z
      .string()
      .nonempty("Client Email is required")
      .email("Invalid email address"),
  });

  const [submitError, setSubmitError] = useState(""); // State to hold submit error message
  const [file, setFile] = useState<File | string>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const onSubmit = async (formData: any) => {
    try {
      clientSchema.parse(formData);

      const pathParts = pathname.split("/");
      const id = pathParts.length > 2 && pathParts[2];

      const formDataToSend = new FormData();
      formDataToSend.append("client_name", formData.client_name);
      formDataToSend.append("client_phone", formData.client_phone);
      formDataToSend.append("client_email", formData.client_email);
      if (file) {
        formDataToSend.append("client_image", file);
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
        const response = await fetch(`/api/client/${id}`, requestOption);
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to update employee");
        }
        toast.success("Employee updated successfully");
      } else {
        // Add new employee
        const response = await fetch("/api/client", requestOptions);
        if (!response.ok) {
          throw new Error("Failed to add employee");
        }

        toast.success("client added successfully");
      }

      setTimeout(() => {
        router.push("/clientTable");
      }, 1000);
    } catch (error) {
      console.error("Error saving client:", error);
      setSubmitError(
        error instanceof z.ZodError
          ? error.errors[0].message
          : "An error occurred while saving the client."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const pathParts = pathname.split("/");
      const id = pathParts.length > 2 ? pathParts[2] : null;

      if (id) {
        try {
          const res = await fetch("/api/client/" + id);
          if (!res.ok) {
            throw new Error("Failed to fetch client data");
          }
          const result = await res.json();

          // Set form values using setValue from React Hook Form
          setValue("client_name", result[0].client_name);
          setValue("client_phone", result[0].client_phone);
          setValue("client_email", result[0].client_email);
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      }
    };

    fetchData();
  }, [pathname, setValue]);
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
    <div className="max-h-auto min-h-screen flex flex-col w-full justify-center items-center px-4 py-8 bg-white rounded-lg shadow-md">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/3">
        <h2 className="text-xl font-semibold text-blue-800 mb-10">
          General Details
        </h2>
        <div className="flex flex-col mb-4">
          <label
            htmlFor="client_name"
            className="mb-2 text-sm font-medium text-gray-600"
          >
            Client Name
          </label>
          <input
            id="client_name"
            type="text"
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            {...register("client_name")}
          />
        </div>
        <div className="flex flex-col mt-5">
          <label
            htmlFor="employee_designation"
            className="mb-2 text-sm font-medium text-gray-600"
          >
            Upload image
          </label>
          <input
            id="client_image"
            type="file"
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
        <h2 className="text-xl text-indigo-800 font-semibold my-10">
          Contact Details
        </h2>
        <div className="flex flex-col mb-4">
          <label
            htmlFor="client_email"
            className="mb-2 text-sm font-medium text-gray-600"
          >
            Email Address
          </label>
          <input
            id="client_email"
            type="email"
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            {...register("client_email")}
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
            id="client_phone"
            type="tel"
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            {...register("client_phone")}
          />
        </div>
        {submitError && (
          <div className="text-red-500 text-sm mt-1">{submitError}</div>
        )}
        <div className="flex gap-3 justify-end">
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
