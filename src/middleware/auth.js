const jwt = require('jsonwebtoken')
const User = require('../model/user')


const auth = async (request,response,next)=>{
    try{
        const token = request.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,'this_my_key')
        const user =await User.findById({_id:decode._id})
        // console.log(user)
        var count=0
        for (var i=0 ;i<user.tokens.length ;i++)
        {
            if (user.tokens[i].token==token)
            {
                count=1
            }
        }
        if(user.tokens.length==0 || count==0)
        {
            throw new Error()
        }
        request.token =token
        request.user = user
        next()
    }
    catch(e)
    {
        response.status(401).send('Error : Please authenticate')
    }
    
}

module.exports = auth