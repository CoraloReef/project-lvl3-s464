import WatchJS from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import render from './render';

export default () => {
  const input = document.querySelector('#rss-form input[type="text"]');
  const button = document.querySelector('#rss-form button[type="submit"]');

  const state = {
    formStatus: 'init',
    rssListUrl: [],
    rssDataList: [],
  };

  const formStatusActions = {
    init: () => {
      button.disabled = true;
      input.classList.remove('is-valid', 'is-invalid');
      input.value = '';
    },
    invalid: () => {
      button.disabled = true;
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    },
    valid: () => {
      button.disabled = false;
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    },
  };

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

  const getRssData = () => {
    const proxyUrls = state.rssListUrl.map(getProxyUrl);
    const promises = proxyUrls.map(axios.get);
    axios.all(promises)
      .then((allRss) => {
        const newFeeds = allRss.map(rss => parse(rss.data).rssData);
        state.rssDataList = newFeeds;
      })
      .finally(() => {
        // console.log(state.rssDataList);
      });
  };

  const getFormStatus = () => formStatusActions[state.formStatus]();

  input.addEventListener('input', () => {
    if (isURL(input.value) && !state.rssListUrl.includes(input.value)) {
      state.formStatus = 'valid';
    } else {
      state.formStatus = 'invalid';
    }
  });

  button.addEventListener('click', (e) => {
    e.preventDefault();
    state.rssListUrl = [...state.rssListUrl, input.value];
    state.formStatus = 'init';
  });

  WatchJS.watch(state, 'formStatus', () => getFormStatus());
  WatchJS.watch(state, 'rssListUrl', () => getRssData());
  WatchJS.watch(state, 'rssDataList', () => render(state.rssDataList));
};
