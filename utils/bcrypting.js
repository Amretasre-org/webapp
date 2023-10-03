const bcrypt = require('bcrypt');

function bcryptingPassword(password) {
    try {
        const saltRounds = 10; // Adjust the number of salt rounds as needed
        const hash = bcrypt.hashSync(password, saltRounds);
        return hash;
    } catch (err) {
        // Handle any errors that occur during hashing
        console.error('Error hashing password:', err);
        throw err; // Re-throw the error for handling at a higher level
    }
}

module.exports = {
    bcryptingPassword
}
