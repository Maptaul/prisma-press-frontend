import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

const authLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();
  return (
    <div className=" ">
      <Navbar user={user} />
      {children}
    </div>
  );
};

export default authLayout;
