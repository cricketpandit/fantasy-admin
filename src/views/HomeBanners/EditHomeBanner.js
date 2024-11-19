import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
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

const EditHomeBanner = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [buttonstate, setButtonState] = useState(false);  
  const [presignedKey, setPresignedKey] = useState("");
  const [presignedUrl, setPresignedUrl] = useState(""); 
  

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
        media_type: 'image',//data.type,
        image: presignedKey
      };
      let path = apiUrl.update_home_banner;
      const fr = await Helper.post(token,postJson, path);
      const res = await fr.response.json();
      if (fr.status === 200) {
         onSubmitSucess(res)
      } else {
        onSubmitError(res)
      }
    }
  };

  const onSubmitSucess = (res)=>{
     
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
  }
  const onSubmitError =(res)=>{
    alert.error(res.error);
    setLoading(false);
  }
  const getData = async () => {
    let path = apiUrl.get_home_banner + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setTitle(res.results.title);
        setMediaType(res.results.media_type || '');
        setProfilePicPreview(res.results.image);
        setId(res.results.id);
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.msg);
    }
  };



const onImageChange = (event) => {
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
          img.onerror = () => {
            Toast.fire({
              icon: "error",
              title: "Failed to load the image.",
            });
            setButtonState(true);
            return false;
          };
        }
      } else {
        alert.error("Only jpg, .jpeg and png image are allowed");
        let myImage = document.getElementById("banner_pic");
        myImage.value = "";
      }
    }
};

  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className=""><h4>Edit Home Banner</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Title</Label>
                  <input type="text" minLength={"3"} maxLength={"50"} name="title" placeholder="Banner Title" autoComplete="off"
                    className="form-control col-md-8" defaultValue={title} ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Banner Title is required</p>}
                </FormGroup>
              </Col>
              
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Image</Label>
                  <input type="file" onChange={onImageChange} name="banner_pic" className="form-control  col-md-8" autoComplete="off" placeholder="Banner Image" />
                  <span className={"pull-left"} style={{marginLeft:'260px'}} > (Please enter only .png, .jpg .gif and .jpeg images.) </span>
                  <ErrorMessage errors={errors} name="banner_pic">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                  <br></br>
                  {(mediaType === 'image') && <img id="target" className={'mt-3 rounded'} height={250} width={500} src={preview} />}
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
    </React.Fragment>
  );
}

export default EditHomeBanner;
