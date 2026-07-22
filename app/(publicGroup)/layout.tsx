import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();
  return (
    <div>
      <Navbar user={user} />
      {children}
    </div>
  );
};

export default PublicLayout;
