const express =  require("express");
const bodyparser = require("body-parser");
const userModel = require('./userModel');
const connectDB = require('./connectdb');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());

// //database connection
connectDB();

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})

app.get('/',(req,res)=>{
    res.status(200).send({msg:"API is working",data:"",err:""});
})

app.post('/save-user',async (req, res)=>{
    try{
        let name = null, email = null,phone= null,desc=null
        if(req.body.name){
            name = (req.body.name).trim();
        }
        if(req.body.email){
            email = (req.body.email).trim();
        }
        if(req.body.phone){
            phone = parseInt((req.body.phone).trim());
        }
        if(req.body.desc){
            desc = (req.body.desc).trim();
        } 
    
        if(name != '' && name != undefined && name != null){ 
            if(email != '' && email != undefined && email != null){
                if(phone != '' && phone != undefined && phone != null){
                    if(desc != '' && desc != undefined && desc != null){
                        if(!validatEmail(email)){
                            res.status(203).send({msg:"Email is not valid", data:"", err:""});
                        }else if(!validatPhone(phone)){
                            res.status(203).send({msg:"Phone number is not valid", data:"", err:""});
                        }else{
                            let emailCount = await userModel.find({email:email}).countDocuments();
                            let phoneCount = await userModel.find({phone:phone}).countDocuments();
                            if(emailCount == 0 || emailCount == null){
                                if(phoneCount == 0 || phoneCount == null){
                                    var new_user = new userModel({name:name,email:email,phone:phone,desc:desc})
                              
                                    new_user.save(function(err,result){
                                        console.log(err)
                                        if(err){
                                            res.status(204).send({msg:"Error while saving your data", data:"", err:err});
                                        }
                                        else{
                                            res.status(200).send({msg:"Data is saved successfully", data:"", err:""});
                                        }
                                    })
                                }else{
                                    res.status(202).send({msg:"phone number is already registered", data:"", err:""});
                                }
                            }else{
                                res.status(202).send({msg:"Email is already registered", data:"", err:""});
                            } 
                        }
                    }else{
                        res.status(203).send({msg:"Description is missing", data:"", err:""});
                    }
                }else{
                    res.status(203).send({msg:"Phone is missing", data:"", err:""});
                }
            }else{
                res.status(203).send({msg:"Email is missing", data:"", err:""});
            }
        }else{
            res.status(203).send({msg:"Name is missing", data:"", err:""});
        } 
    }catch(err){
        res.status(404).send({msg:"forbidden"})
    }  
})

function validatEmail(email){
    let regValue = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let regTest = regValue.test(email);
    return regTest
}

function validatPhone(phone){
    let regValue = /^(\+91-|\+91|0)?\d{10}$/;
    let regTest = regValue.test(phone);
    return regTest
}