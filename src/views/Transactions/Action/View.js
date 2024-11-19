import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Col, Row } from 'reactstrap';
import _ from "lodash";
import moment from "moment";

const View = (props) => {

  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({});
  const [fullname, setFullname] = useState({});

  const getStatus = (items) => {
    let statusText;
    if (items.status === 0) {
        statusText = 'Not paid';
    } else if (items.status === 1) {
        statusText = 'Success';
    } else if (items.status === 2) {
        statusText = 'Pending';
    } else {
        statusText = 'Failed';
    }
    return statusText
  }
  useEffect(() => {
    setItem(props.item);
    setFullname(props.item.first_name + ' ' + props.item.last_name);
  }, [props]);
  return (
    <div className={"inline-btn"}>
      <button className="btn circle_btn btn-sm mr-1" type="button" title="Status" onClick={(e) => { setModal(true); }}><i className="fa fa-eye" /></button>
      <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal modal-lg"}>
        <ModalHeader toggle={e => { setModal(false) }}>Transaction Details</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label><strong>User Name</strong></Label>
                <div>{fullname}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Order Id</strong></Label>
                <div>{item.order_id}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Currency</strong></Label>
                <div>{item.currency}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Gateway Name</strong></Label>
                <div>{_.replace(item.gateway_name, '_', ' ')}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Transaction Id</strong></Label>
                <div>{item.txn_id}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Transaction Amount</strong></Label>
                <div>{item.txn_amount}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Coupon Code</strong></Label>
                <div>{(!_.isSet(item.coupon_code) || item.coupon_code == '') ? 'N/A' : item.coupon_code}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Coupon Cashback</strong></Label>
                <div>{(!_.isSet(item.coupon_cashback_amount) || item.coupon_cashback_amount == '') ? 0 : item.coupon_cashback_amount}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Transaction Type</strong></Label>
                <div>{_.startCase(_.camelCase(_.replace(item.txn_type, '_', ' ')))}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Transaction Date</strong></Label>
                <div>{item.txn_date}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Bank Transaction Id</strong></Label>
                <div>{item.banktxn_id}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Checksum</strong></Label>
                <div>{_.startCase(_.camelCase(_.replace(item.checksum, '_', ' ')))}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Local Transaction Id</strong></Label>
                <div>{item.local_txn_id}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Status</strong></Label>
                <div> {getStatus(item)} </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Create Date</strong></Label>
                <div>{moment(item.created_at).format('LLL')}</div>
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
