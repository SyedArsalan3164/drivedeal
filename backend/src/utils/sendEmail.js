const sendEmail = async (options) => {
  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID || 'service_29ycqkh',
    template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_h3a2mqg',
    user_id: process.env.EMAILJS_PUBLIC_KEY || 'ieiK9dy7EkKd1i-yr',
    accessToken: process.env.EMAILJS_PRIVATE_KEY || 'WTyUB-u0VraHia_ASyo3e',
    template_params: {
      email: options.email,
      subject: options.subject,
      htmlMessage: options.htmlMessage || options.message,
    }
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EmailJS Error:', errorText);
      throw new Error(`EmailJS failed to send email: ${errorText}`);
    }

    console.log('Message sent via EmailJS to %s', options.email);
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = sendEmail;
