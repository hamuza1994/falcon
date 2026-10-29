"use client";

import IncidentComp from "@/components/incident";
import { SidebarLayout } from "@/components/sidebar-layout";
import { SidebarNav } from "@/components/sidebar-nav";
import { incidentsService } from "@/lib/api";
import { Incident } from "@/lib/types";
import { Suspense, useState } from "react";

export default function IncidentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [preSelectedIncidentId, setPreSelectedIncidentId] = useState<
    string | null
  >(null);

  const fetchInitialData = async () => {
    try {
      // Fetch real data from your backend
      // const employees = await employeesService.getAll();
      // const incidentsData = await incidentsService.getAll();
      // setIncidents(incidentsData.data);
      fetchIncidents();
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  const fetchIncidents = async () => {
    try {
      setIsLoading(true);
      const response = await incidentsService.getAll({ limit: 50 });
      if (response.success) {
        const displayIncidents = incidentsService.transformManyToDisplay(
          response.data.data
        );
        setIncidents(displayIncidents);
      }
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
      setError("Failed to load incidents");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <SidebarNav />

       <SidebarLayout> 
        <div className="p-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen text-slate-400">
                Loading ICE analysis...
              </div>
            }
          >
            <IncidentComp
              incidents={incidents}
              setIncidents={setIncidents}
              preSelectedIncidentId={preSelectedIncidentId}
            />
          </Suspense>
        </div>
       </SidebarLayout> 
    </div>
  );
}
