# Daily-Challenges-on-terminals-
to be able see if i have understood


import { useState, useEffect } from 'react'


export default function Cats() {

    const [cats, setCats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchCats() {
            try {
                const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=10')

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                console.log(data)
                setCats(data)
                
            } catch (error) {
                setError(error)
                setLoading(false)
            } finally {
                setLoading(false)
            };
        }

        fetchCats()
    }, [])

    

  return (
    <>
        <h1> 10 cute Cats</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {cats.map((cat) => (
            <div key={cat.id}>
                <img src={cat.url} alt="A cute cat" width="200" />
                <p>Height: {cat.height}</p>
                <p>Width: {cat.width}</p>
            </div>
        ))}
    </>
  )
}


import Cats from "./componets/cats";
import Home from "./homepage/home";
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>

      <nav>
            <Link to="/">Home</Link>
            <Link to="/cats">Cats</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cats" element={<Cats />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App






function Home() {
  return (
    <div>
      <h1>Cats</h1>
      <p>Here you can find some cute cats!</p>
    </div>
  )
};

export default Home;
