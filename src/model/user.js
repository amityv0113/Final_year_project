const mongoose = require('mongoose')
const validator = require('validator')

const { stringify } = require('querystring')
const { threadId } = require('worker_threads')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(val)
        {
            if (val.toLowerCase().includes('password'))
            {
                throw new Error('Password contain password')
            }
        }
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        validate(val)
        {
            if (validator.isEmail(val)==false)
            {
                throw new Error('Email is not valid')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(val){
            if (val<0)
            {
                throw new Error('Age must be postive')
            }
        }
    },
    Sex :{
        type:String,
        default:'M'
    },
    Select_Chest_Pain_Category :{
        type:String,
        default:'None'
    },
    Resting_Blood_Pressure_in_mm_Hg:{
        type:Number,
        default:0
    },
    Select_Fast_Blood_Sugar_Category :{
        type:String,
        default:'None'
    },
    Serum_Cholestoral :{
        type:String,
        default:'None'
    },
    Select_Rest_ECG_Category :{
        type:String,
        default:'None'
    },
    Select_Induced_Angina :{
        type:String,
        default:'None'
    },
    Old_Peak:{
        type:Number,
        default:0
    },
    Select_Slope_of_Peak_Exercise :{
        type:String,
        default:'None'
    }
    ,
    Max_Heart_Rate :{
        type:Number,
        default:0
    }
    ,
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }],
    image:{
        type:Buffer
    }

},{
    timestamps:true,

})

userSchema.methods.generateAuthtoken =async function(){
    const user=this
    const token = jwt.sign({_id:user._id.toString()},'this_my_key',{expiresIn:'7 days'})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


userSchema.statics.findbyCredentials=async (email,password)=>{
    // console.log(password)
    const user = await User.find({email})
    // console.log(user)
    if (!user)
    {
        throw new Error('unable to login')
    }
    // console.log(user)
    // var ismatch=false
    // console.log(ismatch)
    var index=-1
    for (var i=0 ;i<user.length ;i++)
    {
        
        const hash1 = await bcrypt.compare(password,user[i].password)
        // console.log(hash1)
        if (hash1===true)
        {   
            return user[i]
        }
    }
    
    if(index==-1)
    {
        throw new Error('unable to login')
    }
}

//change password into hashpassword before saving 
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User













// const me = new User({
//     name:'shweta Yadav',
//     password:'17218@iiitu.ac',
//     email:'amityv0113@gmail.com',

//     age:3,
// })
// me.save().then((val)=>{
//     console.log(me)
//     // console.log('data save to db')
// }).catch((error)=>{
//     console.log('error came'+ error)
// })
