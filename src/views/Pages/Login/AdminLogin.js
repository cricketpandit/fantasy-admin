import React, {  useState } from "react";
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
import appLogo from "../../../assets/img/logo/login-logo.png";


function parseJwt(token) {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const AdminLogin = (props) => {
  const alert = useAlert();

  const [visible, setVisibale] = useState(false);
  const session = useSession();
  const { register, handleSubmit, errors } = useForm();
 
  const onSubmit = async (data) => {
    setVisibale(true);
    let postJson = {
      email: data.username,
      password: data.password,
      user_type: "admin",
    };
    let path = apiUrl.adminLogin;
    const fr = await Helper.post("",postJson, path);
     const response_data = await fr.response.json();
    if (fr.status === 200) {
      if (response_data.success) {
        alert.success(response_data.msg);
        setVisibale(false);
        // login without otp
        session.setSession({ token: response_data.token });
        session.setSession({ userDetails: postJson, otpVerification: false });
        let profile = parseJwt(response_data.token);
        localStorage.setItem("user_type", profile.user_type);
        // login with otp
      } else {
        alert.error(response_data.msg);
        setVisibale(false);
      }
    } else {
      alert.error(response_data.error);
      setVisibale(false);
    }
  };

  if (session.isAuthenticated && session.profile.user_type == "admin") {
    return <Redirect to="/fantasy-dashboard" />;
  }

  if (localStorage.getItem("user_inactive") === "inactive" && session?.profile?.user_type == "editor") {
    session.removeSession();
    localStorage.clear();
    alert.success("Successfully Logout");
    document.cookie =
      "token" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }


  if (session.isAuthenticated && session.profile.user_type == "editor") {
    let getLocalArr = [];
    let getPer = session.profile.permissions;
    if (!_.isEmpty(getPer)) {
      getPer.map((item, key) => {
        getLocalArr.push(item.label);
      });
    }
    localStorage.setItem("modules", getLocalArr);
    if (localStorage.getItem("switchItem") == "fantasy") {
      return <Redirect to="/fantasy-dashboards" />;
    } else {
      return (
        <Redirect to="/fantasy-dashboards" />
      );
    }
  }

  return (
    <div className="app flex-row align-items-center justify-content-center flex-column loginmodal">
      <Loader className="overlay-loader" visible={visible} />
      <img
        src={appLogo}
        alt=""
        className="mb-md-5 mb-4"
      />
      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <CardGroup>
              <Card className="bg-white p-4">
                <CardBody>
                  <form id="login" onSubmit={handleSubmit(onSubmit)}>
                    <h5 className="modal-title text-dark" id='welcome'>Welcome Admin !!</h5>
                    <FormGroup>
                      <input
                        type="text"
                        name="username"
                        className="custom-formcontrol form-control text-dark"
                        placeholder="Enter Email"
                        errors={errors}
                        onKeyDown={(e) => {
                         
                          if (e.key == " ") {
                            e.returnValue = false;
                            return false;
                          }
                        }}
                        ref={register({

                          required: 'Email is Required', pattern: {
                            value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                            message: "invalid email address",
                          },
                        })}
                      />
                      {errors.username && (
                        <p className="text-danger marginmessage">
                          {errors?.username?.message}
                        </p>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="password"
                        name="password"
                        className="custom-formcontrol form-control text-dark"
                        placeholder="Enter Password"
                        ref={register({
                          required: "Password is Required",
                          validate: (value) => {
                            let paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/;
                            if (!value.match(paswd)) {
                              return 'Password must have minimum 8 character with 1 digit and 1 special character.';
                            }
                          }
                        })}
                      />
                      <ErrorMessage errors={errors} name="password">
                        {({ message }) => (
                          <p className={"text-danger position-relative"}>{message}</p>
                        )}
                      </ErrorMessage>
                    </FormGroup>
                    <div className="text-primary custom-pointer float-right"  style={{ marginBottom: '1rem' }} onClick={()=>props.history.push("/forgot-password")}>
                    Forgot Password ?
                    </div>
                    <Button type="submit" className="btn btn-primary rounded-pill m-0 bg-primary w-100 text-white">
                      Login
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
export default AdminLogin;
