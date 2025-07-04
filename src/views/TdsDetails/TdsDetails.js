import React, { useState, useEffect } from 'react';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import { useAlert } from "react-alert";
import moment from "moment-timezone";

const TdsDetails = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [tds_details, setTdsDetail] = useState([]);
  const [totalitems, setTotalItems] = useState(1);
  const [activepage, setActivePage] = useState(1);
  const [keywords, setKeyWords] = useState('');
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [exportExcel, setExportExcel] = useState('');
  const [keywordsTrim, setKeyWordsTrim] = useState('');

  const getData = async (page = activepage) => {
    setVisibale(true);
    setActivePage(page)
    const itemsPerPage = 10;
    let path;

    path = apiUrl.tds_details + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;

    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setTdsDetail(res?.results || []);
        setExportExcel(res?.excel_path);
        setTotalItems(
          !_.isEmpty(res.results[0]) ? parseInt(res.results[0].totalDocs) : 0
        );
        setVisibale(false);
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }

  };

  const handleSearching = async () => {
    setIsserach(true);
    const itemsPerPage = 10;
    let path;
    path = apiUrl.tds_details + '?page=' + `${activepage}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')}`;

    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        console.log('res.results', res.results)
        setTdsDetail(res.results || []);
        setIsserach(false);
        setExportExcel(res.excel_path);
        setTotalItems(
          !_.isEmpty(res.results[0]) ? parseInt(res.results[0].totalDocs) : 0
        );
      } else {
        alert.error(res.msg);
        setIsserach(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false);
    }
  };
  const handleStartDate = (date) => {
    setEndDate('');
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };
  const onReset = (e) => {
    setKeyWords('');
    setStartDate('');
    setEndDate('');
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              TDS Details
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={9}>
                    <Form>
                      <Row>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value); setKeyWordsTrim(e.target.value.trim()) }} />
                          </FormGroup>
                        </Col>

                        <Col md={3}>
                          <FormGroup>
                            <DatePicker selected={startdate === '' ? null : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                              dateFormat="dd/MM/yyyy"
                              maxDate={new Date()}
                              onChange={handleStartDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <DatePicker selected={enddate === '' ? null : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={new Date(startdate)}
                              maxDate={new Date()}
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
                  <Col xl={3} className="text-xl-right ">
                    <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                    <button className="btn dark_btn ml-1 "  /* disabled={(( keywordsTrim.length > 0) ? false : true) } */ type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Col md={3}>
                    <a href={exportExcel} download>
                      <button disabled={tds_details?.length > 0 ? false : true} className="btn btn-primary mr-1 col-md-12" type="button"><i className="fa fa-file-excel-o" /> Export Excel</button>
                    </a>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">User Name</th>
                      <th className="text-left">User Email</th>
                      <th className="text-left">PAN Number</th>
                      <th className="text-right">Current Winning (INR)</th>
                      <th className="text-right">Current Deposit (INR)</th>
                      <th className="text-right">Current Wallet Balance (Without Bonus) (INR)</th>
                      <th className="text-right">Requested Amount (INR)</th>
                      <th className="text-center">Withdrawl Date</th>
                      <th className="text-right">TDS Amount (INR)</th>
                      <th className="text-right">Payout Amount (INR)</th>
                      <th className="text-right">Total TDS Till Now (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tds_details.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.rows?.full_name}</td>
                          <td className="text-left">{item.rows?.email}</td>
                          <td className="text-left">{item?.rows?.pan_number ? atob(item?.rows?.pan_number) : 'N/A'}</td>
                          <td className="text-right">{item.rows?.currentWinnings}</td>
                          <td className="text-right">{item.rows?.depositAmount}</td>
                          <td className="text-right">{item.rows?.currentWalletBalance}</td>
                          <td className="text-right">{item.rows?.withdrawAmount}</td>
                          <td className="text-center">{moment(item?.rows?.winning_date).format('LLL')}</td>
                          <td className="text-right">{item.rows?.tds_amount}</td>
                          <td className="text-right">{item.rows?.win_tds_amount}</td>
                          <td className="text-right">{item.rows?.totalTdsTillNow}</td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(tds_details) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(tds_details) && <div className="show-pagination technician-page">
                <Pagination
                  activeClass={""}
                  activeLinkClass={"page-link active"}
                  itemClass={"page-item"}
                  linkClass={"page-link"}
                  activePage={activepage}
                  itemsCountPerPage={10}
                  totalItemsCount={totalitems}
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
    </div >
  );
};

export default TdsDetails;
