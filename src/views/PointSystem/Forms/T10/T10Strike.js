import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import _ from "lodash";

const T10Strike = (props) => {
    const session = useSession();
    const alert = useAlert();
    const { register, handleSubmit, errors } = useForm();
    const [loading, setLoading] = useState(false);
    const [t10Data, setData] = useState({});
    const [token] = useState(session.token);


    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            t10StrikeRate190: data.t10StrikeRate190.trim(),
            t10StrikeRateBetween170to190: data.t10StrikeRateBetween170to190.trim(),
            t10StrikeRateBetween150to170: data.t10StrikeRateBetween150to170.trim(),
            t10StrikeRateBetween70to80: data.t10StrikeRateBetween70to80.trim(),
            t10StrikeRateBetween60to70: data.t10StrikeRateBetween60to70.trim(),
            t10StrikeRateBelow60: data.t10StrikeRateBelow60.trim()

        };

        let path = apiUrl.update_t10_strike;
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
        let path = apiUrl.get_t10_strike;
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Above 190 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t10StrikeRate190" placeholder="Above 190 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10StrikeRate190} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 170.01 - 190 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t10StrikeRateBetween170to190" placeholder="Between 170.01 - 190 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10StrikeRateBetween170to190} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 150 - 170 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t10StrikeRateBetween150to170" placeholder="Between 150 - 170 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10StrikeRateBetween150to170} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 70 - 80 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t10StrikeRateBetween70to80" placeholder="Between 70 - 80 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10StrikeRateBetween70to80} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 60 - 69.99 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t10StrikeRateBetween60to70" placeholder="Between 60 - 69.99 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10StrikeRateBetween60to70} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 60 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t10StrikeRateBelow60" placeholder="Below 60 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10StrikeRateBelow60} ref={register({ required: 'Required' })} />
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

export default T10Strike;
