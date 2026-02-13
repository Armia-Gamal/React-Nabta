const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "armiagamal24@gmail.com",
    pass: "zzapxsptqwmnaybr",
  },
});

exports.sendWelcomeEmail = functions
  .region("us-central1")
  .auth.user()
  .onCreate(async (user) => {

    if (!user.email) return null;

    // ⏳ نستنى ثانيتين عشان لو الحساب هيتحذف
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // 🔍 نتأكد إن المستخدم لسه موجود
      await admin.auth().getUser(user.uid);
    } catch (error) {
      console.log("User was deleted, no email sent.");
      return null;
    }

    const mailOptions = {
      from: `Nabta-Seniors <armiagamal24@gmail.com>`,
      to: user.email,
      subject: `Welcome to Nabta-Seniors, ${user.displayName || ""}! ❤️`,
      html: `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1;">
  <div style="max-width: 600px; margin: auto; padding: 20px;">

    <a href="https://nabta-seniors.netlify.app/" target="_blank" style="text-decoration:none;">
      <img 
        src="https://i.imgur.com/A0LWWKw.png"
        alt="Nabta-Seniors Logo"
        style="height:50px; margin-bottom:20px;"
      />
    </a>

    <p>Welcome to the Nabta-Seniors family!❤️ We're excited to have you on board.</p>

    <p>Your account has been successfully created, and you're now ready to explore all the great features we offer.</p>

    <p>
      <a 
        href="https://nabta-seniors.netlify.app/"
        target="_blank"
        style="display:inline-block; text-decoration:none; color:#ffffff; background-color:#fc0038; padding:10px 20px; border-radius:6px; font-weight:bold;">
        Open Nabta-Seniors
      </a>
    </p>

    <p>If you have any questions or need help getting started, our support team is just an email away at armiagamal24@gmail.com.</p>

    <p>
      Best regards,<br>
      <strong>The Nabta-Seniors Team</strong>
    </p>

    <hr style="margin-top:30px;" />

    <p style="font-size:14px; color:#555;">
      Account created for: <strong>${user.displayName || user.email}</strong>
    </p>

  </div>
</div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent to:", user.email);
    } catch (error) {
      console.error("Email error:", error);
    }

    return null;
  });
