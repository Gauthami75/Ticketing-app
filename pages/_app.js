import "@/styles/globals.css";
import React, { Component }  from 'react';
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'
import "../styles.css";

export default function App({ Component, pageProps }) {
  return (
 
  <Component {...pageProps} />
  );
}
