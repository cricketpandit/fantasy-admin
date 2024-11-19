import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
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
import Status from './Action/Status';
import Delete from './Action/Delete';
import { useAlert } from "react-alert";

const CricketCategory = (props) => {
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
  const [query, setQuery] = useState({});

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query); 
    path = apiUrl.get_cricket_categories + `?${queryString}`;
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
      start_date:(startdate == '' || startdate == null  ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date:(enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')),
      status:serachstatus
    }
    setQuery(queries)    
    path = apiUrl.get_cricket_categories + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path)    
  };

  const resetSearch = async () => {
    let path = apiUrl.get_cricket_categories + '?page=1&itemsPerPage=10';
    getData(path)
  }  

  const getData = async (path) => {
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setVisibale(false)
        setIsserach(false);
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
    resetSearch();
    setActivePage(1);
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
            <CardHeader className="align-items-center d-flex">
              Cricket Categories
              <div className="ml-auto">
                <Link to="/cricket/add-category" className="btn btn-primary">           
                  <i className="fa fa-plus mr-1"></i>Add Cricket Category
                </Link>   
              </div>
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={10} className="multiple-column">
                    <Form>
                      <Row>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Title" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={startdate == '' || startdate == null ? "" : new Date(startdate)} className="form-control" placeholderText=" Start Date"
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
                            <DatePicker selected={enddate == '' || enddate == null ? "" : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={startdate == '' || startdate == null ? "" : new Date(startdate)}
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
                              <option value="">Select User Status</option>
                              <option value='active'>Active</option>
                              <option value='inactive'>Inactive</option>
                            </select>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col xl={2} className="d-flex">
                        <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                        <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Title</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Created At</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.title}</td>
                          <td className="text-center">
                            <Status item={item} refreshData={pageData} />
                          </td>
                          <td className="text-center">{moment(item.created_at).format('LLL')}</td>
                          <td className="text-center w-40">
                            {
                              _.isEmpty(props.match.params.id) ?
                                <div>
                                  <Delete item={item} refreshData={pageData} />
                                  <Link to={{ pathname: `/cricket/edit-category/${item.id}` }} className="btn-link">
                                    <button className="btn circle_btn btn-sm mr-1" type="button" title="Edit">
                                      <i className="fa fa-pencil" />
                                    </button>
                                  </Link>
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="6"><div className="text-center">No Record Found</div></td></tr>}
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

export default CricketCategory;
