import React, { useState, useEffect } from 'react';
import {  useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import _ from "lodash";
const TestEconomy = (props) => {
    const session = useSession();
    const alert = useAlert();
    const { register, handleSubmit,errors } = useForm();
    const [loading, setLoading] = useState(false);
    const [testData, setData] = useState({});
    const [token] = useState(session.token);
        
    const onSubmit = async data => {
        setLoading(true);      
        let postJson =  {   
                            odiEconomyLt2_5Runs: data.odiEconomyLt2_5Runs.trim(), 
                            odiEconomyGt2_5Runs: data.odiEconomyGt2_5Runs.trim(),
                            odiEconomyGt3_5Runs: data.odiEconomyGt3_5Runs.trim(),
                            odiEconomyGt5Runs: data.odiEconomyGt5Runs.trim(),
                            odiEconomyGt8Runs: data.odiEconomyGt8Runs.trim(),
                            odiEconomyGt9Runs: data.odiEconomyGt9Runs.trim()
                        };        

        let path = apiUrl.update_test_economy;
        const fr = await Helper.post(token,postJson,path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setLoading(false);
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
        let path = apiUrl.get_test_economy;
        const fr = await Helper.get(token,path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setData(res.results||[]);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };

    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        if (!_.isEmpty(errors)) {
            alert.error('Please make sure to enter values in all fields');
        }
    }, [errors]);
    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 2.5 runs per over:</Label>
                                    <input type="text" name="odiEconomyLt2_5Runs" placeholder="Below 2.5 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={testData.odiEconomyLt2_5Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 2.5-3.49 runs per over:</Label>
                                    <input type="text" name="odiEconomyGt2_5Runs" placeholder="Between 2.5-3.49 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={testData.odiEconomyGt2_5Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 3.5-4.5 runs per over:</Label>
                                    <input type="text" name="odiEconomyGt3_5Runs" placeholder="Between 3.5-4.5 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={testData.odiEconomyGt3_5Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 7-8 runs per over:</Label>
                                    <input type="text" name="odiEconomyGt5Runs" placeholder="Between 7-8 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={testData.odiEconomyGt5Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 8.1-9 runs per over:</Label>
                                    <input type="text" name="odiEconomyGt8Runs" placeholder="Between 8.1-9 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={testData.odiEconomyGt8Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Above 9 runs per over:</Label>
                                    <input type="text" name="odiEconomyGt9Runs" placeholder="Above 9 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={testData.odiEconomyGt9Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>

                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
                    </CardFooter>
                </Card>
            </form>
        </React.Fragment>
    );
}

export default TestEconomy;