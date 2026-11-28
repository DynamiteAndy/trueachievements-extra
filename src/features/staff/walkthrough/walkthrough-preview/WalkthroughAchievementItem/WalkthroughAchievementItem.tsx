import type { AsideContentPreviewAchievement } from '../aside-content';

interface WalkthroughAchievementItemProps {
  achievement: AsideContentPreviewAchievement;
}

// A transparent image, so the icon can be drawn from the achievements page's sprite sheet as its background while the
// site's img.smallicon styles (size, border, float) still apply
const transparentImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const iconSize = 32;

// An item of the site's walkthrough achievements list, linking to the achievement on its page
export const WalkthroughAchievementItem = ({ achievement }: WalkthroughAchievementItemProps) => {
  const { icon } = achievement;

  return (
    <li data-i={achievement.id}>
      <img
        src={icon ? transparentImage : achievement.src}
        alt={achievement.title}
        class="smallicon"
        width={iconSize}
        height={iconSize}
        loading="lazy"
        style={
          icon
            ? {
                backgroundImage: `url("${icon.sprite}")`,
                backgroundSize: `${iconSize}px auto`,
                backgroundPosition: `0 ${-iconSize * icon.index}px`
              }
            : undefined
        }
      />
      <a href={achievement.href ?? undefined}>{achievement.title}</a>
      <p>{achievement.description}</p>
    </li>
  );
};
