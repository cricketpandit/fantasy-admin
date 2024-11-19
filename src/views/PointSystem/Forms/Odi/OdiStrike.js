import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const OdiStrike = (props) => {
    const session = useSession();
    const alert = useAlert();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [odiData, setData] = useState({});
    const [token] = useState(session.token);

    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            odiStrikeRateAbove140: data.odiStrikeRateAbove140.trim(),
            odiStrikeRateBetween120to140: data.odiStrikeRateBetween120to140.trim(),
            odiStrikeRateBetween100to120: data.odiStrikeRateBetween100to120.trim(),
            odiStrikeRateBetween40to50: data.odiStrikeRateBetween40to50.trim(),
            odiStrikeRateBetween30to40: data.odiStrikeRateBetween30to40.trim(),
            odiStrikeRateBelow30: data.odiStrikeRateBelow30.trim(),

        };

        let path = apiUrl.update_odi_strike;
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
        let path = apiUrl.get_odi_strike;
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

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Above 140 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="odiStrikeRateAbove140" placeholder="Above 140 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData?.odiStrikeRateAbove140} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 120.01-140 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="odiStrikeRateBetween120to140" placeholder="Above 120.01-140 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData?.odiStrikeRateBetween120to140} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 100-120 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="odiStrikeRateBetween100to120" placeholder="Above 100-120 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData?.odiStrikeRateBetween100to120} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>  
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 40-50 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="odiStrikeRateBetween40to50" placeholder="Above 40-50 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData?.odiStrikeRateBetween40to50} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>  
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 30-39.9 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="odiStrikeRateBetween30to40" placeholder="Above 30-39.9 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData?.odiStrikeRateBetween30to40} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>                                  
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 30 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="odiStrikeRateBelow30" placeholder="Below 30 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData?.odiStrikeRateBelow30} ref={register({ required: 'Required' })} />
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

export default OdiStrike;