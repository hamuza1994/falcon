"use client";

import { SidebarLayout } from "@/components/sidebar-layout";
import { SidebarNav } from "@/components/sidebar-nav";

import dynamic from "next/dynamic";

const GeospatialIntel = dynamic(
  () =>
    import("@/components/geospatial-intel-display").then(
      (mod) => mod.GeospatialIntel,
    ),
  { ssr: false },
);

export default function GeospatialPage() {
  return (
    <div className="flex h-screen bg-black">
      <SidebarNav />

      <SidebarLayout className="overflow-hidden">
        <GeospatialIntel />
      </SidebarLayout>
    </div>
  );
}
