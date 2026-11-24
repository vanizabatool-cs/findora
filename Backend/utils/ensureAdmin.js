const User = require("../models/User");

const ensureAdmin = async () => {
    const isProduction = process.env.NODE_ENV === "production";
    const username = process.env.ADMIN_USERNAME || (isProduction ? "" : "admin");
    const password = process.env.ADMIN_PASSWORD || (isProduction ? "" : "admin");

    if (!username || !password) {
        if (isProduction) {
            console.warn("Admin account not bootstrapped; set ADMIN_USERNAME and ADMIN_PASSWORD.");
            return;
        }
        throw new Error("Admin username and password must be configured.");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        if (existingUser.role !== "admin") {
            throw new Error(`Cannot bootstrap admin: username "${username}" belongs to a non-admin user.`);
        }
        return;
    }

    const email = process.env.ADMIN_EMAIL || `${username}@localhost`;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new Error("Cannot bootstrap admin: ADMIN_EMAIL is already in use.");
    }

    await User.register(new User({ username, email, role: "admin" }), password);
    console.log(`Bootstrapped admin account "${username}".`);
};

module.exports = ensureAdmin;
