const classStylePrefix = 'ta-x';
const jsStylePrefix = 'js-ta-x';
const variableStylePrefix = '--ta-x';

export class Constants {
  static Styles = class {
    static readonly root = 'trueachievement-extras';

    static Animations = class {
      static readonly yShow = `${classStylePrefix}-y-show`;
      static readonly yHide = `${classStylePrefix}-y-hide`;
      static readonly yHideNoTransition = `${this.yHide}-no-transition`;
    }

    static Base = class {
      static readonly hide = `${classStylePrefix}-hide`;
    }

    static SettingsMenu = class {
      static readonly featureJs = `${jsStylePrefix}-settings-menu`;
      static readonly featureStyle = `${classStylePrefix}-settings-menu`;
      static readonly subSetting = `${this.featureStyle}-sub-setting`;
      static readonly wrenchJs = `${this.featureJs}-wrench`
      static readonly closeJs = `${this.featureJs}-close`
    }

    static StickyHeader = class {
      static readonly featureJs = `${jsStylePrefix}-sticky-header`;
      static readonly featureStyle = `${classStylePrefix}-sticky-header`;
    }

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
        static readonly editPageLeftJs = `${this.featureJs}-edit-page-left`;
        static readonly editPageLeftStyle = `${this.featureStyle}-edit-page-left`;
        static readonly walkthroughTeamButtonJs = `${this.featureJs}-walkthrough-team-button`
        static readonly walkthroughTeamButtonStyle = `${this.featureStyle}-walkthrough-team-button`
      }

      static readonly ManageWalkthroughPage = class {
        static readonly featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`;
        static readonly featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`;
        static readonly containerJs = `${this.featureJs}-container`;
        static readonly containerStyle = `${this.featureStyle}-container`;
      }
    }

    static Variables = class {
      static StickyHeader = class {
        static readonly featureVariableStylePreix = `${variableStylePrefix}-sticky-header`;
        static readonly height = `${this.featureVariableStylePreix}-height`;
      }

      static StaffWalkthroughImprovements = class {
        static readonly featureVariableStylePreix = `${variableStylePrefix}-staff-walkthrough-improvements`;
  
        static readonly WalkthroughPage = class {
          static readonly featureVariableStylePreix = `${variableStylePrefix}-staff-walkthrough-improvements-walkthrough-page`;
          static readonly stickyPageHistoryTop = `${this.featureVariableStylePreix}-sticky-page-history-top`;
        }
      }
    }
  }
}