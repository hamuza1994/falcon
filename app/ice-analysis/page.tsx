'use client';

import { SidebarNav } from '@/components/sidebar-nav';
import { ICEAnalysis } from '@/components/ice-analysis-display';
import { Suspense } from 'react';
import { SidebarLayout } from '@/components/sidebar-layout';

export default function ICEAnalysisPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <SidebarNav />

      <SidebarLayout> 
        <div className="p-10">
          <Suspense fallback={<div className="flex items-center justify-center h-screen text-slate-400">Loading ICE analysis...</div>}>
            <ICEAnalysis />
          </Suspense>
        </div>
      </SidebarLayout>
    </div>
  );
}
