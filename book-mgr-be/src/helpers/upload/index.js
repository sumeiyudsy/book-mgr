const fs = require('fs')

const saveFileToDisk = (ctx, filename) => {
    return new Promise((resolve, reject) => {
        const file = ctx.request.files.file
        const reader = fs.createReadStream(file.filepath)
        const writeStream = fs.createWriteStream(filename)

        reader.pipe(writeStream)

        reader.on('end', () => {
            resolve(filename)
        })

        reader.on('error', () => {
            reject(err)
        })
    })
}

const getUploadFileExt = (ctx) => {
    const { name = '' } = ctx.request.files.file

    return name.split('.').pop()
}

module.exports = {
    saveFileToDisk,
    getUploadFileExt
}