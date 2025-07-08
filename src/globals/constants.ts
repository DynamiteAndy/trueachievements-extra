export class Constants {
  static Styles = class {
    static readonly root = 'trueachievement-extras';

    static Animations = class {
      static readonly yShow = 'ta-x-y-show';
      static readonly yHide = 'ta-x-y-hide';
      static readonly yHideNoTransition = 'ta-x-y-hide-no-transition';
    };

    static Base = class {
      static readonly hide = 'ta-x-hide';
    };

    static SettingsMenu = class {
      static readonly featureJs = 'js-ta-x-settings-menu';
    };

    static StickyHeader = class {
      static readonly featureJs = 'js-ta-x-sticky-header';
      static readonly featureStyle = 'ta-x-sticky-header';
    };

    static Variables = class {
      static StickyHeader = class {
        static readonly featureVariableStylePrefix = '--ta-x-sticky-header';
        static readonly height = '--ta-x-sticky-header-height';
      };

      static StaffWalkthroughImprovements = class {
        static readonly WalkthroughPage = class {
          static readonly featureVariableStylePrefix = '--ta-x-staff-walkthrough-improvements-walkthrough-page';
          static readonly stickyPageHistoryTop = '--ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history-top';
        };

        static readonly EditWalkthroughPage = class {
          static readonly featureVariableStylePrefix = '--ta-x-staff-walkthrough-improvements-edit-walkthrough-page';
          static readonly stickyTinymceToolbarWidth = '--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-width';
          static readonly stickyTinymceToolbarTop = '--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-top';
          static readonly stickyTinymceToolbarFloatingMenu = '--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-floating-menu';
        };
      };
    };
  };

  static Templates = class {
    static Components = class {
      static Tab = class {
        static readonly featureTemplatePrefix = 'ta-x-template-tabs';
        static readonly tabLink = 'ta-x-template-tabs-link';
        static readonly tabContent = 'ta-x-template-tabs-content';
      };
    };

    static GamesImprovements = class {
      static Achievements = class {
        static readonly featureTemplatePrefix = 'ta-x-template-games-improvements-achievements';
        static readonly achievementGuideSolution = 'ta-x-template-games-improvements-achievements-achievement-guide';
      };
    };

    static StaffWalkthroughImprovements = class {
      static ManageWalkthroughPage = class {
        static readonly featureTemplatePrefix = 'ta-x-template-manage-walkthrough';
        static readonly achievementRow = 'ta-x-template-manage-walkthrough-achievement-row';
      };

      static WalkthroughPreview = class {
        static readonly featureTemplatePrefix = 'ta-x-template-walkthrough-preview';
        static readonly walkthroughPagesSummary = 'ta-x-template-walkthrough-preview-walkthrough-pages-summary';
        static readonly walkthroughPagesNumbered = 'ta-x-template-walkthrough-preview-walkthrough-pages-numbered';
        static readonly walkthroughPagesNumberedSelected = 'ta-x-template-walkthrough-preview-walkthrough-pages-numbered-selected';
        static readonly walkthroughAchievements = 'ta-x-template-walkthrough-preview-walkthrough-achievements';
      };
    };
  };
}
