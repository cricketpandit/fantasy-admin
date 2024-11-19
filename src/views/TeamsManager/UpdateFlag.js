import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory, Redirect } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import _, { isElement, isEmpty } from "lodash";
import axios from 'axios';

const UpdateFlag = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors } = useForm();
    const [token] = useState(session.token);
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);

    const [team_flag, setTeamFlag] = useState('');
    const [preview, setTeamFlagPreview] = useState('');
    const [team_jersey, setTeamJersey] = useState('');
    const [jersey_preview, setTeamJerseyPreview] = useState('');
    const [should_redirect, setRedirect] = useState(false);
    const [presignedKey, setPresignedKey] = useState('');
    const [presignedUrl, setPresignedUrl] = useState('');
    const [presignedJerseyKey, setPresignedJersyKey] = useState('');
    const [presignedJerseyUrl, setPresignedJerseyUrl] = useState('');

    const [SeriesData, setData] = useState({});

    const onSubmit = async data => {
        if (preview === '') {
            return true
        }

        let teamFlagImageUploaded = false
        let teamJerseyImageUploaded = false
        
        const teamReader = new FileReader();
        if(team_flag){
            teamReader.readAsArrayBuffer(team_flag);
        }
        teamReader.onloadend = async () => {
            const binaryData = teamReader.result;
            const resp = await axios.put(presignedUrl, binaryData, {
                headers: {
                    "Content-Type": "application/octet-stream",
                },
            });
            if (resp?.status === 200) {
                teamFlagImageUploaded = true
            }
        }
        const jerseyReader = new FileReader();
        if(team_jersey){
        jerseyReader.readAsArrayBuffer(team_jersey);
        }
        jerseyReader.onloadend = async () => {
            const binaryJerseyData = jerseyReader.result;
            const respJersey = await axios.put(presignedJerseyUrl, binaryJerseyData, {
                headers: {
                    "Content-Type": "application/octet-stream",
                },
            });
            if (respJersey?.status === 200) {                        
                teamJerseyImageUploaded = true
            }
        }
        if((teamFlagImageUploaded || preview) && (teamJerseyImageUploaded || jersey_preview)){
            teamFlagImageUploaded = false
            teamJerseyImageUploaded = false
            let postJson = { 
                id: id, 
                team_short_name: data.team_short_name.trim(),
                flag:presignedKey,
                team_jersey:presignedJerseyKey
            };
            let path = apiUrl.update_flag;
            const fr = await Helper.post(token, postJson, path);
            const res = await fr.response.json();
            if (fr.status === 200) {
                if (res.success) {
                    setLoading(false);
                    setRedirect(true);
                    props.history.push('/cricket/mst-teams');
                    alert.success(res.msg);
                } else {
                    alert.error(res.msg);
                    setLoading(false);
                }
            } else {
                alert.error(res.error);
                setLoading(false);
            }
        }
    };
    const getData = async () => {
        let path = apiUrl.get_single_team_data + '/' + props.match.params.id;
        const fr = await Helper.get(token, path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setId(props.match.params.id);
                setTeamFlagPreview(!res.results.flag?.includes("NoImageAvailable.png") ? res.results.flag : "");
                setTeamJerseyPreview(!res.results.team_jersey?.includes("NoImageAvailable.png") ? res.results.team_jersey : "");
                setData(res.results);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };

    const onImageChange = async (event) => {
        let type = event.target.files[0]?.type.split('/')
        const file = event.target.files[0];
        if(type?.length){
            if (type[0] === 'image') {
                if (event.target.files && event.target.files[0]) {
                    setTeamFlagPreview(URL.createObjectURL(event.target.files[0]));
                    setTeamFlag(event.target.files[0]);
    
    
                    setLoading(true);
                    let postJson = {
                        contentType: file.type
                    };
                    let path = apiUrl.generate_team_pre_signed_url;
                    const fr = await Helper.post(token, postJson, path);
                    const res = await fr.response.json();
                    if (fr.status === 200) {
                        if (res.success) {
                            setLoading(false);
                            setPresignedUrl(res.results.url)
                            setPresignedKey(res.results.key)
                        } else {
                            alert.error(res.msg);
                            setLoading(false);
                        }
                    } else {
                        alert.error(res.error);
                        setLoading(false);
                    }
                }
            } else {
                alert.error('Only jpg, .jpeg and png image are allowed');
                let myImage = document.getElementById("subAdminImage");
                myImage.value = "";
            }
        }
    }
    const onJerseyImageChange = async (event) => {
        let type = event.target.files[0]?.type.split('/')
        const file = event.target.files[0];
        if(type?.length){
            if (type[0] === 'image') {
                if (event.target.files && event.target.files[0]) {
                    setTeamJerseyPreview(URL.createObjectURL(event.target.files[0]));
                    setTeamJersey(event.target.files[0]);
    
                    let postJson = {
                        contentType: file.type
                    };
                    let path = apiUrl.generate_team_pre_signed_url;
                    const fr = await Helper.post(token, postJson, path);
                    const res = await fr.response.json();
                    if (fr.status === 200) {
                        if (res.success) {
                            setLoading(false);
                            setPresignedJerseyUrl(res.results.url)
                            setPresignedJersyKey(res.results.key)
                        } else {
                            alert.error(res.msg);
                            setLoading(false);
                        }
                    } else {
                        alert.error(res.error);
                        setLoading(false);
                    }
                }
            } else {
                alert.error('Only jpg, .jpeg and png image are allowed');
                let myImage = document.getElementById("team_jersey");
                myImage.value = "";
            }
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if (should_redirect) {
        return <Redirect to="/mst-teams" />
    }
    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-info"><h4>Update Flag</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup className='row'>
                                    <Label className={'col-md-2 pull-left mt-2'}>Team Flag</Label>
                                    <div className='input_grp  col-md-8'>
                                        <input id='subAdminImage' type="file" onChange={onImageChange} name="team_flag" className="form-control  col-md-8" autoComplete="off" placeholder="Pic" ref={register({ required: !preview ? true : false })} />
                                        {/* {preview == '' && <p className="text-danger marginmessage">team flag image is required</p>} */}
                                        <img id="target" className={'mt-3 rounded'} src={preview} height={'auto'} width={150} />
                                        {(errors.team_flag && !preview)  && <p className="text-danger marginmessage">Please select team flag</p>}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup className='row'>
                                    <Label className={'col-md-2 pull-left mt-2'}>Team Jersey</Label>
                                    <div className='input_grp  col-md-8'>
                                        <input id='team_jersey' type="file" onChange={onJerseyImageChange} name="team_jersey" className="form-control  col-md-8" autoComplete="off" placeholder="Pic" ref={register({ required: !jersey_preview ? true : false })}/>
                                        <img id="jersey_preview" className={'mt-3 rounded'} src={jersey_preview} height={'auto'} width={150} />
                                        {(errors.team_jersey && !jersey_preview)  && <p className="text-danger marginmessage">Please select team jersey</p>}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup className='row'>
                                    <Label className={'col-md-2 pull-left mt-2'}>Short Name</Label>
                                    <div className='input_grp  col-md-8'>
                                        <input type="text" name="team_short_name" placeholder="Short Name" autoComplete="off"
                                            className="form-control" defaultValue={SeriesData.team_short_name} ref={register({ required: 'Required' })} />
                                        {errors.team_short_name && <p className="text-danger marginmessage">Short Name is required</p>}
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
                        <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
                    </CardFooter>
                </Card>
            </form>
        </React.Fragment>
    );
}

export default UpdateFlag;