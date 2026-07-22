import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center ">
        <div className="w-full max-w-md rounded-lg  p-8 shadow-md">
          {/* form generic text */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-gray-600">
              Enter your credentials to access your account.
            </p>
          </div>
          {/* form */}
          <LoginForm />
        </div>
      </div>
    </>
  );
}
