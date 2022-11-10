/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
 const uploadFiles = (params, field, name) => {
  return new Promise((resolve, reject) => {
    const newPictures = params.data[name].filter(
      (p) => p.rawFile instanceof File
    );
    const formerPictures = params.data[name].filter(
      (p) => !(p.rawFile instanceof File)
    );
    const formData = new FormData();
    const token = localStorage.getItem("token");
    newPictures.map((p) => {
      formData.append(field, p.rawFile);
    });
    fetch("/api/v1/uploads/multi", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((images) => {
        const newUploadPictures = images.data.map((image) => {
          return {
            src: image.url,
            title: image.title,
          };
        });

        const tmp = {
          ...params,
          data: {
            ...params.data,
            [name]: [...formerPictures, ...newUploadPictures],
          },
        };
        resolve(tmp);
      });
  });
};

const uploadFile = (params, field, name) => {
  return new Promise((resolve, reject) => {
    if (params.data[name] && params.data[name].rawFile instanceof File) {
      const formData = new FormData();
      formData.append(field, params.data[name].rawFile);
      const token = localStorage.getItem("token");

      fetch("/api/v1/uploads", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((image) => {
          const tmp = {
            ...params,
            data: {
              ...params.data,
              [name]: {
                src: image.data.url,
                title: image.data.title,
              },
            },
          };
          resolve(tmp);
        });
    } else {
      resolve(params);
    }
  });
};

/**
 * For posts update only, convert uploaded image in base 64 and attach it to
 * the `picture` sent property, with `src` and `title` attributes.
 */
const addUploadFeature = requestHandler => (type, resource, params) => {
  // console.log("==========addUploadFeature===========", type, resource, params);
 if (
    (type === "UPDATE" || type === "CREATE") &&
    (resource === "users")
  ) {
    return uploadFile(params, "image", "avatar")
      .then((params) => requestHandler(type, resource, params))
      .catch((error) => {
        throw new Error(error.message);
      });
  } else {
    // for other request types and resources, fall back to the default request handler
    return requestHandler(type, resource, params);
  }
};

export default addUploadFeature;
