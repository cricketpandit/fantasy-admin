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

const AccountStatement = (props) => {
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
  const [types, setType] = useState('');
  const [query, setQuery] = useState({});
  const [exportExcel, setExportExcel] = useState('');

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    if (typeof (props.match.params.userId) !== 'undefined') {
      query["user"] = props.match.params.userId
    }
    let queryString = Helper.serialize(query);
    path = apiUrl.get_statements + `?${queryString}`;
    getData(path)
  };


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
    let page = 1;
    setActivePage(page)
    let queries = {
      page: page,
      itemsPerPage: itemsPerPage,
      keyword: keywords,
      statement_type: types,
      quizCat: category_id,
      account_start_date: (startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')),
      account_end_date: (enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    setQuery(queries)
    let user_id = ''
    if (typeof (props.match.params.userId) !== 'undefined') {
      user_id = props.match.params.userId
    }
    path = apiUrl.get_statements + '?user=' + `${user_id}` + '&page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&statement_type=' + `${types}` + '&quizCat=' + `${category_id}` + '&account_start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&account_end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path)
  };

  const resetSearch = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    if (typeof (props.match.params.userId) !== 'undefined') {
      query["user"] = props.match.params.userId
    }
    Helper.serialize(query);
    path = apiUrl.get_statements;

    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results || []);
        setExportExcel(res.excel_path);
        setTotalItems(!_.isEmpty(res.results[0]) ? res.results[0].totalDocs : 0);
        setIsserach(false); setVisibale(false);
      } else {
        alert.error(res.msg);
        setIsserach(false); setVisibale(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false); setVisibale(false);
    }
  }

  const onReset = (e) => {
    setQuery({})
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
    setType('');
    resetSearch(1);
    setActivePage(1);
  };
  useEffect(() => {
    pageData();
  }, [props]);

  const getTypeLabel = (labelType) => {
    const typeMappings = {
      open_account: 'Account Open',
      wallet_deposit: 'Wallet Deposit',
      quiz: 'Quiz Statement',
      contest: 'Contest Statement',
      bonus: 'Bonus',
      refer: 'Referrals',
      withdraw: 'Wallet Withdraw',
      winning: 'Winning',
      sign_in_bonus: 'Sign in bonus',
      cricket_contest: 'Cricket Contest',
      entry_fees: 'Entry Fees',
      package_purchase: 'Subscription Purchase',
    };
  
    return typeMappings[labelType] || '';
  };
  
  const UserRow = ({ item }) => {
    const {
      full_name,
      username,
      email,
      // phone,
      debit,
      credit,
      balance,
      type,
      remarks,
      createdAt,
    } = item.rows;
  
    return (
      <tr>
        <td className="text-left">{full_name}</td>
        <td className="text-left">{username}</td>
        <td className="text-left">{email}</td>
        {/* <td className="text-right">{phone}</td> */}
        <td className="text-right">{debit}</td>
        <td className="text-right">{credit}</td>
        <td className="text-right">{balance.toFixed(2)}</td>
        <td className="text-left">{getTypeLabel(type)}</td>
        <td className="text-left">{remarks}</td>
        <td className="text-center">{moment(createdAt).format('LLL')}</td>
      </tr>
    );
  };

  const UsersTable = ({ endUsers }) => {
    return (
        <>
          {endUsers.map((item, key) => (
            <UserRow key={key} item={item} />
          ))}
        </>
    );
  };

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              Account Statements
              </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={8} className="multiple-column">
                    <Form>
                      <Row>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <select name={'statement_type'} className={"form-control"} value={types} onChange={(e) => { setType(e.target.value); }} >
                              <option value={''}>-- Statement Type --</option>
                              <option value='open_account'>Account Open</option>
                              <option value='wallet_deposit'>Wallet Deposit</option>
                              <option value='contest'>Contest Statement</option>
                              <option value='cricket_contest'>Contest Winning</option>
                              <option value='entry_fees'>Entry Fees</option>
                              <option value='bonus'>Bonus</option>
                              <option value='refer'>Referrals</option>
                              <option value='withdraw'>Wallet Withdraw</option>
                              <option value='winning'>Admin Update Winning</option>
                              <option value='sign_in_bonus'>Sign In Bonus</option>                              
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={startdate === '' || startdate == null ? null : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                              dateFormat="dd/MM/yyyy"
                              onChange={handleStartDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={enddate === '' || enddate == null ? null : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={new Date(startdate)}
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
                  <Col xl={4} className="d-flex">
                    <button className="btn btn-primary ml-1 flex-grow-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                    <button className="btn dark_btn ml-1 flex-grow-1" type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Col md={3}>
                    <a href={exportExcel} download target='blank'>
                      <button className="btn btn-primary mr-1 col-md-12" type="button"><i className="fa fa-file-excel-o" /> Export Excel</button>
                    </a>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Full Name</th>
                      <th className="text-left">Username</th>
                      <th className="text-left">Email</th>
                      {/* <th className="text-right">Phone</th> */}
                      <th className="text-right">Debit (INR)</th>
                      <th className="text-right">Credit (INR)</th>
                      <th className="text-right">Balance (INR)</th>
                      <th className="text-left">Type</th>
                      <th className="text-left">Remark</th>
                      <th className="text-center">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                  <UsersTable endUsers={users} />
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
                  onChange={pageData}
                />
              </div>}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AccountStatement;
