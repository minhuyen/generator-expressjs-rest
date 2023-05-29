import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

export const removeFile = async fileName => {
  const unlink = promisify(fs.unlink);
  const result = await unlink(
    path.join(__dirname, '../../../uploads', fileName)
  );
  return result;
};
