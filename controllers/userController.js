const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt");
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Register user POST /api/user/register
const registerUser = asyncHandler(async (req, res) => {

	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		res.status(404)
		throw new Error("All fields are mandatory")
	}

	const userAvailable = await User.findOne({ email });
	if (userAvailable) {
		res.status(404)
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

	const { email, password } = req.body
	const token = process.env.ACCESS_TOKEN_SECRET

	if (!email || !password) {
		res.status(404);
		throw new Error("All fields are required!")
	}

	const user = await User.findOne({ email })
	if (user && (await bcrypt.compare(password, user.password))) {
		const accessToken = jwt.sign(
			{
				user: {
					username: user.username,
					email: user.email,
					id: user.id,
				},
			},
			// @ts-ignore
			token,
			{ expiresIn: "30m" }
		);
		res.status(200).json({ accessToken })
	} else {
		res.status(401);
		throw new Error("Password or email is not valid")
	}
});

// Current user info POST /api/users/current _ private
const currentUser = asyncHandler(async (req, res) => {
	res.json(req.body.user)
});

module.exports = { registerUser, loginUser, currentUser }