const _sessions = {};
const _notifiers = {
  task: []
};

export const services = [
  {
    id: 'default',
    allocations: [
      {
        id: 'default',
        allocation: 25,
      },
      {
        id: '20170618',
        allocation: 75,
      },
    ],
  },
  {
    id: 'backend-api',
    allocations: [
      {
        id: 'abcd',
        allocation: 13,
      },
      {
        id: 'def',
        allocation: 67,
      },
      {
        id: 'geh',
        allocation: 11,
      }
    ],
  }
];

export const versions = [
  {
    id: 'default',
    instanceCount: 0,
    status: 'green',
    runtime: 'python27',
    environment: 'flexible',
  },
  {
    id: '20170615',
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
const backendVersions = [
  {
    id: 'abcd',
    instanceCount: 0,
    status: 'green',
    runtime: 'python27',
    environment: 'flexible',
  },
  {
    id: 'def',
    instanceCount: 5,
    status: 'green',
    runtime: 'nodejs',
    environment: 'standard',
  },
  {
    id: 'geh',
    instanceCount: 7,
    status: 'yellow',
    runtime: 'custom',
    environment: 'flexible',
  },
  {
    id: 'hik',
    instanceCount: 0,
    status: 'red',
    runtime: 'go16',
    environment: 'flexible',
  }
];

export const servicesVersionsMap = new Map();
servicesVersionsMap.set('default', versions);
servicesVersionsMap.set('backend-api', backendVersions);

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

export function getServices(filters) {
  if (filters) {
    return Promise.resolve({
      services: services.filter(service =>
        Object.keys(filters).some(filter => service[filter] === filters[filter])
      )
    });
  }
  return Promise.resolve({ services });
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

export function getVersionsForService(serviceId) {
  return Promise.resolve({ versions: servicesVersionsMap.get(serviceId) });
}

export default {
  addNotifier,
  addSession,
  deleteVersion,
  getSession,
  getServices,
  getTask,
  getTasks,
  getVersions,
  getVersionsForService,
};
