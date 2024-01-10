const User = require("../model/User");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const regesterUser = async (req, res) => {
    try {
        const isPassword = await User.countDocuments({
            password: req.body.password,
        });
        const isEmail = await User.countDocuments({ email: req.body.email });

        if (isPassword >= 1) {
            console.log(isPassword);
            return res.send("User already exists");
        }
        if (isEmail >= 1) {
            console.log(isEmail);
            return res.send(" User already exists");
        }

        const schema = Joi.object({
            firstName: Joi.string().min(4).required(),
            lastName: Joi.string().min(4).required(),
            age: Joi.string(),
            role: Joi.string().trim(),
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net"] },
            }),
            password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,1024}$")),
            // repeat_password: Joi.ref("password"),
        });

        const joiError = schema.validate(req.body);

        if (joiError.error) {
            const errorMessage = joiError.error.details
                .map((detail) => detail.message)
                .join(", ");

            return res.status(400).json({ error: errorMessage });
        }

        const newUser = new User({ ...req.body });

        const solt = await bcrypt.genSalt(10);

        newUser.password = await bcrypt.hash(newUser.password, solt);

        if (req.file) {
            newUser.avatar = `http://localhost:5000/userPhotos/${req.file.filename}`;
            console.log(newUser);
        }

        await newUser.save();

        const token = jwt.sign(
            {
                email: newUser.email,
                password: newUser.password,
            },
            process.env.TOKENKEY
        );

        const user = _.omit(newUser.toObject(), ["password"]);

        res.status(200).json({
            success: true,
            message: "successduly created",
            data: {
                token,
                user,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const schema = Joi.object({
            email: Joi.string()
                .required()
                .email({
                    minDomainSegments: 2,
                    tlds: { allow: ["com", "net"] },
                }),
            password: Joi.string()
                .required()
                .pattern(new RegExp("^[a-zA-Z0-9]{8,1024}$")),
        });

        const joiError = schema.validate(req.body);

        if (joiError.error) {
            const errorMessage = joiError.error.details
                .map((err) => err.message)
                .join(",");

            return res.status(404).json({ error: errorMessage });
        }

        const getUser = await User.findOne({ email }).select("-__v");

        if (!getUser) {
            return res
                .status(404)
                .json({ message: "email or password is not valid" });
        }

        const checkPassword = await bcrypt.compare(password, getUser.password);

        if (!checkPassword) {
            return res
                .status(404)
                .json({ message: "email or password is not valid" });
        }

        const token = jwt.sign(
            {
                email: getUser.email,
                password: getUser.password,
            },
            process.env.TOKENKEY
        );

        const user = _.omit(getUser.toObject(), ["password"]);

        res.status(200).json({
            success: true,
            message: "successduly created",
            data: {
                token,
                user,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

module.exports = {
    regesterUser,
    loginUser,
};
