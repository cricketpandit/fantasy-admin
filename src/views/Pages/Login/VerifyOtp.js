import React, { useState } from "react";
import useSession from "react-session-hook";
import { useForm } from "react-hook-form";
import Helper from "../../../constants/helper";
import apiUrl from "../../../constants/apiPath";
import OtpInput from 'react-otp-input';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,  
  Row,
  FormGroup,
} from "reactstrap";
import { useAlert } from "react-alert";

function parseJwtMain(token) {
  let base64UrlFor = token.split(".")[1];
  let base64Bit = base64UrlFor.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayloadMain = decodeURIComponent(
    atob(base64Bit)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayloadMain);
}

const VerifyOtp = () => {
  const alert = useAlert();
  const session = useSession();
  const { handleSubmit } = useForm();
  const [otp, setOtp] = useState('')

  const onSubmit = async (data) => {
    
    let postJson = {
      email: session?.userDetails?.email,
      password: session?.userDetails?.password,
      user_type: session?.userDetails?.user_type,
      otp: otp
    };
    let path = apiUrl.adminLogin;
    const fr = await Helper.post(postJson, path);
    const response_data = await fr.response.json();
    if (fr.status === 200) {
      if (response_data.success) {
        alert.success(response_data.msg);
        
        session.setSession({ token: response_data.token });
        session.setSession({ otpVerification: true });
        let profile = parseJwtMain(response_data.token);
        localStorage.setItem("user_type", profile.user_type);
      } else {
        alert.error(response_data.msg);
        
      }
    } else {
      alert.error(response_data.error);
      
    }
  };


  return (
    <>
      <Row className="justify-content-center">
        <Col md="6">
          <CardGroup>
            <Card className="modal-content">
              <CardBody>
                <form id="otp" onSubmit={handleSubmit(onSubmit)}>
                  <h5 className="modal-title" style={{ color: 'white' }}>Enter OTP</h5>
                  <FormGroup>
                    <OtpInput
                      inputStyle={{ margin: '5px', width: '51px', height: '54px', border: '1px solid #ccc', borderRadius: '8px', }}
                      value={otp}
                      onChange={(otps) => setOtp(otps)}
                      numInputs={4}
                    />
                  </FormGroup>

                  <Button type="submit" className="btn btn-primary" disabled={otp?.length != 4}>
                    Login
                  </Button>
                </form>
              </CardBody>
            </Card>
          </CardGroup>
        </Col>
      </Row>
    </>

  );
};
export default VerifyOtp;
