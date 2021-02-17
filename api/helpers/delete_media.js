import fs from "fs"

const delFile = (path) => {
    try {
        fs.unlinkSync(path)
    } catch (error) {
        console.log(error)
    }
}

export default delFile