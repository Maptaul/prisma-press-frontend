import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center ">
        <div className="w-full max-w-md rounded-lg  p-8 shadow-md">
          {/* form generic text */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">Create an Account</h2>
            <p className="text-gray-600">
              Fill in your details to get started.
            </p>
          </div>
          {/* form */}
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
