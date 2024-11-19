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
 
 

const AdminForgotPassword = () => {
  const alert = useAlert();

  const [visible, setVisibale] = useState(false);
   const { register, handleSubmit, errors,reset } = useForm();
 
  const onSubmit = async (data) => {
    setVisibale(true);
    let postJson = {
      email: data.username,
      user_type: "admin",
    };
    let path = apiUrl.adminForgotPassword;
    const fr = await Helper.post("",postJson, path);
     const response_data = await fr.response.json();
    if (fr.status === 200) {
      if (response_data.success) {
        alert.success(response_data.msg);

        // login with otp
      } else {
        alert.error(response_data.msg);
        setVisibale(false);
      }
    } else {
      alert.error(response_data.error);
      setVisibale(false);
    }
    reset()
    setVisibale(false);
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
                    <h5 className="modal-title text-dark" id='welcome'>Forgot Password</h5>
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
export default AdminForgotPassword;
