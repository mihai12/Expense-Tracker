const userModel = require("../models/userModel");
const PasswordResetModel = require('../models/ResetTokenModel');
const ResetTokenModel = require('../models/ResetTokenModel');

class user {
    static async findByEmail(email) {
        return userModel.findOne({email}).exec();
    }

    static async findByUsername(username) {
        return userModel.findOne({ username }).exec();
    }

    static async findById(id) {
        return userModel.findById(id).exec();
    }

    static async createUser(username, email, password) {
        const user = new userModel();
        user.email = email;
        user.password = password;
        user.username = username;
        const savedUser = await user.save();
        return savedUser;
      }

    static async createPasswordResetToken(userId) {
        const passwordReset = new PasswordResetModel();
        passwordReset.userId = userId;
        const savedToken = await passwordReset.save();
        return savedToken.token;
    }
    
    static async getResetToken(userId) {
        return ResetTokenModel.findOne({ userId }).exec();
    }

    static async verifyPasswordResetToken(userId, token) {
        return PasswordResetModel.findOne({token, userId}).exec();
      }
    
    static async changePassword(userId, password) {
        const user = await userModel.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        user.password = password;
        return user.save();
    }

    static async deletePasswordResetToken(token) {
        return PasswordResetModel.findOneAndDelete({token,}).exec();
    }
}

module.exports = user;