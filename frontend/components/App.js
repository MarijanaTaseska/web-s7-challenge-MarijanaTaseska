import React from 'react'
import Home from './Home'
import Form from './Form'
import { Route, Routes, Link } from 'react-router-dom'

// Inside the `nav`, render two `NavLinks`:
// 1. One with text content **Home** that navigates to "/".
// 2. One with text content **Order** that navigates to "/order".

// - Below the `nav`, render a `Routes` element containing two `Route` elements:
// 1. When the path is "/" it renders `<Home />`.
// 2. When the path is "/order" it renders `<Form />`.


function App() {
  return (
    <div id="app">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/order">Order</Link>
      </nav>
      {/* Route and Routes here */}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/order" element={<Form />}/>
      </Routes>
      
    </div>
  )
}

export default App
