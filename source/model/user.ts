// Import the Mongoose model
import mongoose, { Schema, Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
const SECRATE_KEY = "secrate_key";

export interface User extends Document {
    _id?: mongoose.Types.ObjectId; // Use mongoose.Types.ObjectId for the _id field
    name: string;
    email: string;
    password: string;
    age?: number;
    tokens?: token[];
}

type token = {
    token: string;
}

const userSchema = new Schema<User>({
    // Use the default _id field provided by Mongoose
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    tokens: [{
        type: String,
    }],
    age: {
        type: Number,
    },
});

//adding password hasing
userSchema.pre('save',async function (next){
    const user = this;
    console.log(user);

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
      }

    next();
})


// Generate a JWT token for the user
userSchema.methods.generateAuthToken = async function (): Promise<string> {
    const user = this as User; // Cast to User type
    console.log('line 59 at model of user');
    const token = jwt.sign({ _id: user._id }, SECRATE_KEY); // Replace 'your-secret-key' with your actual secret key

    user.tokens = user.tokens || [];
    
    return token;
};

export const UserModel = mongoose.model<User>('User', userSchema);
