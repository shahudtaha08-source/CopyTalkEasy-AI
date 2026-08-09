import { useUser } from "@/hooks/use-user";
import { useLocation } from "wouter";
import { Loader2, Leaf } from "lucide-react";
import Landing from "@/pages/Landing";
import SetupProfile from "@/pages/SetupProfile";
import { isDemoMode } from "@/lib/demo-data";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUser();
  const [location] = useLocation();

  // Demo mode bypasses auth entirely
  if (isDemoMode()) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white shadow-xl">
          <Leaf className="w-7 h-7" />
        </div>
        <Loader2 className="w-7 h-7 animate-spin text-teal-600" />
        <p className="text-muted-foreground text-sm">Loading TalkEasy…</p>
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  if (!user.ageGroup || !user.preferredLanguage) {
    return <SetupProfile />;
  }

  return <>{children}</>;
}
