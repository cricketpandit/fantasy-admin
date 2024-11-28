import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import _ from "lodash";
const TestStrike = (props) => {
    const session = useSession();
    const alert = useAlert();
    const { register, handleSubmit,errors } = useForm();
    const [loading, setLoading] = useState(false);
    const [testData, setData] = useState({});
    const [token] = useState(session.token);
        
    const onSubmit = async data => {
        setLoading(true);      
        let postJson =  {   
                            odiStrikeGt50Runs: data.odiStrikeGt50Runs.trim(), 
                            odiStrikeGt40Runs: data.odiStrikeGt40Runs.trim(),
                            odiStrikeLt40Runs: data.odiStrikeLt40Runs.trim()
                        };        

        let path = apiUrl.update_test_strike;
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
        let path = apiUrl.get_test_strike;
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 50-60 runs per 100 balls:</Label>
                                    <input type="text" name="odiStrikeGt50Runs" placeholder="Below 50-60 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={testData.odiStrikeGt50Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 40-49.99 runs per 100 balls:</Label>
                                    <input type="text" name="odiStrikeGt40Runs" placeholder="Between 40-49.99 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={testData.odiStrikeGt40Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 40 runs per 100 balls:</Label>
                                    <input type="text" name="odiStrikeLt40Runs" placeholder="Below 40 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={testData.odiStrikeLt40Runs} ref={register({ required: 'Required' })} />
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

export default TestStrike;