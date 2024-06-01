require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Mailgun = require("mailgun.js");
const formData = require("form-data");

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "Valentin GUILLAUME",
  key: process.env.MAILGUN_API_KEY,
});

const app = express();
app.use(express.json());
app.use(cors());

app.post("/send-mail", async (req, res) => {
  try {
    const { firstname, lastname, email, subject, message } = req.body;
    const response = await mg.messages.create(process.env.MAILGUN_SANDBOX, {
      from: `${firstname} ${lastname} <${email}>`,
      to: process.env.EMAIL,
      subject: subject,
      text: message,
    });
    console.log(response);
    res.status(201).json({
      message: "Mail envoyé avec succès",
      response,
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
