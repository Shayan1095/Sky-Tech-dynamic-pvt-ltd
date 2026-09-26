/* Sends one test email, to prove the mailbox settings work.

   Run: npm run mail:test

   Nothing is stored and nothing is queued — this talks to the mail server
   directly, so a failure here is a settings problem and nothing else. The
   password is never printed, and the error text is scrubbed before it is
   shown in case the server quotes it back. */

import "./load-env.mjs";

import nodemailer from "nodemailer";

const redact = (text) =>
  String(text)
    .replace(/(password|pass|auth)[=:\s"']+[^\s"',)]+/gi, "$1=***")
    .replace(/(mysql:\/\/[^:]+:)[^@]*@/gi, "$1***@");

const config = {
  host: (process.env.SMTP_HOST ?? "").trim(),
  port: Number((process.env.SMTP_PORT ?? "465").trim()) || 465,
  user: (process.env.SMTP_USER ?? "").trim(),
  password: (process.env.SMTP_PASSWORD ?? "").trim(),
  from: (process.env.MAIL_FROM ?? "").trim() || (process.env.SMTP_USER ?? "").trim(),
  to: (process.env.MAIL_TO ?? "").trim(),
};

const missing = Object.entries({
  SMTP_HOST: config.host,
  SMTP_USER: config.user,
  SMTP_PASSWORD: config.password,
  MAIL_TO: config.to,
}).filter(([, value]) => !value);

if (missing.length > 0) {
  console.error("Not configured yet. Missing from .env.local:");
  for (const [key] of missing) console.error("  " + key);
  process.exit(1);
}

console.log("Host      " + config.host + ":" + config.port);
console.log("Sending   as " + config.from);
console.log("To        " + config.to);
console.log("");

const transport = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.port === 465,
  auth: { user: config.user, pass: config.password },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 25000,
});

try {
  process.stdout.write("Checking the connection... ");
  await transport.verify();
  console.log("ok");

  process.stdout.write("Sending a test message... ");
  const info = await transport.sendMail({
    from: config.from,
    to: config.to,
    subject: "SKY Tech admin — test message",
    text: [
      "This is a test from the SKY Tech Dynamic admin panel.",
      "",
      "If you are reading it, outgoing mail is working: enquiry notifications",
      "and anything sent from the panel will arrive the same way.",
      "",
      "Sent " + new Date().toUTCString(),
    ].join("\n"),
  });
  console.log("ok");
  console.log("");
  console.log("Accepted by the server for: " + (info.accepted ?? []).join(", "));
  console.log("Check " + config.to + " — allow a minute, and look in spam the first time.");
} catch (error) {
  console.log("failed");
  console.error("");
  console.error(redact(error.message));
  console.error("");
  const code = error.code ?? "";
  if (code === "EAUTH") {
    console.error("The username or password was rejected.");
    console.error("");
    if (/gmail|googlemail/i.test(config.host)) {
      console.error("Gmail refuses ordinary account passwords over SMTP. It only accepts an");
      console.error("App Password: 16 letters, generated per application.");
      console.error("");
      console.error("  1. Google Account > Security > 2-Step Verification must be ON.");
      console.error("  2. Then Security > App passwords, create one, and copy the 16 letters.");
      console.error("  3. Paste it as SMTP_PASSWORD with no spaces.");
      console.error("");
      console.error("It must belong to " + config.user + ", not another Google account.");
    } else {
      console.error("SMTP_USER must be the full address, and the password is the mailbox's");
      console.error("own — the one that signs in to webmail. Try webmail first: if that");
      console.error("rejects it too, the password is simply wrong.");
    }
  } else if (code === "ECONNECTION" || code === "ETIMEDOUT" || code === "ESOCKET") {
    console.error("Could not reach the mail server. Check SMTP_HOST and SMTP_PORT (465),");
    console.error("and whether your network or antivirus blocks outgoing port 465.");
  } else if (code === "EENVELOPE") {
    console.error("The server refused the addresses. MAIL_FROM must be a mailbox that");
    console.error("really exists on the domain, or it is rejected as a forgery.");
  }
  process.exitCode = 1;
} finally {
  transport.close();
}
