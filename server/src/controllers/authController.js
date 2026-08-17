export const register = async (req, res) => {
    try {
        res.status(201).json({
            message: "Register route works!"
        });
    } catch (err) {
        res.status(500).json({ error: "cannot fetch"});
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