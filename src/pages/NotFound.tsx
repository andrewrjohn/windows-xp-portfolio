import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div>
      <h1 className="text-lg">404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="underline">
        Go back home
      </Link>
    </div>
  );
}
