'use strict';

const USER_KEY = `UniSenderJIRATrackerUser`;

const NEW_USER_SCREEN = $('new-user-screen');
const NEW_USER_FORM = $('new-user-form');

const TASKS_SCREEN = $('tasks-screen');
const TASKS_CONTAINER = $('tasks');
const TASKS_USERNAME = $('username');
const TASKS_SETTINGS = $('go-to-settings');
const TASKS_COPY_BTN = $('copy-to-clipboard');
const TASKS_MAIL_BTN = $('send-email');
const TASKS_DELETE_BTN = $('delete-tasks');
const TASKS_COPY_RESULT = $('copy-result');

const SETTINGS_SCREEN = $('user-settings');
const SETTINGS_USER = $('settings-username');
const SETTINGS_FORM = $('settings-form');
const SETTINGS_BACK = $('settings-back');
const SETTINGS_DELETE_ALL_BTN = $('delete-all');

hide(SETTINGS_SCREEN);
hide(NEW_USER_SCREEN);
hide(TASKS_SCREEN);

getUserFromStorage(USER_KEY)
  .then(user => {

    console.log(user);

    if (user && Object.keys(user).length) {
      addTasksFromStoreToContainer(TASKS_CONTAINER, user);
    } else {
      showCreateNewUser();
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

});

NEW_USER_FORM.addEventListener('submit', event => {

  event.preventDefault();

  let {target} = event;

  let name = target[0].value;
  let auto = target[2].checked;

  let newUser = {
    name,
    autoTrackMode: auto,
    ignoreAutoTrackTasks: [],
    tasks: {}
  };

  chrome.storage.sync.set({[USER_KEY]: newUser}, () => {
    addTasksFromStoreToContainer(TASKS_CONTAINER, newUser);
  });

});

TASKS_SETTINGS.addEventListener('click', event => {
  event.preventDefault();

  getUserFromStorage(USER_KEY)
    .then(user => {

      hide(TASKS_SCREEN);
      show(SETTINGS_SCREEN);

      SETTINGS_USER.textContent = getTrueName(user.name);

      let manualRadio = SETTINGS_FORM.querySelector('#settings-mode-manual');
      let autoRadio = SETTINGS_FORM.querySelector('#settings-mode-auto');
      let nameInput = SETTINGS_FORM.querySelector('#settings-name');

      if (user.autoTrackMode) {
        autoRadio.checked = true;
      } else {
        manualRadio.checked = true;
      }

      nameInput.value = user.name;
    });

});

SETTINGS_BACK.addEventListener('click', event => {
  event.preventDefault();

  hide(SETTINGS_SCREEN);
  show(TASKS_SCREEN);

});

SETTINGS_FORM.addEventListener('submit', event => {
  event.preventDefault();

  let {target} = event;

  let name = target[0].value;
  let auto = target[2].checked;

  getUserFromStorage(USER_KEY)
    .then(user => {

      let updatedUser = Object.assign({}, user, {
        name,
        autoTrackMode: auto
      });

      chrome.storage.sync.set({[USER_KEY]: updatedUser}, () => {
        addTasksFromStoreToContainer(TASKS_CONTAINER, updatedUser);
      });

    });

});

TASKS_DELETE_BTN.addEventListener('click', event => {

  event.preventDefault();

  getUserFromStorage(USER_KEY)
    .then(user => {

      let updatedUser = Object.assign({}, user, {
        tasks: {}
      });

      chrome.storage.sync.set({[USER_KEY]: updatedUser}, () => {
        addTasksFromStoreToContainer(TASKS_CONTAINER, updatedUser);
      });

    });

});

SETTINGS_DELETE_ALL_BTN.addEventListener('click', event => {
  event.preventDefault();

  chrome.storage.sync.set({[USER_KEY]: null}, () => {
    showCreateNewUser();
  });
});

TASKS_MAIL_BTN.addEventListener('click', sendEmail, false);

function getUserFromStorage(key) {
  return new Promise(resolve => {
    chrome.storage.sync.get(key, data => resolve(data[key]))
  });
}

function addTasksFromStoreToContainer(container, user) {

  hide(SETTINGS_SCREEN);
  hide(NEW_USER_SCREEN);

  hide(TASKS_MAIL_BTN);
  hide(TASKS_COPY_BTN);
  hide(TASKS_DELETE_BTN);

  show(TASKS_SCREEN);


  const {tasks, name} = user;
  let output;

  if (tasks && Object.keys(tasks).length) {
    output = Object
      .keys(tasks)
      .map(key => `${key} - ${tasks[key]}`)
      .join('\n');

    show(TASKS_COPY_BTN);
    show(TASKS_MAIL_BTN);
    show(TASKS_DELETE_BTN);

  } else {
    output = `You haven't tracked tasks yet`;
  }

  TASKS_USERNAME.textContent = getTrueName(name);

  let text = document.createTextNode(output);

  removeChildren(container);
  container.appendChild(text);

}

function sendEmail() {
  getUserFromStorage(USER_KEY)
    .then(chrome.extension.getBackgroundPage().sendEmail);
}

function removeChildren(el) {
  while (el.firstChild) el.firstChild.remove()
}

function showCreateNewUser() {
  hide(TASKS_SCREEN);
  hide(SETTINGS_SCREEN);
  show(NEW_USER_SCREEN);
}

function $(id) {
  return document.getElementById(id);
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = el.tagName === 'BUTTON' ? 'inline-block' : 'block';
}

function getTrueName(name) {
  return name && `${name.charAt(0).toUpperCase()}. ${name.charAt(1).toUpperCase()}${name.slice(2)}`
}




