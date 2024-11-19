import React, { useState,useEffect } from 'react';
import { Link,useLocation } from "react-router-dom";
import { Card, CardBody, Col, Row } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import UpComing from './UpComing';
import Live from './Live';
import Result from './Result';

const ScheduleContest = (props) => {
  const location = useLocation()
  const [tab, setTab] = useState('upcoming');
  const [visible] = useState(false);
  
  const handleTabChange = (e) => {
    setTab(e.target.name);
  }

  useEffect(()=>{
    if(location?.state?.tab){
      setTab(location?.state?.tab)
    }
  },[])
  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <nav className="navbar navbar-expand-lg navbar-light bg-light mobile_show">
                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to='#' name="upcoming" onClick={handleTabChange} 
                        className={tab=='upcoming' ? 'nav-link '+tab : 'nav-link'}>Upcoming</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="live" onClick={handleTabChange} className={tab=='live' ? 'nav-link '+tab : 'nav-link'}>Live</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="result" onClick={handleTabChange} className={tab=='result' ? 'nav-link '+tab : 'nav-link'}>Result
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav> <br/>
              {tab === 'upcoming' ? (
                <UpComing/>
              ) : null}
              {tab === 'live' ? (
                <Live/>
              ) : null}
              {tab === 'result' ? (
                <Result/>
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ScheduleContest;