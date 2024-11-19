import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const AddCoupon = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();

  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [startdate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('');

  const onSubmit = async data => {
    setLoading(true);
    let postJson = {
      coupon_code: data.coupon_code.trim(),
      type: data.type,
      coupon_type: data.coupon_type,
      flat_discount: data.flat_discount,
      min_add_amount: data.min_add_amount,
      min_discount: 0,
      max_discount: 0,
      cashback_percent: data.cashback_percent,
      usage_limit: data.usage_limit,
      limit_per_user: data.limit_per_user,
      description: data.description,
      start_date: startdate,
      end_date: endDate,
      status: data.status
    };
     let path = apiUrl.add_coupon;
    const fr = await Helper.post(token,postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/coupons');
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
  const handleStartDate = (date) => {
     setEndDate('');
    let newDate = date ? date : new Date();
    setStartDate(newDate);
  };
  const handleEndDate = (date) => {
    let newDate = date ? date : '';
    setEndDate(newDate);
  };

  const handleChange = async (e) => {
    if (e.target.name === 'type') {
      setType(e.target.value);
    }
    
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Coupon</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Coupon Code</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="text" name="coupon_code" placeholder="Coupon Code" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required', pattern: /^\S*$/ })} />
                    {Helper.andOperator(errors.coupon_code,<p className="text-danger marginmessage">Enter valid coupon code</p>)}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Coupon Discount Type</Label>
                  <div className='input_grp  col-md-6'>
                    <select onChange={handleChange} name={'type'} className={"form-control"} ref={register({ required: 'Required' })} >
                      <option value={''}>-- Select Coupon Discount Type --</option>
                      <option value={'flat'}>Flat</option>
                      <option value={'percentage'}>Percentage</option>
                    </select>
                    {Helper.andOperator(errors.type,<p className="text-danger marginmessage">Coupon Discount Type is required</p>)}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Coupon Type</Label>
                  <div className='input_grp  col-md-6'>
                    <select onChange={handleChange} name={'coupon_type'} className={"form-control"} ref={register({ required: 'Required' })} >
                      <option value={''}>-- Select Coupon Type --</option>
                      <option value={'bonus'}>Bonus</option>
                      <option value={'free_cash'}>Free Cash</option>
                    </select>
                    {Helper.andOperator(errors.coupon_type,<p className="text-danger marginmessage">Coupon Type is required</p>)}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Minimum Add Amount(INR)</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="number" name="min_add_amount" maxLength={"3"} min={"0"} placeholder="Minimum Add Amount" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required', min: 0, maxLength: 7 })} />
                    {Helper.andOperator(errors.min_add_amount && <p className="text-danger marginmessage">Minimum Add Amount is required</p>)}
                  </div>
                </FormGroup>
              </Col>
              {type == 'percentage' ?
                <>
                  <Col md={6}>
                    <FormGroup className='row'>
                      <Label className={'col-md-3 pull-left mt-2'}>Cashback Percent (%)</Label>
                      <div className='input_grp  col-md-6'>
                        <input type="number" name="cashback_percent" maxLength={"3"} min={"1"} max={"100"} onInput={maxLengthCheck} placeholder="Cashback Percent (%)" autoComplete="off"
                          className="form-control" ref={register({ required: 'Required', min: 0, max: 100, maxLength: 3 })} />
                        {Helper.andOperator(errors.cashback_percent,<p className="text-danger marginmessage">Cashback Percent is required</p>) }
                      </div>
                    </FormGroup>
                  </Col>
                </>
                :
                <Col md={6}>
                  <FormGroup className='row'>
                    <Label className={'col-md-3 pull-left mt-2'}>Flat Discount Amount</Label>
                    <div className='input_grp  col-md-6'>
                      <input type="number" name="flat_discount" maxLength={"3"} min={"1"} max={"100"} onInput={maxLengthCheck} placeholder="Flat Discount Amount" autoComplete="off"
                        className="form-control" ref={register({ required: 'Required', min: 0, max: 100, maxLength: 3 })} />
                      {errors.flat_discount && <p className="text-danger marginmessage">Flat Discount Amount is required</p>}
                    </div>
                  </FormGroup>
                </Col>
              }

              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Status</Label>
                  <div className='input_grp  col-md-6'>
                    <select name={'status'} className={"form-control"} ref={register({ required: 'Required' })} >
                      <option value={''}>-- Select Coupon Status --</option>
                      <option value={'active'}>Active</option>
                      <option value={'inactive'}>Inactive</option>
                    </select>
                    {Helper.andOperator(errors.status, <p className="text-danger marginmessage">Status is required</p>) }
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Limit Per User</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="number" name="limit_per_user" maxLength="3" placeholder="Limit Per User" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required' })} onInput={maxLengthCheck} />
                    {Helper.andOperator(errors.limit_per_user,<p className="text-danger marginmessage">Limit Per User is required</p>)}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Start Date</Label>
                  <div className='input_grp  col-md-6'>
                    <div className={"d-flex"}>
                      <DatePicker selected={startdate === '' ? null : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        onChange={handleStartDate}
                        disabledKeyboardNavigation
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        required={true}
                        dropdownMode="select" />
                    </div>
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Usage Limit</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="number" name="usage_limit" maxLength={"7"} min={"1"} onInput={maxLengthCheck} placeholder="Usage Limit" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required', min: 0, maxLength: 7 })} />
                    {Helper.andOperator( errors.usage_limit,<p className="text-danger marginmessage">Usage Limit is required</p>)}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>End Date</Label>
                  <div className='input_grp  col-md-6'>
                    <div className={"d-flex"}>
                      <DatePicker selected={endDate === '' ? null : new Date(endDate)} className="form-control" placeholderText=" End Date"
                        dateFormat="dd/MM/yyyy"
                        minDate={startdate ? new Date(startdate) : new Date()}
                        onChange={handleEndDate}
                        disabledKeyboardNavigation
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        required={true}
                        dropdownMode="select" />
                    </div>
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Description</Label>
                  <div className='input_grp  col-md-6'>
                    <textarea name="description" placeholder="Description" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required' })} />
                    {Helper.andOperator(errors.description,<p className="text-danger marginmessage">Description is required</p>) }
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

export default AddCoupon;
