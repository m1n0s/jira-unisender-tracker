function sendEmail(user) {

  const {tasks} = user;

  let output = Object
    .keys(tasks)
    .map(key => `${key} - ${tasks[key]}`)
    .join('\n');

  let subject = 'Тех. задания от {ИМЯ} за {МЕСЯЦ} {ГОД}';

  let options = {
    url: `mailto:epavliuk@bumazhkin.com?subject=${encodeURI(subject)}&body=${encodeURI(output)}`,
    active: false
  };

  chrome.tabs.create(options, tab => {
    setTimeout(() => {
      chrome.tabs.remove(tab.id);
    }, 500);
  });
}