import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSelector } from '@/components/ThemeSelector';
import { getAllThemes, type SkillTreeTheme, applyTheme } from '@/lib/skillTreeThemes';
import { Palette, Eye, Settings } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

export default function ThemeCustomizationPage() {
  const [selectedTheme, setSelectedTheme] = useState<SkillTreeTheme>(getAllThemes()[0]);

  const handleSelectTheme = (theme: SkillTreeTheme) => {
    setSelectedTheme(theme);
    applyTheme(theme);
  };

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
              <Palette className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Kustomisasi Tema
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8 max-w-7xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-muted-foreground">
              Pilih tema visual berdasarkan mata pelajaran untuk pengalaman belajar yang lebih menarik
            </p>
          </motion.div>

      <Tabs defaultValue="themes" className="w-full">
        <TabsList>
          <TabsTrigger value="themes">
            <Palette className="w-4 h-4 mr-2" />
            Pilih Tema
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Pengaturan
          </TabsTrigger>
        </TabsList>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tema Tersedia</CardTitle>
              <CardDescription>
                Pilih tema yang sesuai dengan mata pelajaran untuk menyesuaikan tampilan skill tree
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSelector
                selectedTheme={selectedTheme}
                onSelectTheme={handleSelectTheme}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card style={{ backgroundColor: selectedTheme.colors.background }}>
            <CardHeader>
              <CardTitle>Preview: {selectedTheme.name}</CardTitle>
              <CardDescription>Pratinjau tampilan dengan tema yang dipilih</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Background Gradient Preview */}
              <div>
                <h3 className="text-sm font-medium mb-3">Background Gradient</h3>
                <div
                  className="h-32 rounded-lg"
                  style={{
                    background: `linear-gradient(to bottom right, ${selectedTheme.gradients.background.from}, ${selectedTheme.gradients.background.via || selectedTheme.gradients.background.to}, ${selectedTheme.gradients.background.to})`
                  }}
                />
              </div>

              {/* Node States Preview */}
              <div>
                <h3 className="text-sm font-medium mb-3">Node States</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Default Node */}
                  <div className="text-center space-y-2">
                    <div
                      className="w-24 h-24 mx-auto rounded-lg flex items-center justify-center text-3xl border-2"
                      style={{
                        backgroundColor: selectedTheme.colors.nodeDefault,
                        borderColor: selectedTheme.colors.secondary
                      }}
                    >
                      {selectedTheme.icons.default}
                    </div>
                    <p className="text-xs text-muted-foreground">Default</p>
                  </div>

                  {/* Active Node */}
                  <div className="text-center space-y-2">
                    <div
                      className="w-24 h-24 mx-auto rounded-lg flex items-center justify-center text-3xl border-2"
                      style={{
                        backgroundColor: selectedTheme.colors.nodeActive,
                        borderColor: selectedTheme.colors.primary,
                        color: 'white'
                      }}
                    >
                      {selectedTheme.icons.default}
                    </div>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>

                  {/* Completed Node */}
                  <div className="text-center space-y-2">
                    <div
                      className="w-24 h-24 mx-auto rounded-lg flex items-center justify-center text-3xl border-2 shadow-lg"
                      style={{
                        backgroundColor: selectedTheme.colors.nodeCompleted,
                        borderColor: selectedTheme.colors.primary,
                        color: 'white',
                        boxShadow: `0 0 20px ${selectedTheme.colors.glow}60`
                      }}
                    >
                      {selectedTheme.icons.completed}
                    </div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>

                  {/* Locked Node */}
                  <div className="text-center space-y-2">
                    <div
                      className="w-24 h-24 mx-auto rounded-lg flex items-center justify-center text-3xl border-2 opacity-60"
                      style={{
                        backgroundColor: selectedTheme.colors.nodeLocked,
                        borderColor: selectedTheme.colors.nodeLocked
                      }}
                    >
                      {selectedTheme.icons.locked}
                    </div>
                    <p className="text-xs text-muted-foreground">Locked</p>
                  </div>
                </div>
              </div>

              {/* Connection Lines Preview */}
              <div>
                <h3 className="text-sm font-medium mb-3">Connection Lines</h3>
                <div className="flex items-center justify-center gap-8">
                  <div
                    className="w-16 h-16 rounded-lg"
                    style={{ backgroundColor: selectedTheme.colors.nodeCompleted }}
                  />
                  <div
                    className="h-1 w-24"
                    style={{ backgroundColor: selectedTheme.colors.connectionLine }}
                  />
                  <div
                    className="w-16 h-16 rounded-lg"
                    style={{ backgroundColor: selectedTheme.colors.nodeDefault }}
                  />
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <h3 className="text-sm font-medium mb-3">Color Palette</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <ColorSwatch label="Primary" color={selectedTheme.colors.primary} />
                  <ColorSwatch label="Secondary" color={selectedTheme.colors.secondary} />
                  <ColorSwatch label="Accent" color={selectedTheme.colors.accent} />
                  <ColorSwatch label="Completed" color={selectedTheme.colors.nodeCompleted} />
                  <ColorSwatch label="Connection" color={selectedTheme.colors.connectionLine} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Tema</CardTitle>
              <CardDescription>Konfigurasi tema yang dipilih</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Tema Saat Ini</h3>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{selectedTheme.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedTheme.subject}</div>
                    </div>
                    <div
                      className="w-12 h-12 rounded"
                      style={{ backgroundColor: selectedTheme.colors.primary }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Fitur Tema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm">Gradient Backgrounds</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm">Smooth Animations</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedTheme.particles?.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Particle Effects</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm">Custom Icons</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Animation Classes</h3>
                <div className="p-3 border rounded-lg bg-muted font-mono text-xs space-y-1">
                  <div>Hover: {selectedTheme.animations.nodeHover}</div>
                  <div>Completion: {selectedTheme.animations.completion}</div>
                  <div>Pulse: {selectedTheme.animations.pulse}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </main>
    </SidebarProvider>
  );
}

function ColorSwatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="text-center space-y-2">
      <div
        className="h-16 rounded-lg border-2 border-border"
        style={{ backgroundColor: color }}
      />
      <div className="text-xs space-y-0.5">
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground font-mono">{color}</div>
      </div>
    </div>
  );
}
