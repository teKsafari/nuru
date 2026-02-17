"use client";

import { useSession, signIn, signUp, signOut } from "@nuru/auth/client";
import { useState } from "react";

// Mock submissions data
const mockSubmissions = [
  {
    id: 1,
    title: "Hello World - Nuru",
    language: "Nuru",
    status: "accepted",
    date: "2025-01-15",
    code: 'andika("Habari Dunia!")',
  },
  {
    id: 2,
    title: "Fibonacci Sequence",
    language: "Nuru",
    status: "accepted",
    date: "2025-01-14",
    code: 'fanya fib = unda(n) {\n  kama (n <= 1) { rudisha n }\n  rudisha fib(n-1) + fib(n-2)\n}',
  },
  {
    id: 3,
    title: "LED Blink Pattern",
    language: "Nuru",
    status: "wrong_answer",
    date: "2025-01-13",
    code: '// LED blink attempt\nandika("blink")',
  },
  {
    id: 4,
    title: "Sorting Algorithm",
    language: "Nuru",
    status: "accepted",
    date: "2025-01-12",
    code: 'fanya panga = unda(orodha) {\n  // bubble sort\n}',
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    accepted: "bg-green-500/20 text-green-400 border-green-500/30",
    wrong_answer: "bg-red-500/20 text-red-400 border-red-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  const labels: Record<string, string> = {
    accepted: "Accepted",
    wrong_answer: "Wrong Answer",
    pending: "Pending",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.pending}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await signUp.email({ email, password, name });
        if (res.error) {
          setError(res.error.message ?? "Sign up failed");
        }
      } else {
        const res = await signIn.email({ email, password });
        if (res.error) {
          setError(res.error.message ?? "Sign in failed");
        }
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-md flex-col items-center justify-center px-4">
      <div className="w-full rounded-xl border border-border/50 bg-card p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
          {isSignUp ? "Create Account" : "Sign In"}
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          {isSignUp
            ? "Sign up to track your submissions"
            : "Sign in to view your submissions"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
            minLength={8}
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black transition-all hover:bg-yellow-400 disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : isSignUp
                ? "Sign Up"
                : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-yellow-500 hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

function SubmissionsDashboard({ userName }: { userName: string }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Submissions</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, <span className="text-yellow-500">{userName}</span>
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-red-500/50 hover:text-red-400"
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: mockSubmissions.length },
          {
            label: "Accepted",
            value: mockSubmissions.filter((s) => s.status === "accepted").length,
          },
          {
            label: "Failed",
            value: mockSubmissions.filter((s) => s.status === "wrong_answer")
              .length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/50 bg-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="overflow-hidden rounded-xl border border-border/50">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/50 bg-muted/30">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Title
              </th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
                Language
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {mockSubmissions.map((sub) => (
              <tr
                key={sub.id}
                className="transition-colors hover:bg-muted/20"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {sub.title}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {sub.language}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={sub.status} />
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {sub.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SubmissionsPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <AuthForm />;
  }

  return <SubmissionsDashboard userName={session.user.name} />;
}
