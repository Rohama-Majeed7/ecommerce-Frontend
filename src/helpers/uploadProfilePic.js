const url = `https://api.cloudinary.com/v1_1/dx0hzrk1y/image/upload`

const uploadProfilePic  = async(image) => {
    const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset","mern_profilePic")
    

    const dataResponse = await fetch(url,{
        method : "post",
        body : formData
    })

    return dataResponse.json()

}

export default uploadProfilePic;