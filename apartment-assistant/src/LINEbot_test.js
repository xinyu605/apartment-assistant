// export function LINEbot() {
// 引用linebot SDK
let linebot = require("linebot");

// 用於辨識Line Channel的資訊
let bot = linebot({
  channelId: "1655285474",
  channelSecret: "9de766cf9b58504ce0d22c247f66c1e6",
  channelAccessToken:
    "uwCePjVrtIriqPL9i7XeMK/h/L9veY448ZVfc69bXAr4coeBVb4xOTVFUT3qtJFVFoGNUX/QJFvyGE0sFwjl2+To13zdlRNCwlFDFFXg7FfaIp8RuLB590KWzP3a2IW/75Hvo2I0VPSnYAO7/hglggdB04t89/1O/w1cDnyilFU=",
});

// 當有人傳送訊息給Bot時

bot.on("message", function (event) {
  // event.message.text是使用者傳給bot的訊息
  // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
  console.log(`使用者 ID: ${event.source.userId}`);
  // let replyMessage = "嗨！Apartment Assistant目前不在線上，晚點回覆您喔！";
  event
    .reply(event.message.text)
    // .reply(replyMessage)
    .then(function (data) {
      // 當訊息成功回傳後的處理
      // console.log(data);
    })
    .catch(function (error) {
      // 當訊息回傳失敗後的處理
    });
});

// Bot所監聽的webhook路徑與port
bot.listen("/linewebhook", 3000, function () {
  console.log("[BOT已準備就緒]");
});
// }
