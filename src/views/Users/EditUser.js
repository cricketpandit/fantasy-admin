import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const EditUser = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors } = useForm();

    const [token] = useState(session.token);
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);
    const [profilePic, setProfilePic] = useState('');
    const [preview, setProfilePicPreview] = useState('');
    const [UserData, setData] = useState({});
    const [gender] = useState('male');

   
    const onSubmit = async data => {
        
        setLoading(true);
        let formData = new FormData();
        let postJson = { id: id, gender: gender, full_name: data.full_name.trim(), email: data.email, username: _.snakeCase(data.username),referralCommission:data?.referralCommission };
        formData.append('data', JSON.stringify(postJson));
        formData.append('profile_pic', profilePic);
        let path = apiUrl.update_user;
        const fr = await Helper.formPost(token,formData, path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setLoading(false);
                props.history.push('/users');
                alert.success(res.msg);
            } else {
                alert.error(res.msg);
                setLoading(false);
            }
        } else {
            alert.error(res.error);
            setLoading(false);
        }
    };
    const getData = async () => {
        let path = apiUrl.get_user + '/' + `${props.match.params.id}`;
        const fr = await Helper.get(token,path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setId(res.results.id);
                setProfilePicPreview(res.results.image);
                setData(res.results);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };
    const onImageChange = (event) => {
        let type = event.target.files[0]?.type.split('/')
        if (type[0] === 'image') {
            if (event.target.files && event.target.files[0]) {
                setProfilePicPreview(URL.createObjectURL(event.target.files[0]));
                setProfilePic(event.target.files[0]);
            }
        } else {
            alert.error('Only jpg, .jpeg and png image are allowed');
            let myImage = document.getElementById("subAdminImage");
            myImage.value = ""
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-info"><h4>Edit User</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Full Name</Label>
                                    <input type="text" minLength={"3"} maxLength={"50"} name="full_name" placeholder="Full Name" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={UserData.full_name} ref={register({ required: 'Required', pattern: /^[a-z\-_\s]+$/i })} />
                                    {errors.full_name && <p className="text-danger marginmessage">Full Name is required and should be alphabatic only</p>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>User Name</Label>
                                    <input type="text" disabled name="username" id={"username"} defaultValue={UserData.username} className="form-control col-md-8" autoComplete="off" placeholder="User Name"
                                        ref={register({ required: 'Username Required' })} />
                                    <ErrorMessage errors={errors} name="username">
                                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                                    </ErrorMessage>
                                </FormGroup>
                            </Col>
                            
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Email</Label>
                                    <input type="text" disabled name="email" className="form-control  col-md-8" defaultValue={UserData.email} placeholder="Email"
                                        ref={register({
                                            required: 'Phone is Required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "invalid email address"
                                            }
                                        })} />
                                    <ErrorMessage errors={errors} name="email">
                                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                                    </ErrorMessage>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Referral Commission</Label>
                                    <input type="number"  name="referralCommission" placeholder="Referral Commission" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={UserData?.referralCommission} 
                                        ref={register({ pattern: {
                                            value: /^[0-9]{1,2}$/,message: "Please enter valid referral commission."
                                          } })} 
                                           />
                                            <ErrorMessage errors={errors} name="referralCommission">
                                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                                    </ErrorMessage>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Profile Pic</Label>
                                    <input id='subAdminImage' type="file" onChange={onImageChange} name="profile_pic" className="form-control  col-md-8" autoComplete="off" placeholder="Pic" />
                                    <ErrorMessage errors={errors} name="profile_pic">
                                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                                    </ErrorMessage>
                                    {preview && <img alt="Profile" id="target" className={'mt-3 rounded'} height={200} src={preview} />}      
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
                        <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
                    </CardFooter>
                </Card>
            </form>
        </React.Fragment>
    );
}

export default EditUser;
