const User = require("./../models/userModel");
const factory = require("./handlerFactory");

exports.getAllUsers = factory.getAll(User, "");
