'use strict';

const USER = 'lhrabovetskyi';
const STORE_KEY = `${USER}UniSenderJIRATracker`;

const ADD_TEXT = 'Add this task for report';
const REMOVE_TEXT = 'Remove this task from report';
const ADD_CLASS = 'add';
const REMOVE_CLASS = 'remove';

const BTN_ID = `${USER}-tasks-toggle`;

const viewIssueSidebar = $('viewissuesidebar');
const peopleModule = $('peoplemodule');

const CURRENT_TASK = getCurrentTask();
const CURRENT_TASK_KEY = Object.keys(CURRENT_TASK)[0];

let alreadyAdded = false;

getDataFromStorage(data => {
  renderButton(data);
});

function getCurrentTask() {
  let main = document.querySelector('.aui-page-header-main');
  let name = main.querySelector('#summary-val').textContent.trim();
  let code = main.querySelector('.aui-nav-breadcrumbs li:last-child a').textContent.trim();

  return {
    [code]: name
  }
}

function getDataFromStorage(callback) {
  chrome.storage.sync.get(STORE_KEY, data => {
    callback(data[STORE_KEY] || {});
  });
}

function renderButton(tasks) {

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

      chrome.storage.sync.set({[STORE_KEY]: tasks}, () => {
        getDataFromStorage(data => {
          renderButton(data);
        });
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