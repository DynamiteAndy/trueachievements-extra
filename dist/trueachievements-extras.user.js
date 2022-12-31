// ==UserScript==
// @name          TrueAchievements Extra - Development
// @namespace     dynamite-andy
// @version       1.5.1.31122022-203358
// @iconURL       https://github.com/andrewcartwright1/trueachievements-extra/blob/main/src/resources/icons/favicon32x32.ico?raw=true
// @icon64URL     https://github.com/andrewcartwright1/trueachievements-extra/blob/main/src/resources/icons/favicon64x64.ico?raw=true
// @updateURL     https://github.com/andrewcartwright1/trueachievements-extra/raw/main/dist/trueachievements-extras.user.js
// @downloadURL   https://github.com/andrewcartwright1/trueachievements-extra/raw/main/dist/trueachievements-extras.user.js
// @supportURL    https://github.com/andrewcartwright1/trueachievements-extra/issues
// @description   Provides a variety of extras for use on TrueAchievements
// @author        Dynamite Andy - dynamiteandy@gmail.com
// @match         http*://*.trueachievements.com/*
// @run-at        document-start
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_addStyle
// ==/UserScript==

// Last Updated: 31/12/2022, 20:33:58

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var toPropertyKey = require("./toPropertyKey.js");
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./toPropertyKey.js":4}],2:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],3:[function(require,module,exports){
var _typeof = require("./typeof.js")["default"];
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./typeof.js":5}],4:[function(require,module,exports){
var _typeof = require("./typeof.js")["default"];
var toPrimitive = require("./toPrimitive.js");
function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./toPrimitive.js":3,"./typeof.js":5}],5:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],6:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tag = exports.log = exports.LogLevel = exports.Log = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2022 Ray Martone
 * @license MIT
 * @description log adapter that provides level based filtering and tagging
 */
let LogLevel;
exports.LogLevel = LogLevel;
(function (LogLevel) {
  LogLevel["DEBUG"] = "DEBUG";
  LogLevel["TRACE"] = "TRACE";
  LogLevel["INFO"] = "INFO";
  LogLevel["WARN"] = "WARN";
  LogLevel["ERROR"] = "ERROR";
  LogLevel["OFF"] = "OFF";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var Level;
(function (Level) {
  Level[Level["DEBUG"] = 1] = "DEBUG";
  Level[Level["TRACE"] = 2] = "TRACE";
  Level[Level["INFO"] = 3] = "INFO";
  Level[Level["WARN"] = 4] = "WARN";
  Level[Level["ERROR"] = 5] = "ERROR";
  Level[Level["OFF"] = 6] = "OFF";
})(Level || (Level = {}));
const tag = {};
exports.tag = tag;
class Log {
  constructor() {
    (0, _defineProperty2.default)(this, "_tagToLevel", {});
  }
  init(config, callback) {
    for (const k in config) {
      this._tagToLevel[k] = Level[config[k]] || 1;
    }
    if (callback !== undefined) {
      this._callback = callback;
    }
    for (const key in this._tagToLevel) {
      tag[key] = key;
    }
    return this;
  }
  error(tag, message, ...optionalParams) {
    this.log(Level.ERROR, tag, message, optionalParams);
  }
  warn(tag, message, ...optionalParams) {
    this.log(Level.WARN, tag, message, optionalParams);
  }
  info(tag, message, ...optionalParams) {
    this.log(Level.INFO, tag, message, optionalParams);
  }
  trace(tag, message, ...optionalParams) {
    this.log(Level.TRACE, tag, message, optionalParams);
  }
  debug(tag, message, ...optionalParams) {
    this.log(Level.DEBUG, tag, message, optionalParams);
  }
  log(level, tag, message, optionalParams) {
    var _this$_tagToLevel$tag;
    if (this._callback && level >= ((_this$_tagToLevel$tag = this._tagToLevel[tag]) !== null && _this$_tagToLevel$tag !== void 0 ? _this$_tagToLevel$tag : Level.DEBUG)) {
      this._callback(Level[level], tag, message, optionalParams);
    }
  }
}
exports.Log = Log;
const log = new Log();
exports.log = log;
},{"@babel/runtime/helpers/defineProperty":1,"@babel/runtime/helpers/interopRequireDefault":2}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_util_1 = require("./scripts/helpers/date-util");
const cache = {
    get memoize() {
        const value = GM_getValue('trueachievements-extra-memoized', '');
        return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
    },
    set memoize(value) { GM_setValue('trueachievements-extra-memoized', JSON.stringify(Array.from(value.entries()))); },
    forceClear: () => {
        GM_deleteValue('trueachievements-extra-memoized');
    },
    clearExpired: null
};
const clearExpired = () => {
    const updatedCache = Array.from(cache.memoize.entries()).filter(item => (0, date_util_1.isBeforeNow)(item[1].expiryTime));
    cache.memoize = new Map(updatedCache);
};
cache.clearExpired = clearExpired;
exports.default = cache;

},{"./scripts/helpers/date-util":14}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    stickyHeader: {
        get enabled() { return GM_getValue('trueachievements-extra-stickyHeader-enabled', false); },
        set enabled(value) { GM_setValue('trueachievements-extra-stickyHeader-enabled', value); }
    },
    recentWinners: {
        get enabled() { return GM_getValue('trueachievements-extra-recentWinners-enabled', false); },
        set enabled(value) { GM_setValue('trueachievements-extra-recentWinners-enabled', value); },
        get onlineUnlocksOnly() { return this.enabled && GM_getValue('trueachievements-extra-recentWinners-onlineUnlocksOnly', false); },
        set onlineUnlocksOnly(value) { GM_setValue('trueachievements-extra-recentWinners-onlineUnlocksOnly', value); },
        get baseGameOnly() { return this.enabled && GM_getValue('trueachievements-extra-recentWinners-baseGameOnly', false); },
        set baseGameOnly(value) { GM_setValue('trueachievements-extra-recentWinners-baseGameOnly', value); }
    },
    staffWalkthroughImprovements: {
        get enabled() { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-enabled', false); },
        set enabled(value) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-enabled', value); },
        get stickyPageHistory() { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory', false); },
        set stickyPageHistory(value) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory', value); },
        get editPageLeft() { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-editPageLeft', false); },
        set editPageLeft(value) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-editPageLeft', value); },
        get walkthroughTeamButton() { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton', false); },
        set walkthroughTeamButton(value) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton', value); },
        get manageWalkthroughDefaultStatus() { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatus', false); },
        set manageWalkthroughDefaultStatus(value) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatus', value); },
        get improvedImageSelector() { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-improvedImageSelector', false); },
        set improvedImageSelector(value) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-improvedImageSelector', value); },
        get clickableTableLinks() { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-clickableTableLinks', false); },
        set clickableTableLinks(value) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-clickableTableLinks', value); },
        get manageWalkthroughDefaultStatusValue() { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatusValue', '-1'); },
        set manageWalkthroughDefaultStatusValue(value) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatusValue', value); },
        get tinymceTheme() { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-tinymceTheme', null); },
        set tinymceTheme(value) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-tinymceTheme', value); }
    }
};

},{}],9:[function(require,module,exports){
"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
const classStylePrefix = 'ta-x';
const jsStylePrefix = 'js-ta-x';
const variableStylePrefix = '--ta-x';
const templatePrefix = 'ta-x-template';
class Constants {
}
exports.Constants = Constants;
Constants.Styles = (_a = class {
    },
    _a.root = 'trueachievement-extras',
    _a.Animations = (_b = class {
        },
        _b.yShow = `${classStylePrefix}-y-show`,
        _b.yHide = `${classStylePrefix}-y-hide`,
        _b.yHideNoTransition = `${_b.yHide}-no-transition`,
        _b),
    _a.Base = (_c = class {
        },
        _c.hide = `${classStylePrefix}-hide`,
        _c),
    _a.SettingsMenu = (_d = class {
        },
        _d.featureJs = `${jsStylePrefix}-settings-menu`,
        _d.featureStyle = `${classStylePrefix}-settings-menu`,
        _d.subSetting = `${_d.featureStyle}-sub-setting`,
        _d.wrenchJs = `${_d.featureJs}-wrench`,
        _d.closeJs = `${_d.featureJs}-close`,
        _d),
    _a.StickyHeader = (_e = class {
        },
        _e.featureJs = `${jsStylePrefix}-sticky-header`,
        _e.featureStyle = `${classStylePrefix}-sticky-header`,
        _e),
    _a.StaffWalkthroughImprovements = (_f = class {
        },
        _f.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements`,
        _f.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements`,
        _f.WalkthroughPage = (_g = class {
            },
            _g.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-walkthrough-page`,
            _g.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-walkthrough-page`,
            _g.containerJs = `${_g.featureJs}-container`,
            _g.containerStyle = `${_g.featureStyle}-container`,
            _g.stickyPageHistoryJs = `${_g.featureJs}-sticky-page-history`,
            _g.stickyPageHistoryStyle = `${_g.featureStyle}-sticky-page-history`,
            _g.editPageLeftJs = `${_g.featureJs}-edit-page-left`,
            _g.editPageLeftStyle = `${_g.featureStyle}-edit-page-left`,
            _g.walkthroughTeamButtonJs = `${_g.featureJs}-walkthrough-team-button`,
            _g.walkthroughTeamButtonStyle = `${_g.featureStyle}-walkthrough-team-button`,
            _g),
        _f.ManageWalkthroughPage = (_h = class {
            },
            _h.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`,
            _h.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`,
            _h.containerJs = `${_h.featureJs}-container`,
            _h.containerStyle = `${_h.featureStyle}-container`,
            _h.clickableAchievementsJs = `${_h.featureJs}-clickable-achievements`,
            _h),
        _f.EditWalkthroughPage = (_j = class {
            },
            _j.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`,
            _j.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`,
            _j.containerJs = `${_j.featureJs}-container`,
            _j.containerStyle = `${_j.featureStyle}-container`,
            _j.improvedImageSelectorJs = `${_j.featureJs}-improved-image-selector`,
            _j.improvedImageSelectorStyle = `${_j.featureStyle}-improved-image-selector`,
            _j.improvedImageSelectorContainerJs = `${_j.improvedImageSelectorJs}-container`,
            _j.improvedImageSelectorContainerStyle = `${_j.improvedImageSelectorStyle}-container`,
            _j.improvedImageSelectorImageTitleJs = `${_j.improvedImageSelectorJs}-image-title`,
            _j.improvedImageSelectorImageTitleStyle = `${_j.improvedImageSelectorStyle}-image-title`,
            _j.themeToggleJs = `${_j.featureJs}-theme-toggle`,
            _j.themeToggleStyle = `${_j.featureStyle}-theme-toggle`,
            _j.themeToggleDarkStyle = `${_j.themeToggleStyle}-dark`,
            _j.themeToggleLightStyle = `${_j.themeToggleStyle}-light`,
            _j),
        _f),
    _a.Variables = (_k = class {
        },
        _k.StickyHeader = (_l = class {
            },
            _l.featureVariableStylePrefix = `${variableStylePrefix}-sticky-header`,
            _l.height = `${_l.featureVariableStylePrefix}-height`,
            _l),
        _k.StaffWalkthroughImprovements = (_m = class {
            },
            _m.WalkthroughPage = (_o = class {
                },
                _o.featureVariableStylePrefix = `${variableStylePrefix}-staff-walkthrough-improvements-walkthrough-page`,
                _o.stickyPageHistoryTop = `${_o.featureVariableStylePrefix}-sticky-page-history-top`,
                _o),
            _m),
        _k),
    _a);
Constants.Templates = (_p = class {
    },
    _p.StaffWalkthroughImprovements = (_q = class {
        },
        _q.ManageWalkthroughPage = (_r = class {
            },
            _r.featureTemplatePrefix = `${templatePrefix}-manage-walkthrough`,
            _r.achievementRow = `${_r.featureTemplatePrefix}-achievement-row`,
            _r),
        _q),
    _p);

},{}],10:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const missionlog_1 = require("missionlog");
const promise_1 = require("./scripts/components/promise");
const index_1 = require("./styles/index");
const settings_menu_1 = require("./scripts/settings-menu");
const sticky_header_1 = require("./scripts/sticky-header");
const index_2 = require("./scripts/staff-walkthrough-improvements/index");
const cache_1 = require("./cache");
const logger = {
    [missionlog_1.LogLevel.ERROR]: (tag, msg, params) => console.error(`TA-X [${tag}]`, msg, ...params),
    [missionlog_1.LogLevel.WARN]: (tag, msg, params) => console.warn(`TA-X [${tag}]`, msg, ...params),
    [missionlog_1.LogLevel.INFO]: (tag, msg, params) => console.log(`TA-X [${tag}]`, msg, ...params),
    [missionlog_1.LogLevel.TRACE]: (tag, msg, params) => console.log(`TA-X [${tag}]`, msg, ...params),
    [missionlog_1.LogLevel.DEBUG]: (tag, msg, params) => console.log(`TA-X [${tag}]`, msg, ...params),
};
missionlog_1.log.init({}, (level, tag, msg, params) => {
    logger[level](tag, msg, params);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    cache_1.default.clearExpired();
    yield (0, promise_1.allConcurrently)(4, [
        index_1.default,
        settings_menu_1.default,
        sticky_header_1.default,
        index_2.default
    ]);
}))();

},{"./cache":7,"./scripts/components/promise":12,"./scripts/settings-menu":23,"./scripts/staff-walkthrough-improvements/index":25,"./scripts/sticky-header":29,"./styles/index":30,"missionlog":6}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAllBetween = exports.extractBetween = void 0;
const getUrlProperties = (str, props = []) => {
    props = Array.isArray(props) ? props : [props];
    try {
        const url = new URL(str);
        let constructedString = '';
        for (let i = 0; i < props.length; i++) {
            if (!url[props[i]])
                continue;
            constructedString += url[props[i]];
        }
        return constructedString;
    }
    catch (ex) {
        throw `${str} is not a valid url`;
    }
};
// Achievements
const achievementUrl = new RegExp('^/a[0-9]*/.*', 'i');
const achievementUrlWithGamerId = new RegExp('^/a[0-9]*/.*', 'i');
// Games
const achievementsUrl = new RegExp('^/game/.*/achievements$', 'i');
// dlcAchievementsPage: (str: string) => new RegExp('^\/game\/.*\/dlc\/{1}.*', 'i').test(getUrlProperties(str, 'pathname'));
// allDlcAchievementsPage: (str: string) => new RegExp('^\/game\/.*\/dlc$', 'i').test(getUrlProperties(str, 'pathname'));
// // Gamer Specific
// gamerPage: (str: string) => new RegExp('^\/gamer\/*', 'i').test(getUrlProperties(str, 'pathname')),
// gamerComparisonPage: (str: string) => new RegExp('^\/comparison.aspx\\?gameid=[0-9]*', 'i').test(getUrlProperties(str, [ 'pathname', 'search' ]));
// gamerAchievementsPage: (str: string) => new RegExp('^\/game\/.*\/achievements\\?gamerid=[0-9]*', 'i').test(getUrlProperties(str, [ 'pathname', 'search' ]));
// gamerDlcAchievementsPage: (str: string) => new RegExp('^\/game\/.*\/dlc\/{1}.*\\?gamerid=[0-9]*', 'i').test(getUrlProperties(str, 'pathname'));
// gamerAllDlcAchievementsPage: (str: string) => new RegExp('^\/game\/.*\/dlc\\?gamerid=[0-9]*', 'i').test(getUrlProperties(str, 'pathname'));
// forumThreadPage: (str: string) => new RegExp('^\/forum/viewthread.aspx', 'i').test(getUrlProperties(str, 'pathname')),
// newsArticlePage: (str: string) => new RegExp('^\/n[0-9]*\/', 'i').test(getUrlProperties(str, 'pathname')),
// achievementCommentPage: (str: string) => new RegExp('^\/viewcomment.aspx', 'i').test(getUrlProperties(str, 'pathname')),
// // Ajax Functions
// forumMessageThread: (str: string) => new RegExp('^\/ajaxfunctions.aspx\/Forum_MessageThread', 'i').test(getUrlProperties(str, 'pathname')),
// Staff
// -- Walkthrough
const editWalkthroughUrl = new RegExp('^/staff/walkthrough/editwalkthroughpage.aspx', 'i');
const manageWalkthroughUrl = new RegExp('^/staff/walkthrough/managewalkthrough.aspx', 'i');
const manageWalkthroughUrlWithWalkthroughId = new RegExp('^/staff/walkthrough/managewalkthrough.aspx\\?walkthroughid=[0-9]*', 'i');
const walkthroughPageUrl = new RegExp('^/staff/walkthrough/walkthroughpage.aspx', 'i');
const walkthroughPreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpreview.aspx', 'i');
const walkthroughPagePreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx', 'i');
// // Random Strings
// summaryAvailable: (str: string) => new RegExp('Summary available for .* at ', 'i').test(str),
// hasStartedBroadcasting: (str: string) => new RegExp(' has started broadcasting .* on their twitch channel ', 'i').test(str),
// statusChange: (str: string) => new RegExp('Status change by .* at', 'i').test(str),
const today = new RegExp('Today', 'i');
const yesterday = new RegExp('Yesterday', 'i');
const extractBetween = (between, str) => {
    const regex = new RegExp(`${between}(.*?)${between}`);
    const matches = str.match(regex);
    return matches
        ? matches[1]
        : str;
};
exports.extractBetween = extractBetween;
const extractAllBetween = (between, str) => {
    const regex = new RegExp(`${between}(.*?)${between}`, 'g');
    const matches = str.match(regex);
    return matches
        ? matches.map(str => str.replace(between, ''))
        : [str];
};
exports.extractAllBetween = extractAllBetween;
exports.default = {
    achievements: {
        achievementUrl,
        achievementUrlWithGamerId
    },
    game: {
        achievementsUrl
    },
    staff: {
        walkthrough: {
            editWalkthroughUrl,
            manageWalkthroughUrl,
            manageWalkthroughUrlWithWalkthroughId,
            walkthroughPageUrl,
            walkthroughPreviewUrl,
            walkthroughPagePreviewUrl
        }
    },
    words: {
        today,
        yesterday,
    },
    test: {
        achievements: {
            achievementUrl: (str) => achievementUrl.test(getUrlProperties(str, 'pathname')),
            achievementUrlWithGamerId: (str) => achievementUrlWithGamerId.test(getUrlProperties(str, ['pathname', 'search']))
        },
        game: {
            achievementsUrl: (str) => achievementsUrl.test(getUrlProperties(str, 'pathname'))
        },
        staff: {
            walkthrough: {
                all: (str) => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')) ||
                    manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')) || manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname', 'search'])) ||
                    walkthroughPageUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) ||
                    walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
                preview: (str) => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
                editWalkthroughUrl: (str) => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
                manageWalkthroughUrl: (str) => manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
                manageWalkthroughUrlWithWalkthroughId: (str) => manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname', 'search'])),
                walkthroughPageUrl: (str) => walkthroughPageUrl.test(getUrlProperties(str, 'pathname')),
                walkthroughPreviewUrl: (str) => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')),
                walkthroughPagePreviewUrl: (str) => walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname'))
            }
        }
    },
    extractBetween: exports.extractBetween
};

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allConcurrently = exports.allSequentially = void 0;
const allSequentially = (arr) => {
    let result = Promise.resolve();
    return Promise.all(arr.reduce((promise, task) => {
        result = result.then(() => (typeof task === 'function' ? task() : task));
        promise.push(result);
        return promise;
    }, []));
};
exports.allSequentially = allSequentially;
const allConcurrently = (max, arr) => {
    if (arr.length === 0)
        return Promise.resolve([]);
    const tail = arr.splice(max);
    const head = arr;
    const resolved = [];
    let processed = 0;
    return new Promise(resolve => {
        head.forEach(task => {
            const res = (typeof task === 'function' ? task() : task);
            resolved.push(res);
            res.then(y => {
                runNext();
                return y;
            });
        });
        const runNext = () => {
            if (processed === tail.length) {
                resolve(Promise.all(resolved));
            }
            else {
                resolved.push(tail[processed]().then(x => {
                    runNext();
                    return x;
                }));
                processed++;
            }
        };
    });
};
exports.allConcurrently = allConcurrently;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDuplicates = void 0;
const getDuplicates = (arr, unique = false) => unique
    ? [...new Set(arr.filter((e, i, a) => a.indexOf(e) !== i))]
    : arr.filter((e, i, a) => a.indexOf(e) !== i);
