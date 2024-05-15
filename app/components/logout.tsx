import React from "react";
import { signOut } from "next-auth/react";
const Logout = () => {
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

export default Logout;
