/* eslint-disable no-param-reassign */
import axios from 'axios';

const parse = (rssUrl) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssUrl, 'application/xml');

  const title = doc.querySelector('title').textContent;
  const items = [...doc.querySelectorAll('item')];
  const rssData = items.map((item) => {
    const link = item.querySelector('link').textContent;
    const itemTitle = item.querySelector('title').textContent;
    const itemDescription = item.querySelector('description').textContent;
    return {
      link,
      itemTitle,
      itemDescription,
    };
  });
  return { title, rssData };
};

const getProxyUrl = rssUrl => `https://cors-anywhere.herokuapp.com/${rssUrl}`;

export default (state) => {
  const proxyUrls = state.rssListUrl.map(getProxyUrl);
  const promises = proxyUrls.map(axios.get);

  state.statusNotify.text = 'Loading...';
  state.statusNotify.type = 'info';

  axios.all(promises)
    .then((allRss) => {
      const newFeeds = allRss.map(rss => parse(rss.data).rssData);
      state.rssDataList = newFeeds;
    })
    .finally(() => {
      state.statusNotify.text = 'Channel has been successfully added!';
      state.statusNotify.type = 'success';
    });
};
