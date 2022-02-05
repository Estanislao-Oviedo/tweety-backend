const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const uploadImage = async (image) => {
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
        return res.data.data.link
    })
    .catch((error)=>{
        console.log('error')
        console.log(error)
    })
}

module.exports =  {uploadImage}