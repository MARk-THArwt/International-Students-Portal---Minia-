import React from 'react'
import ServicesCard from '../../component/common/card/card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MainNav from '../../layout/mainNavbar/navbar'
import Footer from '../../layout/mainFooter/footer'
import { Link } from 'react-router-dom';
import AdmissionLogo from '../../assets/icons-svg/admission-guide.svg?react'
import VisaLogo from './../../assets/icons-svg/Visa.svg?react'
import CampusLogo from './../../assets/icons-svg/Campus-Housing.svg?react'
import LastestNews from './../../assets/icons-svg/lastestNews.svg?react'
import Arow from '../../assets/icons-svg/arow.svg?react'
import LibraryIcon from './../../assets/icons-svg/Library.svg?react'
import SportCenerIcon from '../../assets/icons-svg/sportCenter.svg?react'
import LabIcon from '../../assets/icons-svg/Lab.svg?react'
import Map from '../../assets/icons-svg/map.svg?react'
import Dot from '../../assets/icons-svg/dot.svg?react'
import Virtual from '../../assets/icons-svg/virtual.svg?react'
import ExploreArrow from '../../assets/icons-svg/exploreArrow.svg?react'
import './style.css'
export const Home = () => {
  return (
    <>
    <MainNav/>
    <Container fluid style={{display:"flex",flexDirection:"column",gap:"3em"}}>
      {/* head */}
      <Row>
        <Col xs={12} md={6} className="head">
        <div className='acadmic'><Dot/>Academic Year 2025-2026</div>
        <h1>Start Your Global</h1>
        <h1>Journey at</h1>
        <h1 className='titile'>Minia University</h1>
        <p>Welcome to the Minia University International Students
Portal. Your journey to academic success starts here with
world-class programs and a supportive community.</p>
        <div className='bottoms'>
          <Link to="/" >Explore Services<ExploreArrow/></Link>
          <Link to="/"><Virtual/>Virtual Tour</Link>
        </div>
        <div className='numbers'>
          <div style={{textAlign:"center"}}>
            <p className='number'>15K+</p>
            <p className='disk'>Students</p>
            </div>
          <div>
            <p className='number'>120+</p>
            <p className='disk'>Programs</p>
            </div>
          <div>
            <p className='number'>45</p>
            <p className='disk'>Countries</p>
            </div>
          </div>
        </Col>
        <Col xs={12} md={6}>
        
        </Col>
      </Row>
      {/* news */}
      <Row style={{backgroundColor:"rgba(197, 160, 89, 0.1)",borderLeft:"4px solid rgba(197, 160, 89, 1)",borderRadius:"8px",alignItems:"center",height:"52px"}}>
        <Col xs={2} style={{display:"flex" ,alignItems:"center",gap:"4px"}}>
        <LastestNews/>
        <p style={{color:"rgba(197, 160, 89, 1)",fontWeight:"700",fontSize:"14px",lineHeight:"20px",letterSpacing:"0.7",textTransform:"uppercase"}}>Latest News</p>
        </Col>
        <Col xs={8} style={{display:"flex",gap:"4px"}}><p style={{margin:"0px",color:"rgba(0, 33, 71, 1)",fontWeight:"500",fontSize:"14px",lineHeight:"20px"}}>Registration for the Spring Semester 2026 is now open. </p> <p style={{margin:"0px",color:"rgba(0, 33, 71, 1)",fontWeight:"700",fontSize:"14px",lineHeight:"20px"}}>Deadline: March 15th.</p></Col>
        <Col xs={2} ><Link to="/" style={{color:"rgba(15, 15, 189, 1)",fontWeight:"bold",fontSize:"14px",lineHeight:"20px",textDecoration:"none"}}>Read details<Arow/></Link></Col>
      </Row>
      {/* our services */}
      <Row className='gap-5'>
        <Row className='gap-2' style={{borderBottom:"1px solid #E2E8F0",padding:"1rem"}}>
          <Col xs={10}>
          <h2 style={{color:"#002147",fontFamily:"Public Sans",fontWeight:"bold",fontSize:"30px",lineHeight:"36px"}}>Student Services</h2>
          <p style={{color:"#64748B",fontFamily:"Public Sans",fontSize:"16px",lineHeight:"24px"}}>Comprehensive support for your acadimic journey</p>
          </Col>
          <Col className='mt-auto'>
                    <Link className='ml-auto' to={"/"} style={{color:"#0F0FBD",fontFamily:"Public Sans",fontWeight:"bold",fontSize:"14px",lineHeight:"20px",textDecoration:"none"}}>View All Services</Link>
          </Col>
        </Row>
        <Row xs={1} md={3} lg={3} className='gap-0'>
          <Col >
          <ServicesCard data={{title:"Admission Guide",
               description:`Step-by-step procedures for international applicants, including document requirements and…`
               }} ><AdmissionLogo/></ServicesCard>
        </Col>
        <Col >
          <ServicesCard data={{title:"Visa Support",
               description:`Complete guidance on obtaining and renewing your student visa, residency permits, and legal…`
               }} ><VisaLogo/></ServicesCard>
        </Col>
        <Col >
          <ServicesCard data={{title:"Campus Housing",
               description:`Find comfortable accommodation on or off campus with our housing assistance program for…`
               }} ><CampusLogo/></ServicesCard>
        </Col>
        </Row>
        
      </Row>
      {/* map */}
      <Row style={{border:"1px solid rgba(241, 245, 249, 1)",borderRadius:"16px",backgroundColor:"rgba(248, 250, 252, 1)",padding:"2rem !important"}}>
        <Col xs={12} md={6} style={{padding:"2rem",display:"flex",flexDirection:"column",gap:"1rem"}}>

        <h2 style={{fontWeight:"700",fontSize:"24px",lineHeight:"32px",color:"rgba(0, 33, 71, 1)"}}>Find your way around campus</h2>
        <p style={{fontSize:"16px",lineHeight:"24px",color:"rgba(71, 85, 105, 1)"}}>Explore our interactive map to locate faculties, libraries, and student centers.</p>
        <div className="mapL">
           <div className='mapLi'><LibraryIcon/><p>Central Library</p></div>
        <div className='mapLi'><LabIcon/><p>Science Labs Complex</p></div>
        <div className='mapLi'><SportCenerIcon/><p>Sports Center</p></div>
        </div>
        </Col>
        <Col xs={12} md={6}>
        <div className='map'>
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d112600.76689370809!2d30.5822877!3d28.1229178!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145b25c9ff4ca9db%3A0xb233ef3a6077958c!2sMinia%20University!5e0!3m2!1sen!2seg!4v1772907339299!5m2!1sen!2seg"
           width="600"
            height="250"
             style={{border:"0",borderRadius:"20px"}}
               loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>
          <div className='padg'><Map/><p>Open Interactive Map</p></div>
          </div></Col>
      </Row>
    </Container>
    <Footer/>
    </>
  )
}
