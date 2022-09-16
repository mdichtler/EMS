const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const firestore = admin.firestore();
async function verifyAPIKey(req, res) {
  const apiKey = req.query.apiKey;
  if (!apiKey) {
    res.status(401).send("Unauthorized");
    return;
  }
  const keys = firestore.doc(`apiKeys/${apiKey}`);

  const key = await keys.get();

  if (!key.exists) {
    res.status(401).send("Unauthorized");
    return;
  } else {
    // return permissions
    return key.data().permissions;
  }
}
async function queryEMS() {
  const ems = await firestore.collection("ems").get();
  const emsData = [];
  console.log("ems", ems);
  ems.forEach((doc) => {
    emsData.push(doc.data());
  });
  return emsData;
}
exports.validateAPIKey = functions.https.onRequest(async (req, res) => {
  const permissions = await verifyAPIKey(req, res);
  res.status(200).send(permissions);
});

exports.getEMSData = functions.https.onRequest(async (request, response) => {
  const permissions = await verifyAPIKey(request, response);
  if (Object.keys(permissions).length === 0) {
    response.status(401).send("Unauthorized - No Permissions set for this key");
    return;
  } else {
    const queryRes = await queryEMS();

    // filter data
    const filteredData = [];
    queryRes.forEach((record) => {
      let filteredRecord = {};
      // check what fields exist on record, compare them to permission, if available on permission, keep, otherwise remove

      Object.keys(record).forEach((key) => {
       

        if (permissions.hasOwnProperty(key)) {
          if (permissions[key].read || permissions[key].write) {
            filteredRecord = { ...filteredRecord, [key]: record[key] };
          }
        }
      });
      filteredData.push(filteredRecord);
    });
    response.status(200).send(filteredData);
  }
});
