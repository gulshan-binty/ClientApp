"use client";
import { FormEvent, useState } from "react";
import Image from "next/image";
import loginImage from "@/public/image/corinne-kutz-tMI2_-r5Nfo-unsplash.jpg";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

import { any, z } from "zod";

const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
});

const signup = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);

    try {
      const formDataObject = {
        email: formdata.get("email") as string,
        password: formdata.get("password") as string,
        confirmPassword: formdata.get("confirmPassword") as string,
      };

      // Validate form data against the schema
      SignupSchema.parse(formDataObject);

      // Check if email already exists
      const emailExistsResponse = await fetch(`/api/auth/check-email`, {
        method: "POST",
        body: JSON.stringify({ email: formDataObject.email }),
      });

      if (!emailExistsResponse.ok) {
        throw new Error("Email already exists. Please login in.");
      }

      // Check if confirmPassword matches password
      if (formDataObject.password !== formDataObject.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // If all validations pass, proceed with form submission
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        body: JSON.stringify(formDataObject),
      });

      if (response.ok) {
        router.push("/login");
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ confirmPassword: error.message });
      }
    }
  };

  return (
    <div className="flex flex-row-reverse">
      <div className="h-screen w-1/2">
        <Image
          src={loginImage}
          alt="Image"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="w-1/2 bg-white flex flex-col items-center justify-center">
        <h2 className="text-gray-800 mb-4 text-3xl font-bold">
          Welcome to the entrance <br />
          Sign up to continue
        </h2>
        <p className="text-left pb-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold underline text-indigo-500"
          >
            Login to your account
          </Link>
        </p>
        <form onSubmit={handleSignup} className="w-2/3">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="shadow appearance-none border rounded-full w-full py-3 px-3 text-gray-700 outline-none"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="shadow appearance-none border rounded-full outline-none w-full py-3 px-3 text-gray-700 mb-3 leading-tight border-gray-300"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="shadow appearance-none border rounded-full outline-none w-full py-3 px-3 text-gray-700 mb-3 leading-tight border-gray-300"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="w-full mt-3">
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white w-full mt-4 font-bold py-2 px-4 rounded-full"
              type="submit"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default signup;
