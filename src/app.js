import WatchJS from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import i18next from 'i18next';
import translation from './translation';
import { updateRss, loadRss } from './loader';
import { rssListRender, notifyRender } from './render';

export default () => {
  const state = {
    rssUrlList: [],
    rssDataList: [],
    rssTitlesList: [],
    formStatus: 'init',
    statusNotify: 'init',
  };

  const form = document.querySelector('#rss-form');
  const input = document.querySelector('#rss-form input[type="text"]');
  const button = document.querySelector('#rss-form button[type="submit"]');

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

  i18next.init({
    lng: 'en',
    resources: {
      en: {
        translation,
      },
    },
  });

  const getFormStatus = () => formStatusActions[state.formStatus]();
  const isFirstRssUrl = () => state.rssUrlList.length === 1;

  input.addEventListener('input', () => {
    if (!isURL(input.value)) {
      state.formStatus = 'invalid';
    } else if (state.rssUrlList.includes(input.value)) {
      state.formStatus = 'invalid';
      state.statusNotify = 'warningAdded';
    } else {
      state.formStatus = 'valid';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    loadRss(input.value, state);
  });

  WatchJS.watch(state, 'formStatus', () => getFormStatus());
  WatchJS.watch(state, 'statusNotify', () => notifyRender(state.statusNotify));
  WatchJS.watch(state, 'rssUrlList', () => {
    if (isFirstRssUrl()) {
      updateRss(state);
    }
  });
  WatchJS.watch(state, 'rssDataList', () => rssListRender(state.rssDataList));
};
