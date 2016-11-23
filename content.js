'use strict';

const USER_KEY = `UniSenderJIRATrackerUser`;


const ADD_TEXT = 'Add this task for report';
const REMOVE_TEXT = 'Remove this task from report';
const ADD_CLASS = 'add';
const REMOVE_CLASS = 'remove';

const BTN_ID = 'tasks-toggle-btn';

const viewIssueSidebar = $('viewissuesidebar');
const peopleModule = $('peoplemodule');

const CURRENT_TASK = getCurrentTask();
const CURRENT_TASK_KEY = Object.keys(CURRENT_TASK)[0];

let alreadyAdded = false;

getUserFromStorage(USER_KEY, user => renderButton(user));

function getCurrentTask() {
  let main = document.querySelector('.aui-page-header-main');
  let name = main.querySelector('#summary-val').textContent.trim();
  let code = main.querySelector('.aui-nav-breadcrumbs li:last-child a').textContent.trim();

  return {
    [code]: name
  }
}

function getUserFromStorage(key, callback) {
  chrome.storage.sync.get(key, data => callback(data[key]));
}

function renderButton(user) {

  if (!user) return;

  let {tasks} = user;

  alreadyAdded = Object.keys(tasks).some(key => key === CURRENT_TASK_KEY);

  let btn = $(BTN_ID);

  if (!btn) {
    btn = document.createElement('button');
    btn.id = BTN_ID;

    let caption = document.createTextNode(`${alreadyAdded ? REMOVE_TEXT : ADD_TEXT}`);

    btn.appendChild(caption);
    btn.classList.add('report-btn', `${alreadyAdded ? REMOVE_CLASS : ADD_CLASS}`);

    viewIssueSidebar.insertBefore(btn, peopleModule.nextSibling);

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

function $(id) {
  return document.getElementById(id);
}