import { redirect, useRouter } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Signup from "./signup";

const page = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Signup></Signup>
    </div>
  );
};

export default page;
