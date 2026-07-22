import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();
  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      {children}
    </div>
  );
};

export default DashboardLayout;
