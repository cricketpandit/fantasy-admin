import React, { useState, useEffect } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Col, Row} from 'reactstrap';
import _ from "lodash";

const View = (props) => {

  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({});
  

  useEffect(() => {
      setItem(props.item);
  }, [props.item]);

  return (
    <div className={"inline-btn"}>
      <Button className="btn circle_btn btn-sm mr-1" type="button" title="Status" onClick={(e) => { setModal(true);}}><i className="fa fa-eye" /></Button>
      <Modal isOpen={modal} toggle={e => {setModal(false)}} className={"custom-modal"}>
        <ModalHeader toggle={e => {setModal(false)}}>View</ModalHeader>
        <ModalBody>
          <Row>            
            <Col md={6}>
              <FormGroup>
                <Label><strong>Banner Type</strong></Label>
                <div>{item.banner_type}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Image</strong></Label>
                <div>{_.upperFirst(item.first_name+' '+item.last_name)}</div>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default View;
