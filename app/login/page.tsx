import { redirect, useRouter } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Login from "./login";

const LoginPage = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Login></Login>
    </div>
  );
};

export default LoginPage;
