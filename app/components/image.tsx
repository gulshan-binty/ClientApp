"use client";
import React, { useState } from "react";

const image = () => {
  const [file, setFile] = useState<File>();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault;
    console.log(e);
    if (!file) return;
    try {
      const data = new FormData();
      data.set("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (error) {
      console.log(e);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} encType="multipart/form-data">
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
            onChange={(e) => setFile(e.target.files?.[0])}
          />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default image;
