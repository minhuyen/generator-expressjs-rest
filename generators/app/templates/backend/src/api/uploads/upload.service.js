import path from "path";
import fs from "fs";
import { promisify } from "util";
import sharp from "sharp";

import {
  deleteObject,
  resizeImage,
  uploadObject
} from "../../services/storage";

export const removeFile = async fileName => {
  const unlink = promisify(fs.unlink);
  const result = await unlink(
    path.join(__dirname, "../../../uploads", fileName)
  );
  return result;
};

export const deleteS3Object = async key => {
  await deleteObject(key);
};

export const resizeImageS3 = async (imageUrl, width, height) => {
  const buffer = await resizeImage(imageUrl, width, height);
  const result = await uploadObject(buffer);
  return {
    url: result.Location,
    key: result.Key,
    title: result.Key
  };
};

export const resize = (readStream, format, width, height) => {
  let transform = sharp();

  if (format) {
    transform = transform.toFormat(format);
  }

  if (width || height) {
    transform = transform.resize(width, height);
  }

  return readStream.data.pipe(transform);
};
