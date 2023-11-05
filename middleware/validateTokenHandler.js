const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const validateToken = asyncHandler(async (req, res, next) => {
	let token;
	let authHeader = req.headers.Authorization || req.headers.authorization;
	if (authHeader && typeof authHeader === "string" && authHeader.startsWith('Bearer')) {
		token = authHeader.split(" ")[1];
		// @ts-ignore
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
			if (err) {
				res.status(401);
				throw new Error("User is not authorized");
			}
			// @ts-ignore
			req.body.user = decoded.user;
			next();
		});

		if (!token) {
			res.status(401);
			throw new Error("User is not authorized or token is missing");
		}
	}
});

module.exports = validateToken;