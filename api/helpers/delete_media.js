const fs = require("fs")

const delFile = (path) => {
    console.log(path)
    fs.unlink(`../../${path}`, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
}

module.exports = delFile