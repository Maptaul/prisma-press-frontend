import { Button } from "@/components/ui/button";
import { getMe } from "@/service/getMe";

export default async function HomePage() {
  const user = await getMe();
  console.log(user);
  return (
    <div>
      hello world
      <Button size={"xs"} variant={"destructive"}>
        Click me
      </Button>
    </div>
  );
}
