import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Helper from "../../constants/helper";
import apiUrl from "../../constants/apiPath";
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, FormGroup } from "reactstrap";
import _ from "lodash";
 import "react-datepicker/dist/react-datepicker.css";
import Loaders from "../CommanPage/Loader";
 import useSession from "react-session-hook";
import Status from "./Action/Status";
import Delete from "./Action/Delete";
import View from "./Action/View";
import { useAlert } from "react-alert";

const Questions = (props) => {
  const session = useSession();
  const [questionType, setQuestionType] = useState('liveEvent')
  const [categoryList, setCategoryList] = useState([])
  const [categoryName, setCategoryName] = useState('cricket')
  const [selectedCategory, setSelectedCategory] = useState('')
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState("");
  const [activepage, setActivePage] = useState(1);
   const [serachstatus, setSerachStatus] = useState("");
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
    const [query] = useState({});
   const [questionData, setQuestionData] = useState(null);
  const [modal, setModal] = useState(false);
  const pageData = async (page, type, category, name) => {
    
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page);
    query["page"] = page;
    query["itemsPerPage"] = itemsPerPage;
    query["type"] = type ? type : questionType;
    query["categoryId"] = category ? category : selectedCategory;
    query["status"] = serachstatus;
    let queryString = Helper.serialize(query);
    path = apiUrl.get_questions + `?${queryString}`;
    getData(path);
  };
  const getSeriesData = async () => {
    setVisibale(true);
    let path;
    path = apiUrl.get_all_series;
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {

      if (!res.success) {
        alert.error(res.msg);
       } 
    } else {
      alert.error(res.error);
    }
  };

 

  const getData = async (path) => {
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results || []);
        setTotalItems(!_.isEmpty(res.results[0]) ? res.results[0].totalDocs : 0);
        
        setVisibale(false);
      } else {
        alert.error(res.msg);
       
        setVisibale(false);
      }
    } else {
      alert.error(res.error);
     
      setVisibale(false);
    }
  };

  const handleQuestionData = (data) => {
    setQuestionData(data)
    setModal(true)
  }
  const handleCloseModal = () => {
    setModal(false)
  }

  const onReset = (e) => {
     setSelectedCategory('')
     setQuestionType('liveEvent')
     setSerachStatus("");
     setActivePage(1);
      handleGetCategoryList('liveEvent', false, true)
    setCategoryName('cricket')
  };

  useEffect(() => {

    getSeriesData();
    handleGetCategoryList('liveEvent', true)
  }, []);

  const handleQuestionType = (type) => {
    setQuestionType(type)
    handleGetCategoryList(type)
    pageData(activepage, type)
    setSelectedCategory('')
    setCategoryName('cricket')

  }

  const handleGetCategoryList = async (value, refresh, reset) => {
    let path;
    path = apiUrl.getQuizCategoryByType;
    const fr = await Helper.post(token, { type: value }, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setCategoryList(res?.results)
        if (refresh) {
          pageData(activepage, questionType, res?.results[0]?._id)
          setSelectedCategory(res?.results[0]?._id)
        }
        if (reset) {
          pageData(1, 'liveEvent', res?.results[0]?._id)
          setSelectedCategory(res?.results[0]?._id)
        }
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  const handleSelectedCategory = (value) => {
    setSelectedCategory(value)
    setCategoryName(categoryList?.find((item) => item?._id === value)?.title.toLowerCase())
    pageData(activepage, questionType, value, categoryList?.find((item) => item?._id === value)?.title.toLowerCase())
  }

 
  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">
              Questions
              <div className="ml-auto">
                <Link to="/add-question" className="btn btn-primary">
                  <i className="fa fa-plus mr-1"></i>Add Question
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={9}>
                    <Form>
                      <Row>
                        <Col md={4} sm={3}>
                          <FormGroup className="mb-xl-0">
                            <select
                              type="text"
                              placeholder="Status"
                              className="form-control"
                              value={questionType}
                              onChange={(e) => {
                                handleQuestionType(e.target.value);
                              }}
                            >
                              <option value="liveEvent">Live Events</option>
                              <option value="perception">Perception</option>
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={4} sm={3}>
                          <FormGroup className="mb-xl-0">
                            <select
                              type="text"
                              placeholder="Status"
                              className="form-control"
                              value={selectedCategory}
                              onChange={(e) => {
                                handleSelectedCategory(e.target.value);
                              }}
                            >
                              <option value="">Select Category</option>
                              {categoryList?.map((item, i) => {
                                return (
                                  <option key={i} value={item?._id}>{item?.title}</option>
                                )
                              })}
                            </select>
                          </FormGroup>
                        </Col>
                      
                      </Row>
                    </Form>
                  </Col>
                  <Col xl={3} className="text-xl-right">
                 
                    <button
                      className="btn dark_btn ml-1 "
                      type="button"
                      onClick={(e) => {
                        onReset();
                      }}
                    >
                      <i className="fa fa-undo" /> Reset
                    </button>
                  </Col>

                </Row>
              </div>
              <div id="reportId">
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      { questionType === 'liveEvent' && categoryName === 'cricket' &&
                        <>
                          <th className="text-left">Series Name</th>
                          <th className="text-left">Match ID</th>
                          <th className="text-left">Match Name</th>
                          <th className="text-left">Match Status</th>
                        </>
                      }
                      <th className="text-left">Question Last Time</th>
                      <th className="text-left">Question</th>
                      <th className="text-left">Option A</th>
                      <th className="text-left">Option B</th>
                      <th className="text-right">Options C</th>
                      {questionType !== 'liveEvent' && <th className="text-right">Options D</th>}
                      <th className="text-center">Result Status</th>
                      <th className="text-center">Status</th>
                      <th className="text-center"> Updated At</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          {questionType === 'liveEvent' && (categoryName === 'cricket' || categoryName === '') &&
                            <>
                              <td className="text-left"> {item?.rows?.series_name}</td>
                              <td className="text-left"> {item?.rows?.match_id}</td>
                              <td className="text-left"> {item?.rows?.localteam} vs {item?.rows?.visitorteam}</td>
                              <td className="text-left">{item?.rows?.match_status ?? "NA"}</td>
                            </>
                          }
                          <td className="text-left">{moment(item?.rows?.compare_start_time).format("LLL") ?? "NA"}</td>
                          <td className="text-left">{Helper.ternaryOperator(item?.rows?.question_text,item?.rows?.question_text,"NA")}</td>
                          <td className="text-left"> {Helper.ternaryOperator(item?.rows?.optionAName,item?.rows?.optionAName,"NA")}</td>
                          <td className="text-left">{Helper.ternaryOperator(item?.rows?.optionBName,item?.rows?.optionBName,"NA")} </td>
                          <td className="text-right"> {Helper.ternaryOperator(item?.rows?.optionCName,item?.rows?.optionCName,"NA")}</td>
                          {questionType !== 'liveEvent' && <td className="text-right"> {Helper.ternaryOperator(item?.rows?.optionDName,item?.rows?.optionDName,"NA")}</td>}
                          <td className="text-right"> {Helper.ternaryOperator(item?.rows?.isCancelled == 1, 'Cancelled',item?.rows?.isAmountDistributed == 1 ? "Completed" : "Open")}</td>

                          <td className="text-center">
                            <Status item={item} refreshData={pageData} />
                          </td>

                          <td className="text-center">{moment(item?.rows?.created_at).format("LLL")}</td>
                          <td className="text-center w-40">
                            {_.isEmpty(props.match.params.id) ? (
                              <div>
                                <Delete item={item} refreshData={pageData} />
                                {

                                  
                                  Helper.andOperator( !['Finished', 'Completed'].includes(item?.rows?.match_status), <Link to={{ pathname: `/edit-question/${item?.rows?._id}` }} className="btn-link">
                                  <button className="btn circle_btn btn-sm mr-1" type="button" title="Status">
                                    <i className="fa fa-pencil" />
                                  </button>
                                </Link>)
                    }
                                <button className="btn circle_btn btn-sm mr-1" type="button" title="View Details" onClick={() => handleQuestionData(item?.rows)}>Stats</button>
                              </div>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                    {_.isEmpty(users) && (
                      <tr>
                        <td colSpan="9">
                          <div className="text-center">No Record Found</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(users) && (
                <div className="show-pagination technician-page">
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
                    onChange={pageData}
                  />
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <View item={questionData} modal={modal} handleCloseModal={handleCloseModal} />
    </div>
  );
};

export default Questions;
