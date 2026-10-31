import { Section } from '@ta-x-ui';

import { WalkthroughAchievementItem } from '../WalkthroughAchievementItem';

import type { AsideContentPreviewAchievement } from '../aside-content';

export interface WalkthroughAchievementsSectionProps {
  // In page order
  achievements: AsideContentPreviewAchievement[];
}

// The site's Walkthrough Achievements section
export const WalkthroughAchievementsSection = ({ achievements }: WalkthroughAchievementsSectionProps) => (
  <Section colour="green" class="walkthrough-right" title="Walkthrough Achievements">
    <ul class="il">
      {achievements.map((achievement) => (
        <WalkthroughAchievementItem key={achievement.id} achievement={achievement} />
      ))}
    </ul>
  </Section>
);
