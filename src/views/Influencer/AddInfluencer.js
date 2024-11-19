import React, { useState } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

const AddInfluencer = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();

  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);

  const [influencer_image, setInfluencerImage] = useState('');
  const [preview, setInfluencerImagePreview] = useState('');
  const [buttonstate, setButtonState] = useState(false);

  const onSubmit = async data => {
    setLoading(true);
    let formData = new FormData();
    let postJson = {
      name: data.name.trim(),
      code: data.code.trim(),
      bonus_amount: data.bonus_amount,
      status: data.status
    };

    formData.append('data', JSON.stringify(postJson));
    formData.append('influencer_image', influencer_image);

    let path = apiUrl.add_influencer;
    const fr = await Helper.formPost(token, formData, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/influencers');
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
  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      if (!image.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        Toast.fire({
          icon: "error",
          title: "Select a valid image.",
        });
        setButtonState(true);
        return false;
      } else {
        console.log("event inner", event)
        const img = new Image();
        img.src = URL.createObjectURL(image);
        let realImage  = event.target.files[0]
        
        img.onload = () => {

          const width = img.width;
          const height = img.height;

          // Validate image width (example: width must be at least 300px)
          if (width != height) {
            Toast.fire({
              icon: "error",
              title: "Image must be square in shape.",
            });
            setButtonState(true);
            return false;
          } else {
            if (realImage) {
              setInfluencerImagePreview(URL.createObjectURL(realImage));
              setInfluencerImage(realImage);
              setButtonState(false);
            }
          }
        };

        img.onerror = () => {
          Toast.fire({
            icon: "error",
            title: "Failed to load the image.",
          });
          setButtonState(true);
          return false;
        };
      }
    }
  };
  console.log("errors validation",errors)
  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Influencer</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Influencer Name</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="text" name="name" maxLength={"25"} onInput={maxLengthCheck} placeholder="Influencer name" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required' })} />
                    {Helper.andOperator(errors.name, <p className="text-danger marginmessage">Enter valid influencer name</p>)}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Influencer Code</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="text" name="code" maxLength={"16"} onInput={maxLengthCheck} placeholder="Influencer Code" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required' })} />
                    {Helper.andOperator(errors.code, <p className="text-danger marginmessage">Enter valid influencer code</p>)}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Influencer Image</Label>
                  <div className='input_grp col-md-6'>
                    <input id='influencer_image' type="file" onChange={onImageChange} name="influencer_image" className="form-control  col-md-8" autoComplete="off" placeholder="Pic" />
                    <ErrorMessage errors={errors} name="influencer_image">
                      {({ message }) => <p className={"text-danger"}>{message}</p>}
                    </ErrorMessage>
                  </div>
                  {preview && <img alt="Profile" id="target" className={'mt-3 rounded'} height={200} src={preview} />}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Bonus Amount(INR)</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="number" name="bonus_amount" onInput={maxLengthCheck} maxLength={"3"} min={"0"} placeholder="Bonus Amount" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required' })} />
                    {Helper.andOperator(errors.bonus_amount , <p className="text-danger marginmessage">Bonus amount is required</p>)}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Status</Label>
                  <div className='input_grp  col-md-6'>
                    <select name={'status'} className={"form-control"} ref={register({ required: 'Required' })} >
                      <option value={''}>-- Select Influencer Status --</option>
                      <option value={'active'}>Active</option>
                      <option value={'inactive'}>Inactive</option>
                    </select>
                    {Helper.andOperator(errors.status, <p className="text-danger marginmessage">Status is required</p>)}
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
    </React.Fragment>
  );
}

export default AddInfluencer;
