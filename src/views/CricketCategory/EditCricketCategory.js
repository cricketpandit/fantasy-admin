import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const EditCricketCategory = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [id, setId] = useState('');

  const onSubmit = async innerData => {
    setLoading(true);
    let formData = new FormData();
    let postJson = { id: id, title: innerData.title.trim(), sequence: 1, description: innerData.description };
     formData.append('data', JSON.stringify(postJson));
    let path = apiUrl.update_cricket_category;
    const fr = await Helper.post(token,postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/cricket/category');
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
    let path = apiUrl.get_cricket_category + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setData(res.results);
        setId(res.results.id);
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

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Edit Cricket Category</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup className='row'>

                  <Label className={"col-md-2 pull-left mt-2"}>
                    Cricket Category Title
                  </Label>
                  <div className='input_grp  col-md-8'>
                    <input type="text" maxLength={"25"} name="title" placeholder="Cricket Category Title" autoComplete="off"
                      className="form-control" defaultValue={data.title} ref={register({ required: 'Required' })} />
                    {errors.title && <p className="text-danger marginmessage">Cricket Category Title is required</p>}
                  </div>
                </FormGroup>
              </Col>
              <Col md={12}>
              <FormGroup className='row'>
                  <Label className={"col-md-2 pull-left mt-2"}>
                    Cricket Category Description
                  </Label>
                  <div className='input_grp  col-md-8'>
                  <textarea name="description" placeholder="Small Description..." autoComplete="off" defaultValue={data.description} className="form-control" ref={register({ required: 'Required' })}></textarea>
                  {errors.description && <p className="text-danger marginmessage">Description is required</p>}
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

export default EditCricketCategory;
