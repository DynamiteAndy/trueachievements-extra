// ==UserScript==
// @name          TrueAchievements Extra
// @namespace     dynamite-andy
// @version       2.8.0
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


/***/ }),

/***/ "./src/features/forum-improvements/walkthroughs/walkthroughs.hbs":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = "<section class=\"purple js-ta-x-ask-loader-container ta-x-ask-loader-container js-ta-x-forum-improvements-walkthroughs-show-owner-progress ta-x-forum-improvements-walkthroughs-show-owner-progress\"><div>Walkthrough Information</div><article><div class=\"ta-x-article-loader\"><p>Please wait, loading.</p><svg viewbox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z\" fill=\"currentColor\"></path></svg></div><div class=\"js-ta-x-ask-loader-ask ta-x-ask-loader-ask ta-x-hide\"><p>Can't automate them all sadly! Please enter a direct link to the walkthrough page to link this thread to the walkthrough, I'll remember it next time!</p><div><label class=\"small\">Walkthrough Url</label><input class=\"textbox cs-n js-ta-x-ask-loader-ask-input\" id=\"txtForumImprovementsWalkthroughsShowOwnerProgress\" name=\"txtForumImprovementsWalkthroughsShowOwnerProgress\"></div><input class=\"button js-ta-x-ask-loader-ask-button\" id=\"btnForumImprovementsWalkthroughsShowOwnerProgressSave\" name=\"btnForumImprovementsWalkthroughsShowOwnerProgressSave\" type=\"submit\" value=\"Save\"></div></article></section>";
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ "./src/features/forum-improvements/walkthroughs/show-owner-progress.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/globals/index.ts");
/* harmony import */ var _ta_x_utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utilities/index.ts");
/* harmony import */ var _ta_x_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/helpers/index.ts");
/* harmony import */ var _walkthroughs_hbs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/features/forum-improvements/walkthroughs/walkthroughs.hbs");




