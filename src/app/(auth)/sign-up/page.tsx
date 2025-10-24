import { SignupForm } from "@/features/auth/components/signUp-form";
import { requireUnauth } from "@/lib/auth-utils";

export default async function LoginPage() {

  await requireUnauth();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
}
