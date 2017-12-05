import fs from 'fs';
import jsonfile from 'jsonfile';

// TODO: Persist to Memcached instead of flat file.
class GoogleRefreshTokenStore {
  constructor() {
    this.filePath = '/tmp/refresh_tokens.json';
  }

  set(id, refreshToken) {
    const obj = fs.existsSync(this.filePath) ? jsonfile.readFileSync(this.filePath) : {};
    obj[id] = refreshToken;
    jsonfile.writeFileSync(this.filePath, obj);
  }

  get(id) {
    if (!fs.existsSync(this.filePath)) {
      return null;
    }
    const obj = jsonfile.readFileSync(this.filePath);
    return obj[id];
  }

  has(id) {
    if (!fs.existsSync(this.filePath)) {
      return false;
    }
    const obj = jsonfile.readFileSync(this.filePath);
    return !!obj[id];
  }
}

// TODO: Merge this with GoogleRefreshTokenStore.
class GoogleAccessTokenStore {
  constructor() {
    this.filePath = '/tmp/access_tokens.json';
  }

  get(refreshToken) {
    if (!fs.existsSync(this.filePath)) {
      return null;
    }
    const obj = jsonfile.readFileSync(this.filePath);
    const value = obj[refreshToken];
    const { accessToken } = value; // dereference expiration date from here.
    // TODO: Refresh access token if necessary.
    return accessToken;
  }

  set(refreshToken, value) {
    const obj = fs.existsSync(this.filePath) ? jsonfile.readFileSync(this.filePath) : {};
    obj[refreshToken] = value;
    jsonfile.writeFileSync(this.filePath, obj);
  }
}

export const refreshStore = new GoogleRefreshTokenStore();
export const accessStore = new GoogleAccessTokenStore();
