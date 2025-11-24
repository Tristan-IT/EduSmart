import { motion } from 'framer-motion';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function TeacherAnalyticsTest() {
  const { user } = useAuth();

  console.log('[TeacherAnalyticsTest] Rendering with user:', user);

  return (
    <SidebarProvider>
      <AppSidebar role="teacher" />
      <main className="flex-1 w-full">
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Analytics Test Page</h1>
            </div>
          </div>
        </motion.div>

        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Route Working!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>User:</strong> {user?.name || 'No user'}
                </div>
                <div>
                  <strong>Email:</strong> {user?.email || 'No email'}
                </div>
                <div>
                  <strong>Role:</strong> {user?.role || 'No role'}
                </div>
                <div>
                  <strong>ID:</strong> {user?.id || 'No ID'}
                </div>
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-700">
                    ✅ Jika Anda melihat halaman ini, berarti route /teacher-analytics BERHASIL diakses!
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Masalah redirect sudah teratasi. Anda dapat mengganti dengan komponen TeacherAnalyticsAdvanced.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  );
}
