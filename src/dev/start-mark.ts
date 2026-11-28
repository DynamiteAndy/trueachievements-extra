// Dev builds only (the dev entry runs this first; the release build never includes it).
//
// When our script started running on the page, as a `ta-x start` mark on its performance timeline: read it beside the
// page's own timings (`performance.getEntriesByType('navigation')`) to tell a late start from slow work of ours
performance.mark('ta-x start');
