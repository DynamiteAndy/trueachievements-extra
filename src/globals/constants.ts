import { getCookie } from '../utilities/document-util';

const classStylePrefix = 'ta-x';
const jsStylePrefix = 'js-ta-x';
const variableStylePrefix = '--ta-x';
const templatePrefix = 'ta-x-template';

export class Constants {
  static readonly gamerId = getCookie('GamerID');

  static Styles = class {
    static readonly root = 'trueachievement-extras';

    static Components = class {
      static readonly accordion = `${jsStylePrefix}-accordion`;
      static readonly askLoader = `${jsStylePrefix}-ask-loader-container`;
      static readonly snackbar = `${jsStylePrefix}-snackbar`;
      static readonly showSnackbar = `${classStylePrefix}-snackbar-show`;

      static AskLoader = class {
        static readonly featureJs = `${jsStylePrefix}-ask-loader`;
        static readonly containerJs = `${this.featureJs}-container`;
        static readonly askJs = `${this.featureJs}-ask`;
        static readonly inputJs = `${this.askJs}-input`;
        static readonly buttonJs = `${this.askJs}-button`;
      };

      static Tab = class {
        static readonly featureStyle = `${classStylePrefix}-tabs`;
        static readonly featureJs = `${jsStylePrefix}-tabs`;
        static readonly tabLinkContainer = `${this.featureJs}-link-container`;
        static readonly tabLink = `${this.featureJs}-link`;
        static readonly tabContent = `${this.featureJs}-content`;
        static readonly tabSelected = `${this.featureStyle}-selected`;
        static readonly tabScroll = `${this.featureStyle}-scroll`;
      };
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
      static readonly documentationLink = `${this.featureJs}-documentation`;
      static readonly changelogView = `${this.featureJs}-changelog`;
      static readonly featureDocumentationView = `${this.featureJs}-feature-documentation`;
      static readonly settingsView = `${this.featureJs}-settings`;
      static readonly settingsContentShow = `${this.featureStyle}-settings-item-show`;
    };

    static Emojis = class {
      static readonly featureJs = `${jsStylePrefix}-emojis`;
      static readonly featureStyle = `${classStylePrefix}-emojis`;
    };

    static StickyHeader = class {
      static readonly featureJs = `${jsStylePrefix}-sticky-header`;
      static readonly featureStyle = `${classStylePrefix}-sticky-header`;
    };

    static NewsImprovements = class {
      static readonly featureJs = `${jsStylePrefix}-news-improvements`;
      static readonly featureStyle = `${classStylePrefix}-news-improvements`;

      static Walkthroughs = class {
        static readonly featureJs = `${jsStylePrefix}-forum-improvements-walkthroughs`;
        static readonly featureStyle = `${classStylePrefix}-forum-improvements-walkthroughs`;
        static readonly showOwnerProgressJs = `${this.featureJs}-show-owner-progress`;
        static readonly showOwnerProgressStyle = `${this.featureStyle}-show-owner-progress`;
        static readonly showOwnerProgressEditorWrapperStyle = `${this.showOwnerProgressStyle}-editor-wrapper`;
        static readonly showOwnerProgressEditorRowStyle = `${this.showOwnerProgressStyle}-editor-row`;
        static readonly showOwnerProgressEditorStyle = `${this.showOwnerProgressStyle}-editor`;
        static readonly askForWalkthroughWalkthroughJs = `${this.showOwnerProgressJs}-ask-for-walkthrough`;
        static readonly saveWalkthroughInputJs = `${this.showOwnerProgressJs}-save-walkthrough-input`;
        static readonly saveWalkthroughButtonJs = `${this.showOwnerProgressJs}-save-walkthrough-button`;
      };
    };

    static GamesImprovements = class {
      static readonly featureJs = `${jsStylePrefix}-games-improvements`;
      static readonly featureStyle = `${classStylePrefix}-games-improvements`;
      static readonly highlightGamesButtonJs = `${this.featureJs}-highlight-games-collection-button`;
    };

    static GamerImprovements = class {
      static readonly featureJs = `${jsStylePrefix}-gamer-improvements`;
      static readonly featureStyle = `${classStylePrefix}-gamer-improvements`;
      static readonly groupByGameButtonJs = `${this.featureJs}-group-by-game-button`;
    };

    static ForumImprovements = class {
      static readonly featureJs = `${jsStylePrefix}-forum-improvements`;
      static readonly featureStyle = `${classStylePrefix}-forum-improvements`;

      static Walkthroughs = class {
        static readonly featureJs = `${jsStylePrefix}-forum-improvements-walkthroughs`;
        static readonly featureStyle = `${classStylePrefix}-forum-improvements-walkthroughs`;
        static readonly showOwnerProgressJs = `${this.featureJs}-show-owner-progress`;
        static readonly showOwnerProgressStyle = `${this.featureStyle}-show-owner-progress`;
        static readonly showOwnerProgressEditorWrapperStyle = `${this.showOwnerProgressStyle}-editor-wrapper`;
        static readonly showOwnerProgressEditorRowStyle = `${this.showOwnerProgressStyle}-editor-row`;
        static readonly showOwnerProgressEditorStyle = `${this.showOwnerProgressStyle}-editor`;
        static readonly askForWalkthroughWalkthroughJs = `${this.showOwnerProgressJs}-ask-for-walkthrough`;
        static readonly saveWalkthroughInputJs = `${this.showOwnerProgressJs}-save-walkthrough-input`;
        static readonly saveWalkthroughButtonJs = `${this.showOwnerProgressJs}-save-walkthrough-button`;
      };
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
        static readonly missingButtonsContainerJs = `${this.featureJs}-missing-buttons-container`;
        static readonly addPageButtonJs = `${this.featureJs}-add-page-button`;
        static readonly previewButtonJs = `${this.featureJs}-preview-button`;
        static readonly viewContentButtonJs = `${this.featureJs}-view-content-button`;
        static readonly readyForReviewButtonJs = `${this.featureJs}-ready-for-review-button`;
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
        static readonly stickyTinymceToolbarJs = `${this.featureJs}-sticky-tinymce-toolbar`;
        static readonly stickyTinymceToolbarStyles = `${this.featureStyle}-sticky-tinymce-toolbar`;
      };

      static readonly WalkthroughPreview = class {
        static readonly featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-walkthrough-preview`;
        static readonly featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-walkthrough-preview`;
        static readonly populateAsideContentJs = `${this.featureJs}-populate-aside-content`;
        static readonly populateAsideContentWalkthroughPagesJs = `${this.populateAsideContentJs}-walkthrough-pages`;
        static readonly populateAsideContentWalkthroughThanksJs = `${this.populateAsideContentJs}-walkthrough-thanks`;
        static readonly populateAsideContentWalkthroughAchievementsJs = `${this.populateAsideContentJs}-walkthrough-achievements`;
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

        static readonly EditWalkthroughPage = class {
          static readonly featureVariableStylePrefix = `${variableStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`;
          static readonly stickyTinymceToolbarWidth = `${this.featureVariableStylePrefix}-sticky-tinymce-toolbar-width`;
          static readonly stickyTinymceToolbarTop = `${this.featureVariableStylePrefix}-sticky-tinymce-toolbar-top`;
          static readonly stickyTinymceToolbarFloatingMenu = `${this.featureVariableStylePrefix}-sticky-tinymce-toolbar-floating-menu`;
        };
      };
    };
  };

  static Templates = class {
    static Components = class {
      static Tab = class {
        static readonly featureTemplatePrefix = `${templatePrefix}-tabs`;
        static readonly tabLink = `${this.featureTemplatePrefix}-link`;
        static readonly tabContent = `${this.featureTemplatePrefix}-content`;
      };
    };

    static StaffWalkthroughImprovements = class {
      static ManageWalkthroughPage = class {
        static readonly featureTemplatePrefix = `${templatePrefix}-manage-walkthrough`;
        static readonly achievementRow = `${this.featureTemplatePrefix}-achievement-row`;
      };
      
      static WalkthroughPreview = class {
        static readonly featureTemplatePrefix = `${templatePrefix}-walkthrough-preview`;
        static readonly walkthroughPagesSummary = `${this.featureTemplatePrefix}-walkthrough-pages-summary`;
        static readonly walkthroughPagesNumbered = `${this.featureTemplatePrefix}-walkthrough-pages-numbered`;
        static readonly walkthroughPagesNumberedSelected = `${this.featureTemplatePrefix}-walkthrough-pages-numbered-selected`;
        static readonly walkthroughAchievements = `${this.featureTemplatePrefix}-walkthrough-achievements`;
      };
    };
  };
}