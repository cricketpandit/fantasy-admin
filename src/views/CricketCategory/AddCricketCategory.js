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

const AddCricketCategory = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();

  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [cayegory, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const onSubmit = async (data) => {
    setLoading(true);
    let postJson = {
      title: data.title.trim(),
      sequence: 1,
      description: data.description,
    };
    let path = apiUrl.add_cricket_category;
    const fr = await Helper.post(token,postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push("/cricket/category");
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
    const { value } = e.target
    if (value?.length > 25) {
      value.slice(0, 25)
    } else {
      setCategory(value)
    }
  }

  const handleDesLength = (e) => {
    const { value } = e.target
    if (value?.length > 200) {
      value.slice(0, 200)
    } else {
      setDescription(value)
    }
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info">
              <h4>Add Cricket Category</h4>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
              <FormGroup className='row'>

                  <Label className={"col-md-2 pull-left mt-2"}>
                    Cricket Category Title
                  </Label>
                  <div className='input_grp  col-md-8'>
                  <input
                    type="text"
                    name="title"
                    placeholder="Cricket Category Title"
                    autoComplete="off"
                    maxLength={"25"}
                    value={cayegory}
                    onChange={(e) => handleMinLength(e)}
                    className="form-control"
                    ref={register({
                      required: "Required",
                    })}
                  />
                  {errors.title && (
                    <p className="text-danger marginmessage">
                      Cricket Category Title is required
                    </p>
                  )}
                  </div>
                </FormGroup>
              </Col>
              <Col md={12}>
              <FormGroup className='row'>
                  <Label className={"col-md-2 pull-left mt-2"}>
                    Cricket Category Description
                  </Label>
                  <div className='input_grp  col-md-8'>
                  <textarea name="description" placeholder="Small Description..." autoComplete="off" className="form-control "  maxLength={200}
                    value={description}
                    onChange={(e) => handleDesLength(e)} ref={register({ required: 'Required' })}></textarea>
                  {errors.description && <p className="text-danger marginmessage">Description is required</p>}
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
    </React.Fragment>
  );
};

export default AddCricketCategory;
