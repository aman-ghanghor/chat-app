import mongoose from "mongoose" ;


const userSchema = new mongoose.Schema({
    firstname: {type: String, required: true, trim: true},
    lastname: {type: String, required: true, trim: true},
    username: {type: String, required: true, trim: true},
    email: {type:String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    phone: {type: String, default: "+91 95163 59854"},
    avatar: {type: String },
    about: {type: String, default: "Honesty is best policty"},
    contacts: [{
        username: {type: String, required: true, unique: true},
        notification: {type: Boolean, default: true},
        blocked: {type: Boolean, default: false}
    }]
})

const UserModel = mongoose.model("user", userSchema) ;

export default UserModel ;