exports.getDuplicates = getDuplicates;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBeforeNow = exports.isValid = void 0;
const getDate = (date) => typeof (date) === 'string' ? new Date(date) : date;
const isValid = (date) => new Date(getDate(date)).toString().toLowerCase() !== 'invalid date';
exports.isValid = isValid;
const isBeforeNow = (date) => new Date() < getDate(date);
exports.isBeforeNow = isBeforeNow;

},{}],15:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLFetch = exports.JSONFetch = exports.fetchHelper = void 0;
const parseJSON = (response) => response.json().catch(() => response);
const parseHTML = (response) => {
    response.text().then((body) => {
        const parser = new DOMParser();
        return parser.parseFromString(body, 'text/html');
    }).catch(() => response);
};
const fetchHelper = (url, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    options.headers = options.headers || new Headers();
    options.method = (options.method) ? options.method.toUpperCase() : 'GET';
    const response = yield fetch(url, options);
    return response;
});
exports.fetchHelper = fetchHelper;
const JSONFetch = (url, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, exports.fetchHelper)(url, options);
    return parseJSON(response);
});
exports.JSONFetch = JSONFetch;
const HTMLFetch = (url, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, exports.fetchHelper)(url, options);
    return parseHTML(response);
});
exports.HTMLFetch = HTMLFetch;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classListContains = void 0;
const classListContains = (element, classes) => {
    const classArray = Array.isArray(classes) ? classes : [classes];
    for (let i = 0; i < classArray.length; i++) {
        if (element.classList.contains(classArray[i])) {
            return true;
        }
    }
    return false;
};
exports.classListContains = classListContains;

},{}],17:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const memoized_fetch_1 = require("../models/memoized-fetch");
const cache_1 = require("../../cache");
const fetch_1 = require("./fetch");
const date_util_1 = require("./date-util");
const cachedCalls = cache_1.default.memoize;
exports.default = (url, fetchOpts = {}, memoizeOpts = { deleteAfter: { value: 7, period: 'days' } }) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedRequest = cachedCalls.get(url);
    if (cachedRequest && (0, date_util_1.isBeforeNow)(new Date(cachedRequest.expiryTime))) {
        return cachedRequest.response;
    }
    const response = yield (0, fetch_1.fetchHelper)(url, fetchOpts);
    const body = yield response.text();
    cachedCalls.set(url, new memoized_fetch_1.MemoizedFetch(memoizeOpts).setResponse(body));
    cache_1.default.memoize = cachedCalls;
    return body;
});

},{"../../cache":7,"../models/memoized-fetch":22,"./date-util":14,"./fetch":15}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBool = exports.toDate = exports.toInt = void 0;
const regex_1 = require("../../regex");
const date_util_1 = require("./date-util");
const today = new Date(new Date().setHours(0, 0, 0, 0));
const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));
const toInt = (value) => {
    if (typeof (value) === 'string') {
        const parsedValue = parseInt(value.replace(/,/g, ''), 10);
        return !isNaN(parsedValue) ? parsedValue : null;
    }
    if (typeof (value) === 'boolean') {
        return value ? 1 : 0;
    }
    return typeof (value) === 'number'
        ? value
        : null;
};
exports.toInt = toInt;
const toDate = (value) => {
    if (regex_1.default.words.today.test(value)) {
        return today;
    }
    if (regex_1.default.words.yesterday.test(value)) {
        return yesterday;
    }
    return (0, date_util_1.isValid)(value) ? new Date(value) : null;
};
exports.toDate = toDate;
const toBool = (str) => {
    if (typeof (str) === 'string') {
        return str.toLowerCase() === 'true'
            ? true
            : str.toLowerCase() === 'false'
                ? false
                : null;
    }
    if (typeof (str) === 'number') {
        return str === 1
            ? true
            : str === 0
                ? false
                : null;
    }
    return typeof (str) === 'boolean'
        ? str
        : null;
};
exports.toBool = toBool;
exports.default = {
    toInt: exports.toInt,
    toDate: exports.toDate,
    toBool: exports.toBool
};

},{"../../regex":11,"./date-util":14}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = void 0;
const wrapper = document.createElement('template');
const template = (el, opts = {}) => {
    const { image, element } = opts;
    wrapper.appendChild(el);
    wrapper.innerHTML = el.outerHTML
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/{GM_info.script.version}/g, GM_info.script.version || '')
        .replace(/{image.title}/g, (image === null || image === void 0 ? void 0 : image.title) || '')
        .replace(/{element.outerHTML}/g, (element === null || element === void 0 ? void 0 : element.outerHTML) || '');
    // .replace(/{link}/g, obj.link || '')
    // .replace(/{name}/g, obj.name || '')
    // .replace(/{gamer.name}/g, obj.gamer ? obj.gamer.name : '' || '')
    // .replace(/{name\|\|gamer.name}/g, obj.name || (obj.gamer ? obj.gamer.name : '') || '')
    // .replace(/{achievement.name}/g, (obj.achievement ? obj.achievement.name : '') || '')
    // .replace(/{compareLink}/g, obj.compareLink || '')
    // .replace(/{achievementLink}/g, obj.achievementLink || '')
    // .replace(/{score}/g, obj.score || '')
    // .replace(/{unlockDate}/g, obj.unlockDate ? new Date(obj.unlockDate).toLocaleDateString('en-GB', {
    //   day: 'numeric',
    //   month: 'long',
    //   year: 'numeric'
    // }) : '' || '');
    const newElement = wrapper.content.firstChild;
    wrapper.innerHTML = '';
    return newElement;
};
exports.template = template;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.until = exports.waitForElement = void 0;
const waitForElement = (selector, element = document.documentElement, timeoutMS = 10000) => new Promise(resolve => {
    if (element.querySelector(selector)) {
        return resolve(element.querySelector(selector));
    }
    /* eslint-disable prefer-const */
    let observer;
    /* eslint-enable prefer-const */
    const timeout = setTimeout(() => {
        observer.disconnect();
        resolve(null);
    }, timeoutMS);
    observer = new MutationObserver(() => {
        if (element.querySelector(selector)) {
            observer.disconnect();
            clearTimeout(timeout);
            resolve(element.querySelector(selector));
        }
    });
    observer.observe(element || document.documentElement, {
        childList: true,
        subtree: true
    });
});
exports.waitForElement = waitForElement;
const until = (predFn) => {
    const poll = (done) => (predFn() ? done() : setTimeout(() => poll(done), 250));
    return new Promise(poll);
};
exports.until = until;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("../helpers/parse");
class ConditionalRender {
    constructor(...params) {
        if (params.length === 1) {
            this.fromString(params[0]);
            return;
        }
    }
    fromString(json) {
        try {
            const parsedObj = JSON.parse(json);
            this.selector = parsedObj.selector;
            this.value = (0, parse_1.toBool)(parsedObj.value);
        }
        catch (e) {
            // Do nothing
        }
    }
    isValid() {
        return this.selector != null && this.value != null;
    }
    toString() {
        return JSON.stringify(this);
    }
}
exports.default = ConditionalRender;

},{"../helpers/parse":18}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoizedFetch = exports.MemoizedFetchOpts = void 0;
class MemoizedFetchOpts {
    constructor(deleteAfter) {
        this.deleteAfter = deleteAfter;
    }
}
exports.MemoizedFetchOpts = MemoizedFetchOpts;
class MemoizedFetch {
    constructor(opts) {
        const now = new Date();
        switch (opts.deleteAfter.period) {
            case 'seconds':
                this.expiryTime = new Date(now.setSeconds(now.getSeconds() + opts.deleteAfter.value));
                break;
            case 'minutes':
                this.expiryTime = new Date(now.setMinutes(now.getMinutes() + opts.deleteAfter.value));
                break;
            case 'hours':
                this.expiryTime = new Date(now.setHours(now.getHours() + opts.deleteAfter.value));
                break;
            case 'days':
                this.expiryTime = new Date(now.setDate(now.getDate() + opts.deleteAfter.value));
                break;
        }
    }
    setResponse(response) {
        this.response = response;
        return this;
    }
    fromString(json) {
        try {
            const parsedObj = JSON.parse(json);
            this.expiryTime = parsedObj.expiryTime;
            this.response = parsedObj.response;
        }
        catch (e) {
            // Do nothing
        }
    }
    toString() {
        return JSON.stringify(this);
    }
}
exports.MemoizedFetch = MemoizedFetch;

},{}],23:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

