import React, {  useRef, useState } from "react";
import useSession from "react-session-hook";
import { Redirect } from "react-router-dom";
import { ErrorMessage, useForm } from "react-hook-form";
import Helper from "../../../constants/helper";
import apiUrl from "../../../constants/apiPath";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Row,
  FormGroup
} from "reactstrap";
import Loader from "../../CommanPage/Loader";
import { useAlert } from "react-alert";
import _ from "lodash";
  
 

const AdminResetPassword = (props) => { 
  const alert = useAlert();

  const [visible, setVisibale] = useState(false);
  const { register, handleSubmit, errors, watch, setValue ,reset} =
    useForm();
  const [passwordEye, setPasswordEye] = useState({
    password: false, confirmPassword: false,
  })

  const handlePasswordEye = (key) => {
    setPasswordEye({
      ...passwordEye,
      [key]: !passwordEye[key]
    })
  }

  const newPassword = useRef({});
    newPassword.current = watch("newpassword", "");
  const onSubmit = async (data) => {
    setVisibale(true)
    let path = apiUrl.adminResetPassword+"/"+props.match.params.id;
    let postJson = {
      password: data?.newpassword,
      
    };
    const fr = await Helper.post("", postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        alert.success(res.msg);
        props.history.push("/login")
        reset()
      } else {
        reset()
        alert.error(res.msg);
      }
    } else {
      alert.error(res.msg);
      reset()
    }
    setVisibale(false)

  };
 

  return (
    <div className="app flex-row align-items-center justify-content-center flex-column loginmodal">
      <Loader className="overlay-loader" visible={visible} />
      {/* <img
        src={appLogo}
        alt=""
        className="mb-md-5 mb-4"
      /> */}
      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <CardGroup>
              <Card className="bg-white p-4">
                <CardBody>
                  <form id="login" onSubmit={handleSubmit(onSubmit)}>
                    <h5 className="modal-title text-dark" id='welcome'>Reset Password</h5>
                    <FormGroup>
                      <input
                       type={passwordEye?.password ? 'text':"password"}
                         name={"newpassword"}
                        className="custom-formcontrol form-control text-dark"
                        placeholder={"New Password"}
                        ref={register({
                          required: "New password is required",
                          validate: (value) => {
                            let paswd =
                              /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
                            if (!value.match(paswd)) {
                              return "Password must have minimum 8 character with 1 lowercase 1 uppercase 1 digit and 1 special character.";
                            }
                          },
                        })}
                      />
                              {passwordEye?.password ?
                      <span className="passwordFix cursor-pointer" onClick={() => handlePasswordEye('password')}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ddd" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                        </svg>
                      </span>
                      :
                      <span className="passwordFix cursor-pointer" onClick={() => handlePasswordEye('password')}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ddd" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
                          <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
                          <path d="M3 3l18 18" />
                        </svg>
                      </span>
                    }
                      {errors.newpassword && (
                        <p className="marginmessage reset-password-password">
                          {errors?.newpassword?.message}
                        </p>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <input
                         type={passwordEye?.confirmPassword ? 'text':"password"}
                         name={"c_newpassword"}
                        className="custom-formcontrol form-control text-dark"
                        placeholder={"Confirm Password"}
                      ref={register({
                        required: "Confirm password is required",
                        validate: (value) => {
                          if (value !== newPassword.current)
                            return "Password should match confirm password.";
                        },
                      })}
                      />
                        {passwordEye?.confirmPassword ?
                      <span className="passwordFix cursor-pointer" onClick={() => handlePasswordEye('confirmPassword')}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ddd" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                        </svg>
                      </span>
                      :
                      <span className="passwordFix cursor-pointer" onClick={() => handlePasswordEye('confirmPassword')}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ddd" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
                          <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
                          <path d="M3 3l18 18" />
                        </svg>
                      </span>
                    }

{errors.c_newpassword && (
                        <p className="text-danger marginmessage">
                          {errors?.c_newpassword?.message}
                        </p>
                      )}
                    </FormGroup>
          
                    <Button type="submit" className="btn btn-primary rounded-pill m-0 bg-primary w-100 text-white">
                      Update
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default AdminResetPassword;
