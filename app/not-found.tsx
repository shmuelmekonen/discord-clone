import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 bg-main">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-header">404</h1>
        <p className="text-desc text-lg">
          {"Looks like you're lost in the void."}
        </p>
      </div>
      <Link href="/">
        <Button
          variant="primary"
          className="bg-indigo-500 hover:bg-indigo-500/90 text-white"
        >
          Return Home
        </Button>
      </Link>
    </div>
  );
}
