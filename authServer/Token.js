import jwt from 'jsonwebtoken'

const generateToken = async(data,key)=>{
    return jwt.sign({data}, key, {expiresIn: 60})
}

const refreshToken = async (data,key)=>{
    return jwt.sign({ data }, key, { expiresIn: 60*60 })
}

const verifyRefreshToken = async (data,key)=>{
    try {
        return jwt.verify(data, key)
    } catch (error) {
        return -1
    }
}

export {
    generateToken,
    refreshToken,
    verifyRefreshToken,
 }