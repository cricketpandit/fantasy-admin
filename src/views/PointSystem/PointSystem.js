import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Row } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'

const Ten = React.lazy(() => import('./Ten'));
const Twenty = React.lazy(() => import('./Twenty'));
const Odi = React.lazy(() => import('./Odi'));
const Test = React.lazy(() => import('./Test'));

const PointSystem = (props) => {
  
  const [tab, setTab] = useState('t10');
  const [visible] = useState(false);
  
  const handleTabChange = (e) => {
    setTab(e.target.name);
  }

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <nav className="navbar navbar-expand-lg navbar-light">
                <Link to='#' className="navbar-brand text-white ">Point System</Link>
                <div className="collapse navbar-collapse mobile-show" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto tabs_list">
                  <li className="nav-item">
                      <Link to='#' name="t10" onClick={handleTabChange} 
                      className={tab=='t10' ? 'nav-link '+tab : 'nav-link'}
                      
                      >T10</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="t20" onClick={handleTabChange} className={tab=='t20' ? 'nav-link '+tab : 'nav-link'}>T20</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="odi" onClick={handleTabChange} className={tab=='odi' ? 'nav-link '+tab : 'nav-link'}>ODI</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="test" onClick={handleTabChange} className={tab=='test' ? 'nav-link '+tab : 'nav-link'}>Test</Link>
                    </li>
                  </ul>
                </div>
              </nav>  
              {tab === 't10' ? (
                <Ten/>
              ) : null}
              {tab === 't20' ? (
                <Twenty/>
              ) : null}
              {tab === 'odi' ? (
                <Odi/>
              ) : null}
              {tab === 'test' ? (
                <Test/>
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PointSystem;