let extensionBody;
let askForWalkthroughBody;
const applyBody = async () => {
    const parsedDocument = new DOMParser().parseFromString(_walkthroughs_hbs__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, 'text/html');
    const asideColumn = await (0,_ta_x_utilities__WEBPACK_IMPORTED_MODULE_1__/* .waitForElement */ .br)('.main aside');
    const firstSection = await (0,_ta_x_utilities__WEBPACK_IMPORTED_MODULE_1__/* .waitForElement */ .br)('section:not(.smallpanel)', asideColumn);
    asideColumn.insertBefore(parsedDocument.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs}`), firstSection);
    extensionBody = asideColumn.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs}`);
    askForWalkthroughBody = extensionBody.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants.Styles.Components.AskLoader.askJs */ .gT.Styles.Components.AskLoader.askJs}`);
    getAchievementWalkthroughUrl();
};
const listen = () => {
    const button = extensionBody.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants.Styles.Components.AskLoader.buttonJs */ .gT.Styles.Components.AskLoader.buttonJs}`);
    const input = extensionBody.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants.Styles.Components.AskLoader.inputJs */ .gT.Styles.Components.AskLoader.inputJs}`);
    button.addEventListener('click', async (e) => {
        if (!(e.target instanceof HTMLElement))
            return;
        e.preventDefault();
        e.stopPropagation();
        try {
            if (input.value === '')
                return;
            if (!_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .GamesRegex.Test.walkthroughUrl */ .Rv.Test.walkthroughUrl(input.value))
                return;
            toggleAskForWalkthrough();
            await getOwnerProgress(input.value);
        }
        catch {
            return;
        }
    });
};
const getAchievementWalkthroughUrl = async () => {
    const cachedWalkthroughUrls = _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Cache.walkthroughForumOwnerProgressUrl */ .Ct.walkthroughForumOwnerProgressUrl;
    const threadId = new URLSearchParams(window.location.search).get('tid');
    let url = threadId ? cachedWalkthroughUrls.get(threadId) : null;
    if (!url) {
        const posts = await (0,_ta_x_utilities__WEBPACK_IMPORTED_MODULE_1__/* .waitForElement */ .br)('.posts');
        [...posts.querySelectorAll('li .body')].forEach((el) => {
            if (url)
                return;
            if (_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .SentencesRegex.discussWalkthrough.test */ .EP.discussWalkthrough.test(el.textContent) ||
                _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .SentencesRegex.walkthroughPublished.test */ .EP.walkthroughPublished.test(el.textContent)) {
                const anchor = el.querySelector('a');
                if (anchor && _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .GamesRegex.Test.gameUrl */ .Rv.Test.gameUrl(anchor.href)) {
                    url = anchor.href;
                    if (!url.endsWith('/walkthrough')) {
                        url += '/walkthrough';
                    }
                    return;
                }
            }
        });
        if (!url) {
            toggleAskForWalkthrough();
            return;
        }
    }
    getOwnerProgress(url);
};
const getOwnerProgress = async (url) => {
    let walkthroughResponse = await (0,_ta_x_helpers__WEBPACK_IMPORTED_MODULE_2__/* .memoizeFetch */ .FS)(url);
    let walkthroughDocument = new DOMParser().parseFromString(walkthroughResponse, 'text/html');
    const walkthroughEditors = walkthroughDocument.querySelector('.editors dl');
    const extensionArticle = extensionBody.querySelector('article');
    if (walkthroughEditors) {
        const gamersInvolved = getGamersInvolved(walkthroughEditors);
        const walkthroughEditorsWrapper = document.createElement('div');
        walkthroughEditorsWrapper.classList.add(_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorWrapperStyle */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorWrapperStyle);
        walkthroughEditorsWrapper.append(...gamersInvolved);
        extensionArticle.appendChild(walkthroughEditorsWrapper);
        const thanks = walkthroughDocument.querySelector('aside .thanks');
        if (thanks) {
            extensionArticle.appendChild(thanks);
        }
    }
    else {
        let walkthroughProgress = walkthroughDocument.querySelector('aside section .walthroughprogress');
        if (walkthroughProgress === null) {
            url = `${url}?sbonly=1`;
            walkthroughResponse = await (0,_ta_x_helpers__WEBPACK_IMPORTED_MODULE_2__/* .memoizeFetch */ .FS)(url);
            walkthroughDocument = new DOMParser().parseFromString(walkthroughResponse, 'text/html');
            walkthroughProgress = walkthroughDocument.querySelector('aside section .walthroughprogress');
            if (walkthroughProgress === null) {
                toggleAskForWalkthrough();
                return;
            }
        }
        extensionArticle.appendChild(walkthroughProgress);
        const fillCircleScript = extensionArticle.querySelector('script');
        if (fillCircleScript) {
            eval(fillCircleScript.innerHTML);
        }
    }
    const cachedWalkthroughUrls = _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Cache.walkthroughForumOwnerProgressUrl */ .Ct.walkthroughForumOwnerProgressUrl;
    const threadId = new URLSearchParams(window.location.search).get('tid');
    if (threadId && !cachedWalkthroughUrls.has(threadId)) {
        cachedWalkthroughUrls.set(threadId, url);
        _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Cache.walkthroughForumOwnerProgressUrl */ .Ct.walkthroughForumOwnerProgressUrl = cachedWalkthroughUrls;
    }
    extensionBody.setAttribute('data-ta-x-loaded', 'true');
};
const getGamersInvolved = (walkthroughEditors) => {
    let currentRow = document.createElement('div');
    currentRow.classList.add(_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorRowStyle */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorRowStyle);
    return [...walkthroughEditors.childNodes].reduce((rows, current, index, currentArray) => {
        if (current.tagName === 'DT') {
            if (currentRow.childElementCount > 0) {
                rows.push(currentRow);
                currentRow = document.createElement('div');
                currentRow.classList.add(_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorRowStyle */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorRowStyle);
            }
            currentRow.innerHTML = current.innerHTML;
        }
        else if (current.tagName === 'DD') {
            currentRow.innerHTML += `<div class="${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorStyle */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorStyle}">${current.innerHTML}</div>`;
        }
        if (index === currentArray.length - 1 && currentRow.childElementCount > 0) {
            rows.push(currentRow);
        }
        return rows;
    }, []);
};
const toggleAskForWalkthrough = () => {
    askForWalkthroughBody.classList.toggle('ta-x-hide');
    if (!askForWalkthroughBody.classList.contains('ta-x-hide')) {
        extensionBody.setAttribute('data-ta-x-loaded', 'true');
    }
    else {
        extensionBody.removeAttribute('data-ta-x-loaded');
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => {
    if (!_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .forumImprovements.walkthroughs.showOwnerProgress */ .i_.walkthroughs.showOwnerProgress)
        return;
    if (!_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .ForumRegex.Test.viewThreadUrlWithThreadId */ .wC.Test.viewThreadUrlWithThreadId())
        return;
    const pageTitle = await (0,_ta_x_utilities__WEBPACK_IMPORTED_MODULE_1__/* .waitForElement */ .br)('#oMessageThread .pagetitle');
    if (!pageTitle || pageTitle.innerText.toLowerCase() !== 'walkthroughs')
        return;
    await applyBody();
    listen();
});


/***/ }),

/***/ "./src/globals/index.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "KH": () => (/* reexport */ regex/* AchievementsRegex */.KH),
  "rt": () => (/* reexport */ regex/* AjaxRegex */.rt),
  "Ct": () => (/* reexport */ Cache),
  "gT": () => (/* reexport */ Constants),
  "wC": () => (/* reexport */ regex/* ForumRegex */.wC),
  "LG": () => (/* reexport */ regex/* GamerRegex */.LG),
  "Rv": () => (/* reexport */ regex/* GamesRegex */.Rv),
  "du": () => (/* reexport */ regex/* NewsRegex */.du),
  "EP": () => (/* reexport */ regex/* SentencesRegex */.EP),
  "nW": () => (/* reexport */ regex/* StaffRegex */.nW),
  "EF": () => (/* reexport */ achievements),
  "vc": () => (/* reexport */ config),
  "kB": () => (/* reexport */ editWalkthrough),
  "i_": () => (/* reexport */ forumImprovements),
  "TM": () => (/* reexport */ gameAchievements),
  "MF": () => (/* reexport */ gameClips),
  "rI": () => (/* reexport */ gamerImprovements),
  "Tt": () => (/* reexport */ games),
  "bc": () => (/* reexport */ gamesImprovements),
  "TS": () => (/* reexport */ regex/* getUrlProperties */.TS),
  "Ax": () => (/* reexport */ manageWalkthrough),
  "Bb": () => (/* reexport */ newsImprovements),
  "mg": () => (/* reexport */ staffWalkthroughImprovements),
  "_A": () => (/* reexport */ stickyHeader),
  "Vx": () => (/* reexport */ walkthroughPage),
  "uP": () => (/* reexport */ walkthroughPreview)
});

// UNUSED EXPORTS: DatesRegex, sales, walkthroughs

// EXTERNAL MODULE: ./src/utilities/date-util.ts
var date_util = __webpack_require__("./src/utilities/date-util.ts");
// EXTERNAL MODULE: ./src/globals/regex.ts
var regex = __webpack_require__("./src/globals/regex.ts");
;// CONCATENATED MODULE: ./src/globals/cache.ts


class Cache {
    static get memoize() {
        const value = GM_getValue('memoized', '');
        return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
    }
    static set memoize(value) {
        GM_setValue('memoized', JSON.stringify(Array.from(value.entries())));
    }
    static get walkthroughForumOwnerProgressUrl() {
        const value = GM_getValue('walkthroughOwnerProgressUrl', '');
        return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
    }
    static set walkthroughForumOwnerProgressUrl(value) {
        GM_setValue('walkthroughOwnerProgressUrl', JSON.stringify(Array.from(value.entries())));
    }
    static get walkthroughPreviewWalkthroughId() {
        const value = GM_getValue('previewWalkthroughId', '');
        return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
    }
    static set walkthroughPreviewWalkthroughId(value) {
        GM_setValue('previewWalkthroughId', JSON.stringify(Array.from(value.entries())));
    }
    static get gameAchievementsDefaultStatusPathName() {
        return GM_getValue('gameAchievementsDefaultStatusPathName', '');
    }
    static set gameAchievementsDefaultStatusPathName(value) {
        GM_setValue('gameAchievementsDefaultStatusPathName', value);
    }
    static get gameClipsDefaultStatusSelectors() {
        const value = GM_getValue('gameClipsDefaultStatusSelectors', '');
        return value.length !== 0 ? JSON.parse(value) : [];
    }
    static set gameClipsDefaultStatusSelectors(value) {
        GM_setValue('gameClipsDefaultStatusSelectors', JSON.stringify(value));
    }
    static forceClear() {
        GM_deleteValue('memoized');
        GM_deleteValue('walkthroughOwnerProgressUrl');
        GM_deleteValue('previewWalkthroughId');
    }
    static clearExpired() {
        const updatedCache = Array.from(this.memoize.entries()).filter(item => (0,date_util/* isBeforeNow */.c)(item[1].expiryTime));
        this.memoize = new Map(updatedCache);
        if (!regex/* GamesRegex.Test.achievementsUrl */.Rv.Test.achievementsUrl()) {
            GM_deleteValue('gameAchievementsDefaultStatusPathName');
        }
        if (!regex/* GamesRegex.Test.clipsUrl */.Rv.Test.clipsUrl()) {
            GM_deleteValue('gameClipsDefaultStatusSelectors');
        }
    }
    static clearLegacy() {
        GM_deleteValue('trueachievements-extra-memoized');
    }
}

;// CONCATENATED MODULE: ./src/utilities/document-util.ts
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
};
/* harmony default export */ const document_util = ({ getCookie });

;// CONCATENATED MODULE: ./src/globals/constants.ts
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;

const classStylePrefix = 'ta-x';
const jsStylePrefix = 'js-ta-x';
const variableStylePrefix = '--ta-x';
const templatePrefix = 'ta-x-template';
class Constants {
}
Constants.gamerId = getCookie('GamerID');
Constants.Styles = (_a = class {
    },
    _a.root = 'trueachievement-extras',
    _a.Components = (_b = class {
        },
        _b.accordion = `${jsStylePrefix}-accordion`,
        _b.askLoader = `${jsStylePrefix}-ask-loader-container`,
        _b.snackbar = `${jsStylePrefix}-snackbar`,
        _b.showSnackbar = `${classStylePrefix}-snackbar-show`,
        _b.AskLoader = (_c = class {
            },
            _c.featureJs = `${jsStylePrefix}-ask-loader`,
            _c.containerJs = `${_c.featureJs}-container`,
            _c.askJs = `${_c.featureJs}-ask`,
            _c.inputJs = `${_c.askJs}-input`,
            _c.buttonJs = `${_c.askJs}-button`,
            _c),
        _b),
    _a.Animations = (_d = class {
        },
        _d.yShow = `${classStylePrefix}-y-show`,
        _d.yHide = `${classStylePrefix}-y-hide`,
        _d.yHideNoTransition = `${_d.yHide}-no-transition`,
        _d),
    _a.Base = (_e = class {
        },
        _e.hide = `${classStylePrefix}-hide`,
        _e),
    _a.SettingsMenu = (_f = class {
        },
        _f.featureJs = `${jsStylePrefix}-settings-menu`,
        _f.featureStyle = `${classStylePrefix}-settings-menu`,
        _f.subSetting = `${_f.featureStyle}-sub-setting`,
        _f.wrenchJs = `${_f.featureJs}-wrench`,
        _f.closeJs = `${_f.featureJs}-close`,
        _f.versionLink = `${_f.featureJs}-version`,
        _f.changelogView = `${_f.featureJs}-changelog`,
        _f.settingsView = `${_f.featureJs}-settings`,
        _f.settingsContentShow = `${_f.featureStyle}-settings-item-show`,
        _f),
    _a.StickyHeader = (_g = class {
        },
        _g.featureJs = `${jsStylePrefix}-sticky-header`,
        _g.featureStyle = `${classStylePrefix}-sticky-header`,
        _g),
    _a.NewsImprovements = (_h = class {
        },
        _h.featureJs = `${jsStylePrefix}-news-improvements`,
        _h.featureStyle = `${classStylePrefix}-news-improvements`,
        _h.Walkthroughs = (_j = class {
            },
            _j.featureJs = `${jsStylePrefix}-forum-improvements-walkthroughs`,
            _j.featureStyle = `${classStylePrefix}-forum-improvements-walkthroughs`,
            _j.showOwnerProgressJs = `${_j.featureJs}-show-owner-progress`,
            _j.showOwnerProgressStyle = `${_j.featureStyle}-show-owner-progress`,
            _j.showOwnerProgressEditorWrapperStyle = `${_j.showOwnerProgressStyle}-editor-wrapper`,
            _j.showOwnerProgressEditorRowStyle = `${_j.showOwnerProgressStyle}-editor-row`,
            _j.showOwnerProgressEditorStyle = `${_j.showOwnerProgressStyle}-editor`,
            _j.askForWalkthroughWalkthroughJs = `${_j.showOwnerProgressJs}-ask-for-walkthrough`,
            _j.saveWalkthroughInputJs = `${_j.showOwnerProgressJs}-save-walkthrough-input`,
            _j.saveWalkthroughButtonJs = `${_j.showOwnerProgressJs}-save-walkthrough-button`,
            _j),
        _h),
    _a.GamesImprovements = (_k = class {
        },
        _k.featureJs = `${jsStylePrefix}-games-improvements`,
        _k.featureStyle = `${classStylePrefix}-games-improvements`,
        _k.highlightGamesButtonJs = `${_k.featureJs}-highlight-games-collection-button`,
        _k),
    _a.GamerImprovements = (_l = class {
        },
        _l.featureJs = `${jsStylePrefix}-gamer-improvements`,
        _l.featureStyle = `${classStylePrefix}-gamer-improvements`,
        _l.groupByGameButtonJs = `${_l.featureJs}-group-by-game-button`,
        _l),
    _a.ForumImprovements = (_m = class {
        },
        _m.featureJs = `${jsStylePrefix}-forum-improvements`,
        _m.featureStyle = `${classStylePrefix}-forum-improvements`,
        _m.Walkthroughs = (_o = class {
            },
            _o.featureJs = `${jsStylePrefix}-forum-improvements-walkthroughs`,
            _o.featureStyle = `${classStylePrefix}-forum-improvements-walkthroughs`,
            _o.showOwnerProgressJs = `${_o.featureJs}-show-owner-progress`,
            _o.showOwnerProgressStyle = `${_o.featureStyle}-show-owner-progress`,
            _o.showOwnerProgressEditorWrapperStyle = `${_o.showOwnerProgressStyle}-editor-wrapper`,
            _o.showOwnerProgressEditorRowStyle = `${_o.showOwnerProgressStyle}-editor-row`,
            _o.showOwnerProgressEditorStyle = `${_o.showOwnerProgressStyle}-editor`,
            _o.askForWalkthroughWalkthroughJs = `${_o.showOwnerProgressJs}-ask-for-walkthrough`,
            _o.saveWalkthroughInputJs = `${_o.showOwnerProgressJs}-save-walkthrough-input`,
            _o.saveWalkthroughButtonJs = `${_o.showOwnerProgressJs}-save-walkthrough-button`,
            _o),
        _m),
    _a.StaffWalkthroughImprovements = (_p = class {
        },
        _p.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements`,
        _p.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements`,
        _p.WalkthroughPage = (_q = class {
            },
            _q.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-walkthrough-page`,
            _q.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-walkthrough-page`,
            _q.containerJs = `${_q.featureJs}-container`,
            _q.containerStyle = `${_q.featureStyle}-container`,
            _q.stickyPageHistoryJs = `${_q.featureJs}-sticky-page-history`,
            _q.stickyPageHistoryStyle = `${_q.featureStyle}-sticky-page-history`,
            _q.moveButtonsToLeftStyle = `${_q.featureStyle}-move-buttons-to-left`,
            _q.walkthroughTeamButtonJs = `${_q.featureJs}-walkthrough-team-button`,
            _q),
        _p.ManageWalkthroughPage = (_r = class {
            },
            _r.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`,
            _r.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`,
            _r.containerJs = `${_r.featureJs}-container`,
            _r.containerStyle = `${_r.featureStyle}-container`,
            _r.clickableAchievementsJs = `${_r.featureJs}-clickable-achievements`,
            _r.missingButtonsContainerJs = `${_r.featureJs}-missing-buttons-container`,
            _r.addPageButtonJs = `${_r.featureJs}-add-page-button`,
            _r.previewButtonJs = `${_r.featureJs}-preview-button`,
            _r.viewContentButtonJs = `${_r.featureJs}-view-content-button`,
            _r.readyForReviewButtonJs = `${_r.featureJs}-ready-for-review-button`,
            _r),
        _p.EditWalkthroughPage = (_s = class {
            },
            _s.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`,
            _s.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`,
            _s.containerJs = `${_s.featureJs}-container`,
            _s.containerStyle = `${_s.featureStyle}-container`,
            _s.improvedImageSelectorJs = `${_s.featureJs}-improved-image-selector`,
            _s.improvedImageSelectorStyle = `${_s.featureStyle}-improved-image-selector`,
            _s.improvedImageSelectorContainerJs = `${_s.improvedImageSelectorJs}-container`,
            _s.improvedImageSelectorContainerStyle = `${_s.improvedImageSelectorStyle}-container`,
            _s.improvedImageSelectorImageTitleJs = `${_s.improvedImageSelectorJs}-image-title`,
            _s.improvedImageSelectorImageTitleStyle = `${_s.improvedImageSelectorStyle}-image-title`,
            _s.themeToggleJs = `${_s.featureJs}-theme-toggle`,
            _s.themeToggleStyle = `${_s.featureStyle}-theme-toggle`,
            _s.themeToggleDarkStyle = `${_s.themeToggleStyle}-dark`,
            _s.themeToggleLightStyle = `${_s.themeToggleStyle}-light`,
            _s.stickyTinymceToolbarJs = `${_s.featureJs}-sticky-tinymce-toolbar`,
            _s.stickyTinymceToolbarStyles = `${_s.featureStyle}-sticky-tinymce-toolbar`,
            _s),
        _p.WalkthroughPreview = (_t = class {
            },
            _t.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-walkthrough-preview`,
            _t.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-walkthrough-preview`,
            _t.populateAsideContentJs = `${_t.featureJs}-populate-aside-content`,
            _t.populateAsideContentWalkthroughPagesJs = `${_t.populateAsideContentJs}-walkthrough-pages`,
            _t.populateAsideContentWalkthroughThanksJs = `${_t.populateAsideContentJs}-walkthrough-thanks`,
            _t.populateAsideContentWalkthroughAchievementsJs = `${_t.populateAsideContentJs}-walkthrough-achievements`,
            _t),
        _p),
    _a.Variables = (_u = class {
        },
        _u.StickyHeader = (_v = class {
            },
            _v.featureVariableStylePrefix = `${variableStylePrefix}-sticky-header`,
            _v.height = `${_v.featureVariableStylePrefix}-height`,
            _v),
        _u.StaffWalkthroughImprovements = (_w = class {
            },
            _w.WalkthroughPage = (_x = class {
                },
                _x.featureVariableStylePrefix = `${variableStylePrefix}-staff-walkthrough-improvements-walkthrough-page`,
                _x.stickyPageHistoryTop = `${_x.featureVariableStylePrefix}-sticky-page-history-top`,
                _x),
            _w.EditWalkthroughPage = (_y = class {
                },
                _y.featureVariableStylePrefix = `${variableStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`,
                _y.stickyTinymceToolbarWidth = `${_y.featureVariableStylePrefix}-sticky-tinymce-toolbar-width`,
                _y.stickyTinymceToolbarTop = `${_y.featureVariableStylePrefix}-sticky-tinymce-toolbar-top`,
                _y.stickyTinymceToolbarFloatingMenu = `${_y.featureVariableStylePrefix}-sticky-tinymce-toolbar-floating-menu`,
                _y),
            _w),
        _u),
    _a);
Constants.Templates = (_z = class {
    },
    _z.StaffWalkthroughImprovements = (_0 = class {
        },
        _0.ManageWalkthroughPage = (_1 = class {
            },
            _1.featureTemplatePrefix = `${templatePrefix}-manage-walkthrough`,
            _1.achievementRow = `${_1.featureTemplatePrefix}-achievement-row`,
            _1),
        _0.WalkthroughPreview = (_2 = class {
            },
            _2.featureTemplatePrefix = `${templatePrefix}-walkthrough-preview`,
            _2.walkthroughPagesSummary = `${_2.featureTemplatePrefix}-walkthrough-pages-summary`,
            _2.walkthroughPagesNumbered = `${_2.featureTemplatePrefix}-walkthrough-pages-numbered`,
            _2.walkthroughPagesNumberedSelected = `${_2.featureTemplatePrefix}-walkthrough-pages-numbered-selected`,
            _2.walkthroughAchievements = `${_2.featureTemplatePrefix}-walkthrough-achievements`,
            _2),
        _0),
    _z);

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
    set enabled(value) { GM_setValue('stickyHeader-enabled', value); },
    get remainStuck() { return GM_getValue('stickyHeader-remainStuck', false); },
    set remainStuck(value) { GM_setValue('stickyHeader-remainStuck', value); }
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
    get addMissingButtons() { return GM_getValue('addMissingButtons', false); },
    set addMissingButtons(value) { GM_setValue('addMissingButtons', value); },
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
const walkthroughPreview = {
    get populateAsideContent() { return GM_getValue('populateAsideContent', false); },
    set populateAsideContent(value) { GM_setValue('populateAsideContent', value); }
};
const staffWalkthroughImprovements = {
    get enabled() { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-enabled', 'staffWalkthroughImprovements-enabled', false); },
    set enabled(value) { GM_setValue('staffWalkthroughImprovements-enabled', value); },
    editWalkthrough,
    manageWalkthrough,
    walkthroughPage,
    walkthroughPreview
};
const walkthroughs = {
    get showOwnerProgress() { return GM_getValue('showOwnerProgress', false); },
    set showOwnerProgress(value) { GM_setValue('showOwnerProgress', value); }
};
const forumImprovements = {
    get enabled() { return GM_getValue('forumImprovements-enabled', false); },
    set enabled(value) { GM_setValue('forumImprovements-enabled', value); },
    walkthroughs
};
const sales = {
    get autoSortBy() { return GM_getValue('autoSortBy', false); },
    set autoSortBy(value) { GM_setValue('autoSortBy', value); },
    get autoSortByValue() {
        const value = GM_getValue('autoSortByValue', '');
        return value.length !== 0 ? JSON.parse(value) : ['product', 'game'];
    },
    set autoSortByValue(value) { GM_setValue('autoSortByValue', JSON.stringify(value)); },
    get autoSortByOrder() { return GM_getValue('autoSortByOrder', 'asc'); },
    set autoSortByOrder(value) { GM_setValue('autoSortByOrder', value); }
};
const newsImprovements = {
    get enabled() { return GM_getValue('newsImprovements-enabled', false); },
    set enabled(value) { GM_setValue('newsImprovements-enabled', value); },
    sales
};
const games = {
    get addHighlightGamesNotInCollectionButton() { return GM_getValue('addHighlightGamesNotInCollectionButton-enabled', false); },
    set addHighlightGamesNotInCollectionButton(value) { GM_setValue('addHighlightGamesNotInCollectionButton-enabled', value); }
};
const gameAchievements = {
    get gameAchievementsDefaultStatus() { return GM_getValue('gameAchievementsDefaultStatus', false); },
    set gameAchievementsDefaultStatus(value) { GM_setValue('gameAchievementsDefaultStatus', value); },
    get gameAchievementsDefaultStatusValue() { return GM_getValue('gameAchievementsDefaultStatusValue', 'rdoAllAchievements'); },
    set gameAchievementsDefaultStatusValue(value) { GM_setValue('gameAchievementsDefaultStatusValue', value); }
};
const gameClips = {
    get gameClipsDefaultStatus() { return GM_getValue('gameClipsDefaultStatus', false); },
    set gameClipsDefaultStatus(value) { GM_setValue('gameClipsDefaultStatus', value); },
    get gameClipsDefaultRecordedByValue() { return GM_getValue('gameClipsDefaultRecordedByValue', ''); },
    set gameClipsDefaultRecordedByValue(value) { GM_setValue('gameClipsDefaultRecordedByValue', value); },
    get gameClipsDefaultSavedByValue() { return GM_getValue('gameClipsDefaultSavedByValue', 'Gamer'); },
    set gameClipsDefaultSavedByValue(value) { GM_setValue('gameClipsDefaultSavedByValue', value); },
    get gameClipsDefaultRecordedValue() { return GM_getValue('gameClipsDefaultRecordedValue', '7'); },
    set gameClipsDefaultRecordedValue(value) { GM_setValue('gameClipsDefaultRecordedValue', value); },
    get gameClipsDefaultSortByValue() { return GM_getValue('gameClipsDefaultSortByValue', 'Most viewed'); },
    set gameClipsDefaultSortByValue(value) { GM_setValue('gameClipsDefaultSortByValue', value); }
};
const gamesImprovements = {
    get enabled() { return GM_getValue('gamesImprovements-enabled', false); },
    set enabled(value) { GM_setValue('gamesImprovements-enabled', value); },
    games,
    achievements: gameAchievements,
    clips: gameClips
};
const achievements = {
    get addGroupByGameButton() { return GM_getValue('addGroupByGameButton-enabled', false); },
    set addGroupByGameButton(value) { GM_setValue('addGroupByGameButton-enabled', value); }
};
const gamerImprovements = {
    get enabled() { return GM_getValue('gamerImprovements-enabled', false); },
    set enabled(value) { GM_setValue('gamerImprovements-enabled', value); },
    achievements
};
const config = {
    stickyHeader,
    staffWalkthroughImprovements,
    forumImprovements,
    newsImprovements,
    gamesImprovements,
    gamerImprovements
};

;// CONCATENATED MODULE: ./src/globals/index.ts






/***/ }),

/***/ "./src/globals/regex.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BL": () => (/* binding */ DatesRegex),
/* harmony export */   "EP": () => (/* binding */ SentencesRegex),
/* harmony export */   "KH": () => (/* binding */ AchievementsRegex),
/* harmony export */   "LG": () => (/* binding */ GamerRegex),
/* harmony export */   "Rv": () => (/* binding */ GamesRegex),
/* harmony export */   "TS": () => (/* binding */ getUrlProperties),
/* harmony export */   "du": () => (/* binding */ NewsRegex),
/* harmony export */   "nW": () => (/* binding */ StaffRegex),
/* harmony export */   "rt": () => (/* binding */ AjaxRegex),
/* harmony export */   "wC": () => (/* binding */ ForumRegex)
/* harmony export */ });
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
const achievementUrlWithGamerId = new RegExp('^/a[0-9]*/.*\\?gamerid=[0-9]*', 'i');
const achievementsUrl = new RegExp('^/game/.*/achievements$', 'i');
const clipsUrl = new RegExp('^/game/.*/videos$', 'i');
const achievementsUrlWithGamerId = new RegExp('^/game/.*/achievements\\?gamerid=[0-9]*', 'i');
const walkthroughUrl = new RegExp('^/game/.*/walkthrough$', 'i');
const gamesUrl = new RegExp('^/games.aspx', 'i');
const gameUrl = new RegExp('^/game/.*$', 'i');
const editWalkthroughUrl = new RegExp('^/staff/walkthrough/editwalkthroughpage.aspx', 'i');
const manageWalkthroughUrl = new RegExp('^/staff/walkthrough/managewalkthrough.aspx', 'i');
const manageWalkthroughUrlWithWalkthroughId = new RegExp('^/staff/walkthrough/managewalkthrough.aspx\\?walkthroughid=[0-9]*', 'i');
const walkthroughPageUrl = new RegExp('^/staff/walkthrough/walkthroughpage.aspx', 'i');
const walkthroughPreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpreview.aspx', 'i');
const walkthroughPreviewUrlWithWalkthroughId = new RegExp('^/staff/walkthrough/walkthroughpreview.aspx\\?walkthroughid=[0-9]*', 'i');
const walkthroughPagePreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx', 'i');
const walkthroughPagePreviewUrlWithPageId = new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx\\?pageid=[0-9]*', 'i');
const autosave = new RegExp('^/ajaxfunctions.aspx/AutoSave', 'i');
const forumsUrl = new RegExp('^/forum/forums.aspx', 'i');
const viewBoardUrlWithBoardId = new RegExp('^/forum/viewboard.aspx\\?messageboardid=[0-9]*', 'i');
const viewThreadUrlWithThreadId = new RegExp('^/forum/viewthread.aspx\\?tid=[0-9]*', 'i');
const newsUrl = new RegExp('^/n[0-9]*/*', 'i');
const gamerUrl = new RegExp('^/gamer/.*$', 'i');
const gamerAchievementsUrl = new RegExp('^/gamer/.*/achievements$', 'i');
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
    achievementsUrlWithGamerId,
    clipsUrl,
    gameUrl,
    gamesUrl,
    walkthroughUrl,
    Test: {
        achievementsUrl: (str = window.location.href) => achievementsUrl.test(getUrlProperties(str, 'pathname')),
        achievementsUrlWithGamerId: (str = window.location.href) => achievementsUrlWithGamerId.test(getUrlProperties(str, ['pathname', 'search'])),
        clipsUrl: (str = window.location.href) => clipsUrl.test(getUrlProperties(str, 'pathname')),
        gameUrl: (str = window.location.href) => gameUrl.test(getUrlProperties(str, 'pathname')),
        gamesUrl: (str = window.location.href) => gamesUrl.test(getUrlProperties(str, 'pathname')),
        walkthroughUrl: (str = window.location.href) => walkthroughUrl.test(getUrlProperties(str, 'pathname'))
    }
};
const GamerRegex = {
    gamerUrl,
    gamerAchievementsUrl,
    Test: {
        all: (str = window.location.href) => gamerUrl.test(getUrlProperties(str, 'pathname')) ||
            gamerAchievementsUrl.test(getUrlProperties(str, 'pathname')),
        gamerUrl: (str = window.location.href) => gamerUrl.test(getUrlProperties(str, 'pathname')),
        gamerAchievementsUrl: (str = window.location.href) => gamerAchievementsUrl.test(getUrlProperties(str, 'pathname'))
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
        walkthroughPreviewUrlWithWalkthroughId,
        walkthroughPagePreviewUrl,
        walkthroughPagePreviewUrlWithPageId,
        Test: {
            all: (str = window.location.href) => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')) ||
                manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPageUrl.test(getUrlProperties(str, 'pathname')) ||
                walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
            preview: (str = window.location.href) => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
            editWalkthroughUrl: (str = window.location.href) => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
            manageWalkthroughUrl: (str = window.location.href) => manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
            manageWalkthroughUrlWithWalkthroughId: (str = window.location.href) => manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname', 'search'])),
            walkthroughPageUrl: (str = window.location.href) => walkthroughPageUrl.test(getUrlProperties(str, 'pathname')),
            walkthroughPreviewUrl: (str = window.location.href) => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')),
            walkthroughPreviewUrlWithWalkthroughId: (str = window.location.href) => walkthroughPreviewUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname', 'search'])),
            walkthroughPagePreviewUrl: (str = window.location.href) => walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
            walkthroughPagePreviewUrlWithPageId: (str = window.location.href) => walkthroughPagePreviewUrlWithPageId.test(getUrlProperties(str, ['pathname', 'search']))
        }
    }
};
const ForumRegex = {
    forumsUrl,
    viewBoardUrlWithBoardId,
    viewThreadUrlWithThreadId,
    Test: {
        all: (str = window.location.href) => forumsUrl.test(getUrlProperties(str, 'pathname')) ||
            viewBoardUrlWithBoardId.test(getUrlProperties(str, ['pathname', 'search'])) ||
            viewThreadUrlWithThreadId.test(getUrlProperties(str, ['pathname', 'search'])),
        forumsUrl: (str = window.location.href) => forumsUrl.test(getUrlProperties(str, 'pathname')),
        viewBoardUrlWithBoardId: (str = window.location.href) => viewBoardUrlWithBoardId.test(getUrlProperties(str, ['pathname', 'search'])),
        viewThreadUrlWithThreadId: (str = window.location.href) => viewThreadUrlWithThreadId.test(getUrlProperties(str, ['pathname', 'search']))
    }
};
const NewsRegex = {
    newsUrl,
    Test: {
        newsUrl: (str = window.location.href) => newsUrl.test(getUrlProperties(str, 'pathname'))
    }
};
const DatesRegex = {
    today: new RegExp('Today', 'i'),
    yesterday: new RegExp('Yesterday', 'i')
};
const SentencesRegex = {
    discussWalkthrough: new RegExp('^Please use this thread to discuss the .* walkthrough?.$'),
    walkthroughPublished: new RegExp('^The walkthrough has now been published.(?:\\n\\n)?You can find it here: .* Walkthrough?.$')
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
    AchievementsRegex,
    GamesRegex,
    GamerRegex,
    StaffRegex,
    ForumRegex,
    DatesRegex,
    SentencesRegex,
    NewsRegex
});


/***/ }),

/***/ "./src/helpers/index.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "vN": () => (/* reexport */ applyStickyElementStyle),
  "Nu": () => (/* reexport */ dispatch_event),
  "FS": () => (/* reexport */ memoizeFetch),
  "XK": () => (/* reexport */ template),
  "C4": () => (/* reexport */ until),
  "Dc": () => (/* reexport */ wait)
});

// UNUSED EXPORTS: fetch

// EXTERNAL MODULE: ./src/globals/index.ts + 4 modules
var globals = __webpack_require__("./src/globals/index.ts");
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

// EXTERNAL MODULE: ./src/utilities/date-util.ts
var date_util = __webpack_require__("./src/utilities/date-util.ts");
;// CONCATENATED MODULE: ./src/helpers/fetch.ts
/* harmony default export */ const helpers_fetch = (async (url, options = {}) => {
    options.headers = options.headers || new Headers();
    options.method = (options.method) ? options.method.toUpperCase() : 'GET';
    const response = await fetch(url, options);
    return response;
});

;// CONCATENATED MODULE: ./src/helpers/memoize-fetch.ts




const cachedCalls = globals/* Cache.memoize */.Ct.memoize;
const memoizeFetch = async (url, fetchOpts = {}, memoizeOptions) => {
    const cachedRequest = cachedCalls.get(url);
    if (cachedRequest && (0,date_util/* isBeforeNow */.c)(new Date(cachedRequest.expiryTime))) {
        return cachedRequest.response;
    }
    const response = await helpers_fetch(url, fetchOpts);
    const body = await response.text();
    cachedCalls.set(url, new MemoizedFetch(memoizeOptions).setResponse(body));
    globals/* Cache.memoize */.Ct.memoize = cachedCalls;
    return body;
};

;// CONCATENATED MODULE: ./src/helpers/template.ts
const wrapper = document.createElement('template');
const template = (el, opts = {}) => {
    const { element, urls, populateAsideContentPreviewPage, populateAsideContentPreviewAchievement, populateAsideContentPreviewThanks } = opts;
    wrapper.appendChild(el);
    wrapper.innerHTML = el.outerHTML
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/{GM_info.script.version}/g, GM_info.script.version || '')
        .replace(/{element.title}/g, element?.title || '')
        .replace(/{urls.walkthroughPreviewWithWalkthroughId}/g, urls?.walkthroughPreviewWithWalkthroughId || '')
        .replace(/{urls.walkthroughPreviewWithPageId}/g, urls?.walkthroughPreviewWithPageId || '')
        .replace(/{urls.walkthroughPreviewWithPageIdAndAchievementId}/g, urls?.walkthroughPreviewWithPageIdAndAchievementId || '')
        .replace(/{populateAsideContentPreviewPage.index}/g, populateAsideContentPreviewPage?.index.toString() || '')
        .replace(/{populateAsideContentPreviewPage.title}/g, populateAsideContentPreviewPage?.title || '')
        .replace(/{populateAsideContentPreviewPage.id}/g, populateAsideContentPreviewPage?.id || '')
        .replace(/{populateAsideContentPreviewAchievement.title}/g, populateAsideContentPreviewAchievement?.title || '')
        .replace(/{populateAsideContentPreviewAchievement.id}/g, populateAsideContentPreviewAchievement?.id || '')
        .replace(/{populateAsideContentPreviewAchievement.description}/g, populateAsideContentPreviewAchievement?.description || '')
        .replace(/{populateAsideContentPreviewAchievement.src}/g, populateAsideContentPreviewAchievement?.src || '')
        .replace(/{populateAsideContentPreviewThanks.total}/g, populateAsideContentPreviewThanks?.total || '')
        .replace(/{populateAsideContentPreviewThanks.thread}/g, populateAsideContentPreviewThanks?.thread || '')
        .replace(/{element.outerHTML}/g, element?.outerHTML || '');
    const newElement = wrapper.content.firstChild;
    wrapper.innerHTML = '';
    return newElement;
};

;// CONCATENATED MODULE: ./src/helpers/wait.ts
const until = async (f, timeoutMs = 10000) => {
    return new Promise(resolve => {
        const timeWas = new Date();
        const wait = setInterval(() => {
            if (f()) {
                clearInterval(wait);
                resolve(true);
            }
            else if (+new Date() - +timeWas > timeoutMs) {
                clearInterval(wait);
                resolve(false);
            }
        }, 20);
    });
};
const wait = async (timeoutMs = 250) => new Promise(resolve => setTimeout(resolve, timeoutMs));

// EXTERNAL MODULE: ./src/utilities/html-element-util.ts
var html_element_util = __webpack_require__("./src/utilities/html-element-util.ts");
;// CONCATENATED MODULE: ./src/helpers/sticky.ts


const stickyNavBarEnabled = globals/* stickyHeader.enabled */._A.enabled;
const stickyNavBarStuck = globals/* stickyHeader.remainStuck */._A.remainStuck;
let stickyNavBarElement;
const setStickyNavElement = async () => {
    if (stickyNavBarElement)
        return;
    stickyNavBarElement = stickyNavBarEnabled
        ? await (0,html_element_util/* waitForElement */.br)(`.${globals/* Constants.Styles.StickyHeader.featureJs */.gT.Styles.StickyHeader.featureJs}`)
        : await (0,html_element_util/* waitForElement */.br)('.header');
};
const applyStickyElementStyle = async (variableProperty, stickyElement, containerElement, opts = {}) => {
    await setStickyNavElement();
    let addAnimation;
    let removeAnimation = [globals/* Constants.Styles.Animations.yShow */.gT.Styles.Animations.yShow, globals/* Constants.Styles.Animations.yHide */.gT.Styles.Animations.yHide, globals/* Constants.Styles.Animations.yHideNoTransition */.gT.Styles.Animations.yHideNoTransition];
    let topStylePx = opts.paddingFromTop || 0;
    const containerTop = containerElement.getBoundingClientRect().top;
    if (containerTop > 0) {
        topStylePx = 0;
    }
    else {
        topStylePx += opts.isRelativeToParent ? 0 : Math.abs(containerTop);
        if (stickyNavBarEnabled) {
            topStylePx += stickyNavBarElement.offsetHeight;
            if (!stickyNavBarElement.classList.contains(globals/* Constants.Styles.Animations.yShow */.gT.Styles.Animations.yShow) && !stickyNavBarStuck) {
                addAnimation = opts.noTransitionStyle ? globals/* Constants.Styles.Animations.yHideNoTransition */.gT.Styles.Animations.yHideNoTransition : globals/* Constants.Styles.Animations.yHide */.gT.Styles.Animations.yHide;
                removeAnimation = [globals/* Constants.Styles.Animations.yShow */.gT.Styles.Animations.yShow];
            }
            else {
                addAnimation = globals/* Constants.Styles.Animations.yShow */.gT.Styles.Animations.yShow;
                removeAnimation = [globals/* Constants.Styles.Animations.yHide */.gT.Styles.Animations.yHide, globals/* Constants.Styles.Animations.yHideNoTransition */.gT.Styles.Animations.yHideNoTransition];
            }
        }
    }
    document.documentElement.style.setProperty(variableProperty, `${topStylePx}px`);
    stickyElement.classList.remove(...removeAnimation);
    if (addAnimation)
        stickyElement.classList.add(addAnimation);
};
/* harmony default export */ const sticky = ({ applyStickyElementStyle });

;// CONCATENATED MODULE: ./src/helpers/dispatch-event.ts
/* harmony default export */ const dispatch_event = ((eventType, element, opts) => {
    const eventOpts = Object.assign({
        bubbles: true,
        cancelable: eventType === 'click',
        detail: null
    }, opts);
    if (eventOpts.detail) {
        if (typeof (CustomEvent) === 'function') {
            element.dispatchEvent(new CustomEvent(eventType, eventOpts));
        }
        else {
            const event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventType, eventOpts.bubbles, eventOpts.cancelable, eventOpts.detail);
            element.dispatchEvent(event);
        }
    }
    else {
        if (typeof (Event) === 'function') {
            element.dispatchEvent(new Event(eventType, eventOpts));
        }
        else {
            const event = document.createEvent('Event');
            event.initEvent(eventType, eventOpts.bubbles, eventOpts.cancelable);
            element.dispatchEvent(event);
        }
    }
});

;// CONCATENATED MODULE: ./src/helpers/index.ts








/***/ }),

/***/ "./src/utilities/date-util.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "J": () => (/* binding */ isValid),
/* harmony export */   "c": () => (/* binding */ isBeforeNow)
/* harmony export */ });
const getDate = (date) => typeof (date) === 'string' ? new Date(date) : date;
const isValid = (date) => new Date(getDate(date)).toString().toLowerCase() !== 'invalid date';
const isBeforeNow = (date) => new Date() < getDate(date);


/***/ }),

/***/ "./src/utilities/html-element-util.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HM": () => (/* binding */ getElementCoordinates),
/* harmony export */   "PT": () => (/* binding */ isCheckboxElement),
/* harmony export */   "Wi": () => (/* binding */ isSelectElement),
/* harmony export */   "br": () => (/* binding */ waitForElement),
/* harmony export */   "gz": () => (/* binding */ classListContains)
/* harmony export */ });
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


/***/ }),

/***/ "./src/utilities/index.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Eh": () => (/* reexport */ allConcurrently),
  "gz": () => (/* reexport */ html_element_util/* classListContains */.gz),
  "QF": () => (/* reexport */ string_util/* extractAllBetween */.QF),
  "_o": () => (/* reexport */ string_util/* extractBetween */._o),
  "VB": () => (/* reexport */ getDuplicates),
  "HM": () => (/* reexport */ html_element_util/* getElementCoordinates */.HM),
  "NA": () => (/* reexport */ getValue),
  "PT": () => (/* reexport */ html_element_util/* isCheckboxElement */.PT),
  "Wi": () => (/* reexport */ html_element_util/* isSelectElement */.Wi),
  "sO": () => (/* reexport */ setValue),
  "AM": () => (/* reexport */ string_util/* toBool */.AM),
  "Hq": () => (/* reexport */ string_util/* toInt */.Hq),
  "br": () => (/* reexport */ html_element_util/* waitForElement */.br)
});

// UNUSED EXPORTS: isBeforeNow, isValid, promisify, toDate

;// CONCATENATED MODULE: ./src/utilities/array-util.ts
const getDuplicates = (arr, unique = false) => (unique
    ? [...new Set(arr.filter((e, i, a) => a.indexOf(e) !== i))]
    : arr.filter((e, i, a) => a.indexOf(e) !== i));

// EXTERNAL MODULE: ./src/utilities/html-element-util.ts
var html_element_util = __webpack_require__("./src/utilities/html-element-util.ts");
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

// EXTERNAL MODULE: ./src/utilities/string-util.ts
var string_util = __webpack_require__("./src/utilities/string-util.ts");
;// CONCATENATED MODULE: ./src/utilities/object-util.ts
const getValue = (object, path, defaultValue) => path
    .split('.')
    .reduce((o, p) => o ? o[p] : defaultValue, object);
const setValue = (object, path, value) => path
    .split('.')
    .reduce((o, p, i) => o[p] = path.split('.').length === ++i ? value : o[p] || {}, object);

;// CONCATENATED MODULE: ./src/utilities/index.ts








/***/ }),

/***/ "./src/utilities/string-util.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AM": () => (/* binding */ toBool),
/* harmony export */   "Hq": () => (/* binding */ toInt),
/* harmony export */   "QF": () => (/* binding */ extractAllBetween),
/* harmony export */   "_o": () => (/* binding */ extractBetween)
/* harmony export */ });
/* unused harmony export toDate */
/* harmony import */ var _globals_regex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/globals/regex.ts");
/* harmony import */ var _date_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utilities/date-util.ts");


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
    if (_globals_regex__WEBPACK_IMPORTED_MODULE_0__/* .DatesRegex.today.test */ .BL.today.test(value)) {
        return today;
    }
    if (_globals_regex__WEBPACK_IMPORTED_MODULE_0__/* .DatesRegex.yesterday.test */ .BL.yesterday.test(value)) {
        return yesterday;
    }
    return (0,_date_util__WEBPACK_IMPORTED_MODULE_1__/* .isValid */ .J)(value) ? new Date(value) : null;
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
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
    toInt,
    toDate,
    toBool,
    extractBetween,
    extractAllBetween
});


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ./node_modules/.pnpm/ajax-interceptor@1.0.1/node_modules/ajax-interceptor/index.js
var ajax_interceptor = __webpack_require__("./node_modules/.pnpm/ajax-interceptor@1.0.1/node_modules/ajax-interceptor/index.js");
// EXTERNAL MODULE: ./src/globals/index.ts + 4 modules
var globals = __webpack_require__("./src/globals/index.ts");
// EXTERNAL MODULE: ./src/utilities/index.ts + 3 modules
var utilities = __webpack_require__("./src/utilities/index.ts");
;// CONCATENATED MODULE: ./src/components/pub-sub.ts
function PubSub() {
    const handlers = {};
    return {
        publish: (event, msg) => {
            (handlers[event] ?? []).forEach((h) => h(msg));
        },
        subscribe: (event, callback) => {
            const list = handlers[event] ?? [];
            list.push(callback);
            handlers[event] = list;
            return callback;
        },
        unsubscribe: (event, callback) => {
            let list = handlers[event] ?? [];
            list = list.filter((h) => h !== callback);
            handlers[event] = list;
        }
    };
}
/* harmony default export */ const pub_sub = (PubSub());

// EXTERNAL MODULE: ./src/helpers/index.ts + 7 modules
var helpers = __webpack_require__("./src/helpers/index.ts");
;// CONCATENATED MODULE: ./src/components/accordion.ts




const accordion = () => {
    document.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        if (!target.classList.contains(globals/* Constants.Styles.Components.accordion */.gT.Styles.Components.accordion))
            return;
        target.classList.toggle('expanded');
        if (target.hasAttribute('data-checkbox-accordion')) {
            const toggle = target.querySelector('input');
            toggle.checked = target.classList.contains('expanded');
            (0,helpers/* dispatchEvent */.Nu)('change', toggle);
        }
        const content = target.nextElementSibling;
        const parentBodyHeight = content.style.maxHeight ? -content.scrollHeight : content.scrollHeight;
        content.style.maxHeight
            ? content.style.maxHeight = null
            : content.style.maxHeight = `${content.scrollHeight}px`;
        const parentAccordionBody = target.closest('[data-parent-accordion-body]');
        if (parentAccordionBody) {
            parentAccordionBody.style.maxHeight = `${(0,utilities/* toInt */.Hq)(parentAccordionBody.style.maxHeight) + parentBodyHeight}px`;
        }
    });
    pub_sub.subscribe('accordion:setMaxHeight', (content) => {
        if (!content.style.maxHeight)
            return;
        content.style.maxHeight = `${content.scrollHeight}px`;
    });
    pub_sub.subscribe('accordion:toggleState', (header) => {
        header.classList.toggle('expanded');
        const content = header.nextElementSibling;
        content.style.maxHeight = `${content.scrollHeight}px`;
    });
};
/* harmony default export */ const components_accordion = ((/* unused pure expression or super */ null && (accordion)));

;// CONCATENATED MODULE: ./src/views/components/snackbar.html
// Module
var code = "<div class=\"ta-x-snackbar js-ta-x-snackbar\"><h2></h2></div>";
// Exports
/* harmony default export */ const components_snackbar = (code);
// EXTERNAL MODULE: ./src/utilities/html-element-util.ts
var html_element_util = __webpack_require__("./src/utilities/html-element-util.ts");
;// CONCATENATED MODULE: ./src/components/snackbar.ts




const snackbar = async () => {
    if (!await (0,html_element_util/* waitForElement */.br)('body'))
        return;
    const parsedDocument = new DOMParser().parseFromString(components_snackbar, 'text/html');
    document.body.appendChild(parsedDocument.querySelector(`.${globals/* Constants.Styles.Components.snackbar */.gT.Styles.Components.snackbar}`));
    const snackbar = document.querySelector(`.${globals/* Constants.Styles.Components.snackbar */.gT.Styles.Components.snackbar}`);
    const textContainer = snackbar.querySelector('h2');
    pub_sub.subscribe('snackbar:show', ({ text, type }) => {
        if (!snackbar)
            return;
        textContainer.innerText = text;
        textContainer.classList.add(type);
        snackbar.classList.toggle(globals/* Constants.Styles.Components.showSnackbar */.gT.Styles.Components.showSnackbar);
        setTimeout(() => {
            snackbar.classList.toggle(globals/* Constants.Styles.Components.showSnackbar */.gT.Styles.Components.showSnackbar);
            textContainer.classList.remove(type);
        }, 3000);
    });
};
/* harmony default export */ const src_components_snackbar = ((/* unused pure expression or super */ null && (snackbar)));

;// CONCATENATED MODULE: ./src/components/index.ts




// EXTERNAL MODULE: ./src/utilities/string-util.ts
var string_util = __webpack_require__("./src/utilities/string-util.ts");
;// CONCATENATED MODULE: ./src/models/conditional-render.ts

class ConditionalRender {
    constructor(json) {
        this.fromString(json);
    }
    fromString(json) {
        try {
            const parsedObj = JSON.parse(json);
            this.selector = parsedObj.selector;
            this.checked = parsedObj.checked ? (0,string_util/* toBool */.AM)(parsedObj.checked) : null;
            this.value = parsedObj.value ? parsedObj.value.split(',') : null;
        }
        catch (e) {
            this.selector = null;
            this.checked = null;
            this.value = null;
        }
    }
    isValid() {
        return this.selector !== null && (this.checked !== null || this.value !== null);
    }
    toString() {
        return JSON.stringify(this);
    }
}

;// CONCATENATED MODULE: ./src/models/index.ts



;// CONCATENATED MODULE: ./src/features/settings-menu/body.hbs
// Module
var body_code = "<div class=\"js-ta-x-settings-menu-wrench gamer-page\" aria-haspopup=\"true\"><i class=\"fa fa-wrench\"></i></div><div class=\"js-ta-x-settings-menu ta-x-settings-menu ta-x-hide\"><div class=\"middle\"><div class=\"wrap\"><div class=\"labels\"><label class=\"js-ta-x-settings-menu-close close\"><i class=\"fa fa-close\"></i></label></div><div class=\"contents\"><div class=\"contents open ta-x-settings-menu-settings\"><div class=\"t-settings js-ta-x-settings-menu-settings ta-x-settings-menu-settings-item ta-x-settings-menu-settings-item-show\"><div class=\"ta-x-checkbox\" data-render-condition><label>Sticky Header</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"stickyHeader.enabled\" id=\"chkStickyHeader\" name=\"chkStickyHeader\" type=\"checkbox\"><label for=\"chkStickyHeader\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStickyHeader\", \"checked\": true }'>This feature may cause some sticky elements to look buggy. Let me know what you spot!</p></div><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStickyHeader\", \"checked\": true }'><label>Remain Stuck</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"stickyHeader.remainStuck\" id=\"chkStickyHeaderRemainStuck\" name=\"chkStickyHeaderRemainStuck\" type=\"checkbox\"><label for=\"chkStickyHeaderRemainStuck\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Forum Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.enabled\" id=\"chkForumImprovements\" name=\"chkForumImprovements\" type=\"checkbox\"><label for=\"chkForumImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div data-render-condition='{ \"selector\": \"#chkForumImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span>Walkthroughs</span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Show Owner/Progress</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.walkthroughs.showOwnerProgress\" id=\"chkForumImprovementsShowOwnerProgress\" name=\"chkForumImprovementsShowOwnerProgress\" type=\"checkbox\"><label for=\"chkForumImprovementsShowOwnerProgress\"></label></div></div></div></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Gamer Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamerImprovements.enabled\" id=\"chkGamerImprovements\" name=\"chkGamerImprovements\" type=\"checkbox\"><label for=\"chkGamerImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div class=\"ta-x-checkbox\" data-render-condition><label>Add Group By Game Button</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamerImprovements.achievements.addGroupByGameButton\" id=\"chkGamerImprovementsGroupByGameButton\" name=\"chkGamerImprovementsGroupByGameButton\" type=\"checkbox\"><label for=\"chkGamerImprovementsGroupByGameButton\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamerImprovementsGroupByGameButton\", \"checked\": true }'>This feature is unstyled, let me know if you have any ideas for how to make this look!</p></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Games Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.enabled\" id=\"chkGamesImprovements\" name=\"chkGamesImprovements\" type=\"checkbox\"><label for=\"chkGamesImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div class=\"ta-x-checkbox\" data-render-condition><label>Add Highlight Games Not In Collection Button</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.games.addHighlightGamesNotInCollectionButton\" id=\"chkGamesImprovementsHighlightGamesNotInCollectionButton\" name=\"chkGamesImprovementsHighlightGamesNotInCollectionButton\" type=\"checkbox\"><label for=\"chkGamesImprovementsHighlightGamesNotInCollectionButton\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsHighlightGamesNotInCollectionButton\", \"checked\": true }'>This feature is unstyled, let me know if you have any ideas for how to make this look!</p></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span>Achievements</span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Game Achievements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.achievements.gameAchievementsDefaultStatus\" id=\"chkGamesImprovementsGameAchievementsDefaultStatus\" name=\"chkGamesImprovementsGameAchievementsDefaultStatus\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameAchievementsDefaultStatus\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameAchievementsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.achievements.gameAchievementsDefaultStatusValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameAchievementsDefaultStatusValue\" name=\"selGamesImprovementsGameAchievementsDefaultStatusValue\"><option selected=\"selected\" value=\"rdoAllAchievements\">All</option><option selected=\"selected\" value=\"rdoWonAchievements\">Won</option><option selected=\"selected\" value=\"rdoNotWonAchievements\">Not Won</option></select></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span>Clips</span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Game Clips</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.clips.gameClipsDefaultStatus\" id=\"chkGamesImprovementsGameClipsDefaultStatus\" name=\"chkGamesImprovementsGameClipsDefaultStatus\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameClipsDefaultStatus\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'>This feature will cause multiple page reloads if you change more than one default!</p></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultRecordedByValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultRecordedByValue\" name=\"selGamesImprovementsGameClipsDefaultRecordedByValue\"><option selected=\"selected\" value>Anyone</option><option value=\"My friends\" selected=\"selected\">My friends</option></select></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultSavedByValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultSavedByValue\" name=\"selGamesImprovementsGameClipsDefaultSavedByValue\"><option selected=\"selected\" value>Anyone</option><option selected=\"selected\" value=\"Gamer\">Gamer</option><option selected=\"selected\" value=\"Xbox\">Xbox</option></select></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultRecordedValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultRecordedValue\" name=\"selGamesImprovementsGameClipsDefaultRecordedValue\"><option selected=\"selected\" value=\"7\">This week</option><option selected=\"selected\" value=\"30\">This month</option><option selected=\"selected\" value=\"365\">This year</option><option selected=\"selected\" value=\"0\">All</option></select></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultSortByValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultSortByValue\" name=\"selGamesImprovementsGameClipsDefaultSortByValue\"><option value=\"Most viewed\" selected=\"selected\">Most viewed</option><option value=\"Most favourited\" selected=\"selected\">Most favourited</option><option value=\"Most commented\" selected=\"selected\">Most commented</option><option selected=\"selected\" value=\"Longest\">Longest</option><option selected=\"selected\" value=\"GamerTag\">GamerTag</option></select></div></div></div></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>News Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"newsImprovements.enabled\" id=\"chkNewsImprovements\" name=\"chkNewsImprovements\" type=\"checkbox\"><label for=\"chkNewsImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div data-render-condition='{ \"selector\": \"#chkNewsImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span>Sales</span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Sort Sales By</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"newsImprovements.sales.autoSortBy\" id=\"chkNewsImprovementsSalesAutoSortBy\" name=\"chkNewsImprovementsSalesAutoSortBy\" type=\"checkbox\"><label for=\"chkNewsImprovementsSalesAutoSortBy\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkNewsImprovementsSalesAutoSortBy\", \"checked\": true }'><select class=\"dropdown\" data-array-split=\",\" data-config-path=\"newsImprovements.sales.autoSortByValue\" data-is-array=\"true\" id=\"selNewsImprovementsSalesAutoSortByValue\" name=\"selNewsImprovementsSalesAutoSortByValue\"><option selected=\"selected\" value=\"product,game\">Product</option><option selected=\"selected\" value=\"sale-price\">Sale Price</option><option selected=\"selected\" value=\"discount\">Discount</option><option selected=\"selected\" value=\"completion-time\">Completion Time</option><option selected=\"selected\" value=\"ta-ratio\">TA Ratio</option></select></div><div data-render-condition='{ \"selector\": \"#chkNewsImprovementsSalesAutoSortBy\", \"checked\": true }' class=\"ta-x-hide\"><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#selNewsImprovementsSalesAutoSortByValue\", \"value\": \"completion-time,ta-ratio\" }'>This option may not work on some tables. Let me know what you spot!</p></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkNewsImprovementsSalesAutoSortBy\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"newsImprovements.sales.autoSortByOrder\" data-is-array=\"false\" id=\"selNewsImprovementsSalesAutoSortByOrder\" name=\"selNewsImprovementsSalesAutoSortByOrder\"><option selected=\"selected\" value=\"asc\">Ascendening</option><option selected=\"selected\" value=\"desc\">Descending</option></select></div></div></div></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Staff Walkthrough Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.enabled\" id=\"chkStaffWalkthroughImprovements\" name=\"chkStaffWalkthroughImprovements\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span>Edit Walkthrough</span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Improved Image Selector</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.editWalkthrough.improvedImageSelector\" id=\"chkStaffWalkthroughImprovementsImproveImageSelector\" name=\"chkStaffWalkthroughImprovementsImproveImageSelector\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsImproveImageSelector\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Auto Save Notifications</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.editWalkthrough.autoSaveNotification\" id=\"chkStaffWalkthroughImprovementsAutoSaveNotification\" name=\"chkStaffWalkthroughImprovementsAutoSaveNotification\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsAutoSaveNotification\"></label></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span>Manage Walkthrough</span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Clickable Table Links</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.clickableTableLinks\" id=\"chkStaffWalkthroughImprovementsClickableTableLinks\" name=\"chkStaffWalkthroughImprovementsClickableTableLinks\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsClickableTableLinks\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Add Missing Buttons</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.addMissingButtons\" id=\"chkStaffWalkthroughImprovementsAddPageButton\" name=\"chkStaffWalkthroughImprovementsAddPageButton\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsAddPageButton\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Auto Select First Walkthrough</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.autoSelectFirst\" id=\"chkStaffWalkthroughImprovementsAutoSelectFirst\" name=\"chkStaffWalkthroughImprovementsAutoSelectFirst\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsAutoSelectFirst\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\", \"checked\": true }'>This feature runs after the default status has been set.</p></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Manage Walkthrough</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.manageWalkthroughDefaultStatus\" id=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\" name=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.manageWalkthroughDefaultStatusValue\" data-is-array=\"false\" id=\"selStaffWalkthroughImprovementsManageWalkthroughDefaultStatusValue\" name=\"selStaffWalkthroughImprovementsManageWalkthroughDefaultStatusValue\"><option selected=\"selected\" value=\"-1\">(All)</option><option selected=\"selected\" value=\"New\">New</option><option value=\"In progress\" selected=\"selected\">In progress</option><option value=\"Ready for review\" selected=\"selected\">Ready for review</option><option value=\"Ready for publish\" selected=\"selected\">Ready for publish</option><option selected=\"selected\" value=\"Published\">Published</option><option value=\"New owner required\" selected=\"selected\">New owner required</option></select></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span>Walkthrough Page</span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Stick Page History To Left</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.stickyPageHistory\" id=\"chkStaffWalkthroughImprovementsStickyPageHistory\" name=\"chkStaffWalkthroughImprovementsStickyPageHistory\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsStickyPageHistory\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Move Buttons To The Left</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.moveButtonsToLeft\" id=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\" name=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Add Walkthrough Team Button</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.walkthroughTeamButton\" id=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\" name=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Highlight Page Locked</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.highlightPageLocked\" id=\"chkStaffWalkthroughImprovementsHighlightPageLocked\" name=\"chkStaffWalkthroughImprovementsHighlightPageLocked\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsHighlightPageLocked\"></label></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span>Walkthrough Preview</span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Populate Side Column Content</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPreview.populateAsideContent\" id=\"chkStaffWalkthroughImprovementsPopulateAsideContent\" name=\"chkStaffWalkthroughImprovementsPopulateAsideContent\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsPopulateAsideContent\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovementsPopulateAsideContent\", \"checked\": true }'>This feature only supports \"In Progress \" and \"Ready for review\" walkthroughs, let me know if you want it to support others!</p></div></div></div></div></div></div><div class=\"t-settings js-ta-x-settings-menu-changelog ta-x-settings-menu-settings-item\"><div class=\"ta-x-settings-menu-changelog-wrapper\"><h2>2.8.0</h2><ul><li><span class=\"ta-x-markdown-marker\">></span><p>Fixed walthrough preview caching, changed it to 4 hours instead of 7 days,</p></li><li><span class=\"ta-x-markdown-marker\">></span><p>Tweaked some styles on the homepage relating to highlighted articles,</p></li><li><span class=\"ta-x-markdown-marker\">></span><p>Added support for \"Ready for Review\" walkthroughs with sidebar content.</p></li><li><span class=\"ta-x-markdown-marker\">></span><p>Adds a new feature to select default values for game clips</p></li></ul><a class=\"ta-x-settings-menu-changelog-link\" href=\"https://github.com/andrewcartwright1/trueachievements-extra/blob/main/CHANGELOG.md\">See the full changelog here</a></div><div class=\"ta-x-settings-menu-credits-wrapper\"><h1>Credits</h1><ul><li><span class=\"ta-x-markdown-marker\">></span><p><a href=\"https://www.trueachievements.com/gamer/Dynamite+Andy\">Dynamite Andy</a> - Main contributor,</p></li><li><span class=\"ta-x-markdown-marker\">></span><p><a href=\"https://www.trueachievements.com/gamer/Belindo152\">Belindo152</a> for code contributions, bug reports and feature requests,</p></li><li><span class=\"ta-x-markdown-marker\">></span><p><a href=\"https://www.trueachievements.com/gamer/Amoa\">Amoa</a>, <a href=\"https://www.trueachievements.com/gamer/DynamicWolfNLD\">DynamicWolfNLD</a> and <a href=\"https://www.trueachievements.com/gamer/ManicMetalhead\">ManicMetalhead</a>, <a href=\"https://www.trueachievements.com/gamer/zr122\">zr122</a> for feature requests and bug reports,</p></li><li><span class=\"ta-x-markdown-marker\">></span><p>You for using this addon and checking out this work, thank you - it mean's alot.</p></li></ul></div></div></div><div class=\"t-settings open ta-x-settings-menu-bottom\"><ul class=\"list-links buttons\"><li><a href=\"https://github.com/andrewcartwright1/trueachievements-extra/issues/new\">Raise a Bug</a></li><li><a href=\"https://github.com/andrewcartwright1/trueachievements-extra/issues/new\">Request a Feature</a></li></ul><div class=\"title\"><span>TrueAchievements Extra</span><div class=\"ta-x-flex-break\"></div><a class=\"js-ta-x-settings-menu-version\" href=\"#\">Version {GM_info.script.version}</a></div></div></div></div></div><div class=\"js-ta-x-settings-menu-close close\"></div></div>";
// Exports
/* harmony default export */ const body = (body_code);
;// CONCATENATED MODULE: ./src/features/settings-menu/index.ts






let extensionBody;
const applyBody = async () => {
    const parsedDocument = new DOMParser().parseFromString(body, 'text/html');
    const navigationBar = await (0,utilities/* waitForElement */.br)('header nav');
    const navGamerToggle = await (0,utilities/* waitForElement */.br)('[data-tgl="nav-gamer"]', navigationBar);
    navigationBar.insertBefore(parsedDocument.querySelector(`.${globals/* Constants.Styles.SettingsMenu.wrenchJs */.gT.Styles.SettingsMenu.wrenchJs}`), navGamerToggle.nextSibling);
    const navGamer = await (0,utilities/* waitForElement */.br)('.nav-gamer');
    const templatedFeature = (0,helpers/* template */.XK)(parsedDocument.querySelector(`.${globals/* Constants.Styles.SettingsMenu.featureJs */.gT.Styles.SettingsMenu.featureJs}`));
    navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);
    addSettings();
};
const addSettings = () => {
    extensionBody = document.querySelector(`.${globals/* Constants.Styles.SettingsMenu.featureJs */.gT.Styles.SettingsMenu.featureJs}`);
    [...extensionBody.querySelectorAll('input, select')].forEach(setting => {
        const configPath = setting.getAttribute('data-config-path');
        if (!configPath)
            return;
        if ((0,utilities/* isCheckboxElement */.PT)(setting)) {
            setting.checked = (0,utilities/* getValue */.NA)(globals/* config */.vc, configPath, false);
        }
        else if ((0,utilities/* isSelectElement */.Wi)(setting)) {
            if ((0,utilities/* toBool */.AM)(setting.getAttribute('data-is-array'))) {
                setting.value = (0,utilities/* getValue */.NA)(globals/* config */.vc, configPath, []).join(setting.getAttribute('data-array-split'));
            }
            else {
                setting.value = (0,utilities/* getValue */.NA)(globals/* config */.vc, configPath, '');
            }
        }
    });
    checkRenderConditions();
};
const checkRenderConditions = (el) => {
    const querySelector = el ? `[data-render-condition*="#${el.id}"]` : '[data-render-condition]';
    [...extensionBody.querySelectorAll(querySelector)].forEach(hiddenSetting => {
        const condition = new ConditionalRender(hiddenSetting.getAttribute('data-render-condition'));
        if (!condition.isValid())
            return;
        const setting = extensionBody.querySelector(condition.selector);
        let method = null;
        if ((0,utilities/* isCheckboxElement */.PT)(setting)) {
            method = setting.checked === condition.checked ? 'remove' : 'add';
        }
        else if ((0,utilities/* isSelectElement */.Wi)(setting)) {
            if ((0,utilities/* toBool */.AM)(setting.getAttribute('data-is-array'))) {
                method = condition.value.some(val => setting.value.split(setting.getAttribute('data-array-split')).includes(val)) ? 'remove' : 'add';
            }
            else {
                method = condition.value.includes(setting.value) ? 'remove' : 'add';
            }
        }
        if (method) {
            hiddenSetting.classList[method](globals/* Constants.Styles.Base.hide */.gT.Styles.Base.hide);
        }
    });
};
const setAccordionStates = () => {
    [...extensionBody.querySelectorAll('[data-checkbox-accordion] input')].forEach(setting => {
        if ((0,utilities/* isCheckboxElement */.PT)(setting)) {
            const checkedValue = setting.checked;
            const accordionParent = setting.closest('.js-ta-x-accordion');
            if (checkedValue && accordionParent) {
                pub_sub.publish('accordion:toggleState', accordionParent);
            }
        }
    });
};
const listen = () => {
    const extensionTrigger = document.querySelector(`.${globals/* Constants.Styles.SettingsMenu.wrenchJs */.gT.Styles.SettingsMenu.wrenchJs}`);
    extensionTrigger.addEventListener('click', () => {
        extensionTrigger.classList.add('active');
        extensionBody.classList.add('nav-gamer');
        extensionBody.classList.remove(globals/* Constants.Styles.Base.hide */.gT.Styles.Base.hide);
        extensionBody.classList.add('open');
        if (extensionBody.hasAttribute('data-previously-opened'))
            return;
        extensionBody.setAttribute('data-previously-opened', '');
        setAccordionStates();
    });
    extensionBody.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        if (!target.classList.contains(globals/* Constants.Styles.SettingsMenu.closeJs */.gT.Styles.SettingsMenu.closeJs))
            return;
        extensionBody.classList.remove('open');
        extensionBody.classList.add(globals/* Constants.Styles.Base.hide */.gT.Styles.Base.hide);
        extensionBody.classList.remove('nav-gamer');
        extensionTrigger.classList.remove('active');
    });
    extensionBody.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        if (!target.classList.contains(globals/* Constants.Styles.SettingsMenu.versionLink */.gT.Styles.SettingsMenu.versionLink))
            return;
        extensionBody.querySelector(`.${globals/* Constants.Styles.SettingsMenu.changelogView */.gT.Styles.SettingsMenu.changelogView}`)
            .classList.toggle(globals/* Constants.Styles.SettingsMenu.settingsContentShow */.gT.Styles.SettingsMenu.settingsContentShow);
        extensionBody.querySelector(`.${globals/* Constants.Styles.SettingsMenu.settingsView */.gT.Styles.SettingsMenu.settingsView}`)
            .classList.toggle(globals/* Constants.Styles.SettingsMenu.settingsContentShow */.gT.Styles.SettingsMenu.settingsContentShow);
    });
    extensionBody.addEventListener('change', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        const configPath = target.getAttribute('data-config-path');
        if ((0,utilities/* isSelectElement */.Wi)(target)) {
            if ((0,utilities/* toBool */.AM)(target.getAttribute('data-is-array'))) {
                (0,utilities/* setValue */.sO)(globals/* config */.vc, configPath, target.value.split(target.getAttribute('data-array-split')));
            }
            else {
                (0,utilities/* setValue */.sO)(globals/* config */.vc, configPath, target.value);
            }
        }
        else if ((0,utilities/* isCheckboxElement */.PT)(target))
            (0,utilities/* setValue */.sO)(globals/* config */.vc, configPath, target.checked);
        checkRenderConditions(target);
        let parentAccordionBody = target.closest('.ta-x-settings-menu-settings-accordion-body');
        if (parentAccordionBody)
            pub_sub.publish('accordion:setMaxHeight', parentAccordionBody);
        setTimeout(() => {
            parentAccordionBody = target.closest('[data-parent-accordion-body]');
            if (parentAccordionBody)
                pub_sub.publish('accordion:setMaxHeight', parentAccordionBody);
        }, 500);
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
    sticky_header_extensionBody = await (0,utilities/* waitForElement */.br)('header');
    const fakeElement = document.createElement('div');
    fakeElement.style.height = `${sticky_header_extensionBody.offsetHeight}px`;
    sticky_header_extensionBody.parentNode.insertBefore(fakeElement, sticky_header_extensionBody);
    sticky_header_extensionBody.classList.add(globals/* Constants.Styles.StickyHeader.featureJs */.gT.Styles.StickyHeader.featureJs, globals/* Constants.Styles.StickyHeader.featureStyle */.gT.Styles.StickyHeader.featureStyle);
    document.documentElement.style.setProperty(globals/* Constants.Styles.Variables.StickyHeader.height */.gT.Styles.Variables.StickyHeader.height, `${sticky_header_extensionBody.offsetHeight}px`);
    if (!globals/* stickyHeader.remainStuck */._A.remainStuck && !atTopOfPage()) {
        sticky_header_extensionBody.classList.add(globals/* Constants.Styles.Animations.yHideNoTransition */.gT.Styles.Animations.yHideNoTransition);
    }
};
const sticky_header_listen = async () => {
    if (globals/* stickyHeader.remainStuck */._A.remainStuck)
        return;
    const navGamer = await (0,utilities/* waitForElement */.br)(`.nav-gamer:not(.${globals/* Constants.Styles.SettingsMenu.featureJs */.gT.Styles.SettingsMenu.featureJs})`);
    const taxSettingsMenu = await (0,utilities/* waitForElement */.br)(`.${globals/* Constants.Styles.SettingsMenu.featureJs */.gT.Styles.SettingsMenu.featureJs}`);
    previousMenuOpen = navGamer.classList.contains('open') || taxSettingsMenu.classList.contains('open');
    window.addEventListener('scroll', () => {
        const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (atTopOfPage()) {
            sticky_header_extensionBody.classList.remove(globals/* Constants.Styles.Animations.yHide */.gT.Styles.Animations.yHide, globals/* Constants.Styles.Animations.yHideNoTransition */.gT.Styles.Animations.yHideNoTransition);
        }
        else {
            const searchElement = sticky_header_extensionBody.querySelector('#divtxtSearchContainer');
            if (searchElement.style.display !== 'inline' && !(0,utilities/* toBool */.AM)(sticky_header_extensionBody.dataset.menuOpen)) {
                if (previousScrollTop > currentScrollTop) {
                    sticky_header_extensionBody.classList.remove(globals/* Constants.Styles.Animations.yHide */.gT.Styles.Animations.yHide, globals/* Constants.Styles.Animations.yHideNoTransition */.gT.Styles.Animations.yHideNoTransition);
                    sticky_header_extensionBody.classList.add(globals/* Constants.Styles.Animations.yShow */.gT.Styles.Animations.yShow);
                }
                else if (previousScrollTop < currentScrollTop) {
                    sticky_header_extensionBody.classList.remove(globals/* Constants.Styles.Animations.yShow */.gT.Styles.Animations.yShow);
                    sticky_header_extensionBody.classList.add(globals/* Constants.Styles.Animations.yHide */.gT.Styles.Animations.yHide);
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
    if (!globals/* stickyHeader.enabled */._A.enabled)
        return;
    await sticky_header_applyBody();
    await sticky_header_listen();
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/manage-walkthrough.html
// Module
var manage_walkthrough_code = "<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\"></div><a class=\"button js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-ready-for-review-button\" onclick='return Postback(\"btnReadyForReview_click\"),!1' title=\"Ready for review\" href=\"#\" id=\"btnReadyForReview\"> <img alt=\"Ready for review\" title=\"Ready for review\" src=\"/images/icons/tick.png\"> Ready for review </a><div class=\"buttons js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-missing-buttons-container\"><a class=\"button js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-add-page-button\"> <img alt=\"Add page\" title=\"Add page\" height=\"16\" src=\"/images/icons/addtotrophycasesmall.png\" width=\"16\"> <span>Add page</span> </a><a class=\"button js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-preview-button\"> <img alt=\"Preview\" height=\"16\" src=\"/images/icons/previewwalkthrough.png\" title=\"Preview\" width=\"16\"> <span>Preview</span> </a><a class=\"button js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-view-content-button\"> <img alt=\"View and edit content\" title=\"View and edit content\" height=\"16\" src=\"/images/icons/previewwalkthrough.png\" width=\"16\"> <span>View and edit content</span> </a></div>";
// Exports
/* harmony default export */ const manage_walkthrough = (manage_walkthrough_code);
// EXTERNAL MODULE: ./src/globals/regex.ts
var regex = __webpack_require__("./src/globals/regex.ts");
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/default-status.ts



const changeToDefaultStatus = async () => {
    if (!globals/* manageWalkthrough.manageWalkthroughDefaultStatus */.Ax.manageWalkthroughDefaultStatus)
        return;
    if (regex/* StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId */.nW.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId())
        return;
    const status = await (0,utilities/* waitForElement */.br)('#ddlStatusFilter');
    if (status.querySelector('[selected]') === null &&
        status.value !== globals/* manageWalkthrough.manageWalkthroughDefaultStatusValue */.Ax.manageWalkthroughDefaultStatusValue) {
        status.value = globals/* manageWalkthrough.manageWalkthroughDefaultStatusValue */.Ax.manageWalkthroughDefaultStatusValue;
        status.onchange(null);
    }
};
/* harmony default export */ const default_status = ({ changeToDefaultStatus });

;// CONCATENATED MODULE: ./src/views/templates/manage-walkthrough-achievement-row.html
// Module
var manage_walkthrough_achievement_row_code = "<template id=\"ta-x-template-manage-walkthrough-achievement-row\"><tr><td class=\"point\"></td><td class=\"c1\">{element.outerHTML}</td><td class=\"c2\"></td><td class=\"dlop plain\"></td></tr></template>";
// Exports
/* harmony default export */ const manage_walkthrough_achievement_row = (manage_walkthrough_achievement_row_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/clickable-table-links.ts




const clickableAchievements = async (walkthroughContainer, walthroughPreviewDocument) => {
    if (await (0,utilities/* waitForElement */.br)('#chWalkthroughAchievements', walkthroughContainer)) {
        const parsedDocument = new DOMParser().parseFromString(manage_walkthrough_achievement_row, 'text/html');
        const walkthroughAchievements = [...walkthroughContainer.querySelectorAll('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1')];
        let walkthroughAchievementContainer = walkthroughContainer.querySelector('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID tbody');
        if (!walkthroughAchievementContainer) {
            const walkthroughAchievementTable = walkthroughContainer.querySelector('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID table');
            walkthroughAchievementContainer = walkthroughAchievementTable.appendChild(document.createElement('tbody'));
        }
        const games = [...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .games a.gamelink')];
        await (0,utilities/* allConcurrently */.Eh)('ClickableAchievements - Games', games.map((game) => ({
            name: `manage-walkthrough-clickable-table-links-clickable-achievements-${game.innerText}`,
            task: async () => {
                const gameResponse = await (0,helpers/* memoizeFetch */.FS)(game.href);
                const gameDocument = new DOMParser().parseFromString(gameResponse, 'text/html');
                const gameAchievements = [...gameDocument.querySelectorAll('main ul.ach-panels li a.title')];
                await (0,utilities/* allConcurrently */.Eh)('ClickableAchievements - Achievements', gameAchievements.map((gameAchievement) => ({
                    name: `manage-walkthrough-clickable-table-links-clickable-achievements-${game.innerText}-${gameAchievement.innerText.trim()}`,
                    task: async () => {
                        const achievementName = gameAchievement.innerText.trim();
                        const walkthroughAchievement = walkthroughAchievements.find(walkthroughAchievement => walkthroughAchievement.innerText.toLowerCase() === achievementName.toLowerCase());
                        console.log(achievementName, walkthroughAchievement);
                        if (walkthroughAchievement) {
                            walkthroughAchievement.innerText = '';
                            walkthroughAchievement.innerHTML = gameAchievement.outerHTML;
                            const link = walkthroughAchievement.querySelector('a');
                            link.href = globals/* AchievementsRegex.Test.achievementUrlWithGamerId */.KH.Test.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;
                        }
                        else {
                            const clonedAchievementRow = parsedDocument.querySelector(`#${globals/* Constants.Templates.StaffWalkthroughImprovements.ManageWalkthroughPage.achievementRow */.gT.Templates.StaffWalkthroughImprovements.ManageWalkthroughPage.achievementRow}`).content.firstElementChild.cloneNode(true);
                            const achievementRow = (0,helpers/* template */.XK)(clonedAchievementRow, { element: gameAchievement });
                            const link = achievementRow.querySelector('a');
                            achievementRow.querySelector('a').href = globals/* AchievementsRegex.Test.achievementUrlWithGamerId */.KH.Test.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;
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
    if (await (0,utilities/* waitForElement */.br)('#chWalkthroughGamers', walkthroughContainer)) {
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
    if (await (0,utilities/* waitForElement */.br)('#chWalkthroughGamers', walkthroughContainer)) {
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
    if (!globals/* manageWalkthrough.clickableTableLinks */.Ax.clickableTableLinks)
        return;
    const selectedWalkthrough = await (0,utilities/* waitForElement */.br)('#lstWalkthroughIDselectedrow a');
    if (!selectedWalkthrough) {
        return;
    }
    const walkthroughContainer = document.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`);
    const walkthroughId = (0,utilities/* toInt */.Hq)((0,utilities/* extractAllBetween */.QF)("'", selectedWalkthrough.href)[1]);
    const walthroughPreviewResponse = await (0,helpers/* memoizeFetch */.FS)(`https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`);
    const walthroughPreviewDocument = new DOMParser().parseFromString(walthroughPreviewResponse, 'text/html');
    await (0,utilities/* allConcurrently */.Eh)('Manage Walkthrough Page Clickable Table Links', [
        { name: 'manage-walkthrough-clickable-table-links-clickable-achievements', task: async () => clickableAchievements(walkthroughContainer, walthroughPreviewDocument) },
        { name: 'manage-walkthrough-clickable-table-links-clickable-games', task: async () => clickableGames(walkthroughContainer, walthroughPreviewDocument) },
        { name: 'manage-walkthrough-clickable-table-links-clickable-gamers', task: async () => clickableGamers(walkthroughContainer, walthroughPreviewDocument) }
    ]);
};
/* harmony default export */ const clickable_table_links = ({ makeTableLinksClickable });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/auto-select-first.ts



const autoSelectFirst = async () => {
    if (!globals/* manageWalkthrough.autoSelectFirst */.Ax.autoSelectFirst)
        return;
    if (regex/* StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId */.nW.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId())
        return;
    const walkthroughList = await (0,utilities/* waitForElement */.br)('#scrolllstWalkthroughID');
    if (await (0,utilities/* waitForElement */.br)('#lstWalkthroughIDselectedrow', undefined, 1000) === null &&
        walkthroughList.querySelector('table tr') !== null) {
        walkthroughList.querySelector('table tr a').click();
    }
};
/* harmony default export */ const auto_select_first = ({ autoSelectFirst });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/add-missing-buttons.ts



const addMissingButtons = async () => {
    if (!globals/* manageWalkthrough.addMissingButtons */.Ax.addMissingButtons)
        return;
    if (await (0,utilities/* waitForElement */.br)('#lstWalkthroughIDselectedrow', undefined, 1000) === null)
        return;
    if (await (0,utilities/* waitForElement */.br)('#txtPageName', undefined, 1000) === null)
        return;
    const parsedDocument = new DOMParser().parseFromString(manage_walkthrough, 'text/html');
    let buttonContainer = document.querySelector('#chEditWalkthrough .buttons');
    buttonContainer.insertBefore(parsedDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.readyForReviewButtonJs */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.readyForReviewButtonJs}`), buttonContainer.children[0]);
    buttonContainer.parentNode.insertBefore(parsedDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.missingButtonsContainerJs */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.missingButtonsContainerJs}`), buttonContainer);
    buttonContainer = document.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.missingButtonsContainerJs */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.missingButtonsContainerJs}`);
    buttonContainer.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.addPageButtonJs */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.addPageButtonJs}`).href = 'javascript:Postback("btnAddPage")';
    buttonContainer.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.previewButtonJs */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.previewButtonJs}`).href = 'javascript:Postback("btnPreview")';
    buttonContainer.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.viewContentButtonJs */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.viewContentButtonJs}`).href = 'javascript:Postback("btnViewContent")';
};
/* harmony default export */ const add_missing_buttons = ({ addMissingButtons });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/index.ts








let walkthroughContainer;
const manage_walkthrough_applyBody = async () => {
    walkthroughContainer = await (0,utilities/* waitForElement */.br)('#divWalkthroughHolder');
    if (!walkthroughContainer)
        return;
    const editWalkthrough = await (0,utilities/* waitForElement */.br)('#chEditWalkthrough', walkthroughContainer);
    if (editWalkthrough && await (0,helpers/* until */.C4)(() => walkthroughContainer.childElementCount > 2, 1000)) {
        const parsedDocument = new DOMParser().parseFromString(manage_walkthrough, 'text/html');
        editWalkthrough.after(parsedDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`));
        (0,utilities/* allConcurrently */.Eh)('Manage Walkthrough', [
            { name: 'manage-walkthrough-adjust-right-sidebar', task: adjustRightSidebar },
            { name: 'manage-walkthrough-adjust-buttons', task: adjustButtons }
        ]);
    }
};
const adjustButtons = async () => {
    const buttonContainer = await (0,utilities/* waitForElement */.br)('#btnWalkthrough_Options', walkthroughContainer);
    if (buttonContainer === null)
        return;
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
    const sideBarContainer = await (0,utilities/* waitForElement */.br)(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`, walkthroughContainer);
    if (sideBarContainer) {
        const walkthroughAchievementsContainer = await (0,utilities/* waitForElement */.br)('#chWalkthroughAchievements', walkthroughContainer);
        if (walkthroughAchievementsContainer) {
            deDupeAchievements(walkthroughAchievementsContainer);
            sideBarContainer.appendChild(walkthroughAchievementsContainer);
        }
        sideBarContainer.appendChild(await (0,utilities/* waitForElement */.br)('#chWalkthroughGames', walkthroughContainer));
        sideBarContainer.appendChild(await (0,utilities/* waitForElement */.br)('#chWalkthroughGamers', walkthroughContainer));
        sideBarContainer.appendChild(await (0,utilities/* waitForElement */.br)('#chWalkthroughOtherSiteLink', walkthroughContainer));
    }
};
const deDupeAchievements = (walkthroughAchievementsContainer) => {
    const walkthroughAchievements = [...walkthroughAchievementsContainer.querySelectorAll('#scrolllstWalkthroughAchievementID .c1')];
    const duplicateAchievements = (0,utilities/* getDuplicates */.VB)(walkthroughAchievements.map(el => el.innerText), true);
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
    if (!globals/* StaffRegex.Walkthroughs.Test.manageWalkthroughUrl */.nW.Walkthroughs.Test.manageWalkthroughUrl())
        return;
    await changeToDefaultStatus();
    await autoSelectFirst();
    await manage_walkthrough_applyBody();
    (0,utilities/* allConcurrently */.Eh)('Manage Walkthrough', [
        { name: 'manage-walkthrough-make-table-links-clickable', task: makeTableLinksClickable },
        { name: 'manage-walkthrough-add-missing-buttons', task: addMissingButtons }
    ]);
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/walkthrough-page.html
// Module
var walkthrough_page_code = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\"></div><a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" href=\"/staff/walkthrough/managewalkthrough.aspx\">Walkthrough Team</a>";
// Exports
/* harmony default export */ const walkthrough_page = (walkthrough_page_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/add-walkthrough-team-button.ts



const addWalkthroughTeamButton = async (walkthroughContainer, walkthoughPageVersions) => {
    if (!globals/* walkthroughPage.walkthroughTeamButton */.Vx.walkthroughTeamButton)
        return;
    if (!walkthroughContainer || !walkthoughPageVersions)
        return;
    const walkthroughPageButtons = await (0,utilities/* waitForElement */.br)('.content .buttons', walkthoughPageVersions);
    if (walkthroughPageButtons) {
        const parsedDocument = new DOMParser().parseFromString(walkthrough_page, 'text/html');
        walkthroughPageButtons.appendChild(parsedDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonJs */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonJs}`));
    }
};
/* harmony default export */ const add_walkthrough_team_button = ({ addWalkthroughTeamButton });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/move-buttons-to-left.ts


