import { SignupForm } from "@/features/auth/components/signUp-form";
import { requireUnauth } from "@/lib/auth-utils";

export default async function LoginPage() {

  await requireUnauth();

  return (
    <SignupForm />

  );
}
