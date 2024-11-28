import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import _ from "lodash";
const T20Batting = (props) => {
    const session = useSession();
    const alert = useAlert();
    const { register, handleSubmit,errors } = useForm();
    const [loading, setLoading] = useState(false);
    const [t20Data, setData] = useState({});
    const [token] = useState(session.token);


    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            battingRun: data.battingRun.trim(),
            battingBoundary: data.battingBoundary.trim(),
            battingSix: data.battingSix.trim(),
            battingHalfCentury: data.battingHalfCentury.trim(),
            battingCentury: data.battingCentury.trim(),
            battingDuck: data.battingDuck.trim(),
            t20ThirtyRunBonus: data.t20ThirtyRunBonus.trim()

        };

        let path = apiUrl.update_t20_batting;
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
        let path = apiUrl.get_t20_batting;
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Run</Label>
                                    <input type="number" min={0} step="0.1" name="battingRun" placeholder="Run" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t20Data.battingRun} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Boundary Bonus:</Label>
                                    <input type="number" min={0} step="0.1" name="battingBoundary" placeholder="Boundary Bonus" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t20Data.battingBoundary} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Six Bonus:</Label>
                                    <input type="number" min={0} step="0.1" name="battingSix" placeholder="Six Bonus" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t20Data.battingSix} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>30 Run Bonus:</Label>
                                    <input type="number" min={0} step="0.1" name="t20ThirtyRunBonus" placeholder="30 run Bonus" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t20Data.t20ThirtyRunBonus} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Half-century Bonus:</Label>
                                    <input type="number" min={0} step="0.1" name="battingHalfCentury" placeholder="Half-century Bonus" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t20Data.battingHalfCentury} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Century Bonus:</Label>
                                    <input type="number" min={0} step="0.1" name="battingCentury" placeholder="Century Bonus" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t20Data.battingCentury} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Dismissal for a duck:<br></br>
                                        <small>Batsman, Wicket-Keeper & All-Rounder</small></Label>
                                    <input type="number" step="0.1" name="battingDuck" placeholder="Dismissal for a duck" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t20Data.battingDuck} ref={register({ required: 'Required' })} />
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

export default T20Batting;
