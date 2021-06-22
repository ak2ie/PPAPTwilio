/* ------------------------------------------------------------
 * パスワード音声を登録する
 *   入力：
 *      fromTelNo:相手先の電話番号
 *      voiceUrl:パスワード音声のURL
 *   出力：
 *      なし
 * ------------------------------------------------------------ */
exports.handler = async function (context, event, callback) {
  // AssetsからTwilioSyncライブラリの読込
  const assets = Runtime.getAssets();
  const TwilioSync = require(assets["/twilioSync.js"].path);
  const twilioSync = new TwilioSync(
    context.MASTER_ACCOUNT_SID,
    context.ACCOUNT_SID,
    context.AUTH_TOKEN,
    context.SYNC_SERVICE_SID,
    true
  );

  const MAP_NAME = "passwordRecording";

  await twilioSync
    .getMap(MAP_NAME)
    .then(async (map) => {
      const ttl = 0;
      return await twilioSync.setMapItem(
        MAP_NAME,
        event.fromTelNo,
        { url: event.voiceUrl },
        ttl
      );
    })
    .catch(async (err) => {
      console.log("Map not found.");
      throw new Error(err);
    })
    .then((res) => {
      callback(null);
    })
    .catch((err) => {
      console.dir(err);
      callback(err);
    });
};
