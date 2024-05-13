"use client";
import React from "react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import image from "@/public/image/corinne-kutz-tMI2_-r5Nfo-unsplash.jpg";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { ZodError, z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = { email, password };
      LoginSchema.parse(formData);
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("invalid email or password");
      }

      // If the user exists, proceed with sign-in
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res?.error) {
        router.push("/dashboard");
      } else {
        setSubmitError("Invalid email or password.");
      }
    } catch (error: any) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const newFieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            newFieldErrors[err.path[0]] = err.message;
          }
        });
        setFieldErrors(newFieldErrors);
      } else {
        setSubmitError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-row-reverse">
      <div className="h-screen w-1/2">
        <Image
          src={image}
          alt="Image"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="w-1/2 bg-white flex flex-col  items-center justify-center">
        <h2 className="text-gray-800 mb-4 text-3xl font-bold">
          Welcome to the entrance <br />
          Log in to continue
        </h2>
        <p className="text-left pb-4">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className=" font-semibold underline text-indigo-500"
          >
            Create a new account
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="w-2/3">
          {/* Email input field */}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded-full outline-none w-full py-3 px-3 text-gray-700 leading-tight border-gray-300"
            />
            {fieldErrors.email && (
              <p className="text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password input field */}
          <div className="mb-1">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded-full outline-none w-full py-3 px-3 text-gray-700 mb-3 leading-tight border-gray-300"
            />
            {fieldErrors.password && (
              <p className="text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          {/* Forget Password link */}

          {/* Error message for submit error */}
          {submitError && <p className="text-red-500">{submitError}</p>}

          {/* Submit button */}
          <div className="w-full mt-3">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full mt-4 font-bold py-2 px-4 rounded-full"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default login;
