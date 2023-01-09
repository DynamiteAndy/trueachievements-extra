// ==UserScript==
// @name          TrueAchievements Extra
// @namespace     dynamite-andy
// @version       2.3.1
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

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/ajax-interceptor@1.0.1/node_modules/ajax-interceptor/index.js":
/***/ ((__unused_webpack_module, exports) => {



var COMPLETED_READY_STATE = 4;

var RealXHRSend = XMLHttpRequest.prototype.send;

var requestCallbacks = [];
var responseCallbacks = [];


var wired = false;


function arrayRemove(array,item) {
    var index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    } else {
        throw new Error("Could not remove " + item + " from array");
    }
}


function fireCallbacks(callbacks,xhr) {
    for( var i = 0; i < callbacks.length; i++ ) {
        callbacks[i](xhr);
    }
}


exports.addRequestCallback = function(callback) {
    requestCallbacks.push(callback);
};
exports.removeRequestCallback = function(callback) {
    arrayRemove(requestCallbacks,callback);
};


exports.addResponseCallback = function(callback) {
    responseCallbacks.push(callback);
};
exports.removeResponseCallback = function(callback) {
    arrayRemove(responseCallbacks,callback);
};



function fireResponseCallbacksIfCompleted(xhr) {
    if( xhr.readyState === COMPLETED_READY_STATE ) {
        fireCallbacks(responseCallbacks,xhr);
    }
}

function proxifyOnReadyStateChange(xhr) {
    var realOnReadyStateChange = xhr.onreadystatechange;
    if ( realOnReadyStateChange ) {
        xhr.onreadystatechange = function() {
            fireResponseCallbacksIfCompleted(xhr);
            realOnReadyStateChange();
        };
    }
}


exports.isWired = function() {
    return wired;
}

exports.wire = function() {
    if ( wired ) throw new Error("Ajax interceptor already wired");

    // Override send method of all XHR requests
    XMLHttpRequest.prototype.send = function() {

        // Fire request callbacks before sending the request
        fireCallbacks(requestCallbacks,this);

        // Wire response callbacks
        if( this.addEventListener ) {
            var self = this;
            this.addEventListener("readystatechange", function() {
                fireResponseCallbacksIfCompleted(self);
            }, false);
        }
        else {
            proxifyOnReadyStateChange(this);
        }

        RealXHRSend.apply(this, arguments);
    };
    wired = true;
};


exports.unwire = function() {
    if ( !wired ) throw new Error("Ajax interceptor not currently wired");
    XMLHttpRequest.prototype.send = RealXHRSend;
    wired = false;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ./node_modules/.pnpm/ajax-interceptor@1.0.1/node_modules/ajax-interceptor/index.js
var ajax_interceptor = __webpack_require__("./node_modules/.pnpm/ajax-interceptor@1.0.1/node_modules/ajax-interceptor/index.js");
;// CONCATENATED MODULE: ./src/utilities/date-util.ts
const getDate = (date) => typeof (date) === 'string' ? new Date(date) : date;
const isValid = (date) => new Date(getDate(date)).toString().toLowerCase() !== 'invalid date';
const isBeforeNow = (date) => new Date() < getDate(date);

;// CONCATENATED MODULE: ./src/globals/cache.ts

class Cache {
    static get memoize() {
        const value = GM_getValue('trueachievements-extra-memoized', '');
        return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
    }
    static set memoize(value) {
        GM_setValue('trueachievements-extra-memoized', JSON.stringify(Array.from(value.entries())));
    }
    static forceClear() {
        GM_deleteValue('trueachievements-extra-memoized');
    }
    static clearExpired() {
        const updatedCache = Array.from(this.memoize.entries()).filter(item => isBeforeNow(item[1].expiryTime));
        this.memoize = new Map(updatedCache);
    }
}

;// CONCATENATED MODULE: ./src/globals/constants.ts
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
const classStylePrefix = 'ta-x';
const jsStylePrefix = 'js-ta-x';
const variableStylePrefix = '--ta-x';
const templatePrefix = 'ta-x-template';
class Constants {
}
Constants.Styles = (_a = class {
    },
    _a.root = 'trueachievement-extras',
    _a.Components = (_b = class {
        },
        _b.accordion = `${jsStylePrefix}-accordion`,
        _b.snackbar = `${jsStylePrefix}-snackbar`,
        _b.showSnackbar = `${classStylePrefix}-snackbar-show`,
        _b),
    _a.Animations = (_c = class {
        },
        _c.yShow = `${classStylePrefix}-y-show`,
        _c.yHide = `${classStylePrefix}-y-hide`,
        _c.yHideNoTransition = `${_c.yHide}-no-transition`,
        _c),
    _a.Base = (_d = class {
        },
        _d.hide = `${classStylePrefix}-hide`,
        _d),
    _a.SettingsMenu = (_e = class {
        },
        _e.featureJs = `${jsStylePrefix}-settings-menu`,
        _e.featureStyle = `${classStylePrefix}-settings-menu`,
        _e.subSetting = `${_e.featureStyle}-sub-setting`,
        _e.wrenchJs = `${_e.featureJs}-wrench`,
        _e.closeJs = `${_e.featureJs}-close`,
        _e.versionLink = `${_e.featureJs}-version`,
        _e.changelogView = `${_e.featureJs}-changelog`,
        _e.settingsView = `${_e.featureJs}-settings`,
        _e.settingsContentShow = `${_e.featureStyle}-settings-item-show`,
        _e),
    _a.StickyHeader = (_f = class {
        },
        _f.featureJs = `${jsStylePrefix}-sticky-header`,
        _f.featureStyle = `${classStylePrefix}-sticky-header`,
        _f),
    _a.StaffWalkthroughImprovements = (_g = class {
        },
        _g.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements`,
        _g.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements`,
        _g.WalkthroughPage = (_h = class {
            },
            _h.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-walkthrough-page`,
            _h.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-walkthrough-page`,
            _h.containerJs = `${_h.featureJs}-container`,
            _h.containerStyle = `${_h.featureStyle}-container`,
            _h.stickyPageHistoryJs = `${_h.featureJs}-sticky-page-history`,
            _h.stickyPageHistoryStyle = `${_h.featureStyle}-sticky-page-history`,
            _h.moveButtonsToLeftStyle = `${_h.featureStyle}-move-buttons-to-left`,
            _h.walkthroughTeamButtonJs = `${_h.featureJs}-walkthrough-team-button`,
            _h),
        _g.ManageWalkthroughPage = (_j = class {
            },
            _j.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`,
            _j.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`,
            _j.containerJs = `${_j.featureJs}-container`,
            _j.containerStyle = `${_j.featureStyle}-container`,
            _j.clickableAchievementsJs = `${_j.featureJs}-clickable-achievements`,
            _j),
        _g.EditWalkthroughPage = (_k = class {
            },
            _k.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`,
            _k.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`,
            _k.containerJs = `${_k.featureJs}-container`,
            _k.containerStyle = `${_k.featureStyle}-container`,
            _k.improvedImageSelectorJs = `${_k.featureJs}-improved-image-selector`,
            _k.improvedImageSelectorStyle = `${_k.featureStyle}-improved-image-selector`,
            _k.improvedImageSelectorContainerJs = `${_k.improvedImageSelectorJs}-container`,
            _k.improvedImageSelectorContainerStyle = `${_k.improvedImageSelectorStyle}-container`,
            _k.improvedImageSelectorImageTitleJs = `${_k.improvedImageSelectorJs}-image-title`,
            _k.improvedImageSelectorImageTitleStyle = `${_k.improvedImageSelectorStyle}-image-title`,
            _k.themeToggleJs = `${_k.featureJs}-theme-toggle`,
            _k.themeToggleStyle = `${_k.featureStyle}-theme-toggle`,
            _k.themeToggleDarkStyle = `${_k.themeToggleStyle}-dark`,
            _k.themeToggleLightStyle = `${_k.themeToggleStyle}-light`,
            _k.stickyTinymceToolbarJs = `${_k.featureJs}-sticky-tinymce-toolbar`,
            _k.stickyTinymceToolbarStyles = `${_k.featureStyle}-sticky-tinymce-toolbar`,
            _k),
        _g),
    _a.Variables = (_l = class {
        },
        _l.StickyHeader = (_m = class {
            },
            _m.featureVariableStylePrefix = `${variableStylePrefix}-sticky-header`,
            _m.height = `${_m.featureVariableStylePrefix}-height`,
            _m),
        _l.StaffWalkthroughImprovements = (_o = class {
            },
            _o.WalkthroughPage = (_p = class {
                },
                _p.featureVariableStylePrefix = `${variableStylePrefix}-staff-walkthrough-improvements-walkthrough-page`,
                _p.stickyPageHistoryTop = `${_p.featureVariableStylePrefix}-sticky-page-history-top`,
                _p),
            _o.EditWalkthroughPage = (_q = class {
                },
                _q.featureVariableStylePrefix = `${variableStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`,
                _q.stickyTinymceToolbarWidth = `${_q.featureVariableStylePrefix}-sticky-tinymce-toolbar-width`,
                _q.stickyTinymceToolbarTop = `${_q.featureVariableStylePrefix}-sticky-tinymce-toolbar-top`,
                _q.stickyTinymceToolbarFloatingMenu = `${_q.featureVariableStylePrefix}-sticky-tinymce-toolbar-floating-menu`,
                _q),
            _o),
        _l),
    _a);
Constants.Templates = (_r = class {
    },
    _r.StaffWalkthroughImprovements = (_s = class {
        },
        _s.ManageWalkthroughPage = (_t = class {
            },
            _t.featureTemplatePrefix = `${templatePrefix}-manage-walkthrough`,
            _t.achievementRow = `${_t.featureTemplatePrefix}-achievement-row`,
            _t),
        _s),
    _r);

;// CONCATENATED MODULE: ./src/globals/config.ts
const migrateGet = (oldSetting, newSetting, defaultValue) => {
    const newValue = GM_getValue(newSetting);
    if (newValue !== undefined)
        return newValue;
    const oldValue = GM_getValue(oldSetting, defaultValue);
    GM_setValue(newSetting, oldValue);
    GM_deleteValue(oldSetting);
    return oldValue;
};
const stickyHeader = {
    get enabled() { return migrateGet('trueachievements-extra-stickyHeader-enabled', 'stickyHeader-enabled', false); },
    set enabled(value) { GM_setValue('stickyHeader-enabled', value); }
};
const editWalkthrough = {
    get improvedImageSelector() { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-improvedImageSelector', 'improvedImageSelector', false); },
    set improvedImageSelector(value) { GM_setValue('improvedImageSelector', value); },
    get autoSaveNotification() { return GM_getValue('autoSaveNotification', false); },
    set autoSaveNotification(value) { GM_setValue('autoSaveNotification', value); },
    get tinymceTheme() { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-tinymceTheme', 'tinymceTheme', null); },
    set tinymceTheme(value) { GM_setValue('tinymceTheme', value); }
};
const manageWalkthrough = {
    get manageWalkthroughDefaultStatus() { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatus', 'manageWalkthroughDefaultStatus', false); },
    set manageWalkthroughDefaultStatus(value) { GM_setValue('manageWalkthroughDefaultStatus', value); },
    get clickableTableLinks() { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-clickableTableLinks', 'clickableTableLinks', false); },
    set clickableTableLinks(value) { GM_setValue('clickableTableLinks', value); },
    get autoSelectFirst() { return GM_getValue('autoSelectFirst', false); },
    set autoSelectFirst(value) { GM_setValue('autoSelectFirst', value); },
    get manageWalkthroughDefaultStatusValue() { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatusValue', 'manageWalkthroughDefaultStatusValue', '-1'); },
    set manageWalkthroughDefaultStatusValue(value) { GM_setValue('manageWalkthroughDefaultStatusValue', value); }
};
const walkthroughPage = {
    get stickyPageHistory() { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory', 'stickyPageHistory', false); },
    set stickyPageHistory(value) { GM_setValue('stickyPageHistory', value); },
    get moveButtonsToLeft() { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-editPageLeft', 'moveButtonsToLeft', false); },
    set moveButtonsToLeft(value) { GM_setValue('moveButtonsToLeft', value); },
    get walkthroughTeamButton() { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton', 'walkthroughTeamButton', false); },
    set walkthroughTeamButton(value) { GM_setValue('walkthroughTeamButton', value); },
    get highlightPageLocked() { return GM_getValue('highlightPageLocked', false); },
    set highlightPageLocked(value) { GM_setValue('highlightPageLocked', value); }
};
const staffWalkthroughImprovements = {
    get enabled() { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-enabled', 'staffWalkthroughImprovements-enabled', false); },
    set enabled(value) { GM_setValue('staffWalkthroughImprovements-enabled', value); },
    editWalkthrough,
    manageWalkthrough,
    walkthroughPage
};
const config = {
    stickyHeader,
    staffWalkthroughImprovements
};

;// CONCATENATED MODULE: ./src/globals/regex.ts
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
const achievementUrl = new RegExp('^/a[0-9]*/.*', 'i');
const achievementUrlWithGamerId = new RegExp('^/a[0-9]*/.*', 'i');
const achievementsUrl = new RegExp('^/game/.*/achievements$', 'i');
const editWalkthroughUrl = new RegExp('^/staff/walkthrough/editwalkthroughpage.aspx', 'i');
const manageWalkthroughUrl = new RegExp('^/staff/walkthrough/managewalkthrough.aspx', 'i');
const manageWalkthroughUrlWithWalkthroughId = new RegExp('^/staff/walkthrough/managewalkthrough.aspx\\?walkthroughid=[0-9]*', 'i');
const walkthroughPageUrl = new RegExp('^/staff/walkthrough/walkthroughpage.aspx', 'i');
const walkthroughPreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpreview.aspx', 'i');
const walkthroughPagePreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx', 'i');
const autosave = new RegExp('^/ajaxfunctions.aspx/AutoSave', 'i');
const AchievementsRegex = {
    achievementUrl,
    achievementUrlWithGamerId,
    Test: {
        achievementUrl: (str = window.location.href) => achievementUrl.test(getUrlProperties(str, 'pathname')),
        achievementUrlWithGamerId: (str = window.location.href) => achievementUrlWithGamerId.test(getUrlProperties(str, ['pathname', 'search']))
    }
};
const GamesRegex = {
    achievementsUrl,
    Test: {
        achievementsUrl: (str = window.location.href) => achievementsUrl.test(getUrlProperties(str, 'pathname'))
    }
};
const AjaxRegex = {
    autosave,
    Test: {
        autosave: (str = window.location.href) => autosave.test(getUrlProperties(str, 'pathname'))
    }
};
const StaffRegex = {
    Walkthroughs: {
        editWalkthroughUrl,
        manageWalkthroughUrl,
        manageWalkthroughUrlWithWalkthroughId,
        walkthroughPageUrl,
        walkthroughPreviewUrl,
        walkthroughPagePreviewUrl,
        Test: {
            all: (str = window.location.href) => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')) ||
                manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')) || manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname', 'search'])) ||
                walkthroughPageUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) ||
                walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
            preview: (str = window.location.href) => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
            editWalkthroughUrl: (str = window.location.href) => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
            manageWalkthroughUrl: (str = window.location.href) => manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
            manageWalkthroughUrlWithWalkthroughId: (str = window.location.href) => manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname', 'search'])),
            walkthroughPageUrl: (str = window.location.href) => walkthroughPageUrl.test(getUrlProperties(str, 'pathname')),
            walkthroughPreviewUrl: (str = window.location.href) => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')),
            walkthroughPagePreviewUrl: (str = window.location.href) => walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname'))
        }
    }
};
const DatesRegex = {
    today: new RegExp('Today', 'i'),
    yesterday: new RegExp('Yesterday', 'i')
};
/* harmony default export */ const regex = ({
    AchievementsRegex,
    GamesRegex,
    StaffRegex,
    DatesRegex
});

;// CONCATENATED MODULE: ./src/globals/index.ts





;// CONCATENATED MODULE: ./src/utilities/array-util.ts
const getDuplicates = (arr, unique = false) => (unique
    ? [...new Set(arr.filter((e, i, a) => a.indexOf(e) !== i))]
    : arr.filter((e, i, a) => a.indexOf(e) !== i));

;// CONCATENATED MODULE: ./src/utilities/html-element-util.ts
const isSelectElement = (el) => el.nodeName === 'SELECT';
const isCheckboxElement = (el) => el.nodeName === 'INPUT' && el.type === 'checkbox';
const classListContains = (element, classes) => {
    const classArray = Array.isArray(classes) ? classes : [classes];
    for (let i = 0; i < classArray.length; i++) {
        if (element.classList.contains(classArray[i])) {
            return true;
        }
    }
    return false;
};
const waitForElement = (selector, element = document.documentElement, timeoutMS = 10000) => new Promise(resolve => {
    if (element === null)
        return null;
    if (element === document.documentElement) {
        element = document.documentElement;
    }
    if (element.querySelector(selector)) {
        return resolve(element.querySelector(selector));
    }
    let observer;
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
    observer.observe(element, {
        childList: true,
        subtree: true
    });
});
const getElementCoordinates = (element) => {
    const box = element.getBoundingClientRect();
    const body = document.body;
    const docEl = document.documentElement;
    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    const clientTop = docEl.clientTop || body.clientTop || 0;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;
    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;
    return { top: Math.round(top), left: Math.round(left) };
};

;// CONCATENATED MODULE: ./src/utilities/promise-util.ts
const promisify = (fn) => () => new Promise((resolve) => fn((callbackArgs) => resolve(callbackArgs)));
const allConcurrently = async (name, arr, max = 3) => {
    if (arr.length === 0)
        return Promise.resolve([]);
    let index = 0;
    const results = [];
    const execThread = async () => {
        while (index < arr.length) {
            const curIndex = index++;
            const task = arr[curIndex].task.constructor.name === 'Function'
                ? promisify(arr[curIndex].task)
                : arr[curIndex].task;
            results[curIndex] = await task();
        }
    };
    const threads = [];
    for (let thread = 0; thread < max; thread++) {
        threads.push(execThread());
    }
    await Promise.all(threads);
    return results;
};

;// CONCATENATED MODULE: ./src/utilities/string-util.ts


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
const toDate = (value) => {
    if (DatesRegex.today.test(value)) {
        return today;
    }
    if (DatesRegex.yesterday.test(value)) {
        return yesterday;
    }
    return isValid(value) ? new Date(value) : null;
};
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
const extractBetween = (between, str) => {
    const regex = new RegExp(`${between}(.*?)${between}`);
    const matches = str.match(regex);
    return matches
        ? matches[1]
        : str;
};
const extractAllBetween = (between, str) => {
    const regex = new RegExp(`${between}(.*?)${between}`, 'g');
    const matches = str.match(regex);
    return matches
        ? matches.map(str => str.replace(between, ''))
        : [str];
};
/* harmony default export */ const string_util = ({
    toInt,
    toDate,
    toBool,
    extractBetween,
    extractAllBetween
});

;// CONCATENATED MODULE: ./src/utilities/object-util.ts
const getValue = (object, path, defaultValue) => path
    .split('.')
    .reduce((o, p) => o ? o[p] : defaultValue, object);
const setValue = (object, path, value) => path
    .split('.')
    .reduce((o, p, i) => o[p] = path.split('.').length === ++i ? value : o[p] || {}, object);

;// CONCATENATED MODULE: ./src/utilities/index.ts







;// CONCATENATED MODULE: ./src/components/events.ts
const eventList = {};
const listenerQueue = new Map();
const getSymbol = (value) => ((typeof value === 'string') ? Symbol.for(value) : value);
const contextExists = (event, context) => (eventList[event] && eventList[event].has(context));
const unsubscribeByIdentifier = (event, context, identifier) => {
    const id = getSymbol(identifier);
    if (!listenerQueue.get(id))
        return;
    const listeners = eventList[event].get(context);
    if (!listeners.includes(id))
        return;
    listenerQueue.delete(id);
    listeners.splice(listeners.indexOf(id), 1);
    if (listeners.length)
        eventList[event].set(context, listeners);
    else
        eventList[event].delete(context);
    if (!eventList[event].size)
        delete eventList[event];
};
const unsubscribeByListener = (event, context, fn) => {
    listenerQueue.forEach((listener, identifier) => {
        if (listener === fn)
            unsubscribeByIdentifier(event, context, identifier);
    });
};
const unsubscribeAllListeners = (event, context) => {
    const listeners = eventList[event].get(context);
    for (const listener of listeners)
        listenerQueue.delete(listener);
    eventList[event].delete(context);
    if (!eventList[event].size)
        delete eventList[event];
};
const broadcast = (event, context = 'global', data) => {
    if (!contextExists(event, context))
        return;
    const listeners = eventList[event].get(context);
    if (typeof data !== 'undefined')
        for (const listener of listeners)
            listenerQueue.get(listener).call(null, data);
    else
        for (const listener of listeners)
            listenerQueue.get(listener)();
};
const subscribe = (event, listener, identifier, context = 'global', binding = null) => {
    const listenerId = identifier ? getSymbol(identifier) : Symbol();
    if (listenerQueue.has(listenerId))
        throw new Error("You can't override an existing listener identifier. You must unsubscribe it first");
    if (!eventList[event])
        eventList[event] = new Map();
    if (!eventList[event].has(context))
        eventList[event].set(context, []);
    const listeners = eventList[event].get(context);
    listeners.push(listenerId);
    eventList[event].set(context, listeners);
    listenerQueue.set(listenerId, binding ? listener.bind(binding) : listener);
    return listenerId;
};
const unsubcribe = (event, listener, context = 'global') => {
    if (!contextExists(event, context))
        return;
    if (!listener)
        unsubscribeAllListeners(event, context);
    else if (typeof listener === 'function')
        unsubscribeByListener(event, context, listener);
    else
        unsubscribeByIdentifier(event, context, listener);
};

;// CONCATENATED MODULE: ./src/components/accordion.ts


const accordion = () => {
    document.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        if (!target.classList.contains(Constants.Styles.Components.accordion))
            return;
        target.classList.toggle('expanded');
        const content = target.nextElementSibling;
        content.style.maxHeight
            ? content.style.maxHeight = null
            : content.style.maxHeight = `${content.scrollHeight}px`;
    });
    subscribe('accordion:setMaxHeight', (content) => {
        if (!content.style.maxHeight)
            return;
        content.style.maxHeight = `${content.scrollHeight}px`;
    });
};
/* harmony default export */ const components_accordion = ((/* unused pure expression or super */ null && (accordion)));

;// CONCATENATED MODULE: ./src/views/components/snackbar.html
// Module
var code = "<div class=\"ta-x-snackbar js-ta-x-snackbar\"><h2></h2></div>";
// Exports
/* harmony default export */ const components_snackbar = (code);
;// CONCATENATED MODULE: ./src/components/snackbar.ts




const snackbar = async () => {
    if (!await waitForElement('body'))
        return;
    const parsedDocument = new DOMParser().parseFromString(components_snackbar, 'text/html');
    document.body.appendChild(parsedDocument.querySelector(`.${Constants.Styles.Components.snackbar}`));
    const snackbar = document.querySelector(`.${Constants.Styles.Components.snackbar}`);
    const textContainer = snackbar.querySelector('h2');
    subscribe('snackbar:show', ({ text, type }) => {
        if (!snackbar)
            return;
        textContainer.innerText = text;
        textContainer.classList.add(type);
        snackbar.classList.toggle(Constants.Styles.Components.showSnackbar);
        setTimeout(() => {
            snackbar.classList.toggle(Constants.Styles.Components.showSnackbar);
            textContainer.classList.remove(type);
        }, 3000);
    });
};
/* harmony default export */ const src_components_snackbar = ((/* unused pure expression or super */ null && (snackbar)));

;// CONCATENATED MODULE: ./src/components/index.ts




;// CONCATENATED MODULE: ./src/models/conditional-render.ts

class ConditionalRender {
    constructor(json) {
        this.fromString(json);
    }
    fromString(json) {
        try {
            const parsedObj = JSON.parse(json);
            this.selector = parsedObj.selector;
            this.value = toBool(parsedObj.value);
        }
        catch (e) {
        }
    }
    isValid() {
        return this.selector != null && this.value != null;
    }
    toString() {
        return JSON.stringify(this);
    }
}

;// CONCATENATED MODULE: ./src/models/index.ts



;// CONCATENATED MODULE: ./src/models/memoized-fetch.ts
class MemoizedFetch {
    constructor(opts) {
        opts = opts ? opts : { deleteAfter: { value: 7, period: 'days' } };
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
        }
    }
    toString() {
        return JSON.stringify(this);
    }
}

;// CONCATENATED MODULE: ./src/helpers/fetch.ts
/* harmony default export */ const helpers_fetch = (async (url, options = {}) => {
    options.headers = options.headers || new Headers();
    options.method = (options.method) ? options.method.toUpperCase() : 'GET';
    const response = await fetch(url, options);
    return response;
});

;// CONCATENATED MODULE: ./src/helpers/memoize-fetch.ts




const cachedCalls = Cache.memoize;
const memoizeFetch = async (url, fetchOpts = {}, memoizeOptions) => {
    const cachedRequest = cachedCalls.get(url);
    if (cachedRequest && isBeforeNow(new Date(cachedRequest.expiryTime))) {
        return cachedRequest.response;
    }
    const response = await helpers_fetch(url, fetchOpts);
    const body = await response.text();
    cachedCalls.set(url, new MemoizedFetch(memoizeOptions).setResponse(body));
    Cache.memoize = cachedCalls;
    return body;
};

;// CONCATENATED MODULE: ./src/helpers/template.ts
const wrapper = document.createElement('template');
const template = (el, opts = {}) => {
    const { image, element } = opts;
    wrapper.appendChild(el);
    wrapper.innerHTML = el.outerHTML
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/{GM_info.script.version}/g, GM_info.script.version || '')
        .replace(/{image.title}/g, image?.title || '')
        .replace(/{element.outerHTML}/g, element?.outerHTML || '');
    const newElement = wrapper.content.firstChild;
    wrapper.innerHTML = '';
    return newElement;
};

;// CONCATENATED MODULE: ./src/helpers/sticky.ts


const stickyNavBarEnabled = stickyHeader.enabled;
let stickyNavBarElement;
const setStickyNavElement = async () => {
    if (stickyNavBarElement)
        return;
    stickyNavBarElement = stickyNavBarEnabled
        ? await waitForElement(`.${Constants.Styles.StickyHeader.featureJs}`)
        : await waitForElement('.header');
};
const applyStickyElementStyle = async (variableProperty, stickyElement, containerElement, opts = {}) => {
    await setStickyNavElement();
    let addAnimation;
    let removeAnimation = [Constants.Styles.Animations.yShow, Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition];
    let topStylePx = opts.paddingFromTop || 0;
    const containerTop = containerElement.getBoundingClientRect().top;
    if (containerTop > 0) {
        topStylePx = 0;
    }
    else {
        topStylePx += opts.isRelativeToParent ? 0 : Math.abs(containerTop);
        if (stickyNavBarEnabled) {
            topStylePx += stickyNavBarElement.offsetHeight;
            if (!stickyNavBarElement.classList.contains(Constants.Styles.Animations.yShow)) {
                addAnimation = opts.noTransitionStyle ? Constants.Styles.Animations.yHideNoTransition : Constants.Styles.Animations.yHide;
                removeAnimation = [Constants.Styles.Animations.yShow];
            }
            else {
                addAnimation = Constants.Styles.Animations.yShow;
                removeAnimation = [Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition];
            }
        }
    }
    document.documentElement.style.setProperty(variableProperty, `${topStylePx}px`);
    stickyElement.classList.remove(...removeAnimation);
    if (addAnimation)
        stickyElement.classList.add(addAnimation);
};
/* harmony default export */ const sticky = ({ applyStickyElementStyle });

;// CONCATENATED MODULE: ./src/helpers/index.ts






;// CONCATENATED MODULE: ./src/features/settings-menu/body.hbs
// Module
var body_code = "<div class=\"js-ta-x-settings-menu-wrench gamer-page\" aria-haspopup=\"true\">\r\n    <i class=\"fa fa-wrench\"></i>\r\n</div>\r\n\r\n<div class=\"js-ta-x-settings-menu ta-x-settings-menu ta-x-hide\">\r\n    <div class=\"middle\">\r\n        <div class=\"wrap\">\r\n            <div class=\"labels\">\r\n                <label class=\"js-ta-x-settings-menu-close close\">\r\n                    <i class=\"fa fa-close\"></i>\r\n                </label>\r\n            </div>\r\n            <div class=\"contents\">\r\n                <div class=\"contents open ta-x-settings-menu-settings\">\r\n                    <div class=\"t-settings js-ta-x-settings-menu-settings ta-x-settings-menu-settings-item ta-x-settings-menu-settings-item-show\" >\r\n                        <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Sticky Header</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStickyHeader\" name=\"chkStickyHeader\" data-config-path=\"stickyHeader.enabled\" checked=\"\">\n\n        <label for=\"chkStickyHeader\">\n        </label>\n    </div>\n        <div class=\"ta-x-flex-break\"></div>\n        <p data-render-condition=\"{ &quot;selector&quot;: &quot;#chkStickyHeader&quot;, &quot;value&quot;: &quot;true&quot; }\" class=\"ta-x-checkbox-help-text ta-x-hide\">This feature may cause some sticky elements to look buggy. Let me know what you spot!</p>\n</div>\r\n\r\n                        <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Staff Walkthrough Improvements</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovements\" name=\"chkStaffWalkthroughImprovements\" data-config-path=\"staffWalkthroughImprovements.enabled\" checked=\"\">\n\n        <label for=\"chkStaffWalkthroughImprovements\">\n        </label>\n    </div>\n</div>\n\n<div class=\"ta-x-settings-menu-settings-accordion\" data-render-condition=\"{ &quot;selector&quot;: &quot;#chkStaffWalkthroughImprovements&quot;, &quot;value&quot;: &quot;true&quot; }\">\n    <div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\">\n    <span>Walkthrough Page</span>\n    <svg class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\n        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\n        <path fill=\"currentColor\" d=\"M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z\"></path>\n    </svg>\n</div>\n\n    <div class=\"ta-x-settings-menu-settings-accordion-body t-settings\">\n        <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Stick Page History To Left</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsStickyPageHistory\" name=\"chkStaffWalkthroughImprovementsStickyPageHistory\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.stickyPageHistory\" checked=\"\">\n\n        <label for=\"chkStaffWalkthroughImprovementsStickyPageHistory\">\n        </label>\n    </div>\n</div>\n\n        <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Move Buttons To The Left</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\" name=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.moveButtonsToLeft\" checked=\"\">\n\n        <label for=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\">\n        </label>\n    </div>\n</div>\n\n        <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Add Walkthrough Team Button</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\" name=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.walkthroughTeamButton\" checked=\"\">\n\n        <label for=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\">\n        </label>\n    </div>\n</div>\n\n        <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Highlight Page Locked</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsHighlightPageLocked\" name=\"chkStaffWalkthroughImprovementsHighlightPageLocked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.highlightPageLocked\" checked=\"\">\n\n        <label for=\"chkStaffWalkthroughImprovementsHighlightPageLocked\">\n        </label>\n    </div>\n</div>\n    </div>\n</div>\n\n<div class=\"ta-x-settings-menu-settings-accordion\" data-render-condition=\"{ &quot;selector&quot;: &quot;#chkStaffWalkthroughImprovements&quot;, &quot;value&quot;: &quot;true&quot; }\">\n    <div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\">\n    <span>Edit Walkthrough</span>\n    <svg class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\n        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\n        <path fill=\"currentColor\" d=\"M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z\"></path>\n    </svg>\n</div>\n\n    <div class=\"ta-x-settings-menu-settings-accordion-body t-settings\">\n        <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Improved Image Selector</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsImproveImageSelector\" name=\"chkStaffWalkthroughImprovementsImproveImageSelector\" data-config-path=\"staffWalkthroughImprovements.editWalkthrough.improvedImageSelector\" checked=\"\">\n\n        <label for=\"chkStaffWalkthroughImprovementsImproveImageSelector\">\n        </label>\n    </div>\n</div>\n\n        <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Auto Save Notifications</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsAutoSaveNotification\" name=\"chkStaffWalkthroughImprovementsAutoSaveNotification\" data-config-path=\"staffWalkthroughImprovements.editWalkthrough.autoSaveNotification\" checked=\"\">\n\n        <label for=\"chkStaffWalkthroughImprovementsAutoSaveNotification\">\n        </label>\n    </div>\n</div>\n    </div>\n</div>\n\n<div class=\"ta-x-settings-menu-settings-accordion\" data-render-condition=\"{ &quot;selector&quot;: &quot;#chkStaffWalkthroughImprovements&quot;, &quot;value&quot;: &quot;true&quot; }\">\n    <div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\">\n    <span>Manage Walkthrough</span>\n    <svg class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\n        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\n        <path fill=\"currentColor\" d=\"M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z\"></path>\n    </svg>\n</div>\n\n    <div class=\"ta-x-settings-menu-settings-accordion-body t-settings\">\n        <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Clickable Table Links</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsClickableTableLinks\" name=\"chkStaffWalkthroughImprovementsClickableTableLinks\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.clickableTableLinks\" checked=\"\">\n\n        <label for=\"chkStaffWalkthroughImprovementsClickableTableLinks\">\n        </label>\n    </div>\n</div>\n\n        <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Auto Select First Walkthrough</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsAutoSelectFirst\" name=\"chkStaffWalkthroughImprovementsAutoSelectFirst\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.autoSelectFirst\" checked=\"\">\n\n        <label for=\"chkStaffWalkthroughImprovementsAutoSelectFirst\">\n        </label>\n    </div>\n        <div class=\"ta-x-flex-break\"></div>\n        <p data-render-condition=\"{ &quot;selector&quot;: &quot;#chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus&quot;, &quot;value&quot;: &quot;true&quot; }\" class=\"ta-x-checkbox-help-text ta-x-hide\">This feature runs after the default status has been set.</p>\n</div>\n\n        <div class=\"ta-x-settings-menu-columned-setting\">\n            <div data-render-condition=\"\" class=\"ta-x-checkbox \">\n    <label>Default Status for Manage Walkthrough</label>\n    <div class=\"frm-grp frm-tgl\">\n        <input type=\"checkbox\" id=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\" name=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.manageWalkthroughDefaultStatus\" checked=\"\">\n\n        <label for=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\">\n        </label>\n    </div>\n</div>\n\n            \n\n<div data-render-condition=\"{ &quot;selector&quot;: &quot;#chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus&quot;, &quot;value&quot;: &quot;true&quot; }\" class=\"frm-grp frm-sel ta-x-hide\">\n    \n    <select id=\"selStaffWalkthroughImprovementsManageWalkthroughDefaultStatusValue\" name=\"selStaffWalkthroughImprovementsManageWalkthroughDefaultStatusValue\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.manageWalkthroughDefaultStatusValue\" class=\"dropdown\">\n            <option value=\"-1\" selected=\"true\">(All)</option>\n            <option value=\"New\" selected=\"\">New</option>\n            <option value=\"In progress\" selected=\"\">In progress</option>\n            <option value=\"Ready for review\" selected=\"\">Ready for review</option>\n            <option value=\"Ready for publish\" selected=\"\">Ready for publish</option>\n            <option value=\"Published\" selected=\"\">Published</option>\n            <option value=\"New owner required\" selected=\"\">New owner required</option>\n    </select>\n</div>\n        </div>\n    </div>\n</div>\r\n\r\n                        <!-- <div>\r\n                            <label>Show recent winners</label>\r\n                            <div class=\"frm-grp frm-tgl\">\r\n                                <input type=\"checkbox\" id=\"chkRecentWinners\" name=\"chkRecentWinners\"\r\n                                    data-config-area=\"recentWinners\" data-config-setting=\"enabled\" checked=\"\">\r\n                                <label for=\"chkRecentWinners\"> </label>\r\n                            </div>\r\n                        </div>\r\n                        <div data-render-condition='{ \"selector\": \"#chkRecentWinners\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                            <label class=\"ta-x-settings-menu-sub-setting\">Online unlocks only</label>\r\n                            <div class=\"frm-grp frm-tgl\">\r\n                                <input type=\"checkbox\" id=\"chkRecentWinnersOnlineUnlocksOnly\" name=\"chkRecentWinnersOnlineUnlocksOnly\"\r\n                                    data-config-area=\"recentWinners\" data-config-setting=\"onlineUnlocksOnly\" checked=\"\">\r\n                                <label for=\"chkRecentWinnersOnlineUnlocksOnly\"> </label>\r\n                            </div>\r\n                        </div>\r\n                        <div data-render-condition='{ \"selector\": \"#chkRecentWinners\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                            <label class=\"ta-x-settings-menu-sub-setting\">Base game only</label>\r\n                            <div class=\"frm-grp frm-tgl\">\r\n                                <input type=\"checkbox\" id=\"chkRecentWinnersBaseGameOnly\" name=\"chkRecentWinnersBaseGameOnly\"\r\n                                    data-config-area=\"recentWinners\" data-config-setting=\"baseGameOnly\" checked=\"\">\r\n                                <label for=\"chkRecentWinnersBaseGameOnly\"> </label>\r\n                            </div>\r\n                        </div> -->\r\n                    </div>\r\n                    <div class=\"t-settings js-ta-x-settings-menu-changelog ta-x-settings-menu-settings-item\" >\r\n                        <div class=\"ta-x-settings-menu-changelog-wrapper\">\n<h2>2.3.1</h2>\n<ul>\n<li><span class=\"ta-x-changelog-marker\">&gt;</span><p>Fix the janky timymce editor if sticky header was enabled,</p></li>\n<li><span class=\"ta-x-changelog-marker\">&gt;</span><p>Fix clickable table links not working if there was no achievements in the table,</p></li>\n<li><span class=\"ta-x-changelog-marker\">&gt;</span><p>Fix the code button on the tinymce editor looking weird,</p></li>\n<li><span class=\"ta-x-changelog-marker\">&gt;</span><p>Fix the floating menus on the tinymce editor being janky</p></li>\n</ul>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<a class=\"ta-x-settings-menu-changelog-link\" href=\"https://github.com/andrewcartwright1/trueachievements-extra/blob/main/CHANGELOG.md\">See the full changelog here</a></div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"t-settings open ta-x-settings-menu-bottom\">\r\n                    <ul class=\"list-links buttons\">\r\n                        <li><a href=\"https://github.com/andrewcartwright1/trueachievements-extra/issues/new\">Raise a Bug</a></li>\r\n                        <li><a href=\"https://github.com/andrewcartwright1/trueachievements-extra/issues/new\">Request a Feature</a></li>\r\n                    </ul>\r\n                    <div class=\"title\">\r\n                        <span>TrueAchievements Extra</span>\r\n                        </br>\r\n                        <a href=\"#\" class=\"js-ta-x-settings-menu-version\">Version {GM_info.script.version}</a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"js-ta-x-settings-menu-close close\"></div>\r\n</div>\r\n\r\n                    <!-- <div>\r\n                        <label>Show recent winners</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkRecentWinners\" name=\"chkRecentWinners\"\r\n                                data-config-area=\"recentWinners\" data-config-setting=\"enabled\" checked=\"\">\r\n                            <label for=\"chkRecentWinners\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkRecentWinners\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Online unlocks only</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkRecentWinnersOnlineUnlocksOnly\" name=\"chkRecentWinnersOnlineUnlocksOnly\"\r\n                                data-config-area=\"recentWinners\" data-config-setting=\"onlineUnlocksOnly\" checked=\"\">\r\n                            <label for=\"chkRecentWinnersOnlineUnlocksOnly\"> </label>\r\n                        </div>\r\n                    </div>\r\n                    <div data-render-condition='{ \"selector\": \"#chkRecentWinners\", \"value\": \"true\" }' class=\"ta-x-hide\">\r\n                        <label class=\"ta-x-settings-menu-sub-setting\">Base game only</label>\r\n                        <div class=\"frm-grp frm-tgl\">\r\n                            <input type=\"checkbox\" id=\"chkRecentWinnersBaseGameOnly\" name=\"chkRecentWinnersBaseGameOnly\"\r\n                                data-config-area=\"recentWinners\" data-config-setting=\"baseGameOnly\" checked=\"\">\r\n                            <label for=\"chkRecentWinnersBaseGameOnly\"> </label>\r\n                        </div>\r\n                    </div> -->";
// Exports
/* harmony default export */ const body = (body_code);
;// CONCATENATED MODULE: ./src/features/settings-menu/index.ts






let extensionBody;
const applyBody = async () => {
    const parsedDocument = new DOMParser().parseFromString(body, 'text/html');
    const navigationBar = await waitForElement('header nav');
    const navGamerToggle = await waitForElement('[data-tgl="nav-gamer"]', navigationBar);
    navigationBar.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`), navGamerToggle.nextSibling);
    const navGamer = await waitForElement('.nav-gamer');
    const templatedFeature = template(parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`));
    navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);
    addSettings();
};
const addSettings = () => {
    extensionBody = document.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`);
    [...extensionBody.querySelectorAll('input, select')].forEach(setting => {
        const configPath = setting.getAttribute('data-config-path');
        if (!configPath)
            return;
        if (isCheckboxElement(setting))
            setting.checked = getValue(config, configPath, false);
        else if (isSelectElement(setting))
            setting.value = getValue(config, configPath, '');
    });
    checkRenderConditions();
};
const checkRenderConditions = (el) => {
    const querySelector = el ? `[data-render-condition*="#${el.id}"]` : '[data-render-condition]';
    [...extensionBody.querySelectorAll(querySelector)].forEach(hiddenSetting => {
        const condition = new ConditionalRender(hiddenSetting.getAttribute('data-render-condition'));
        if (!condition.isValid())
            return;
        const settingInput = (el ? el : extensionBody.querySelector(condition.selector));
        if (isCheckboxElement(settingInput)) {
            const method = settingInput.checked === condition.value ? 'remove' : 'add';
            hiddenSetting.classList[method](Constants.Styles.Base.hide);
        }
    });
};
const listen = () => {
    const extensionTrigger = document.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`);
    extensionTrigger.addEventListener('click', () => {
        extensionTrigger.classList.add('active');
        extensionBody.classList.add('nav-gamer');
        extensionBody.classList.remove(Constants.Styles.Base.hide);
        extensionBody.classList.add('open');
    });
    extensionBody.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        if (!target.classList.contains(Constants.Styles.SettingsMenu.closeJs))
            return;
        extensionBody.classList.remove('open');
        extensionBody.classList.add(Constants.Styles.Base.hide);
        extensionBody.classList.remove('nav-gamer');
        extensionTrigger.classList.remove('active');
    });
    extensionBody.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        if (!target.classList.contains(Constants.Styles.SettingsMenu.versionLink))
            return;
        extensionBody.querySelector(`.${Constants.Styles.SettingsMenu.changelogView}`)
            .classList.toggle(Constants.Styles.SettingsMenu.settingsContentShow);
        extensionBody.querySelector(`.${Constants.Styles.SettingsMenu.settingsView}`)
            .classList.toggle(Constants.Styles.SettingsMenu.settingsContentShow);
    });
    extensionBody.addEventListener('change', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        const configPath = target.getAttribute('data-config-path');
        if (isSelectElement(target))
            setValue(config, configPath, target.value);
        else if (isCheckboxElement(target))
            setValue(config, configPath, target.checked);
        checkRenderConditions(target);
        const parentAccordionBody = target.closest('.ta-x-settings-menu-settings-accordion-body');
        if (parentAccordionBody)
            broadcast('accordion:setMaxHeight', undefined, parentAccordionBody);
    });
};
/* harmony default export */ const settings_menu = (async () => {
    await applyBody();
    listen();
});

