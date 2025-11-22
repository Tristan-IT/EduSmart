import { useState } from 'react';
import CalibrationDashboard from '@/components/CalibrationDashboard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CalibrationPage() {
  return (
    <div className="min-h-screen bg-background">
      <CalibrationDashboard />
    </div>
  );
}
