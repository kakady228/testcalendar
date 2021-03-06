// Import stylesheets
// import './style.css';
var users = [];
var tasks = [];
var backlog = [];
var signedTasks = [];
var filteredBacklog = [];
var searchField = document.querySelector('#backlogSearch').value;
var dayNumberWidth = 112.23;
var gridWidth = 0;

var pageNumber = 0;
var listData = [
  { date: "2021-10-23" },
  { date: "2021-10-24" },
  { date: "2021-10-25" },
  { date: "2021-10-26" },
  { date: "2021-10-27" },
  { date: "2021-10-28" },
  { date: "2021-10-29" },
  { date: "2021-10-30" },
  { date: "2021-10-31" },
  { date: "2021-11-01" },
  { date: "2021-11-02" },
  { date: "2021-11-03" },
  { date: "2021-11-04" },
  { date: "2021-11-05" },
  { date: "2021-11-06" },
  { date: "2021-11-07" },
  { date: "2021-11-08" },
  { date: "2021-11-09" },
  { date: "2021-11-10" },
  { date: "2021-11-11" },
  { date: "2021-11-12" },
  { date: "2021-11-13" },
  { date: "2021-11-14" },
  { date: "2021-11-15" },
  { date: "2021-11-16" },
  { date: "2021-11-17" },
  { date: "2021-11-18" },
  { date: "2021-11-19" },
  { date: "2021-11-20" },
  { date: "2021-11-21" },
  { date: "2021-11-22" },
  { date: "2021-11-23" },
  { date: "2021-11-24" },
  { date: "2021-11-25" },
  { date: "2021-11-26" },
];
var size = 7;
var row = 1;
var column = 1;

var events = [];
var daysInaWeek = 7;
var sections = daysInaWeek;

var eventsOnaCalendar = [];

// Created Hook
setInterval(() => {
  dayNumberWidth = document.querySelector('.daynumbers li').getBoundingClientRect().width;
  gridWidth = document.querySelector('.calendar-container').getBoundingClientRect().width;
}, 100)



fetch('https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks')
  .then(response => response.json())
  .then(data => {
    tasks = data;
    // TASKS LIST
    tasks.forEach(task => {
      if (task.executor == null) {
        let backlogCardList = document.querySelector('.backlog-card-list');
        let taskDiv = document.createElement('div');
  
        taskDiv.setAttribute('class', 'backlog-card card my-1 text-start custom-title__2');
        taskDiv.setAttribute('title', '?????????????????? ????????, ?? ???????????????????? ???? ???????? ??????????????????');
        taskDiv.setAttribute('draggable', 'true');
        taskDiv.setAttribute('ondragstart', 'startDrag(event)');
        taskDiv.setAttribute('id', ''+ task.id +'');
  
        let taskHeader = document.createElement('div');
  
        taskHeader.setAttribute('class', 'card-header color-blue fw-bold');
        taskHeader.innerHTML = task.subject;
  
        let taskBody = document.createElement('div');
        let taskBodyP = document.createElement('p');
  
        taskBody.setAttribute('class', 'card-body');
        taskBodyP.innerHTML =  'Task description should be here';
        taskBody.appendChild(taskBodyP);
      
        taskDiv.appendChild(taskHeader);
        taskDiv.appendChild(taskBody);
  
        backlogCardList.appendChild(taskDiv);
      }

      
    });
    eventList();
  })

   // EVENT LIST
   function eventList() {
    setTimeout(() => {
        backlog = tasks.filter((el) => {
            var backlogArr = [];
            if (el.executor == null) {
              return backlogArr.push(el);
            }
          });
        
          tasks.forEach((task) => {
            if (task.executor !== null) {
              let executor = task.executor*3;
              task.executor = executor;
              signedTasks.push(task);
            }
          });
          for (let i = 0; i < paginatedData().length; i++) {
            const element = paginatedData()[i];
            signedTasks.forEach(event => {
              if(event.planStartDate === element.date) {
                event["weekDay"] = i + 1;
                eventsOnaCalendar.push(event);
              }
            });
          }
          
      
      filteredBacklog = backlog;
      eventsOnaCalendar.forEach(event => {
        let eventContainer = document.querySelector('.event-container');
        eventContainer.setAttribute('ondrop', 'drop(event)');

        let eventDiv = document.createElement('div');

        eventDiv.setAttribute('class', 'event-slot slot-1');
        eventDiv.setAttribute('title', event.subject);
        eventDiv.setAttribute('style', 'grid-column: '+ event.weekDay +'; grid-row: '+ event.executor +' ');

        let innerDiv = document.createElement('div');

        innerDiv.setAttribute('style', 'width: '+ dayNumberWidth +'px; text-align: center;');
        innerDiv.setAttribute('class', 'event-status');

        innerDiv.innerHTML = event.subject;

        eventDiv.appendChild(innerDiv);
        eventContainer.appendChild(eventDiv);
      });
    }, 300);
  }
 
  
