import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas', error);
    throw error;
  }
}
// Multer configuration for handling file uploads

export default async function handler(req, res) {
  await connectToDatabase()
  if (req.method === 'POST') {
    const title = req.body.title
    const description = req.body.description
    const email = req.body.email;
    const photos = req.body.photos;
    console.log(title,description,email)
  try {
    const db = client.db('ticketUpskill');
    const collection = db.collection('ticket');

    // Store form data in MongoDB
    const result = await collection.insertOne({
      title,
      description,
      email,
      photos,
      status:"OPEN"
    });

    // Send email notification
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: 'admin@upskillmeet.com',
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: 'admin@upskillmeet.com',
      to: 'support@upskillmeet.com',
      subject: title,
      text: `Hi,
         ${description}. Please resolve and get back to me at the earliest.
         Thank you,
         ${email}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Failed to submit ticket');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Ticket submitted successfully');
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error submitting ticket:', error);
    res.status(500).json({ success: false, error: 'Failed to submit ticket' });
  } 
  finally {
    await client.close();
  }
 }
 if(req.method === 'GET'){
  try {
    await client.connect();
    const db = client.db('ticketUpskill');
    const collection = db.collection('ticket');

    // Retrieve all data from the database
    const tickets = await collection.find({}).toArray();

    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    console.error('Error retrieving tickets:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve tickets' });
  } 
  finally {
    await client.close();
  }
 }
};

// handler.get(async (req, res) => {
//   finally {
//     await client.close();
//   }
// });

