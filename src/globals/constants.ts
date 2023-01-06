const classStylePrefix = 'ta-x';
const jsStylePrefix = 'js-ta-x';
const variableStylePrefix = '--ta-x';
const templatePrefix = 'ta-x-template';

export class Constants {
  static Styles = class {
    static readonly root = 'trueachievement-extras';

    static Components = class {
      static readonly accordion = `${jsStylePrefix}-accordion`;
      static readonly snackbar = `${jsStylePrefix}-snackbar`;
      static readonly showSnackbar = `${classStylePrefix}-snackbar-show`;
    };

    static Animations = class {
      static readonly yShow = `${classStylePrefix}-y-show`;
      static readonly yHide = `${classStylePrefix}-y-hide`;
      static readonly yHideNoTransition = `${this.yHide}-no-transition`;
    };

    static Base = class {
      static readonly hide = `${classStylePrefix}-hide`;
    };

    static SettingsMenu = class {
      static readonly featureJs = `${jsStylePrefix}-settings-menu`;
      static readonly featureStyle = `${classStylePrefix}-settings-menu`;
      static readonly subSetting = `${this.featureStyle}-sub-setting`;
      static readonly wrenchJs = `${this.featureJs}-wrench`;
      static readonly closeJs = `${this.featureJs}-close`;
      static readonly versionLink = `${this.featureJs}-version`;
      static readonly changelogView = `${this.featureJs}-changelog`;
      static readonly settingsView = `${this.featureJs}-settings`;
      static readonly settingsContentShow = `${this.featureStyle}-settings-item-show`;
    };

    static StickyHeader = class {
      static readonly featureJs = `${jsStylePrefix}-sticky-header`;
      static readonly featureStyle = `${classStylePrefix}-sticky-header`;
    };

    static StaffWalkthroughImprovements = class {
      static readonly featureJs = `${jsStylePrefix}-staff-walkthrough-improvements`;
      static readonly featureStyle = `${classStylePrefix}-staff-walkthrough-improvements`;

      static readonly WalkthroughPage = class {
        static readonly featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-walkthrough-page`;
        static readonly featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-walkthrough-page`;
        static readonly containerJs = `${this.featureJs}-container`;
        static readonly containerStyle = `${this.featureStyle}-container`;
        static readonly stickyPageHistoryJs = `${this.featureJs}-sticky-page-history`;
        static readonly stickyPageHistoryStyle = `${this.featureStyle}-sticky-page-history`;
        static readonly moveButtonsToLeftStyle = `${this.featureStyle}-move-buttons-to-left`;
        static readonly walkthroughTeamButtonJs = `${this.featureJs}-walkthrough-team-button`;
      };

      static readonly ManageWalkthroughPage = class {
        static readonly featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`;
        static readonly featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`;
        static readonly containerJs = `${this.featureJs}-container`;
        static readonly containerStyle = `${this.featureStyle}-container`;
        static readonly clickableAchievementsJs = `${this.featureJs}-clickable-achievements`;
      };

      static readonly EditWalkthroughPage = class {
        static readonly featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`;
        static readonly featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`;
        static readonly containerJs = `${this.featureJs}-container`;
        static readonly containerStyle = `${this.featureStyle}-container`;
        static readonly improvedImageSelectorJs = `${this.featureJs}-improved-image-selector`;
        static readonly improvedImageSelectorStyle = `${this.featureStyle}-improved-image-selector`;
        static readonly improvedImageSelectorContainerJs = `${this.improvedImageSelectorJs}-container`;
        static readonly improvedImageSelectorContainerStyle = `${this.improvedImageSelectorStyle}-container`;
        static readonly improvedImageSelectorImageTitleJs = `${this.improvedImageSelectorJs}-image-title`;
        static readonly improvedImageSelectorImageTitleStyle = `${this.improvedImageSelectorStyle}-image-title`;
        static readonly themeToggleJs = `${this.featureJs}-theme-toggle`;
        static readonly themeToggleStyle = `${this.featureStyle}-theme-toggle`;
        static readonly themeToggleDarkStyle = `${this.themeToggleStyle}-dark`;
        static readonly themeToggleLightStyle = `${this.themeToggleStyle}-light`;
      };
    };

    static Variables = class {
      static StickyHeader = class {
        static readonly featureVariableStylePrefix = `${variableStylePrefix}-sticky-header`;
        static readonly height = `${this.featureVariableStylePrefix}-height`;
      };

      static StaffWalkthroughImprovements = class {
        static readonly WalkthroughPage = class {
          static readonly featureVariableStylePrefix = `${variableStylePrefix}-staff-walkthrough-improvements-walkthrough-page`;
          static readonly stickyPageHistoryTop = `${this.featureVariableStylePrefix}-sticky-page-history-top`;
        };
      };
    };
  };

  static Templates = class {
    static StaffWalkthroughImprovements = class {
      static readonly ManageWalkthroughPage = class {
        static readonly featureTemplatePrefix = `${templatePrefix}-manage-walkthrough`;
        static readonly achievementRow = `${this.featureTemplatePrefix}-achievement-row`;
      };
    };
  };
}