type SvgOptions = {
  svgHTML: string;
  svgClass: string;
};

type GuideOptions = {
  name: string;
  info: string;
  svg: SvgOptions;
};

export type ImportableGuideOptions = {
  extensionEnabled: boolean;
  extensionSelector: string;
  extensionSetting: string;
  importableGuideUrlTest: (str?: string) => boolean;
  guide: GuideOptions;
};
