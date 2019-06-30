import WatchJS from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import getRssData from './parser';
import { rssListRender, notifyRender } from './render';

export default () => {
  const state = {
    formStatus: 'init',
    rssListUrl: [],
    rssDataList: [],
    statusNotify: {
      text: '',
      type: '',
    },
  };

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
  WatchJS.watch(state, 'rssListUrl', () => getRssData(state));
  WatchJS.watch(state, 'statusNotify', () => notifyRender(state.statusNotify));
  WatchJS.watch(state, 'rssDataList', () => rssListRender(state.rssDataList));
};