;// CONCATENATED MODULE: ./src/features/sticky-header/index.ts


let sticky_header_extensionBody;
let previousScrollTop;
let previousMenuOpen;
const atTopOfPage = () => window.pageYOffset <= sticky_header_extensionBody.offsetTop;
const sticky_header_applyBody = async () => {
    sticky_header_extensionBody = await waitForElement('header');
    const fakeElement = document.createElement('div');
    fakeElement.style.height = `${sticky_header_extensionBody.offsetHeight}px`;
    sticky_header_extensionBody.parentNode.insertBefore(fakeElement, sticky_header_extensionBody);
    sticky_header_extensionBody.classList.add(Constants.Styles.StickyHeader.featureJs, Constants.Styles.StickyHeader.featureStyle);
    document.documentElement.style.setProperty(Constants.Styles.Variables.StickyHeader.height, `${sticky_header_extensionBody.offsetHeight}px`);
    if (!atTopOfPage()) {
        sticky_header_extensionBody.classList.add(Constants.Styles.Animations.yHideNoTransition);
    }
};
const sticky_header_listen = async () => {
    const navGamer = await waitForElement(`.nav-gamer:not(.${Constants.Styles.SettingsMenu.featureJs})`);
    const taxSettingsMenu = await waitForElement(`.${Constants.Styles.SettingsMenu.featureJs}`);
    previousMenuOpen = navGamer.classList.contains('open') || taxSettingsMenu.classList.contains('open');
    window.addEventListener('scroll', () => {
        const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (atTopOfPage()) {
            sticky_header_extensionBody.classList.remove(Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition);
        }
        else {
            const searchElement = sticky_header_extensionBody.querySelector('#divtxtSearchContainer');
            if (searchElement.style.display !== 'inline' && !toBool(sticky_header_extensionBody.dataset.menuOpen)) {
                if (previousScrollTop > currentScrollTop) {
                    sticky_header_extensionBody.classList.remove(Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition);
                    sticky_header_extensionBody.classList.add(Constants.Styles.Animations.yShow);
                }
                else if (previousScrollTop < currentScrollTop) {
                    sticky_header_extensionBody.classList.remove(Constants.Styles.Animations.yShow);
                    sticky_header_extensionBody.classList.add(Constants.Styles.Animations.yHide);
                }
            }
        }
        previousScrollTop = currentScrollTop;
    });
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(({ target, attributeName }) => {
            if (!(target instanceof HTMLElement))
                return;
            if (attributeName === 'class') {
                const currentMenuOpen = target.classList.contains('open');
                if (previousMenuOpen !== currentMenuOpen) {
                    previousMenuOpen = currentMenuOpen;
                    sticky_header_extensionBody.setAttribute('data-menu-open', currentMenuOpen.toString());
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
};
/* harmony default export */ const sticky_header = (async () => {
    if (!stickyHeader.enabled)
        return;
    await sticky_header_applyBody();
    await sticky_header_listen();
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/manage-walkthrough.html
// Module
var manage_walkthrough_code = "<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\">\r\n\r\n</div>";
// Exports
/* harmony default export */ const manage_walkthrough = (manage_walkthrough_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/default-status.ts



const changeToDefaultStatus = async () => {
    if (!manageWalkthrough.manageWalkthroughDefaultStatus)
        return;
    if (StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId())
        return;
    const status = await waitForElement('#ddlStatusFilter');
    if (status.querySelector('[selected]') === null &&
        status.value !== manageWalkthrough.manageWalkthroughDefaultStatusValue) {
        status.value = manageWalkthrough.manageWalkthroughDefaultStatusValue;
        status.onchange(null);
    }
};
/* harmony default export */ const default_status = ({ changeToDefaultStatus });

;// CONCATENATED MODULE: ./src/views/templates/manage-walkthrough-achievement-row.html
// Module
var manage_walkthrough_achievement_row_code = "<template id=\"ta-x-template-manage-walkthrough-achievement-row\">\r\n    <tr>\r\n        <td class=\"point\"></td>\r\n        <td class=\"c1\">{element.outerHTML}</td>\r\n        <td class=\"c2\"></td>\r\n        <td class=\"dlop plain\"></td>\r\n    </tr>\r\n</template>";
// Exports
/* harmony default export */ const manage_walkthrough_achievement_row = (manage_walkthrough_achievement_row_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/clickable-table-links.ts




const clickableAchievements = async (walkthroughContainer, walthroughPreviewDocument) => {
    if (await waitForElement('#chWalkthroughAchievements', walkthroughContainer)) {
        const parsedDocument = new DOMParser().parseFromString(manage_walkthrough_achievement_row, 'text/html');
        const walkthroughAchievements = [...walkthroughContainer.querySelectorAll('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1')];
        let walkthroughAchievementContainer = walkthroughContainer.querySelector('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID tbody');
        if (!walkthroughAchievementContainer) {
            const walkthroughAchievementTable = walkthroughContainer.querySelector('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID table');
            walkthroughAchievementContainer = walkthroughAchievementTable.appendChild(document.createElement('tbody'));
        }
        const games = [...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .games a.gamelink')];
        await allConcurrently('ClickableAchievements - Games', games.map((game) => ({
            name: `manage-walkthrough-clickable-table-links-clickable-achievements-${game.innerText}`,
            task: async () => {
                const gameResponse = await memoizeFetch(game.href);
                const gameDocument = new DOMParser().parseFromString(gameResponse, 'text/html');
                const gameAchievements = [...gameDocument.querySelectorAll('main ul.ach-panels li a.title')];
                await allConcurrently('ClickableAchievements - Achievements', gameAchievements.map((gameAchievement) => ({
                    name: `manage-walkthrough-clickable-table-links-clickable-achievements-${game.innerText}-${gameAchievement.innerText.trim()}`,
                    task: async () => {
                        const achievementName = gameAchievement.innerText.trim();
                        const walkthroughAchievement = walkthroughAchievements.find(walkthroughAchievement => walkthroughAchievement.innerText.toLowerCase() === achievementName.toLowerCase());
                        if (walkthroughAchievement) {
                            walkthroughAchievement.innerText = '';
                            walkthroughAchievement.innerHTML = gameAchievement.outerHTML;
                            const link = walkthroughAchievement.querySelector('a');
                            link.href = AchievementsRegex.Test.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;
                        }
                        else {
                            const clonedAchievementRow = parsedDocument.querySelector(`#${Constants.Templates.StaffWalkthroughImprovements.ManageWalkthroughPage.achievementRow}`).content.firstElementChild.cloneNode(true);
                            const achievementRow = template(clonedAchievementRow, { element: gameAchievement });
                            const link = achievementRow.querySelector('a');
                            achievementRow.querySelector('a').href = AchievementsRegex.Test.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;
                            walkthroughAchievementContainer.appendChild(achievementRow);
                        }
                    }
                })), 5);
            }
        })));
        const achievementsTotal = walkthroughContainer.querySelector('#chWalkthroughAchievements #lstWalkthroughAchievementID .total');
        achievementsTotal.innerText = `${achievementsTotal.innerText}/${[...walkthroughAchievementContainer.querySelectorAll('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1')].length}`;
    }
};
const clickableGames = async (walkthroughContainer, walthroughPreviewDocument) => {
    if (await waitForElement('#chWalkthroughGamers', walkthroughContainer)) {
        const games = [...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .games a.gamelink')];
        [...walkthroughContainer.querySelectorAll('#scrolllstWalkthroughGames .c1')].forEach(el => {
            const gameName = el.innerText.trim();
            const walkthroughPreviewGame = games.find(game => game.innerText.toLowerCase() === gameName.toLowerCase());
            if (walkthroughPreviewGame) {
                el.innerText = '';
                el.innerHTML = walkthroughPreviewGame.outerHTML;
            }
        });
    }
};
const clickableGamers = async (walkthroughContainer, walthroughPreviewDocument) => {
    if (await waitForElement('#chWalkthroughGamers', walkthroughContainer)) {
        const editors = [...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .editors dd a')];
        [...walkthroughContainer.querySelectorAll('#scrolllstWalkthroughGamers .c1')].forEach(el => {
            const gamerName = el.innerText.trim();
            const walkthroughPreviewGamer = editors.find(editor => editor.innerText.toLowerCase() === gamerName.toLowerCase());
            if (walkthroughPreviewGamer) {
                el.innerText = '';
                el.innerHTML = walkthroughPreviewGamer.outerHTML;
            }
        });
    }
};
const makeTableLinksClickable = async () => {
    if (!manageWalkthrough.clickableTableLinks)
        return;
    const selectedWalkthrough = await waitForElement('#lstWalkthroughIDselectedrow a');
    if (!selectedWalkthrough) {
        return;
    }
    const walkthroughContainer = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`);
    const walkthroughId = toInt(extractAllBetween("'", selectedWalkthrough.href)[1]);
    const walthroughPreviewResponse = await memoizeFetch(`https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`);
    const walthroughPreviewDocument = new DOMParser().parseFromString(walthroughPreviewResponse, 'text/html');
    await allConcurrently('Manage Walkthrough Page Clickable Table Links', [
        { name: 'manage-walkthrough-clickable-table-links-clickable-achievements', task: async () => clickableAchievements(walkthroughContainer, walthroughPreviewDocument) },
        { name: 'manage-walkthrough-clickable-table-links-clickable-games', task: async () => clickableGames(walkthroughContainer, walthroughPreviewDocument) },
        { name: 'manage-walkthrough-clickable-table-links-clickable-gamers', task: async () => clickableGamers(walkthroughContainer, walthroughPreviewDocument) }
    ], 1);
};
/* harmony default export */ const clickable_table_links = ({ makeTableLinksClickable });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/auto-select-first.ts



const autoSelectFirst = async () => {
    if (!manageWalkthrough.autoSelectFirst)
        return;
    if (StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId())
        return;
    const walkthroughList = await waitForElement('#scrolllstWalkthroughID');
    if (await waitForElement('#lstWalkthroughIDselectedrow', undefined, 1000) === null &&
        walkthroughList.querySelector('table tr') !== null) {
        walkthroughList.querySelector('table tr a').click();
    }
};
/* harmony default export */ const auto_select_first = ({ autoSelectFirst });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/index.ts







let walkthroughContainer;
const manage_walkthrough_applyBody = async () => {
    walkthroughContainer = await waitForElement('#divWalkthroughHolder');
    if (!walkthroughContainer)
        return;
    const editWalkthrough = await waitForElement('#chEditWalkthrough', walkthroughContainer);
    if (editWalkthrough) {
        const parsedDocument = new DOMParser().parseFromString(manage_walkthrough, 'text/html');
        editWalkthrough.after(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`));
        await allConcurrently('Manage Walkthrough', [
            { name: 'manage-walkthrough-adjust-right-sidebar', task: adjustRightSidebar },
            { name: 'manage-walkthrough-adjust-buttons', task: adjustButtons }
        ]);
    }
};
const adjustButtons = async () => {
    const buttonContainer = await waitForElement('#btnWalkthrough_Options', walkthroughContainer);
    let buttonsContainer = null;
    [...buttonContainer.querySelectorAll('li a')].forEach(button => {
        buttonsContainer = buttonsContainer ? buttonsContainer : button.closest('.buttons');
        if (buttonsContainer) {
            button.classList.add('button');
            buttonsContainer.appendChild(button);
        }
    });
    if (buttonsContainer) {
        buttonsContainer.parentNode.insertBefore(buttonsContainer, buttonsContainer.previousElementSibling);
    }
};
const adjustRightSidebar = async () => {
    const sideBarContainer = await waitForElement(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`, walkthroughContainer);
    if (sideBarContainer) {
        const walkthroughAchievementsContainer = await waitForElement('#chWalkthroughAchievements', walkthroughContainer);
        if (walkthroughAchievementsContainer) {
            deDupeAchievements(walkthroughAchievementsContainer);
            sideBarContainer.appendChild(walkthroughAchievementsContainer);
        }
        sideBarContainer.appendChild(await waitForElement('#chWalkthroughGames', walkthroughContainer));
        sideBarContainer.appendChild(await waitForElement('#chWalkthroughGamers', walkthroughContainer));
        sideBarContainer.appendChild(await waitForElement('#chWalkthroughOtherSiteLink', walkthroughContainer));
    }
};
const deDupeAchievements = (walkthroughAchievementsContainer) => {
    const walkthroughAchievements = [...walkthroughAchievementsContainer.querySelectorAll('#scrolllstWalkthroughAchievementID .c1')];
    const duplicateAchievements = getDuplicates(walkthroughAchievements.map(el => el.innerText), true);
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
/* harmony default export */ const staff_walkthrough_improvements_manage_walkthrough = (async () => {
    if (!StaffRegex.Walkthroughs.Test.manageWalkthroughUrl())
        return;
    await changeToDefaultStatus();
    await autoSelectFirst();
    await manage_walkthrough_applyBody();
    await makeTableLinksClickable();
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/walkthrough-page.html
// Module
var walkthrough_page_code = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\">\r\n\r\n</div>\r\n\r\n<a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" href=\"/staff/walkthrough/managewalkthrough.aspx\">Walkthrough Team</a>";
// Exports
/* harmony default export */ const walkthrough_page = (walkthrough_page_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/add-walkthrough-team-button.ts



const addWalkthroughTeamButton = async (walkthroughContainer, walkthoughPageVersions) => {
    if (!walkthroughPage.walkthroughTeamButton)
        return;
    if (!walkthroughContainer || !walkthoughPageVersions)
        return;
    const walkthroughPageButtons = await waitForElement('.content .buttons', walkthoughPageVersions);
    if (walkthroughPageButtons) {
        const parsedDocument = new DOMParser().parseFromString(walkthrough_page, 'text/html');
        walkthroughPageButtons.appendChild(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonJs}`));
    }
};
/* harmony default export */ const add_walkthrough_team_button = ({ addWalkthroughTeamButton });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/move-buttons-to-left.ts


const moveButtonsToLeft = async (walkthroughContainer, walkthoughPageVersions) => {
    if (!walkthroughPage.moveButtonsToLeft)
        return;
    if (!walkthroughContainer || !walkthoughPageVersions)
        return;
    const walkthroughContainerButtons = await waitForElement('#btnEditPage, #btnEditPage2, #btnUnlockWalkthroughPage, #btnUnlockWalkthroughPage2', walkthroughContainer);
    const walkthroughPageVersionButtons = await waitForElement('.content .buttons', walkthoughPageVersions);
    if (walkthroughContainerButtons && walkthroughPageVersionButtons) {
        walkthroughPageVersionButtons.append(...walkthroughContainerButtons.parentElement.childNodes);
        walkthroughContainer.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.moveButtonsToLeftStyle);
    }
};
/* harmony default export */ const move_buttons_to_left = ({ moveButtonsToLeft });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/sticky-page-history.ts



let sticky_page_history_walkthroughContainer;
let walkthoughPageVersions;
const variableProperty = Constants.Styles.Variables.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryTop;
const sticky_page_history_listen = async () => {
    window.addEventListener('scroll', async () => await applyStickyElementStyle(variableProperty, walkthoughPageVersions, sticky_page_history_walkthroughContainer, {
        noTransitionStyle: !classListContains(walkthoughPageVersions, [
            Constants.Styles.Animations.yHideNoTransition,
            Constants.Styles.Animations.yHide,
            Constants.Styles.Animations.yShow
        ]),
        paddingFromTop: 5
    }));
};
const setPageHistorySticky = async (container, pageVersions) => {
    if (!walkthroughPage.stickyPageHistory)
        return;
    if (!container || !pageVersions)
        return;
    sticky_page_history_walkthroughContainer = container;
    walkthoughPageVersions = pageVersions;
    pageVersions.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs, Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle);
    await applyStickyElementStyle(variableProperty, pageVersions, container, { noTransitionStyle: true, paddingFromTop: 5 });
    await sticky_page_history_listen();
};
/* harmony default export */ const sticky_page_history = ({ setPageHistorySticky });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/highlight-page-locked.ts


const highlightPageLocked = async (walkthroughContainer) => {
    if (!walkthroughPage.highlightPageLocked)
        return;
    if (!walkthroughContainer)
        return;
    const walkthroughLocked = await waitForElement('.walkthroughlocked', walkthroughContainer);
    if (walkthroughLocked) {
        walkthroughLocked.classList.add('informationpanel');
    }
};
/* harmony default export */ const highlight_page_locked = ({ highlightPageLocked });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/index.ts








let walkthrough_page_walkthroughContainer;
let walkthrough_page_walkthoughPageVersions;
const walkthrough_page_applyBody = async () => {
    const parsedDocument = new DOMParser().parseFromString(walkthrough_page, 'text/html');
    walkthrough_page_walkthoughPageVersions = await waitForElement('#chWalkthroughPageVersions');
    walkthrough_page_walkthoughPageVersions.parentElement.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`), walkthrough_page_walkthoughPageVersions);
    walkthrough_page_walkthroughContainer = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`);
    walkthrough_page_walkthroughContainer.appendChild(walkthrough_page_walkthoughPageVersions);
    moveWalkthroughPagePreview();
};
const moveWalkthroughPagePreview = async () => {
    const walkthoughPagePreview = await waitForElement('#chWalkthroughPagePreview');
    if (walkthoughPagePreview) {
        walkthrough_page_walkthroughContainer.appendChild(walkthoughPagePreview);
    }
};
/* harmony default export */ const staff_walkthrough_improvements_walkthrough_page = (async () => {
    if (!StaffRegex.Walkthroughs.Test.walkthroughPageUrl())
        return;
    await walkthrough_page_applyBody();
    allConcurrently('Walkthrough Page', [
        { name: 'walkthrough-page-set-page-history-sticky', task: async () => setPageHistorySticky(walkthrough_page_walkthroughContainer, walkthrough_page_walkthoughPageVersions) },
        { name: 'walkthrough-page-add-walkthrough-team-button', task: async () => addWalkthroughTeamButton(walkthrough_page_walkthroughContainer, walkthrough_page_walkthoughPageVersions) },
        { name: 'walkthrough-page-move-buttons-to-left', task: async () => moveButtonsToLeft(walkthrough_page_walkthroughContainer, walkthrough_page_walkthoughPageVersions) },
        { name: 'walkthrough-page-highlight-page-locked', task: async () => highlightPageLocked(walkthrough_page_walkthroughContainer) }
    ]);
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/auto-save-notification.ts


const autoSaveNotification = async () => {
    if (!editWalkthrough.autoSaveNotification)
        return;
    subscribe('ajaxIntercept:response', (response) => {
        if (!AjaxRegex.Test.autosave(response.responseURL))
            return;
        if (response.status === 200) {
            broadcast('snackbar:show', undefined, {
                text: 'Autosave successful.',
                type: 'success'
            });
        }
        else {
            broadcast('snackbar:show', undefined, {
                text: 'Autosave failed.',
                type: 'danger'
            });
        }
    });
};
/* harmony default export */ const auto_save_notification = ({ autoSaveNotification });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/edit-walkthrough.html
// Module
var edit_walkthrough_code = "<div class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-sticky-header\">\r\n\r\n</div>\r\n\r\n<p class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title\">{image.title}</p>";
// Exports
/* harmony default export */ const edit_walkthrough = (edit_walkthrough_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/improved-image-selector.ts




const improved_image_selector_listen = () => {
    document.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        if (target.closest(`[aria-label='Add Image'], .${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`) !== null)
            return;
        const imageSelector = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`);
        if (imageSelector.style.display === 'block') {
            imageSelector.style.display = 'none';
        }
    });
    window.addEventListener('blur', () => {
        if (document.activeElement === document.querySelector('#txtWalkthrough_ifr')) {
            const imageSelector = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`);
            if (imageSelector.style.display !== 'block')
                return;
            imageSelector.style.display = 'none';
        }
    });
};
const improveImageSelector = async () => {
    if (!editWalkthrough.improvedImageSelector)
        return;
    const imageContainer = await waitForElement('#oWalkthroughImageViewer');
    if (!imageContainer)
        return;
    imageContainer.classList.add(Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorStyle, Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs);
    const parsedDocument = new DOMParser().parseFromString(edit_walkthrough, 'text/html');
    const stickyImageHeader = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorContainerJs}`);
    const imageViewer = await waitForElement('.imageviewer', imageContainer);
    const imageLink = await waitForElement('.addimages a', imageContainer);
    imageContainer.insertBefore(stickyImageHeader, imageViewer);
    stickyImageHeader.appendChild(imageViewer.querySelector('.itemname, .noimages'));
    stickyImageHeader.appendChild(imageLink);
    [...imageViewer.querySelectorAll('.ivimage a')].forEach(imageAnchor => {
        const clonedImageTitle = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorImageTitleJs}`).cloneNode(true);
        const imageTitle = template(clonedImageTitle, { image: imageAnchor.querySelector('img') });
        imageTitle.innerText = extractBetween("'", imageTitle.innerText);
        imageAnchor.appendChild(imageTitle);
    });
    improved_image_selector_listen();
};
/* harmony default export */ const improved_image_selector = ({ improveImageSelector });

