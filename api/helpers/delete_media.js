import fs from "fs"

const delFile = (path) => {
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
}

module.exports = delFile