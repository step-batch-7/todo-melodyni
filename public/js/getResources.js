const todoTemplate = `
<div class="log" id="__id__"> 
<h1 class="title" id="__id__">__title__</h1>
</div>`;

const taskTemplate = `
<div class="taskBox" id="__taskId__">
  <div class="checkBox">__status__</div>
  <div class="task">__taskName__</div>
</div><br>`;

const fillTemplate = function(template, propertyBag) {
  const keys = Object.keys(propertyBag);
  const replaceKeyByValue = function(template, key) {
    const pattern = new RegExp(`__${key}__`, 'g');
    return template.replace(pattern, propertyBag[key]);
  };
  const html = keys.reduce(replaceKeyByValue, template);
  return html;
};

const collectTODO = function(todo) {
  return fillTemplate(todoTemplate, todo);
};
const collectTASK = function(task) {
  return fillTemplate(taskTemplate, task);
};

const fetchResources = function(url, callBack) {
  const request = new XMLHttpRequest();
  request.onload = function() {
    if (this.status === 200) {
      callBack(JSON.parse(this.responseText));
    }
  };
  request.open('GET', url);
  request.send();
};