const missionlog_1 = require("missionlog");
const config_1 = require("../config");
const constants_1 = require("../constants");
const template_1 = require("./helpers/template");
const wait_1 = require("./helpers/wait");
const conditional_render_1 = require("./models/conditional-render");
// Elements -------
let extensionBody;
let extensionTrigger;
const isSelectElement = (el) => el.nodeName === 'SELECT';
const isCheckboxElement = (el) => el.nodeName === 'INPUT' && el.type === 'checkbox';
const applyBody = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Settings-Menu', 'Starting - applyBody');
    const html = "<div class=\"js-ta-x-settings-menu-wrench gamer-page\" aria-haspopup=\"true\">\r\n    <i class=\"fa fa-wrench\"></i>\r\n</div>\r\n\r\n<div class=\"js-ta-x-settings-menu ta-x-settings-menu ta-x-hide\">\r\n    <div class=\"middle\">\r\n        <div class=\"wrap\">\r\n            <div class=\"labels\">\r\n                <label class=\"js-ta-x-settings-menu-close close\">\r\n                    <i class=\"fa fa-close\"></i>\r\n                </label>\r\n            </div>\r\n            <div class=\"contents\">\r\n                <div class=\"t-settings optionpanel t-5 open\" >\r\n                    <div>\r\n                        <label>Sticky Header</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStickyHeader\" name=\"chkStickyHeader\" data-config-area=\"stickyHeader\"\r\n                                data-config-setting=\"enabled\" checked=\"\">\r\n                            <label for=\"chkStickyHeader\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div>\r\n                        <label>Staff Walkthrough Improvements</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovements\" name=\"chkStaffWalkthroughImprovements\" data-config-area=\"staffWalkthroughImprovements\"\r\n                                data-config-setting=\"enabled\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovements\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Stick Page History To Left</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsStickyPageHistory\" name=\"chkStaffWalkthroughImprovementsStickyPageHistory\"\r\n                                data-config-area=\"staffWalkthroughImprovements\" data-config-setting=\"stickyPageHistory\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovementsStickyPageHistory\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Move Edit Page Button To The Left</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsEditPageLeft\" name=\"chkStaffWalkthroughImprovementsEditPageLeft\"\r\n                                data-config-area=\"staffWalkthroughImprovements\" data-config-setting=\"editPageLeft\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovementsEditPageLeft\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Add Walkthrough Team Button</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\" name=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\"\r\n                                data-config-area=\"staffWalkthroughImprovements\" data-config-setting=\"walkthroughTeamButton\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Improved Image Selector</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsImproveImageSelector\" name=\"chkStaffWalkthroughImprovementsImproveImageSelector\"\r\n                                data-config-area=\"staffWalkthroughImprovements\" data-config-setting=\"improvedImageSelector\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovementsImproveImageSelector\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Clickable Table Links</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsClickableTableLinks\" name=\"chkStaffWalkthroughImprovementsClickableTableLinks\"\r\n                                data-config-area=\"staffWalkthroughImprovements\" data-config-setting=\"clickableTableLinks\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovementsClickableTableLinks\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"value\": \"true\" }' class=\"ta-x-hide ta-x-settings-menu-sub-setting-wrapable\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Default Status for Manage Walkthrough</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\" name=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\"\r\n                                data-config-area=\"staffWalkthroughImprovements\" data-config-setting=\"manageWalkthroughDefaultStatus\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\"> </label>\r\n                        </div>\r\n                        <div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\", \"value\": \"true\" }' class=\"frm-grp frm-sel ta-x-hide\">\r\n                            <select id=\"selStaffWalkthroughImprovementsManageWalkthroughDefaultStatusValue\" name=\"selStaffWalkthroughImprovementsManageWalkthroughDefaultStatusValue\"  data-config-area=\"staffWalkthroughImprovements\" data-config-setting=\"manageWalkthroughDefaultStatusValue\" class=\"dropdown\">\r\n                                <option value=\"-1\" selected=\"\">(All)</option>\r\n                                <option value=\"New\">New</option>\r\n                                <option value=\"In progress\">In progress</option>\r\n                                <option value=\"Ready for review\">Ready for review</option>\r\n                                <option value=\"Ready for publish\">Ready for publish</option>\r\n                                <option value=\"Published\">Published</option>\r\n                                <option value=\"New owner required\">New owner required</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- <div>\r\n                        <label>Show recent winners</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkRecentWinners\" name=\"chkRecentWinners\"\r\n                                data-config-area=\"recentWinners\" data-config-setting=\"enabled\" checked=\"\">\r\n                            <label for=\"chkRecentWinners\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkRecentWinners\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Online unlocks only</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkRecentWinnersOnlineUnlocksOnly\" name=\"chkRecentWinnersOnlineUnlocksOnly\"\r\n                                data-config-area=\"recentWinners\" data-config-setting=\"onlineUnlocksOnly\" checked=\"\">\r\n                            <label for=\"chkRecentWinnersOnlineUnlocksOnly\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkRecentWinners\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Base game only</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkRecentWinnersBaseGameOnly\" name=\"chkRecentWinnersBaseGameOnly\"\r\n                                data-config-area=\"recentWinners\" data-config-setting=\"baseGameOnly\" checked=\"\">\r\n                            <label for=\"chkRecentWinnersBaseGameOnly\"> </label>\r\n                        </div>\r\n                    </div> -->\r\n\r\n                    <ul class=\"list-links buttons\">\r\n                        <li><a href=\"https://github.com/andrewcartwright1/trueachievements-extra/issues/new\">Raise a Bug</a></li>\r\n                        <li><a href=\"https://github.com/andrewcartwright1/trueachievements-extra/issues/new\">Request a Feature</a></li>\r\n                    </ul>\r\n                    <div class=\"title\">\r\n                        <span>TrueAchievements Extra</span>\r\n                        </br>\r\n                        <span>Version {GM_info.script.version}</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"js-ta-x-settings-menu-close close\"></div>\r\n</div>";
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    const navigationBar = yield (0, wait_1.waitForElement)('header nav');
    const navGamerToggle = yield (0, wait_1.waitForElement)('[data-tgl="nav-gamer"]', navigationBar);
    navigationBar.insertBefore(parsedDocument.querySelector(`.${constants_1.Constants.Styles.SettingsMenu.wrenchJs}`), navGamerToggle.nextSibling);
    extensionTrigger = document.querySelector(`.${constants_1.Constants.Styles.SettingsMenu.wrenchJs}`);
    const navGamer = yield (0, wait_1.waitForElement)('.nav-gamer');
    const templatedFeature = (0, template_1.template)(parsedDocument.querySelector(`.${constants_1.Constants.Styles.SettingsMenu.featureJs}`));
    navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);
    extensionBody = document.querySelector(`.${constants_1.Constants.Styles.SettingsMenu.featureJs}`);
    [...extensionBody.querySelectorAll('input, select')].forEach(setting => {
        const configObject = setting.dataset.configArea;
        const configSettings = setting.dataset.configSetting;
        if (!configObject || !configSettings)
            return;
        if (isCheckboxElement(setting))
            setting.checked = config_1.default[configObject][configSettings];
        else if (isSelectElement(setting))
            setting.value = config_1.default[configObject][configSettings];
    });
    [...extensionBody.querySelectorAll('[data-render-condition]')].forEach(hiddenSetting => {
        const condition = new conditional_render_1.default(hiddenSetting.dataset.renderCondition);
        if (!condition.isValid())
            return;
        const settingInput = document.querySelector(condition.selector);
        if (settingInput.type === 'checkbox') {
            hiddenSetting.classList[(settingInput.checked === condition.value)
                ? 'remove'
                : 'add'](constants_1.Constants.Styles.Base.hide);
        }
    });
    missionlog_1.log.debug('Settings-Menu', 'Finished - applyBody');
});
const listen = () => {
    missionlog_1.log.debug('Settings-Menu', 'Starting - listen');
    extensionTrigger.addEventListener('click', () => {
        extensionTrigger.classList.add('active');
        extensionBody.classList.add('nav-gamer');
        extensionBody.classList.remove(constants_1.Constants.Styles.Base.hide);
        extensionBody.classList.add('open');
    });
    extensionBody.addEventListener('click', ({ target }) => {
        if (!(target === null || target === void 0 ? void 0 : target.classList.contains(constants_1.Constants.Styles.SettingsMenu.closeJs)))
            return;
        extensionBody.classList.remove('open');
        extensionBody.classList.add(constants_1.Constants.Styles.Base.hide);
        extensionBody.classList.remove('nav-gamer');
        extensionTrigger.classList.remove('active');
    });
    extensionBody.addEventListener('change', ({ target }) => {
        const htmlTarget = target;
        const inputTarget = target;
        const configObject = htmlTarget === null || htmlTarget === void 0 ? void 0 : htmlTarget.dataset.configArea;
        const configSettings = htmlTarget === null || htmlTarget === void 0 ? void 0 : htmlTarget.dataset.configSetting;
        if (isSelectElement(htmlTarget))
            config_1.default[configObject][configSettings] = htmlTarget.value;
        else if (isCheckboxElement(htmlTarget))
            config_1.default[configObject][configSettings] = inputTarget === null || inputTarget === void 0 ? void 0 : inputTarget.checked;
        [...extensionBody.querySelectorAll(`[data-render-condition*="#${htmlTarget.id}"]`)].forEach(hiddenSetting => {
            const condition = new conditional_render_1.default(hiddenSetting.dataset.renderCondition);
            if (!condition.isValid())
                return;
            if (inputTarget.type === 'checkbox') {
                hiddenSetting.classList[(inputTarget.checked === condition.value)
                    ? 'remove'
                    : 'add'](constants_1.Constants.Styles.Base.hide);
            }
        });
    });
    missionlog_1.log.debug('Settings-Menu', 'Finished - listen');
};
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Settings-Menu', 'Starting');
    yield applyBody();
    listen();
    missionlog_1.log.debug('Settings-Menu', 'Finished');
});

},{"../config":8,"../constants":9,"./helpers/template":19,"./helpers/wait":20,"./models/conditional-render":21,"missionlog":6}],24:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

