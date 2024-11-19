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
import View from "./Action/View";
import { useAlert } from "react-alert";

const Transactions = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage,setActivePage] = useState(1);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [category_id, setQuizCategory] = useState('');
  const [query, setQuery] = useState({});
  const [exportExcel, setExportExcel] = useState('');
  const [dateSortType, setDateSortType] = useState('');

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query); 
    path = apiUrl.get_transactions + `?${queryString}`;
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
      page:page,
      itemsPerPage:itemsPerPage,
      keyword:keywords,
      start_date:(startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date:(enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')),
      status:serachstatus
    }

    setQuery(queries)
    path = apiUrl.get_transactions + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&quizCat=' + `${category_id}` + '&start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path);
  };

  const handleDateSort = async () => {
    let dateSort = '';
    if (dateSortType === 'asc') {
      setDateSortType('desc');
      dateSort = 'desc';
    } else {
      setDateSortType('asc');
      dateSort = 'asc';
    }

    const itemsPerPage = 10;
    let path;
    let page = 1;
    setActivePage(page)
    let queries = {
      page: page,
      itemsPerPage: itemsPerPage,
      keyword: keywords,
      start_date: (startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date: (enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus,
      dateSort: dateSort
    }
    setQuery(queries)
    path = apiUrl.get_transactions + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&quizCat=' + `${category_id}` + '&start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}` + '&dateSort=' + `${dateSort}`;
    getData(path);

  }
  const resetSearch = async () => {
    let path = apiUrl.get_transactions;
    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results || []);
        setTotalItems(!_.isEmpty(res.results[0])? res.results[0].totalDocs:0);
        setIsserach(false); setVisibale(false);
        setExportExcel(res.excel_path);
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
    setQuizCategory('');
    resetSearch();
    setActivePage(1);
  };
  const getStatus = (items) => {
    let statusText;
    const rowStatus = items.rows.status;
    if (rowStatus === 0) {
        statusText = 'Not paid';
    } else if (rowStatus === 1) {
        statusText = 'Pending';
    } else if (rowStatus === 2) {
        statusText = 'Success';
    } else {
        statusText = 'Failed';
    }
    return statusText;
  }

  const sortIcon = (iType) => {
    if (iType === 'asc') return <i className="fa fa-sort-down pull-right sortSpan"></i>;
    if (iType === 'desc') return <i className="fa fa-sort-up pull-right sortSpan"></i>;
    return <i className="fa fa-sort pull-right sortSpan"></i>;
};

  useEffect(() => {
    pageData();
  }, []);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              Transactions
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={9}>
                    <Form>
                      <Row>
                      <Col md={2} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={startdate === '' || startdate === null ? "" : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                              dateFormat="dd/MM/yyyy"
                              onChange={handleStartDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={enddate === '' || enddate === null ? "" : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={startdate === '' || startdate === null ? "" :  new Date(startdate)}
                              onChange={handleEndDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <select type="text" placeholder="Status" className="form-control" value={serachstatus}
                              onChange={(e) => { setSerachStatus(e.target.value) }} >
                              <option value="">-- Select Transaction Status --</option>
                              <option value={0}>Not Paid yet</option>
                              <option value={1}>Success</option>
                              <option value={2}>Pending</option>
                              <option value={3}>Failed</option>
                            </select>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col xl={3} className="text-xl-right ">
                        <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                        <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Col md={3}>
                    <a href={exportExcel} download>
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
                      <th className="text-right">Amount</th>
                      <th className="text-left">Order Id</th>
                      <th className="text-right">TransactionID</th>
                      <th className="text-left">Coupon</th>
                      <th className="text-right">Cashback</th>
                      <th className="text-left">Type</th>
                      <th className="text-left">Currency</th>
                      <th className="text-center">Status</th>

                      <th className="text-center">
                          Created At
                          <span onClick={handleDateSort}>
                              {sortIcon(dateSortType)}
                          </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.rows.full_name}</td>
                          <td className="text-right">{item.rows.txn_amount}</td>
                          <td className="text-left">{item.rows.order_id}</td>
                          <td className="text-right">{item.rows.txn_id}</td>
                          <td className="text-left">{(!_.isSet(item.rows.coupon_code) || item.rows.coupon_code == '') ? 'N/A' : item.rows.coupon_code}</td>
                          <td className="text-right">{(!_.isSet(item.rows.coupon_cashback_amount) || item.rows.coupon_cashback_amount == '') ? 0 : item.rows.coupon_cashback_amount}</td>
                          <td className="text-left">{
                            _.startCase(_.camelCase(_.replace(item.rows.txn_type, '_', ' ')))
                          }</td>
                          <td className="text-center text-left">INR</td>
                          <td>
                            {getStatus(item)}
                          </td>
                          <td className="text-center">{moment(item.rows.created_at).format('LLL')}</td>
                          <td className="text-center w-40">
                            {
                              _.isEmpty(props.match.params.id) ?
                                <div>
                                  <View item={item.rows} fullname={item.rows.first_name + ' ' + item.rows.last_name} />
                                </div>
                                : null
                            }
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

export default Transactions;
