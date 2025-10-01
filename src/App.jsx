
import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from "react-router-dom"
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Blogs from './pages/Blogs';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import BlogDetail from './pages/BlogDetail';
import AuthorProfile from './pages/AuthorProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/services' element={<Services />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/blogs/:id' element={<BlogDetail />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/create-post' element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } />
        <Route path='/edit-post/:id' element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        } />
        <Route path='/author/:authorName' element={
          <ProtectedRoute>
            <AuthorProfile />
          </ProtectedRoute>
        } />
        </Routes>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
