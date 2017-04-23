import fs from 'fs';
import path from 'path';
import { fileNotFoundError } from './errors.js';

export const openFile = (name: string): Promise<string> => {
  const pathName = path.join(__dirname, name);
  return openPath(pathName);
};

export const openPath = (pathName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathName, (error, data) => {
      if (error) {
        reject(fileNotFoundError(pathName));
      }
      resolve(data.toString());
    });
  });
};