fetch('https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users')
  .then(response => response.json())
  .then(data => {
    users = data;
    
    // USERS LIST
    users.forEach(user => {
      let usersUl = document.querySelector('.users');
      let userLi = document.createElement('li');
    
      userLi.innerHTML = user.username;
      userLi.setAttribute('style', '--gridWidth: '+ gridWidth +'px;');
      userLi.setAttribute('ondragover', 'allowDrop(event)');
      userLi.setAttribute('ondrop', 'onDropUser(event)');
      usersUl.appendChild(userLi);
    });
  })


  // DAY NUMBERS
  
paginatedData().forEach(element => {
  let dateUl = document.querySelector('.daynumbers');
  let dateLi = document.createElement('li');

  dateLi.innerHTML = element.date;
  dateUl.appendChild(dateLi);
});

function addTask(task) {
  const event = task;
  for (let i = 0; i < paginatedData().length; i++) {
    const element = paginatedData()[i];
      event["weekDay"] = i + 1;
      event.executor = row;
      signedTasks.push(event);
  }
  reRenderGrid();
}

setInterval(() => {
  if(pageNumber >= pageCount()-1) {
    document.querySelector('#nextButton').setAttribute('disabled', 'true');
  } else {
    document.querySelector('#nextButton').removeAttribute('disabled');
  }

  if(pageNumber <= 0) {
    document.querySelector('#prevButton').setAttribute('disabled', 'true');
  } else {
    document.querySelector('#prevButton').removeAttribute('disabled');
  }
}, 100);

// PAGINATION
function nextPage() {
  pageNumber++;
  reRenderDays();
}

function prevPage() {
  pageNumber--;
  reRenderDays();
}

function clearArray(array) {
  return array = [];
}

function reRenderDays() {
  var dateUl = document.querySelector('.daynumbers');

  dateUl.innerHTML = '';
  paginatedData().forEach(element => {
    let dateLi = document.createElement('li');

    dateLi.innerHTML = element.date;
    dateUl.appendChild(dateLi);
  });

  this.reRenderGrid();
}

function reRenderBacklog() {
  var backlogDiv = document.querySelector('.backlog-card-list');

  backlogDiv.innerHTML = '';
  backlog.forEach(task => {
    if (task.executor == null) {
        let backlogCardList = document.querySelector('.backlog-card-list');
        let taskDiv = document.createElement('div');
  
        taskDiv.setAttribute('class', 'backlog-card card my-1 text-start custom-title__2');
        taskDiv.setAttribute('title', '?????????????????? ????????, ?? ???????????????????? ???? ???????? ??????????????????');
        taskDiv.setAttribute('draggable', 'true');
        taskDiv.setAttribute('ondragstart', 'startDrag(event)');
        taskDiv.setAttribute('id', ''+ task.id +'');
  
        let taskHeader = document.createElement('div');
  
        taskHeader.setAttribute('class', 'card-header color-blue fw-bold');
        taskHeader.innerHTML = task.subject;
  
        let taskBody = document.createElement('div');
        let taskBodyP = document.createElement('p');
  
        taskBody.setAttribute('class', 'card-body');
        taskBodyP.innerHTML =  'Task description should be here';
        taskBody.appendChild(taskBodyP);
      
        taskDiv.appendChild(taskHeader);
        taskDiv.appendChild(taskBody);
  
        backlogCardList.appendChild(taskDiv);
      }
  });
}

function reRenderGrid() {
  var eventContainer = document.querySelector('.event-container');
  
  eventsOnaCalendar = clearArray(signedTasks);
  for (let i = 0; i < paginatedData().length; i++) {
    const element = paginatedData()[i];
    signedTasks.forEach((event) => {
      if(event.planStartDate == element.date) {
        event["weekDay"] = i + 1;
        eventsOnaCalendar.push(event);
      }
    });
  }

  eventContainer.innerHTML = '';
  eventsOnaCalendar.forEach(event => {
    let eventDiv = document.createElement('div');

    eventDiv.setAttribute('class', 'event-slot slot-1');
    eventDiv.setAttribute('title', event.subject);
    eventDiv.setAttribute('style', 'grid-column: '+ event.weekDay +'; grid-row: '+ event.executor +' ');

    let innerDiv = document.createElement('div');

    innerDiv.setAttribute('style', 'width: '+ dayNumberWidth +'px; text-align: center;');
    innerDiv.setAttribute('class', 'event-status');

    innerDiv.innerHTML = event.subject;

    eventDiv.appendChild(innerDiv);
    eventContainer.appendChild(eventDiv);
  });
}

