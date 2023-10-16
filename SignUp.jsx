import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);  // State for error message
  const [successMessage, setSuccessMessage] = useState(null);  // State for success message
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    // Password validation regular expression
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one letter, one digit, and one special character.');
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setSuccessMessage('Account created successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);  // Clear success message after 3 seconds
        navigate('/');
        console.log(userCredential);
      })
      .catch((error) => {
        setError(error.message);  // Set error message on signup failure
      });
  };

  return (
    <div className="sign-in-container">
      <form onSubmit={signUp}>
        <h1>Create Account</h1>
        <label htmlFor="Email">Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="Password">Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>Password must be at least 8 characters long and contain at least one letter, one digit, and one special character.</p>
        {error && <div style={{ color: 'red' }}>{error}</div>}  {/* Display error message */}
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}  {/* Display success message */}
        <button type="submit">Sign Up</button>
      </form>
      <p>
        <button type="button" className="link-button" onClick={() => navigate('/')}>
          Already have an account? Click here to Login.
        </button>
      </p>
    </div>
  );
};

export default SignUp;
