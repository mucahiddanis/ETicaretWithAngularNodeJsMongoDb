const errorHandler = (res, error) => {
    res.status(400).json({message: error.message})
}

module.exports = errorHandler