import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllThemes, type SkillTreeTheme } from '@/lib/skillTreeThemes';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme?: SkillTreeTheme;
  onSelectTheme: (theme: SkillTreeTheme) => void;
}

export function ThemeSelector({ selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  const themes = getAllThemes();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {themes.map((theme) => {
        const isSelected = selectedTheme?.id === theme.id;
        
        return (
          <Card
            key={theme.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              isSelected ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectTheme(theme)}
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.primary
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{theme.name}</CardTitle>
                {isSelected && (
                  <Check className="w-5 h-5" style={{ color: theme.colors.primary }} />
                )}
              </div>
              <CardDescription>{theme.subject}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Color Palette */}
              <div>
                <div className="text-xs font-medium mb-2">Color Palette</div>
                <div className="flex gap-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: theme.colors.nodeDefault }}
                    title="Node Default"
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: theme.colors.nodeCompleted }}
                    title="Completed"
                  />
                </div>
              </div>

              {/* Preview Icons */}
              <div>
                <div className="text-xs font-medium mb-2">Icons</div>
                <div className="flex gap-3 text-2xl">
                  <span title="Default">{theme.icons.default}</span>
                  <span title="Completed">{theme.icons.completed}</span>
                  <span title="Locked">{theme.icons.locked}</span>
                </div>
              </div>

              {/* Sample Node Preview */}
              <div>
                <div className="text-xs font-medium mb-2">Node Preview</div>
                <div className="flex gap-2">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl border-2"
                    style={{
                      backgroundColor: theme.colors.nodeDefault,
                      borderColor: theme.colors.secondary
                    }}
                  >
                    {theme.icons.default}
                  </div>
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl border-2"
                    style={{
                      backgroundColor: theme.colors.nodeCompleted,
                      borderColor: theme.colors.primary,
                      color: 'white'
                    }}
                  >
                    {theme.icons.completed}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex gap-2 flex-wrap">
                {theme.particles?.enabled && (
                  <Badge variant="outline" style={{ borderColor: theme.colors.primary }}>
                    Particles
                  </Badge>
                )}
                <Badge variant="outline" style={{ borderColor: theme.colors.accent }}>
                  Gradients
                </Badge>
                <Badge variant="outline" style={{ borderColor: theme.colors.secondary }}>
                  Animations
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
