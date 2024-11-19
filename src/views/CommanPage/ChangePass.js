import React, { useState, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import Helper from "../../constants/helper";
import apiUrl from "../../constants/apiPath";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  FormGroup,
  Label,
  Col,
  Row,
} from "reactstrap";
import useSession from "react-session-hook";
import { ErrorMessage, useForm } from "react-hook-form";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

const ChangePass = (props) => {
  const { register, handleSubmit, errors, watch, setValue } =
    useForm();
  const [passwordEye, setPasswordEye] = useState({
    old: false, password: false, confirmPassword: false,
  })

  const handlePasswordEye = (key) => {
    setPasswordEye({
      ...passwordEye,
      [key]: !passwordEye[key]
    })
  }
  const newPassword = useRef({});
  newPassword.current = watch("newpassword", "");
  const session = useSession();
  const [token] = useState(session.token);

  const onSubmit = async (data) => {
    let path = apiUrl.change_admin_password;
    let postJson = {
      newPassword: data?.newpassword,
      oldPassword: data?.oldpassword,
    };
    const fr = await Helper.put(token, postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        Toast.fire({
          type: "success",
          title: res.msg,
        });
        setValue("oldpassword", "");
        setValue("newpassword", "");
        setValue("c_newpassword", "");
      } else {
        Toast.fire({
          type: "error",
          title: res.msg,
        });
      }
    } else {
      Toast.fire({
        type: "error",
        title: res.error,
      });
    }
  };
  return (
 
      <Card>
        <CardHeader>
          Change Password
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label>Old Password</Label>

                  <div className="position-relative">
                    <input
                   type={passwordEye?.old ? 'text':"password"}
                      name={"oldpassword"}
                      className="form-control"
                      id={"current_balance"}
                      placeholder={"Old Password"}
                      ref={register({
                        required: "Old password is required",
                      })}
                    />
                    {passwordEye?.old ?
                      <span className="passwordFix cursor-pointer" onClick={() => handlePasswordEye('old')}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ddd" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                        </svg>
                      </span>
                      :
                      <span className="passwordFix cursor-pointer" onClick={() => handlePasswordEye('old')}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ddd" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
                          <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
                          <path d="M3 3l18 18" />
                        </svg>
                      </span>
                    }

                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="oldpassword"
                    style={{ color: "red" }}
                  >
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>New Password</Label>
                  <div className="position-relative">
                    <input
                      type={passwordEye?.password ? 'text':"password"}
                      name={"newpassword"}
                      className="form-control"
                      id={"current_balance"}
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
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="newpassword"
                    style={{ color: "red" }}
                  >
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Confirm Password</Label>
                  <div className="position-relative">
                    <input
                      type={passwordEye?.confirmPassword ? 'text':"password"}
                      name={"c_newpassword"}
                      className="form-control"
                      id={"current_balance"}
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
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="c_newpassword"
                    style={{ color: "red" }}
                  >
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
 
  );
};

export default ChangePass;
