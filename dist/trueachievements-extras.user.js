// ==UserScript==
// @name          TrueAchievements Extra - Development
// @namespace     dynamite-andy
// @version       1.0.1.085203
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

// Last Updated: 27/12/2022, 08:52:03

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        set walkthroughTeamButton(value) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton', value); }
    }
};

},{}],2:[function(require,module,exports){
"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
const classStylePrefix = 'ta-x';
const jsStylePrefix = 'js-ta-x';
const variableStylePrefix = '--ta-x';
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
            _h),
        _f),
    _a.Variables = (_j = class {
        },
        _j.StickyHeader = (_k = class {
            },
            _k.featureVariableStylePreix = `${variableStylePrefix}-sticky-header`,
            _k.height = `${_k.featureVariableStylePreix}-height`,
            _k),
        _j.StaffWalkthroughImprovements = (_l = class {
            },
            _l.featureVariableStylePreix = `${variableStylePrefix}-staff-walkthrough-improvements`,
            _l.WalkthroughPage = (_m = class {
                },
                _m.featureVariableStylePreix = `${variableStylePrefix}-staff-walkthrough-improvements-walkthrough-page`,
                _m.stickyPageHistoryTop = `${_m.featureVariableStylePreix}-sticky-page-history-top`,
                _m),
            _l),
        _j),
    _a);

},{}],3:[function(require,module,exports){
"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
// const ajaxInterceptor = require('ajax-interceptor');
// import { broadcast } from './scripts/components/events';
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
const promise_1 = require("./scripts/components/promise");
// ajaxInterceptor.addRequestCallback((xhr: any) => broadcast('ajaxIntercept:request', undefined, { detail: xhr }));
// ajaxInterceptor.addResponseCallback((xhr: any) => broadcast('ajaxIntercept:response', undefined, { detail: xhr }));
// ajaxInterceptor.wire();
(() => __awaiter(void 0, void 0, void 0, function* () {
    const styles = require('./styles/index');
    const settings = require('./scripts/settings-menu');
    const stickyHeader = require('./scripts/sticky-header');
    const staffWalkthroughImprovements = require('./scripts/staff-walkthrough-improvements');
    yield styles.apply();
    (0, promise_1.allConcurrently)(3, [settings.render, stickyHeader.render, staffWalkthroughImprovements.render]);
}))();

},{"./scripts/components/promise":5,"./scripts/settings-menu":12,"./scripts/staff-walkthrough-improvements":13,"./scripts/sticky-header":14,"./styles/index":15}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yesterday = exports.today = exports.staffWalkthroughPagePreviewPage = exports.staffWalkthroughPreviewPage = exports.staffWalkthroughPage = exports.staffManageWalkthroughPage = exports.staffEditWalkthroughPage = exports.achievementsPage = exports.achievementPage = void 0;
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
const achievementPage = (str) => new RegExp('^/a[0-9]*/', 'i').test(getUrlProperties(str, 'pathname'));
exports.achievementPage = achievementPage;
const achievementsPage = (str) => new RegExp('^/game/.*/achievements$', 'i').test(getUrlProperties(str, 'pathname'));
exports.achievementsPage = achievementsPage;
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
const staffEditWalkthroughPage = (str) => new RegExp('^/staff/walkthrough/editwalkthroughpage.aspx', 'i').test(getUrlProperties(str, 'pathname'));
exports.staffEditWalkthroughPage = staffEditWalkthroughPage;
const staffManageWalkthroughPage = (str) => new RegExp('^/staff/walkthrough/managewalkthrough.aspx', 'i').test(getUrlProperties(str, 'pathname'));
exports.staffManageWalkthroughPage = staffManageWalkthroughPage;
const staffWalkthroughPage = (str) => new RegExp('^/staff/walkthrough/walkthroughpage.aspx', 'i').test(getUrlProperties(str, 'pathname'));
exports.staffWalkthroughPage = staffWalkthroughPage;
const staffWalkthroughPreviewPage = (str) => new RegExp('^/staff/walkthrough/walkthroughpreview.aspx', 'i').test(getUrlProperties(str, 'pathname'));
exports.staffWalkthroughPreviewPage = staffWalkthroughPreviewPage;
const staffWalkthroughPagePreviewPage = (str) => new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx', 'i').test(getUrlProperties(str, 'pathname'));
exports.staffWalkthroughPagePreviewPage = staffWalkthroughPagePreviewPage;
// // Random Strings
// summaryAvailable: (str: string) => new RegExp('Summary available for .* at ', 'i').test(str),
// hasStartedBroadcasting: (str: string) => new RegExp(' has started broadcasting .* on their twitch channel ', 'i').test(str),
// statusChange: (str: string) => new RegExp('Status change by .* at', 'i').test(str),
const today = (str) => new RegExp('Today', 'i').test(str);
exports.today = today;
const yesterday = (str) => new RegExp('Yesterday', 'i').test(str);
exports.yesterday = yesterday;
exports.default = {
    achievementsPage: exports.achievementsPage,
    achievementPage: exports.achievementPage,
    staffEditWalkthroughPage: exports.staffEditWalkthroughPage,
    staffManageWalkthroughPage: exports.staffManageWalkthroughPage,
    staffWalkthroughPage: exports.staffWalkthroughPage,
    staffWalkthroughPreviewPage: exports.staffWalkthroughPreviewPage,
    today: exports.today,
    yesterday: exports.yesterday
};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const isValid = (date) => {
    const testDate = typeof (date) === 'string' ? new Date(date) : date;
    return new Date(testDate).toString().toLowerCase() !== 'invalid date';
};
exports.isValid = isValid;

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
    if (regex_1.default.today(value)) {
        return today;
    }
    if (regex_1.default.yesterday(value)) {
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

},{"../../regex":4,"./date-util":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = void 0;
const wrapper = document.createElement('div');
const template = (element, ...params) => {
    wrapper.appendChild(element);
    wrapper.firstChild.outerHTML = element.outerHTML
        .replace(/{GM_info.script.version}/g, GM_info.script.version || '');
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
    const newElement = wrapper.firstChild;
    wrapper.innerHTML = '';
    return newElement;
};
exports.template = template;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.until = exports.waitForElement = void 0;
const waitForElement = (selector, element = document, timeoutMS = 10000) => new Promise(resolve => {
    if (element.querySelector(selector)) {
        return resolve(document.querySelector(selector));
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
    observer.observe(document.body || document.documentElement, {
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

},{}],11:[function(require,module,exports){
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

},{"../helpers/parse":8}],12:[function(require,module,exports){
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
exports.render = void 0;

const config_1 = require("../config");
const constants_1 = require("../constants");
const template_1 = require("./helpers/template");
const wait_1 = require("./helpers/wait");
const conditional_render_1 = require("./models/conditional-render");
// Elements -------
let extensionBody;
let extensionTrigger;
const applyBody = () => __awaiter(void 0, void 0, void 0, function* () {
    const html = "<div class=\"js-ta-x-settings-menu-wrench gamer-page\" aria-haspopup=\"true\">\r\n    <i class=\"fa fa-wrench\"></i>\r\n</div>\r\n\r\n<div class=\"js-ta-x-settings-menu ta-x-settings-menu ta-x-hide\">\r\n    <div class=\"middle\">\r\n        <div class=\"wrap\">\r\n            <div class=\"labels\">\r\n                <label class=\"js-ta-x-settings-menu-close close\">\r\n                    <i class=\"fa fa-close\"></i>\r\n                </label>\r\n            </div>\r\n            <div class=\"contents\">\r\n                <div class=\"t-settings optionpanel t-5 open\" >\r\n                    <div>\r\n                        <label>Sticky Header</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStickyHeader\" name=\"chkStickyHeader\" data-config-area=\"stickyHeader\"\r\n                                data-config-setting=\"enabled\" checked=\"\">\r\n                            <label for=\"chkStickyHeader\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div>\r\n                        <label>Staff Walkthrough Improvements</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovements\" name=\"chkStaffWalkthroughImprovements\" data-config-area=\"staffWalkthroughImprovements\"\r\n                                data-config-setting=\"enabled\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovements\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Stick Page History To Left</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsStickyPageHistory\" name=\"chkStaffWalkthroughImprovementsStickyPageHistory\"\r\n                                data-config-area=\"staffWalkthroughImprovements\" data-config-setting=\"stickyPageHistory\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovementsStickyPageHistory\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Move Edit Page Button To The Left</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsEditPageLeft\" name=\"chkStaffWalkthroughImprovementsEditPageLeft\"\r\n                                data-config-area=\"staffWalkthroughImprovements\" data-config-setting=\"editPageLeft\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovementsEditPageLeft\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Add Walkthrough Team Button</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\" name=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\"\r\n                                data-config-area=\"staffWalkthroughImprovements\" data-config-setting=\"walkthroughTeamButton\" checked=\"\">\r\n                            <label for=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <!-- <div>\r\n                        <label>Show recent winners</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkRecentWinners\" name=\"chkRecentWinners\"\r\n                                data-config-area=\"recentWinners\" data-config-setting=\"enabled\" checked=\"\">\r\n                            <label for=\"chkRecentWinners\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkRecentWinners\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Online unlocks only</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkRecentWinnersOnlineUnlocksOnly\" name=\"chkRecentWinnersOnlineUnlocksOnly\"\r\n                                data-config-area=\"recentWinners\" data-config-setting=\"onlineUnlocksOnly\" checked=\"\">\r\n                            <label for=\"chkRecentWinnersOnlineUnlocksOnly\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkRecentWinners\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Base game only</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkRecentWinnersBaseGameOnly\" name=\"chkRecentWinnersBaseGameOnly\"\r\n                                data-config-area=\"recentWinners\" data-config-setting=\"baseGameOnly\" checked=\"\">\r\n                            <label for=\"chkRecentWinnersBaseGameOnly\"> </label>\r\n                        </div>\r\n                    </div> -->\r\n\r\n                    <ul class=\"list-links buttons\">\r\n                        <li><a href=\"https://github.com/andrewcartwright1/trueachievements-extra/issues/new\">Raise a Bug</a></li>\r\n                        <li><a href=\"https://github.com/andrewcartwright1/trueachievements-extra/issues/new\">Request a Feature</a></li>\r\n                    </ul>\r\n                    <div class=\"title\">\r\n                        <span>TrueAchievements Extra</span>\r\n                        </br>\r\n                        <span>Version {GM_info.script.version}</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"js-ta-x-settings-menu-close close\"></div>\r\n</div>";
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    const navigationBar = yield (0, wait_1.waitForElement)('header nav');
    const navGamerToggle = yield (0, wait_1.waitForElement)('[data-tgl="nav-gamer"]', navigationBar);
    navigationBar.insertBefore(parsedDocument.querySelector(`.${constants_1.Constants.Styles.SettingsMenu.wrenchJs}`), navGamerToggle.nextSibling);
    extensionTrigger = document.querySelector(`.${constants_1.Constants.Styles.SettingsMenu.wrenchJs}`);
    const navGamer = yield (0, wait_1.waitForElement)('.nav-gamer');
    const templatedFeature = (0, template_1.template)(parsedDocument.querySelector(`.${constants_1.Constants.Styles.SettingsMenu.featureJs}`));
    navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);
    extensionBody = document.querySelector(`.${constants_1.Constants.Styles.SettingsMenu.featureJs}`);
    [...extensionBody.querySelectorAll('input')].forEach(setting => {
        const configObject = setting.dataset.configArea;
        const configSettings = setting.dataset.configSetting;
        if (!configObject || !configSettings)
            return;
        if (setting.type === 'checkbox')
            setting.checked = config_1.default[configObject][configSettings];
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
});
const listen = () => {
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
        if ((inputTarget === null || inputTarget === void 0 ? void 0 : inputTarget.type) === 'checkbox')
            config_1.default[configObject][configSettings] = inputTarget === null || inputTarget === void 0 ? void 0 : inputTarget.checked;
        [...extensionBody.querySelectorAll(`[data-render-condition*="#${htmlTarget.id}"]`)].forEach(hiddenSetting => {
            const condition = new conditional_render_1.default(hiddenSetting.dataset.renderCondition);
            if (!condition.isValid())
                return;
            const inputTarget = target;
            if (inputTarget.type === 'checkbox') {
                hiddenSetting.classList[(inputTarget.checked === condition.value)
                    ? 'remove'
                    : 'add'](constants_1.Constants.Styles.Base.hide);
            }
        });
    });
};
const render = () => __awaiter(void 0, void 0, void 0, function* () {
    yield applyBody();
    listen();
});
exports.render = render;

},{"../config":1,"../constants":2,"./helpers/template":9,"./helpers/wait":10,"./models/conditional-render":11}],13:[function(require,module,exports){
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
exports.render = void 0;

const config_1 = require("../config");
const constants_1 = require("../constants");
const regex_1 = require("../regex");
const html_element_util_1 = require("./helpers/html-element-util");
const wait_1 = require("./helpers/wait");
// Elements -------
let walkthroughContainer;
let walkthoughPageVersions;
let stickyNavBarEnabled;
let stickyNavBarElement;
const atTopOfPage = () => window.pageYOffset <= (walkthroughContainer.offsetTop + (stickyNavBarEnabled ? stickyNavBarElement.offsetHeight : 0));
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
const applyBody = () => __awaiter(void 0, void 0, void 0, function* () {
    document.body.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.featureJs, constants_1.Constants.Styles.StaffWalkthroughImprovements.featureStyle);
    if ((0, regex_1.staffWalkthroughPage)(window.location.href)) {
        const html = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" href=\"/staff/walkthrough/managewalkthrough.aspx\">Walkthrough Team</a>";
        const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
        walkthoughPageVersions = yield (0, wait_1.waitForElement)('#chWalkthroughPageVersions');
        const walkthoughPagePreview = yield (0, wait_1.waitForElement)('#chWalkthroughPagePreview');
        walkthoughPageVersions.parentElement.insertBefore(parsedDocument.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`), walkthoughPageVersions);
        walkthroughContainer = document.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`);
        walkthroughContainer.appendChild(walkthoughPageVersions);
        if (walkthoughPagePreview) {
            walkthroughContainer.appendChild(walkthoughPagePreview);
            yield applyStickyNavBar();
            yield applyEditPageLeft();
            applyWalkthroughTeamButton();
        }
    }
    else if ((0, regex_1.staffManageWalkthroughPage)(window.location.href)) {
        const html = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" href=\"/staff/walkthrough/managewalkthrough.aspx\">Walkthrough Team</a>";
        const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
        const walkthroughHolder = yield (0, wait_1.waitForElement)('#divWalkthroughHolder');
        if ((yield (0, wait_1.waitForElement)('#lstWalkthroughIDselectedrow')) === null) {
            return;
        }
        if ((yield (0, wait_1.waitForElement)('#chWalkthroughGames')) !== null) {
            const editWalkthrough = yield (0, wait_1.waitForElement)('#chEditWalkthrough', walkthroughHolder);
            editWalkthrough.after(parsedDocument.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`));
            const sideBarContainer = walkthroughHolder.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`);
            sideBarContainer.appendChild(yield (0, wait_1.waitForElement)('#chWalkthroughGames', walkthroughHolder));
            sideBarContainer.appendChild(yield (0, wait_1.waitForElement)('#chWalkthroughAchievements', walkthroughHolder));
            sideBarContainer.appendChild(yield (0, wait_1.waitForElement)('#chWalkthroughGamers', walkthroughHolder));
            sideBarContainer.appendChild(yield (0, wait_1.waitForElement)('#chWalkthroughOtherSiteLink', walkthroughHolder));
            let buttonsContainer = null;
            [...document.querySelectorAll('#btnWalkthrough_Options li a')].forEach(button => {
                button.classList.add('button');
                if (buttonsContainer === null) {
                    buttonsContainer = button.closest('.buttons');
                }
                buttonsContainer.appendChild(button);
            });
            buttonsContainer.parentNode.insertBefore(buttonsContainer, buttonsContainer.previousElementSibling);
        }
    }
    else if ((0, regex_1.staffWalkthroughPreviewPage)(window.location.href) || (0, regex_1.staffWalkthroughPagePreviewPage)(window.location.href)) {
        const main = yield (0, wait_1.waitForElement)('.page main');
        main.parentElement.classList.add('no-aside');
        main.classList.add('no-aside');
        const aside = yield (0, wait_1.waitForElement)('.page aside');
        aside.remove();
    }
});
const applyStickyNavBar = () => __awaiter(void 0, void 0, void 0, function* () {
    if (config_1.default.staffWalkthroughImprovements.stickyPageHistory) {
        stickyNavBarEnabled = config_1.default.stickyHeader.enabled;
        stickyNavBarElement = stickyNavBarEnabled
            ? yield (0, wait_1.waitForElement)(`.${constants_1.Constants.Styles.StickyHeader.featureJs}`)
            : yield (0, wait_1.waitForElement)('.header');
        walkthoughPageVersions.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs, constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle);
        setTopStyle(true);
    }
});
const applyEditPageLeft = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (config_1.default.staffWalkthroughImprovements.editPageLeft) {
        walkthroughContainer.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.editPageLeftStyle);
        const editButton = yield (0, wait_1.waitForElement)('[id="btnEditPage"], [id="btnEditPage2"]', walkthroughContainer);
        editButton.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.editPageLeftJs);
        (_a = walkthoughPageVersions.querySelector('.content .buttons')) === null || _a === void 0 ? void 0 : _a.appendChild(editButton);
    }
});
const applyWalkthroughTeamButton = () => {
    if (config_1.default.staffWalkthroughImprovements.walkthroughTeamButton) {
        walkthroughContainer.classList.add(constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonStyle);
        const html = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" href=\"/staff/walkthrough/managewalkthrough.aspx\">Walkthrough Team</a>";
        const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
        walkthoughPageVersions.querySelector('.content .buttons').appendChild(parsedDocument.querySelector(`.${constants_1.Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonJs}`));
    }
};
const listen = () => {
    if (config_1.default.staffWalkthroughImprovements.enabled && (0, regex_1.staffWalkthroughPage)(window.location.href)) {
        window.addEventListener('scroll', () => setTopStyle(!(0, html_element_util_1.classListContains)(walkthoughPageVersions, [
            constants_1.Constants.Styles.Animations.yHideNoTransition,
            constants_1.Constants.Styles.Animations.yHide,
            constants_1.Constants.Styles.Animations.yShow
        ])));
    }
};
const render = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.staffWalkthroughImprovements.enabled)
        return;
    if (!(0, regex_1.staffManageWalkthroughPage)(window.location.href) && !(0, regex_1.staffWalkthroughPage)(window.location.href) &&
        !(0, regex_1.staffEditWalkthroughPage)(window.location.href) && !(0, regex_1.staffWalkthroughPreviewPage)(window.location.href) &&
        !(0, regex_1.staffWalkthroughPagePreviewPage)(window.location.href))
        return;
    yield applyBody();
    listen();
});
exports.render = render;

},{"../config":1,"../constants":2,"../regex":4,"./helpers/html-element-util":7,"./helpers/wait":10}],14:[function(require,module,exports){
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
exports.render = void 0;
const config_1 = require("../config");
const constants_1 = require("../constants");
const parse_1 = require("./helpers/parse");
const wait_1 = require("./helpers/wait");
// Elements -------
let extensionBody;
let searchElement;
let previousScrollTop;
const atTopOfPage = () => window.pageYOffset <= extensionBody.offsetTop;
const applyBody = () => __awaiter(void 0, void 0, void 0, function* () {
    extensionBody = yield (0, wait_1.waitForElement)('header');
    searchElement = yield (0, wait_1.waitForElement)('#divtxtSearchContainer', extensionBody);
    const extensionParent = extensionBody.parentNode;
    const fakeElement = document.createElement('div');
    fakeElement.style.height = `${extensionBody.offsetHeight}px`;
    extensionParent.insertBefore(fakeElement, extensionBody);
    extensionBody.classList.add(constants_1.Constants.Styles.StickyHeader.featureJs, constants_1.Constants.Styles.StickyHeader.featureStyle);
    document.documentElement.style.setProperty(constants_1.Constants.Styles.Variables.StickyHeader.height, `${extensionBody.offsetHeight}px`);
    if (!atTopOfPage()) {
        extensionBody.classList.add(constants_1.Constants.Styles.Animations.yHideNoTransition);
    }
});
const listen = () => __awaiter(void 0, void 0, void 0, function* () {
    window.addEventListener('scroll', () => {
        const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (atTopOfPage()) {
            extensionBody.classList.remove(constants_1.Constants.Styles.Animations.yHide, constants_1.Constants.Styles.Animations.yHideNoTransition);
        }
        else {
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
    const navGamer = yield (0, wait_1.waitForElement)(`.nav-gamer:not(.${constants_1.Constants.Styles.SettingsMenu.featureJs})`);
    const taxSettingsMenu = yield (0, wait_1.waitForElement)(`.${constants_1.Constants.Styles.SettingsMenu.featureJs}`);
    let prevState = navGamer.classList.contains('open') || taxSettingsMenu.classList.contains('open');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(({ target, attributeName }) => {
            const htmlTarget = target;
            if (attributeName === 'class') {
                const currentState = htmlTarget.classList.contains('open');
                if (prevState !== currentState) {
                    prevState = currentState;
                    extensionBody.dataset.menuOpen = currentState.toString();
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
});
const render = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.stickyHeader.enabled)
        return;
    yield applyBody();
    yield listen();
});
exports.render = render;

},{"../config":1,"../constants":2,"./helpers/parse":8,"./helpers/wait":10}],15:[function(require,module,exports){
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
exports.apply = void 0;

const constants_1 = require("../constants");
const wait_1 = require("../scripts/helpers/wait");
const apply = () => __awaiter(void 0, void 0, void 0, function* () {
    (yield (0, wait_1.waitForElement)('body', document.documentElement)).classList.add(constants_1.Constants.Styles.root);
    GM_addStyle("body.trueachievement-extras .ta-x-y-show {\n  transform: translateY(0);\n  transition: transform 0.5s ease;\n}\n\nbody.trueachievement-extras .ta-x-y-hide {\n  transform: translateY(-100%);\n  transition: transform 0.5s ease;\n}\n\nbody.trueachievement-extras .ta-x-y-hide-no-transition {\n  transform: translateY(-100%);\n}\n:root {\n  --ta-x-sticky-header-height: $ta-x-sticky-header-height;\n}\n\nbody.trueachievement-extras .ta-x-hide {\n  display: none;\n}\n\n@media (min-width: 1200px) {\n  body.trueachievement-extras .middle {\n    width: 100%;\n    max-width: 1200px;\n  }\n}\n.trueachievement-extras-online-status {\n  background: #107c10;\n  border: 2px solid #d9d9d9;\n  border-radius: 50%;\n  display: block;\n  position: relative;\n  z-index: 2;\n}\n\n.trueachievement-extras-online-status.trueachievement-extras-friend-feed-online-status {\n  height: 6px;\n  left: 2.8rem;\n  margin-bottom: -4px;\n  margin-right: -10px;\n  top: -1.3rem;\n  width: 6px;\n}\n\n.trueachievement-extras-online-status.trueachievement-extras-achievement-solution-comment-online-status {\n  height: 6px;\n  left: 2.8rem;\n  margin-bottom: -5px;\n  margin-right: -10px;\n  top: -1.3rem;\n  width: 6px;\n}\n\n.trueachievement-extras-online-status.trueachievement-extras-achievement-solution-poster-online-status {\n  height: 12px;\n  left: 8.9rem;\n  margin-bottom: -16px;\n  top: -5rem;\n  width: 12px;\n}\n\n@media only screen and (max-width: 768px) {\n  .trueachievement-extras-online-status.trueachievement-extras-achievement-solution-poster-online-status {\n    height: 6px;\n    left: -1.9rem;\n    margin-bottom: -10px;\n    margin-right: 0;\n    top: -0.2rem;\n    width: 6px;\n  }\n}\n\n.trueachievement-extras-online-status.trueachievement-extras-forum-online-status {\n  height: 12px;\n  left: 2.5rem;\n  margin-bottom: -16px;\n  top: -3rem;\n  width: 12px;\n}\n\n@media only screen and (max-width: 768px) {\n  .trueachievement-extras-online-status.trueachievement-extras-forum-online-status {\n    height: 6px;\n    left: -2rem;\n    margin-bottom: 0;\n    margin-right: -10px;\n    top: 1.3rem;\n    width: 6px;\n  }\n}\n\n[data-theme=dark] .trueachievement-extras-online-status {\n  border: 2px solid #646464;\n}\nbody.trueachievement-extras .ta-x-settings-menu-sub-setting {\n  padding-left: 2rem;\n}\n\nbody.trueachievement-extras .ta-x-settings-menu .close i {\n  pointer-events: none;\n}\n/* stylelint-disable selector-id-pattern */\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements {\n  min-width: unset !important;\n  overflow: auto;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements main {\n  min-height: unset !important;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page {\n  position: unset;\n  display: flex;\n  flex-direction: column;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughPageVersions,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughPagePreview {\n  margin-left: 0;\n  position: unset;\n  width: unset;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divWalkthroughHolder {\n  position: unset;\n  margin-top: unset;\n  height: unset;\n  display: flex;\n  justify-content: space-between;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .buttons {\n  display: flex;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button {\n  display: block;\n  flex-grow: 1;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough {\n  margin: 0;\n  margin-bottom: 3px;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough:hover {\n  margin-bottom: 5px;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .clearboth {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughs,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughAchievements,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGames,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGamers,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughOtherSiteLink {\n  position: unset;\n  top: unset;\n  left: unset;\n  display: block;\n  margin: 0;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough {\n  flex: 1;\n  margin: 0 1.5rem;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #btnWalkthrough {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container {\n  display: flex;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions {\n  height: 100%;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history {\n  position: relative;\n  top: var(--ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history-top, 0);\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide {\n  transform: translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));\n  transition: transform 0.5s ease;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide-no-transition {\n  transform: translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview {\n  flex: 1;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPageVersions .content .buttons,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-team-button #chWalkthroughPageVersions .content .buttons {\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPageVersions .content .buttons .button,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-team-button #chWalkthroughPageVersions .content .buttons .button {\n  flex: 1;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPageVersions .content .buttons .button:not(:first-of-type),\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-team-button #chWalkthroughPageVersions .content .buttons .button:not(:first-of-type) {\n  margin-top: 5px;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPageVersions .content .buttons .clearboth,\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-team-button #chWalkthroughPageVersions .content .buttons .clearboth {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPagePreview .content .buttons {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-edit-page-left #chWalkthroughPagePreview .content .buttons .clearboth {\n  display: none;\n}\n\nbody.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n}\n\n/* stylelint-enable selector-id-pattern */\nbody.trueachievement-extras .ta-x-sticky-header {\n  position: fixed;\n  top: 0;\n  width: 100%;\n}\n");
});
exports.apply = apply;

},{"../constants":2,"../scripts/helpers/wait":10}]},{},[3]);
