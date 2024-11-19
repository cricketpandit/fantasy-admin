
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import Helper from '../../constants/helper';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
const EditCricketSeasonContest = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();
  const [token] = useState(session.token);
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [contestCategory, setContestCategory] = useState([]);
  const [contestCategoryId, setContestCategoryId] = useState(null);
  const [enteryFee, setEntryFee] = useState(0);
  const [winAmount, setwinAmount] = useState(0);
  const [plateFormFee, setPlateFormFee] = useState('0');
  const [GST] = useState('10');
  const [totalAdminFee, setTotalAdminFee] = useState('0');
  const [usersLimit, setUsersLimit] = useState(1);
  const [category, setCategory] = useState([]);
  const [leagueId, setLeagueId] = useState(null);
   const [quizData, setQuizData] = useState({});
  const [bonus, setBonus] = useState(0);
  const [max_team_join_count, setMaxTeamJoinCount] = useState('');

  const getSeriesList = async () => {
    const path = apiUrl.get_cricket_series;
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setCategory(res.results || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  }

  const getCategory = async () => {
    let path = apiUrl.get_active_cricket_categories;
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setContestCategory(res.results || []);
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.error);
    }

  }

  const onSubmit = async data => {
    setLoading(true);
    let postJson = {
      id: id,
      name: data.name.trim(),
      categoryType: 'pro',
      category_id: data.category,
      series_id: Number(data.series_id),
      contest_type: 'paid',
      entry_fee: data.entry_fee,
      winning_amount: data.winning_amount,
      admin_profit: totalAdminFee,
      plateform_Fee: plateFormFee,
      bonus: bonus,
      max_team_join_count: max_team_join_count,
      users_limit: usersLimit,
    };
    let path = apiUrl.update_cricket_season_contest;
    const fr = await Helper.put(token,postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/cricket/season-contests');
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
    let path = apiUrl.get_cricket_season_contest + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setId(res.results.id);
        setQuizData(res.results);
        setEntryFee(res.results.entry_fee);
        setBonus(res.results.bonus);
        setMaxTeamJoinCount(res.results.max_team_join_count);
        setwinAmount(res.results.winning_amount);
 
        setLeagueId(res.results.series_id);
        setContestCategoryId(res?.results?.category_id?.id);
        setTotalAdminFee(res.results.admin_profit);
        setPlateFormFee(res.results.plateform_Fee);
        setUsersLimit(res.results.users_limit);
      } else {
        alert.error(res.msg);

      }
    } else {
      console.log(res.msg);
    }
  };

  const handleWinningChange = async (e) => {
    let win_amount = parseInt(e.target.value);
    let platform_fee = (winAmount * plateFormFee / 100);
    let GST_Fee = (platform_fee * GST / 100);
    let entryFee = (win_amount + platform_fee + GST_Fee) / usersLimit
    entryFee = Math.ceil(entryFee);
    setEntryFee(entryFee.toFixed(2) || 0);
    setwinAmount(win_amount || 0);
    setTotalAdminFee(((platform_fee + GST_Fee) * 100) / win_amount);
  }
  const handlePlateformFeeChange = async (e) => {
    let plateform_fee_per = parseFloat(e.target.value);
    let platform_fee = (winAmount * plateform_fee_per / 100);
    let GST_Fee = (platform_fee * GST / 100);
    let entryFee = (winAmount + platform_fee + GST_Fee) / usersLimit
    entryFee = Math.ceil(entryFee);
    setEntryFee(entryFee.toFixed(2) || 0);
    setPlateFormFee(plateform_fee_per || '');
    setTotalAdminFee(((platform_fee + GST_Fee) * 100) / winAmount);
  }

  const handleUsersLimitChange = async (e) => {
    let users_limit = parseInt(e.target.value);
    let platform_fee = (winAmount * plateFormFee / 100);
    let GST_Fee = (platform_fee * GST / 100);
    let entryFee = (winAmount + platform_fee + GST_Fee) / users_limit
    entryFee = Math.ceil(entryFee);
    setEntryFee(entryFee.toFixed(2) || 0);
    setUsersLimit(users_limit);
  }


  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

  useEffect(() => {
    getData();
    getSeriesList();
    getCategory()
  }, []);

  return (
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Edit Cricket Contest</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Name</Label>
                  <input type="text" name="name" placeholder="Contest Name" autoComplete="off"
                    className="form-control col-md-6" defaultValue={quizData.name} ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Contest Name is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>

                  <Label className={'col-md-3 pull-left mt-2'}>Contest Category</Label>
                  <div className='input_grp  col-md-6'>
                    <select name={'category'} className={"form-control"} value={contestCategoryId} onChange={(e) => setContestCategoryId(e.target.value)} ref={register({ required: 'Required' })}>
                      <option value={''}>-- Select Contest Type --</option>
                      {contestCategory.map((item, key) => {
                        return <option key={key} value={item.id}>{item.title}</option>
                      })};
                    </select>
                    {errors.category && <p className="text-danger marginmessage">Contest Category is required</p>}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className='row'>
                  <Label className={'col-md-3 pull-left mt-2'}>Select Series/League</Label>
                  <div className='input_grp  col-md-6'>
                    <select name={'series_id'} className={"form-control "} disabled ref={register({ required: 'Required' })} value={leagueId} onChange={(e) => setLeagueId(e.target.value)}>
                      <option value={''}>-- Select Series --</option>
                      {category.map((item, key) => {
                        return <option key={key} value={item.id_api}>{item.name}</option>
                      })};
                    </select>
                    {errors.series_id && <p className="text-danger marginmessage">Contest League is required</p>}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Total Winning Amount</Label>
                  <input type="number" name="winning_amount" maxLength={"3"} min={"0"}
                    value={winAmount} disabled onChange={e => { handleWinningChange(e) }} placeholder="Total Winning Amount" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage" >Total Winning Amount is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Platform Fee (%)</Label>
                  <div className="input-group col-md-6 p-0">
                    <input type="number" name="platform_fee" maxLength={"5"} min={"0"} step={"0.01"}
                      value={plateFormFee} disabled onChange={e => { handlePlateformFeeChange(e) }} placeholder="Admin Profilt" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required' })} />
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa fa-percent"></i></span>
                    </div>
                  </div>
                  {errors.title && <p className="text-danger marginmessage">Admin Profilt is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>GST(%)</Label>
                  <div className="input-group col-md-6 p-0">
                    <input type="number" name="gst_value" maxLength={"5"} min={"0"} step={"0.01"} disabled
                      value={GST} placeholder="GST Applied" autoComplete="off"
                      className="form-control " ref={register({ required: 'Required' })} />
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa fa-percent"></i></span>
                    </div>
                  </div>
                  {errors.title && <p className="text-danger marginmessage">GST is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Total Admin Fee (%)</Label>
                  <div className="input-group col-md-6 p-0">
                    <input type="number" name="admin_profit" maxLength={"5"} min={"0"} step={"0.01"}
                      value={totalAdminFee} disabled placeholder="Admin Fee" autoComplete="off"
                      className="form-control " ref={register({ required: 'Required' })} />
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa fa-percent"></i></span>
                    </div>
                  </div>
                  {errors.title && <p className="text-danger marginmessage">Admin Fee is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Users Limit</Label>
                  <input type="number" name="users_limit" maxLength={"3"} min={"0"} onInput={maxLengthCheck}
                    value={usersLimit} onChange={e => { handleUsersLimitChange(e) }} placeholder="Users Limit" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Users Limit is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Entry Fee</Label>
                  <input type="number" name="entry_fee" maxLength={"3"} min={"0"}
                    value={enteryFee} disabled onChange={e => { setEntryFee(e.target.value) }} placeholder="Entry Fee" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Entry Fee is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Bonus (%)</Label>
                  <input type="number" name="bonus" maxLength={"5"} min={"0"} step={"0.01"}
                    value={bonus} onChange={e => { setBonus(e.target.value) }} placeholder="Bonus used" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.bonus && <p className="text-danger marginmessage">Bonus is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Maximum Team Join Count</Label>
                  <input type="number" name="max_team_join_count" maxLength={"3"} min={"2"} step={"1"} onInput={maxLengthCheck}
                    value={max_team_join_count} onChange={e => { setMaxTeamJoinCount(e.target.value) }} placeholder="Maximum Team Count For Join Contest" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.max_team_join_count && <p className="text-danger marginmessage">Maximum team count is required</p>}
                </FormGroup>
              </Col>
              {/* } */}
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

export default EditCricketSeasonContest;
