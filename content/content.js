'use strict';

const USER_KEY = `UniSenderJIRATrackerUser`;

const ADD_TEXT = 'Add to list';
const REMOVE_TEXT = 'Remove from list';

const ADDED_NOW_TEXT = 'Issue is added to your list now.';
const ADDED_BEFORE_TEXT = 'Issue was previously added to list.';
const NOT_ADDED_TEXT = 'Issue is not in list.';

const ADD_CLASS = 'add';
const REMOVE_CLASS = 'remove';

const BTN_ID = 'tasks-toggle-btn';

const CONTAINER = document.querySelector('#peoplemodule .mod-content .item-details:last-child li');

const CURRENT_TASK = getCurrentTask();
const CURRENT_TASK_KEY = Object.keys(CURRENT_TASK)[0];
const CURRENT_ASSIGNEE = getCurrentAssignee();

let alreadyAdded = false;

getUserFromStorage(USER_KEY, user => {
  if (!user) return;

  if (user.autoTrackMode) {
    checkTask(user);
  } else {
    renderButton(user);
  }
});

function getUserFromStorage(key, callback) {
  chrome.storage.sync.get(key, data => callback(data[key]));
}

function renderButton(user) {

  let {tasks} = user;

  alreadyAdded = Object.keys(tasks).some(key => key === CURRENT_TASK_KEY);

  let btn = $(BTN_ID);

  if (!btn) {

    let dl = document.createElement('dl');
    let dt = document.createElement('dt');
    let dd = document.createElement('dd');

    let title = document.createTextNode('UniSender Tracking:');
    btn = document.createElement('button');
    btn.id = BTN_ID;

    let caption = document.createTextNode(`${alreadyAdded ? REMOVE_TEXT : ADD_TEXT}`);
    btn.appendChild(caption);
    btn.classList.add('report-btn', `${alreadyAdded ? REMOVE_CLASS : ADD_CLASS}`);

    dt.appendChild(title);
    dd.appendChild(btn);

    dl.appendChild(dt);
    dl.appendChild(dd);

    CONTAINER.appendChild(dl);

    btn.addEventListener('click', () => {

      if (alreadyAdded) {
        delete tasks[CURRENT_TASK_KEY]
      } else {
        Object.assign(tasks, CURRENT_TASK);
      }

      let updatedUser = Object.assign({}, user, {tasks});

      chrome.storage.sync.set({[USER_KEY]: updatedUser}, () => {
        getUserFromStorage(USER_KEY, user => renderButton(user));
      });

    }, false);

  } else {

    btn.classList.remove(ADD_CLASS, REMOVE_CLASS);
    btn.classList.add(`${alreadyAdded ? REMOVE_CLASS : ADD_CLASS}`);
    btn.textContent = `${alreadyAdded ? REMOVE_TEXT : ADD_TEXT}`;

  }

}

function checkTask(user) {

  let {tasks, name} = user;

  alreadyAdded = Object.keys(tasks).some(key => key === CURRENT_TASK_KEY);
  
  let isAssigned = CURRENT_ASSIGNEE === name;

  if (alreadyAdded) {
      renderMessage(ADDED_BEFORE_TEXT);
  } else {

    if (isAssigned) {

      let updatedUser = Object.assign({}, user, {tasks: Object.assign({}, tasks, CURRENT_TASK)});
      chrome.storage.sync.set({[USER_KEY]: updatedUser}, () => {
        getUserFromStorage(USER_KEY, user => renderMessage(ADDED_NOW_TEXT));
      });

    } else {
      renderMessage(NOT_ADDED_TEXT);
    }

  }

}

function renderMessage(msg) {

  let dl = document.createElement('dl');
  let dt = document.createElement('dt');
  let dd = document.createElement('dd');

  let title = document.createTextNode('UniSender Tracking:');
  let message = document.createTextNode(msg);

  dt.appendChild(title);
  dd.appendChild(message);

  dl.appendChild(dt);
  dl.appendChild(dd);

  CONTAINER.appendChild(dl);
}

function getCurrentTask() {
  let main = document.querySelector('.aui-page-header-main');
  let name = main.querySelector('#summary-val').textContent.trim();
  let code = main.querySelector('.aui-nav-breadcrumbs li:last-child a').textContent.trim();

  return {
    [code]: name
  }
}

function getCurrentAssignee() {
  return document.querySelector('#assignee-val .user-hover').attributes.rel.value
}

function $(id) {
  return document.getElementById(id);
}