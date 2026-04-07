import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function FormCard({ children }: { children: ReactNode }) {
  return (
    <Card className="overflow-hidden border-white/70 bg-white/85 shadow-card backdrop-blur">
      <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          Project intake
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Complete the required fields to submit your business request.
        </p>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">{children}</div>
    </Card>
  );
}
