import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, FormGroup } from 'reactstrap';
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../../CommanPage/Loader'
import useSession from "react-session-hook";
import { useAlert } from "react-alert";

const CricketSeasonEarningManager = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [contests, setContests] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [totalEarning, setTotalEarning] = useState(0);
  const [activepage, setActivePage] = useState(1);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [series_id, setSeriesId] = useState('');
  const [match_id, setMatchId] = useState('');
  const [contest_id, setContestId] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [category_id] = useState('');
  const [isserach, setIsserach] = useState(false);
  const [type, setType] = useState('');
  const [dropdown, setDropdown] = useState([]);
  const [contest_dropdown, setContestDropdown] = useState([]);
  const [query, setQuery] = useState({});
  const [exportExcel, setExportExcel] = useState('');

  let TotalEarning = 0;
  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    setActivePage(page)
    let path;
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_cricket_season_earning + `?${queryString}`;
    getData(path)
  };

  const getSeriesData = async () => {
    setVisibale(true);
    let path;
    path = apiUrl.get_series;

    const fr = await Helper.get(token,path);
    const res = await fr.response.json();

    if (fr.status === 200) {

      if (res.success) {
        setDropdown(res.results || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };
  const getContest = async () => {
    setVisibale(true);
    let path;
    path = apiUrl.get_all_cricket_season_constest;

    const fr = await Helper.get(token,path);
    const res = await fr.response.json();

    if (fr.status === 200) {
   
      if (res.success) {
        setContestDropdown(res.results || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  useEffect(() => {
    pageData();
    getSeriesData();
    getContest();
  }, []);

  const handleChange = async (e) => {
    if (e.target.name === 'series_id') {
      setSeriesId(e.target.value);
    } else if (e.target.name === 'contest_id') {
      setContestId(e.target.value);
    }
  }

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
      series_id: series_id,
      match_id: match_id,
      contest_id: contest_id,
      start_date: (startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date: (enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    setQuery(queries)

    path = apiUrl.get_cricket_season_earning + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&statement_type=' + `${type}` + '&quizCat=' + `${category_id}` + '&start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}` + '&series_id=' + `${series_id}` + '&match_id=' + `${match_id}` + '&contest_id=' + `${contest_id}`;
    getData(path)
  };

  const getData = async (path) => {
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setContests(res.results || []);
        setTotalItems(res.totalRecords);
        setTotalEarning(res.TotalEarning);
        setExportExcel(res.excel_path);
        setVisibale(false)
        setIsserach(false);
      } else {
        alert.error(res.msg);
        setIsserach(false);
        setVisibale(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false);
    }
  };

  const resetSearch = async () => {
    let path = apiUrl.get_cricket_season_earning + '?page=1&itemsPerPage=10';
    getData(path)
  }

  const onReset = (e) => {
    setQuery({})
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
    setType('');
    getData();
    setSeriesId('');
    setMatchId('');
    setContestId('');
    resetSearch();
    setActivePage(1);
  };

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <i className="fa fa-list" /> Cricket Season Earning Manager
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={12}>
                    <Form>
                      <Row>
                        <Col md={3}>
                          <FormGroup className="mb-xl-0">
                            <select className={"form-control"} value={series_id} name="series_id" onChange={handleChange}>
                              <option value={""}>Select Series</option>
                              {
                                dropdown.map((types, index) => {
                                  return (
                                    types?.is_contest_created &&
                                    <option key={index} value={types.id_api}>{types.name}</option>
                                    )
                                })
                              }
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup className="mb-xl-0">
                            <select className={"form-control"} value={contest_id} name="contest_id" onChange={handleChange}>
                              <option value={""}>Select Contest</option>
                              {
                                contest_dropdown.map((item, index) => {
                                  return <option key={index} value={item.id}>{item.name} </option>
                                })
                              }
                            </select>
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

                        <Col md={6}>
                          <button className="btn btn-primary mr-1 col-md-5 mb-3 mb-md-0" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                          <button className="btn dark_btn  col-md-5" type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                        </Col>

                      </Row>
                    </Form>
                  </Col>

                </Row>
                <br></br>
                <Row>
                  <Col md={3}>
                    <a href={exportExcel} download >
                      <button className="btn btn-primary mr-1 col-md-12" type="button"><i className="fa fa-file-excel-o" /> Export Excel</button>
                    </a>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr className='firstthead'>
                      <th colSpan="8"> </th>
                      <th>Total Earning : </th>
                      <th>{totalEarning.toFixed(2)}</th>
                    </tr>

                    <tr>
                      <th>Sr.No</th>
                      <th>Match Name</th>
                      <th>Match Date</th>
                      <th>Match Status</th>
                      <th>Total Contest</th>
                      <th>Total Team</th>
                      <th>Amount (INR)</th>
                      <th>Bonus (INR)</th>
                      <th>Winning Distribution (INR)</th>
                      <th>Total Earning (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      contests.map((item, key) => {
                        let bonusAmount = item.bonus === 0 ? 0 : item.bonus;
                        let totalEntry = item.entry_fee;
                        let totalEarn = totalEntry - (bonusAmount) - item.winning_amount;
                        TotalEarning = TotalEarning + totalEarn;
                        return (
                          <tr key={key}>
                            <td>{key + 1}</td>
                            <td>{item.localteam} Vs {item.visitorteam}</td>
                            <td>{moment(item.date).format('LLL')}</td>
                            <td>{item.match_status}</td>
                            <td>{item.contest_count}</td>
                            <td>{item.team_count}</td>
                            <td>{item.entry_fee.toFixed(2)}</td>
                            <td>{item.bonus.toFixed(2)}</td>
                            <td>{item.winning_amount.toFixed(2)}</td>
                            <td>{totalEarn.toFixed(2)}</td>
                          </tr>
                        )
                      })}
                    {_.isEmpty(contests) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(contests) && <div className="show-pagination technician-page">
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

export default CricketSeasonEarningManager;
