import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import {Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Row, Col} from 'reactstrap';
import {useAlert} from 'react-alert';
import useSession from 'react-session-hook';
import {ErrorMessage, useForm} from "react-hook-form";

const ChangePassword = (props) => {

  const {register, handleSubmit, errors, watch, setError} = useForm();
  const password = watch("password");
  const confirm_password = watch("confirm_password");
  const session = useSession();
  const token = session.token;
  const alert = useAlert();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({});

  const onSubmit = async data => {
    if(password !== confirm_password) {
      setError("confirm_password", "notMatch", "Password should match confirm password."); return ;
    }
    setLoading(true);
    let id = item.id;
    let postJson = { new_password: data.password, user_type: 'editor' };
    let path = apiUrl.change_Password_by_admin + '/' + `${id}`;
    const fr = await Helper.put(token,postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        alert.success(res.msg);
        setModal(false);
        props.refreshData();
      } else {
        alert.error(res.msg)
      }
    } else {
      alert.error(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
      setItem(props.item);
  }, [props.item]);

  return (
    <div className={"inline-btn"}>
      <button className="btn circle_btn btn-sm mr-1" type="button" title="Change Password" onClick={(e) => { setModal(true);}}>P</button>
      <Modal isOpen={modal} toggle={e => {setModal(false)}} className={"custom-modal"}>
        <ModalHeader toggle={e => {setModal(false)}}>Change Password</ModalHeader>
        <form id="depositform" onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label className="btn-value">New Password</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <input type="password" name={"password"} className="form-control" id={"current_balance"} placeholder={"New Password"}
                    ref={register({
                      required: 'Password is required',
                      validate: (value) => {
                        let paswd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
                        if (!value.match(paswd)) {
                          return 'Password must have minimum 8 character with 1 lowercase 1 uppercase 1 digit and 1 special character.';
                        }
                      }
                    })}
                  />
                  <ErrorMessage errors={errors} name="password">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label className="btn-value">Confirm Password</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <input type="password" name="confirm_password" maxLength="10" className="form-control" placeholder="Confirm Password" ref={register({required: 'Confirm Password is required'})}/>
                  <ErrorMessage errors={errors} name="confirm_password">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
            <button type="submit" className="btn btn-primary" data-dismiss="modal">
              {
                loading ? <i className="fa fa fa-refresh fa-spin"></i> : null
              }
              &nbsp;Submit</button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}

export default ChangePassword;
