import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendActivationMessage = async (to, link) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Activation account on ${process.env.API_URL}`,
    text: "",
    html: `
            <div>
                  <h1>For activation account click on link</h1>
                  <a href="${link}">${link}</a>
            </div>
            `,
  });
};
export const sendInvoice = async (to, invoiceData) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Your Invoice`,
    text: "",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        .container { width: 80%; margin: auto; padding: 20px; }
        .header, .footer { text-align: center; margin-bottom: 20px; }
        .header img { width: 150px; }
        .details, .summary, .payment, .return-policy { margin-bottom: 20px; }
        .details table, .summary table { width: 100%; border-collapse: collapse; }
        .details th, .summary th, .details td, .summary td { border: 1px solid #000; padding: 8px; text-align: left; }
        .details th, .summary th { background-color: #f2f2f2; }
        .total { text-align: right; }
        .total td { border: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="logo.png" alt="Company Logo">
          <h1>Company Name</h1>
          <p>Company Address</p>
          <p>Contact: (123) 456-7890 |n.tusya@gmail.com</p>
        </div>

        <div class="details">
          <h2>Invoice </h2>
          <p><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
          <p><strong>Date: </strong> ${invoiceData.date}</p>
          <p><strong>Delivery Date:</strong> ${invoiceData.deliveryDate}</p>

          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${invoiceData.customerDetails.name}</p>
          <p><strong>Delivery Address:</strong> 1234 Elm Street, City, Country</p>
          <p><strong>Contact:</strong>  ${
            invoiceData.customerDetails.contact
          }</p>
        </div>

        <div class="summary">
          <h3>Order Summary</h3>
          <table>
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
            ${invoiceData.orderSummary
              .map(
                (item) => `
          <tr>
            <td>${item.productName}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${item.unitPrice.toFixed(2)}</td>
            <td>${item.totalPrice.toFixed(2)}</td>
          </tr>
        `
              )
              .join("")}
          </table>
        </div>

        <div class="total">
          <table>
            <tr>
              <td><strong>Subtotal:</strong></td>
              <td>${invoiceData.subtotal.toFixed(2)}</td>
            </tr>
           
            <tr>
              <td><strong>Shipping:</strong></td>
              <td>${invoiceData.shipping.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Total Amount Due:</strong></td>
              <td> ${invoiceData.totalAmountDue.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="payment">
          <h3>Payment Methods</h3>
          <p>Please make your payment via one of the following methods:</p>
          <ul>
            <li>Bank Transfer: Account No: 123456789, SWIFT/BIC: ABCDEF</li>
            <li>Credit Card: We accept Visa, MasterCard, and AMEX</li>
            <li>PayPal: paypal@example.com</li>
          </ul>
        </div>

        <div class="return-policy">
          <h3>Return and Cancellation Policy</h3>
          <p>If you are not satisfied with your purchase, you can return the product within 30 days of receipt. Please ensure that the product is in its original condition. For cancellations, please contact us within 24 hours of placing your order.</p>
        </div>

        <div class="footer">
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    </body>
    </html>
  `,
  });
};
