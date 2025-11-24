import { motion } from 'framer-motion';
import CalibrationDashboard from '@/components/CalibrationDashboard';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Sliders } from 'lucide-react';

export default function CalibrationPage() {
  return (
    <SidebarProvider>
      <AppSidebar role="teacher" />
      <main className="flex-1 w-full">
        {/* Header */}
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-3 flex-1">
              <Sliders className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Kalibrasi Kesulitan
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="min-h-screen bg-background">
          <CalibrationDashboard />
        </div>
      </main>
    </SidebarProvider>
  );
}
