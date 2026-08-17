import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({error: "Username, email, and password are required"});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash
            },
        });

        return res.status(201).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({ error: "Something went wrong"});
    }
}


export const login = async (req, res) => {
    try {
        res.status(201).json({
            message: "Login route works!"
        });
    } catch (err) {
        res.status(500).json({ error: "cannot fetch"});
    }
}

export const logout = async (req, res) => {
    try {
        res.status(201).json({
            message: "Logout route works!"
        });
    } catch (err) {
        res.status(500).json({ error: "cannot fetch"});
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        res.status(201).json({
            message: "Me route works!"
        });
    } catch (err) {
        res.status(500).json({ error: "cannot fetch"});
    }
}