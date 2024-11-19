import React, {useState} from 'react';
import {Card, CardBody, CardGroup, Col, Container, Row } from 'reactstrap';
import Loader from '../../CommanPage/Loader';

const Login = () => {

  const [visible] = useState(false);
 
  return (
    <div className="app flex-row align-items-center loginmodal">
      <Loader className="overlay-loader" visible={visible} />
      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <CardGroup>
              <Card className="modal-content">
                <CardBody>
                  
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default Login;