;// CONCATENATED MODULE: ./src/scss/features/staff-walkthrough-improvements/tinymce/charcoal/skin.scss

        const styles = `body.trueachievement-extras.ta-x-staff-walkthrough-improvements .mce-edit-area{border:0 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel{border:0 solid #232b33;background-color:#404952}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-toolbar-grp{padding:2px 0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-window-head,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-foot{border-color:#9e9e9e}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-title,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-label{color:#b5b9bf;text-shadow:0 1px 1px rgba(0,0,0,.75)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-path-item{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel i.mce-i-resize{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel i.mce-ico{text-shadow:1px 1px #000;color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel i.mce-caret{border-top:4px solid #b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn{border:1px solid #364049 !important;border-color:#202a33 !important;text-shadow:0 1px 1px rgba(0,0,0,.75);background-color:#4c5761 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn:focus,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-active,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn:hover,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn:focus,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-active,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn:hover{background-image:none !important;background-color:#004364 !important;border-color:#24292e !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-disabled,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-disabled{cursor:default}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-primary,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-primary{background-color:#004364 !important;color:#fff;text-shadow:1px 1px #333}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-primary:hover,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-primary:hover{background-color:#00547d !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn button,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn button{padding:4px 10px;font-size:14px;cursor:pointer;color:#b5b9bf;text-align:center}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn button span,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn button span{color:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn-group .mce-btn{border-width:1px;margin:0;margin-left:2px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu{background:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-sep{background:#25313f;border-color:#424f5f}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal .mce-text{color:#ddd !important;background:rgba(0,0,0,0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal:focus,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal.mce-selected,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal.mce-active{background-color:#006597;color:#fff !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal:hover{text-decoration:none;color:#fff;background-color:#0085c7}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal .mce-caret{border-left:4px solid #b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-grid-border a{border-color:#202a33;background-color:#4c5761}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-grid-border a.mce-active{background-color:#006597}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-text-center{color:#ddd}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-edit-area{border-left:1px solid #000 !important;border:0 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-tabs{background:#303942;border-bottom:1px solid #202a33}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-tabs .mce-tab{color:#b5b9bf;border-color:#202a33;background:#303942;text-shadow:0 1px 1px rgba(0,0,0,.75)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-tabs .mce-tab.mce-active{background:#404952}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-i-checkbox,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-textbox,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] input{background-color:#4c5761;color:#bbb;border-color:#202a33;background-image:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer{border:0 solid #232b33;background-color:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer .imageviewer{background-color:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer .noimages,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer .itemname{color:#b5b9bf}`;
        /* harmony default export */ const skin = (styles);
    
