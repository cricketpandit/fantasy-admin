import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Helper from "../../constants/helper";
import { useHistory } from "react-router-dom";
import apiUrl from "../../constants/apiPath";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter,
  FormGroup,
  Label,
  Col,
  Row,
} from "reactstrap";
import { useAlert } from "react-alert";
import useSession from "react-session-hook";

const AddQuizCategory = (props) => {
   
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();

  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [cayegory, setCategory] = useState('');
   const onSubmit = async (data) => {
    

    setLoading(true);

    let formData =  new FormData()
    let dict = {title:data?.title, type:data?.type}
    formData.append('data', JSON.stringify(dict));
     let path = apiUrl.getQuizCategory+'/';
    const fr = await Helper.formPost(token, formData, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push("/questions/category");
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

 
  const handleMinLength = (e) => {
    let { value } = e.target;
    if (value.includes("  ")) {
      value = value.replace(/ {2}/g, " ");
      return value;
    }

    if (value.startsWith(" ")) {
      value = value.trim();
      return value;
    }

    if (value?.length > 25) {
      value.slice(0, 25);
    } else {
      setCategory(value);
    }
  };

 

  
  return (
  
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info">
              <h4>Add Quiz Category</h4>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup className='row'>
                  <Label className={"col-md-2 pull-left mt-2"}>
                    Type
                  </Label>
                  <div className='input_grp  col-md-8'>
                    <select type="select" className="form-control" name='type' ref={register({
                      required: "Required",
                    })} >
                      <option value="">Select Type</option>
                      <option value="liveEvent">Live Events</option>
                      <option value="perception">Perception</option>
                    </select>
                    {errors.type && <p className="text-danger marginmessage">Type is required</p>}
                  </div>
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup className='row'>

                  <Label className={"col-md-2 pull-left mt-2"}>
                    Quiz Category Title
                  </Label>
                  <div className='input_grp  col-md-8'>
                    <input
                      type="text"
                      name="title"
                      placeholder="Quiz Category Title"
                      autoComplete="off"
                      maxLength={25}
                      value={cayegory}
                      onChange={(e) => handleMinLength(e)}
                      className="form-control"
                      ref={register({
                        required: "Required",
                      })}
                    />
                    {errors.title && (
                      <p className="text-danger marginmessage">
                        Quiz Category Title is required
                      </p>
                    )}
                  </div>
                </FormGroup>
              </Col>
            
            </Row>
          </CardBody>
          <CardFooter>
            <Button onClick={() => history.goBack()} className="dark_btn">
              <i className="fa fa-arrow-left" aria-hidden="true"></i> Back{" "}
            </Button>
            <Button className={"ml-2"} type="submit" color="primary">
              Submit{" "}
              {loading === true ? (
                <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i>
              ) : (
                <i
                  className="fa fa-arrow-circle-right fa-lg"
                  aria-hidden="true"
                ></i>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
  
  );
};

export default AddQuizCategory;
