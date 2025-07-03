import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Helper from "../../constants/helper";
import apiUrl from "../../constants/apiPath";
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, CardBody, Col, Row, Table, Input } from "reactstrap";
import _ from "lodash";
import Loaders from "../CommanPage/Loader";
import useSession from "react-session-hook";
import { useAlert } from "react-alert";

const Result = (props) => {
  const session = useSession();
  const location = useLocation();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState("");
  const [activepage, setActivePage] = useState(location?.state?.page || 1);
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [serachstatus, setSerachStatus] = useState("");
  const [keywords, setKeyWords] = useState("");
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [category_id, setQuizCategory] = useState("");
  const [contestType, setContestType] = useState("");
  const [query, setQuery] = useState({});
  const [loading, setLoading] = useState(false);

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page);
    query["page"] = page;
    query["itemsPerPage"] = itemsPerPage;
    let queryString = Helper.serialize(query);
    path = apiUrl.get_series_completed_matches + `?${queryString}`;
    getData(path);
  };

  const set_rank = async (match_id, series_id) => {
    setLoading(true);
    let path = `/crons/set-rank/?match_id=${match_id}`;
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        alert.success(res.msg);
      } else {
        setLoading(false);
        alert.error(res.msg);
      }
    } else {
      setLoading(false);
      alert.error(res.error);
    }
  };
  const get_live_score = async (match_id, series_id) => {
    setLoading(true);
    let path = `/crons/get-live-scores/?match_id=${match_id}`;
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        alert.success(res.msg);
      } else {
        setLoading(false);
        alert.error(res.msg);
      }
    } else {
      setLoading(false);
      alert.error(res.error);
    }
  };
  const set_winning_amount = async (match_id, series_id) => {
    setLoading(true);
    let path = `/crons/winning-amount/?match_id=${match_id}`;
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        alert.success(res.msg);
      } else {
        setLoading(false);
        alert.error(res.msg);
      }
    } else {
      setLoading(false);
      alert.error(res.error);
    }
  };
  const prize_distribution = async (match_id, series_id) => {
    setLoading(true);
    let path = `/crons/matches-prize-distribution/?match_id=${match_id}`;
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        alert.success(res.msg);
      } else {
        setLoading(false);
        alert.error(res.msg);
      }
    } else {
      setLoading(false);
      alert.error(res.error);
    }
  };
  const UpdateFantasyPoints = async (match_id, series_id) => {
    setLoading(true);
    let path = `/v1/cron/getFinishedMatchDataAndPlayerPoints?match_id=${match_id}`;
    const fr = await Helper.pointGet(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        alert.success(res.msg);
      } else {
        setLoading(false);
        alert.error(res.msg);
      }
    } else {
      setLoading(false);
      alert.error(res.error);
    }
  };

  const handleSearching = async () => {
    setIsserach(true);
    const itemsPerPage = 10;
    let path;
    let page = 1;
    setActivePage(page);
    let queries = {
      page: page,
      itemsPerPage: itemsPerPage,
      keyword: keywords,
      contestType: contestType,
      quizCat: category_id,
      start_date: startdate == "" ? "" : moment(startdate).format("YYYY-MM-DD"),
      end_date: enddate == "" ? "" : moment(enddate).format("YYYY-MM-DD"),
      status: serachstatus,
    };
    setQuery(queries);

    path =
      apiUrl.get_series_completed_matches +
      "?page=" +
      `${page}` +
      "&itemsPerPage=" +
      `${itemsPerPage}` +
      "&keyword=" +
      `${keywords}` +
      "&contestType=" +
      `${contestType}` +
      "&quizCat=" +
      `${category_id}` +
      "&start_date=" +
      `${startdate == "" ? "" : moment(startdate).format("YYYY-MM-DD")}` +
      "&end_date=" +
      `${enddate == "" ? "" : moment(enddate).format("YYYY-MM-DD")}` +
      "&status=" +
      `${serachstatus}`;
    getData(path);
  };

  const resetSearch = async () => {
    let path = apiUrl.get_series_completed_matches + "?page=1&itemsPerPage=10";
    getData(path);
  };

  const getData = async (path) => {
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results || []);
        setTotalItems(
          !_.isEmpty(res.results[0]) ? res.results[0].totalDocs : 0
        );
        setVisibale(false);
        setIsserach(false);
      } else {
        alert.error(res.msg);
        setIsserach(false);
        setVisibale(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false);
      setVisibale(false);
    }
  };

  const onReset = (e) => {
    setQuery({});
    setStartDate("");
    setEndDate("");
    setKeyWords("");
    setSerachStatus("");
    setQuizCategory("");
    setContestType("");
    resetSearch();
    setActivePage(1);
  };

  useEffect(() => {
    pageData();
  }, []);

  // const checkButtons = (item) => {
  //   let buttonOrStatus;
  //   if (item.win_flag === 0 && item.show_win_amount === true) {
  //     buttonOrStatus = (
  //       <button
  //         className={'btn circle_btn table_auto_btn mr-5 '}
  //         type={'button'}
  //         onClick={(e) => { winning_distribute(item.match_id, item.series_id) }}
  //       >
  //         Winning Distribute
  //       </button>
  //     );
  //   } else if (item.win_flag === 1 && item.show_win_amount === true) {
  //     buttonOrStatus = <span className={'text-success font-weight-bold mr-5'}> Distributed </span>;
  //   } else {
  //     buttonOrStatus = <span className={'mr-5 status_text'}> No Amount Yet </span>;
  //   }
  //   return buttonOrStatus;
  // }
  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={10}>
                    {/* <Form> */}
                    <Row>
                      <Col md={4}>
                        <Input
                          type="text"
                          placeholder="Series Name"
                          value={keywords}
                          className="form-control"
                          onChange={(e) => {
                            setKeyWords(e.target.value);
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={2}>
                    <Row>
                      <Col md={12}>
                        <button
                          className="btn btn-primary mr-1 col-md-5 mb-3 mb-md-0 d-inline-flex align-items-center"
                          type="button"
                          onClick={handleSearching}
                        >
                          <i className="fa fa-search" /> Search
                          {isserach === true && (
                            <i className="fa fa-spinner fa-pulse fa-fw ml-1" />
                          )}
                        </button>
                        <button
                          className="btn dark_btn col-md-5"
                          type="button"
                          onClick={(e) => {
                            onReset();
                          }}
                        >
                          <i className="fa fa-undo" /> Reset
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div id="reportId">
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Match Id</th>
                      <th className="text-left">Series Id </th>
                      <th className="text-left">Team 1 Vs Team 2 </th>
                      <th className="text-left">Match Type </th>
                      <th className="text-left">Series name</th>
                      <th className="text-center">Date</th>
                      <th className="text-center">Time</th>
                      <th className="text-right">Is Prize Distributed</th>
                      <th className="text-right">No of Contest</th>
                      <th className="text-right">Distribute Winning Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((itemData, key) => {
                      let item = itemData.rows;
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.match_id}</td>
                          <td className="text-left">{item.series_id}</td>
                          <td className="text-left">
                            {item.localteam + " Vs " + item.visitorteam}
                          </td>
                          <td className="text-left">{item.type}</td>
                          <td className="text-left">{item.seriesData.name}</td>
                          <td className="text-center">
                            {moment(item.date).format("MMM Do YYYY")}
                          </td>
                          <td className="text-center">{item.time}</td>
                          <td className="text-right">
                            <div
                              style={{
                                color: item.win_flag == 1 ? "green" : "red",
                              }}
                            >
                              {item.win_flag == 1 ? "YES" : "NO"}
                            </div>
                          </td>
                          <td className="text-right">
                            {item.joined_contest
                              ? item.joined_contest.length
                              : 0}
                          </td>
                          <td className="text-left align-top">
                            <ul className="space-y-2">
                              <li>
                                <button
                                  className="btn circle_btn table_auto_btn"
                                  type="button"
                                  onClick={() =>
                                    get_live_score(
                                      item.match_id,
                                      item.series_id
                                    )
                                  }
                                >
                                  Update Live Score
                                </button>
                              </li>
                              <li>
                                <button
                                  className="btn circle_btn table_auto_btn"
                                  type="button"
                                  onClick={() =>
                                    set_rank(item.match_id, item.series_id)
                                  }
                                >
                                  Set Rank
                                </button>
                              </li>
                              <li>
                                <button
                                  className="btn circle_btn table_auto_btn"
                                  type="button"
                                  onClick={() =>
                                    set_winning_amount(
                                      item.match_id,
                                      item.series_id
                                    )
                                  }
                                >
                                  Set Winning Amount
                                </button>
                              </li>
                              <li>
                                <button
                                  className="btn circle_btn table_auto_btn"
                                  type="button"
                                  onClick={() =>
                                    prize_distribution(
                                      item.match_id,
                                      item.series_id
                                    )
                                  }
                                >
                                  Prize Distribution
                                </button>
                              </li>
                              <li>
                                <button
                                  className="btn circle_btn table_auto_btn"
                                  type="button"
                                  onClick={() =>
                                    UpdateFantasyPoints(
                                      item.match_id,
                                      item.series_id
                                    )
                                  }
                                >
                                  Update Fantasy Points
                                </button>
                              </li>
                              <li>
                                <Link
                                  to={{
                                    state: { page: activepage, tab: "result" },
                                    pathname: `/cricket/winning-users-list/${item.match_id}`,
                                  }}
                                  className="btn-link"
                                >
                                  <button
                                    className="btn circle_btn btn-sm"
                                    type="button"
                                    title="Winning Users List"
                                  >
                                    {`Winning Users List`}
                                  </button>
                                </Link>
                              </li>
                            </ul>
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
                    totalItemsCount={Number(totalitems)}
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
    </div>
  );
};

export default Result;
