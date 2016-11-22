'use strict';

const USER = 'lhrabovetskyi';
const storeKey = 'JIRAUniSenderTracker';

const ADD_TEXT = 'Add this task for report';
const REMOVE_TEXT = 'Remove this task from report';
const ADD_CLASS = 'add';
const REMOVE_CLASS = 'remove';

const BTN_ID = `${USER}-tasks-toggle`;

const viewIssueSidebar = $('viewissuesidebar');
const peopleModule = $('peoplemodule');

const CURRENT_TASK = getCurrentTask();
const CURRENT_TASK_KEY = Object.keys(CURRENT_TASK)[0];

getDataFromStorage(storeKey, data => {
  renderButton(data);
});
/*
chrome.storage.sync.get(storeKey, data => {

  let tasks = data[storeKey] || {};
  let currentTask = getCurrentTask();

  let currentTaskKey = Object.keys(currentTask)[0]; //We always know that this obj has only one key/value

  let alreadyAdded = Object.keys(tasks).some(key => key === currentTaskKey);

  const viewIssueSidebar = document.getElementById('viewissuesidebar');
  const peopleModule = document.getElementById('peoplemodule');

  let btn = document.createElement('button');
  let caption = document.createTextNode(`${alreadyAdded ? REMOVE_TEXT : ADD_TEXT}`);

  btn.appendChild(caption);
  btn.classList.add('report-btn', `${alreadyAdded ? 'remove' : 'add'}`);

  viewIssueSidebar.insertBefore(btn, peopleModule.nextSibling);

  btn.addEventListener('click', () => {

    if (alreadyAdded) {
      delete tasks[currentTaskKey];
    } else {
      Object.assign(tasks, currentTask);
    }

    chrome.storage.sync.set({[storeKey]: tasks}, () => {
      location.reload();//TODO make this possible without reload
    });

  }, false);

});*/

function getCurrentTask() {
  let main = document.querySelector('.aui-page-header-main');
  let name = main.querySelector('#summary-val').textContent.trim();
  let code = main.querySelector('.aui-nav-breadcrumbs li:last-child a').textContent.trim();

  return {
    [code]: name
  }
}

function getDataFromStorage(storeKey, callback) {
  chrome.storage.sync.get(storeKey, data => {
    callback(data);
  });
}

function renderButton(data) {

  let tasks = data[storeKey] || {};

  console.log(tasks);
   //We always know that this obj has only one key/value

  let alreadyAdded = Object.keys(tasks).some(key => {
    /*console.log(key);
     console.log(currentTaskKey);
     console.log(key === currentTaskKey);*/
    return key === CURRENT_TASK_KEY
  });

  let btn = $(BTN_ID);

  if (!btn) {
    btn = document.createElement('button');
    btn.id = BTN_ID;

    let caption = document.createTextNode(`${alreadyAdded ? REMOVE_TEXT : ADD_TEXT}`);

    btn.appendChild(caption);
    btn.classList.add('report-btn', `${alreadyAdded ? REMOVE_CLASS : ADD_CLASS}`);

    viewIssueSidebar.insertBefore(btn, peopleModule.nextSibling);

    btn.addEventListener('click', () => {

      let updatedTasks;

      if (alreadyAdded) {
        console.log(tasks);
        let filteredTasks = Object.keys(tasks).map(task => task !== CURRENT_TASK);
        console.log(filteredTasks);
        updatedTasks = Object.assign({}, filteredTasks);
      } else {
        updatedTasks = Object.assign({}, tasks, CURRENT_TASK);
      }

      chrome.storage.sync.set({[storeKey]: updatedTasks}, () => {
        getDataFromStorage(storeKey, data => {
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