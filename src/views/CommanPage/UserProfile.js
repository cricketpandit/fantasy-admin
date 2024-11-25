import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '../CommanPage/TextValidator';
import useSession from "react-session-hook";

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

const UserProfile = (props) => {

    const session = useSession();
    let history = useHistory();
    const [firstName, setFirstName] = useState("");
    const [mobile, setMobile] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [token] = useState(session.token);
    const [buttonstate] = useState(false);

    const onSumbit = async e => {
        let formData = new FormData();
        let postJson = { firstName, lastName, email: email, mobile, country_code: "+91" };
        formData.append('data', JSON.stringify(postJson));
        let path = apiUrl.update_admin_profile;
        const fr = await Helper.formPost(token, formData, path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                Toast.fire({
                    type: "success",
                    title: res.msg,
                });
                props.history.push('/userprofile');
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

    const getData = async () => {
        const user_Id = session.profile._id;
        let path = apiUrl.get_admin_profile + '/?userId=' + user_Id;
        const fr = await Helper.get(token, path);
        const res = await fr.response.json();
         if (fr.status === 200) {
            if (res.success) {
                setFirstName(res.results.firstName);
              
                setLastName(res.results.lastName);
                setMobile(res.results.mobile);
                setEmail(res.results.email);
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
    ValidatorForm.addValidationRule('noSpaces', (value) => {
        if (value.trim() === '' || /\s{2,}/.test(value)) {
            return false; // Validation failed
        }
        return true; // Validation passed
    });

    useEffect(() => { getData(); }, []);

    return (
      
            <ValidatorForm onSubmit={onSumbit}>
                <Card>

                    <CardHeader className="align-items-center d-flex">
                        <CardTitle className="text-info"><h3>My Profile</h3></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup className='d-flex'>
                                    <Label className={'col-md-2 pull-left mt-2'}>Full Name</Label>
                                    <div className='col-md-8 p-0'>
                                        <TextValidator type="text" name="fname" placeholder="Frist Name" className="form-control "
                                            onChange={(e) => { setFirstName(e.target.value) }}
                                            value={firstName}
                                            validators={['required', 'noSpaces']}
                                            errorMessages={['This field is required', 'This field is required']} />
                                    </div>
                                </FormGroup>
                            </Col>
                        
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Last Name</Label>
                                    <TextValidator type="text" name="lastName" className="form-control col-md-8" disabled placeholder="Last Name"
                                        onChange={(e) => { setLastName(e.target.value) }}
                                        value={lastName}
                                        validators={['required']}
                                        errorMessages={['This field is required']}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Email</Label>
                                    <TextValidator type="text" name="email" className="form-control col-md-8" disabled placeholder="Email"
                                        value={email}
                                        validators={['required', 'isEmail']}
                                        errorMessages={['This field is required', 'email is not valid']}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Mobile Number</Label>
                                    <TextValidator type="text" name="phone" className="form-control col-md-8" maxLength="10" placeholder="Phone Number"
                                        value={mobile || ''}
                                        onChange={(e) => { setMobile(e.target.value) }}
                                        validators={['required', 'isNumber', 'minStringLength:8']}
                                        errorMessages={['This field is required', 'Only number are allowed', 'Invalid mobile number']} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
                        <Button disabled={buttonstate} className={'ml-2'} type="submit" color="primary">Submit <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i></Button>
                    </CardFooter>
                </Card>
            </ValidatorForm>
       
    );
};

export default UserProfile;
