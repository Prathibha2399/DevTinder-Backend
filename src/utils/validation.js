const validator = require('validator')

const validations = (req) => {
    const {firstName, lastName, email, password} = req.body;    // js object extraction...i.e destructuring the obj body.

    // handled in schema level to but better to have one more check as utility functions.
    if(!firstName.length || !lastName.length){
        throw new Error ("Name required!....")
    }
    else if(firstName.length < 2 || firstName.length > 40){
        throw new Error ("Length exceeds the requirements!......")
    }
    else if(!validator.isEmail(email)){
        throw new Error ("Invalid email!......")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error ("Password is too weak!......")
    }

}


module.exports = {
    validations
}