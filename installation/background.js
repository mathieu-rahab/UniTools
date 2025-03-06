let installURL = chrome.runtime.getURL("installation/install.html");

let installReason = (detail) => {
    if (detail.reason === "install") {
        chrome.tabs.create({url: installURL});

}}

chrome.runtime.onInstalled.addListener((details) => {
    installReason(details);
})