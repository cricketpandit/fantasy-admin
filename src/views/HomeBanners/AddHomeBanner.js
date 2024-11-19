import React, { useState } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
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

const AddHomeBanner = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');
  const [mediaType] = useState("");
  const [buttonstate, setButtonState] = useState(false);
  const [presignedKey, setPresignedKey] = useState("");
  const [presignedUrl, setPresignedUrl] = useState("");

  const onSubmit = async data => {
    setLoading(true);
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
        let postJson = {
          title: data.title.trim(),
          media_type: 'image',
          image: presignedKey
        };
        let path = apiUrl.add_home_banner;
        const fr = await Helper.post(token,postJson, path);
        const res = await fr.response.json();
        if (fr.status === 200) {
          if (res.success) {
            setLoading(false);
            setPresignedKey("")
            setPresignedUrl("")
            setProfilePic("")
            props.history.push('/home-banners');
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
  };

  const onImageChange = async (event) => {
    let type = event.target.files[0]?.type.split("/");
    const file = event.target.files[0];
    if (type?.length) {
      if (type[0] === "image") {
        if (event.target.files && event.target.files[0]) {
          const img = new Image();
          img.src = URL.createObjectURL(file);
    
          img.onload = async () => {
            const width = img.width;
            const height = img.height;
    
            // Validate image width (example: width must be at least 300px)
            if (width < 500 || height < 900) {
              Toast.fire({
                icon: "error",
                title: "Image width*height must be at least 500px*900px.",
              });
              setButtonState(true);
              return false;
            } else {
              setButtonState(false);
              setProfilePicPreview(URL.createObjectURL(file));
              setProfilePic(file);
              let postJson = {
                contentType: file.type,
                folderType: 'homeBanner'
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
          }
        }
      } else {
        alert.error("Only jpg, .jpeg and png image are allowed");
        let myImage = document.getElementById("banner_pic");
        myImage.value = "";
      }
    }
  };


  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Home Banner</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Title</Label>
                  <div className='input_grp col-md-8'>
                    <input type="text" name="title" minLength={"3"} maxLength={"50"} placeholder="Banner Title" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required' })} />
                    {errors.title && <p className="text-danger marginmessage">Banner title is required</p>}
                  </div>
                </FormGroup>
              </Col>
              
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner {mediaType ? mediaType : "Image"}</Label>
                  <input id='banner_pic' type="file" onChange={onImageChange} ref={register({ required: !preview ? true : false })} name="banner_pic" className="form-control  col-md-8" autoComplete="off" placeholder="Banner Image" />

                  <span className={"pull-left"} > (Please enter only .png, .jpg .gif and .jpeg images.) </span><br/>
                  {(errors.banner_pic && !preview) && <p className="text-danger marginmessage">Banner image is required</p>}
                  <ErrorMessage errors={errors} name="banner_pic">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                  <img id="target" className={'mt-3 rounded'} height={250} src={preview} />
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
    </React.Fragment>
  );
}

export default AddHomeBanner;
