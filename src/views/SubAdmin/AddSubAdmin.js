import React, { useState } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row, Input } from 'reactstrap';
import { includes } from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import _nav from "../../nav/fantasynav"

const AddSubAdmin = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const [access_managers, setAccessManagers] = useState([]);
  const { register, handleSubmit, errors, setValue } = useForm();

  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const onSubmit = async data => {
    setLoading(true);
    let formData = new FormData();
  
    let postJson = { full_name: data.full_name.trim(), email: data.email, username: data.username.trim(), phone: data.mobile };
    let obj = { 'manager': 'Dashboard', 'view': 1, 'edit': 0, 'delete': 0 };
    access_managers.push(obj);

    postJson.module_permission = JSON.stringify(access_managers)
    formData.append('data', JSON.stringify(postJson));
     let path = apiUrl.add_sub_admin;
    const fr = await Helper.formPost(token,formData, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/sub-admins');
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



 

  const handleOnAccessSelect = (event) => {
    let pre_access_managers = access_managers.map((e) => {
      return e.manager
    })
    let new_pre_access_managers = [...access_managers]
    if (Helper.andOperator(event.target.value == 'all',event.target.checked)) {
      let data = document.getElementsByName(event.target.name)
      data.forEach((e) => {
        e.checked = true
      })
    } else if (Helper.andOperator(event.target.value == 'all',!event.target.checked)) {
      let data = document.getElementsByName(event.target.name)
      data.forEach((e) => {
        e.checked = false
      })
    }
    if (event.target.checked) {
      if (!includes(pre_access_managers, event.target.name)) {
        let view = Helper.ternaryOperator(event.target.value == 'view' || event.target.value == 'all',1,0)
        let edit = Helper.ternaryOperator(event.target.value == 'edit' || event.target.value == 'all', 1,0) 
        let deletes = Helper.ternaryOperator(event.target.value == 'delete' || event.target.value == 'all',1,0)
        new_pre_access_managers.push({ manager: event.target.name, view, edit, delete: deletes })
      } else if (includes(pre_access_managers, event.target.name)) {
        let index = new_pre_access_managers.findIndex((e) => e.manager == event.target.name)
        new_pre_access_managers[index].view =
          event.target.value == 'view' || event.target.value == 'all'
            ? 1
            : new_pre_access_managers[index].view
        new_pre_access_managers[index].edit =
          event.target.value == 'edit' || event.target.value == 'all'
            ? 1
            : new_pre_access_managers[index].edit
        new_pre_access_managers[index].delete =
          event.target.value == 'delete' || event.target.value == 'all'
            ? 1
            : new_pre_access_managers[index].delete
      }
    } else {
      let index = new_pre_access_managers.findIndex((e) => e.manager == event.target.name)
      if (event.target.value == 'all') {
        new_pre_access_managers = new_pre_access_managers.filter((e) => {
          return e.manager != event.target.name && e
        })
      } else {
        new_pre_access_managers[index].view =
          event.target.value == 'view' || event.target.value == 'all'
            ? 0
            : new_pre_access_managers[index].view
        new_pre_access_managers[index].edit =
          event.target.value == 'edit' || event.target.value == 'all'
            ? 0
            : new_pre_access_managers[index].edit
        new_pre_access_managers[index].delete =
          event.target.value == 'delete' || event.target.value == 'all'
            ? 0
            : new_pre_access_managers[index].delete

        if (
          new_pre_access_managers[index].edit == 0 &&
          new_pre_access_managers[index].view == 0 &&
          new_pre_access_managers[index].delete == 0
        ) {
          new_pre_access_managers = new_pre_access_managers.filter((e) => {
            return e.manager != event.target.name && e
          })
        }
      }
    }
    
    setValue('access_managers', new_pre_access_managers.join(','))
    setAccessManagers(new_pre_access_managers)
  }
 

  return (
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" autocomplete="off">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Sub Admin</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Full Name</Label>
                  <input type="text" minLength={3} name="full_name" placeholder="Full Name" autoComplete="off"
                    className="form-control col-md-8" ref={register({ required: 'Required', pattern: /^[a-z\-_\s]+$/i })} />
                  {errors.full_name && <p className="text-danger marginmessage offset-md-2">Full Name is required and should be alphabatic only</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup autocomplete="off">
                  <Label className={'col-md-2 pull-left mt-2'}>User Name</Label>
                  <input type="text" minLength={3} name="username" id={"username"} className="form-control col-md-8" autocomplete="new-username" placeholder="User Name"
                    ref={register({
                      required: 'User name Required', pattern: {
                        value: /^[a-zA-Z ]+$/,
                        message: "User name is required and should be characters only",
                      },
                    })} />
                  <ErrorMessage errors={errors} name="username">
                    {({ message }) => <p className={"text-danger  offset-md-2"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Mobile Number</Label>
                  <input type="text" name="mobile" className="form-control  col-md-8" maxLength="14" placeholder="Mobile Number"
                    ref={register({
                      required: 'Mobile number is Required',
                      pattern: {
                        value: /^[0-9]{10,12}$/,
                        message: 'Mobile number is invalid'
                      },
                      maxLength: {
                        value: 12,
                        message: 'Max 12 digit mobile no are allowed'
                      },
                      minLength: {
                        value: 10,
                        message: 'Min 10 digit mobile no are allowed'
                      }
                    })} />
                  <ErrorMessage errors={errors} name="mobile">
                    {({ message }) => <p className={"text-danger  offset-md-2"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Email</Label>
                  <input type="text" name="email" className="form-control  col-md-8" placeholder="Email"
                    ref={register({
                      required: 'Email is Required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "invalid email address"
                      }
                    })} />
                  <ErrorMessage errors={errors} name="email">
                    {({ message }) => <p className={"text-danger  offset-md-2"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>
 
              <Col md={12}>
                <Row>
                  <Col className='text-white mobile_min_width'>Manager</Col>
                  <Col className='text-white'>View</Col>
                  <Col className='text-white'>Edit</Col>
                  <Col className='text-white'>Delete</Col>
                  <Col className='text-white'>All</Col>
                </Row>
                {_nav.items.map((e, i) => {

                  return (
                    <Row>
                      <Col className='text-white mobile_min_width'>{e.name}</Col>
                      {e.name == 'Dashboard' ?
                        <Col>
                          <Input className="m-2" checked={true} value={"view"} name={e.name} type="checkbox" />{' '}
                        </Col>
                        :
                        <Col>
                          <Input className="m-2" onChange={handleOnAccessSelect} value={"view"} name={e.name} type="checkbox" />{' '}
                        </Col>
                      }
                      <Col> <Input className="m-2" onChange={handleOnAccessSelect} value={"edit"} name={e.name} type="checkbox" />{' '}</Col>
                      {e.name != 'User Management' ? <Col> <Input className="m-2" onChange={handleOnAccessSelect} value={"delete"} name={e.name} type="checkbox" />{' '}</Col>:<Col> <Input className="m-2" disabled value={"delete"} name={e.name} type="checkbox" />{' '}</Col>}
                      <Col> <Input className="m-2" onChange={handleOnAccessSelect} value={"all"} name={e.name} type="checkbox" />{' '}</Col>
                    </Row>
                  )
                })}

              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
            <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>
      </form>
  );
}

export default AddSubAdmin;
