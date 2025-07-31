import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Table from './Table'
import { sampleGetAPI } from './api/user'

const App = () => {
  const [count, setCount] = useState(0)
  const [responseData, setResponseData] = useState([]);  

  useEffect(() => {
    async function fetchData() {
      const response = await sampleGetAPI();
      setResponseData(response?.data ?? []);
    }
    fetchData();
  }, []);

  return (
    <>
    
    </>
  )
}

export default App
