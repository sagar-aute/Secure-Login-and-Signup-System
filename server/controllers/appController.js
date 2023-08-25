import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'

/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {

        const { username } = req.method == "GET" ? req.query : req.body;

        //check the user existence
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Cant find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication error"});
    }
}

/** POST: http://localhost:8080/api/register
 * @param : {
   "username" : "example123",
   "password" : "admin123",
   "email" : "abc@gamil.com",
   "firstname" : "bill",
   "lastname" : "william",
   "mobile" : 9874563210,
   "address" : "Apt. 566, Kulas Light",
   "profile" : ""
}
*/
export async function register(req, res){
    try {
        const {username, password, profile, email} = req.body;

        // // check the existing user
        // const existUsername = new Promise((resolve, reject) => {
        //     UserModel.findOne({ username }, function(err, user){
        //         if(err) reject(new Error(err))
        //         if(user) reject({ error : "Please use unique username"});

        //         resolve();
        //     })
        // });

        // //check for existing email
        // const existEmail = new Promise((resolve, reject) => {
        //     UserModel.findOne({ email }, function(err, email){
        //         if(err) reject(new Error(err))
        //         if(email) reject({ error : "Please use unique email"});

        //         resolve();
        //     })
        // });

        const existUsername = UserModel.findOne({ username }).exec(); // Add .exec() to return a promise
        const existEmail = UserModel.findOne({ email }).exec(); // Add .exec() to return a promise

        Promise.all([existUsername, existEmail])
            // .then(() => {
            //     if(password){
            //         bcrypt.hash(password, 10)
            //             .then( hashedPassword => {

            //                 const User = new UserModel({
            //                     username, 
            //                     password: hashedPassword,
            //                     profile: profile || "",
            //                     email
            //                 });

            //                 // return save result as a response
            //                 User.save()
            //                     .then(result => res.status(201).send({ msg: "User Registered Successfully"}))
            //                     .catch(error => res.status(500).send({ error:error || "Failed to save user" }));

            //             }).catch(error => {
            //                 console.error("Password Hashing Error:", error);
            //                 return res.status(500).send({
            //                     error : "Unable to hashed password"
            //                 });
            //             });
            //     }
            // }).catch(error => {
            //     console.error("Existence Check Error:", error);
            //     return res.status(500).send({ error: error || "An error occurred" })
            // })
            .then(([existingUsername, existingEmail]) => {
                if (existingUsername) {
                    throw new Error("Please use a unique username");
                }
                if (existingEmail) {
                    throw new Error("Please use a unique email");
                }

                return bcrypt.hash(password, 10);
            })
            .then(hashedPassword => {
                const user = new UserModel({
                    username,
                    password: hashedPassword,
                    profile: profile || "",
                    email
                });

                return user.save();
            })
            .then(result => {
                res.status(201).send({ msg: "User Registered Successfully" });
            })
            .catch(error => {
                console.error("Registration Error:", error);
                res.status(500).send({ error: error.message || "An error occurred" });
            });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).send({ error: error || "Server error" });
    }
}

/** POST: http://localhost:8080/api/login
 * @param : {
   "username" : "example123",
   "password" : "admin123",
 }
 */
export async function login(req, res){
    const { username, password } = req.body;

    try {
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error : "Dont have password"});

                        //create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET, { expiresIn : "24h"});
                        
                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        })

                    })
                    .catch(error => {
                        return res.status(400).send({ error : "Password does not match"});
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not found"});
            })

    } catch (error) {
        return res.status(500).send({ error });
    }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res){
    res.json('getUser route');
}

/** PUT: http://localhost:8080/api/updateUser
 * @param : {
   "id" : "<userid>"
}
body{
   "firstname" : "",
   "address" : "",
   "profile" : ""
}
*/
export async function updateUser(req, res){
    res.json('updateUser route');
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res){
    res.json('generateOTP route');
}

/** GET: http://localhost:8080/api/generateOTP */
export async function verifyOTP(req, res){
    res.json('verifyOTP route');
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res){
    res.json('createResetSession route');
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPAssword(req, res){
    res.json('resetPAssword route');
}