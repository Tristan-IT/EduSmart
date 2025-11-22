/**
 * Achievement System Demo Component
 * 
 * Quick demo showing achievement unlock + sound system in action
 * Add this to any page to test the system
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementUnlock } from "@/components/AchievementUnlock";
import { LevelUpCelebration } from "@/components/LevelUpCelebration";
import soundManager from "@/lib/soundManager";
import { Trophy, Zap, Target, Clock } from "lucide-react";

export function AchievementDemo() {
  const { pendingAchievements, checkAchievements, dismissAchievement } = useAchievements();
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Test achievement triggers
  const triggerFirstQuiz = () => {
    checkAchievements({
      quizCount: 1,
      currentHour: new Date().getHours(),
    });
  };

  const triggerPerfectScore = () => {
    checkAchievements({
      quizCount: 1,
      quizPerfectCount: 1,
    });
  };

  const triggerStreak = () => {
    checkAchievements({
      streak: 7,
    });
  };

  const triggerMastery = () => {
    checkAchievements({
      categoryMastery: {
        algebra: 90,
      },
    });
  };

  const triggerWeeklyXP = () => {
    checkAchievements({
      weeklyXP: 1000,
    });
  };

  const triggerMultiple = () => {
    checkAchievements({
      quizCount: 1,
      quizPerfectCount: 1,
      streak: 3,
      weeklyXP: 1000,
      currentHour: new Date().getHours(),
    });
  };

  const testSounds = () => {
    soundManager.play("achievement");
    setTimeout(() => soundManager.play("level-up"), 500);
    setTimeout(() => soundManager.play("gem-earn"), 1000);
  };

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Achievement System Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Achievement Triggers */}
          <div>
            <h3 className="font-semibold mb-3">Test Achievements:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button onClick={triggerFirstQuiz} variant="outline">
                🎯 First Quiz
              </Button>
              <Button onClick={triggerPerfectScore} variant="outline">
                ⭐ Perfect Score
              </Button>
              <Button onClick={triggerStreak} variant="outline">
                🔥 7-Day Streak
              </Button>
              <Button onClick={triggerMastery} variant="outline">
                🎓 Master Algebra
              </Button>
              <Button onClick={triggerWeeklyXP} variant="outline">
                ⚔️ Weekly Warrior
              </Button>
              <Button onClick={triggerMultiple} variant="default">
                ✨ Multiple!
              </Button>
            </div>
          </div>

          {/* Sound Tests */}
          <div>
            <h3 className="font-semibold mb-3">Test Sounds:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                onClick={() => soundManager.play("achievement")} 
                variant="outline"
                size="sm"
              >
                Achievement
              </Button>
              <Button 
                onClick={() => soundManager.play("level-up")} 
                variant="outline"
                size="sm"
              >
                Level Up
              </Button>
              <Button 
                onClick={() => soundManager.play("gem-earn")} 
                variant="outline"
                size="sm"
              >
                Gem Earn
              </Button>
              <Button 
                onClick={testSounds} 
                variant="outline"
                size="sm"
              >
                All Sounds
              </Button>
            </div>
          </div>

          {/* Level Up Test */}
          <div>
            <h3 className="font-semibold mb-3">Test Celebrations:</h3>
            <Button onClick={() => setShowLevelUp(true)}>
              🎉 Show Level Up
            </Button>
          </div>

          {/* Current Settings */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Current Settings:</h3>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>
                Sound: {soundManager.getSettings().enabled ? "✅ Enabled" : "❌ Disabled"}
              </p>
              <p>
                Volume: {Math.round(soundManager.getSettings().volume * 100)}%
              </p>
              <p>
                Pending Achievements: {pendingAchievements.length}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="pt-4 border-t text-sm space-y-2">
            <p className="font-semibold">📝 Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Click achievement buttons to trigger notifications</li>
              <li>Notifications will slide in from the right</li>
              <li>Multiple achievements will stack</li>
              <li>Auto-dismiss after 5 seconds or click X</li>
              <li>Sound plays when achievements unlock (if enabled)</li>
              <li>Configure sound in Profile → Pengaturan</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Notifications */}
      <AchievementUnlock
        achievements={pendingAchievements}
        onClose={dismissAchievement}
      />

      {/* Level Up Modal */}
      <LevelUpCelebration
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        newLevel={5}
        xpToNextLevel={500}
        currentXPInLevel={120}
      />
    </div>
  );
}

/**
 * USAGE:
 * 
 * Add to any page for testing:
 * 
 * import { AchievementDemo } from "@/components/AchievementDemo";
 * 
 * <AchievementDemo />
 */
