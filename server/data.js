import { flatMap as _flatMap } from 'lodash';
import axios from 'axios';

const _sessions = {};
const _notifiers = {
  task: []
};


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

export function getServices(accessToken, pid) {
  const path = `https://appengine.googleapis.com/v1/apps/${pid}/services`;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };
  return axios(path, config).then(response => ({
    services: response.data.services,
  }));
}


export function deleteVersion(serviceId, versionId) { // eslint-disable-line no-unused-vars
  // TODO: Reimplement against Admin API.
  // if(!servicesVersionsMap.has(serviceId)) {
  //   return Promise.resolve({ version: undefined});
  // }
  // const versions = servicesVersionsMap.get(serviceId);
  // const index = versions.findIndex(({id}) => id == versionId);
  // const version = index >= 0 ? versions.splice(index, 1)[0] : null;
  // return Promise.resolve({version});
  return Promise.resolve();
}

// Gets versions for all services.
export function getVersions(accessToken, pid) {
  return getServices(accessToken, pid)
    .then(({ services }) => Promise.all(
      services.map(({ id }) => getVersionsForService(accessToken, pid, id))))
    .then(versionPromises => Promise.all(versionPromises))
    .then(result => ({ versions: _flatMap(result, ({ versions }) => versions) }));
}

export function getVersionsForService(accessToken, pid, serviceId) {
  const path = `https://appengine.googleapis.com/v1/apps/${pid}/services/${serviceId}/versions`;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };
  return axios(path, config).then((response) => {
    const versions = response.data.versions.map((v) => {
      // TODO: get real count
      v.instanceCount = 0;
      return v;
    });
    return {
      versions
    };
  });
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
