import WatchJS from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import { updateRss, loadRss } from './parser';
import { rssListRender, notifyRender } from './render';

export default () => {
  const state = {
    rssUrlList: [],
    rssDataList: [],
    rssTitlesList: [],
    formStatus: 'init',
    statusNotify: {
      text: '',
      type: '',
    },
  };

  const clearNotify = () => {
    state.statusNotify.text = '';
    state.statusNotify.type = '';
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
    clearNotify();
    if (!isURL(input.value)) {
      state.formStatus = 'invalid';
    } else if (state.rssUrlList.includes(input.value)) {
      state.formStatus = 'invalid';
      state.statusNotify.text = 'This channel has already been added!';
      state.statusNotify.type = 'warning';
    } else {
      state.formStatus = 'valid';
    }
  });

  button.addEventListener('click', (e) => {
    e.preventDefault();
    loadRss(input.value, state);
  });

  WatchJS.watch(state, 'formStatus', () => getFormStatus());
  WatchJS.watch(state, 'statusNotify', () => notifyRender(state.statusNotify));
  WatchJS.watch(state, 'rssUrlList', () => {
    if (state.rssUrlList.length === 1) {
      updateRss(state);
    }
  });
  WatchJS.watch(state, 'rssDataList', () => rssListRender(state.rssDataList));
};
