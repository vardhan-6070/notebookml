import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignUp({ searchParams }: { searchParams: Message }) {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-md p-6 bg-background rounded-lg shadow-md mx-auto">
        <form className="flex flex-col w-full">
          <h1 className="text-2xl font-medium text-center mb-4">Sign up</h1>
          <p className="text-sm text-foreground text-center mb-8">
            Already have an account?{" "}
            <Link className="text-foreground font-medium underline" href="/sign-in">
              Sign in
            </Link>
          </p>
          <div className="flex flex-col gap-4 w-full">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="you@example.com" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                type="password"
                name="confirm-password"
                placeholder="Confirm your password"
                required
                className="mt-1"
              />
            </div>
            <SubmitButton pendingText="Signing Up..." formAction={signUpAction}>
              Sign up
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
  );
}
