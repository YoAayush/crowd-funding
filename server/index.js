require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.VITE_HOST,
  port: process.env.VITE_PORT,
  secure: true,
  auth: {
    user: process.env.VITE_PRIVATE_EMAIL,
    pass: process.env.VITE_PRIVATE_PASSWORD,
  },
});

async function sendEmailOTP(orgEmail, OTP) {
  try {
    await transporter.sendMail({
      from: `CrowdFund Campaign Creator <${process.env.VITE_PRIVATE_EMAIL}>`,
      to: orgEmail,
      subject: "OTP Verification for Your Crowdfunding Campaign",
      html: `
        <h3>Dear Campaign Creator,</h3>
        <p>Welcome to CrowdFund Campaign Creator! To start creating your crowdfunding campaign, please verify your email using the following One-Time Password (OTP):</p>
        <strong>Your OTP: ${OTP}</strong>
        <p>This OTP is valid for 10 minutes and is required to authenticate your account before launching your campaign.</p>
        <p>If you did not initiate this request, please ignore this email or contact our support team.</p>
        <p>Happy fundraising!</p>
        <p>The CrowdFund Team</p>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
}

async function sendEnquiryEmail(senderEmail, campaignOwnerEmail, message) {
  try {
    await transporter.sendMail({
      from: `CrowdFund Campaign Creator <${
        senderEmail || process.env.VITE_PRIVATE_EMAIL
      }>`,
      to: campaignOwnerEmail,
      subject: "New Enquiry from Potential Backer",
      text: `You have received a new enquiry from ${senderEmail}: ${message}`,
      html: `
        <h3>Dear Campaign Owner,</h3>
        <p>You have received a new enquiry from ${senderEmail}:</p>
        <p>${message}</p>
        <p>If you did not initiate this request, please ignore this email or contact our support team.</p>
        <p>Happy fundraising!</p>
        <p>The CrowdFund Team</p>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

app.post("/send-otp", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { orgEmail } = req.body;

  // List of common public email domains to block
  // const blockedDomains = [
  //   "gmail.com",
  //   "yahoo.com",
  //   "hotmail.com",
  //   "outlook.com",
  //   "aol.com",
  //   "icloud.com",
  // ];

  console.log("Received email:", orgEmail);

  if (!orgEmail || !orgEmail.includes("@")) {
    return res.status(400).send("Valid organization email is required");
  }

  // const domain = orgEmail.split("@")[1];

  // if (!domain || blockedDomains.includes(domain.toLowerCase())) {
  //   return res
  //     .status(400)
  //     .send(
  //       "Please use an organization email, not a public email service (e.g., Gmail, Yahoo)"
  //     );
  // }

  try {
    const OTP = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(OTP, salt);

    const isEmailSent = await sendEmailOTP(orgEmail, OTP);

    if (isEmailSent) {
      return res.status(200).json({
        message: "OTP sent successfully",
        hashedOTP, // Return hashed OTP for verification later
        email: orgEmail,
      });
    } else {
      return res.status(500).send("Error sending OTP email");
    }
  } catch (error) {
    console.error("Error in send-otp endpoint:", error);
    return res.status(500).send("Internal server error");
  }
});

app.post("/enquiry-email", async (req, res) => {
  const { senderEmail, campaignOwnerEmail, message } = req.body;

  console.log("Sender Email:", senderEmail);
  console.log("Campaign Owner Email:", campaignOwnerEmail);
  console.log("Message:", message);

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const isEmailSent = await sendEnquiryEmail(
      senderEmail,
      campaignOwnerEmail,
      message
    );

    if (isEmailSent) {
      return res
        .status(200)
        .json({ message: "Enquiry email sent successfully" });
    } else {
      return res.status(500).send("Error sending enquiry email");
    }
  } catch (error) {
    console.error("Error in enquiry-email endpoint:", error);
    return res.status(500).send("Internal server error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
