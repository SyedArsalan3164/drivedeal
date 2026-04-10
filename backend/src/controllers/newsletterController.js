const Subscriber = require('../models/Subscriber');
const sendEmail = require('../utils/sendEmail');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return res.status(400).json({ message: 'You are already subscribed to the newsletter!' });
    }

    // Save subscriber
    const subscriber = await Subscriber.create({ email });

    // Send welcome email
    try {
      await sendEmail({
        email: subscriber.email,
        subject: 'Welcome to DriveDeal Newsletter!',
        message: 'Thank you for subscribing to our newsletter! You will now receive updates on new vehicle listings and special offers.',
        htmlMessage: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #2563eb; padding: 20px; text-align: center;">
              <h2 style="color: white; margin: 0;">DriveDeal</h2>
            </div>
            <div style="padding: 20px; background-color: #f8fafc;">
              <h3 style="color: #1e293b; margin-top: 0;">Subscription Confirmed!</h3>
              <p style="color: #475569; line-height: 1.6;">Thank you for subscribing to the DriveDeal newsletter. You've successfully joined our mailing list.</p>
              <p style="color: #475569; line-height: 1.6;">You'll be the first to know when exciting new vehicles hit our showroom!</p>
              <br>
              <div style="text-align: center; margin-top: 30px;">
                <a href="http://localhost:5000/api/newsletter/unsubscribe?email=${subscriber.email}" style="color: #64748b; font-size: 13px; text-decoration: underline;">Unsubscribe from DriveDeal Newsletter</a>
              </div>
            </div>
          </div>
        `
      });

      res.status(201).json({ message: 'Successfully subscribed to the newsletter', subscriber });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Wait, even if the email fails (e.g. SMTP issues in dev), we should still acknowledge the DB write
      res.status(201).json({
        message: 'Successfully subscribed! (Welcome email failed to send, please check SMTP configuration)',
        subscriber
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsubscribe from newsletter
// @route   GET /api/newsletter/unsubscribe
// @access  Public
const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).send('<h3>Invalid Unsubscribe Link.</h3>');
    }

    await Subscriber.findOneAndDelete({ email });

    const htmlResponse = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; text-align: center; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e293b;">Unsubscribed Successfully</h2>
        <p style="color: #475569;">You have been successfully removed from our mailing list. You will no longer receive updates from DriveDeal.</p>
      </div>
    `;

    res.status(200).send(htmlResponse);
  } catch (error) {
    res.status(500).send('<h3>Something went wrong. Please try again.</h3>');
  }
};

module.exports = {
  subscribeNewsletter,
  unsubscribeNewsletter
};
