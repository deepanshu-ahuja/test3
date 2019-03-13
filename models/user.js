const fs = require('fs');
const path = require('path')
const p = path.join(path.dirname(process.mainModule.filename), "user.json")

function read(cb){
    console.log("inside read")
   fs.readFile(p, (err, fileContent)=>{
       
       if(err){
           cb([])
       }
       else{
           cb(JSON.parse(fileContent))
       }
   })
}
class User{
    constructor(id, fname, lname, email, password, mobile, address){
        this.id = id,
        this.fName = fname;
        this.lName = lname,
        this.email = email;
        this.password = password,
        this.mobile = mobile;
        this.address = address
        
    }

    save(cb){
        console.log("inside save");
        read(users=>{
    
                // users.push(this)
                users.push(this)
                 fs.writeFile(p, JSON.stringify(users), ()=>{
                    cb();
                 })
                console.log(users)
    
        })
    }

    static findByEmail(email, cb){
        console.log("inside findByemail");

        read(users=>{
           const user = users.find(user => user.email === email)
           if(!user){
              cb(false);
           }else{
            cb(true);
           }
          
        })
    }

    static loginValidate(email, password, cb){
        console.log("inside loginValidate")
        console.log(email)
        console.log(password)
        read(users=>{
            const user = users.find(user => {
                return user.email === email && user.password === password
            })
            if(user){
                let isAdmin
                console.log("inside if")
                if(user.email === "abcd@gmail.com"){
                    isAdmin = true
                }
                else{
                    isAdmin =false;
                }
               
                cb(true, user, isAdmin)
                
                
            }
            else{
                console.log("inside else")
                cb(false, null, false)
            }
        })
    }

    static findById(userId, cb){
        console.log("inside findById")
        read(users=>{
            const user = users.find(user => user.id.toString() === userId.toString())
            cb(user);
        })
    }

    static editAndSave(u, cb){
        console.log("inside edit and save")
        read(users=>{
            const userIndex = users.findIndex(user => user.id.toString() === u.toString())
            const updatedUsers = [...users]
            updatedUsers[userIndex] = u
            fs.writeFile(p, JSON.stringify(updatedUsers), ()=>{
                cb();
            })
           
        })
    }


    static fetchAll(cb){
        read(data=>{
            const users = data.filter(user => {
                return user.email.toString() !== "abcd@gmail.com"
            })
            cb(users);
        })
    }


    static deleteById(id, cb){
        console.log("inside dlete by id")
        read(data=>{
            const users = data.filter(user => {
                return user.id.toString() !== id.toString()
            })
            fs.writeFile(p, JSON.stringify(users), ()=>{
                read(data=>{
                    const users = data.filter(user => {
                        return user.email.toString() !== "abcd@gmail.com"
                    })
                    cb(users);
                })
            })
            
        })
    }
}
module.exports = User;