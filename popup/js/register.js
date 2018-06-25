jQuery(document).ready(function () {
    var regform = document.getElementById("regForm")
    regform.addEventListener("submit", register)
    document.getElementById("pubkey").value = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqv80EIJSbpc3uqKqGoZKyaMLv7w+DUpNIWbDYVtC96VAxri8w6FKnUQmGwjCpuJRviASg6SEBZqNyVZ2ZRh1FogHd//PgPjzYfGBxbDKztThIHpr4v6lcKkBeBuyNkDs0KTOuLUgrJFdFJNWdTUDyA2z1TAA09SJlg6ss0ZaDHQIDAQAB";
    document.getElementById("privKey").value = "MIICXAIBAAKBgQCqv80EIJSbpc3uqKqGoZKyaMLv7w+DUpNIWbDYVtC96VAxri8w6FKnUQmGwjCpuJRviASg6SEBZqNyVZ2ZRh1FogHd//PgPjzYfGBxbDKztThIHpr4v6lcKkBeBuyNkDs0KTOuLUgrJFdFJNWdTUDyA2z1TAA09SJlg6ss0ZaDHQIDAQABAoGAFu4U+SXq7xAQHKm35MaT7bOV4iTHf4o6TzAESLk35RkM9O8AVWANoXyHe/peEJzCCkxI2tcT4J1I+9S1ilzZF0Wc9PMLxcFO1F/T0AZ3K4cplLfAmsmjINlvbdSTg31ILNrni/dpBukt1KL4wlFjRURLLpum4vRv6PKP9EuRbKECQQDZZbf2GNc2gMSwe7KDgmXBaqeBv9x0pGzBMaRcsAFI1SCI0KARKrZCGw4b0VbFVeSXPj9oZrd8HbDqXATAw2y1AkEAyRGWhSqCJg5YqCOyEr5iEkE5mpPja3RTmczc+ijEOGY31pgzsTfjS1YUSAJKBGVgN/UIW3SH/jbmREn7qbAlyQJBAKHCKguXmCsZzUB0CfQIhqZQMas9k0/HOJTX1zCQVaRX0Ql8El4zpcGyV+Ei9qmGq7xNuOh55XUYspbvOSolPzECQHOJ2r98tLrfhYxgrqPcqIgq2Mn9bzJA7wUy1kwdftuVyUJTxWhxX/fbZ94VCqlKA6dD82ByLu8iZuEYzjcs1BkCQCyTao9+OIrO/u4MiUOXXYXLFiSDY5JAHo31BPPoy7rULkGvk6E2H0iL+Rjd7TJx2SEOej/syocOHNaGcb5XEVo="
    function register() {
        var name = document.getElementById("name").value
        var email = document.getElementById("email").value
        var idNumber = document.getElementById("idNumber").value
        var password = document.getElementById("password").value
        var confirm = document.getElementById("confirm").value
        var pubkey = document.getElementById("pubkey").value
        if (password == "" || password != confirm) {
            document.getElementById("result").innerHTML = "Password not the Same"
        }
        else {
            var privKey = document.getElementById("privKey").value
            console.log(password)
            console.log(privKey)
            var encrypted = CryptoJS.AES.encrypt("-----BEGIN RSA PRIVATE KEY-----\n"+privKey+"\n-----END RSA PRIVATE KEY-----", password);
            browser.storage.local.set({ "privKey": JSON.stringify(JSON.decycle(encrypted)) })
            var url = "http://jiangjiawei.pw:2333/ca/register/?"
            url += "Subject=" + name + ":" + email + ":" + idNumber + "&"
            url += "PublicKey=" + pubkey + "&"
            url += "PublicKeyAlgorithm=" + "pkcs1.5" + "&"
            url += "Fingerprint=" + "1a:16:09:b2:19:dc:53:fe:30:9b:bf:fe:a9:1b:e0:8b" + "&"
            url += "FingerprintAlgorithm=md5"
            function callback(res) {
                obj = JSON.parse(res)
                if (obj.status_code == 0) {
                    cacert = obj.info.CACERT
                    mycert = obj.info.certInfo
                    browser.storage.local.set({ "cli-cert": mycert })
                    browser.storage.local.set({ "ca-cert": cacert })
                    console.log("store-finished")
                    window.close()
                }
                else {
                    alert(obj.info)
                    window.close()
                }
            }
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    callback(xmlHttp.responseText);
                }
            }
            xmlHttp.open("GET", url, true); // true for asynchronous 
            xmlHttp.send(null);
        }
    }

})
