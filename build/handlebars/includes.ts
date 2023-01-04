import fs from 'fs';
import { dirname } from 'path';
import Handlebars from 'handlebars';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { url } from '../../package.json';
import { default as getPath } from './get-path-by-alias';

export const includes = (): void => {
  Handlebars.registerHelper('includes', (filePath: string, options) => {
    if (!filePath) return;

    const actualPath = getPath(filePath, options.data?.parentPartialDirectory);
    const includedFiles = fs.readFileSync(actualPath, 'utf8');
    const dom = new JSDOM(includedFiles);
    const domContent = dom.window.document.body.innerHTML;
    const domTemplate = Handlebars.compile(domContent);

    return new Handlebars.SafeString(domTemplate(options.hash, { data: { parentPartialDirectory: dirname(actualPath) } }));
  });
};

export const markdown = (): void => {
  Handlebars.registerHelper('markdown', (filePath: string, render: boolean, wrapperClass: string, options) => {
    if (!filePath) return;

    const actualPath = getPath(filePath, options.data?.parentPartialDirectory);
    const includedFiles = fs.readFileSync(actualPath, 'utf8');
    const htmlString = sanitizeHtml((marked.parse(includedFiles)));
    const dom = new JSDOM(`<div class="${wrapperClass}">${htmlString}</div`);
    const domContent = dom.window.document.body;

    if (render) {
      const domTemplate = Handlebars.compile(domContent.innerHTML);

      return new Handlebars.SafeString(domTemplate(options.hash, { data: { parentPartialDirectory: dirname(actualPath) } }));
    } else {
      options.data.root.markdown = domContent.outerHTML;
    }
  });
};

export const changelog = (): void => {
  Handlebars.registerHelper('changelog', (_, options) => {
    const dom = new JSDOM(options.data.root.markdown);
    const changelogDocument = dom.window.document;
    const wrapperBody = changelogDocument.body.firstElementChild;
    const changelogElement = wrapperBody.querySelector('ul');

    wrapperBody.removeChild(wrapperBody.firstElementChild);

    while (changelogElement.nextElementSibling) {
      wrapperBody.removeChild(changelogElement.nextElementSibling);
    }

    [...changelogElement.querySelectorAll('li')].map(el => {
      el.innerHTML = `<span class="ta-x-changelog-marker">></span><p>${el.innerHTML}</p>`;
    });

    const changelogLink = changelogDocument.createElement('a');
    changelogLink.classList.add('ta-x-settings-menu-changelog-link');
    changelogLink.href = `${url}/blob/main/CHANGELOG.md`;
    changelogLink.textContent = 'See the full changelog here';

    wrapperBody.appendChild(changelogLink);
    const domTemplate = Handlebars.compile(changelogDocument.body.innerHTML);

    return new Handlebars.SafeString(domTemplate(options.hash));
  });
};

export default { includes, markdown, changelog };