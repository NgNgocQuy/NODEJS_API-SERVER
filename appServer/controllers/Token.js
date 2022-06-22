import jwt from 'jsonwebtoken'


const verifyToken = async (data,key)=>{
    try {
        // console.log(jwt.verify(data, key));
        return jwt.verify(data, key)
    } catch (error) {
        return -1
    }
}

export {
    verifyToken,
 }