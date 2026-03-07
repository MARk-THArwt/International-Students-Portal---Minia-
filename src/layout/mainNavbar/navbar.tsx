import React from "react";
import LoginIcon from '@mui/icons-material/Login';
import LanguageIcon from '@mui/icons-material/Language';
import {NavLink,Link} from "react-router-dom"

import Image from 'react-bootstrap/Image';
import "./navbar.css";
import {Navbar,Nav,Container,Button} from 'react-bootstrap'
const MainNav: React.FC = () => {
  return (
    <Navbar  style={{display:"flex",justifyContent:"space-around",borderBottom:"1px solid"}}>
      <Container fluid>
        <div className="header">
          <Image src="./../../assets/logo minia university.webp" roundedCircle />
          <div className="subTitle">
              <h1>Minia University</h1>
              <p>International Students Partal</p>
          </div>
          </div>
        
        
          <Nav
            className="my-2 my-lg-0"
            style={{ maxHeight: '100px' ,gap:"10px"}}
          >
            <Nav.Link as={NavLink} to="/" >Home</Nav.Link>
            <Nav.Link as={NavLink} to="/Services">Services</Nav.Link>
            <Nav.Link as={NavLink} to="/Announcements">Announcements</Nav.Link>
            <Nav.Link as={NavLink} to="/Contact">Contact</Nav.Link>
            
            
          </Nav>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{color:"#475569",display:"flex",gap:"5px",fontSize:"16px"}}><LanguageIcon/>AR / EN</div>
            <Link to="/Login" style={{textDecoration:"none"}}> <Button style={{color:"#FFFFFF",display:"flex",gap:"5px",fontSize:"16px",backgroundColor:"#0F0FBD"}}><LoginIcon/>Login</Button></Link> 
          </div>
      </Container>
    </Navbar>
  );
};

export default MainNav;