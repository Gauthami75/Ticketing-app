import React, { useState } from 'react';
import axios from 'axios';
import '../styles.module.css';
import Link from 'next/link';
import Image from 'next/image';

const TicketForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [photos, setPhotos] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [photourl,setPhotoUrl]=useState()
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhotoChange = async(event) => {
    const files = event.target.files[0];
    setPhotos(event.target.files[0])
    const photourl = await readFileAsDataURL(files)
    setPhotoUrl(photourl)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('email', email);
  if (photos) { 
    formData.append('photos', photos);
  }

  console.log("screenShots",photos)
  const titl =  formData.get("title")
  const desc =  formData.get("description")  
  const mailId=formData.get("email")
  
  
  const data ={
    title: titl,
    description: desc,
    email: mailId,
    photos: photourl
  }
    try {
      await axios.post('/api/submit-ticket',data,{
        headers: {
          'Content-Type': 'application/json'
        },
      });
      setTitle('');
      setDescription('');
      setEmail('');
      setPhotos(null);
      setErrorMessage('');
      setSuccessMessage('Ticket submitted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to submit ticket. Please try again.');
    }finally {
      setLoading(false); // Reset loading state after submission attempt
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        // Resolve with the base64-encoded string
        resolve(reader.result);
      };

      reader.onerror = () => {
        // Reject with the error
        reject(new Error('Failed to read file as DataURL'));
      };

      // Read the contents of the file as a data URL
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
    <div className="container">
      <h2 className="mt-4">Submit a Ticket</h2>   
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}
      {loading && <p className="text-info">Submitting your ticket...</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" className="form-control" value={title} onChange={handleTitleChange} required />
        </div>
        <div className="form-group">
          <label>Description:(add a detailed description of the issue you are facing)</label>
          <textarea className="form-control" value={description} onChange={handleDescriptionChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={handleEmailChange} required />
        </div><br/>
        <div className="form-group">
          <label>Photos:(attach a screen shot)</label>
          <input type="file" className="form-control-file" accept="image/*" multiple onChange={handlePhotoChange} />
        </div><br/>
        {photos && (
          <div className="form-group">
            <label>Selected Photo:</label>
            <div>
              <div style={{ display: 'inline-block', marginRight: '10px', position: 'relative' }}>
                <Image src={photourl} alt={`Photo`} width={100} height={100} style={{ marginBottom: '10px', border: '1px solid black' }} />
                <button type="button" className="close" aria-label="Close" onClick={() => setPhotos(null)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div style={{display:'flow'}}><button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>  <Link href='/ticketList' style={{marginLeft:'300px'}}>View Tickets</Link></div>
      </form>
    </div>
    </>
  );
};

export default TicketForm;
