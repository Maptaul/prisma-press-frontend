import { Progress } from "@/components/ui/progress";
const globalLoading = () => {
  return (
    <div>
      <Progress value={56} className="w-full max-w-sm" />
    </div>
  );
};

export default globalLoading;
