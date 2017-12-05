import {flatMap as _flatMap} from 'lodash'

const _sessions = {};
const _notifiers = {
  task: []
};

export const services = [
  {
    id: 'default',
    split: {
      allocations:
        {
          'default': .25,
          '20170618': .75,
        },
    }
  },
  {
    id: 'backend-api',
    split: {
      allocations:
        {
          'abcd': .13,
          'def': .67,
          'geh': .11,
        },
    }
  },
];

export const versions = [
  {
    id: 'default',
    instanceCount: 0,
    status: 'green',
    runtime: 'python27',
    environment: 'flexible',
    name: '/service/default/version/default',
  },
  {
    id: '20170615',
    instanceCount: 5,
    status: 'green',
    runtime: 'nodejs',
    environment: 'standard',
    name: '/service/default/version/20170615',
  },
  {
    id: '20170618',
    instanceCount: 7,
    status: 'yellow',
    runtime: 'custom',
    environment: 'flexible',
    name: '/service/default/version/20170618',
  },
  {
    id: '20170619',
    instanceCount: 0,
    status: 'red',
    runtime: 'go16',
    environment: 'flexible',
    name: '/service/default/version/20170619',
  }
];
const backendVersions = [
  {
    id: 'abcd',
    instanceCount: 0,
    status: 'green',
    runtime: 'python27',
    environment: 'flexible',
    name: '/service/backend-api/version/abcd',
  },
  {
    id: 'def',
    instanceCount: 5,
    status: 'green',
    runtime: 'nodejs',
    environment: 'standard',
    name: '/service/backend-api/version/def',
  },
  {
    id: 'geh',
    instanceCount: 7,
    status: 'yellow',
    runtime: 'custom',
    environment: 'flexible',
    name: '/service/backend-api/version/geh',
  },
  {
    id: 'hik',
    instanceCount: 0,
    status: 'red',
    runtime: 'go16',
    environment: 'flexible',
    name: '/service/backend-api/version/hik',
  },
  {
    id: 'xyz',
    instanceCount: 0,
    status: 'red',
    runtime: 'go16',
    environment: 'flexible',
    name: '/service/backend-api/version/xyz',
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

export function deleteVersion(serviceId, versionId) {
  if(!servicesVersionsMap.has(serviceId)) {
    return Promise.resolve({ version: undefined});
  }
  const versions = servicesVersionsMap.get(serviceId);
  const index = versions.findIndex(({id}) => id == versionId);
  const version = index >= 0 ? versions.splice(index, 1)[0] : null;
  return Promise.resolve({version});
}

// Gets versions for all services.
export function getVersions(filters) {
  return getServices()
      .then(({services}) => services.map(({id}) => getVersionsForService(id)))
      .then(versionPromises => Promise.all(versionPromises))
      .then(result => ({ versions: _flatMap(result, ({versions}) => versions) }));
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
