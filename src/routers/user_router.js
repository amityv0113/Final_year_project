const express = require('express')
const User =require('../model/user')
const auth = require('../middleware/auth')
const multer =require('multer')
const { response } = require('express')
const router = new express.Router()


router.post('/user', async(request,response)=>{
   
    
    try{
        const user =new User(request.body)
        const users =await User.find({})
        if (!users)
        {
            const val=await user.save()
            const token =await user.generateAuthtoken()
            const val1=new Object(user)
            val1.image=undefined
            response.status(201).send({val1,token})
        }
        else
        {
            var ans=0
            for (var i=0 ;i<users.length ;i++)
            {
                if(request.body.email==users[i].email)
                {
                    // console.log(request.body.email)
                    // console.log(users[i].email)
                    ans=1
                    break
                }
            }
            if (ans==1)
            {
                response.status(404).send()
                
            }
            const val=await user.save()
            const token =await user.generateAuthtoken()
            const val1=new Object(user)
            val1.image=undefined
            response.status(201).send({val1,token})

        }
    }
    catch(e){
        response.status(400).send()
    }

})

router.post('/user/login',async(request,response)=>{
    // console.log(request.body.email)
    try{
        const user = await User.findbyCredentials(request.body.email,request.body.password)
        const token =await user.generateAuthtoken()
        const val=new Object(user)
        val.image=undefined
        response.send({val,token})

    }catch(e)
    {
        response.status(400).send()
    }    

})

router.post('/user/logout',auth,async (request,response)=>{
    try{
        request.user.tokens = request.user.tokens.filter((val)=>{
            return val.token !== request.token 
        })
        await request.user.save()
        response.send()
    }
    catch(e)
    {
        response.status(500).send()
    }
})

router.get('/users/me',auth,async(request,response)=>{
    const val=new Object(request.user)
    val.image=undefined
    response.send(val)
})
router.get('/user/:id',async (request,response)=>{
    const id=request.params.id
    try{
        const val=await User.findById(id)
        if (!val)
        {
            return response.status(404).send()
        }
        response.send(val)
    }
    catch(e){
        response.status(500).send()
    }
})

router.patch('/update/me',auth,async(request,response)=>{
    // const id=request.params.id
    const arr_update =Object.keys(request.body)
    const allowed_update=['name','age','email','password']
    var count=0
    for (var i=0 ;i<arr_update.length ;i++)
    {
        var count1=0
        for (var j=0 ;j<allowed_update.length ;j++)
        {
            if (arr_update[i]==allowed_update[j])
            {
                count1=1
                break
            }
        }
        if (count1==0)
        {
            count=1
            break
        }
    }
    if (count==1)
    {
        response.status(404).send('Error invalid update')
    }
    try{
        // const val=await User.findByIdAndUpdate(id,request.body,{new:true,runValidators:true})4
        for (var i=0 ;i<arr_update.length ;i++)
        {
            request.user[arr_update[i]]=request.body[arr_update[i]]
        }
        await request.user.save()
        response.send()

    }
    catch(e)
    {
        response.status(500).send()
    }

})

router.delete('/delete/me',auth,async (request,response)=>{
    const id= request.params.id
    // console.log(id)
    try{
        const val=await User.findByIdAndDelete(request.user._id)
        if (!val)
        {
            response.status(404).send()
        }
        response.send(val)
    }
    catch(e)
    {
        response.status(500).send()
    }
})

const upload = multer({
    limits:{
        fieldSize:10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return cb(new Error('File must be image'))
        }
        cb(undefined, true)
        
       
      }
})

router.post('/user/me/img',auth,upload.single('img'),async(request,response)=>{
    request.user.image = request.file.buffer
    // console.log(request.file)
    await request.user.save()
    response.send()
})


module.exports =router