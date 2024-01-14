function checkRole(role) {
	return (req, res, next) => {
		// if (req.user && req.user.role.toUpperCase() === role) {

		if (role.includes(req.user.role.toUpperCase())) {
			console.log(`👨‍🚒Role Check :: ${req.user.role}`);
			next(); // Role is allowed, continue to the next middleware
		} else {
			return res.status(403).json({ message: "Access denied. Insufficient privileges." });
		}
	};
}


module.exports = checkRole;
