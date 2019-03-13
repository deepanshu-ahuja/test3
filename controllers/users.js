const  {validationResult} = require('express-validator/check')
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require("../models/user")

const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key:
          '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'
      }
    })
  );


exports.getSignUp = (req , res, next)=>{
    console.log("inside getSignuPage");
    res.render('signUp', {
        hasError: false,
        errorMessage: "",
        pageType: "please Sign Up",
        edit: false
    });
}
exports.postSignUp = (req , res, next)=>{
    console.log("inside postSignPage");
    const fName = req.body.fName;
    
    const lName = req.body.lName;
    const password = req.body.password;
    const cPassword = req.body.cPassword;
    const email = req.body.email;
    const address = req.body.address;
    const mobile = req.body.mobile;

    const data = {fName: fName, lName: lName,
                password: password, cPassword, cPassword,
                email: email, address: address,
                mobile: mobile}
    const id = Date.now();
    const errors = validationResult(req);
    


    if(!errors.isEmpty()){
       return res.render('signUp', {
            hasError: true,
            errorMessage : errors.array()[0].msg,
            user: data,
            pageType: "please Sign Up",
            edit: false
        })
    }
    
    User.findByEmail(email, boolean=>{
        if(!boolean){
            
            const user = new User(id, fName, lName, email, password, mobile, address);
            console.log(user)
    
            user.save(()=>{
                res.redirect('/login')
            });
            
        }
        else{
            
            return res.render('signUp', {
                hasError: true,
                errorMessage : "email already exists",
                user: data,
                pageType: "please Sign Up",
                edit: false
            })
        }
    });
}


exports.postLogin = (req, res, next)=>{
    console.log("inside postLogin")

    const email = req.body.email;
    const password = req.body.password;

    User.loginValidate(email, password, (boolean, user, isAdmin)=>{
        if(!boolean){
            res.render('login', {
                hasError: true,
                errorMessage : "please enter correct login details",
             })
            
        }
        else{
            console.log(user.id)
            req.session.user = user
            req.session.isLoggedIn = true
            res.render('user-details', {
                user: user,
                image: "",
                isImage: false,
                isAdmin: isAdmin
            })
        }
        
    })


}

exports.getLogin = (req, res, next)=>{
    console.log("inside getLogin")
    res.render('login', {
        hasError: false
    })
}

exports.getEditUser = (req, res, next)=>{
    console.log("inside getEditUser")
    const userId = req.params.userId;
    console.log(userId)
    User.findById(userId, user=>{
        console.log(user)
         res.render('edit', {
            hasError: false,
            errorMessage: "",
           pageType: "Edit Details",
           edit: true,
           user: user
        });
    
})
}

exports.postEditUser = (req, res, next)=>{
    console.log("inside post edit user");
   
    const fName = req.body.fName;
    const id = req.body.id;
    const lName = req.body.lName;
    const password = req.body.password;
    const cPassword = req.body.cPassword;
    const email = req.body.email;
    const address = req.body.address;
    const mobile = req.body.mobile;
    console.log(id)

    const data = {id: id, fName: fName, lName: lName,  email: email,
        password: password, address: address,
        mobile: mobile}

        const errors = validationResult(req);



        if(!errors.isEmpty()){
        return res.render('edit', {
            hasError: true,
            errorMessage : errors.array()[0].msg,
            user: data,
            pageType: "Edit Details",
            edit: false
        })
    }

    else{
        User.editAndSave(data, ()=>{
            res.render('user-details', {
                user: data,
                //image: image.path,
                isImage: true,
                isAdmin: req.user.email === "abcd@gmail.com" ? true: false
            })
        })
    }
}

exports.postImage = (req, res, next)=>{
    console.log("inside post imaage")
    const image = req.file;
    console.log(image)

    res.render('user-details', {
        image: image.path,
        user: req.user,
        isImage: true
    } )
/*
    <!--
    <%if (isImage) { %>
        <img src="/<%= image %>">
    <% } %>
--></img>*/
}


exports.logOut  = (req, res, next)=>{
    req.session.destroy(err => {
        console.log('Logged Out');
    });
    console.log(req.session)
    res.redirect('/login');
}

exports.allUsers = (req, res, next)=>{
    console.log("inside all users")

    User.fetchAll(data=>{
       
        res.render('all-users', {
            users: data
        })
    })
}

exports.userProfile = (req, res, next)=>{
    console.log("inside all users");
    User.findById(req.user.id, user=>{
        res.render('user-details', {
            user: user,
            //isImage: true
        })
    })

   
}
exports.deleteUser = (req, res, next)=>{
    console.log("inside delete users")
    
    console.log(req.body.id)
    User.deleteById(req.body.id, (data)=>{

       
       
            res.render('all-users', {
                users: data
            })
    
        
    });

}

exports.getMail = (req, res, next)=>{
    console.log("inside getMail");
    res.render('mail', {
        from: req.user.email,
        hasError: false

    })
}

exports.postMail = (req, res, next)=>{
    console.log("inside postMail")
    const from = req.body.from;
    const to = req.body.to;
    const emailBody = req.body.emailBody;

    console.log(from, to, emailBody)

    const errors = validationResult(req);
    


    if(!errors.isEmpty()){
       return res.render('mail', {
            hasError: true,
            from: req.user,
            errorMessage : errors.array()[0].msg,
            to: to,
            emailBody: emailBody
        })
    }

    return transporter.sendMail({
        to: to,
        from: from,
        subject: 'Signup succeeded!',
        html: emailBody
      })
      .then(result=>{
          res.render('user-details', {
            isAdmin: req.user.email === "abcd@gmail.com" ? true: false,
            user: req.user
          })
      })

}