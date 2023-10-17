import { Request , Response , Router } from 'express';
import { UserModel } from '../model/user';
import * as bcrypt from 'bcryptjs';
import { auth } from '../auth/auth';

export const router = Router();

// register / creating user
router.post('/user', async (req: Request, res: Response) => {
    try {
        const userData = req.body;

        //if data not getting from req.body
        if (Object.keys(userData).length == 0) {
            return res.send('Please provide user details');
        }

        const findUser = await UserModel.findOne({ email: req.body.email });

        console.log(findUser);

        if (findUser) {
            return res.status(400).send('User already created');
        }

        // Create a new instance of UserModel
        const user = new UserModel(userData);

        // Save the user to the database
        await user.save();

        res.status(201).send(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

//user can login
router.post('/login', async (req: Request, res: Response) => {
    try {
        // Find user by email
        const foundUser: any = await UserModel.findOne({ email: req.body.email });

        if (!foundUser) {
            return res.send('Email not found');
        }

        const isMatch = await bcrypt.compare(req.body.password, foundUser.password);

        if (isMatch) {
            // Generate a JWT token for the user
            const token = await foundUser.generateAuthToken();

            foundUser.tokens?.push(token);

            await foundUser.save();

            res.status(200).send({ user: foundUser, token });
        } else {
            return res.status(400).send('Invalid password');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
});

//user can update the data
router.patch('/user' , auth , async (req: Request, res: Response) => {
    //check for the property is correct or not
    try {
        const allowedUpdates = ["name", 'email', 'password'];  // defineing update property
        const updates = Object.keys(req.body);

        //checking for valid value or not
        const isvalidOperation : boolean[] = updates.map((update)=> 
            allowedUpdates.includes(update)
        );

        let operationValid: boolean = false;

        isvalidOperation.forEach((value)=>{
            if(value){
                return operationValid = true;
            }
        })

        // console.log(operationValid);

        if(!operationValid){
            return res.status(400).json({error : 'Invalid updates!'});
        }

        //updating value of authenticated user.
        updates.forEach((update)=>{
            //checking for password is hash before updating and saving it
            if(update === 'password'){
                const hasedPasssword = bcrypt.hashSync(req.body.password , 8);
                req.body.password = hasedPasssword;
            }

            req.body.user[update] = req.body[update];

        });

        await req.body.user.save();

        res.send('Data update successfully!');
        
    } catch (e) {
        return res.status(404).json({ error: e });
    }

})


