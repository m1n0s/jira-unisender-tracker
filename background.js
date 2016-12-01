function sendEmail(user) {

  const {tasks} = user;

  let output = Object
    .keys(tasks)
    .map(key => `${key} - ${tasks[key]}`)
    .join('\n');

  let options = {
    url: 'mailto:lhrabovetskiy@unisender.com?body='+ encodeURI(output),
    active: false
  };

  chrome.tabs.create(options, tab => {
    setTimeout(() => {
      chrome.tabs.remove(tab.id);
    }, 500);
  });
}