'use client';

import { RFIDLogs } from '@/components/rfid';
import { SidebarLayout } from '@/components/sidebar-layout';
import { SidebarNav } from '@/components/sidebar-nav';
import { Suspense } from 'react';

export default function ICEAnalysisPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <SidebarNav />

     <SidebarLayout> 
        <div className="p-8">
          <Suspense fallback={<div className="flex items-center justify-center h-screen text-slate-400">Loading ICE analysis...</div>}>
            <RFIDLogs />
          </Suspense>
        </div>
       </SidebarLayout> 
    </div>
  );
}
