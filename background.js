var targetPage = "*://*.hitbank.online/*";
var targetPage1 = "*://*.172.20.54.150/*"


// //var Cc = Components.classes;
// //var Ci = Components.interfaces;
// var { Cc, Ci } = require("chrome")
// var jsenc = require(["jsencrypt.js"], function () {
//     console.log("Load JSEncrypt successed!")
// })
// var httpRequestObserver =
//     {
//         observe: function (subject, topic, data) {
//             if (topic == "http-on-modify-request") {
//                 //rewind the request to read post body  
//                 channel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
//                 channel = channel.QueryInterface(Components.interfaces.nsIUploadChannel);
//                 channel = channel.uploadStream;
//                 channel.QueryInterface(Components.interfaces.nsISeekableStream)
//                     .seek(Components.interfaces.nsISeekableStream.NS_SEEK_SET, 0);
//                 var stream = Components.classes["@mozilla.org/binaryinputstream;1"]
//                     .createInstance(Components.interfaces.nsIBinaryInputStream);
//                 stream.setInputStream(channel);
//                 var postBytes = stream.readByteArray(stream.available());
//                 poststr = String.fromCharCode.apply(null, postBytes);

//                 //change the poststr
//                 console.log(poststr)
//                 stringStream.setData(poststr, poststr.length);
//                 //changing the postdata  
//                 channel = channel.QueryInterface(Components.interfaces.nsIUploadChannel);
//                 channel = channel.uploadStream;
//                 channel = channel.QueryInterface(Components.interfaces.nsISeekableStream)
//                     .seek(Components.interfaces.nsISeekableStream.NS_SEEK_SET, 0);
//                 channel.uploadStream.QueryInterface(Components.interfaces.nsIMIMEInputStream);
//                 channel.uploadStream.setData(stringStream);
//                 channel.requestMethod = "POST";
//             }
//         },

//         get observerService() {
//             return Components.classes["@mozilla.org/observer-service;1"]
//                 .getService(Components.interfaces.nsIObserverService);
//         },

//         register: function () {
//             this.observerService.addObserver(this, "http-on-modify-request", false);
//         },

//         unregister: function () {
//             this.observerService.removeObserver(this, "http-on-modify-request");
//         }
//     };
// function encPost(e) {
//     console.log("emmmm")
//     if (e.requestBody != null) {
//         var form = e.requestBody.formData
//         var encrypt = new JSEncrypt();
//         browser.storage.local.get("sitePubKey")
//             .then(function (e1) {
//                 var pubKey = e1["sitePubKey"]
//                 pubKey = "-----BEGIN PUBLIC KEY-----\n" + pubKey + "\n-----END PUBLIC KEY-----"
//                 encrypt.setPublicKey(pubKey)
//                 for (key in form) {
//                     e.requestBody.formData[key][0] = encrypt.encrypt(form[key][0], true)
//                 }
//                 httpRequestObserver.register();
//             })
//     }
// }
// function encParmas(e) {
//     //console.log("----------------")
//     e.requestHeaders.forEach(function (header) {
//         // console.log(header.name)
//         // console.log(header.value)
//         if (header.name.toLowerCase() == "host") {
//             var ref = header.value;
//             var encrypt = new JSEncrypt();
//             browser.storage.local.get("sitePubKey")
//                 .then(function (e1) {
//                     var pubKey = e1["sitePubKey"]
//                     pubKey = "-----BEGIN PUBLIC KEY-----\n" + pubKey + "\n-----END PUBLIC KEY-----"
//                     encrypt.setPublicKey(pubKey)
//                     ref = "http://172.20.54.150:8080/commerce/login.action?uuser=23333&upwd=23333"
//                     header.value = ref;
//                     {requestHeaders: e.requestHeaders};
//                 })
//         }
//     })
// }
// // browser.webRequest.onBeforeSendHeaders.addListener(
// //     encParmas,
// //     { urls: [targetPage, targetPage1] },
// //     ["blocking", "requestHeaders"]
// // )

// browser.webRequest.onBeforeRequest.addListener(
//     encPost,
//     { urls: [targetPage, targetPage1] },
//     ["blocking", "requestBody"]
// )
