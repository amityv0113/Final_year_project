const add =(a,b)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(a+b)
        },5000)
    })
}

const f = async(a,b)=>{
    console.log('0 comming from middle')
    var ans=0
    for (var i=0 ;i<5 ;i++)
    {
        ans=await add(a,b)
        console.log('1 comming from middle')
    }
    
    
    return ans
}

const jwt =require('jsonwebtoken')

const myFunction = async ()=>{
    const token = jwt.sign({_id:'12345'},'this_is_key',{expiresIn:'0 days'})
    console.log(token)
    const data = jwt.verify(token,'this_is_key')
    console.log(data)
}
myFunction()
// console.log('starting here')
// f(2,5).theny((val)=>{
//     console.log(val)
// }).catch((e)=>{
//     console.log(e)
// })
// console.log('ending')