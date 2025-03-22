const { body } = require("express-validator");

exports.validateShippingData = [
    body('shippingAddress.street').notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.state').notEmpty().withMessage('State is required'),
    body('shippingAddress.country').notEmpty().withMessage('Country is required'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Postal Code is required'),
    body('carrier').isIn(['DHL', 'FedEx', 'UPS', 'USPS', 'Other']).withMessage('Invalid carrier'),
    body('shippingStatus').isIn(['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Returned'])
        .withMessage('Invalid shipping status')
];