const missionlog_1 = require("missionlog");
const config_1 = require("../../config");
const constants_1 = require("../../constants");
const regex_1 = require("../../regex");
const wait_1 = require("../helpers/wait");
const staff_walkthrough_improvements_1 = require("../../styles/staff-walkthrough-improvements");
const template_1 = require("../helpers/template");
const promise_1 = require("../components/promise");
const applyBody = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Edit-Walkthrough', 'Starting - applyBody');
    yield (0, promise_1.allConcurrently)(2, [staff_walkthrough_improvements_1.default, applyImprovedImageSelector, applyTinymceThemeToggle]);
    missionlog_1.log.debug('Edit-Walkthrough', 'Finished - applyBody');
});
const applyImprovedImageSelector = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.staffWalkthroughImprovements.improvedImageSelector)
        return;
    missionlog_1.log.debug('Edit-Walkthrough', 'Starting - applyImprovedImageSelector');
    const html = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-sticky-header\">\r\n\r\n</div>\r\n\r\n<a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" href=\"/staff/walkthrough/managewalkthrough.aspx\">Walkthrough Team</a>\r\n\r\n<p class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title\">{image.title}</p>\r\n\r\n<div class=\"mce-container mce-last mce-flow-layout-item mce-btn-group js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle\" role=\"group\" data-ta-x-tinymce-theme>\r\n    <div>\r\n        <div class=\"mce-widget mce-btn mce-first mce-last\" tabindex=\"-1\" role=\"button\" aria-label=\"Switch theme\">\r\n            <button role=\"presentation\" type=\"button\" tabindex=\"-1\">\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z\"></path>\r\n                </svg>\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M505.2 324.8l-47.73-68.78l47.75-68.81c7.359-10.62 8.797-24.12 3.844-36.06c-4.969-11.94-15.52-20.44-28.22-22.72l-82.39-14.88l-14.89-82.41c-2.281-12.72-10.76-23.25-22.69-28.22c-11.97-4.936-25.42-3.498-36.12 3.844L256 54.49L187.2 6.709C176.5-.6016 163.1-2.039 151.1 2.896c-11.92 4.971-20.4 15.5-22.7 28.19l-14.89 82.44L31.15 128.4C18.42 130.7 7.854 139.2 2.9 151.2C-2.051 163.1-.5996 176.6 6.775 187.2l47.73 68.78l-47.75 68.81c-7.359 10.62-8.795 24.12-3.844 36.06c4.969 11.94 15.52 20.44 28.22 22.72l82.39 14.88l14.89 82.41c2.297 12.72 10.78 23.25 22.7 28.22c11.95 4.906 25.44 3.531 36.09-3.844L256 457.5l68.83 47.78C331.3 509.7 338.8 512 346.3 512c4.906 0 9.859-.9687 14.56-2.906c11.92-4.969 20.4-15.5 22.7-28.19l14.89-82.44l82.37-14.88c12.73-2.281 23.3-10.78 28.25-22.75C514.1 348.9 512.6 335.4 505.2 324.8zM456.8 339.2l-99.61 18l-18 99.63L256 399.1L172.8 456.8l-18-99.63l-99.61-18L112.9 255.1L55.23 172.8l99.61-18l18-99.63L256 112.9l83.15-57.75l18.02 99.66l99.61 18L399.1 255.1L456.8 339.2zM256 143.1c-61.85 0-111.1 50.14-111.1 111.1c0 61.85 50.15 111.1 111.1 111.1s111.1-50.14 111.1-111.1C367.1 194.1 317.8 143.1 256 143.1zM256 319.1c-35.28 0-63.99-28.71-63.99-63.99S220.7 192 256 192s63.99 28.71 63.99 63.1S291.3 319.1 256 319.1z\"/>\r\n                </svg>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</div>";
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    const stickyImageHeader = parsedDocument.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorContainerJs}`);
    const imageContainer = yield (0, wait_1.waitForElement)('#oWalkthroughImageViewer');
    imageContainer.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorStyle, constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs);
    const imageViewer = imageContainer.querySelector('.imageviewer');
    imageContainer.insertBefore(stickyImageHeader, imageViewer);
    stickyImageHeader.appendChild(imageViewer.querySelector('.itemname, .noimages'));
    stickyImageHeader.appendChild(imageViewer.querySelector('.addimages a'));
    [...imageViewer.querySelectorAll('.ivimage a')].forEach(imageAnchor => {
        const clonedImageTitle = parsedDocument.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorImageTitleJs}`).cloneNode(true);
        const imageTitle = (0, template_1.template)(clonedImageTitle, { image: imageAnchor.querySelector('img') });
        imageTitle.innerText = (0, regex_1.extractBetween)("'", imageTitle.innerText);
        imageAnchor.appendChild(imageTitle);
    });
    missionlog_1.log.debug('Edit-Walkthrough', 'Finished - applyImprovedImageSelector');
});
const applyTinymceThemeToggle = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Edit-Walkthrough', 'Starting - applyTinymceThemeToggle');
    const html = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-sticky-header\">\r\n\r\n</div>\r\n\r\n<a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" href=\"/staff/walkthrough/managewalkthrough.aspx\">Walkthrough Team</a>\r\n\r\n<p class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title\">{image.title}</p>\r\n\r\n<div class=\"mce-container mce-last mce-flow-layout-item mce-btn-group js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle\" role=\"group\" data-ta-x-tinymce-theme>\r\n    <div>\r\n        <div class=\"mce-widget mce-btn mce-first mce-last\" tabindex=\"-1\" role=\"button\" aria-label=\"Switch theme\">\r\n            <button role=\"presentation\" type=\"button\" tabindex=\"-1\">\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z\"></path>\r\n                </svg>\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M505.2 324.8l-47.73-68.78l47.75-68.81c7.359-10.62 8.797-24.12 3.844-36.06c-4.969-11.94-15.52-20.44-28.22-22.72l-82.39-14.88l-14.89-82.41c-2.281-12.72-10.76-23.25-22.69-28.22c-11.97-4.936-25.42-3.498-36.12 3.844L256 54.49L187.2 6.709C176.5-.6016 163.1-2.039 151.1 2.896c-11.92 4.971-20.4 15.5-22.7 28.19l-14.89 82.44L31.15 128.4C18.42 130.7 7.854 139.2 2.9 151.2C-2.051 163.1-.5996 176.6 6.775 187.2l47.73 68.78l-47.75 68.81c-7.359 10.62-8.795 24.12-3.844 36.06c4.969 11.94 15.52 20.44 28.22 22.72l82.39 14.88l14.89 82.41c2.297 12.72 10.78 23.25 22.7 28.22c11.95 4.906 25.44 3.531 36.09-3.844L256 457.5l68.83 47.78C331.3 509.7 338.8 512 346.3 512c4.906 0 9.859-.9687 14.56-2.906c11.92-4.969 20.4-15.5 22.7-28.19l14.89-82.44l82.37-14.88c12.73-2.281 23.3-10.78 28.25-22.75C514.1 348.9 512.6 335.4 505.2 324.8zM456.8 339.2l-99.61 18l-18 99.63L256 399.1L172.8 456.8l-18-99.63l-99.61-18L112.9 255.1L55.23 172.8l99.61-18l18-99.63L256 112.9l83.15-57.75l18.02 99.66l99.61 18L399.1 255.1L456.8 339.2zM256 143.1c-61.85 0-111.1 50.14-111.1 111.1c0 61.85 50.15 111.1 111.1 111.1s111.1-50.14 111.1-111.1C367.1 194.1 317.8 143.1 256 143.1zM256 319.1c-35.28 0-63.99-28.71-63.99-63.99S220.7 192 256 192s63.99 28.71 63.99 63.1S291.3 319.1 256 319.1z\"/>\r\n                </svg>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</div>";
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    const themeToggle = parsedDocument.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`);
    const toolbar = yield (0, wait_1.waitForElement)('.mce-tinymce .mce-toolbar.mce-last .mce-container-body');
    if (!toolbar) {
        missionlog_1.log.error('Edit-Walkthrough', 'Failed to find tinymce toolbar');
        return;
    }
    if (config_1.default.staffWalkthroughImprovements.tinymceTheme !== null) {
        themeToggle.setAttribute('data-ta-x-tinymce-theme', config_1.default.staffWalkthroughImprovements.tinymceTheme);
    }
    toolbar.appendChild(themeToggle);
    missionlog_1.log.debug('Edit-Walkthrough', 'Finished - applyTinymceThemeToggle');
});
const listen = () => {
    missionlog_1.log.debug('Edit-Walkthrough', 'Starting - listen');
    document.addEventListener('click', ({ target }) => {
        var _a;
        if (config_1.default.staffWalkthroughImprovements.improvedImageSelector) {
            if ((target === null || target === void 0 ? void 0 : target.closest('[aria-label="Add Image"]')) === null &&
                (target === null || target === void 0 ? void 0 : target.closest(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`)) === null) {
                const imageSelector = document.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`);
                if (imageSelector.style.display === 'block') {
                    imageSelector.style.display = 'none';
                }
            }
        }
        if (((_a = target === null || target === void 0 ? void 0 : target.classList) === null || _a === void 0 ? void 0 : _a.contains(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`)) ||
            (target === null || target === void 0 ? void 0 : target.closest(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`)) !== null) {
            const button = target.classList.contains(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`)
                ? target
                : target.closest(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`);
            const currentTheme = button.getAttribute('data-ta-x-tinymce-theme');
            let newTheme;
            if (currentTheme === 'dark') {
                newTheme = '';
            }
            else {
                newTheme = 'dark';
            }
            config_1.default.staffWalkthroughImprovements.tinymceTheme = newTheme;
            button.setAttribute('data-ta-x-tinymce-theme', newTheme);
        }
    });
    if (config_1.default.staffWalkthroughImprovements.improvedImageSelector) {
        missionlog_1.log.debug('Edit-Walkthrough', 'Starting improvedImageSelector - listen');
        window.addEventListener('blur', () => {
            if (document.activeElement === document.querySelector('#txtWalkthrough_ifr')) {
                const imageSelector = document.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`);
                if (imageSelector.style.display !== 'block')
                    return;
                imageSelector.style.display = 'none';
            }
        });
        missionlog_1.log.debug('Edit-Walkthrough', 'Finished improvedImageSelector - listen');
    }
    missionlog_1.log.debug('Edit-Walkthrough', 'Finished - listen');
};
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!regex_1.default.test.staff.walkthrough.editWalkthroughUrl(window.location.href))
        return;
    missionlog_1.log.debug('Edit-Walkthrough', 'Starting');
    yield applyBody();
    listen();
    missionlog_1.log.debug('Edit-Walkthrough', 'Finished');
});

},{"../../config":8,"../../constants":9,"../../regex":11,"../../styles/staff-walkthrough-improvements":31,"../components/promise":12,"../helpers/template":19,"../helpers/wait":20,"missionlog":6}],25:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const missionlog_1 = require("missionlog");
const promise_1 = require("../components/promise");
const constants_1 = require("../../constants");
const wait_1 = require("../helpers/wait");
const config_1 = require("../../config");
const regex_1 = require("../../regex");
const manage_walkthrough_1 = require("./manage-walkthrough");
const walkthrough_page_1 = require("./walkthrough-page");
const edit_walkthrough_1 = require("./edit-walkthrough");
const walkthrough_preview_1 = require("./walkthrough-preview");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.staffWalkthroughImprovements.enabled)
        return;
    if (!regex_1.default.test.staff.walkthrough.all(window.location.href))
        return;
    missionlog_1.log.debug('Staff-Walkthrough-Improvements', 'Starting');
    if (yield (0, wait_1.waitForElement)('body')) {
        document.body.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.featureJs, constants_1.Constants.Styles.StaffWalkthroughImprovements.featureStyle);
        yield (0, promise_1.allConcurrently)(4, [manage_walkthrough_1.default, walkthrough_page_1.default, edit_walkthrough_1.default, walkthrough_preview_1.default]);
        missionlog_1.log.debug('Staff-Walkthrough-Improvements', 'Finished');
    }
    else {
        missionlog_1.log.error('Staff-Walkthrough-Improvements', 'Failed to add, The body element was not found.');
    }
});

},{"../../config":8,"../../constants":9,"../../regex":11,"../components/promise":12,"../helpers/wait":20,"./edit-walkthrough":24,"./manage-walkthrough":26,"./walkthrough-page":27,"./walkthrough-preview":28,"missionlog":6}],26:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