const moveButtonsToLeft = async (walkthroughContainer, walkthoughPageVersions) => {
    if (!globals/* walkthroughPage.moveButtonsToLeft */.Vx.moveButtonsToLeft)
        return;
    if (!walkthroughContainer || !walkthoughPageVersions)
        return;
    const walkthroughContainerButtons = await (0,utilities/* waitForElement */.br)('#btnEditPage, #btnEditPage2, #btnUnlockWalkthroughPage, #btnUnlockWalkthroughPage2', walkthroughContainer);
    const walkthroughPageVersionButtons = await (0,utilities/* waitForElement */.br)('.content .buttons', walkthoughPageVersions);
    if (walkthroughContainerButtons && walkthroughPageVersionButtons) {
        walkthroughPageVersionButtons.append(...walkthroughContainerButtons.parentElement.childNodes);
        walkthroughContainer.classList.add(globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.moveButtonsToLeftStyle */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.moveButtonsToLeftStyle);
    }
};
/* harmony default export */ const move_buttons_to_left = ({ moveButtonsToLeft });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/sticky-page-history.ts



let sticky_page_history_walkthroughContainer;
let walkthoughPageVersions;
const variableProperty = globals/* Constants.Styles.Variables.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryTop */.gT.Styles.Variables.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryTop;
const sticky_page_history_listen = async () => {
    window.addEventListener('scroll', async () => await (0,helpers/* applyStickyElementStyle */.vN)(variableProperty, walkthoughPageVersions, sticky_page_history_walkthroughContainer, {
        noTransitionStyle: !(0,utilities/* classListContains */.gz)(walkthoughPageVersions, [
            globals/* Constants.Styles.Animations.yHideNoTransition */.gT.Styles.Animations.yHideNoTransition,
            globals/* Constants.Styles.Animations.yHide */.gT.Styles.Animations.yHide,
            globals/* Constants.Styles.Animations.yShow */.gT.Styles.Animations.yShow
        ]),
        paddingFromTop: 5
    }));
};
const setPageHistorySticky = async (container, pageVersions) => {
    if (!globals/* walkthroughPage.stickyPageHistory */.Vx.stickyPageHistory)
        return;
    if (!container || !pageVersions)
        return;
    sticky_page_history_walkthroughContainer = container;
    walkthoughPageVersions = pageVersions;
    pageVersions.classList.add(globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs, globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle);
    await (0,helpers/* applyStickyElementStyle */.vN)(variableProperty, pageVersions, container, { noTransitionStyle: true, paddingFromTop: 5 });
    await sticky_page_history_listen();
};
/* harmony default export */ const sticky_page_history = ({ setPageHistorySticky });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/highlight-page-locked.ts


