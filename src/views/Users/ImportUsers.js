import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const ImportUsers = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors } = useForm();

    const [token] = useState(session.token);
    const [loading, setLoading] = useState(false);
    const [profilePic, setExcelFile] = useState('');

    const onSubmit = async data => {
        setLoading(true);
        let postJson = {           
        };      
        let formData = new FormData();
        formData.append('data', JSON.stringify(postJson));
        formData.append('excel_file', profilePic);
        let path = apiUrl.import_users;
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

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setExcelFile(event.target.files[0]);
        }
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-info"><h4>Import Users</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>User Excel File</Label>
                                    <input type="file" name="excel_file" placeholder="User Media" onChange={onImageChange} autoComplete="off"
                                        className="form-control col-md-6" ref={register({ required: 'Required' })} />
                                    {errors.excel_file && <p className="text-danger marginmessage">Excel File is required</p>}
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
                        <Button className={'ml-2'} type="submit" color="primary">Upload {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
                    </CardFooter>
                </Card>
            </form>
        </React.Fragment>
    );
}

export default ImportUsers;
