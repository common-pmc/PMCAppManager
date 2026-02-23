const productTypes = require('../constants/productTypes');

exports.getProductTypes = (req, res) => {
    try {
        res.status(200).json(productTypes);
    } catch (error) {
        console.error('Грешка при зареждане на типовете файлове:', error);
        res.status(500).json({ message: 'Грешка при зареждане на типовете файлове' }); 
    }
};