const highlightPageLocked = async (walkthroughContainer) => {
    if (!globals/* walkthroughPage.highlightPageLocked */.Vx.highlightPageLocked)
        return;
    if (!walkthroughContainer)
        return;
    const walkthroughLocked = await (0,utilities/* waitForElement */.br)('.walkthroughlocked', walkthroughContainer);
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
    walkthrough_page_walkthoughPageVersions = await (0,utilities/* waitForElement */.br)('#chWalkthroughPageVersions');
    walkthrough_page_walkthoughPageVersions.parentElement.insertBefore(parsedDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`), walkthrough_page_walkthoughPageVersions);
    walkthrough_page_walkthroughContainer = document.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`);
    walkthrough_page_walkthroughContainer.appendChild(walkthrough_page_walkthoughPageVersions);
    moveWalkthroughPagePreview();
};
const moveWalkthroughPagePreview = async () => {
    const walkthoughPagePreview = await (0,utilities/* waitForElement */.br)('#chWalkthroughPagePreview');
    if (walkthoughPagePreview) {
        walkthrough_page_walkthroughContainer.appendChild(walkthoughPagePreview);
    }
};
/* harmony default export */ const staff_walkthrough_improvements_walkthrough_page = (async () => {
    if (!regex/* StaffRegex.Walkthroughs.Test.walkthroughPageUrl */.nW.Walkthroughs.Test.walkthroughPageUrl())
        return;
    await walkthrough_page_applyBody();
    (0,utilities/* allConcurrently */.Eh)('Walkthrough Page', [
        { name: 'walkthrough-page-set-page-history-sticky', task: async () => setPageHistorySticky(walkthrough_page_walkthroughContainer, walkthrough_page_walkthoughPageVersions) },
        { name: 'walkthrough-page-add-walkthrough-team-button', task: async () => addWalkthroughTeamButton(walkthrough_page_walkthroughContainer, walkthrough_page_walkthoughPageVersions) },
        { name: 'walkthrough-page-move-buttons-to-left', task: async () => moveButtonsToLeft(walkthrough_page_walkthroughContainer, walkthrough_page_walkthoughPageVersions) },
        { name: 'walkthrough-page-highlight-page-locked', task: async () => highlightPageLocked(walkthrough_page_walkthroughContainer) }
    ]);
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/auto-save-notification.ts


const autoSaveNotification = async () => {
    if (!globals/* editWalkthrough.autoSaveNotification */.kB.autoSaveNotification)
        return;
    pub_sub.subscribe('ajaxIntercept:response', (response) => {
        if (!globals/* AjaxRegex.Test.autosave */.rt.Test.autosave(response.responseURL))
            return;
        pub_sub.publish('snackbar:show', {
            text: response.status === 200 ? 'Autosave successful.' : 'Autosave failed.',
            type: response.status === 200 ? 'success' : 'danger'
        });
    });
};
/* harmony default export */ const auto_save_notification = ({ autoSaveNotification });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/edit-walkthrough.html
// Module
var edit_walkthrough_code = "<div class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-sticky-header\"></div><p class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title\">{element.title}</p>";
// Exports
/* harmony default export */ const edit_walkthrough = (edit_walkthrough_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/improved-image-selector.ts




const improved_image_selector_listen = () => {
    document.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement))
            return;
        if (target.closest(`[aria-label='Add Image'], .${globals/* Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`) !== null)
            return;
        const imageSelector = document.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`);
        if (imageSelector.style.display === 'block') {
            imageSelector.style.display = 'none';
        }
    });
    window.addEventListener('blur', () => {
        if (document.activeElement === document.querySelector('#txtWalkthrough_ifr')) {
            const imageSelector = document.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`);
            if (imageSelector.style.display !== 'block')
                return;
            imageSelector.style.display = 'none';
        }
    });
};
const improveImageSelector = async () => {
    if (!globals/* editWalkthrough.improvedImageSelector */.kB.improvedImageSelector)
        return;
    const imageContainer = await (0,utilities/* waitForElement */.br)('#oWalkthroughImageViewer');
    if (!imageContainer)
        return;
    imageContainer.classList.add(globals/* Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorStyle */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorStyle, globals/* Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs);
    const parsedDocument = new DOMParser().parseFromString(edit_walkthrough, 'text/html');
    const stickyImageHeader = parsedDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorContainerJs */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorContainerJs}`);
    const imageViewer = await (0,utilities/* waitForElement */.br)('.imageviewer', imageContainer);
    const imageLink = await (0,utilities/* waitForElement */.br)('.addimages a', imageContainer);
    imageContainer.insertBefore(stickyImageHeader, imageViewer);
    stickyImageHeader.appendChild(imageViewer.querySelector('.itemname, .noimages'));
    stickyImageHeader.appendChild(imageLink);
    [...imageViewer.querySelectorAll('.ivimage a')].forEach(imageAnchor => {
        const clonedImageTitle = parsedDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorImageTitleJs */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorImageTitleJs}`).cloneNode(true);
        const imageTitle = (0,helpers/* template */.XK)(clonedImageTitle, { element: imageAnchor.querySelector('img') });
        imageTitle.innerText = (0,utilities/* extractBetween */._o)("'", imageTitle.innerText);
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
    globalTheme = globalTheme ? globalTheme : await (0,utilities/* waitForElement */.br)('.page, [data-theme]');
    if (globals/* editWalkthrough.tinymceTheme */.kB.tinymceTheme !== null) {
        return globals/* editWalkthrough.tinymceTheme */.kB.tinymceTheme;
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
        globals/* editWalkthrough.tinymceTheme */.kB.tinymceTheme = newTheme;
        target.setAttribute('data-ta-x-tinymce-theme', newTheme);
    });
    const iframe = await (0,utilities/* waitForElement */.br)('#txtWalkthrough_ifr');
    iframe.addEventListener('load', async () => {
        const iframeDocument = iframe && iframe.contentDocument;
        const bodyEl = await (0,utilities/* waitForElement */.br)('#tinymce', iframeDocument);
        bodyEl.classList.add(globals/* Constants.Styles.root */.gT.Styles.root, globals/* Constants.Styles.StaffWalkthroughImprovements.featureStyle */.gT.Styles.StaffWalkthroughImprovements.featureStyle);
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
    themeToggle = toolbar.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs} [data-ta-x-tinymce-theme]`);
    const theme = await getTinymceTheme();
    themeToggle.setAttribute('data-ta-x-tinymce-theme', theme);
    document.body.setAttribute('data-ta-x-theme', theme);
    await toggle_theme_button_listen();
};
/* harmony default export */ const toggle_theme_button = ({ addToggleThemeButton });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/set-fullwidth-toolbar.ts




let tinymceContainer;
let tinymceToolbar;
const set_fullwidth_toolbar_variableProperty = globals/* Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarTop */.gT.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarTop;
const set_fullwidth_toolbar_listen = async () => {
    window.addEventListener('scroll', async () => {
        await (0,helpers/* applyStickyElementStyle */.vN)(set_fullwidth_toolbar_variableProperty, tinymceToolbar, tinymceContainer, {
            noTransitionStyle: !(0,utilities/* classListContains */.gz)(tinymceToolbar, [
                globals/* Constants.Styles.Animations.yHideNoTransition */.gT.Styles.Animations.yHideNoTransition,
                globals/* Constants.Styles.Animations.yHide */.gT.Styles.Animations.yHide,
                globals/* Constants.Styles.Animations.yShow */.gT.Styles.Animations.yShow
            ]),
            isRelativeToParent: true
        });
        setTimeout(() => pub_sub.publish('tinymce:repositionFloatingMenus'), 250);
    });
};
const setFullWidthToolbar = async (container) => {
    tinymceContainer = container;
    tinymceToolbar = await (0,utilities/* waitForElement */.br)('.mce-container-body .mce-toolbar-grp', container);
    if (!tinymceToolbar)
        return;
    tinymceToolbar.classList.add(globals/* Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarStyles */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarStyles);
    document.documentElement.style.setProperty(globals/* Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarWidth */.gT.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarWidth, `${tinymceToolbar.parentElement.scrollWidth}px`);
    await (0,helpers/* applyStickyElementStyle */.vN)(set_fullwidth_toolbar_variableProperty, tinymceToolbar, tinymceContainer, { noTransitionStyle: true, isRelativeToParent: true });
    await set_fullwidth_toolbar_listen();
};
/* harmony default export */ const set_fullwidth_toolbar = ({ setFullWidthToolbar });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/fix-floating-menus.ts



let fix_floating_menus_tinymceToolbar;
const fix_floating_menus_variableProperty = globals/* Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarFloatingMenu */.gT.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarFloatingMenu;
const setTopPosition = () => {
    const actualTopPosition = (0,utilities/* getElementCoordinates */.HM)(fix_floating_menus_tinymceToolbar);
    document.documentElement.style.setProperty(fix_floating_menus_variableProperty, `${fix_floating_menus_tinymceToolbar.offsetHeight + actualTopPosition.top}px`);
};
const fix_floating_menus_listen = () => {
    window.addEventListener('scroll', setTopPosition);
    pub_sub.subscribe('tinymce:repositionFloatingMenus', setTopPosition);
};
const fixFloatingMenus = async (container) => {
    fix_floating_menus_tinymceToolbar = await (0,utilities/* waitForElement */.br)('.mce-container-body .mce-toolbar-grp', container);
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
    const iframe = await (0,utilities/* waitForElement */.br)('#txtWalkthrough_ifr');
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
var tinymce_code = "<div class=\"mce-container mce-last mce-flow-layout-item mce-btn-group js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle\" role=\"group\"><div><div aria-label=\"Switch theme\" class=\"mce-widget mce-btn mce-first\" role=\"button\" tabindex=\"-1\"><button data-ta-x-tinymce-theme role=\"presentation\" tabindex=\"-1\" type=\"button\"><svg viewbox=\"0 0 512 512\" class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z\" fill=\"currentColor\"></path></svg> <svg viewbox=\"0 0 512 512\" class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M505.2 324.8l-47.73-68.78l47.75-68.81c7.359-10.62 8.797-24.12 3.844-36.06c-4.969-11.94-15.52-20.44-28.22-22.72l-82.39-14.88l-14.89-82.41c-2.281-12.72-10.76-23.25-22.69-28.22c-11.97-4.936-25.42-3.498-36.12 3.844L256 54.49L187.2 6.709C176.5-.6016 163.1-2.039 151.1 2.896c-11.92 4.971-20.4 15.5-22.7 28.19l-14.89 82.44L31.15 128.4C18.42 130.7 7.854 139.2 2.9 151.2C-2.051 163.1-.5996 176.6 6.775 187.2l47.73 68.78l-47.75 68.81c-7.359 10.62-8.795 24.12-3.844 36.06c4.969 11.94 15.52 20.44 28.22 22.72l82.39 14.88l14.89 82.41c2.297 12.72 10.78 23.25 22.7 28.22c11.95 4.906 25.44 3.531 36.09-3.844L256 457.5l68.83 47.78C331.3 509.7 338.8 512 346.3 512c4.906 0 9.859-.9687 14.56-2.906c11.92-4.969 20.4-15.5 22.7-28.19l14.89-82.44l82.37-14.88c12.73-2.281 23.3-10.78 28.25-22.75C514.1 348.9 512.6 335.4 505.2 324.8zM456.8 339.2l-99.61 18l-18 99.63L256 399.1L172.8 456.8l-18-99.63l-99.61-18L112.9 255.1L55.23 172.8l99.61-18l18-99.63L256 112.9l83.15-57.75l18.02 99.66l99.61 18L399.1 255.1L456.8 339.2zM256 143.1c-61.85 0-111.1 50.14-111.1 111.1c0 61.85 50.15 111.1 111.1 111.1s111.1-50.14 111.1-111.1C367.1 194.1 317.8 143.1 256 143.1zM256 319.1c-35.28 0-63.99-28.71-63.99-63.99S220.7 192 256 192s63.99 28.71 63.99 63.1S291.3 319.1 256 319.1z\" fill=\"currentColor\"/></svg></button></div><div aria-label=\"Show Code\" class=\"mce-widget mce-btn mce-last\" role=\"button\" tabindex=\"-1\"><button class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code-button\" role=\"presentation\" tabindex=\"-1\" type=\"button\"><svg viewbox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z\" fill=\"currentColor\"></path></svg></button></div></div></div>";
// Exports
/* harmony default export */ const tinymce = (tinymce_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/index.ts







const tinymce_tinymce = async () => {
    if (!await (0,utilities/* waitForElement */.br)('[href*="skin.min.css"]', document.head))
        return;
    const container = await (0,utilities/* waitForElement */.br)('.mce-tinymce');
    const toolbar = await (0,utilities/* waitForElement */.br)('.mce-toolbar.mce-last .mce-container-body', container);
    if (!container || !toolbar)
        return;
    const parsedDocument = new DOMParser().parseFromString(tinymce, 'text/html');
    const addedGroup = parsedDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`);
    toolbar.appendChild(addedGroup);
    (0,utilities/* allConcurrently */.Eh)('Edit Walkthrough', [
        { name: 'tinymce-set-full-width-toolbar', task: async () => setFullWidthToolbar(container) },
        { name: 'tinymce-add-fix-floating-menus', task: async () => fixFloatingMenus(container) },
        { name: 'tinymce-add-source-code-button', task: async () => addSourceCodeButton() },
        { name: 'tinymce-add-toggle-theme-button', task: async () => addToggleThemeButton(toolbar) }
    ]);
};
/* harmony default export */ const edit_walkthrough_tinymce = ({ tinymce: tinymce_tinymce });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/index.ts





