import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const T20Strike = (props) => {
    const session = useSession();
    const alert = useAlert();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [t10Data, setData] = useState({});
    const [token] = useState(session.token);

    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            t20StrikeRateBelow50: data.t20StrikeRateBelow50.trim(),
            t20StrikeRateBetween50to60: data.t20StrikeRateBetween50to60.trim(),
            t20StrikeRateBetween60to70: data.t20StrikeRateBetween60to70.trim(),
            t20StrikeRateBetween130to150: data.t20StrikeRateBetween130to150.trim(),
            t20StrikeRateBetween150to170: data.t20StrikeRateBetween150to170.trim(),
            t20StrikeRateAbove170: data.t20StrikeRateAbove170.trim()
        };

        let path = apiUrl.update_t20_strike;
        const fr = await Helper.post(token,postJson, path);
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
        let path = apiUrl.get_t20_strike;
        const fr = await Helper.get(token,path);
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
    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Above 170 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeRateAbove170" placeholder="Above 170 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeRateAbove170} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 150.1-170 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeRateBetween150to170" placeholder="Between 150.1-170 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeRateBetween150to170} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 130-150 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeRateBetween130to150" placeholder="Between 130-150 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeRateBetween130to150} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 60-70 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeRateBetween60to70" placeholder="Between 60-70 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeRateBetween60to70} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 50-59.99 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeRateBetween50to60" placeholder="Between 50-59.99 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeRateBetween50to60} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 50 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeRateBelow50" placeholder="Below 50 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeRateBelow50} ref={register({ required: 'Required' })} />
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

export default T20Strike;