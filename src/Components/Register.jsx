import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import auth from "../Firebase/firebase.config"
import { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link } from "react-router-dom";

const Register = () => {
    const [registerError, setRegisterError] = useState('')
    const [success, setSucces] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleRegister = e => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const accepted = e.target.terms.checked;
        console.log(name, email, password, accepted);

        // reset error
        setRegisterError('')
        setSucces('')

        // condition
        if (password.length < 6) {
            setRegisterError('Password should be at least 6 characters or longer')
            return;
        }
        else if (!/[A-Z]/.test(password)) {
            setRegisterError('Your password should have at least one upper case characters')
            return;
        }
        else if(!accepted){
            setRegisterError('Please accept our terms and conditions')
            return
        }

        // create user
        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                console.log(result.user);
                setSucces('User Created Successfully')


                // update  profile
                updateProfile(result.user,  {
                    displayName: name,
                    photoURL: "https://example.com/jane-q-user/profile.jpg"
                })
                .then(() => console.log('profile update'))
                .catch(error => console.error(error))
                
                // send verification email
                sendEmailVerification(result.user)
                .then(() => {
                    alert("Please check your email and verfy your account")
                })
            })
            .catch(error => {
                console.error(error);
                setRegisterError(error.message)
            })
    }
    return (
        <div>
            <div className="mx-auto md:w-1/2">
                <h2 className="text-3xl ">Please Register</h2>
                <form onSubmit={handleRegister} >
                    <input className="my-4 w-full border-2 px-4 py-2" type="text" name="name" id="" required placeholder="Your name" />
                    <br />
                    <input className="my-4 w-full border-2 px-4 py-2" type="email" name="email" id="ix" required />
                    <br />
                    <div className="relative mb-4">
                        <input className=" w-full border-2 px-4 py-2" type={showPassword ? "text" : "password"} name="password" required />
                        <span className="absolute top-3 right-2" onClick={() => setShowPassword(!showPassword)}>
                            {
                                showPassword ? <FaEyeSlash /> : <FaEye />
                            }
                        </span>
                    </div>
                    <br />
                    <div className="mb-2">
                        <input type="checkbox" name="terms" id="terms" />
                        <label className="ml-2" htmlFor="terms">Accept our <a href="#">Terms and Conditions</a></label>
                    </div>
                    <br />
                    <input className="btn btn-secondary mb-4 w-full" type="submit" value="Register" />
                </form>
                {
                    registerError && <p className="text-red-600">{registerError}</p>
                }
                {
                    success && <p className="text-green-600">{success}</p>
                }
                <p>Already have an account? Please <Link to="/login">Login</Link> </p>
            </div>
        </div>
    );
};

export default Register;