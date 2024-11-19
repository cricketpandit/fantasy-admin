import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
import _, { isUndefined } from "lodash";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ViewIdentity = (props) => {

  const customStyles = {
    content: {
      top: "50%",
      left: "100%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
      height: "80%",
    },
  };

  const session = useSession();
  const alert = useAlert();
  const [token] = useState(session.token);
  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({});
  const [ID, setID] = useState('');
  const [identity_verified, setIdentityverified] = useState('');
  const [error, setError] = useState(false);
  const [reason, setReason] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);


  const [is_reject, setIs_reject] = useState(false);
  const updateBankStatus = async (identityStatus) => {
    let postJson = { id: ID, identity_verified: identityStatus, reason };
    let path = apiUrl.update_identity_status;
    const fr = await Helper.post(token,postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        props.refreshData();
        setIs_reject(false)
        alert.success(res.msg);
        setModal(false);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  }

  useEffect(() => {
    if (!_.isEmpty(props.item)) {
      setItem(props.item);
      setID(props.item);
      renderSwitch(props.item.identity_verified);
    }
  }, [props]);

  const renderSwitch = async (val) => {
    if (val === 0)
      setIdentityverified('Not Uploaded');
    else if (val === 1)
      setIdentityverified('In Review');
    else if (val === 2)
      setIdentityverified('Cancel By Admin');
    else if (val === 3)
      setIdentityverified('Approved');
  };
  const accept = async () => {
    let SwalConfig = Helper.SwalConfig();
    const result = await Swal.fire(SwalConfig);
    if (result.value) {
      updateBankStatus(1)
    }
  }

  const handleClose = () => {
    setOpenModal(false)
  }

  const handleImageModal = (image) => {
    let temp = [];
    temp.push({
      original: image,
      thumbnail: image,
    });

    setModalImages(temp)    
    setOpenModal(true)
  };
  return (
    
    <div className={"inline-btn"}>
      <Button className="btn btn-warning btn-sm mr-1" type="button" title="National Identity Status" onClick={(e) => { setModal(true); }}><i className="fa fa-id-card" /></Button>
      <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal"}>
        <ModalHeader toggle={e => { setModal(false) }}>National Identity Details</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Full Name</strong></Label>
                <div>{ item.first_name + ' ' + item.last_name || ''}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Name On Identity</strong></Label>
                <div>{Helper.orOperator(item.identity_name,'')}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Identity Number</strong></Label>
                <div>{Helper.orOperator(item.identity_number,'') }</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Status</strong></Label>
                <div>{Helper.orOperator(identity_verified,'Not Uploaded Yet') }</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Identity Image</strong></Label>
                <div><img alt="Identity" src={item?.identity_image || ''} height="100" width="200" onClick={() => handleImageModal(item?.identity_image)} /></div>
              </FormGroup>
            </Col>
            {item.identity_verified == 2 && item?.identity_decline_reason?.length > 0 && (<Col md={6}>
              <FormGroup>
                <Label><strong>Decline Reason Of Identity Details</strong></Label>
                <div>{Helper.orOperator(item?.identity_decline_reason || '')}</div>
              </FormGroup>
            </Col>)}
          </Row>
        </ModalBody>
        <ModalFooter>
          {!isUndefined(props.module) && module.edit === 1 ? <>
            {(identity_verified !== 'Approved' && identity_verified !== 'Cancel By Admin') && <button type="button" className="btn btn-success pull-right" data-dismiss="modal" onClick={(e) => { accept() }}>Approve</button>}
            {(identity_verified !== 'Approved' && identity_verified !== 'Cancel By Admin') && <button type="button" className="btn btn-danger pull-right" data-dismiss="modal" onClick={(e) => { setIs_reject(true) }}>Decline</button>}
            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
          </> : null}
          {session.profile.user_type === "admin" ? <>
            {(identity_verified !== 'Approved' && identity_verified !== 'Cancel By Admin') && <button type="button" className="btn btn-success pull-right" data-dismiss="modal" onClick={(e) => { accept() }}>Approve</button>}
            {(identity_verified !== 'Approved' && identity_verified !== 'Cancel By Admin') && <button type="button" className="btn btn-danger pull-right" data-dismiss="modal" onClick={(e) => { setIs_reject(true) }}>Decline</button>}
            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button></> : null}
        </ModalFooter>
      </Modal>
      {is_reject && (<Modal isOpen={is_reject} toggle={e => { setIs_reject(false) }} className={"custom-modal"}>
        <ModalHeader toggle={e => { setIs_reject(false) }}>Decline National Identity Request</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <FormGroup>
                <Label><strong>Decline Reason</strong></Label>
                <div><input className="form-control" type={"text"} onChange={(e) => {
                  setReason(e.target.value)
                }} /></div>
                {error && reason.length === 0 && <p className="text-danger marginmessage">Decline Reason is required.</p>}
                {error && reason.length > 0 && reason.length < 15 && <p className="text-danger marginmessage">Decline Reason is minimum 15 characters required.</p>}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-success" data-dismiss="modal" onClick={(e) => { if (reason !== '') { updateBankStatus(0) } else { setError(true) } }}>Submit</button>
          <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={(e) => { setIs_reject(false); }}>Close</button>
        </ModalFooter>
      </Modal>)}

      <Modal
        ariaHideApp={false}
        closeTimeoutMS={200}
        style={customStyles}
        isOpen={openModal}
        onRequestClose={handleClose}
        contentLabel="Image modal"
        className='galery_modal'
      >
        <div
          data-action="a-popover-floating-close"
          style={{ paddingBottom: 1, visibility: "visible" }}
        >
          <div
            className="edit-img-modal productdetail-edit-modal a-popover a-popover-modal a-declarative  a-popover-modal-fixed-height"
            data-action="a-popover-a11y"
            aria-modal="true"
            role="dialog"
            aria-labelledby="a-popover-label-6"
            id="a-popover-6"
            style={{
              maxHeight: "none",
              maxWidth: "none",
              visibility: "visible",
              position: "relative",
              top: 0,
              left: 0,
              opacity: 1,
              transform: "translateY(0px)",
            }}
            aria-hidden="false"
          >
            <button type="button" className="close" onClick={handleClose}>
              <span aria-hidden="true">&times;</span>
            </button>
            &nbsp;
            <div className="a-popover-wrapper" aria-busy="false">
              <div
                className="a-popover-inner"
                id="a-popover-content-6"
                style={{ height: "auto", paddingBottom: 15 }}
              >
                <div id="iv-tab-view-container">
                  <div
                    id="ivImagesTab"
                    className="iv-box iv-box-tab iv-tab-content"
                    style={{ display: "block" }}
                  >
                    <div className="iv-box-inner">
                      <div
                        id="ivMain"
                        data-csa-c-type="modal"
                        data-csa-c-component="imageBlock"
                        data-csa-c-content-id="image-block-immersive-view-images-tab"
                        data-csa-c-id="vifu7r-46ulgp-pk9tms-lvdq61"
                      >
                        <div id="ivStage">
                          <div
                            id="ivLargeImage"
                            style={{
                              display: "block",
                              opacity: 1,
                              visibility: "visible",
                              cursor: "zoom-in",
                            }}
                          >                            
                              <ImageGallery  items={modalImages}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      
    </div>
  );
}

export default ViewIdentity;
