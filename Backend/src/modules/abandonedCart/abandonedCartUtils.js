const nodemailer = require("nodemailer");
const { discountOffer } = require("../config"); // You can set discount offer config here

// **🔹 Send Recovery Email**
exports.sendRecoveryEmail = async (userEmail, cartDetails) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Your Cart is Waiting for You!",
        text: `It looks like you left some items in your cart. Here's a quick reminder to complete your purchase. 
               Cart Details: ${JSON.stringify(cartDetails)} 
               Use code 'RECOVERY20' for a 20% discount on your cart!`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};

// **🔹 Calculate Discount Based on Cart Total**
exports.calculateDiscount = (totalAmount) => {
    return totalAmount * (discountOffer / 100);
};
