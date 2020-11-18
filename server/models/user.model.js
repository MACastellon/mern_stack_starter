import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema ({

    firstName : {
        type : String,
        required : true,
        unique : false,
        trim: true,
        minLength : 3
    },

    lastName : {
        type : String,
        required : true,
        unique : false,
        trim: true,
        minLength : 3
    },

    email : {
        type : String,
        required: true,
        unique : true,
    },

    password : {
        type : String,
        required : true
    },
    isVerified : {
        type : Boolean,
        required : true
    },
    reset_token : {
        type : String,
        required : false,
        default : ''
    }


})

const User = mongoose.model('User', userSchema);

export default User;