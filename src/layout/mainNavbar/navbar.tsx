import React from "react";
import { useState } from 'react'
import {Link,NavLink} from 'react-router-dom'
import Logo from '@/assets/Minya University Logo.jpg'
import LanguageIcon from '@mui/icons-material/Language';
import LoginIcon from '@mui/icons-material/Login';
import './navbar.css'
const MainNav: React.FC = () => {
  const [state, setState] = useState(false)

  const navigation = [
      { title: "Home", path: "/" },
      { title: "Services", path: "/Services" },
      { title: "Announcements", path: "/Announcements" },
      { title: "Contact", path: "/Contact" }
  ]

  return (
      <nav className="bg-white w-full  border-[#E2E8F0] md:border-b md:static ">
          <div className="items-center px-4 w-full mx-auto md:flex md:px-8">
              <div className="flex items-center justify-between py-1 md:py-2 md:block">
                <div className="flex gap-1 items-center">
                  <Link to="/">
                        <img
                            src={Logo} 
                            className="w-18 h-18 rounded-full "
                            alt="Minia University logo"
                        />
                    </Link>
                  <div className="subTitle">
                    <h1>Minia University</h1>
                    <p>International Students Partal</p>
                  </div>
                </div>
                    
                  <div className="md:hidden">
                      <button className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
                          onClick={() => setState(!state)}
                      >
                          {
                              state ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                              ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                  </svg>
                              )
                          }
                      </button>
                  </div>
              </div>
              <div className={`flex-1 justify-self-center mt-8 md:block md:mt-0 ${ state ? 'block' : 'hidden'}`}>
                  <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0 m-0">
                      {
                          navigation.map((item, idx) => {
                              return (
                                <li key={idx} >
                                    <NavLink to={item.path}  style={{textDecoration:"none",color:"#475569"}}>
                                        { item.title }
                                    </NavLink>
                                </li>
                              )
                          })
                      }
                  </ul>
              </div>
              <div className="hidden md:inline-block ">
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <div style={{color:"#475569",display:"flex",gap:"5px",fontSize:"16px"}}><LanguageIcon/>AR / EN</div>
                <Link to="/Login" style={{textDecoration:"none" ,fontSize:"16px"}} className="flex py-1.5 px-4 text-white bg-[#0F0FBD] hover:bg-[#0c0ca0] rounded-md shadow gap-1" >
                    <LoginIcon/>Login
                </Link>
              </div>
              </div>
          </div>
      </nav>
  )
  

    // <Navbar  style={{display:"flex",justifyContent:"space-around",borderBottom:"1px solid"}}>
    //   <Container fluid>
    //     <div className="header">
    //         <img src={logo} alt="logo" className="size-16 rounded-full" />
    //       <div className="subTitle">
    //           <h1>Minia University</h1>
    //           <p>International Students Partal</p>
    //       </div>
    //       </div>
        
        
    //       <Nav
    //         className="my-2 my-lg-0"
    //         style={{ maxHeight: '100px' ,gap:"10px"}}
    //       >
    //         <Nav.Link as={NavLink} to="/" >Home</Nav.Link>
    //         <Nav.Link as={NavLink} to="/Services">Services</Nav.Link>
    //         <Nav.Link as={NavLink} to="/Announcements">Announcements</Nav.Link>
    //         <Nav.Link as={NavLink} to="/Contact">Contact</Nav.Link>
            
            
    //       </Nav>
    //       <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
    //         <div style={{color:"#475569",display:"flex",gap:"5px",fontSize:"16px"}}><LanguageIcon/>AR / EN</div>
    //         <Link to="/Login" style={{textDecoration:"none"}}> <Button style={{color:"#FFFFFF",display:"flex",gap:"5px",fontSize:"16px",backgroundColor:"#0F0FBD"}}><LoginIcon/>Login</Button></Link> 
    //       </div>
    //   </Container>
    // </Navbar>
  
};

export default MainNav;