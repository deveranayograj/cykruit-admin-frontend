import { Button } from "@/components/Button/Button";
import Link from "next/link";

export default function Home() {

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-5xl font-bold mb-8">Welcome to Cykruit!</h1>
        <p className="text-lg mb-8">
          Your one-stop portal for cybersecurity job opportunities.
        </p>
        <div className="mt-8 text-center">
          <Button>
            <Link href="/login" className="text-lg">
              Login to Admin
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
