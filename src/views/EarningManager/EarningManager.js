import React, { useState, useEffect } from 'react';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import { useAlert } from "react-alert";

const EarningManager = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [category_id] = useState('');
  const [type, setType] = useState('');


  const getData = async (page = activepage) => {
    setVisibale(true);
setActivePage(page)
    const itemsPerPage = 10;
    let path;
    if (props.match.params.id) {
      path = apiUrl.get_statements + '/' + `${props.match.params.id}` + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    } else {
      path = apiUrl.get_statements + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    }
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setVisibale(false)
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }

  };


  useEffect(() => {
    getData();
  }, []);

  const handleStartDate = (date) => {
    setEndDate('');
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const handleSearching = async () => {
    setIsserach(true);
    const itemsPerPage = 10;
    let path;
    if (props.match.params.id) {
      path = apiUrl.get_statements + '/' + `${props.match.params.id}` + '?page=' + `${activepage}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    } else {
      path = apiUrl.get_statements + '?page=' + `${activepage}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&statement_type=' + `${type}` + '&quizCat=' + `${category_id}` + '&start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    }
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.totalItems);
        setIsserach(false);
      } else {
        alert.error(res.msg);
        setIsserach(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false);
    }
  };
  const onReset = (e) => {
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
    setType('');
    getData();
  };

  const getItemTypeLabel = (sType) => {
    switch (sType) {
      case 'open_account':
        return 'Account Open';
      case 'wallet_deposit':
        return 'Wallet Deposit';
      case 'quiz':
        return 'Quiz Statement';
      case 'contest':
        return 'Contest Statement';
      case 'bonus':
        return 'Bonus';
      case 'refer':
        return 'Referrals';
      default:
        return 'Wallet Withdraw';
    }
  };

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <i className="fa fa-list" /> Account Statements
              </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={8}>
                    <Form>
                      <Row>
                        <Col md={3}>
                          <FormGroup>
                            <Input type="text" placeholder="Keyword" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <select name={'statement_type'} className={"form-control"} value={type} onChange={(e) => { setType(e.target.value); }} >
                              <option value={''}>-- Select Statement Type --</option>
                              <option value='open_account'>Account Open</option>
                              <option value='wallet_deposit'>Wallet Deposit</option>
                              <option value='contest'>Contest Statement</option>
                              <option value='bonus'>Bonus</option>
                              <option value='refer'>Referrals</option>
                              <option value='withdraw'>Wallet Withdraw</option>
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <DatePicker selected={startdate === '' || startdate === null ? "" : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                              dateFormat="dd/MM/yyyy"
                              // maxDate={new Date()}
                              onChange={handleStartDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <DatePicker selected={enddate === '' || enddate === null  ? "" : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={startdate === '' || startdate === null ? "" : new Date(startdate)}
                              // maxDate={new Date()}
                              onChange={handleEndDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col lg={4}>
                    <Row>
                      <Col md={12}>
                        <button className="btn btn-primary mr-1 col-md-5" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                        <button className="btn btn-success col-md-5" type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Match Name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Total Contest</th>
                      <th>Total Team</th>
                      <th>Amount INR</th>
                      <th>Bonus INR</th>
                      <th>Winning Distribution INR</th>
                      <th>Total Earning INR</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>{item.user_id.first_name + ' ' + item.user_id.last_name}</td>
                          <td>{item.debit}</td>
                          <td>{item.credit}</td>
                          <td>{item.balance.toFixed(2)}</td>
                          <td>{getItemTypeLabel(item.type)}</td>
                          <td>{item.remarks}</td>
                          <td>{moment(item.createdAt).format('LLL')}</td>
                          <td className="w-40">
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(users) && <div className="show-pagination technician-page">
                <Pagination
                  activeClass={""}
                  activeLinkClass={"page-link active"}
                  itemClass={"page-item"}
                  linkClass={"page-link"}
                  activePage={activepage}
                  itemsCountPerPage={10}
                  totalItemsCount={Number(totalitems)}
                  pageRangeDisplayed={4}
                  prevPageText="Previous"
                  nextPageText="Next"
                  firstPageText="<"
                  lastPageText=">"
                  onChange={getData}
                />
              </div>}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EarningManager;
