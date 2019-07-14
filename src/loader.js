/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';
import parse from './parser';

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
      setTimeout(() => {
        updateRss(state);
      }, 5000);
    })
    .catch(() => {
      state.statusNotify = 'errorUpdate';
    });
};

export const loadRss = (url, state) => {
  state.statusNotify = 'loading';
  state.formStatus = 'init';
  const proxyUrl = getProxyUrl(url);
  axios.get(proxyUrl)
    .then(({ data }) => {
      const doc = parse(data);
      const { title, rssData } = doc;
      state.rssTitlesList = [title, ...state.rssTitlesList];
      state.rssUrlList = [...state.rssUrlList, url];
      state.rssDataList = [...rssData, ...state.rssDataList];
      state.statusNotify = 'added';
    })
    .catch(() => {
      state.statusNotify = 'errorAdd';
    });
};