function pageCount() {
  let length = listData.length;
  let size1 = size;
  return Math.ceil(length/size1);
}

function paginatedData() {
  const start = pageNumber * size,
  end = start + size;
  return listData.slice(start, end);
}


function relativeCoords(event) {
  var element = document.querySelector('.event-container');
  var bounds = element.getBoundingClientRect();
  var x = event.clientX - bounds.left;
  var y = event.clientY - bounds.top;
  row = 1;
  column = 1;
  for (let i = 0; i < users.length*3; i++) {
    const element = users[i];
    if (i == 0 && y >= 0 && y <= 33.333) {
      row = 1;
    } else if (i == 1 && y >= 33.334 && y <= 66.666) {
      row = 2;
    } else if (i == 2 && y >= 66.667 && y <= 100) {
      row = 3;
    } else if (y >= (100/3 * i) + 1 && y <= 100/3 * (i + 1)) {
      row = i + 1;
    }
  }

  var container = document.querySelector('.event-container');
  dayNumberWidth = document.querySelector('.daynumbers li').getBoundingClientRect().width;
  
  for (let i = 0; i < 7; i++) {
    if (i == 0 && x >= 0 && x <= dayNumberWidth) {
      column = 1;
    } else if ( x >= (dayNumberWidth * i) + 1 && dayNumberWidth * (i + 1)) {
      column = i + 1;
    }
  }
}

// ////////////////////////////

  const eventZone = document.querySelector('.event-container');
  const usersEventZone = document.querySelector('.users li');
  const event = document.querySelector('event-slot');
  
  eventZone.ondragover = allowDrop;
  
  function allowDrop(event) {
    event.preventDefault();
  }

// ////////////////////////////

function startDrag(event) {
  event.dataTransfer.dropEffect = 'move';
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('itemID', event.target.id);
}

function drop(event) {
  const itemID = event.dataTransfer.getData('itemID');
  const item = backlog.find(item => item.id === itemID);
  relativeCoords(event);
  
  let weekDay = paginatedData()[column-1].date;
  item.planStartDate = weekDay;
  item["weekDay"] = column;
  item.executor = row - 3;
  signedTasks.push(item);
  
  addTask(item);
  
  deleteEventBacklog(item);

  reRenderBacklog();
  
  reRenderGrid();
}

function onDropUser(event) {
  const itemID = event.dataTransfer.getData('itemID');
  const item = backlog.find((item) => item.id == itemID);
  relativeCoords(event);
  
  item.planStartDate = '2021-10-26';
  item.executor = row - 3;
  
  for (let i = 0; i < paginatedData().length; i++) {
    const date = paginatedData()[i];
    if (item.planStartDate == date.date) {
      item['weekDay'] = i + 1;
    }
  }
  signedTasks.push(item);
  
  reRenderGrid();

  reRenderBacklog();
  
  addTask(item);
  
  deleteEventBacklog(item);
  
}

function deleteEventBacklog(item) {
  const index = backlog.indexOf(item);
  if (index > -1) {
    backlog.splice(index, 1);
  }
}

function reRenderFilteredBacklog() {
  var backlogDiv = document.querySelector('.backlog-card-list');

  backlogDiv.innerHTML = '';
  filteredBacklog.forEach(task => {
    if (task.executor == null) {
        let backlogCardList = document.querySelector('.backlog-card-list');
        let taskDiv = document.createElement('div');
  
        taskDiv.setAttribute('class', 'backlog-card card my-1 text-start custom-title__2');
        taskDiv.setAttribute('title', '?????????????????? ????????, ?? ???????????????????? ???? ???????? ??????????????????');
        taskDiv.setAttribute('draggable', 'true');
        taskDiv.setAttribute('ondragstart', 'startDrag(event)');
        taskDiv.setAttribute('id', ''+ task.id +'');
  
        let taskHeader = document.createElement('div');
  
        taskHeader.setAttribute('class', 'card-header color-blue fw-bold');
        taskHeader.innerHTML = task.subject;
  
        let taskBody = document.createElement('div');
        let taskBodyP = document.createElement('p');
  
        taskBody.setAttribute('class', 'card-body');
        taskBodyP.innerHTML =  'Task description should be here';
        taskBody.appendChild(taskBodyP);
      
        taskDiv.appendChild(taskHeader);
        taskDiv.appendChild(taskBody);
  
        backlogCardList.appendChild(taskDiv);
      }
  });
}

function backlogSearch() {

  var searchField = document.querySelector('#backlogSearch').value;
  if (searchField !== '') {
    
    filteredBacklog = backlog.filter((el) => el.subject.toLowerCase() === searchField.toLowerCase());
    reRenderFilteredBacklog();

  } else {

    filteredBacklog = backlog;
    reRenderFilteredBacklog();

  }
}