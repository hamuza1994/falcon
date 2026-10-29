"use client";

import dynamic from "next/dynamic";
import { SidebarNav } from "@/components/sidebar-nav";
import { SidebarLayout } from "@/components/sidebar-layout";

// Dynamically import the dashboard with SSR disabled
const TacticalDashboard = dynamic(
  () =>
    import("@/components/tactical-map-display").then(
      (mod) => mod.TacticalDashboard
    ),
  { ssr: false }
);

export default function TacticalMapPage() {
  return (
    <div className="flex h-screen bg-black">
      <SidebarNav />
      <SidebarLayout>

        {/* No Suspense needed – the dynamic import handles the loading state */}
        <TacticalDashboard />
      </SidebarLayout>
    </div>
  );
}
