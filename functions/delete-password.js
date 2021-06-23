/* ------------------------------------------------------------
 * パスワード音声を削除する
 *   入力：
 *      fromTelNo:相手先の電話番号
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
      // ユーザーの電話番号は+81形式、DBには090形式のため変換
      const telNo = event.fromTelNo.replace("+81", "0");
      return await twilioSync.removeMapItem(MAP_NAME, telNo);
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
