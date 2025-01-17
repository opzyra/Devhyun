import { createMarkdown } from 'safe-marked';
import removeMd from 'remove-markdown';
import htmlToText2 from 'html-to-text2';
import htmlToc from 'html-toc';
import xssHtmlFilter from 'xssfilter';

export const cutString = (value, max) => {
  let isOver = true;
  if (max >= value.length) {
    max = value.length;
    isOver = false;
  }
  return value.substring(0, max) + (isOver ? '...' : '');
};

export const anchorConvert = contents => {
  return contents
    .replace(/<a href=/gi, '<a target="_blank" href=')
    .replace(
      /<a target="_blank" href="(http:\/\/)?devhyun.com/gi,
      '<a href="https://devhyun.com',
    )
    .replace(
      /<a target="_blank" href="(https:\/\/)?devhyun.com/gi,
      '<a href="https://devhyun.com',
    );
};

export const lineBreakConvert = str => {
  return str.replace(/(\n|\r\n)/g, '<br>');
};

export const safeMarkdown = contents => {
  const markdown = createMarkdown({
    marked: { breaks: true, headerIds: false },
  });
  return markdown(contents);
};

export const removeMarkdown = markdown => {
  return removeMd(markdown);
};

export const parseMarkdown = (markdown, wordwrap) => {
  markdown = markdown.replace(/(?:\r\n|\r|\n)/g, ' ');
  markdown = markdown.replace(/(<code data).*(<\/code>)/g, '');

  let text = htmlToText2.fromString(markdown, {
    ignoreHref: true,
    ignoreImage: true,
  });

  text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
  return cutString(text, wordwrap).trim();
};

export const parseToc = contents => {
  let content = htmlToc(`<div id="toc"></div>${contents}`, {
    selectors: 'h1, h2, h3, h4, h5',
    anchors: false,
    slugger: function(text) {
      const re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
      return decodeURI(text)
        .toLowerCase()
        .trim()
        .replace(re, '')
        .replace(/\s/g, '_');
    },
  });

  // eslint-disable-next-line no-unused-vars
  let [toc, ...rest] = content.match(/(<div id="toc")(.|\r\n|\r|\n)*(<\/div>)/);

  return [content, toc];
};

export const xssFilter = contents => {
  return new xssHtmlFilter().filter(contents);
};

export const pagination = (rowCount, limit, page) => {
  let totalPages = Math.floor(rowCount / limit);
  if (rowCount % limit > 0) totalPages++;
  return {
    rowCount,
    totalPages,
    page,
  };
};
