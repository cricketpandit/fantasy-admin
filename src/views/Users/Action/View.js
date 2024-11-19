import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Col, Row } from 'reactstrap';
import _ from "lodash";
import moment from "moment";

const View = (props) => {

  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({});
  const [preview, setPreview] = useState('');
   useEffect(() => {
    setItem(props.item);
    setPreview(props.item.image);
  }, [props.item]);

  return (
    <div className={"inline-btn"}>
      <button className="btn circle_btn btn-sm mr-1" type="button" title="View Details" onClick={(e) => { setModal(true); }}><i className="fa fa-eye" /></button>
      <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal modal-xl"}>
        <ModalHeader toggle={e => { setModal(false) }}>View</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Username</strong></Label>
                <div>{item.username}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Full Name</strong></Label>
                <div>{(item.full_name)}</div>
              </FormGroup>
            </Col>
 
            <Col md={6}>
              <FormGroup>
                <Label><strong>Email</strong></Label>
                <div>{item.email}</div>
              </FormGroup>
            </Col>
  
            <Col md={6}>
              <FormGroup>
                <Label><strong>Address</strong></Label>
                <div>{item.address || ''} {item.city || ''} {item.state || ''} {item.country || ''} {item.pin_code || ''}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Status</strong></Label>
                <div>{_.upperFirst(!_.isEmpty(item.status) ? item.status : 'active')}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Create Date</strong></Label>
                <div>{moment(item.createdAt).format('LL')}</div>
              </FormGroup>
            </Col>
            {item.modified !== "" && <Col md={6}>
              <FormGroup>
                <Label><strong>Modified Date</strong></Label>
                <div>{moment(item.updatedAt).format('LL')}</div>
              </FormGroup>
            </Col>}
            <Col md={6}>
              <FormGroup>
                <Label><strong>User Image</strong></Label>
                <div><img alt="User" src={preview} width={100} /></div>
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label><strong>Deposit Balance</strong></Label>
                <div>INR {item.deposit_amount?.toFixed(2)}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Winning Balance</strong></Label>
                <div>INR {item.winngs_amount?.toFixed(2)}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Bonus</strong></Label>
                <div>INR {item.bonus?.toFixed(2)}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Free Cash</strong></Label>
                <div>INR {item.free_cash?.toFixed(2)}</div>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label><strong>Total Balance</strong></Label>
                <div>INR {item.total_balance?.toFixed(2)}</div>
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
