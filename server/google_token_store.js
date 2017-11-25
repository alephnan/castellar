import fs from 'fs';
import jsonfile from 'jsonfile';

// TODO: Persist to Memcached instead of flat file.
class GoogleRefreshTokenStore {
  constructor() {
    this.filePath = '/tmp/data.json';
  }

  set(id, refreshToken) {
    const obj = fs.existsSync(this.filePath) ? jsonfile.readFileSync(this.filePath) : {};
    obj[id] = refreshToken;
    jsonfile.writeFileSync(this.filePath, obj);
  }

  get(id) {
    if(!fs.existsSync(this.filePath)) {
      return null;
    }
    const obj = jsonfile.readFileSync(this.filePath);
    return obj[id];
  }

  has(id) {
    if(!fs.existsSync(this.filePath)) {
      return false;
    }
    const obj = jsonfile.readFileSync(this.filePath);
    return !!obj[id];
  }
}

export const refreshStore = new GoogleRefreshTokenStore();