import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export function Layout({ children }: { children: ReactNode }) {
  const { isLoading, data: user } = useUser();
  const { isRTL } = useTranslation();

  const isSenior = user?.ageGroup?.includes("Senior");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground flex ${isRTL ? 'rtl' : 'ltr'}`}>
      <Sidebar />
      <main className={`flex-1 ${isRTL ? 'mr-64 ml-0' : 'ml-64 mr-0'} p-8 overflow-y-auto h-screen ${isSenior ? 'text-lg' : ''}`}>
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
