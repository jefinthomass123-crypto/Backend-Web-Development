'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      const { to, otp } = job.data;

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Your Verification Code',
        text: `Your OTP is: ${otp}`,
      });
    }
  },
  {
    connection,
  }
);

worker.on('completed', (job) => {
  console.log('completed', job.id);
});

worker.on('failed', (job, err) => {
  console.log('failed', job && job.id, err.message);
});

module.exports = worker;