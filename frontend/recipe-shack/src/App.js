import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Homepage from './pages/Homepage';
import Favorites from './pages/Favorites'

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<LoginPage/>} />
          <Route path='/signup' element={<SignupPage/>} />
          <Route path='/homepage' element={<Homepage/>} />
          <Route path='/favorites' element={<Favorites/>} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
