import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import _ from "lodash";

const OdiBowling = (props) => {
    const session = useSession();
    const alert = useAlert();
    const { register, handleSubmit, errors } = useForm();
    const [loading, setLoading] = useState(false);
    const [odiData, setData] = useState({});
    const [token] = useState(session.token);


    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            bowlingWicket: data.bowlingWicket.trim(),
            bowling4Wicket: data.bowling4Wicket.trim(),
            bowling5Wicket: data.bowling5Wicket.trim(),
            bowlingMaiden: data.bowlingMaiden.trim(),
            odiLbwOrBowled: data.odiLbwOrBowled.trim()

        };

        let path = apiUrl.update_odi_bowling;
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
        let path = apiUrl.get_odi_bowling;
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Wicket:<br></br>
                                        <small>Excluding Run Out</small></Label>
                                    <input type="number" min={0} step="0.1" name="bowlingWicket" placeholder="Wicket" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.bowlingWicket} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>4 wicket haul Bonus:</Label>
                                    <input type="number" min={0} step="0.1" name="bowling4Wicket" placeholder="4 wicket haul Bonus" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.bowling4Wicket} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>5 wicket haul Bonus:</Label>
                                    <input type="number" min={0} step="0.1" name="bowling5Wicket" placeholder="5 wicket haul Bonus" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.bowling5Wicket} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Maiden over:</Label>
                                    <input type="number" min={0} step="0.1" name="bowlingMaiden" placeholder="Maiden over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.bowlingMaiden} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Wicket (LBW/bowled):</Label>
                                    <input type="number" min={0} step="0.1" name="odiLbwOrBowled" placeholder="LBW/bowled Bonus" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData?.odiLbwOrBowled} ref={register({ required: 'Required' })} />
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

export default OdiBowling;