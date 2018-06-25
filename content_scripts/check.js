document.body.style.border = "5px solid red";

var webCert = document.getElementById("cert")
browser.storage.local.get("cli-cert").then(function (e) {
    if (e["cli-cert"] == undefined) {
        var title = "Security"
        var content = "You need to verify this website by registering first!";
        Notification.requestPermission().then(function (result) {
            var img = '../icons/shield-48.ico';
            var notification = new Notification(title, { body: content, icon: img });
        });
    }
    else {
        browser.storage.local.get("ca-cert").then(function (e) {
            if (e["ca-cert" == undefined]) {
                var title = "Security"
                var content = "You need to verify this website by registering first!";
                Notification.requestPermission().then(function (result) {
                    var img = '../icons/shield-48.ico';
                    var notification = new Notification(title, { body: content, icon: img });
                });
            }
        })
    }
})

if (webCert != null && webCert != undefined && webCert != "") {
    var siteCertObj = JSON.parse(webCert.value)
    var sitePubKey = JSON.parse(siteCertObj.info.certInfo).PublicKey
    browser.storage.local.set({ "bankcert": webCert })
    browser.storage.local.get("cli-cert").then(function (e) {
        if (e["cli-cert"] != undefined) {
            var publicKey = JSON.parse(e["cli-cert"]).PublicKey
            var PublicKeyAlgorithm = JSON.parse(e["cli-cert"]).PublicKeyAlgorithm
            var Fingerprint = JSON.parse(e["cli-cert"]).Fingerprint
            var FingerprintAlgorithm = JSON.parse(e["cli-cert"]).FingerprintAlgorithm
            var SerialNumber = JSON.parse(e["cli-cert"]).SerialNumber
            var Signature = JSON.parse(e["cli-cert"]).Signature
            var Signature_Algorithm = JSON.parse(e["cli-cert"]).Signature
            var Subject = JSON.parse(e["cli-cert"]).Subject
            var ValidTo = JSON.parse(e["cli-cert"]).ValidTo
            var toVerify = SerialNumber + Subject + publicKey + PublicKeyAlgorithm + Fingerprint + FingerprintAlgorithm + ValidTo
            browser.storage.local.get("ca-cert").then(function (e) {
                var cert_pubk = JSON.parse(e["ca-cert"]).PublicKey
                cert_pubk = "-----BEGIN PUBLIC KEY-----\n" + cert_pubk + "\n-----END PUBLIC KEY-----"
                // initialize
                var sig = new KJUR.crypto.Signature({ "alg": "SHA256withRSA" });
                // initialize for signature validation
                sig.init(cert_pubk); // signer's certificate
                // update data
                sig.updateString(toVerify)
                // verify signature
                var Signature_bin = window.atob(Signature)
                var arr = []
                for (var i = 0; i < Signature_bin.length; i++) {
                    var temp = Signature_bin.charCodeAt(i).toString(16);
                    if (temp.length == 1) {
                        arr.push("0" + temp)
                    }
                    else {
                        arr.push(temp)
                    }
                }
                var isValid = sig.verify(arr.join(""))
                if (!isValid) {
                    var title = "Security"
                    var content = "This Website is NOT Secure!";
                    Notification.requestPermission().then(function (result) {
                        var img = 'shield-48.ico';
                        var notification = new Notification(title, { body: content, icon: img });
                    });
                }
            })
        }
    })
}
else {
    var title = "Security"
    var content = "This Website is NOT Secure!";
    Notification.requestPermission().then(function (result) {
        var img = '../icons/shield-48.ico';
        var notification = new Notification(title, { body: content, icon: img });
    });
}
console.log(CryptoJS.MD5("0").toString())
//double signature
var priv_pwd = document.getElementById("privpwd");
var passwd;
if (priv_pwd != null && priv_pwd != "" && priv_pwd != undefined) {
    var check_button = document.getElementById("privbtn");
    //show input
    var submit_info = document.getElementById("J_Go")
    var target_bank_card = document.getElementById("bankcard")
    submit_info.addEventListener("click", function () {
        priv_pwd.type = "password"
        priv_pwd.placeholder = "注册证书时输入的密码"
        check_button.style = ""
        document.getElementById("banks").style = ""
        target_bank_card.value
    })
    check_button.addEventListener("click", function (e) {
        passwd = priv_pwd.value;
        var PI = {
            "target": document.getElementById("shopbankcard").value,
            "source": document.getElementById("bankcard").value,
            "amount": document.getElementById("shoptotal").value,
        }
        var OI = document.getElementById("shopmation").value
        browser.storage.local.get("privKey").then(function (e) {
            var enc_priv_key = JSON.parse(e["privKey"]);
            var priv_key;
            try {
                priv_key = CryptoJS.AES.decrypt(enc_priv_key, passwd);
                priv_key = priv_key.toString(CryptoJS.enc.Utf8);
                // initialize
                var clisig = new KJUR.crypto.Signature({ "alg": "SHA1withRSA" });
                // initialize for signature generation
                clisig.init(priv_key);   // rsaPrivateKey of RSAKey object

                //calc hash
                var PIhash = CryptoJS.MD5(JSON.stringify(PI)).toString();
                var OIhash = CryptoJS.MD5(OI).toString();
                var OPIhash = CryptoJS.MD5(OI+PI).toString();
                var toBank = JSON.stringify(PI) +"===" + OIhash + "===" 
                var toCommerce = OI + "===" + PIhash + "==="
                
                // update data
                clisig.updateString(OPIhash)
                // calculate signature
                var double_sign = clisig.sign()

                toBank += double_sign
                toCommerce += double_sign

                browser.storage.local.get("cli-cert").then(function (e) {
                    var cli_cert = e["cli-cert"];
                    var dataToBank = {
                        "ds_pi": toBank,
                        "cli_cert": cli_cert
                    }
                    var dataToCommerce = {
                        "ds_oi": toCommerce,
                        "cli_cert": cli_cert
                    }
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.onreadystatechange = function () {
                        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                            //console.log(xmlHttp.responseText);
                            var href = "http://172.20.14.184:8000/pay?ds=" + JSON.stringify(dataToBank)
                            console.log(JSON.stringify(dataToBank))
                            submit_info.href = href;
                            submit_info.click()
                        }
                    }
                    var urlToCommerce = "http://172.20.38.160:8080/commerce/ds.action"
                    xmlHttp.open("POST", urlToCommerce, true); // true for asynchronous
                    var data = new FormData();
                    data.append('ds', JSON.stringify(dataToCommerce));
                    xmlHttp.send(data)
                })
            }
            catch (error) {
                alert("Wrong password!")
            }

        })
    })
} 