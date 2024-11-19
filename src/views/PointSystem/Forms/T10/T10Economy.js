import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const T10Economy = (props) => {
    const session = useSession();
    const alert = useAlert();
    const { register, handleSubmit, } = useForm();
    const [loading, setLoading] = useState(false);
    const [t10Data, setData] = useState({});
    const [token] = useState(session.token);

    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            t10Below7Run: data.t10Below7Run.trim(),
            t10Between7to8: data.t10Between7to8.trim(),
            t10Between8to9: data.t10Between8to9.trim(),
            t10Between14to15: data.t10Between14to15.trim(),
            t10Between15to16: data.t10Between15to16.trim(),
            t10Above16Run: data.t10Above16Run.trim()
        };

        let path = apiUrl.update_t10_economy;
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
        let path = apiUrl.get_t10_economy;
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 7 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t10Below7Run" placeholder="Below 7 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t10Below7Run} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 7-7.99 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t10Between7to8" placeholder="Between 7-7.99 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t10Between7to8} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 8-9 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t10Between8to9" placeholder="Between 8-9 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t10Between8to9} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 14-15 runs per over:</Label>
                                    <input type="number" step="0.1" name="t10Between14to15" placeholder="Between 14-15 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t10Between14to15} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 15.01-16 runs per over:</Label>
                                    <input type="number" step="0.1" name="t10Between15to16" placeholder="Between 15.01-16 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t10Between15to16} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Above 16 runs per over:</Label>
                                    <input type="number" step="0.1" name="t10Above16Run" placeholder="Above 16 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data?.t10Above16Run} ref={register({ required: 'Required' })} />
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

export default T10Economy;
