import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Row, FormGroup, Label } from 'reactstrap';
import Pagination from "react-js-pagination";
import apiUrl from "../../constants/apiPath";
import Helper from "../../constants/helper";
import Swal from 'sweetalert2';
import useSession from "react-session-hook";
import { useAlert } from "react-alert";
import NotificationsTable from "./NotificationsTable";
import io from "socket.io-client"
import Modal from "react-responsive-modal";
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '../CommanPage/TextValidator';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

const Notifications = () => {
  const socket = io(process.env.REACT_APP_SOCKET_URL);
  const session = useSession();
  const alert = useAlert();
  const [token] = useState(session.token);
  const [notifications, setNotifications] = useState([]);
  const [activepage, setActivePage] = useState(1);
  const [totalitems, setTotalItems] = useState('');
  const [Open, setOpen] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [isMatchsubmit, setMatchsubmit] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserList, setSelectedUserList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [noti_sound, setSound] = useState('swiftly.mp3');

  const getData = async (page = activepage) => {
    const itemsPerPage = 10;
    setActivePage(page)
    let path = apiUrl.getNotifications + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setNotifications(res.results.docs || []);
        setTotalItems(res.results.totalDocs || 0);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };



  const sendNotification = async () => {

    setMatchsubmit(true);
   
    let postJson = { message, title, noti_sound, userList: selectedUser };
    let path, fr;
    path = apiUrl.send_notification;
    fr = await Helper.post(token,postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setMatchsubmit(false);
        setOpen(false);
        setSound('swiftly.mp3');
        getData(1);
        Toast.fire({
          type: "success",
          title: res.msg,
        })
        handleReset()
      } else {
        Toast.fire({
          type: "error",
          title: res.msg,
        });
        setMatchsubmit(false);
      }
    } else {
      Toast.fire({
        type: "error",
        title: res.error,
      });
      setMatchsubmit(false);
    }
  }

  const handleSendMessage = async () => {
   
    setMatchsubmit(true);
    let payload = { user_id: session?.profile?._id, message: chatMessage, username: session?.profile?.username };
    socket.emit('sendMessage', payload, (acknowledgment) => {
     

      if (acknowledgment?.success) {
        setMatchsubmit(false);
        handleCloseSendMessageModel()
        Toast.fire({
          type: "success",
          title: acknowledgment.message,
        })
        setChatMessage('')

      } else {
        Toast.fire({
          type: "error",
          title: acknowledgment.message,
        });
        setMatchsubmit(false);
      }
    });
  }

  useEffect(() => {
    getData(1);
  }, []);


  const handleSelectedUsers = (e, item) => {
    if (item) {
      setSelectedUser([item?.id])
      setSelectedUserList([item])
      setUserData([])
    }
  };
  const handleUserList = (e) => {
    setKeyword(e.target.value)
  }

  const getUserList = async () => {
    const path = apiUrl.get_users_list + '?keyword=' + `${keyword}`
     const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUserData(res.results || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  }

  useEffect(() => {
    getUserList()
  }, [keyword])

  const handleRemoveSelectedUser = () => {
    
    setSelectedUserList([])
    setUserData([])
    setKeyword('')
  }

  const handleReset = () => {
    setSelectedUserList([])
    setSelectedUser([])
    setUserData([])
    setTitle('')
  }

  const handleClose = () => {
    setOpen(false)
    handleReset()
  }

 

  const handleCloseSendMessageModel = () => {
    setShowSendMessageModal(false)
  }

  const handleChatMessage = (e) => {
    setChatMessage(e.target.value)
  }

  return (
    <div className="animated fadeIn loader-outer">
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">
              Notifications List
              <div className='ml-auto d-flex'>
              <div className="ml-auto">
                <a className="btn btn-primary float-right" href="#!" onClick={(e) => {
                  setOpen(true);
                  setMessage('');
                }}>
                  <i className="fa fa-plus"> Send Notification</i>
                </a>
              </div>
              </div>
            </CardHeader>

            <CardBody>
              <NotificationsTable notifications={notifications} />
              {
                notifications.length ?
                  <div className="show-pagination technician-page">
                    <Pagination
                      activeClass={""}
                      activeLinkClass={"page-link active"}
                      itemClass={"page-item"}
                      linkClass={"page-link"}
                      activePage={activepage}
                      itemsCountPerPage={10}
                      totalItemsCount={Number(totalitems)}
                      pageRangeDisplayed={4}
                      prevPageText="Previous"
                      nextPageText="Next"
                      firstPageText="<"
                      lastPageText=">"
                      onChange={getData}
                    />
                  </div>
                  : null
              }
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal className="custom-modal-lg" open={Open} onClose={(e) => {
        setOpen(false)
      }}>
        <div className="modal-header grey-1">
          <h4>Send Notification</h4>
        </div>
        <div className="modal-body">
          <ValidatorForm id="updateminmax" onSubmit={sendNotification}>
            <Row>
              <Col md={2} className="text-right">
                <FormGroup>
                  <Label className="btn-value">Title</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <TextValidator type="text" name="title" value={title} placeholder="Notification Title"
                    className="form-control"
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }}
                    validators={['required']}
                    errorMessages={['This field is required']} />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={2} className="text-right">
                <FormGroup>
                  <Label className="btn-value">Sound</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <select style={{ color: 'white' }} name={'noti_sound'} className={"form-control col-md-12"} onChange={(e) => {
                    setSound(e.target.value)
                  }}>
                    <option value={'swiftly.mp3'}>Swiftly</option>
                  </select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={2} className="text-right">
                <FormGroup>
                  <Label className="btn-value">Message</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <TextValidator type="textarea" name="first_team" value={message} placeholder="Notification Message"
                    className="form-control"
                    onChange={(e) => {
                      setMessage(e.target.value)
                    }}
                    validators={['required']}
                    errorMessages={['This field is required']} />
                </FormGroup>
              </Col>
            </Row>
            <Row className=''>
              <Col md={2} className="text-right ">
                <FormGroup>
                  <Label className="btn-value">Select Users</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <div className='multi_select_picker position-relative '>
                  <div className='form-group select_input'>
                    {selectedUserList?.length > 0 && selectedUserList?.map((item, i) => {
                      return (
                        <div className='giftUser' key={i}>
                          <span>{`${item?.full_name} (${item?.email}) `}
                            <small>
                              <img src="../assets/img/cross-icon.svg" alt='' onClick={() => handleRemoveSelectedUser()} />
                            </small>
                          </span>
                        </div>
                      )
                    })}
                    <input type='text' className='form-control' placeholder='search user' value={keyword} onChange={(e) => handleUserList(e)} /></div>
                  {userData?.length > 0 &&
                    <div className='choose_list'>
                      <ul>
                        {userData?.map((user, i) => {
                          return (
                            <li key={i} onClick={(e) => handleSelectedUsers(e, user)}>
                              <span>{`${user?.full_name} (${user?.email}) `}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>}
                </div>
              </Col>
            </Row>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" data-dismiss="modal">Submit{isMatchsubmit === true &&
                <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
              <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => {
                handleClose()
              }}>Close
              </button>
            </div>
          </ValidatorForm>

        </div>
      </Modal>

      <Modal className="custom-modal-lg" open={showSendMessageModal} onClose={(e) => {
        handleCloseSendMessageModel()
      }}>
        <div className="modal-header grey-1">
          <h4>Send Message</h4>
        </div>
        <div className="modal-body">
          <ValidatorForm id="updateminmax" onSubmit={() => handleSendMessage()}>
            <Row>
              <Col md={2} className="text-right">
                <FormGroup>
                  <Label className="btn-value">Message</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <TextValidator type="text" name="title" value={chatMessage} placeholder="message"
                    className="form-control"
                    onChange={(e) => {
                      handleChatMessage(e)
                    }}
                    validators={['required']}
                    errorMessages={['This field is required']} />
                </FormGroup>
              </Col>
            </Row>


            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" data-dismiss="modal">Submit</button>
              <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={() => {
                handleCloseSendMessageModel()
              }}>Close
              </button>
            </div>
          </ValidatorForm>


        </div>
      </Modal>
    </div>
  );
};

export default Notifications;
