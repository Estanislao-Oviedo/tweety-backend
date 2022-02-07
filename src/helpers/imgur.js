const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const uploadImage = async (image, oldLink) => {
    const data = new FormData();
    data.append('image', fs.createReadStream(image._writeStream.path));

    const config = {
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    headers: { 
        'Authorization': `Bearer ${process.env.IMGUR_ACCESS_TOKEN}`,
        ...data.getHeaders()
    },
    data : data
    };
    return await axios(config)
    .then((res)=>{
        deleteImage(oldLink)
        return {link: res.data.data.link, hash: res.data.data.deletehash}
    })
    .catch((error)=>{
        console.log('error')
        console.log(error)
    })
}

const deleteImage = async (link) => {
    path = link.split('/')
    imageId = path[path.length - 1]
    const config = {
        method: 'delete',
        url: `https://api.imgur.com/3/image/${imageId.split('.')[0]}`,
        headers: { 
            'Authorization': `Bearer ${process.env.IMGUR_ACCESS_TOKEN}`,
        }
    }
    return await axios(config)
    .then((res)=>{
        return null
    })
    .catch((error)=>{
        console.log('error')
        console.log(error)
    })
}

module.exports =  {uploadImage, deleteImage}