const missionlog_1 = require("missionlog");
const config_1 = require("../../config");
const constants_1 = require("../../constants");
const regex_1 = require("../../regex");
const wait_1 = require("../helpers/wait");
const memoize_fetch_1 = require("../helpers/memoize-fetch");
const parse_1 = require("../helpers/parse");
const promise_1 = require("../components/promise");
const template_1 = require("../helpers/template");
const array_util_1 = require("../helpers/array-util");
// Elements -------
let walkthroughContainer;
const applyBody = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Manage-Walkthrough', 'Started - applyBody');
    const html = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-sticky-header\">\r\n\r\n</div>\r\n\r\n<a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" href=\"/staff/walkthrough/managewalkthrough.aspx\">Walkthrough Team</a>\r\n\r\n<p class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title\">{image.title}</p>\r\n\r\n<div class=\"mce-container mce-last mce-flow-layout-item mce-btn-group js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle\" role=\"group\" data-ta-x-tinymce-theme>\r\n    <div>\r\n        <div class=\"mce-widget mce-btn mce-first mce-last\" tabindex=\"-1\" role=\"button\" aria-label=\"Switch theme\">\r\n            <button role=\"presentation\" type=\"button\" tabindex=\"-1\">\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z\"></path>\r\n                </svg>\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M505.2 324.8l-47.73-68.78l47.75-68.81c7.359-10.62 8.797-24.12 3.844-36.06c-4.969-11.94-15.52-20.44-28.22-22.72l-82.39-14.88l-14.89-82.41c-2.281-12.72-10.76-23.25-22.69-28.22c-11.97-4.936-25.42-3.498-36.12 3.844L256 54.49L187.2 6.709C176.5-.6016 163.1-2.039 151.1 2.896c-11.92 4.971-20.4 15.5-22.7 28.19l-14.89 82.44L31.15 128.4C18.42 130.7 7.854 139.2 2.9 151.2C-2.051 163.1-.5996 176.6 6.775 187.2l47.73 68.78l-47.75 68.81c-7.359 10.62-8.795 24.12-3.844 36.06c4.969 11.94 15.52 20.44 28.22 22.72l82.39 14.88l14.89 82.41c2.297 12.72 10.78 23.25 22.7 28.22c11.95 4.906 25.44 3.531 36.09-3.844L256 457.5l68.83 47.78C331.3 509.7 338.8 512 346.3 512c4.906 0 9.859-.9687 14.56-2.906c11.92-4.969 20.4-15.5 22.7-28.19l14.89-82.44l82.37-14.88c12.73-2.281 23.3-10.78 28.25-22.75C514.1 348.9 512.6 335.4 505.2 324.8zM456.8 339.2l-99.61 18l-18 99.63L256 399.1L172.8 456.8l-18-99.63l-99.61-18L112.9 255.1L55.23 172.8l99.61-18l18-99.63L256 112.9l83.15-57.75l18.02 99.66l99.61 18L399.1 255.1L456.8 339.2zM256 143.1c-61.85 0-111.1 50.14-111.1 111.1c0 61.85 50.15 111.1 111.1 111.1s111.1-50.14 111.1-111.1C367.1 194.1 317.8 143.1 256 143.1zM256 319.1c-35.28 0-63.99-28.71-63.99-63.99S220.7 192 256 192s63.99 28.71 63.99 63.1S291.3 319.1 256 319.1z\"/>\r\n                </svg>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</div>";
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    walkthroughContainer = yield (0, wait_1.waitForElement)('#divWalkthroughHolder');
    yield applyDefaultStatus();
    const editWalkthrough = yield (0, wait_1.waitForElement)('#chEditWalkthrough', walkthroughContainer);
    if (editWalkthrough) {
        editWalkthrough.after(parsedDocument.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`));
        yield (0, promise_1.allConcurrently)(2, [adjustRightSidebar, adjustButtons, applyClickableTableLinks]);
    }
    else {
        missionlog_1.log.warn('Manage-Walkthrough', 'Did not find edit walkthrough container');
    }
    missionlog_1.log.debug('Manage-Walkthrough', 'Finished - applyBody');
});
const applyDefaultStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.staffWalkthroughImprovements.manageWalkthroughDefaultStatus)
        return;
    if (regex_1.default.test.staff.walkthrough.manageWalkthroughUrlWithWalkthroughId(window.location.href))
        return;
    missionlog_1.log.debug('Manage-Walkthrough', 'Started - applyDefaultStatus');
    const status = yield (0, wait_1.waitForElement)('#ddlStatusFilter');
    if (status.querySelector('[selected]') === null &&
        status.value !== config_1.default.staffWalkthroughImprovements.manageWalkthroughDefaultStatusValue) {
        status.value = config_1.default.staffWalkthroughImprovements.manageWalkthroughDefaultStatusValue;
        status.onchange(null);
    }
    else {
        missionlog_1.log.info('Manage-Walkthrough', 'A status has already been selected');
    }
    missionlog_1.log.debug('Manage-Walkthrough', 'Started - applyDefaultStatus');
});
const adjustButtons = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Manage-Walkthrough', 'Started - adjustButtons');
    const buttonContainer = yield (0, wait_1.waitForElement)('#btnWalkthrough_Options', walkthroughContainer);
    let buttonsContainer = null;
    [...buttonContainer.querySelectorAll('li a')].forEach(button => {
        button.classList.add('button');
        if (buttonsContainer === null) {
            buttonsContainer = button.closest('.buttons');
        }
        if (buttonsContainer) {
            buttonsContainer.appendChild(button);
        }
    });
    if (buttonsContainer) {
        buttonsContainer.parentNode.insertBefore(buttonsContainer, buttonsContainer.previousElementSibling);
    }
    else {
        missionlog_1.log.warn('Manage-Walkthrough', 'Did not find walkthrough options button container');
    }
    missionlog_1.log.debug('Manage-Walkthrough', 'Finished - adjustButtons');
});
const adjustRightSidebar = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Manage-Walkthrough', 'Started - adjustButtons');
    const sideBarContainer = yield (0, wait_1.waitForElement)(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`, walkthroughContainer);
    if (sideBarContainer) {
        sideBarContainer.appendChild(yield (0, wait_1.waitForElement)('#chWalkthroughGames', walkthroughContainer));
        const walkthroughAchievementsContainer = yield (0, wait_1.waitForElement)('#chWalkthroughAchievements', walkthroughContainer);
        if (walkthroughAchievementsContainer) {
            deDupeAchievements(walkthroughAchievementsContainer);
            sideBarContainer.appendChild(walkthroughAchievementsContainer);
        }
        sideBarContainer.appendChild(yield (0, wait_1.waitForElement)('#chWalkthroughGamers', walkthroughContainer));
        sideBarContainer.appendChild(yield (0, wait_1.waitForElement)('#chWalkthroughOtherSiteLink', walkthroughContainer));
    }
    else {
        missionlog_1.log.warn('Manage-Walkthrough', 'Did not find walkthrough sidebar container');
    }
    missionlog_1.log.debug('Manage-Walkthrough', 'Finished - adjustButtons');
});
const applyClickableTableLinks = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.staffWalkthroughImprovements.clickableTableLinks)
        return;
    missionlog_1.log.debug('Manage-Walkthrough', 'Started - applyClickableTableLinks');
    const html = "<template id=\"ta-x-template-manage-walkthrough-achievement-row\">\r\n    <tr>\r\n        <td class=\"point\"></td>\r\n        <td class=\"c1\">{element.outerHTML}</td>\r\n        <td class=\"c2\"></td>\r\n        <td class=\"dlop plain\"></td>\r\n    </tr>\r\n</template>";
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    const container = document.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`);
    const selectedWalkthrough = yield (0, wait_1.waitForElement)('#lstWalkthroughIDselectedrow a');
    if (!selectedWalkthrough) {
        missionlog_1.log.error('Manage-Walkthrough', 'no walkthrough is currently selected');
        return;
    }
    const walkthroughId = (0, parse_1.toInt)((0, regex_1.extractAllBetween)("'", selectedWalkthrough.href)[1]);
    const walthroughPreviewResponse = yield (0, memoize_fetch_1.default)(`https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`);
    const walthroughPreviewDocument = new DOMParser().parseFromString(walthroughPreviewResponse, 'text/html');
    const clickableGames = () => __awaiter(void 0, void 0, void 0, function* () {
        if (yield (0, wait_1.waitForElement)('#chWalkthroughGamers', walkthroughContainer)) {
            const games = [...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .games a.gamelink')];
            [...container.querySelectorAll('#scrolllstWalkthroughGames .c1')].forEach(el => {
                const gameName = el.innerText.trim();
                const walkthroughPreviewGame = games.find(game => game.innerText.toLowerCase() === gameName.toLowerCase());
                if (walkthroughPreviewGame) {
                    el.innerText = '';
                    el.innerHTML = walkthroughPreviewGame.outerHTML;
                }
            });
        }
        else {
            missionlog_1.log.warn('Manage-Walkthrough', 'Did not find walkthrough games container');
        }
    });
    const clickableGamers = () => __awaiter(void 0, void 0, void 0, function* () {
        if (yield (0, wait_1.waitForElement)('#chWalkthroughGamers', walkthroughContainer)) {
            const editors = [...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .editors dd a')];
            [...container.querySelectorAll('#scrolllstWalkthroughGamers .c1')].forEach(el => {
                const gamerName = el.innerText.trim();
                const walkthroughPreviewGamer = editors.find(editor => editor.innerText.toLowerCase() === gamerName.toLowerCase());
                if (walkthroughPreviewGamer) {
                    el.innerText = '';
                    el.innerHTML = walkthroughPreviewGamer.outerHTML;
                }
            });
        }
        else {
            missionlog_1.log.warn('Manage-Walkthrough', 'Did not find walkthrough gamers container');
        }
    });
    const clickableAndMissedAchievements = () => __awaiter(void 0, void 0, void 0, function* () {
        if ((yield (0, wait_1.waitForElement)('#chWalkthroughGamers', walkthroughContainer)) &&
            (yield (0, wait_1.waitForElement)('#chWalkthroughAchievements', walkthroughContainer))) {
            const walkthroughAchievements = [...container.querySelectorAll('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1')];
            const walkthroughAchievementContainer = container.querySelector('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID tbody');
            if (!walkthroughAchievementContainer) {
                missionlog_1.log.warn('Manage-Walkthrough', 'Did not find walkthrough achievement container');
                return;
            }
            yield (0, promise_1.allConcurrently)(3, [...container.querySelectorAll('#scrolllstWalkthroughGames .c1 a')].map((game) => __awaiter(void 0, void 0, void 0, function* () {
                const gameResponse = yield (0, memoize_fetch_1.default)(game.href);
                const gameDocument = new DOMParser().parseFromString(gameResponse, 'text/html');
                [...gameDocument.querySelectorAll('main ul.ach-panels li a.title')].forEach((gameAchievement) => {
                    const achievementName = gameAchievement.innerText.trim();
                    const walkthroughAchievement = walkthroughAchievements.find(walkthroughAchievement => walkthroughAchievement.innerText.toLowerCase() === achievementName.toLowerCase());
                    if (walkthroughAchievement) {
                        walkthroughAchievement.innerText = '';
                        walkthroughAchievement.innerHTML = gameAchievement.outerHTML;
                        const link = walkthroughAchievement.querySelector('a');
                        link.href = regex_1.default.test.achievements.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;
                    }
                    else {
                        const clonedAchievementRow = parsedDocument.querySelector(`#${constants_1.Constants.Templates.StaffWalkthroughImprovements.ManageWalkthroughPage.achievementRow}`).content.firstElementChild.cloneNode(true);
                        const achievementRow = (0, template_1.template)(clonedAchievementRow, { element: gameAchievement });
                        const link = achievementRow.querySelector('a');
                        achievementRow.querySelector('a').href = regex_1.default.test.achievements.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;
                        walkthroughAchievementContainer.appendChild(achievementRow);
                    }
                });
            })));
            const achievementsTotal = walkthroughContainer.querySelector('#chWalkthroughAchievements #lstWalkthroughAchievementID .total');
            achievementsTotal.innerText = `${achievementsTotal.innerText}/${[...container.querySelectorAll('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1')].length}`;
        }
        else {
            missionlog_1.log.warn('Manage-Walkthrough', 'Did not find walkthrough games container');
        }
    });
    yield (0, promise_1.allConcurrently)(2, [clickableGames, clickableGamers]);
    yield (0, promise_1.allConcurrently)(2, [clickableAndMissedAchievements]);
    missionlog_1.log.debug('Manage-Walkthrough', 'Finished - applyClickableTableLinks');
});
const deDupeAchievements = (walkthroughAchievementsContainer) => {
    const walkthroughAchievements = [...walkthroughAchievementsContainer.querySelectorAll('#scrolllstWalkthroughAchievementID .c1')];
    const duplicateAchievements = (0, array_util_1.getDuplicates)(walkthroughAchievements.map(el => el.innerText), true);
    if (duplicateAchievements.length > 0) {
        const currentCount = walkthroughAchievements.length;
        let removedRows = 0;
        for (let i = 0; i < duplicateAchievements.length; i++) {
            const dupeAchievementRows = walkthroughAchievements.filter(walkthroughAchievement => walkthroughAchievement.innerText.toLowerCase() === duplicateAchievements[i].toLowerCase());
            const firstInstancePageColumn = dupeAchievementRows[0].nextElementSibling;
            for (let j = 1; j < dupeAchievementRows.length; j++) {
                const pageNumber = dupeAchievementRows[j].nextElementSibling.innerText.trim();
                firstInstancePageColumn.innerText += `, ${pageNumber}`;
                dupeAchievementRows[j].closest('tr').remove();
                removedRows++;
            }
        }
        const achievementsTotal = walkthroughAchievementsContainer.querySelector('#lstWalkthroughAchievementID .total');
        achievementsTotal.innerText = achievementsTotal.innerText.replace(currentCount.toString(), (currentCount - removedRows).toString());
    }
};
const listen = () => {
    // Nothing to listen to yet!
};
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!regex_1.default.test.staff.walkthrough.manageWalkthroughUrl(window.location.href))
        return;
    missionlog_1.log.debug('Manage-Walkthrough', 'Started');
    yield applyBody();
    listen();
    missionlog_1.log.debug('Manage-Walkthrough', 'Finished');
});

},{"../../config":8,"../../constants":9,"../../regex":11,"../components/promise":12,"../helpers/array-util":13,"../helpers/memoize-fetch":17,"../helpers/parse":18,"../helpers/template":19,"../helpers/wait":20,"missionlog":6}],27:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

