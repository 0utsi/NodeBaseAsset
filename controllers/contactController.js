const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")

//Get all contacts / GET /api/contacts
const getContacts = asyncHandler(async (req, res) => {
	const contacts = await Contact.find()
	res.status(200).json(contacts)
});

//Create new contact POST /api/contacts
const createContact = asyncHandler(async (req, res) => {
	console.log(req.body)
	const { name, email, phone } = req.body;
	if (!name || !email || !phone) {
		res.status(400);
		throw new Error("All fields are mandatory")
	}
	const contact = await Contact.create({
		name,
		email,
		phone
	})
	res.status(201).json(contact)
})

//Get contact GET /api/contacts/:id
const getContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id)
	if (!contact) {
		res.status(404)
		throw new Error("Contact not found")
	}
	res.status(200).json(contact)
})

// Update contact PUT /api/contacts/:id
const updateContact = async (req, res) => {
	const contact = await Contact.findById(req.params.id)
	if (!contact) {
		res.status(404);
		console.log("contact not found");
	}

	const updatedContact = await Contact.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);

	res.status(200).json(updatedContact)
}

// Delete contact DELETE /api/contacts/:id
const deleteContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id)
	if (!contact) {
		res.status(404);
		throw new Error("contact not found")
	}
	await Contact.deleteOne();
	res.status(200).json(contact)
})

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact }