const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        // Return 400 Bad Request with validation errors
        // Format Zod errors to a readable message string if needed, 
        // but for now we stick to returning a success: false to align with frontend
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        return res.json({ success: false, message: errors });
    }
};

export default validateRequest;