/* harmony default export */ const staff_walkthrough_improvements_edit_walkthrough = (async () => {
    if (!globals/* StaffRegex.Walkthroughs.Test.editWalkthroughUrl */.nW.Walkthroughs.Test.editWalkthroughUrl())
        return;
    (0,utilities/* allConcurrently */.Eh)('Edit Walkthrough', [
        { name: 'edit-walkthrough-improve-image-selector', task: improveImageSelector },
        { name: 'edit-walkthrough-auto-save-notification', task: autoSaveNotification },
        { name: 'edit-walkthrough-tinymce', task: tinymce_tinymce }
    ], 3);
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-preview/remove-aside.ts



const remove_aside_applyBody = async () => {
    const main = await (0,utilities/* waitForElement */.br)('.page main');
    main.parentElement.classList.add('no-aside');
    main.classList.add('no-aside');
    const aside = await (0,utilities/* waitForElement */.br)('.page aside');
    aside.remove();
};
const remove_aside_listen = () => {
    pub_sub.subscribe('walkthroughPreview:removeAside', remove_aside_applyBody);
};
const removeAside = async () => {
    remove_aside_listen();
    if (globals/* walkthroughPreview.populateAsideContent */.uP.populateAsideContent)
        return;
    await remove_aside_applyBody();
};
/* harmony default export */ const remove_aside = ({ removeAside });

;// CONCATENATED MODULE: ./src/views/templates/walkthrough-preview-walkthrough-pages.html
// Module
var walkthrough_preview_walkthrough_pages_code = "<template id=\"ta-x-template-walkthrough-preview-walkthrough-pages-summary\"><tr><td></td><td><a href=\"{urls.walkthroughPreviewWithWalkthroughId}\">Walkthrough Summary</a></td></tr></template><template id=\"ta-x-template-walkthrough-preview-walkthrough-pages-numbered-selected\"><tr><td class=\"pos\">{populateAsideContentPreviewPage.index}</td><td data-wp=\"{populateAsideContentPreviewPage.id}\">{populateAsideContentPreviewPage.title}</td></tr></template><template id=\"ta-x-template-walkthrough-preview-walkthrough-pages-numbered\"><tr><td class=\"pos\">{populateAsideContentPreviewPage.index}</td><td data-wp=\"{populateAsideContentPreviewPage.id}\"><a href=\"{urls.walkthroughPreviewWithPageId}\">{populateAsideContentPreviewPage.title}</a></td></tr></template><template id=\"ta-x-template-walkthrough-preview-walkthrough-achievements\"><li data-i=\"{populateAsideContentPreviewAchievement.id}\"><img alt=\"{populateAsideContentPreviewAchievement.title}\" class=\"smallicon\" height=\"32\" loading=\"lazy\" src=\"{populateAsideContentPreviewAchievement.src}\" width=\"32\"> <a href=\"{urls.walkthroughPreviewWithPageIdAndAchievementId}\">{populateAsideContentPreviewAchievement.title}</a> <p>{populateAsideContentPreviewAchievement.description}</p></li></template>";
// Exports
/* harmony default export */ const walkthrough_preview_walkthrough_pages = (walkthrough_preview_walkthrough_pages_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-preview/walkthrough-preview.hbs
// Module
var walkthrough_preview_code = "<section class=\"purple js-ta-x-ask-loader-container ta-x-ask-loader-container js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content\"><div>Walkthrough Information</div><article><div class=\"ta-x-article-loader\"><p>Please wait, loading.</p><svg viewbox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z\" fill=\"currentColor\"></path></svg></div><div class=\"js-ta-x-ask-loader-ask ta-x-ask-loader-ask ta-x-hide\"><p>Can't automate them all sadly! Please enter the walkthrough id to link this page to the walkthrough, I'll try remember it next time! If this is not a \"In Progress\" walkthrough, I'll probably ask again.</p><div><label class=\"small\">Walkthrough Id</label><input class=\"textbox cs-n js-ta-x-ask-loader-ask-input\" id=\"txtStaffWalkthroughImprovementsWalkthroughsPreviewPopulateAsideContentWalkthroughId\" name=\"txtStaffWalkthroughImprovementsWalkthroughsPreviewPopulateAsideContentWalkthroughId\"></div><input class=\"button js-ta-x-ask-loader-ask-button\" id=\"btnStaffWalkthroughImprovementsWalkthroughsPreviewPopulateAsideContentWalkthroughId\" name=\"btnStaffWalkthroughImprovementsWalkthroughsPreviewPopulateAsideContentWalkthroughId\" type=\"submit\" value=\"Save\"></div></article></section><section class=\"green walkthrough-right js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content-walkthrough-achievements\"><div>Walkthrough Achievements</div><article><ul class=\"il\"></ul></article></section><section class=\"purple page-index js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content-walkthrough-pages\"><div>Pages In This Walkthrough</div><article><table class=\"wt-pl\"><tbody></tbody></table></article></section><section class=\"purple walkthroughthanks js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content-walkthrough-thanks\"><div>Walkthrough Thanks</div><article><div class=\"thanks\"><span>{populateAsideContentPreviewThanks.total}</span><img alt=\"Thanks\" class=\"thumbsup\" height=\"64\" src=\"/images/walkthroughs/thumbs_up.png\" width=\"64\"></div><p>community members have thanked the author.</p><p class=\"thread\">Discuss this walkthrough in its <a href=\"{populateAsideContentPreviewThanks.thread}\">Walkthrough Thread</a>.</p></article></section>";
// Exports
/* harmony default export */ const walkthrough_preview = (walkthrough_preview_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-preview/populate-aside-content.ts






let populate_aside_content_extensionBody;
let askForWalkthroughBody;
const populate_aside_content_applyBody = async () => {
    const parsedDocument = new DOMParser().parseFromString(walkthrough_preview, 'text/html');
    const asideColumn = await (0,utilities/* waitForElement */.br)('.main aside');
    asideColumn.appendChild(parsedDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentJs */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentJs}`));
    populate_aside_content_extensionBody = asideColumn.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentJs */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentJs}`);
    askForWalkthroughBody = populate_aside_content_extensionBody.querySelector(`.${globals/* Constants.Styles.Components.AskLoader.askJs */.gT.Styles.Components.AskLoader.askJs}`);
    getAchievementWalkthroughId();
};
const populate_aside_content_listen = () => {
    const button = populate_aside_content_extensionBody.querySelector(`.${globals/* Constants.Styles.Components.AskLoader.buttonJs */.gT.Styles.Components.AskLoader.buttonJs}`);
    const input = populate_aside_content_extensionBody.querySelector(`.${globals/* Constants.Styles.Components.AskLoader.inputJs */.gT.Styles.Components.AskLoader.inputJs}`);
    button.addEventListener('click', async (e) => {
        if (!(e.target instanceof HTMLElement))
            return;
        e.preventDefault();
        e.stopPropagation();
        try {
            if (input.value === '')
                return;
            toggleAskForWalkthrough();
            await getAsideContent(input.value);
        }
        catch {
            return;
        }
    });
};
const getAchievementWalkthroughId = async () => {
    const cachedWalkthroughIds = globals/* Cache.walkthroughPreviewWalkthroughId */.Ct.walkthroughPreviewWalkthroughId;
    let walkthroughId = null;
    if (globals/* StaffRegex.Walkthroughs.Test.walkthroughPreviewUrlWithWalkthroughId */.nW.Walkthroughs.Test.walkthroughPreviewUrlWithWalkthroughId()) {
        walkthroughId = new URLSearchParams(window.location.search).get('walkthroughid');
    }
    else if (globals/* StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId */.nW.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()) {
        const pageId = new URLSearchParams(window.location.search).get('pageid');
        const foundWalkthroughId = [...cachedWalkthroughIds.entries()].find(walkthroughs => walkthroughs[1].includes(pageId));
        if (foundWalkthroughId) {
            walkthroughId = foundWalkthroughId[0];
        }
    }
    if (!walkthroughId) {
        toggleAskForWalkthrough();
        return;
    }
    getAsideContent(walkthroughId);
};
const getAsideContent = async (walkthroughId) => {
    const asideColumn = await (0,utilities/* waitForElement */.br)('.main aside');
    const parsedDocument = new DOMParser().parseFromString(walkthrough_preview, 'text/html');
    const parsedTemplateDocument = new DOMParser().parseFromString(walkthrough_preview_walkthrough_pages, 'text/html');
    const manageWalkthroughResponse = await (0,helpers/* memoizeFetch */.FS)(`https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=${walkthroughId}`, {}, { deleteAfter: { value: 4, period: 'hours' } });
    const manageWalkthroughDocument = new DOMParser().parseFromString(manageWalkthroughResponse, 'text/html');
    if (manageWalkthroughDocument.querySelector('#txtStatusReadOnly').value !== 'In progress' &&
        manageWalkthroughDocument.querySelector('#txtStatusReadOnly').value !== 'Ready for review') {
        populate_aside_content_extensionBody.remove();
        pub_sub.publish('walkthroughPreview:removeAside');
        return;
    }
    const gameUrl = await getGameUrl(walkthroughId);
    const gameResponse = await (0,helpers/* memoizeFetch */.FS)(gameUrl);
    const gameDocument = new DOMParser().parseFromString(gameResponse, 'text/html');
    const thanks = await getWalkthroughThanks(walkthroughId, manageWalkthroughDocument, parsedDocument);
    const achievements = getAchievementsInWalkthrough(manageWalkthroughDocument, gameDocument, parsedDocument, parsedTemplateDocument);
    let asideContent = [thanks, achievements];
    if (globals/* StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId */.nW.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()) {
        const pages = getPagesInWalkthrough(walkthroughId, manageWalkthroughDocument, parsedDocument, parsedTemplateDocument);
        asideContent = [pages].concat(asideContent);
    }
    populate_aside_content_extensionBody.remove();
    asideColumn.append(...asideContent);
    const cachedWalkthroughPreviewWalkthroughId = globals/* Cache.walkthroughPreviewWalkthroughId */.Ct.walkthroughPreviewWalkthroughId;
    cachedWalkthroughPreviewWalkthroughId.set(walkthroughId, getPages(manageWalkthroughDocument).map(page => page.id));
    globals/* Cache.walkthroughPreviewWalkthroughId */.Ct.walkthroughPreviewWalkthroughId = cachedWalkthroughPreviewWalkthroughId;
};
const getGameUrl = async (walkthroughId) => {
    const game = document.querySelector('.walkthroughsummary .games a.gamelink');
    if (game)
        return game.href;
    const walkthroughPreviewResponse = await (0,helpers/* memoizeFetch */.FS)(`https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`);
    const walkthroughPreviewDocument = new DOMParser().parseFromString(walkthroughPreviewResponse, 'text/html');
    return walkthroughPreviewDocument.querySelector('.walkthroughsummary .games a.gamelink').href;
};
const getPages = (manageWalkthroughDocument) => {
    return [...manageWalkthroughDocument.querySelectorAll('#scrolllstWalkthroughPages tbody .c2 a')].map((page, index) => ({
        index: (index + 1).toString(),
        title: page.innerText,
        id: (0,utilities/* toInt */.Hq)((0,utilities/* extractAllBetween */.QF)("'", page.href)[1]).toString()
    }));
};
const getPagesInWalkthrough = (walkthroughId, manageWalkthroughDocument, featureDocument, templateDocument) => {
    if (!globals/* StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId */.nW.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()) {
        return null;
    }
    const pagesInWalkthroughSection = featureDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughPagesJs */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughPagesJs}`);
    const pagesinWalkthroughTable = pagesInWalkthroughSection.querySelector('tbody');
    const clonedSummaryRow = templateDocument.querySelector(`#${globals/* Constants.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesSummary */.gT.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesSummary}`).content.firstElementChild.cloneNode(true);
    const summaryRow = (0,helpers/* template */.XK)(clonedSummaryRow, { urls: {
            walkthroughPreviewWithWalkthroughId: `/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`
        } });
    pagesinWalkthroughTable.appendChild(summaryRow);
    getPages(manageWalkthroughDocument).forEach(populateAsideContentPreviewPage => {
        const pageId = new URLSearchParams(window.location.search).get('pageid');
        const pageRow = (pageId === populateAsideContentPreviewPage.id
            ? templateDocument.querySelector(`#${globals/* Constants.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesNumberedSelected */.gT.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesNumberedSelected}`)
            : templateDocument.querySelector(`#${globals/* Constants.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesNumbered */.gT.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesNumbered}`)).content.firstElementChild.cloneNode(true);
        const templatedRow = (0,helpers/* template */.XK)(pageRow, { populateAsideContentPreviewPage, urls: {
                walkthroughPreviewWithPageId: `/staff/walkthrough/walkthroughpagepreview.aspx?pageid=${populateAsideContentPreviewPage.id}`
            } });
        pagesinWalkthroughTable.appendChild(templatedRow);
    });
    return pagesInWalkthroughSection;
};
const getAchievementsInWalkthrough = (manageWalkthroughDocument, gameDocument, featureDocument, templateDocument) => {
    const achievementsInWalkthroughSection = featureDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughAchievementsJs */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughAchievementsJs}`);
    const achievementsInWalkthroughTable = achievementsInWalkthroughSection.querySelector('ul');
    const walkthroughAchievements = [...manageWalkthroughDocument.querySelectorAll('#scrolllstWalkthroughAchievementID tbody tr')];
    const gameAchievements = [...gameDocument.querySelectorAll('main ul.ach-panels li')];
    const achievementsMerged = [];
    const pages = getPages(manageWalkthroughDocument);
    gameAchievements.forEach(gameAchievement => {
        const achievementName = gameAchievement.querySelector('a.title').innerText.trim();
        const walkthroughAchievement = walkthroughAchievements.find(walkthroughAchievement => walkthroughAchievement.querySelector('.c1')
            .innerText.toLowerCase().trim() === achievementName.toLowerCase());
        if (!walkthroughAchievement)
            return;
        const achievementInfo = {
            title: achievementName,
            description: gameAchievement.querySelector('p').innerText,
            page: pages.find(page => walkthroughAchievement.querySelector('.c2').innerText.trim() === page.index.toString()),
            id: new URL(gameAchievement.querySelector('a.title').href).pathname.split('/')[1].slice(1),
            src: 'https://www.trueachievements.com/imagestore/m/0004101700/4101796.jpg'
        };
        achievementsMerged.push(achievementInfo);
    });
    achievementsMerged.sort((a, b) => (0,utilities/* toInt */.Hq)(a.page.index) - (0,utilities/* toInt */.Hq)(b.page.index));
    achievementsMerged.forEach(populateAsideContentPreviewAchievement => {
        const achievementRow = templateDocument.querySelector(`#${globals/* Constants.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughAchievements */.gT.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughAchievements}`)
            .content.firstElementChild.cloneNode(true);
        const templatedRow = (0,helpers/* template */.XK)(achievementRow, { populateAsideContentPreviewAchievement, urls: {
                walkthroughPreviewWithPageIdAndAchievementId: `/staff/walkthrough/walkthroughpagepreview.aspx?pageid=${populateAsideContentPreviewAchievement.page.id}#ap${populateAsideContentPreviewAchievement.id}`
            } });
        achievementsInWalkthroughTable.appendChild(templatedRow);
    });
    return achievementsInWalkthroughSection;
};
const getWalkthroughThanks = async (walkthroughId, manageWalkthroughDocument, featureDocument) => {
    const thanks = featureDocument.querySelector(`.${globals/* Constants.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughThanksJs */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughThanksJs}`);
    const walkthroughPreviewResponse = await (0,helpers/* memoizeFetch */.FS)(`https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`);
    const walkthroughPreviewDocument = new DOMParser().parseFromString(walkthroughPreviewResponse, 'text/html');
    const threadUrl = walkthroughPreviewDocument.querySelector('.summary dd a').href;
    return (0,helpers/* template */.XK)(thanks, { populateAsideContentPreviewThanks: { thread: threadUrl, total: '0' } });
};
const toggleAskForWalkthrough = () => {
    askForWalkthroughBody.classList.toggle('ta-x-hide');
    if (!askForWalkthroughBody.classList.contains('ta-x-hide')) {
        populate_aside_content_extensionBody.setAttribute('data-ta-x-loaded', 'true');
    }
    else {
        populate_aside_content_extensionBody.removeAttribute('data-ta-x-loaded');
    }
};
const populateAsideContent = async () => {
    if (!globals/* walkthroughPreview.populateAsideContent */.uP.populateAsideContent)
        return;
    await populate_aside_content_applyBody();
    populate_aside_content_listen();
};
/* harmony default export */ const populate_aside_content = ({ populateAsideContent });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-preview/index.ts




