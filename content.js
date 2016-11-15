'use strict';

//const user = 'lhrabovetskyi';
const storeKey = 'JIRAUniSenderTracker';

chrome.storage.sync.get(storeKey, data => {

  let tasks = data[storeKey] || {};
  let currentTask = getCurrentTask();

  let currentTaskKey = Object.keys(currentTask)[0]; //We always know that this obj has only one key/value

  let alreadyAdded = Object.keys(tasks).some(key => key === currentTaskKey);

  const viewIssueSidebar = document.getElementById('viewissuesidebar');
  const peopleModule = document.getElementById('peoplemodule');

  let btn = document.createElement('button');
  let caption = document.createTextNode(`${alreadyAdded ? 'Remove this task from report' : 'Add this task for report'}`);

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
      //alert('Task status saved');
      location.reload();//TODO make this possible without reload
    });

  }, false);

});

function getCurrentTask() {
  let main = document.querySelector('.aui-page-header-main');
  let name = main.querySelector('#summary-val').textContent.trim();
  let code = main.querySelector('.aui-nav-breadcrumbs li:last-child a').textContent.trim();

  return {
    [code]: name
  }
}