import { useState, useEffect } from 'react'
import './App.css'
// import Table from './views/components/Table'
// import { sampleGetAPI } from './api/user'
import Layout from './views/pages/Layout'
import UserRegistration from './views/pages/UserRegistration/UserRegistration'
import Contact from './views/pages/Contact'
import Home from './views/pages/Home'
import NoPage from './views/pages/NoPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {

  // const [responseData, setResponseData] = useState([]);  

  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await sampleGetAPI();
  //     setResponseData(response?.data ?? []);
  //   }
  //   fetchData();
  // }, []);

  return (
    <>

      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="userRegistration" element={<UserRegistration />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

      {/* <Table data={responseData}/> */}
    </>
  )
}

export default App
