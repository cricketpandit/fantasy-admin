import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
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

const EditPromotionalBanner = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');
  const [id, setId] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [buttonstate, setButtonState] = useState(false);
  const [presignedKey, setPresignedKey] = useState('');
  const [presignedUrl, setPresignedUrl] = useState('');

  const handleChange = (e) => {
    setMediaType(e.target.value);
  };

  const onSubmit = async data => {
     
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
          id: id,
          media_type: data?.media_type,
          image: presignedKey,
        };
        let path = apiUrl.update_promotional_banner;
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
      ] = await Promise.all([
        fetchData(apiUrl.get_promotional_banner + '/' + bannerId),
      ]);      
      
      setMediaType(bannerData.media_type || '');
      setProfilePicPreview(bannerData.image);
      setMediaType(bannerData.media_type);
      setId(bannerData.id); 
  
    } catch (error) {
      alert.error(error.message);
    }
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
        let imgObj = event.target.files[0]
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
    getData();
  }, []);

  return (
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className=""><h4>Edit Promotional Banner</h4></CardTitle>
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
                      value={mediaType}
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
                    {mediaType === 'image' &&
                      <><img id="target" alt="Banner Image" className={'mt-3 rounded'} height={250} src={preview} />
                      <img id="validateBanner" alt="Banner Image" className='d-none' src={preview} />
                      </>
                    }
                    {errors.profilePic && <p className="text-danger marginmessage">Banner image is required</p>}
                    <br></br>
                    {mediaType === 'video' &&
                      <>
                        <a href={`${preview}`} >Download Video</a>
                      </>
                    }

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

export default EditPromotionalBanner;
