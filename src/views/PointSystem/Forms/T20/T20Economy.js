import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import _ from "lodash";
const T20Economy = (props) => {
    const session = useSession();
    const alert = useAlert();
    const { register, handleSubmit,errors } = useForm();
    const [loading, setLoading] = useState(false);
    const [t10Data, setData] = useState({});
    const [token] = useState(session.token);

    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            t20EconomyLt5Runs: data.t20EconomyLt5Runs.trim(),
            t20EconomyGt5Runs: data.t20EconomyGt5Runs.trim(),
            t20EconomyGt6Runs: data.t20EconomyGt6Runs.trim(),
            t20EconomyGt10Runs: data.t20EconomyGt10Runs.trim(),
            t20EconomyGt11Runs: data.t20EconomyGt11Runs.trim(),
            t20EconomyGt12Runs: data.t20EconomyGt12Runs.trim()
        };

        let path = apiUrl.update_t20_economy;
        const fr = await Helper.post(token, postJson, path);
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
        let path = apiUrl.get_t20_economy;
        const fr = await Helper.get(token, path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setData(res.results || []);
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 5 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t20EconomyLt5Runs" placeholder="Below 5 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t20EconomyLt5Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 5-5.99 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t20EconomyGt5Runs" placeholder="Between 5-5.99 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t20EconomyGt5Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 6-7 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t20EconomyGt6Runs" placeholder="Between 6-7 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t20EconomyGt6Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 10-11 runs per over:</Label>
                                    <input type="number" step="0.1" name="t20EconomyGt10Runs" placeholder="Between 10-11 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t20EconomyGt10Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 11.1-12 runs per over:</Label>
                                    <input type="number" step="0.1" name="t20EconomyGt11Runs" placeholder="Between 11.1-12 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t20EconomyGt11Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Above 12 runs per over:</Label>
                                    <input type="number" step="0.1" name="t20EconomyGt12Runs" placeholder="Above 12 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t20EconomyGt12Runs} ref={register({ required: 'Required' })} />
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

export default T20Economy;