;// CONCATENATED MODULE: ./src/scss/features/staff-walkthrough-improvements/tinymce/charcoal/content.scss

        const content_styles = `body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-tinymce-theme=dark]{background-color:#444;color:#bbb;border-color:#555}`;
        /* harmony default export */ const content = (content_styles);
    
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/toggle-theme-button.ts




let themeToggle;
let globalTheme;
const getTinymceTheme = async () => {
    globalTheme = globalTheme ? globalTheme : await waitForElement('.page, [data-theme]');
    if (editWalkthrough.tinymceTheme !== null) {
        return editWalkthrough.tinymceTheme;
    }
    else {
        return globalTheme ? globalTheme.getAttribute('data-theme') : '';
    }
};
const toggle_theme_button_listen = async () => {
    themeToggle.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        const currentTheme = target.getAttribute('data-ta-x-tinymce-theme');
        const newTheme = currentTheme === 'dark' ? '' : 'dark';
        editWalkthrough.tinymceTheme = newTheme;
        target.setAttribute('data-ta-x-tinymce-theme', newTheme);
    });
    const iframe = await waitForElement('#txtWalkthrough_ifr');
    iframe.addEventListener('load', async () => {
        const iframeDocument = iframe && iframe.contentDocument;
        const bodyEl = await waitForElement('#tinymce', iframeDocument);
        bodyEl.classList.add(Constants.Styles.root, Constants.Styles.StaffWalkthroughImprovements.featureStyle);
        bodyEl.setAttribute('data-ta-x-tinymce-theme', await getTinymceTheme());
        const style = iframeDocument.createElement('style');
        style.id = 'ta-x-staff-walkthrough-improvements-dark-tinymce-style';
        style.innerHTML = content;
        iframeDocument.head.appendChild(style);
        const script = iframeDocument.createElement('script');
        script.id = 'ta-x-staff-walkthrough-improvements-dark-tinymce-script';
        script.innerHTML = `window.addEventListener('message', function(event) {
      console.log(event);
      if (!event || !event.data || event.data.theme === null || event.data.theme === undefined) return;
      document.body.setAttribute('data-ta-x-tinymce-theme', event.data.theme);
    });`;
        iframeDocument.head.appendChild(script);
        iframe.removeEventListener('load', undefined);
    });
    let preventMutation = false;
    const observer = new MutationObserver((mutations) => {
        if (preventMutation) {
            preventMutation = false;
            return;
        }
        mutations.forEach((mutation) => {
            if (mutation.type !== 'attributes')
                return;
            if (!(mutation.target instanceof HTMLElement))
                return;
            let theme;
            if (mutation.attributeName === 'data-theme') {
                theme = mutation.target.getAttribute('data-theme');
                preventMutation = true;
                themeToggle.setAttribute('data-ta-x-tinymce-theme', theme === 'dark' ? theme : '');
                document.body.setAttribute('data-ta-x-theme', theme === 'dark' ? theme : '');
            }
            else if (mutation.attributeName === 'data-ta-x-tinymce-theme') {
                theme = mutation.target.getAttribute('data-ta-x-tinymce-theme');
            }
            else {
                return;
            }
            if (theme !== null && theme !== undefined) {
                iframe.contentWindow.postMessage({ theme: theme }, '*');
            }
        });
    });
    observer.observe(themeToggle, {
        attributes: true
    });
    observer.observe(globalTheme, {
        attributes: true
    });
};
const addToggleThemeButton = async (toolbar) => {
    GM_addStyle(skin);
    themeToggle = toolbar.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs} [data-ta-x-tinymce-theme]`);
    const theme = await getTinymceTheme();
    themeToggle.setAttribute('data-ta-x-tinymce-theme', theme);
    document.body.setAttribute('data-ta-x-theme', theme);
    await toggle_theme_button_listen();
};
/* harmony default export */ const toggle_theme_button = ({ addToggleThemeButton });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/set-fullwidth-toolbar.ts




let tinymceContainer;
let tinymceToolbar;
const set_fullwidth_toolbar_variableProperty = Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarTop;
const set_fullwidth_toolbar_listen = async () => {
    window.addEventListener('scroll', async () => {
        await applyStickyElementStyle(set_fullwidth_toolbar_variableProperty, tinymceToolbar, tinymceContainer, {
            noTransitionStyle: !classListContains(tinymceToolbar, [
                Constants.Styles.Animations.yHideNoTransition,
                Constants.Styles.Animations.yHide,
                Constants.Styles.Animations.yShow
            ]),
            isRelativeToParent: true
        });
        setTimeout(() => broadcast('tinymce:repositionFloatingMenus'), 250);
    });
};
const setFullWidthToolbar = async (container) => {
    tinymceContainer = container;
    tinymceToolbar = await waitForElement('.mce-container-body .mce-toolbar-grp', container);
    if (!tinymceToolbar)
        return;
    tinymceToolbar.classList.add(Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarStyles);
    document.documentElement.style.setProperty(Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarWidth, `${tinymceToolbar.parentElement.scrollWidth}px`);
    await applyStickyElementStyle(set_fullwidth_toolbar_variableProperty, tinymceToolbar, tinymceContainer, { noTransitionStyle: true, isRelativeToParent: true });
    await set_fullwidth_toolbar_listen();
};
/* harmony default export */ const set_fullwidth_toolbar = ({ setFullWidthToolbar });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/fix-floating-menus.ts



let fix_floating_menus_tinymceToolbar;
const fix_floating_menus_variableProperty = Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarFloatingMenu;
const setTopPosition = () => {
    const actualTopPosition = getElementCoordinates(fix_floating_menus_tinymceToolbar);
    document.documentElement.style.setProperty(fix_floating_menus_variableProperty, `${fix_floating_menus_tinymceToolbar.offsetHeight + actualTopPosition.top}px`);
};
const fix_floating_menus_listen = () => {
    window.addEventListener('scroll', setTopPosition);
    subscribe('tinymce:repositionFloatingMenus', setTopPosition);
};
const fixFloatingMenus = async (container) => {
    fix_floating_menus_tinymceToolbar = await waitForElement('.mce-container-body .mce-toolbar-grp', container);
    if (!fix_floating_menus_tinymceToolbar)
        return;
    setTopPosition();
    fix_floating_menus_listen();
};
/* harmony default export */ const fix_floating_menus = ({ fixFloatingMenus });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/source-code-button.ts

const createScript = (id, innerHtml) => {
    const script = document.createElement('script');
    script.id = id;
    script.innerHTML = innerHtml;
    return script;
};
const buildSourceCodeCommandScript = () => {
    const id = 'ta-x-staff-walkthrough-improvements-add-code-editor-command';
    const script = `tinymce.PluginManager.add("code", function(e) {
        function o() {
            var o = tinymce.editors.txtWalkthrough.windowManager.open({
                title: "Source code",
                body: {
                    type: "textbox",
                    name: "code",
                    multiline: true,
                    minWidth: tinymce.editors.txtWalkthrough.getParam("code_dialog_width", 600),
                    minHeight: tinymce.editors.txtWalkthrough.getParam("code_dialog_height", Math.min(tinymce.DOM.getViewPort().h - 200, 500)),
                    spellcheck: false,
                    style: "direction: ltr; text-align: left"
                },
                onSubmit: function(o) {
                    tinymce.editors.txtWalkthrough.focus(),
                    tinymce.editors.txtWalkthrough.undoManager.transact(function() {
                        tinymce.editors.txtWalkthrough.setContent(o.data.code)
                    }),
                    tinymce.editors.txtWalkthrough.selection.setCursorLocation(),
                    tinymce.editors.txtWalkthrough.nodeChanged()
                }
            });
            o.find("#code").value(tinymce.editors.txtWalkthrough.getContent({
                source_view: true
            }))
        }
        tinymce.editors.txtWalkthrough.addCommand("mceCodeEditor", o)
    })();`;
    return createScript(id, script);
};
const buildShowSourceCodeButtonScript = () => {
    const id = 'ta-x-staff-walkthrough-improvements-show-code-editor';
    const script = `document.querySelector(".js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code").addEventListener("click", function(e) {
        tinymce.activeEditor.execCommand("mceCodeEditor");
    });`;
    return createScript(id, script);
};
const addSourceCodeButton = async () => {
    const iframe = await waitForElement('#txtWalkthrough_ifr');
    iframe.addEventListener('load', async () => {
        const sourceCodeCommand = buildSourceCodeCommandScript();
        const sourceCodeButton = buildShowSourceCodeButtonScript();
        document.body.appendChild(sourceCodeCommand);
        document.body.appendChild(sourceCodeButton);
        iframe.removeEventListener('load', undefined);
    });
};
/* harmony default export */ const source_code_button = ({ addSourceCodeButton });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/tinymce.html
// Module
var tinymce_code = "<div class=\"mce-container mce-last mce-flow-layout-item mce-btn-group js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle\" role=\"group\">\r\n    <div>\r\n        <div class=\"mce-widget mce-btn mce-first \" tabindex=\"-1\" role=\"button\" aria-label=\"Switch theme\">\r\n            <button role=\"presentation\" type=\"button\" tabindex=\"-1\" data-ta-x-tinymce-theme>\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z\"></path>\r\n                </svg>\r\n                <svg class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M505.2 324.8l-47.73-68.78l47.75-68.81c7.359-10.62 8.797-24.12 3.844-36.06c-4.969-11.94-15.52-20.44-28.22-22.72l-82.39-14.88l-14.89-82.41c-2.281-12.72-10.76-23.25-22.69-28.22c-11.97-4.936-25.42-3.498-36.12 3.844L256 54.49L187.2 6.709C176.5-.6016 163.1-2.039 151.1 2.896c-11.92 4.971-20.4 15.5-22.7 28.19l-14.89 82.44L31.15 128.4C18.42 130.7 7.854 139.2 2.9 151.2C-2.051 163.1-.5996 176.6 6.775 187.2l47.73 68.78l-47.75 68.81c-7.359 10.62-8.795 24.12-3.844 36.06c4.969 11.94 15.52 20.44 28.22 22.72l82.39 14.88l14.89 82.41c2.297 12.72 10.78 23.25 22.7 28.22c11.95 4.906 25.44 3.531 36.09-3.844L256 457.5l68.83 47.78C331.3 509.7 338.8 512 346.3 512c4.906 0 9.859-.9687 14.56-2.906c11.92-4.969 20.4-15.5 22.7-28.19l14.89-82.44l82.37-14.88c12.73-2.281 23.3-10.78 28.25-22.75C514.1 348.9 512.6 335.4 505.2 324.8zM456.8 339.2l-99.61 18l-18 99.63L256 399.1L172.8 456.8l-18-99.63l-99.61-18L112.9 255.1L55.23 172.8l99.61-18l18-99.63L256 112.9l83.15-57.75l18.02 99.66l99.61 18L399.1 255.1L456.8 339.2zM256 143.1c-61.85 0-111.1 50.14-111.1 111.1c0 61.85 50.15 111.1 111.1 111.1s111.1-50.14 111.1-111.1C367.1 194.1 317.8 143.1 256 143.1zM256 319.1c-35.28 0-63.99-28.71-63.99-63.99S220.7 192 256 192s63.99 28.71 63.99 63.1S291.3 319.1 256 319.1z\"/>\r\n                </svg>\r\n            </button>\r\n        </div>\r\n        <div class=\"mce-widget mce-btn mce-last\" tabindex=\"-1\" role=\"button\" aria-label=\"Show Code\">\r\n            <button role=\"presentation\" type=\"button\" tabindex=\"-1\" class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code-button\">\r\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->\r\n                    <path fill=\"currentColor\" d=\"M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z\"></path>\r\n                </svg>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</div>";
// Exports
/* harmony default export */ const tinymce = (tinymce_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/index.ts







const tinymce_tinymce = async () => {
    if (!await waitForElement('[href*="skin.min.css"]', document.head))
        return;
    const container = await waitForElement('.mce-tinymce');
    const toolbar = await waitForElement('.mce-toolbar.mce-last .mce-container-body', container);
    if (!container || !toolbar)
        return;
    const parsedDocument = new DOMParser().parseFromString(tinymce, 'text/html');
    const addedGroup = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`);
    toolbar.appendChild(addedGroup);
    allConcurrently('Edit Walkthrough', [
        { name: 'tinymce-set-full-width-toolbar', task: async () => setFullWidthToolbar(container) },
        { name: 'tinymce-add-fix-floating-menus', task: async () => fixFloatingMenus(container) },
        { name: 'tinymce-add-source-code-button', task: async () => addSourceCodeButton() },
        { name: 'tinymce-add-toggle-theme-button', task: async () => addToggleThemeButton(toolbar) }
    ]);
};
/* harmony default export */ const edit_walkthrough_tinymce = ({ tinymce: tinymce_tinymce });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/index.ts





