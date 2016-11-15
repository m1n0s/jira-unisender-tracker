document.addEventListener('DOMContentLoaded', () => {
  const tasksContainer = document.getElementById('tasks');
  //const user = 'lhrabovetskyi';
  const storeKey = 'JIRAUniSenderTracker';

  chrome.storage.sync.get(storeKey, data => {

    const tasks = data[storeKey];
    let output;

    if (tasks) {
      output = Object
        .keys(tasks)
        .map(key => `${key} - ${tasks[key]}`)
        .join('\n\r');
    } else {
      output = `You haven't tracked tasks yet`;
    }

    let text = document.createTextNode(output);

    tasksContainer.appendChild(text);

  });

});





