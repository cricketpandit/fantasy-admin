import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import "react-datepicker/dist/react-datepicker.css";
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, Table, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
let converter = require('number-to-words');

const AddContest = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, setValue, errors } = useForm({ mode: 'onBlur', souldFocusError: true, defaultValues: {} });
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);

  const [enteryFee, setEntryFee] = useState(0);
  const [winAmount, setwinAmount] = useState(0);
  const [plateFormFee, setPlateFormFee] = useState('0');
  const [totalAdminFee, setTotalAdminFee] = useState('0');

  const [usersLimit, setUsersLimit] = useState(1);
  const [adminProfitDisable, setadminProfitDisable] = useState(false);
  const [winAmountDisable, setwinAmountDisable] = useState(false);
  const [category, setCategory] = useState([]);
  const [mainForm, SetMainForm] = useState(true);
  const [breakUpForm, SetBreakUpForm] = useState(false);
  const [lastRank, setLastRank] = useState(0);
  const [contestId, setContestId] = useState(0);
  const [total_percentage, setTotalPercentage] = useState(100);
  const [remaining_amount, setRemainingAmount] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [max_team_join_count, setMaxTeamJoinCount] = useState('');
  const [confirm_winning, setConfirmWinning] = useState(false);
  const [auto_create, setAutoCreate] = useState(false);
  const [join_multiple_team, setJoinMultiple] = useState(false);
  const [cryptotokenvalue] = useState('');
  const [cryptotokenname] = useState('');
  const [contestType, setContestType] = useState('');

  let nRow = [{ is_completed: false, start_rank: 1, end_rank: '', each_percentage: 0, each_price: 0, total_percentage: 0, total_price: 0, rand: 1 }]
  const [rows, setRows] = useState(nRow);

  const onSubmit = async data => {
    setLoading(true);
    let postJson = {
      name: data.name.trim(),
      category_id: data.category,
      contest_type: data.contest_type,
      entry_fee: parseFloat(data.entry_fee),
      winning_amount: parseFloat(data.winning_amount),
      admin_profit: totalAdminFee,
      plateform_Fee: plateFormFee,
      users_limit: usersLimit,
      bonus: bonus,
      confirm_winning: confirm_winning,
      auto_create: auto_create,
      join_multiple_team: join_multiple_team,
      max_team_join_count: max_team_join_count,
      token_address: cryptotokenvalue,
      token_name: cryptotokenname,
      user_id: session.profile._id
    };
    let path = apiUrl.add_cricket_contest;
    const fr = await Helper.post(token, postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setContestId(res.results.id);
        setLoading(false);
        SetMainForm(false);
        SetBreakUpForm(true);
        setContestType(postJson?.contest_type)
      } else {
        alert.error(res.msg);
        setLoading(false);
      }
    } else {
      alert.error(res.error);
      setLoading(false);
    }
  };
  const onSubmitBreakup = async () => {
    let len = parseInt(rows.length);

    let totalPercent = 0;
    if (winAmount > 0) {
      for (let i = 0; i < len; i++) {
        totalPercent = parseFloat(totalPercent + rows[i].total_percentage);
      }
    }

    if (winAmount > 0 && totalPercent != 100) {
      alert.error('Sum of total percent must be equal to 100 %.');
      return;
    }

    let lasElement = rows[rows.length - 1]

    if (lasElement.end_rank == "") {
      alert.error('Please fill end rank of the last row.');
      return;
    }

    if (usersLimit < lasElement.end_rank) {
      alert.error('End rank must not be greater than user limit.');
      return;
    }

    setLoading(true);
    let postJson = {
      id: contestId,
      data: rows
    };
    let path = apiUrl.add_price_breakup_cricket;
    const fr = await Helper.post(token, postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        SetBreakUpForm(true);
        props.history.push('/cricket/contests');
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

  const getCategory = async () => {
    let path = apiUrl.get_active_cricket_categories;
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setCategory(res.results || []);
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.error);
    }

  }

  const handleType = async (e) => {
    let type = e.target.value;
    if (type === 'free') {
      setEntryFee(0);
      setBonus(0);
      setwinAmount(0);
      setPlateFormFee(0);
      setwinAmountDisable(true);
      setadminProfitDisable(true);
    } else {
      setEntryFee(0);
      setwinAmount(0);
      setPlateFormFee(0);
      setwinAmountDisable(false);
      setadminProfitDisable(false);
    }
  }
  const handleWinningChange = async (e) => {
    let win_amount = parseInt(e.target.value);
    let platform_fee = (win_amount * plateFormFee / 100);
    let entryFee = (win_amount + platform_fee) / usersLimit
    entryFee = Math.ceil(entryFee);
    setEntryFee(entryFee.toFixed(2) || 0);
    setwinAmount(win_amount || '');
    setRemainingAmount(win_amount || '');
    setTotalAdminFee(((platform_fee) * 100) / win_amount);

  }
  const handlePlateformFeeChange = async (e) => {
    let plateform_fee_per = parseFloat(e.target.value);
    let platform_fee = (winAmount * plateform_fee_per / 100);
    let entryFee = (winAmount + platform_fee) / usersLimit
    entryFee = Math.ceil(entryFee);
    setEntryFee(entryFee.toFixed(2) || 0);
    setPlateFormFee(plateform_fee_per || '');
    setTotalAdminFee(((platform_fee) * 100) / winAmount);
  }
  const handleUsersLimitChange = async (e) => {
    let users_limit = parseInt(e.target.value);
    let platform_fee = (winAmount * plateFormFee / 100);
    let entryFee = (winAmount + platform_fee) / users_limit
    entryFee = Math.ceil(entryFee);
    setEntryFee(entryFee.toFixed(2) || 0);
    setUsersLimit(users_limit);
    setMaxTeamJoinCount((max_team_join_count > parseInt(e.target.value)) ? parseInt(e.target.value) : max_team_join_count)
  }

  const handleBonusChange = async (e) => {

    setBonus(e.target.value);
  }
  const handleChangeMaxTeamJoinCount = async (e) => {
    if (e.target.value > usersLimit) {
      setMaxTeamJoinCount(usersLimit)
    } else {
      setMaxTeamJoinCount(e.target.value)
    }
  }
  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }
  const updateEndRank = (i, filed_name) => e => {
    let end_rank = parseInt(e.target.value);

    if (end_rank == "") {
      alert.error('End rank can not be left blank.');
      e.target.value = 0
      return;
    }
    if (end_rank === 0) {
      alert.error('End rank must not be equal to zero.');
      e.target.value = 0
      return;
    }

    if (usersLimit < end_rank) {
      alert.error('End rank must not be greater than user limit.');
      e.target.value = 0;
      return;
    }
    if (end_rank < rows[i].start_rank) {
      alert.error('End rank must not be less than start rank.');
      return;
    }
    let len = parseInt(rows.length);
    let totalAmount = 0;
    let totalPercent = 0;
    if (winAmount > 0) {
      for (i = 0; i < len - 1; i++) {
        totalAmount = parseInt(totalAmount + rows[i].total_price);
        totalPercent = parseInt(totalPercent + rows[i].total_percentage);
      }
    }
    setLastRank(end_rank + 1);
    setRows(sRows => {
      let objDay = sRows.find((row, index) => index === i);
      let winners = end_rank - (objDay.start_rank - 1)
      let eachPercent = parseInt(objDay.each_percentage);
      let total_price = ((eachPercent * winAmount) / 100) * winners;
      if (winAmount > 0 && (((totalAmount + total_price) > winAmount) || ((totalPercent + (eachPercent * winners)) > 100))) {
        alert.error('Sum of total price must be less than winning price and total percentage must be less than 100%')
        return [...sRows];
      }
      objDay[filed_name] = end_rank || 0;
      if (winAmount > 0) {
        if (objDay.each_percentage != 0) {
          objDay.each_price = (eachPercent * winAmount) / 100;
          objDay.total_percentage = eachPercent * winners;
          objDay.total_price = total_price;
        }
      }
      return [...rows];
    });
  }




  const setRemainingData = (newData) => {
    const totalDistributedAmount = newData.reduce((sum, currentItem) => sum + currentItem.total_price, 0);
    const totalDistributedPercentage = newData.reduce((sum, currentItem) => sum + currentItem.total_percentage, 0);

    const totalRemainAmount = (winAmount - totalDistributedAmount)
    const totalRemainPercentage = (100 - totalDistributedPercentage)
    return { totalRemainAmount, totalRemainPercentage, data: newData }
  }

  const handleSetData = (newData) => {
    let { totalRemainAmount, totalRemainPercentage, data } = setRemainingData(newData)

    const isLessThenZero = (totalRemainAmount) < 0 || (totalRemainPercentage < 0)
    if (isLessThenZero) {
      alert.error('Sum of total price must be less than winning price and total percentage must be less than 100%')
      return
    }

    setRows(data)
    setRemainingAmount(totalRemainAmount);
    setTotalPercentage(totalRemainPercentage);
  }
  const updateEachPrice = (i, filed_name) => e => {
    const eachPrice = parseFloat(e?.target?.value)
    const findRow = rows.find((row, index) => index === i)
    const winnersCount = findRow.end_rank - (findRow.start_rank - 1);
    const totalWinAmount = winAmount

    const total_amount = (winnersCount * eachPrice)
    const total_percentageInner = total_amount / totalWinAmount * 100
    const each_percentage = (total_percentageInner / winnersCount)
    const newData = rows.map((item, ind) => {
      if (ind === i) {
        item.total_percentage = total_percentageInner;
        item.each_percentage = parseFloat(each_percentage);
        item.each_price = parseFloat(eachPrice);
        item.total_price = total_amount;
      }
      return item
    })

    handleSetData(newData)
  }
  const handleDelete = (key) => {
    let newRows = rows.filter((item) => {
      if (item?.rand == key - 1) {
        item.is_completed = false
      }
      return item.rand < key
    })
    handleSetData(newRows)
    let lastRanks = newRows[newRows.length - 1].end_rank;
    setLastRank(lastRanks + 1);

  }




  const AddNewRow = () => {
    let len = parseInt(rows.length) - 1;

    let lasElement = rows[rows.length - 1]
    if (lasElement.end_rank == "") {
      alert.error('Please fill end rank of the last row.');
      return;
    }

    if (winAmount === 0 && rows[len].reward === '') {
      alert.error('Please enter reward in the current breakup.')
      return;
    }

    if (winAmount > 0 && (rows[len].end_rank === '' || rows[len].each_percentage === 0)) {
      alert.error('Please complete last row before add more row.')
      return;
    }
    let totalPercent = 0;
    if (winAmount > 0) {
      for (let i = 0; i < parseInt(rows.length); i++) {
        totalPercent = parseInt(totalPercent + rows[i].total_percentage);
      }
    }
    if (winAmount > 0 && totalPercent >= 100) {
      alert.error('Sum of total percent must not exceed 100 %.');
      return;
    }
    rows[len].is_completed = true;
    let newRow = [...rows, { is_completed: false, start_rank: lastRank, end_rank: '', each_percentage: 0, each_price: 0, total_percentage: 0, total_price: 0, rand: (rows.length + 1) }]
    setRows(newRow);
  }

  useEffect(() => {
    getCategory();
  }, []);


  const handleReset = () => {

    let newRow
    if(contestType !== 'free'){
      newRow = [{ is_completed: false, start_rank: 1, end_rank: '', each_percentage: 0, each_price: 0, total_percentage: 0, total_price: 0, rand: 1 }]
    }else{      
      newRow = [{ is_completed: false, start_rank: 1, end_rank: '', reward:'', rand: 1 }]
      setValue("reward[]", "")
    }


    setRows(newRow);
    setValue("end_rank[]", "")
    setValue("each_percentage[]", "")
    setTotalPercentage(0)
    setRemainingAmount(0);
  }
  const deleteItem = async () => {
    let SwalConfig = Helper.SwalConfig("You want to delete Contest");
    const result = await Swal.fire(SwalConfig);
    if (result.value) {
      let postJson = { id: contestId };
      let path = apiUrl.delete_cricket_contest;
      const fr = await Helper.post(token, postJson, path);
      const res = await fr.response.json();
      if (fr.status === 200) {
        if (res.success) {
          props.history.push('/cricket/contests');
          alert.success(res.msg);
        } else {
          alert.error(res.msg);
        }
      } else {
        alert.error(res.error);
      }
    }
  };

  const getSettings = async (id) => {
    let path = apiUrl.get_setting;
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        console.log("setGST", res.success)
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  const updateReward = (i, filed_name) => e => {
    let reward = e.target.value || '';
    setRows(sRows => {
      let objDay = sRows.find((row, index) => index === i);
      objDay[filed_name] = reward;
      return [...sRows];
    });
  }

  useEffect(() => {
    setMaxTeamJoinCount(join_multiple_team ? max_team_join_count : 1)
  }, [join_multiple_team]);

  useEffect(() => {
    getSettings();
  }, [rows])

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        {mainForm && <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Cricket Contest</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={"col-md-3 pull-left mt-2"}>
                    Contest Name
                  </Label>
                  <div className='input_grp  col-md-6'>
                    <input type="text" name="name" onInput={maxLengthCheck} minLength={"3"} maxLength={"50"} placeholder="Contest Name" autoComplete="off"
                      className="form-control " ref={register({ required: 'Required' })} />
                    {Helper.andOperator(errors.name, <p className="text-danger marginmessage">Contest Name is required</p>)}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Category</Label>
                  <div className='input_grp  col-md-6'>
                    <select name={'category'} className={"form-control "} ref={register({ required: 'Required' })}>
                      <option value={''}>-- Select Contest Category --</option>
                      {category.map((item, key) => {
                        return <option key={key} value={item.id}>{item.title}</option>
                      })};
                    </select>
                    {Helper.andOperator(errors.category, <p className="text-danger marginmessage">Contest Category is required</p>)}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Type</Label>
                  <div className='input_grp  col-md-6'>
                    <select name={'contest_type'} className={"form-control"} ref={register({ required: 'Required' })} onChange={(e) => { handleType(e) }}>
                      <option value={''}>-- Select Contest Type --</option>
                      <option value={'free'}>Free</option>
                      <option value={'paid'}>Paid</option>
                    </select>
                    {Helper.andOperator(errors.contest_type, <p className="text-danger marginmessage">Contest Type is required</p>)}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Total Winning Amount (INR)</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="number" name="winning_amount" maxLength={"9"} min={"0"} ref={register({ required: 'Required' })}
                      value={winAmount} disabled={winAmountDisable} onChange={e => { handleWinningChange(e) }} placeholder="Total Winning Amount" autoComplete="off"
                      className="form-control" onInput={maxLengthCheck} />
                    {Helper.andOperator(errors.winning_amount, <p className="text-danger marginmessage" >Total Winning Amount is required</p>)}
                    <span style={{ display: 'grid' }}>{winAmount > 0 ? _.capitalize(converter.toWords(winAmount)) : ''}</span>
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Platform Fee (%)</Label>
                  <div className='input_grp  col-md-6'>
                    <div className='d-flex'>
                      <input type="number" name="platform_fee" maxLength={"5"} min={"0"} step={"0.01"}
                        value={plateFormFee} disabled={adminProfitDisable} onChange={e => { handlePlateformFeeChange(e) }} placeholder="Admin Profilt" autoComplete="off"
                        className="form-control" ref={register({ required: 'Required' })} />
                      <div className="input-group-append">
                        <span className="input-group-text"><i className="fa fa-percent"></i></span>
                      </div>
                    </div>
                    {Helper.andOperator(errors.platform_fee, <p className="text-danger marginmessage">Admin Profilt is required</p>)}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3  mt-2'}>Users Limit</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="number" name="users_limit" maxLength={"8"} min={"0"}
                      onInput={maxLengthCheck} placeholder="Users Limit" autoComplete="off" value={usersLimit} onChange={e => { handleUsersLimitChange(e) }}
                      className="form-control" ref={register({ required: 'Required' })} />
                    {Helper.andOperator(errors.users_limit, <p className="text-danger marginmessage">Users Limit is required</p>)}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 mt-2'}>Entry Fee</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="number" name="entry_fee" maxLength={"3"} min={"0"}
                      value={enteryFee} disabled onChange={e => { setEntryFee(e.target.value) }} placeholder="Entry Fee" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required' })} />
                    {Helper.andOperator(errors.entry_fee, <p className="text-danger marginmessage">Entry Fee is required</p>)}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 mt-2'}>Bonus (%)</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="number" name="bonus"
                      maxLength={"5"}
                      min={"0"}
                      step={"0.01"}
                      value={bonus}
                      onChange={handleBonusChange}
                      disabled={winAmountDisable}
                      placeholder="Bonus" autoComplete="off"
                      className="form-control"
                      ref={register({ required: 'Required' })}
                      onKeyDown={(e) => setBonus(e.target.key)}
                    />
                    {Helper.andOperator(errors?.bonus?.type == "required", <p className="text-danger marginmessage">Bonus is required</p>)}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup className='row'>
                  <div className='input_grp  col-md-6'>
                    <input type="checkbox" name="confirm_winning" checked={confirm_winning} onChange={(e) => { setConfirmWinning(!confirm_winning) }} autoComplete="off" className="mt-2 col-md-2 pull-left" />
                    <Label className={'col-md-8'}>Confirmed winning even if the contest remains unfilled.</Label>
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup className='row'>
                  <div className='input_grp  col-md-6'>
                    <input type="checkbox" name="join_multiple_team" checked={join_multiple_team} onChange={(e) => { setJoinMultiple(!join_multiple_team) }} autoComplete="off" className="mt-2 col-md-2 pull-left" />
                    <Label className={'col-md-8 '}>Join with multiple teams.</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <div className='input_grp  col-md-6'>
                    <input type="checkbox" name="auto_create" checked={auto_create} onChange={(e) => { setAutoCreate(!auto_create) }} autoComplete="off" className="mt-2 col-md-2 pull-left" />
                    <Label className={'col-md-8'}>Auto create.</Label>
                  </div>
                </FormGroup>
              </Col>
              {join_multiple_team && <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Maximum Team Join Count</Label>
                  <div className='input_grp  col-md-6'>
                    <input type="number" name="max_team_join_count" maxLength={"3"} min={"2"} step={"1"} onInput={maxLengthCheck}
                      value={max_team_join_count} onChange={e => { handleChangeMaxTeamJoinCount(e) }} placeholder="Maximum Team Count For Join Contest" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required' })} />
                    {Helper.andOperator(errors.max_team_join_count, <p className="text-danger marginmessage">Maximum team count is required</p>)}
                  </div>
                </FormGroup>
              </Col>
              }
            </Row>
          </CardBody>
          <CardFooter>
            <Button onClick={(e) => { history.goBack() }} color="danger"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Button>
            <Button className={'ml-2'} type="submit" color="primary">Submit & Next {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>}
      </form>
      <form onSubmit={handleSubmit(onSubmitBreakup)}>
        {breakUpForm && <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Prize Breakup </h4></CardTitle>
          </CardHeader>
          <CardBody>
            <div id="reportId" >
              <Table hover bordered responsive className="mt-3 text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Start Rank</th>
                    <th>End Rank</th>
                    {(contestType !== 'free') &&
                      <>
                        <th>Price INR (each)</th>
                        <th>Percentage (each)</th>
                        <th>Total Percentage</th>
                        <th>Total Price INR </th>
                      </>
                    }
                    {contestType === 'free' && <th>Reward </th>}
                    <th>Action </th>
                  </tr>

                </thead>
                <tbody>
                  {
                    rows.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>
                            <input type="number" name="start_rank[]" maxLength={"5"} min={1}
                              value={item.start_rank} disabled placeholder="Start Rank" autoComplete="off" className="form-control" ref={register({ required: 'Required' })} />
                          </td>
                          <td>
                            <input type="number" name="end_rank[]" maxLength={"5"} min={0}
                              defaultValue={item.end_rank} disabled={item.is_completed} onBlur={updateEndRank(key, 'end_rank')} placeholder="End rank" autoComplete="off"
                              className="form-control col-md-12" ref={register({ required: 'Required' })} />
                          </td>


                          {contestType !== 'free' && (
                            <>
                              <td>
                                <input type="number" name="each_price[]" maxLength={"5"} min={0}
                                  defaultValue={0} disabled={item.is_completed} onBlur={updateEachPrice(key, 'each_price')} placeholder="Price (each)" autoComplete="off"
                                  className="form-control col-md-12" ref={register({ required: 'Required' })} />
                              </td>
                              <td>
                                <input type="number" name="each_percentage[]" maxLength={"5"} min={"0"} step={"0.01"}
                                  defaultValue={item?.each_percentage} value={item?.each_percentage?.toFixed(2)} disabled placeholder="Percentage (each)" autoComplete="off"
                                  className="form-control col-md-12" />
                              </td>
                              <td>
                                <input type="number" name="total_percentage[]" maxLength={"5"} min={"0"} step={"0.01"}
                                  value={item?.total_percentage?.toFixed(2)} disabled placeholder="Total Percentage" autoComplete="off" className="form-control" ref={register({ required: 'Required' })} />
                              </td>
                              <td>
                                <input type="number" name="total_price[]" maxLength={"10"} min={"0"} step={"0.01"}
                                  value={item.total_price} disabled placeholder="Total Price" autoComplete="off" className="form-control" ref={register({ required: 'Required' })} />
                              </td>
                            </>
                          )}

                          {contestType === 'free' &&
                            <td>
                              <input type="text" name="reward[]"  defaultValue={item.reward} placeholder="Reward" onBlur={updateReward(key, 'reward')} autoComplete="off" className="form-control" />
                            </td>
                          }

                          <td>{key !== 0 ? <span className={'btn btn-primary mt-2  ml-2 text-white'} color="primary" onClick={(e) => handleDelete(item.rand)} > Delete</span> : ''}</td>
                        </tr>
                      );
                    })
                  }
                  {contestType !== 'free' && <tr><td colSpan="5" className='text-right pr-4 remaining'><strong>Remaining Percentage : {total_percentage?.toFixed(2)}</strong></td> <td colSpan="4" className='text-left pl-4 remaining'><strong>Remaining Amount : {remaining_amount?.toFixed(2)}</strong></td></tr>}
                </tbody>
              </Table>
              <div className='bottom-outer d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center'>
                  <span className={'btn btn-primary mt-2 text-white'} color="primary" onClick={AddNewRow} > Add Row</span>
                  <span className={'btn btn-primary mt-2  ml-2 text-white'} color="primary" onClick={handleReset} > Reset</span>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
            <button onClick={(e) => { deleteItem() }} className="btn btn-sm mr-1 ml-2" type="button" title="Delete">
              Delete
            </button>
          </CardFooter>
        </Card>}
      </form>

    </React.Fragment >
  );
}

export default AddContest;
