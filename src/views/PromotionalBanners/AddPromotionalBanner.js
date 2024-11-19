import React, { useState, useEffect, useRef } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
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

const AddPromotionalBanner = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const fileInputRef = useRef(null);
  const { register, handleSubmit, errors } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [buttonstate, setButtonState] = useState(false);
  const [presignedKey, setPresignedKey] = useState('');
  const [presignedUrl, setPresignedUrl] = useState('');
  const handleChange = (e) => {
    setMediaType(e.target.value);
    setProfilePicPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const checkBannerType = (event) => {
    if(mediaType===""){
      event.preventDefault();
      alert.error("Please check banner type");
    }
  }
  const onSubmit = async data => {
 
    setLoading(true);
    const reader = new FileReader();
    reader.readAsArrayBuffer(profilePic);
    reader.onloadend = async () => {
      const binaryData = reader.result;
      const resp = await axios.put(presignedUrl, binaryData, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (resp?.status === 200) {
        let postJson = {
          media_type: data?.media_type,
          image: presignedKey,
        };
        let path = apiUrl.add_promotional_banner;
        const fr = await Helper.post(token,postJson, path);
        const res = await fr.response.json();
        if (fr.status === 200) {
          if (res.success) {
            setLoading(false);
            props.history.push('/promotional-banners');
            alert.success(res.msg);
          } else {
            alert.error(res.msg);
            setLoading(false);
          }
        } else {
          alert.error(res.error);
          setLoading(false);
        }
      } else {
        alert.error(resp.msg);
      }
    };    
  };

  const onImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const validImageTypes = /\.(jpg|jpeg|png|gif)$/;
      const validVideoTypes = /\.(mp4|webm|ogg)$/;

      if (mediaType === 'image' && !file.name.match(validImageTypes)) {
        Toast.fire({
          icon: "error",
          title: "Select a valid image.",
        });
        setButtonState(true);
        return false;
      } else if (mediaType === 'video' && !file.name.match(validVideoTypes)) {
        Toast.fire({
          icon: "error",
          title: "Select a valid video.",
        });
        setButtonState(true);
        return false;
      } else {

        setProfilePicPreview(URL.createObjectURL(event.target.files[0]));
        setProfilePic(event.target.files[0]);
        setButtonState(false)
        
        setLoading(true);
        let postJson = {
          contentType: file.type
        };
        let path = apiUrl.generate_pre_signed_url;
        const fr = await Helper.post(token,postJson, path);
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
    }
  };

  useEffect(() => {
  }, []);

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Promotional Banner</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Media Type</Label>
                  <div className='input_grp col-md-8'>
                    <select
                      name="media_type"
                      className="form-control"
                      onChange={handleChange}
                      ref={register({ required: 'Required' })}
                    >
                      <option value="">Banner Type</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    {errors.media_type && <p className="text-danger marginmessage">Banner Type is required</p>}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner {mediaType ? mediaType : "Image"}</Label>
                  <div className='input_grp col-md-8'>
                    <input
                      type="file"
                      id='banner'
                      required
                      ref={fileInputRef}
                      onClick={checkBannerType}
                      onChange={onImageChange}
                      name="banner_pic"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Banner Image"
                      accept={mediaType === 'image' ? 'image/png, image/jpeg, image/gif' : mediaType === 'video' ? 'video/mp4, video/webm, video/ogg' : ''}
                    />
                    <span className={"pull-left"} > 
                      {mediaType === 'image' && '(Please enter only .png, .jpg, .gif and .jpeg images.)'}
                      {mediaType === 'video' && '(Please enter only .mp4, .webm, and .ogg videos.)'}
                    </span>
                    <ErrorMessage errors={errors} name="banner_pic">
                      {({ message }) => <p className={"text-danger"}>{message}</p>}
                    </ErrorMessage>
                    {mediaType === 'image' && preview.length >0  &&
                      <>
                        <img id="target" alt="Banner Image" className={'mt-3 rounded'} height={250} src={preview} />
                        <img id="validateBanner" alt="Banner Image" className='d-none' src={preview} />
                      </>
                  }
                    {errors.profilePic && <p className="text-danger marginmessage">Banner image is required</p>}
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
            <Button disabled={buttonstate} className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>
      </form>
  );
}

export default AddPromotionalBanner;
