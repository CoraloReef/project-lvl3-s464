/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';

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

export const updateRss = (state) => {
  const proxyUrl = state.rssUrlList.map(getProxyUrl);
  const promises = proxyUrl.map(axios.get);
  axios.all(promises)
    .then((rss) => {
      const rssData = rss.map(channel => parse(channel.data).rssData);
      const newRssData = _.differenceBy(_.flatten(rssData), state.rssDataList, 'link');
      state.rssDataList = [...newRssData, ...state.rssDataList];
    })
    .finally(() => {
      setInterval(() => {
        updateRss(state);
      }, 5000);
    })
    .catch(() => {
      state.statusNotify.text = 'Error updating channel!';
      state.statusNotify.type = 'danger';
    });
};

export const loadRss = (url, state) => {
  state.statusNotify.text = 'Loading...';
  state.statusNotify.type = 'info';
  const proxyUrl = getProxyUrl(url);
  axios.get(proxyUrl)
    .then(({ data }) => {
      state.formStatus = 'init';
      const doc = parse(data);
      const { title, rssData } = doc;
      state.rssTitlesList = [title, ...state.rssTitlesList];
      state.rssUrlList = [...state.rssUrlList, url];
      state.rssDataList = [...rssData, ...state.rssDataList];
    })
    .finally(() => {
      state.statusNotify.text = 'Channel has bin added!';
      state.statusNotify.type = 'success';
    })
    .catch(() => {
      state.statusNotify.text = 'Error adding channel!';
      state.statusNotify.type = 'danger';
    });
};
