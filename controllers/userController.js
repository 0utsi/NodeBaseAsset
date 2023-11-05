const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt");


// Register User POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {

	const { username, email, password } = req.body

	if (!username || !email || !password) {
		res.status(404);
		throw new Error("All fields are mandatory")
	}

	const userAvailable = await User.findOne({ email: email })
	if (userAvailable) {
		res.status(400)
		throw new Error("User already registered!")
	}

	const hPass = await bcrypt.hash(password, 10);
	const user = await User.create({
		username,
		email,
		password: hPass,
	})

	if (user) {
		res.status(201).json({ _id: user.id, email: user.email })
	} else {
		res.status(400);
		throw new Error("User data is not valid")
	}

	res.json({ message: "User registered" })

});

// Login user POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
	res.json({ message: "Login user" })
});

// Current user info POST /api/users/current _ private
const currentUser = asyncHandler(async (req, res) => {
	res.json({ message: "Current user" })
});
3
module.exports = { registerUser, loginUser, currentUser }