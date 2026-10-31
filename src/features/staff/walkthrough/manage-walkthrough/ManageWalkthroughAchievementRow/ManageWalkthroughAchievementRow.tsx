interface ManageWalkthroughAchievementRowProps {
  name: string;
  href: string;
}

// A row for an achievement the walkthrough doesn't cover yet, so it has no page (c2)
export const ManageWalkthroughAchievementRow = ({ name, href }: ManageWalkthroughAchievementRowProps) => (
  <tr>
    <td class="point" />
    <td class="c1">
      <a class="title" href={href}>
        {name}
      </a>
    </td>
    <td class="c2" />
    <td class="dlop plain" />
  </tr>
);
