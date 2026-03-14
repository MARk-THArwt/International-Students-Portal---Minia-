import Card from 'react-bootstrap/Card';
import type { ReactNode } from "react";
import ArrowIcon from "./../../../assets/icons-svg/arrow.svg?react"
function ServicesCard({
  data,
  children,
}: {
  data: { title: string; description: string };
  children: ReactNode;
}) {
  return (
    <Card style={{border:"solid 1px #E2E8F0"}}>
      <Card.Body>
        <div style={{backgroundColor:"#c59f5928",width:"48px",height:"48px",borderRadius:"10px",display: "flex",alignItems: "center",justifyContent: "center",margin:"0.8rem 0rem"}}>{children}</div>
        <Card.Title style={{color:"#002147",fontFamily:"Public Sans",fontWeight:"bold",fontSize:"20px",lineHeight:"28px"}}>{data.title}</Card.Title>
        <Card.Text style={{color:"#475569",fontFamily:"Public Sans",fontSize:"14px",lineHeight:"28px"}}>
          {data.description}
        </Card.Text>
        <Card.Link href="#"  style={{color:"#0F0FBD",fontFamily:"Public Sans",fontWeight:"bold",fontSize:"14px",lineHeight:"20px",textDecoration:"none",display:"flex",gap:"3px",alignItems:"center"}}>Learn More<ArrowIcon/> </Card.Link>
      </Card.Body>
    </Card>
  );
}

export default ServicesCard;