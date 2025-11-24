import React from 'react';
import { Topbar } from '@/components/Topbar';
import { AppSidebar } from '@/components/AppSidebar';
import PathRecommendations from '@/components/PathRecommendations';
import { SidebarProvider } from '@/components/ui/sidebar';

export const RecommendationsPage: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        <AppSidebar role="student" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            <div className="container max-w-5xl mx-auto p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Learning Path Recommendations
                </h1>
                <p className="text-gray-600 mt-2">
                  Personalized suggestions based on your progress and performance
                </p>
              </div>
              
              <PathRecommendations />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RecommendationsPage;
