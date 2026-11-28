interface GamertagNationIconProps {
  class?: string;
}

// Gamertag Nation's logo (its green flag and GTN), traced from its icon and set in a circle like the other guide sites'
export const GamertagNationIcon = ({ class: classes }: GamertagNationIconProps) => (
  <svg class={classes} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 225" aria-hidden="true">
    <circle cx="112.5" cy="112.5" r="112.5" fill="#363B40" />
    <g transform="translate(112.5 112.5) scale(0.85) translate(-112.5 -112.5)">
      <line x1="33" y1="61" x2="68" y2="193" stroke="#32C580" stroke-width="15" stroke-linecap="round" />
      <path
        fill="#32C580"
        d="M44 56C46 50 52 46 60 43C68 40 80 38 92 39C102 40 108 44 120 44C134 44 146 43 154 39C163 35 170 30 176 24C175 40 172 60 168 74C166 82 166 86 172 90C180 96 196 103 202 110C198 120 186 128 176 131C160 134 140 132 128 129C116 127 102 128 92 131C82 134 74 139 68 142C65 142 64 139 63 135Z"
      />
      {/* GTN as rounded strokes, like the logo's lettering, so it needs no font */}
      <g fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
        <path d="M108.4 160.5A13 14 0 1 0 114.8 176.4H107" />
        <path d="M127 160H157M142 160V188" />
        <path d="M160 188V160L184 188V160" />
      </g>
    </g>
  </svg>
);
