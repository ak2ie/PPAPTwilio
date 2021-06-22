/* ------------------------------------------------------------
 * パスワードが登録済かを確認する
 *   入力：
 *      fromTelNo:ユーザーの電話番号
 *   出力：
 *      登録済ならtrue、未登録ならfalse
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
      const mapObj = await twilioSync.getMapItems(MAP_NAME);
      let result = false;
      // パスワードが登録済かを確認する
      for (const obj of mapObj) {
        // ユーザーの電話番号は+81形式、DBには090形式のため変換
        const telNo = event.fromTelNo.replace("+81", "0");
        if (telNo === obj.key) {
          result = true;
        }
      }
      return result;
    })
    .catch(async (err) => {
      console.log("Map not found.");
      throw new Error(err);
    })
    .then((res) => {
      callback(null, {
        result: res,
      });
    })
    .catch((err) => {
      console.dir(err);
      callback(err);
    });
};
