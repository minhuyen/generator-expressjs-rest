var admin = require("firebase-admin");

var serviceAccount = require("../aello-app-5dd07-firebase-adminsdk-0f3g0-046fb89342.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aello-app-5dd07.firebaseio.com"
});