import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Project Collab Tool" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Email not sent:", error);
  }
};

export default sendEmail;