/* harmony default export */ const staff_walkthrough_improvements_edit_walkthrough = (async () => {
    if (!StaffRegex.Walkthroughs.Test.editWalkthroughUrl())
        return;
    allConcurrently('Edit Walkthrough', [
        { name: 'edit-walkthrough-improve-image-selector', task: improveImageSelector },
        { name: 'edit-walkthrough-auto-save-notification', task: autoSaveNotification },
        { name: 'edit-walkthrough-tinymce', task: tinymce_tinymce }
    ], 3);
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-preview/index.ts


const walkthrough_preview_applyBody = async () => {
    const main = await waitForElement('.page main');
    main.parentElement.classList.add('no-aside');
    main.classList.add('no-aside');
    const aside = await waitForElement('.page aside');
    aside.remove();
};
/* harmony default export */ const walkthrough_preview = (async () => {
    if (!StaffRegex.Walkthroughs.Test.preview())
        return;
    await walkthrough_preview_applyBody();
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/index.ts






/* harmony default export */ const staff_walkthrough_improvements = (async () => {
    if (!staffWalkthroughImprovements.enabled)
        return;
    if (!StaffRegex.Walkthroughs.Test.all())
        return;
    if (!await waitForElement('body'))
        return;
    document.body.classList.add(Constants.Styles.StaffWalkthroughImprovements.featureJs, Constants.Styles.StaffWalkthroughImprovements.featureStyle);
    allConcurrently('Staff Walkthrough Improvements', [
        { name: 'staff-walkthrough-improvements-manage-walkthrough', task: staff_walkthrough_improvements_manage_walkthrough },
        { name: 'staff-walkthrough-improvements-walkthrough-preview', task: walkthrough_preview },
        { name: 'staff-walkthrough-improvements-walkthrough-page', task: staff_walkthrough_improvements_walkthrough_page },
        { name: 'staff-walkthrough-improvements-edit-walkthrough', task: staff_walkthrough_improvements_edit_walkthrough }
    ], 4);
});

;// CONCATENATED MODULE: ./src/scss/index.scss

        const scss_styles = `:root{--ta-x-sticky-header-height: $ta-x-sticky-header-height}body.trueachievement-extras .ta-x-hide{display:none}@media(min-width: 1200px){body.trueachievement-extras .middle{width:100%;max-width:1200px}}body.trueachievement-extras .ta-x-flex-break{flex-basis:100%;height:0;border:0;padding:0;margin:0}body.trueachievement-extras .ta-x-snackbar{visibility:hidden;min-width:250px;margin-left:-125px;background-color:#333;text-align:center;border-radius:1.5rem;padding:16px;position:fixed;z-index:1;left:50%;bottom:30px}body.trueachievement-extras .ta-x-snackbar-show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}body.trueachievement-extras .ta-x-snackbar h2{color:#bbb;border-left:3px solid #3f67a4}body.trueachievement-extras .ta-x-snackbar h2.warning{border-color:#f57921}body.trueachievement-extras .ta-x-snackbar h2.danger{border-color:#f52721}body.trueachievement-extras .ta-x-snackbar h2.success{border-color:#58bb12}@keyframes fadein{from{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@keyframes fadeout{from{bottom:30px;opacity:1}to{bottom:0;opacity:0}}body.trueachievement-extras .ta-x-y-show{transform:translateY(0);transition:transform .5s ease}body.trueachievement-extras .ta-x-y-hide{transform:translateY(-100%);transition:transform .5s ease}body.trueachievement-extras .ta-x-y-hide-no-transition{transform:translateY(-100%)}body.trueachievement-extras .ta-x-settings-menu-settings{max-height:547px;overflow-y:scroll !important;padding:0 1rem !important;padding-bottom:1rem !important;height:100%;position:relative}body.trueachievement-extras .ta-x-settings-menu-settings>div{display:block;padding:0}body.trueachievement-extras .ta-x-settings-menu-settings .frm-grp{user-select:none;margin-right:0}body.trueachievement-extras .ta-x-settings-menu-settings .frm-sel::after{top:10px}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings>div{flex-wrap:wrap}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-checkbox-help-text{font-size:1.2rem;padding-top:.5rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item{position:absolute;display:none;width:313px;padding-bottom:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item-show{display:block}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper{display:flex;flex-wrap:wrap}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper a{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h2{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h1{margin-bottom:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h2{border-top:2px solid #0e5814;border-bottom:2px solid #0e5814;padding:.5rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper .ta-x-changelog-marker{flex-basis:unset;align-self:center;padding-right:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion{flex-wrap:wrap;border:0;padding-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion:last-of-type{padding-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header{padding:1rem;flex-shrink:unset;color:#fff;cursor:pointer;user-select:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header span{width:100%;pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header svg{height:20px;pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header.collapsed svg{transition:all .5s linear}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header.expanded svg{transform:rotate(-180deg)}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body{border:1px solid #161616;border-top:0;border-bottom-left-radius:1rem;border-bottom-right-radius:1rem;padding:0;transition:max-height .5s ease-out;max-height:0;overflow:hidden}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion .t-settings>div{padding:1rem 0;margin:0 1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion .t-settings>div:last-of-type{border:0}body.trueachievement-extras .ta-x-settings-menu-columned-setting{flex-direction:column;align-items:flex-start}body.trueachievement-extras .ta-x-settings-menu-columned-setting>div:first-of-type{display:flex}body.trueachievement-extras .ta-x-settings-menu-columned-setting .frm-sel{padding-top:1rem}body.trueachievement-extras .ta-x-settings-menu-bottom{background:#4a5568;position:absolute;bottom:0;display:block;width:100%;padding:0 1rem !important}body.trueachievement-extras .ta-x-settings-menu-bottom .title{margin-bottom:0;color:#ddd;border:0}body.trueachievement-extras .ta-x-settings-menu-bottom .title a{background:unset}body.trueachievement-extras .ta-x-settings-menu-bottom .title a:hover{text-decoration:underline}body.trueachievement-extras .ta-x-settings-menu .close i{pointer-events:none}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu-bottom .buttons{border-color:#000 !important}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu-bottom .buttons a{background:#4299e1 !important}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-header{color:#ddd}body.trueachievement-extras .ta-x-sticky-header{position:fixed;top:0;width:100%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements{min-width:unset !important;overflow:auto}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main{min-height:unset !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page{position:unset;display:flex;flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector#oWalkthroughImageViewer{width:321px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .noimages,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .itemname{padding:5px;text-align:center;font-size:unset !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header{position:sticky;border-bottom:1px solid #000;display:flex;flex-direction:column;background-color:#fff}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header .noimages{margin-top:0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector a[title="Add images"]{text-align:center;padding:5px;cursor:pointer !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector a[title="Add images"]:hover{text-decoration:underline}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .imageviewer{display:flex;flex-wrap:wrap}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .imageviewer .ivimage{position:unset;margin:5px;max-width:46%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title{text-align:center;padding-top:3px;white-space:break-spaces}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code-button svg{width:32px;margin-left:-10px;margin-right:-4px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg{height:20px;pointer-events:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg path{fill:#555;filter:drop-shadow(21px 21px #fff);pointer-events:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg:hover path{fill:#333}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark{display:block}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle [data-ta-x-tinymce-theme=dark] svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light{display:block}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle [data-ta-x-tinymce-theme=dark] svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar{border-bottom:1px solid #ddd;width:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-width, 0);top:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-top, 0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header{background-color:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header .itemname{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg path{fill:#b5b9bf;filter:drop-shadow(21px 21px #000)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar{border-color:#232b33}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar.ta-x-y-hide{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));transition:transform .5s ease}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar.ta-x-y-hide-no-transition{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)))}body.trueachievement-extras.ta-x-staff-walkthrough-improvements>.mce-menu{background-color:red}body.trueachievement-extras.ta-x-staff-walkthrough-improvements>.mce-menu.mce-floatpanel{top:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-floating-menu, 0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divWalkthroughHolder{position:unset;margin-top:unset;height:unset;display:flex;justify-content:space-between}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .buttons{display:flex}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button{display:block;flex-grow:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough{margin:0;margin-bottom:3px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough:hover{margin-bottom:5px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughs,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughAchievements,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGames,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGamers,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughOtherSiteLink{position:unset;top:unset;left:unset;display:block;margin:0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough{flex:1;margin:0 1.5rem}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #btnWalkthrough{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container{display:flex;flex-direction:column;justify-content:space-around}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container{display:flex}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview{margin-left:0;position:unset;width:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview{flex:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions{height:100%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history{position:relative;top:var(--ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history-top, 0)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));transition:transform .5s ease}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide-no-transition{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)))}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons{display:flex;justify-content:center;flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .button{flex:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .button:not(:first-of-type){margin-top:5px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-move-buttons-to-left #chWalkthroughPagePreview .content .buttons{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-move-buttons-to-left #chWalkthroughPagePreview .content .buttons .clearboth{display:none}`;
        /* harmony default export */ const scss = (scss_styles);
    
;// CONCATENATED MODULE: ./src/features/styles.ts



/* harmony default export */ const features_styles = (async () => {
    if (!await waitForElement('body'))
        return;
    document.body.classList.add(Constants.Styles.root);
    GM_addStyle(scss);
});

;// CONCATENATED MODULE: ./src/features/index.ts





;// CONCATENATED MODULE: ./src/index.ts





ajax_interceptor.addRequestCallback((xhr) => broadcast('ajaxIntercept:request', undefined, xhr));
ajax_interceptor.addResponseCallback((xhr) => broadcast('ajaxIntercept:response', undefined, xhr));
ajax_interceptor.wire();
(async () => {
    allConcurrently('Components', [
        { name: 'component:snackbar', task: snackbar },
        { name: 'component:accordion', task: accordion }
    ], 3);
    allConcurrently('Features', [
        { name: 'feature:styles', task: features_styles },
        { name: 'feature:settings-menu', task: settings_menu },
        { name: 'feature:sticky-header', task: sticky_header },
        { name: 'feature:staff-walkthrough-improvements', task: staff_walkthrough_improvements }
    ], 4);
    Cache.clearExpired();
})();

})();

/******/ })()
;