const missionlog_1 = require("missionlog");
const config_1 = require("../../config");
const constants_1 = require("../../constants");
const regex_1 = require("../../regex");
const html_element_util_1 = require("../helpers/html-element-util");
const wait_1 = require("../helpers/wait");
const promise_1 = require("../components/promise");
// Elements -------
let walkthroughContainer;
let walkthoughPageVersions;
let stickyNavBarEnabled;
let stickyNavBarElement;
const applyBody = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Walkthrough-Page', 'Started - applyBody');
    const html = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-sticky-header\">\r\n\r\n</div>\r\n\r\n<a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" href=\"/staff/walkthrough/managewalkthrough.aspx\">Walkthrough Team</a>\r\n\r\n<p class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title\">{image.title}</p>\r\n\r\n<div class=\"mce-container mce-last mce-flow-layout-item mce-btn-group js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle\" role=\"group\" data-ta-x-tinymce-theme>\r\n    <div>\r\n        <div class=\"mce-widget mce-btn mce-first mce-last\" tabindex=\"-1\" role=\"button\" aria-label=\"Switch theme\">\r\n            <button role=\"presentation\" type=\"button\" tabindex=\"-1\">\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z\"></path>\r\n                </svg>\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M505.2 324.8l-47.73-68.78l47.75-68.81c7.359-10.62 8.797-24.12 3.844-36.06c-4.969-11.94-15.52-20.44-28.22-22.72l-82.39-14.88l-14.89-82.41c-2.281-12.72-10.76-23.25-22.69-28.22c-11.97-4.936-25.42-3.498-36.12 3.844L256 54.49L187.2 6.709C176.5-.6016 163.1-2.039 151.1 2.896c-11.92 4.971-20.4 15.5-22.7 28.19l-14.89 82.44L31.15 128.4C18.42 130.7 7.854 139.2 2.9 151.2C-2.051 163.1-.5996 176.6 6.775 187.2l47.73 68.78l-47.75 68.81c-7.359 10.62-8.795 24.12-3.844 36.06c4.969 11.94 15.52 20.44 28.22 22.72l82.39 14.88l14.89 82.41c2.297 12.72 10.78 23.25 22.7 28.22c11.95 4.906 25.44 3.531 36.09-3.844L256 457.5l68.83 47.78C331.3 509.7 338.8 512 346.3 512c4.906 0 9.859-.9687 14.56-2.906c11.92-4.969 20.4-15.5 22.7-28.19l14.89-82.44l82.37-14.88c12.73-2.281 23.3-10.78 28.25-22.75C514.1 348.9 512.6 335.4 505.2 324.8zM456.8 339.2l-99.61 18l-18 99.63L256 399.1L172.8 456.8l-18-99.63l-99.61-18L112.9 255.1L55.23 172.8l99.61-18l18-99.63L256 112.9l83.15-57.75l18.02 99.66l99.61 18L399.1 255.1L456.8 339.2zM256 143.1c-61.85 0-111.1 50.14-111.1 111.1c0 61.85 50.15 111.1 111.1 111.1s111.1-50.14 111.1-111.1C367.1 194.1 317.8 143.1 256 143.1zM256 319.1c-35.28 0-63.99-28.71-63.99-63.99S220.7 192 256 192s63.99 28.71 63.99 63.1S291.3 319.1 256 319.1z\"/>\r\n                </svg>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</div>";
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    walkthoughPageVersions = yield (0, wait_1.waitForElement)('#chWalkthroughPageVersions');
    walkthoughPageVersions.parentElement.insertBefore(parsedDocument.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`), walkthoughPageVersions);
    walkthroughContainer = document.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`);
    walkthroughContainer.appendChild(walkthoughPageVersions);
    (0, promise_1.allConcurrently)(3, [moveWalkthroughPagePreview, applyStickyNavBar, applyEditPageLeft, applyWalkthroughTeamButton]);
    missionlog_1.log.debug('Walkthrough-Page', 'Finished - applyBody');
});
const moveWalkthroughPagePreview = () => __awaiter(void 0, void 0, void 0, function* () {
    const walkthoughPagePreview = yield (0, wait_1.waitForElement)('#chWalkthroughPagePreview');
    if (walkthoughPagePreview) {
        walkthroughContainer.appendChild(walkthoughPagePreview);
    }
    else {
        missionlog_1.log.warn('Walkthrough-Page', 'moveWalkthroughPagePreview - did not find walkthrough preview');
    }
});
const applyStickyNavBar = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.staffWalkthroughImprovements.stickyPageHistory)
        return;
    missionlog_1.log.debug('Walkthrough-Page', 'Started - applyStickyNavBar');
    stickyNavBarEnabled = config_1.default.stickyHeader.enabled;
    stickyNavBarElement = stickyNavBarEnabled
        ? yield (0, wait_1.waitForElement)(`.${constants_1.Constants.Styles.StickyHeader.featureJs}`)
        : yield (0, wait_1.waitForElement)('.header');
    walkthoughPageVersions.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs, constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle);
    setTopStyle(true);
    missionlog_1.log.debug('Walkthrough-Page', 'Finished - applyStickyNavBar');
});
const applyEditPageLeft = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.staffWalkthroughImprovements.editPageLeft)
        return;
    missionlog_1.log.debug('Walkthrough-Page', 'Started - applyEditPageLeft');
    walkthroughContainer.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.editPageLeftStyle);
    const editButton = yield (0, wait_1.waitForElement)('[id="btnEditPage"], [id="btnEditPage2"]', walkthroughContainer);
    if (editButton) {
        editButton.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.editPageLeftJs);
        const walkthroughPageButtons = yield (0, wait_1.waitForElement)('.content .buttons', walkthoughPageVersions);
        if (walkthroughPageButtons) {
            walkthroughPageButtons.insertBefore(editButton, walkthroughPageButtons.firstElementChild);
        }
        else {
            missionlog_1.log.warn('Walkthrough-Page', 'applyEditPageLeft - did not find walkthrough buttons on page versions element');
        }
    }
    else {
        missionlog_1.log.warn('Walkthrough-Page', 'applyEditPageLeft - did not find walkthrough edit page buttons on walkthrough preview');
    }
    missionlog_1.log.debug('Walkthrough-Page', 'Finished - applyEditPageLeft');
});
const applyWalkthroughTeamButton = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.staffWalkthroughImprovements.walkthroughTeamButton)
        return;
    missionlog_1.log.debug('Walkthrough-Page', 'Started - applyWalkthroughTeamButton');
    walkthroughContainer.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonStyle);
    const html = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-sticky-header\">\r\n\r\n</div>\r\n\r\n<a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" href=\"/staff/walkthrough/managewalkthrough.aspx\">Walkthrough Team</a>\r\n\r\n<p class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title\">{image.title}</p>\r\n\r\n<div class=\"mce-container mce-last mce-flow-layout-item mce-btn-group js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle\" role=\"group\" data-ta-x-tinymce-theme>\r\n    <div>\r\n        <div class=\"mce-widget mce-btn mce-first mce-last\" tabindex=\"-1\" role=\"button\" aria-label=\"Switch theme\">\r\n            <button role=\"presentation\" type=\"button\" tabindex=\"-1\">\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z\"></path>\r\n                </svg>\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M505.2 324.8l-47.73-68.78l47.75-68.81c7.359-10.62 8.797-24.12 3.844-36.06c-4.969-11.94-15.52-20.44-28.22-22.72l-82.39-14.88l-14.89-82.41c-2.281-12.72-10.76-23.25-22.69-28.22c-11.97-4.936-25.42-3.498-36.12 3.844L256 54.49L187.2 6.709C176.5-.6016 163.1-2.039 151.1 2.896c-11.92 4.971-20.4 15.5-22.7 28.19l-14.89 82.44L31.15 128.4C18.42 130.7 7.854 139.2 2.9 151.2C-2.051 163.1-.5996 176.6 6.775 187.2l47.73 68.78l-47.75 68.81c-7.359 10.62-8.795 24.12-3.844 36.06c4.969 11.94 15.52 20.44 28.22 22.72l82.39 14.88l14.89 82.41c2.297 12.72 10.78 23.25 22.7 28.22c11.95 4.906 25.44 3.531 36.09-3.844L256 457.5l68.83 47.78C331.3 509.7 338.8 512 346.3 512c4.906 0 9.859-.9687 14.56-2.906c11.92-4.969 20.4-15.5 22.7-28.19l14.89-82.44l82.37-14.88c12.73-2.281 23.3-10.78 28.25-22.75C514.1 348.9 512.6 335.4 505.2 324.8zM456.8 339.2l-99.61 18l-18 99.63L256 399.1L172.8 456.8l-18-99.63l-99.61-18L112.9 255.1L55.23 172.8l99.61-18l18-99.63L256 112.9l83.15-57.75l18.02 99.66l99.61 18L399.1 255.1L456.8 339.2zM256 143.1c-61.85 0-111.1 50.14-111.1 111.1c0 61.85 50.15 111.1 111.1 111.1s111.1-50.14 111.1-111.1C367.1 194.1 317.8 143.1 256 143.1zM256 319.1c-35.28 0-63.99-28.71-63.99-63.99S220.7 192 256 192s63.99 28.71 63.99 63.1S291.3 319.1 256 319.1z\"/>\r\n                </svg>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</div>";
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    const walkthroughPageButtons = yield (0, wait_1.waitForElement)('.content .buttons', walkthoughPageVersions);
    if (walkthroughPageButtons) {
        walkthroughPageButtons.appendChild(parsedDocument.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonJs}`));
    }
    else {
        missionlog_1.log.warn('Walkthrough-Page', 'applyWalkthroughTeamButton - did not find walkthrough buttons on page versions element');
    }
    missionlog_1.log.debug('Walkthrough-Page', 'Finished - applyWalkthroughTeamButton');
});
const setTopStyle = (noTransitionStyle) => {
    let addAnimation;
    let removeAnimation = [constants_1.Constants.Styles.Animations.yShow, constants_1.Constants.Styles.Animations.yHide, constants_1.Constants.Styles.Animations.yHideNoTransition];
    let topStyle = window.pageYOffset - walkthroughContainer.offsetTop + 5;
    const apply = () => {
        document.documentElement.style.setProperty(constants_1.Constants.Styles.Variables.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryTop, `${topStyle}px`);
        walkthoughPageVersions.classList.remove(...removeAnimation);
        if (addAnimation)
            walkthoughPageVersions.classList.add(addAnimation);
    };
    const atTopOfPage = () => window.pageYOffset <=
        walkthroughContainer.offsetTop +
            (stickyNavBarEnabled ? stickyNavBarElement.offsetHeight : 0);
    if (!atTopOfPage()) {
        if (stickyNavBarEnabled) {
            if (!stickyNavBarElement.classList.contains(constants_1.Constants.Styles.Animations.yShow)) {
                addAnimation = noTransitionStyle ? constants_1.Constants.Styles.Animations.yHideNoTransition : constants_1.Constants.Styles.Animations.yHide;
                removeAnimation = [constants_1.Constants.Styles.Animations.yShow];
            }
            else {
                if (window.pageYOffset <= (window.pageYOffset + stickyNavBarElement.offsetTop)) {
                    topStyle += stickyNavBarElement.offsetTop;
                }
                addAnimation = constants_1.Constants.Styles.Animations.yShow;
                removeAnimation = [constants_1.Constants.Styles.Animations.yHide, constants_1.Constants.Styles.Animations.yHideNoTransition];
            }
        }
        else {
            topStyle -= stickyNavBarElement.offsetHeight;
        }
        if (topStyle >= (stickyNavBarEnabled ? stickyNavBarElement.offsetHeight : 0)) {
            apply();
            return;
        }
    }
    if (stickyNavBarEnabled && topStyle >= 0) {
        if (stickyNavBarElement.classList.contains(constants_1.Constants.Styles.Animations.yShow)) {
            addAnimation = constants_1.Constants.Styles.Animations.yShow;
            apply();
            return;
        }
    }
    topStyle = 0;
    apply();
};
const listen = () => {
    missionlog_1.log.debug('Walkthrough-Preview', 'Started - listen');
    if (config_1.default.staffWalkthroughImprovements.stickyPageHistory) {
        missionlog_1.log.debug('Walkthrough-Page', 'Starting stickyPageHistory - listen');
        window.addEventListener('scroll', () => setTopStyle(!(0, html_element_util_1.classListContains)(walkthoughPageVersions, [
            constants_1.Constants.Styles.Animations.yHideNoTransition,
            constants_1.Constants.Styles.Animations.yHide,
            constants_1.Constants.Styles.Animations.yShow
        ])));
        missionlog_1.log.debug('Walkthrough-Page', 'Finished stickyPageHistory - listen');
    }
    missionlog_1.log.debug('Walkthrough-Page', 'Finished - listen');
};
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!regex_1.default.test.staff.walkthrough.walkthroughPageUrl(window.location.href))
        return;
    missionlog_1.log.debug('Walkthrough-Page', 'Started');
    yield applyBody();
    listen();
    missionlog_1.log.debug('Walkthrough-Page', 'Finished');
});

},{"../../config":8,"../../constants":9,"../../regex":11,"../components/promise":12,"../helpers/html-element-util":16,"../helpers/wait":20,"missionlog":6}],28:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const missionlog_1 = require("missionlog");
const regex_1 = require("../../regex");
const wait_1 = require("../helpers/wait");
// Elements -------
const applyBody = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Walkthrough-Preview', 'Starting - applyBody');
    const main = yield (0, wait_1.waitForElement)('.page main');
    main.parentElement.classList.add('no-aside');
    main.classList.add('no-aside');
    const aside = yield (0, wait_1.waitForElement)('.page aside');
    aside.remove();
    missionlog_1.log.debug('Walkthrough-Preview', 'Finished - applyBody');
});
const listen = () => {
    // Do nothing yet!
};
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!regex_1.default.test.staff.walkthrough.preview(window.location.href))
        return;
    missionlog_1.log.debug('Walkthrough-Preview', 'Starting');
    yield applyBody();
    listen();
    missionlog_1.log.debug('Walkthrough-Preview', 'Finished');
});

},{"../../regex":11,"../helpers/wait":20,"missionlog":6}],29:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const missionlog_1 = require("missionlog");
const config_1 = require("../config");
const constants_1 = require("../constants");
const parse_1 = require("./helpers/parse");
const wait_1 = require("./helpers/wait");
// Elements -------
let extensionBody;
let previousScrollTop;
const atTopOfPage = () => window.pageYOffset <= extensionBody.offsetTop;
const applyBody = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Sticky-Header', 'Starting - applyBody');
    extensionBody = yield (0, wait_1.waitForElement)('header');
    const extensionParent = extensionBody.parentNode;
    const fakeElement = document.createElement('div');
    fakeElement.style.height = `${extensionBody.offsetHeight}px`;
    extensionParent.insertBefore(fakeElement, extensionBody);
    extensionBody.classList.add(constants_1.Constants.Styles.StickyHeader.featureJs, constants_1.Constants.Styles.StickyHeader.featureStyle);
    document.documentElement.style.setProperty(constants_1.Constants.Styles.Variables.StickyHeader.height, `${extensionBody.offsetHeight}px`);
    if (!atTopOfPage()) {
        extensionBody.classList.add(constants_1.Constants.Styles.Animations.yHideNoTransition);
    }
    missionlog_1.log.debug('Sticky-Header', 'Finished - applyBody');
});
const listen = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Sticky-Header', 'Starting - listen');
    const navGamer = yield (0, wait_1.waitForElement)(`.nav-gamer:not(.${constants_1.Constants.Styles.SettingsMenu.featureJs})`);
    const taxSettingsMenu = yield (0, wait_1.waitForElement)(`.${constants_1.Constants.Styles.SettingsMenu.featureJs}`);
    let prevState = navGamer.classList.contains('open') || taxSettingsMenu.classList.contains('open');
    window.addEventListener('scroll', () => {
        const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (atTopOfPage()) {
            extensionBody.classList.remove(constants_1.Constants.Styles.Animations.yHide, constants_1.Constants.Styles.Animations.yHideNoTransition);
        }
        else {
            const searchElement = extensionBody.querySelector('#divtxtSearchContainer');
            if (searchElement.style.display !== 'inline' && !(0, parse_1.toBool)(extensionBody.dataset.menuOpen)) {
                if (previousScrollTop > currentScrollTop) {
                    extensionBody.classList.remove(constants_1.Constants.Styles.Animations.yHide, constants_1.Constants.Styles.Animations.yHideNoTransition);
                    extensionBody.classList.add(constants_1.Constants.Styles.Animations.yShow);
                }
                else if (previousScrollTop < currentScrollTop) {
                    extensionBody.classList.remove(constants_1.Constants.Styles.Animations.yShow);
                    extensionBody.classList.add(constants_1.Constants.Styles.Animations.yHide);
                }
            }
        }
        previousScrollTop = currentScrollTop;
    });
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(({ target, attributeName }) => {
            const htmlTarget = target;
            if (attributeName === 'class') {
                const currentState = htmlTarget.classList.contains('open');
                if (prevState !== currentState) {
                    prevState = currentState;
                    extensionBody.setAttribute('data-menu-open', currentState.toString());
                }
            }
        });
    });
    observer.observe(navGamer, {
        attributes: true,
        attributeFilter: ['style', 'class']
    });
    observer.observe(taxSettingsMenu, {
        attributes: true,
        attributeFilter: ['style', 'class']
    });
    missionlog_1.log.debug('Sticky-Header', 'Finished - listen');
});
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.stickyHeader.enabled)
        return;
    missionlog_1.log.debug('Sticky-Header', 'Starting');
    yield applyBody();
    yield listen();
    missionlog_1.log.debug('Sticky-Header', 'Finished');
});

},{"../config":8,"../constants":9,"./helpers/parse":18,"./helpers/wait":20,"missionlog":6}],30:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

const missionlog_1 = require("missionlog");
const constants_1 = require("../constants");
const wait_1 = require("../scripts/helpers/wait");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Styles', 'Starting');
    if (yield (0, wait_1.waitForElement)('body')) {
        document.body.classList.add(constants_1.Constants.Styles.root);
        GM_addStyle("body.trueachievement-extras .ta-x-y-show {\n  transform: translateY(0);\n  transition: transform 0.5s ease;\n}\n\nbody.trueachievement-extras .ta-x-y-hide {\n  transform: translateY(-100%);\n  transition: transform 0.5s ease;\n}\n\nbody.trueachievement-extras .ta-x-y-hide-no-transition {\n  transform: translateY(-100%);\n}\n:root {\n  --ta-x-sticky-header-height: $ta-x-sticky-header-height;\n}\n\nbody.trueachievement-extras .ta-x-hide {\n  display: none;\n}\n\n@media (min-width: 1200px) {\n  body.trueachievement-extras .middle {\n    width: 100%;\n    max-width: 1200px;\n  }\n}\n.trueachievement-extras-online-status {\n  background: #107c10;\n  border: 2px solid #d9d9d9;\n  border-radius: 50%;\n  display: block;\n  position: relative;\n  z-index: 2;\n}\n\n.trueachievement-extras-online-status.trueachievement-extras-friend-feed-online-status {\n  height: 6px;\n  left: 2.8rem;\n  margin-bottom: -4px;\n  margin-right: -10px;\n  top: -1.3rem;\n  width: 6px;\n}\n\n.trueachievement-extras-online-status.trueachievement-extras-achievement-solution-comment-online-status {\n  height: 6px;\n  left: 2.8rem;\n  margin-bottom: -5px;\n  margin-right: -10px;\n  top: -1.3rem;\n  width: 6px;\n}\n\n.trueachievement-extras-online-status.trueachievement-extras-achievement-solution-poster-online-status {\n  height: 12px;\n  left: 8.9rem;\n  margin-bottom: -16px;\n  top: -5rem;\n  width: 12px;\n}\n\n@media only screen and (max-width: 768px) {\n  .trueachievement-extras-online-status.trueachievement-extras-achievement-solution-poster-online-status {\n    height: 6px;\n    left: -1.9rem;\n    margin-bottom: -10px;\n    margin-right: 0;\n    top: -0.2rem;\n    width: 6px;\n  }\n}\n\n.trueachievement-extras-online-status.trueachievement-extras-forum-online-status {\n  height: 12px;\n  left: 2.5rem;\n  margin-bottom: -16px;\n  top: -3rem;\n  width: 12px;\n}\n\n@media only screen and (max-width: 768px) {\n  .trueachievement-extras-online-status.trueachievement-extras-forum-online-status {\n    height: 6px;\n    left: -2rem;\n    margin-bottom: 0;\n    margin-right: -10px;\n    top: 1.3rem;\n    width: 6px;\n  }\n}\n\n[data-theme=dark] .trueachievement-extras-online-status {\n  border: 2px solid #646464;\n}\nbody.trueachievement-extras .ta-x-settings-menu-column-setting {\n  flex-direction: column;\n  align-items: flex-start;\n}\n\nbody.trueachievement-extras .ta-x-settings-menu-column-setting .frm-grp {\n  padding-top: 0.5rem;\n}\n\nbody.trueachievement-extras .ta-x-settings-menu-sub-setting {\n  padding-left: 2rem;\n}\n\nbody.trueachievement-extras .ta-x-settings-menu-sub-setting-wrapable {\n  flex-wrap: wrap;\n}\n\nbody.trueachievement-extras .ta-x-settings-menu-sub-setting-wrapable label {\n  flex-basis: 80%;\n  flex-grow: 1;\n}\n\nbody.trueachievement-extras .ta-x-settings-menu-sub-setting-wrapable .frm-tgl {\n  margin-right: 0;\n}\n\nbody.trueachievement-extras .ta-x-settings-menu .close i {\n  pointer-events: none;\n}\nbody.trueachievement-extras .ta-x-sticky-header {\n  position: fixed;\n  top: 0;\n  width: 100%;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements {\n  min-width: unset !important;\n  overflow: auto;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements main {\n  min-height: unset !important;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page {\n  position: unset;\n  display: flex;\n  flex-direction: column;\n}\n/* stylelint-disable selector-id-pattern */\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector#oWalkthroughImageViewer {\n  width: 321px;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .noimages,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .itemname {\n  padding: 5px;\n  text-align: center;\n  font-size: unset !important;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header {\n  position: sticky;\n  border-bottom: 1px solid #000;\n  display: flex;\n  flex-direction: column;\n  background-color: #fff;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header .noimages {\n  margin-top: 0;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector a[title=\"Add images\"] {\n  text-align: center;\n  padding: 5px;\n  cursor: pointer !important;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector a[title=\"Add images\"]:hover {\n  text-decoration: underline;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .imageviewer {\n  display: flex;\n  flex-wrap: wrap;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .imageviewer .ivimage {\n  position: unset;\n  margin: 5px;\n  max-width: 46%;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title {\n  text-align: center;\n  padding-top: 3px;\n  white-space: break-spaces;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg {\n  height: 20px;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg path {\n  fill: #555;\n  filter: drop-shadow(21px 21px #fff);\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg:hover path {\n  fill: #333;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark {\n  display: block;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle[data-ta-x-tinymce-theme=dark] svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light {\n  display: block;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle[data-ta-x-tinymce-theme=dark] svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title {\n  color: #b5b9bf;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header {\n  background-color: #2f3740;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg path {\n  fill: #b5b9bf;\n  filter: drop-shadow(21px 21px #000);\n}\n\n/* stylelint-enable selector-id-pattern */\n/* stylelint-disable selector-id-pattern */\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divWalkthroughHolder {\n  position: unset;\n  margin-top: unset;\n  height: unset;\n  display: flex;\n  justify-content: space-between;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .buttons {\n  display: flex;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button {\n  display: block;\n  flex-grow: 1;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough {\n  margin: 0;\n  margin-bottom: 3px;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough:hover {\n  margin-bottom: 5px;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .clearboth {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughs,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughAchievements,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGames,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGamers,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughOtherSiteLink {\n  position: unset;\n  top: unset;\n  left: unset;\n  display: block;\n  margin: 0;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough {\n  flex: 1;\n  margin: 0 1.5rem;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #btnWalkthrough {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n}\n\n/* stylelint-enable selector-id-pattern */\n/* stylelint-disable selector-id-pattern */\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container {\n  display: flex;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview {\n  margin-left: 0;\n  position: unset;\n  width: unset;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview {\n  flex: 1;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions {\n  height: 100%;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history {\n  position: relative;\n  top: var(--ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history-top, 0);\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide {\n  transform: translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));\n  transition: transform 0.5s ease;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide-no-transition {\n  transform: translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPageVersions .content .buttons,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button #chWalkthroughPageVersions .content .buttons {\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPageVersions .content .buttons .button,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button #chWalkthroughPageVersions .content .buttons .button {\n  flex: 1;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPageVersions .content .buttons .button:not(:first-of-type),\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button #chWalkthroughPageVersions .content .buttons .button:not(:first-of-type) {\n  margin-top: 5px;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPageVersions .content .buttons .clearboth,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button #chWalkthroughPageVersions .content .buttons .clearboth {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPagePreview .content .buttons {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPagePreview .content .buttons .clearboth {\n  display: none;\n}\n\n/* stylelint-enable selector-id-pattern */\n");
        missionlog_1.log.debug('Styles', 'Finished');
    }
    else {
        missionlog_1.log.error('Styles', 'Failed to add, The body element was not found');
    }
});

},{"../constants":9,"../scripts/helpers/wait":20,"missionlog":6}],31:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

const missionlog_1 = require("missionlog");
const config_1 = require("../config");
const constants_1 = require("../constants");
const wait_1 = require("../scripts/helpers/wait");
const listen = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Staff-Walkthrough-Improvements-Styles', 'Starting - listen');
    const iframe = yield (0, wait_1.waitForElement)('#txtWalkthrough_ifr');
    const globalThemeElement = yield (0, wait_1.waitForElement)('[data-theme]');
    const tinymceThemeElement = yield (0, wait_1.waitForElement)(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`);
    let theme;
    if (config_1.default.staffWalkthroughImprovements.tinymceTheme === null) {
        theme = globalThemeElement.getAttribute('data-theme');
        missionlog_1.log.warn('Staff-Walkthrough-Improvements-Styles', 'No tinymce theme has been set, using site theme');
    }
    else {
        theme = config_1.default.staffWalkthroughImprovements.tinymceTheme;
    }
    iframe.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
        missionlog_1.log.debug('Staff-Walkthrough-Improvements-Styles', 'Starting - load event listener');
        const iframeDocument = iframe && iframe.contentDocument;
        const bodyEl = yield (0, wait_1.waitForElement)('#tinymce', iframeDocument);
        bodyEl.classList.add(constants_1.Constants.Styles.root, constants_1.Constants.Styles.StaffWalkthroughImprovements.featureStyle);
        bodyEl.setAttribute('data-ta-x-tinymce-theme', theme);
        missionlog_1.log.debug('Staff-Walkthrough-Improvements-Styles', 'set iframe theme to', theme);
        const style = iframeDocument.createElement('style');
        style.id = 'ta-x-staff-walkthrough-improvements-dark-tinymce-style';
        style.innerHTML = "body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-tinymce-theme=dark] {\n  background-color: #444;\n  color: #bbb;\n  border-color: #555;\n}";
        iframeDocument.head.appendChild(style);
        const script = iframeDocument.createElement('script');
        script.id = 'ta-x-staff-walkthrough-improvements-dark-tinymce-script';
        script.innerHTML = `window.addEventListener('message', function(event) {
      console.log(event);
      if (!event || !event.data || event.data.theme === null || event.data.theme === undefined) return;
      document.body.setAttribute('data-ta-x-tinymce-theme', event.data.theme);
    });`;
        iframeDocument.head.appendChild(script);
        iframe.removeEventListener('load', this);
        missionlog_1.log.debug('Staff-Walkthrough-Improvements-Styles', 'Finished - load event listener');
    }));
    let preventMutation = false;
    const observer = new MutationObserver((mutations) => {
        if (preventMutation) {
            preventMutation = false;
            return;
        }
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
                let theme;
                let setby;
                if (mutation.attributeName === 'data-theme') {
                    theme = mutation.target.getAttribute('data-theme');
                    setby = 'data-theme';
                    preventMutation = true;
                    tinymceThemeElement.setAttribute('data-ta-x-tinymce-theme', theme === 'dark' ? theme : '');
                }
                else if (mutation.attributeName === 'data-ta-x-tinymce-theme') {
                    theme = mutation.target.getAttribute('data-ta-x-tinymce-theme');
                    setby = 'data-ta-x-tinymce-theme';
                }
                else {
                    return;
                }
                missionlog_1.log.debug('Staff-Walkthrough-Improvements-Styles', 'Started - mutation observer', theme, 'set by', setby);
                if (theme !== null && theme !== undefined) {
                    iframe.contentWindow.postMessage({ theme: theme }, '*');
                    missionlog_1.log.debug('Staff-Walkthrough-Improvements-Styles', 'set iframe theme to', theme);
                    missionlog_1.log.debug('Staff-Walkthrough-Improvements-Styles', 'Finished - mutation observer');
                }
                else {
                    missionlog_1.log.warn('Staff-Walkthrough-Improvements-Styles', 'Theme was null or undefined');
                }
            }
        });
    });
    observer.observe(globalThemeElement, {
        attributes: true
    });
    observer.observe(tinymceThemeElement, {
        attributes: true
    });
    missionlog_1.log.debug('Staff-Walkthrough-Improvements-Styles', 'Finished - listen');
});
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    missionlog_1.log.debug('Staff-Walkthrough-Improvements-Styles', 'Starting');
    if ((yield (0, wait_1.waitForElement)('[href*="skin.min.css"]'), document.head)) {
        GM_addStyle("/* stylelint-disable selector-id-pattern */\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel {\n  border: 0 solid #232b33;\n  background-color: #404952;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-toolbar-grp {\n  padding: 2px 0;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-title,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-label {\n  color: #b5b9bf;\n  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.75);\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-path-item {\n  color: #b5b9bf;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel i.mce-i-resize {\n  color: #b5b9bf;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel i.mce-ico {\n  text-shadow: 1px 1px #000;\n  color: #b5b9bf;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel i.mce-caret {\n  border-top: 4px solid #b5b9bf;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-menubtn,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-btn {\n  border: 1px solid #364049 !important;\n  border-color: #202a33 !important;\n  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.75);\n  background-color: #4c5761 !important;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-menubtn.mce-active, body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-menubtn:hover,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-btn.mce-active,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-btn:hover {\n  background-image: none !important;\n  background-color: #004364 !important;\n  border-color: #24292e !important;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-menubtn.mce-disabled,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-btn.mce-disabled {\n  cursor: default;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-menubtn button,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-btn button {\n  padding: 4px 10px;\n  font-size: 14px;\n  cursor: pointer;\n  color: #b5b9bf;\n  text-align: center;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-menubtn button span,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-btn button span {\n  color: unset;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-panel .mce-btn-group .mce-btn {\n  border-width: 1px;\n  margin: 0;\n  margin-left: 2px;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-menu {\n  background: #2f3740;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-menu-item-normal .mce-text {\n  color: #ddd;\n  background: transparent !important;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-menu-item-normal.mce-selected, body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-menu-item-normal.mce-active {\n  background-color: #0085c7;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-menu-item-normal:hover {\n  text-decoration: none;\n  color: #fff;\n  background-color: #006597;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-menu-item-normal .mce-caret {\n  border-left: 4px solid #b5b9bf;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-grid-border a.mce-active {\n  border-color: #d6d6d6;\n  background: #0085c7;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-text-center {\n  color: #ddd;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .mce-edit-area {\n  border: 1px solid #000 !important;\n  border-right: 0 !important;\n  border-bottom: 0 !important;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] #oWalkthroughImageViewer {\n  border: 0 solid #232b33;\n  background-color: #2f3740;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] #oWalkthroughImageViewer .imageviewer {\n  background-color: #2f3740;\n}\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] #oWalkthroughImageViewer .noimages,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] #oWalkthroughImageViewer .itemname {\n  color: #b5b9bf;\n}\n\n/* stylelint-enable selector-id-pattern */");
        yield listen();
        missionlog_1.log.debug('Staff-Walkthrough-Improvements-Styles', 'Finished');
    }
    else {
        missionlog_1.log.error('Staff-Walkthrough-Improvements-Styles', 'Failed to add, The body element was not found');
    }
});

},{"../config":8,"../constants":9,"../scripts/helpers/wait":20,"missionlog":6}]},{},[10]);
