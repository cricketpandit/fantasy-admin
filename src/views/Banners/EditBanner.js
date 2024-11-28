import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

import Swal from 'sweetalert2';
import axios from 'axios';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

const EditBanner = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [link, setLink] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [series_id, setSeriesId] = useState('');
  const [offer_id, setOfferId] = useState('');
  const [match_id, setMatchId] = useState('');
  const [dropdown, setDropdown] = useState([]);
  const [match_dropdown, setMatchDropdown] = useState([]);
  const [offer_dropdown, setOfferDropdown] = useState([]);
  const [show_series_match, setShowSeriesMatch] = useState(false);
  const [show_offer, setShowOffer] = useState(false);
  const [sequence, setSequence] = useState('');
  const [banner_type, setBannerType] = useState('match');
  const [fantasy_type, setFantasyType] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [buttonstate, setButtonState] = useState(false);
  const [presignedKey, setPresignedKey] = useState("");
  const [presignedUrl, setPresignedUrl] = useState("");

  const handleChange = (e) => {
    console.log('e.target.value', e.target.value)
    if (e.target.name === 'banner_type') {
      setBannerType(e.target.value);
      if (e.target.value == 'match') {
        setShowSeriesMatch(true);
        setShowOffer(false);
      }
      else if (e.target.value == 'offer') {
        setShowSeriesMatch(false);
        setShowOffer(true);
      }
      else {
        setShowSeriesMatch(false);
        setShowOffer(false);
      }
    } else if (e.target.name === 'series_id') {
      setSeriesId(e.target.value);
      getSeriesMatches(e.target.value);
    }
    else if (e.target.name === 'match_id') {
      setMatchId(e.target.value);
    }
    else if (e.target.name === 'offer_id') {
      setOfferId(e.target.value);
    }
  }

  const getSeriesMatches = async (sr_id) => {
    if(!sr_id){
      return
    }
    let path;
    path = apiUrl.get_series_all_matches + '/' + sr_id;

    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setMatchDropdown(res.results.docs || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }

  };

  const onSubmit = async data => {
     
    setLoading(true);
    let isImageUploaded = false;
    const teamReader = new FileReader();
    if (profilePic) {
      teamReader.readAsArrayBuffer(profilePic);
    }
    teamReader.onloadend = async () => {
      const binaryData = teamReader.result;
      const resp = await axios.put(presignedUrl, binaryData, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      if (resp?.status === 200) {
        isImageUploaded = true
      }
    }
    if(isImageUploaded || preview){
      let postJson = {
        id: id,
        title: data.title.trim(),
        banner_type: banner_type,
        fantasy_type: fantasy_type,
        media_type: 'image',//data.type,
        sequence: data.sequence,
        offer_id: offer_id,
        series_id: series_id,
        match_id: match_id,
        start_date: startdate,
        end_date: enddate,
        link: data.link.trim(),
        image: presignedKey
      };
      let path = apiUrl.update_banner;
      const fr = await Helper.post(token,postJson, path);
      const res = await fr.response.json();
      if (fr.status === 200) {
        if (res.success) {
          setLoading(false);
          props.history.push('/banners');
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

  const fetchData = async (path) => {
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
  
    if (fr.status === 200) {
      if (res.success) {
        return res.results;
      } else {
         throw new Error(res.msg);
      }
    } else {
       throw new Error(res.msg || res.error);
    }
  };
  
  const getData = async () => {
    const bannerId = props.match.params.id;
  
    try {
      const [
        bannerData,
        seriesData,
        offerData,
      ] = await Promise.all([
        fetchData(apiUrl.get_banner + '/' + bannerId),
        fetchData(apiUrl.get_series),
        fetchData(apiUrl.get_coupons_for_banners),
      ]);
  
       
      setTitle(bannerData.title);
      setStartDate(bannerData.start_date || '');
      setEndDate(bannerData.end_date || '');
      setLink(bannerData.link);
      setMediaType(bannerData.media_type || '');
      setSequence(bannerData.sequence);
      setBannerType(bannerData.banner_type);
      setFantasyType(bannerData.fantasy_type);
      setOfferId(bannerData.offer_id);
      setProfilePicPreview(bannerData.image);
      setShowSeriesMatch(bannerData.series_id !== '');
      setSeriesId(bannerData.series_id);
      getSeriesMatches(bannerData.series_id);
      setMatchId(bannerData.match_id);
      setId(bannerData.id);
      setDropdown(seriesData || []);
      setOfferDropdown(offerData.results || []);
  
    } catch (error) {
      alert.error(error.message);
    }
  };

  const onImageChange = async (event) => {
    let type = event.target.files[0]?.type.split("/");
    const file = event.target.files[0];
    if (type?.length) {
      if (type[0] === "image") {
        if (event.target.files && event.target.files[0]) {
          setButtonState(false);
          setProfilePicPreview(URL.createObjectURL(file));
          setProfilePic(file);
          let postJson = {
            contentType: file.type,
            folderType: 'fantasyBanner'
          };
          let path = apiUrl.pre_signed_url_generate;
          const fr = await Helper.post(token, postJson, path);
          const res = await fr.response.json();
          if (fr.status === 200) {
            if (res.success) {
              setPresignedUrl(res.results.url);
              setPresignedKey(res.results.key);
            } else {
              alert.error(res.msg);
            }
          } else {
            alert.error(res.error);
          }
        }
      } else {
        setButtonState(true);
        alert.error("Only jpg, .jpeg and png image are allowed");
        let myImage = document.getElementById("banner_pic");
        myImage.value = "";
      }
    }
  };

  const handleStartDate = (date) => {
    setEndDate('');
    let newDate = date ? date : new Date();
    setStartDate(newDate);
  };
  const handleEndDate = (date) => {
    let newDate = date ? date : '';
    setEndDate(newDate);
  };


  useEffect(() => {
    getData();
  }, []);
  return (
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className=""><h4>Edit Banner</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Title</Label>
                  <div className='input_grp  col-md-8'>
                    <input type="text" name="title" minLength={"3"} maxLength={"50"} placeholder="Banner Title" autoComplete="off"
                      className="form-control" defaultValue={title} ref={register({ required: 'Required' })} />
                    {errors.title && <p className="text-danger marginmessage">Banner Title is required</p>}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Hyperlink</Label>
                  <div className='input_grp  col-md-8'>
                    <input type="text" name="link" placeholder="ex:https://www.google.com" autoComplete="off"
                      className="form-control" defaultValue={link} ref={register({ required: 'Required', pattern: /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ })} />
                    <span className={"pull-left mb-2 text-white"} >
                      (Ex:https://www.google.com)
                    </span>
                    {errors.link && <p className="text-danger marginmessage">Banner Hyperlink is required</p>}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
              <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>Start Date</Label>
                  <div className={"col-md-8  mb-3"}>
                    <DatePicker selected={startdate === '' ? null : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                      dateFormat="dd/MM/yyyy"
                      timeInputLabel="Time:"
                      // showTimeInput
                      minDate={new Date()}
                      onChange={handleStartDate}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      required={true} />
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
              <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>End Date</Label>
                  <div className={"col-md-8  mb-3"}>
                    <DatePicker selected={enddate === '' ? null : new Date(enddate)} className="form-control" placeholderText=" End Date"
                      dateFormat="dd/MM/yyyy"
                      timeInputLabel="Time:"
                      // showTimeInput
                      minDate={new Date()}
                      onChange={handleEndDate}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      required={true} />
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Image</Label>
                  <div className='input_grp  col-md-8'>
                    <input type="file" onChange={onImageChange} name="banner_pic" className="form-control" autoComplete="off" placeholder="Banner Image" />                   
                    <span className={"pull-left text-dark"} > (Please enter only .png, .jpg .gif and .jpeg, .jfif images.) </span>
                    <ErrorMessage errors={errors} name="banner_pic">
                      {({ message }) => <p className={"text-danger"}>{message}</p>}
                    </ErrorMessage>
                    <br/>
                    {(mediaType == 'image') && <img id="target" className={'mt-3 rounded'} height={'auto'} width={150} src={preview} />}
                  </div>         
                 

                </FormGroup>
              </Col>

              {/* <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Type</Label>
                  <div className='input_grp  col-md-8'>

                    <select type="select" name="banner_type" value={banner_type} placeholder="Status" className="form-control" onChange={handleChange} ref={register({ required: 'Required' })}>
                      <option value=""> Banner Type </option>
                      <option value="match">Match</option>
                      <option value="invite">Invite</option>
                      <option value="offer">Offer</option>
                    </select>
                    {errors.banner_type && <p className="text-danger marginmessage">Banner Type is required</p>}
                  </div>
                </FormGroup>
              </Col> */}
              <Col md={6}>
                <FormGroup className='row'>
                <Label className={'col-md-2 pull-left mt-2'}>Banner Sequence</Label>
                  <div className='input_grp  col-md-8'>
                    <input type="number" name="sequence" defaultValue={sequence} placeholder="Banner Sequence" autoComplete="off"
                      className="form-control" maxLength={"3"} min={"0"} ref={register({ required: 'Required' })} />
                    {errors.sequence && <p className="text-danger marginmessage">Banner Sequence is required</p>}
                  </div>
                </FormGroup>
              </Col>

              {show_offer === true && (<Col md={6}>
                <FormGroup>
                  <select className={"form-control"} value={offer_id} name="offer_id" onChange={handleChange}>
                    <option value={""}>Select Offer</option>
                    {
                      offer_dropdown.map((type, index) => {
                        return <option key={index} value={type._id}>{type.coupon_code}</option>
                      })
                    }
                  </select>

                </FormGroup>
              </Col>)}
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>Series</Label>
                  <div className='input_grp  col-md-8'>
                    <select className={"form-control"} value={series_id} name="series_id" onChange={handleChange}>
                      <option value={""}>Select Series</option>
                      {
                        dropdown.map((type, index) => {
                          return <option key={index} value={type.id_api}>{type.name}</option>
                        })
                      }
                    </select>
                  </div>

                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>Matches</Label>
                  <div className='input_grp  col-md-8'>
                    <select className={"form-control"} value={match_id} name="match_id" onChange={handleChange}>
                      <option value={""}>Select Match</option>
                      {
                        match_dropdown.map((type, index) => {
                          return <option key={index} value={type.match_id}>{type.localteam} Vs {type.visitorteam} {type.type} @ {moment(type.date).format('YYYY-MM-DD')}</option>
                        })
                      }
                    </select>
                  </div>
                </FormGroup>
              </Col>

            </Row>
          </CardBody>
          <CardFooter>
            <Button onClick={() => history.goBack()} className="btn dark_btn ml-1" color="danger"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
            <Button disabled={buttonstate} className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>
      </form>
  );
}

export default EditBanner;
