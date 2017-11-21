const _sessions = {};
const _notifiers = {
  version: [],
  task: []
};


export const versions = [
  {
    id: 'default',
    instanceCount: 0,
    status: 'green',
    runtime: 'python27',
    environment: 'flexible',
  },
  {
    id: 'backend-api',
    instanceCount: 5,
    status: 'green',
    runtime: 'nodejs',
    environment: 'standard',
  },
  {
    id: '20170618',
    instanceCount: 7,
    status: 'yellow',
    runtime: 'custom',
    environment: 'flexible',
  },
  {
    id: '20170619',
    instanceCount: 0,
    status: 'red',
    runtime: 'go16',
    environment: 'flexible',
  }
];

export const tasks = [
  {
    id: 'task-1',
    name: 'Initializing instance',
    percentComplete: 0,
    status: 'Waiting'
  },
  {
    id: 'task-2',
    name: 'Adding components',
    percentComplete: 0,
    status: 'Waiting'
  },
  {
    id: 'task-3',
    name: 'Testing infrastructure',
    percentComplete: 0,
    status: 'Waiting'
  },
  {
    id: 'task-4',
    name: 'Removing instance',
    percentComplete: 0,
    status: 'Waiting'
  }
];

const increments = [5, 10, 20, 25];


setInterval(
  () => {
    const version = versions[
      Math.floor(Math.random() * versions.length)
    ];

    const status = Math.floor(3*Math.random());
    const stati = ['green', 'yellow', 'red'];
    version.status = stati[status];

    _notifiers.version.forEach(notifier => notifier(version));
  },
  2000
);

setInterval(
  () => {
    versions.forEach((version) => {
      version.instanceCount++;
      _notifiers.version.forEach(notifier => notifier(version));
    });
  },
  1000
);


setInterval(
  () => {
    const task = tasks[
      Math.floor(Math.random() * tasks.length)
    ];

    if (!task.percentComplete) {
      task.status = 'Running';
    }

    _notifiers.task.forEach(notifier => notifier(task));
  },
  2000
);

setInterval(
  () => {
    tasks.forEach((task) => {
      if (task.status === 'Running') {
        if (task.percentComplete < 100) {
          task.percentComplete = Math.min(100, task.percentComplete +
            increments[
              Math.floor(Math.random() * increments.length)
            ]
          );
        } else {
          task.percentComplete = 0;
          task.status = 'Waiting';
        }
        _notifiers.task.forEach(notifier => notifier(task));
      }
    });
  },
  1000
);

export function addSession(token, data) {
  _sessions[token] = data;
}

export function getSession(token) {
  return _sessions[token];
}

export function addNotifier(type, cb) {
  _notifiers[type].push(cb);
}

export function getTasks(filters) {
  if (filters) {
    return Promise.resolve({
      tasks: tasks.filter(task =>
        Object.keys(filters).some(filter => task[filter] === filters[filter])
      )
    });
  }
  return Promise.resolve({ tasks });
}

export function getTask(id) {
  let task;
  tasks.some((t) => {
    if (t.id === id) {
      task = t;
      return true;
    }
    return false;
  });
  return Promise.resolve({ task });
}

export function deleteVersion(id) {
  const index = versions.findIndex(version => version.id == id);
  const version = index >= 0 ? versions.splice(index, 1)[0] : null;
  return Promise.resolve({version});
}

export function getVersions(filters) {
  if (filters) {
    return Promise.resolve({
      versions: versions.filter(task =>
        Object.keys(filters).some(filter => task[filter] === filters[filter])
      )
    });
  }
  return Promise.resolve({ versions });
}



export default {
  addNotifier,
  addSession,
  deleteVersion,
  getSession,
  getTask,
  getTasks,
  getVersions,
};
