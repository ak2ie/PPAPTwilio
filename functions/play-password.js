/* ------------------------------------------------------------
 * パスワード音声を再生する
 *   入力：
 *      fromTelNo:ユーザーの電話番号
 *   出力：
 *      電話番号の音声
 * ------------------------------------------------------------ */
const twilio = require("twilio");

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

  // Twilio Syncのマップ名
  const MAP_NAME = "passwordRecording";

  await twilioSync
    .getMap(MAP_NAME)
    .then(async (map) => {
      // DBから電話番号を検索
      const mapObj = await twilioSync.getMapItems(MAP_NAME);
      const response = new twilio.twiml.VoiceResponse();
      for (const obj of mapObj) {
        // ユーザーの電話番号は+81形式、DBには090形式のため変換
        const telNo = event.fromTelNo.replace("+81", "0");
        if (telNo === obj.key) {
          const audioURL = obj.data.url;
          console.log("再生：" + audioURL);
          response.play({}, audioURL);
          break;
        }
      }
      return response;
    })
    .catch(async (err) => {
      console.error(err);
      throw new Error();
    })
    .then((res) => {
      callback(null, res);
    })
    .then((err) => {
      console.dir(err);
      callback(err);
    });
};
