const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : { type : String, required : true,unique : true, minlength : 2, maxlength : 20, trim : true, lowercase : true},
    email : {type :String, required : true, trim : true,unique : true, lowercase : true},
    passwordHash : {type : String, required : true, minlength : 8 },
    authType : {type : String, required : true, enum : ['local', 'google'], default : 'local'},
    isBlocked : {type : Boolean, required : true, default : false}
}, {timestamps : true});

module.exports = mongoose.model("User", userSchema);