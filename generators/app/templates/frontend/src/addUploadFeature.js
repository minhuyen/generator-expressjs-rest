const addUploadFeature = (dataProvider) => ({
  ...dataProvider,
  update: (resource, params) => {
    console.log("resource=====", resource);
    if (resource !== "discoveries" && resource !== "tools") {
      // fallback to the default implementation
      return dataProvider.update(resource, params);
    }

    return uploadFile(params, "image", "avatar")
      .then((params) => dataProvider.update(resource, params))
      .catch((error) => {
        throw new Error(error.message);
      });
  },
  create: (resource, params) => {
    console.log("resource=====", resource);
    if (resource !== "discoveries" && resource !== "tools") {
      // fallback to the default implementation
      return dataProvider.create(resource, params);
    }
    console.log("resource=====", resource);
    return uploadFile(params, "image", "avatar")
      .then((params) => dataProvider.create(resource, params))
      .catch((error) => {
        throw new Error(error.message);
      });
  },
});

export const uploadFile = (params, field, name) => {
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
                url: image.data.url,
                title: image.data.title,
              },
            },
          };
          resolve(tmp);
        })
        .catch((err) => reject(err));
    } else {
      resolve(params);
    }
  });
};

export const uploadFiles = (params, field, name) => {
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
            url: image.url,
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
      })
      .catch((err) => reject(err));
  });
};

export default addUploadFeature;
