document.addEventListener('DOMContentLoaded', () => {

  const tasksContainer = $('tasks');
  const copyResult = $('copy-result');
  const copyBtn = $('copy-to-clipboard');
  //const userKey = 'JIRAUniSenderTrackerUser';
  const storeKey = 'JIRAUniSenderTracker';
  //const user = getUserFromStorage(userKey);

  addTasksFromStoreToContainer(tasksContainer, storeKey);

  copyBtn.addEventListener('click', (event) => {

    event.preventDefault();
    let range = document.createRange();
    range.selectNodeContents(tasksContainer);
    window.getSelection().addRange(range);

    let success = document.execCommand('copy');
    copyResult.textContent = `${success ? 'Copied!' : 'Error.'}`;

    setTimeout(() => {
      copyResult.textContent = '';
    }, 1500);

    window.getSelection().removeAllRanges();

  }, false);


});




function getUserFromStorage(key) {

  chrome.storage.sync.get(key, data => {
    return data[key]
  });

}


function addTasksFromStoreToContainer(container, storeKey) {

  chrome.storage.sync.get(storeKey, data => {

    const tasks = data[storeKey];
    let output;

    if (tasks) {
      output = Object
        .keys(tasks)
        .map(key => `${key} - ${tasks[key]}`)
        .join('\n');
    } else {
      output = `You haven't tracked tasks yet`;
    }

    let text = document.createTextNode(output);
    container.appendChild(text);

    return text
  });
}

function $(id) {
  return document.getElementById(id);
}