/* harmony default export */ const staff_walkthrough_improvements_walkthrough_preview = (async () => {
    if (!globals/* StaffRegex.Walkthroughs.Test.preview */.nW.Walkthroughs.Test.preview())
        return;
    (0,utilities/* allConcurrently */.Eh)('Walkthrough Preview', [
        { name: 'walkthrough-preview-remove-aside', task: removeAside },
        { name: 'walkthrough-preview-populate-aside-content', task: populateAsideContent }
    ]);
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/index.ts






/* harmony default export */ const staff_walkthrough_improvements = (async () => {
    if (!globals/* staffWalkthroughImprovements.enabled */.mg.enabled)
        return;
    if (!globals/* StaffRegex.Walkthroughs.Test.all */.nW.Walkthroughs.Test.all())
        return;
    if (!await (0,utilities/* waitForElement */.br)('body'))
        return;
    document.body.classList.add(globals/* Constants.Styles.StaffWalkthroughImprovements.featureJs */.gT.Styles.StaffWalkthroughImprovements.featureJs, globals/* Constants.Styles.StaffWalkthroughImprovements.featureStyle */.gT.Styles.StaffWalkthroughImprovements.featureStyle);
    (0,utilities/* allConcurrently */.Eh)('Staff Walkthrough Improvements', [
        { name: 'staff-walkthrough-improvements-manage-walkthrough', task: staff_walkthrough_improvements_manage_walkthrough },
        { name: 'staff-walkthrough-improvements-walkthrough-preview', task: staff_walkthrough_improvements_walkthrough_preview },
        { name: 'staff-walkthrough-improvements-walkthrough-page', task: staff_walkthrough_improvements_walkthrough_page },
        { name: 'staff-walkthrough-improvements-edit-walkthrough', task: staff_walkthrough_improvements_edit_walkthrough }
    ], 4);
});

// EXTERNAL MODULE: ./src/features/forum-improvements/walkthroughs/show-owner-progress.ts
var show_owner_progress = __webpack_require__("./src/features/forum-improvements/walkthroughs/show-owner-progress.ts");
;// CONCATENATED MODULE: ./src/features/forum-improvements/walkthroughs/index.ts



const messageBoardId = '1431';
/* harmony default export */ const walkthroughs = (async () => {
    const params = new URLSearchParams(window.location.search);
    if (!globals/* ForumRegex.Test.viewBoardUrlWithBoardId */.wC.Test.viewBoardUrlWithBoardId() && !globals/* ForumRegex.Test.viewThreadUrlWithThreadId */.wC.Test.viewThreadUrlWithThreadId())
        return;
    if (globals/* ForumRegex.Test.viewBoardUrlWithBoardId */.wC.Test.viewBoardUrlWithBoardId() && params.get('messageboardid') !== messageBoardId)
        return;
    if (globals/* ForumRegex.Test.viewThreadUrlWithThreadId */.wC.Test.viewThreadUrlWithThreadId()) {
        const pageTitle = await (0,utilities/* waitForElement */.br)('#oMessageThread .pagetitle');
        if (!pageTitle || pageTitle.innerText.toLowerCase() !== 'walkthroughs')
            return;
    }
    (0,utilities/* allConcurrently */.Eh)('Walkthrough Page', [
        { name: 'walkthroughs-show-owner-progress', task: show_owner_progress/* default */.Z }
    ]);
});

;// CONCATENATED MODULE: ./src/features/forum-improvements/index.ts



/* harmony default export */ const forum_improvements = (async () => {
    if (!globals/* forumImprovements.enabled */.i_.enabled)
        return;
    if (!globals/* ForumRegex.Test.all */.wC.Test.all())
        return;
    if (!await (0,utilities/* waitForElement */.br)('body'))
        return;
    document.body.classList.add(globals/* Constants.Styles.ForumImprovements.featureJs */.gT.Styles.ForumImprovements.featureJs, globals/* Constants.Styles.ForumImprovements.featureStyle */.gT.Styles.ForumImprovements.featureStyle);
    (0,utilities/* allConcurrently */.Eh)('Forum Improvements', [
        { name: 'forum-improvements-walkthroughs', task: walkthroughs }
    ]);
});

;// CONCATENATED MODULE: ./src/features/news-improvements/sales/auto-sort-by.ts



const auto_sort_by_applyBody = async () => {
    const saleTables = [...document.querySelectorAll('table.sale')];
    await (0,utilities/* allConcurrently */.Eh)('AutoSortBy - Tables', saleTables.map((saleTable) => ({
        name: 'auto-sort-by-table',
        task: async () => {
            const tableHeader = [...saleTable.querySelectorAll('.headers [data-sort]')]
                .find(th => globals/* newsImprovements.sales.autoSortByValue.includes */.Bb.sales.autoSortByValue.includes(th.innerText.replace(' ', '-').toLowerCase().trim()));
            if (!tableHeader)
                return;
            do {
                tableHeader.click();
                await (0,helpers/* wait */.Dc)();
            } while (!tableHeader.classList.contains(`sorting-${globals/* newsImprovements.sales.autoSortByOrder */.Bb.sales.autoSortByOrder}`));
        }
    })));
};
/* harmony default export */ const auto_sort_by = (async () => {
    if (!globals/* newsImprovements.sales.autoSortBy */.Bb.sales.autoSortBy)
        return;
    if (globals/* newsImprovements.sales.autoSortByValue.includes */.Bb.sales.autoSortByValue.includes('product') && globals/* newsImprovements.sales.autoSortByOrder */.Bb.sales.autoSortByOrder === 'asc')
        return;
    const salesTable = await (0,utilities/* waitForElement */.br)('.newsitem .sale [data-sort]');
    if (!salesTable)
        return;
    await (0,utilities/* waitForElement */.br)('.author');
    await auto_sort_by_applyBody();
});

;// CONCATENATED MODULE: ./src/features/news-improvements/sales/index.ts


/* harmony default export */ const sales = (async () => {
    (0,utilities/* allConcurrently */.Eh)('Sales News', [
        { name: 'sales-auto-sort-by', task: auto_sort_by }
    ]);
});

;// CONCATENATED MODULE: ./src/features/news-improvements/index.ts



/* harmony default export */ const news_improvements = (async () => {
    if (!globals/* newsImprovements.enabled */.Bb.enabled)
        return;
    if (!globals/* NewsRegex.Test.newsUrl */.du.Test.newsUrl())
        return;
    if (!await (0,utilities/* waitForElement */.br)('body'))
        return;
    document.body.classList.add(globals/* Constants.Styles.NewsImprovements.featureJs */.gT.Styles.NewsImprovements.featureJs, globals/* Constants.Styles.NewsImprovements.featureStyle */.gT.Styles.NewsImprovements.featureStyle);
    (0,utilities/* allConcurrently */.Eh)('News Improvements', [
        { name: 'news-improvements-sales', task: sales }
    ]);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/games-improvements.html
// Module
var games_improvements_code = "<a class=\"button js-ta-x-games-improvements-highlight-games-collection-button\" href=\"#\">Highlight games not in collection</a>";
// Exports
/* harmony default export */ const games_improvements = (games_improvements_code);
;// CONCATENATED MODULE: ./src/features/games-improvements/add-highlight-games-not-in-collection-button.ts



const add_highlight_games_not_in_collection_button_listen = (button) => {
    button.addEventListener('click', async () => {
        [...document.querySelectorAll('#oGameList img[alt*="Add game to My Game Collection"]')].forEach(el => {
            const tr = el.closest('tr');
            tr.classList.remove('odd', 'even');
            tr.classList.add('green');
        });
    });
};
const addHighlightGamesNotInCollectionButton = async () => {
    if (!globals/* games.addHighlightGamesNotInCollectionButton */.Tt.addHighlightGamesNotInCollectionButton)
        return;
    if (!globals/* GamesRegex.Test.gamesUrl */.Rv.Test.gamesUrl())
        return;
    const searchAndFilterContainer = await (0,utilities/* waitForElement */.br)('.search-and-filter');
    if (!searchAndFilterContainer)
        return;
    const parsedDocument = new DOMParser().parseFromString(games_improvements, 'text/html');
    searchAndFilterContainer.appendChild(parsedDocument.querySelector(`.${globals/* Constants.Styles.GamesImprovements.highlightGamesButtonJs */.gT.Styles.GamesImprovements.highlightGamesButtonJs}`));
    const button = searchAndFilterContainer.querySelector(`.${globals/* Constants.Styles.GamesImprovements.highlightGamesButtonJs */.gT.Styles.GamesImprovements.highlightGamesButtonJs}`);
    add_highlight_games_not_in_collection_button_listen(button);
};
/* harmony default export */ const add_highlight_games_not_in_collection_button = ({ addHighlightGamesNotInCollectionButton });

;// CONCATENATED MODULE: ./src/features/games-improvements/achievements/default-status.ts


const default_status_changeToDefaultStatus = async () => {
    if (!globals/* gameAchievements.gameAchievementsDefaultStatus */.TM.gameAchievementsDefaultStatus)
        return;
    const url = (0,globals/* getUrlProperties */.TS)(window.location.href, ['pathname', 'search']);
    const status = await (0,utilities/* waitForElement */.br)(`#${globals/* gameAchievements.gameAchievementsDefaultStatusValue */.TM.gameAchievementsDefaultStatusValue}`);
    if (url !== globals/* Cache.gameAchievementsDefaultStatusPathName */.Ct.gameAchievementsDefaultStatusPathName) {
        globals/* Cache.gameAchievementsDefaultStatusPathName */.Ct.gameAchievementsDefaultStatusPathName = (0,globals/* getUrlProperties */.TS)(window.location.href, ['pathname', 'search']);
        if (globals/* GamesRegex.Test.achievementsUrlWithGamerId */.Rv.Test.achievementsUrlWithGamerId() && new URLSearchParams(window.location.search).get('gamerid') !== globals/* Constants.gamerId */.gT.gamerId)
            return;
        if (!status.hasAttribute('checked')) {
            status.click();
        }
    }
};
/* harmony default export */ const achievements_default_status = ({ changeToDefaultStatus: default_status_changeToDefaultStatus });

;// CONCATENATED MODULE: ./src/features/games-improvements/achievements/index.ts



/* harmony default export */ const achievements = (async () => {
    if (!globals/* GamesRegex.Test.achievementsUrl */.Rv.Test.achievementsUrl())
        return;
    (0,utilities/* allConcurrently */.Eh)('Games Achievements', [
        { name: 'games-achievements-change-to-default-status', task: default_status_changeToDefaultStatus }
    ]);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/clips/default-status.ts


const clips_default_status_changeToDefaultStatus = async () => {
    if (!globals/* gameClips.gameClipsDefaultStatus */.MF.gameClipsDefaultStatus)
        return;
    await (0,utilities/* allConcurrently */.Eh)('game-clips-change-to-default-status', [
        { name: 'game-clips-change-to-default-status-recorded-by', task: async () => changeSelectOption('#ddlRecordedBy', globals/* gameClips.gameClipsDefaultRecordedByValue */.MF.gameClipsDefaultRecordedByValue, '') },
        { name: 'game-clips-change-to-default-status-saved-by', task: async () => changeSelectOption('#ddlSavedBy', globals/* gameClips.gameClipsDefaultSavedByValue */.MF.gameClipsDefaultSavedByValue, 'Gamer') },
        { name: 'game-clips-change-to-default-status-recorded', task: async () => changeSelectOption('#ddlUploaded', globals/* gameClips.gameClipsDefaultRecordedValue */.MF.gameClipsDefaultRecordedValue, '7') },
        { name: 'game-clips-change-to-default-status-sort-by', task: async () => changeSelectOption('#ddlOrder', globals/* gameClips.gameClipsDefaultSortByValue */.MF.gameClipsDefaultSortByValue, 'Most viewed') }
    ], 1);
};
const changeSelectOption = async (selector, newValue, defaultValue) => {
    const selectorArray = globals/* Cache.gameClipsDefaultStatusSelectors */.Ct.gameClipsDefaultStatusSelectors;
    if (newValue === defaultValue)
        return;
    if (selectorArray.includes(selector))
        return;
    selectorArray.push(selector);
    globals/* Cache.gameClipsDefaultStatusSelectors */.Ct.gameClipsDefaultStatusSelectors = selectorArray;
    const selectOption = await (0,utilities/* waitForElement */.br)(selector);
    if (selectOption.value === newValue)
        return;
    selectOption.value = newValue;
    selectOption.onchange(null);
};
/* harmony default export */ const clips_default_status = ({ changeToDefaultStatus: clips_default_status_changeToDefaultStatus });

;// CONCATENATED MODULE: ./src/features/games-improvements/clips/index.ts



/* harmony default export */ const clips = (async () => {
    if (!globals/* GamesRegex.Test.clipsUrl */.Rv.Test.clipsUrl())
        return;
    (0,utilities/* allConcurrently */.Eh)('Games Clips', [
        { name: 'games-clips-change-to-default-status', task: clips_default_status_changeToDefaultStatus }
    ]);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/index.ts





/* harmony default export */ const features_games_improvements = (async () => {
    if (!globals/* gamesImprovements.enabled */.bc.enabled)
        return;
    (0,utilities/* allConcurrently */.Eh)('Games Improvements', [
        { name: 'games-improvements-add-highlight-games-button', task: addHighlightGamesNotInCollectionButton },
        { name: 'games-improvements-achievements', task: achievements },
        { name: 'games-improvements-clips', task: clips }
    ]);
});

;// CONCATENATED MODULE: ./src/features/gamer-improvements/gamer-improvements.html
// Module
var gamer_improvements_code = "<a class=\"button js-ta-x-gamer-improvements-group-by-game-button\" href=\"#\">Group achievements by game</a>";
// Exports
/* harmony default export */ const gamer_improvements = (gamer_improvements_code);
;// CONCATENATED MODULE: ./src/features/gamer-improvements/add-group-by-game-button.ts



const add_group_by_game_button_listen = (button) => {
    button.addEventListener('click', async () => {
        const containerTable = document.querySelector('table#oAchievementList tbody');
        [...containerTable.querySelectorAll('tr.even, tr.odd')].sort((el1, el2) => {
            const el1Alt = el1.querySelector('.gamethumb img').getAttribute('alt');
            const el2Alt = el2.querySelector('.gamethumb img').getAttribute('alt');
            if (el1Alt > el2Alt) {
                return 1;
            }
            else if (el1Alt < el2Alt) {
                return -1;
            }
            else {
                return 0;
            }
        })
            .forEach((element, index) => {
            element.classList.remove('odd', 'even');
            element.classList.add((index + 1 & 1) ? 'even' : 'odd');
            containerTable.appendChild(element);
        });
    });
};
const addGroupByGameButton = async () => {
    if (!globals/* achievements.addGroupByGameButton */.EF.addGroupByGameButton)
        return;
    if (!globals/* GamerRegex.Test.gamerAchievementsUrl */.LG.Test.gamerAchievementsUrl())
        return;
    const searchAndFilterContainer = await (0,utilities/* waitForElement */.br)('.search-and-filter');
    if (!searchAndFilterContainer)
        return;
    const parsedDocument = new DOMParser().parseFromString(gamer_improvements, 'text/html');
    searchAndFilterContainer.appendChild(parsedDocument.querySelector(`.${globals/* Constants.Styles.GamerImprovements.groupByGameButtonJs */.gT.Styles.GamerImprovements.groupByGameButtonJs}`));
    const button = searchAndFilterContainer.querySelector(`.${globals/* Constants.Styles.GamerImprovements.groupByGameButtonJs */.gT.Styles.GamerImprovements.groupByGameButtonJs}`);
    add_group_by_game_button_listen(button);
};
/* harmony default export */ const add_group_by_game_button = ({ addGroupByGameButton });

;// CONCATENATED MODULE: ./src/features/gamer-improvements/index.ts



/* harmony default export */ const features_gamer_improvements = (async () => {
    if (!globals/* gamerImprovements.enabled */.rI.enabled)
        return;
    if (!globals/* GamerRegex.Test.all */.LG.Test.all())
        return;
    (0,utilities/* allConcurrently */.Eh)('Gamer Improvements', [
        { name: 'gamer-improvments-add-group-by-game-button', task: addGroupByGameButton }
    ]);
});

;// CONCATENATED MODULE: ./src/scss/index.scss

        const scss_styles = `:root{--ta-x-sticky-header-height: $ta-x-sticky-header-height}body.trueachievement-extras .ta-x-hide{display:none}@media(max-width: 1349px){body.trueachievement-extras .middle{width:100%;max-width:1200px}}@media(min-width: 576px){body.trueachievement-extras .middle .news-section.list>section.highlight{margin:5px 0}body.trueachievement-extras .middle .news-section.list>section.highlight+section.highlight{margin-top:1rem}}body.trueachievement-extras .ta-x-flex-break{flex-basis:100%;height:0;border:0;padding:0;margin:0}body.trueachievement-extras .ta-x-article-loader{text-align:center}body.trueachievement-extras .ta-x-article-loader img{width:25px;height:25px;margin:0 auto;margin-bottom:.8rem}body.trueachievement-extras [data-ta-x-loaded] .ta-x-article-loader{display:none}body.trueachievement-extras .ta-x-snackbar{visibility:hidden;min-width:250px;margin-left:-125px;background-color:#333;text-align:center;border-radius:1.5rem;padding:16px;position:fixed;z-index:1;left:50%;bottom:30px}body.trueachievement-extras .ta-x-snackbar-show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}body.trueachievement-extras .ta-x-snackbar h2{color:#bbb;border-left:3px solid #3f67a4}body.trueachievement-extras .ta-x-snackbar h2.warning{border-color:#f57921}body.trueachievement-extras .ta-x-snackbar h2.danger{border-color:#f52721}body.trueachievement-extras .ta-x-snackbar h2.success{border-color:#58bb12}@keyframes fadein{from{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@keyframes fadeout{from{bottom:30px;opacity:1}to{bottom:0;opacity:0}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}body.trueachievement-extras .ta-x-ask-loader-container:not([data-ta-x-loaded]) article{display:block}body.trueachievement-extras .ta-x-ask-loader-container article{display:flex;justify-content:space-between}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-article-loader svg{animation-name:spin;animation-duration:2000ms;animation-iteration-count:infinite;animation-timing-function:linear;display:block;margin:auto;margin-bottom:.8rem;width:5rem}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div{display:flex;flex-direction:column}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div label{margin-bottom:.9rem}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div+input{width:100%;margin:0;margin-top:.9rem}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div+input:hover{margin-bottom:2px}body.trueachievement-extras .ta-x-y-show{transform:translateY(0);transition:transform .5s ease}body.trueachievement-extras .ta-x-y-hide{transform:translateY(-100%);transition:transform .5s ease}body.trueachievement-extras .ta-x-y-hide-no-transition{transform:translateY(-100%)}body.trueachievement-extras .ta-x-settings-menu-settings{max-height:547px;overflow-y:scroll !important;padding:0 1rem !important;padding-bottom:1rem !important;height:100%;position:relative}body.trueachievement-extras .ta-x-settings-menu-settings>div{display:block;padding:0}body.trueachievement-extras .ta-x-settings-menu-settings .frm-grp{user-select:none;margin-right:0}body.trueachievement-extras .ta-x-settings-menu-settings .frm-sel::after{top:10px}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings>div{flex-wrap:wrap}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings>div>label{max-width:80%}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-checkbox-help-text{font-size:1.2rem;padding-top:.5rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item{position:absolute;display:none;width:313px;padding-bottom:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item-show{display:block}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper{display:flex;flex-wrap:wrap}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper a,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper a{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h2,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h2{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h1{margin-bottom:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h2,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h2{border-top:2px solid #0e5814;border-bottom:2px solid #0e5814;padding:.5rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper{padding-top:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h1{border-top:2px solid #0e5814;border-bottom:2px solid #0e5814;padding:.5rem;margin-bottom:.5rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper{border-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-markdown-marker{flex-basis:unset;align-self:center;padding-right:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion{flex-wrap:wrap;border:0;padding-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion:last-of-type{padding-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header{padding:1rem;flex-shrink:unset;color:#fff;cursor:pointer;user-select:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header span{width:100%;pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header svg{height:20px;pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header.collapsed svg{transition:all .5s linear}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header.expanded svg{transform:rotate(-180deg)}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body{max-height:0;transition:max-height .5s ease-out;overflow:hidden}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body]{border:1px solid #161616;border-top:0;border-bottom-left-radius:1rem;border-bottom-right-radius:1rem;padding:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body] .ta-x-settings-menu-settings-accordion{margin:0;padding:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body] .ta-x-settings-menu-settings-accordion-header{border-radius:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion .t-settings>div{padding:1rem 0;margin:0 1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion .t-settings>div:last-of-type{border:0}body.trueachievement-extras .ta-x-settings-menu-columned-setting{flex-direction:column;align-items:flex-start}body.trueachievement-extras .ta-x-settings-menu-columned-setting>div:first-of-type{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;width:100%}body.trueachievement-extras .ta-x-settings-menu-columned-setting>div:first-of-type>label{max-width:80%}body.trueachievement-extras .ta-x-settings-menu-columned-setting .frm-sel{padding-top:1rem}body.trueachievement-extras .ta-x-settings-menu-bottom{background:#4a5568;position:absolute;bottom:0;display:block;width:100%;padding:0 1rem !important}body.trueachievement-extras .ta-x-settings-menu-bottom .title{margin-bottom:0;color:#ddd;border:0}body.trueachievement-extras .ta-x-settings-menu-bottom .title a{background:unset}body.trueachievement-extras .ta-x-settings-menu-bottom .title a:hover{text-decoration:underline}body.trueachievement-extras .ta-x-settings-menu .close i{pointer-events:none}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu-bottom .buttons{border-color:#000 !important}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu-bottom .buttons a{background:#4299e1 !important}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-header{color:#ddd}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-header>label{color:#ddd !important;padding:0;text-align:left;pointer-events:none}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-header .frm-tgl{pointer-events:none}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-header .frm-tgl>label{padding:0;pointer-events:none}body.trueachievement-extras .ta-x-sticky-header{position:fixed;top:0;width:100%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements{min-width:unset !important;overflow:auto}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main{min-height:unset !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page{position:unset;display:flex;flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector#oWalkthroughImageViewer{width:321px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .noimages,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .itemname{padding:5px;text-align:center;font-size:unset !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header{position:sticky;border-bottom:1px solid #000;display:flex;flex-direction:column;background-color:#fff}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header .noimages{margin-top:0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector a[title="Add images"]{text-align:center;padding:5px;cursor:pointer !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector a[title="Add images"]:hover{text-decoration:underline}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .imageviewer{display:flex;flex-wrap:wrap}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .imageviewer .ivimage{position:unset;margin:5px;max-width:46%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title{text-align:center;padding-top:3px;white-space:break-spaces}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code-button svg{width:32px;margin-left:-10px;margin-right:-4px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg{height:20px;pointer-events:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg path{fill:#555;filter:drop-shadow(21px 21px #fff);pointer-events:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg:hover path{fill:#333}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark{display:block}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle [data-ta-x-tinymce-theme=dark] svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light{display:block}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle [data-ta-x-tinymce-theme=dark] svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar{border-bottom:1px solid #ddd;width:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-width, 0);top:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-top, 0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header{background-color:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header .itemname{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg path{fill:#b5b9bf;filter:drop-shadow(21px 21px #000)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar{border-color:#232b33}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar.ta-x-y-hide{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));transition:transform .5s ease}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar.ta-x-y-hide-no-transition{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)))}body.trueachievement-extras.ta-x-staff-walkthrough-improvements>.mce-menu.mce-floatpanel{top:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-floating-menu, 0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divWalkthroughHolder{position:unset;margin-top:unset;height:unset;display:flex;justify-content:space-between}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .buttons{display:flex}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button{display:block;flex-grow:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough{margin:0;margin-bottom:3px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough:hover{margin-bottom:5px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughs,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughAchievements,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGames,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGamers,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughOtherSiteLink{position:unset;top:unset;left:unset;display:block;margin:0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough{flex:1;margin:0 1.5rem}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #btnWalkthrough{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container{display:flex;flex-direction:column;justify-content:space-around}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container{display:flex}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview{margin-left:0;position:unset;width:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview{flex:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions{height:100%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history{position:relative;top:var(--ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history-top, 0)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));transition:transform .5s ease}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide-no-transition{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)))}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons{display:flex;justify-content:center;flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .button{flex:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .button:not(:first-of-type){margin-top:5px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-move-buttons-to-left #chWalkthroughPagePreview .content .buttons{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-move-buttons-to-left #chWalkthroughPagePreview .content .buttons .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main{max-width:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main .admin-page .walkthroughsummary+.walkthroughpagelinks{flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main .admin-page .walkthroughsummary+.walkthroughpagelinks a.next{margin-left:0}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress:not([data-ta-x-loaded]) article{display:block}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article{display:flex;justify-content:space-between}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .walthroughprogress{display:flex;justify-content:center;align-items:center;width:100%}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .walthroughprogress .walkthroughauthor{margin-right:1rem}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .walthroughprogress .clearboth{display:none}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-wrapper{display:flex;flex-direction:column;justify-content:center;flex-basis:100%}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-row{display:flex;align-items:center;margin-bottom:1rem}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-row:last-of-type{margin-bottom:0}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor{margin-left:1rem}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .thanks{display:flex;flex-direction:column;align-items:center;padding-left:1rem;justify-content:center}`;
        /* harmony default export */ const scss = (scss_styles);
    
;// CONCATENATED MODULE: ./src/features/styles.ts



/* harmony default export */ const features_styles = (async () => {
    if (!await (0,utilities/* waitForElement */.br)('body'))
        return;
    document.body.classList.add(globals/* Constants.Styles.root */.gT.Styles.root);
    GM_addStyle(scss);
});

;// CONCATENATED MODULE: ./src/features/index.ts









;// CONCATENATED MODULE: ./src/index.ts





ajax_interceptor.addRequestCallback((xhr) => pub_sub.publish('ajaxIntercept:request', xhr));
ajax_interceptor.addResponseCallback((xhr) => pub_sub.publish('ajaxIntercept:response', xhr));
ajax_interceptor.wire();
(async () => {
    (0,utilities/* allConcurrently */.Eh)('Components', [
        { name: 'component:snackbar', task: snackbar },
        { name: 'component:accordion', task: accordion }
    ]);
    (0,utilities/* allConcurrently */.Eh)('Features', [
        { name: 'feature:styles', task: features_styles },
        { name: 'feature:settings-menu', task: settings_menu },
        { name: 'feature:sticky-header', task: sticky_header },
        { name: 'feature:staff-walkthrough-improvements', task: staff_walkthrough_improvements },
        { name: 'feature:forum-improvements', task: forum_improvements },
        { name: 'feature:news-improvements', task: news_improvements },
        { name: 'feature:games-improvements', task: features_games_improvements },
        { name: 'feature:gamer-improvements', task: features_gamer_improvements }
    ], 4);
    (0,utilities/* allConcurrently */.Eh)('Cache', [
        { name: 'cache:expired', task: globals/* Cache.clearExpired.bind */.Ct.clearExpired.bind(globals/* Cache */.Ct) },
        { name: 'cache:legacy', task: globals/* Cache.clearLegacy.bind */.Ct.clearLegacy.bind(globals/* Cache */.Ct) }
    ]);
})();

})();

/******/ })()
;