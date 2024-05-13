import React from "react";
import { signOut } from "next-auth/react";
const logout = () => {
  return (
    <div>
      <button
        onClick={() => {
          signOut();
        }}
      ></button>
    </div>
  );
};

export default logout;
