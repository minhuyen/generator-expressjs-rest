/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.rawFile);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const uploadImage = file => {
  console.log("Promise image: ", file);
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("image", file.rawFile);
    const token = localStorage.getItem("token");
    fetch("/api/v1/uploads", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })
      .then(response => response.json())
      .then(image => resolve(image))
      .catch(err => reject(err));
  });
};

/**
 * For posts update only, convert uploaded image in base 64 and attach it to
 * the `picture` sent property, with `src` and `title` attributes.
 */
const addUploadFeature = requestHandler => (type, resource, params) => {
  // console.log("==========addUploadFeature===========", type, resource, params);
  if (type === "UPDATE" && resource === "posts") {
    // notice that following condition can be true only when `<ImageInput source="pictures" />` component has parameter `multiple={true}`
    // if parameter `multiple` is false, then data.pictures is not an array, but single object
    if (params.data.pictures && params.data.pictures.length) {
      // only freshly dropped pictures are instance of File
      const formerPictures = params.data.pictures.filter(
        p => !(p.rawFile instanceof File)
      );
      const newPictures = params.data.pictures.filter(
        p => p.rawFile instanceof File
      );

      return Promise.all(newPictures.map(convertFileToBase64))
        .then(base64Pictures =>
          base64Pictures.map((picture64, index) => ({
            src: picture64,
            title: `${newPictures[index].title}`
          }))
        )
        .then(transformedNewPictures =>
          requestHandler(type, resource, {
            ...params,
            data: {
              ...params.data,
              pictures: [...transformedNewPictures, ...formerPictures]
            }
          })
        );
    }
  } else if (
    (type === "UPDATE" || type === "CREATE") &&
    (resource === "users" ||
      resource === "recipes" ||
      resource === "collections")
  ) {
    // console.log("upload image recipes", params);
    if (params.data.image) {
      // console.log("upload image recipes exist");
      const image = params.data.image;
      // console.log("upload image recipes exist", image.rawFile);
      if (image.rawFile instanceof File) {
        // console.log("upload image recipes is rawFile");
        return uploadImage(image)
          .then(res => {
            // console.log("=====uploaded image=======", res);
            return requestHandler(type, resource, {
              ...params,
              data: {
                ...params.data,
                image: res.image
              }
            });
          })
          .catch(error => {
            throw new Error(error.message);
          });
      } else {
        return requestHandler(type, resource, params);
      }
    } else {
      return requestHandler(type, resource, params);
    }
  } else {
    // for other request types and resources, fall back to the default request handler
    return requestHandler(type, resource, params);
  }
};

export default addUploadFeature;
