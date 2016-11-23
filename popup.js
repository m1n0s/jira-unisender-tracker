'use strict';

const USER_KEY = `UniSenderJIRATrackerUser`;

const NEW_USER_SCREEN = $('new-user-screen');
const NEW_USER_FORM = $('new-user-form');

const TASKS_SCREEN = $('tasks-screen');
const TASKS_CONTAINER = $('tasks');
const TASKS_USERNAME = $('username');
const TASKS_COPY_BTN = $('copy-to-clipboard');
const TASKS_COPY_RESULT = $('copy-result');


getUserFromStorage(USER_KEY, user => {

  if (user && Object.keys(user).length) {
    addTasksFromStoreToContainer(TASKS_CONTAINER, user);
  } else {
    createNewUser();
  }

});


TASKS_COPY_BTN.addEventListener('click', event => {

  event.preventDefault();
  let range = document.createRange();
  range.selectNodeContents(TASKS_CONTAINER);
  window.getSelection().addRange(range);

  let success = document.execCommand('copy');
  TASKS_COPY_RESULT.textContent = `${success ? 'Copied!' : 'Error.'}`;

  setTimeout(() => {
    TASKS_COPY_RESULT.textContent = '';
  }, 1500);

  window.getSelection().removeAllRanges();

}, false);

NEW_USER_FORM.addEventListener('submit', event => {
  event.preventDefault();
  event.stopPropagation();

  let {target} = event;

  let auto = target[1].checked;
  let name = target[2].value;

  let newUser = {
    name,
    autoTrackMode: auto,
    ignoreAutoTrackTasks: [],
    tasks: {}
  };

  chrome.storage.sync.set({[USER_KEY]: newUser}, () => {
    addTasksFromStoreToContainer(TASKS_CONTAINER, newUser);
  });

}, false);

function getUserFromStorage(key, callback) {
  chrome.storage.sync.get(key, data => callback(data[key]));
}

function addTasksFromStoreToContainer(container, user) {

  hide(NEW_USER_SCREEN);
  show(TASKS_SCREEN);

  const {tasks, name} = user;
  let output;

  if (tasks && Object.keys(tasks).length) {
    output = Object
      .keys(tasks)
      .map(key => `${key} - ${tasks[key]}`)
      .join('\n');

  } else {

    output = `You haven't tracked tasks yet`;
    hide(TASKS_COPY_BTN);

  }

  TASKS_USERNAME.textContent = name;

  let text = document.createTextNode(output);
  container.appendChild(text);

}

function createNewUser() {
  hide(TASKS_SCREEN);
  show(NEW_USER_SCREEN);
}

function $(id) {
  return document.getElementById(id);
}

function hide(el) {
  return el.style.display = 'none';
}

function show(el) {
  el.style.display = 'block';
}





