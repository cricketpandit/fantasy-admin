import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import Status from './Action/Status';
import View from "./Action/View";
import { useAlert } from "react-alert";
import Swal from "sweetalert2";

const Series = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [series, setSeries] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [serachstatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [query, setQuery] = useState({});
  const [pagePath, setPagePath] = useState('');
  const [modal, setModal] = useState(false);
  const [matchData, setMatchData] = useState(null);

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_series_contest + `?${queryString}`;
    getData(path)
  };



  const handleSearching = async (e) => {

    setIsserach(true);
    const itemsPerPage = 10;
    let path;
    let page = 1;
    setActivePage(page)

    let queries = {
      page: page,
      itemsPerPage: itemsPerPage,
      keyword: keywords,
      status: serachstatus
    }
    setQuery(queries)

    path = apiUrl.get_series_contest + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&status=' + `${serachstatus}`;
    getData(path)
  };

  const resetSearch = async () => {
    let path = apiUrl.get_series_contest + '?page=1&itemsPerPage=10';
    getData(path)
  }


  const getData = async (path) => {
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setIsserach(false);
        setPagePath(path);
        setSeries(res.results || []);
        setTotalItems(res.results[0]?.totalDocs || 0);
        setVisibale(false);
      } else {
        setIsserach(false);
        alert.error(res.msg);
        setVisibale(false);
      }
    } else {
      setIsserach(false);
      alert.error(res.error);
      setVisibale(false);
    }
  };

  const onReset = (e) => {
    setQuery({})
    setKeyWords('');
    resetSearch();
    setActivePage(1);
  };

  useEffect(() => {
    pageData();
  }, []);

  const handleCloseModal = () => {
    setModal(false)
  }

  const handleMatchData = (data) => {
    setMatchData(data)
    setModal(true)
  }

  const handleKeyword = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault()
      return false;
    }
    setKeyWords(e.target.value)
  }

  const toggleFavourite = async (status, id_api) => {
    
    let SwalConfig = Helper.SwalConfig("Do you want to toggle the favorite?");
    const result = await Swal.fire(SwalConfig);
    
    if (result.value) {    
      let postJson = { id_api: id_api, status: status };
      let path = apiUrl.toggle_favourite;
      const fr = await Helper.post(token,postJson, path);
      const res = await fr.response.json();
      if (fr.status === 200) {
        if (res.success) {
          pageData();
          alert.success(res.msg);
        } else {
          alert.error(res.msg);
        }
      } else {
        alert.error(res.error);
      }
    }

  }

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">
              Cricket Series
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={9}>
                    {/* <Form> */}
                    <Row>
                      <Col md={3} sm={6}>
                        <FormGroup className="mb-xl-0">
                          <Input type="text" placeholder="Series name" value={keywords} className="form-control"
                            onChange={(e) => handleKeyword(e)} />
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* </Form> */}
                  </Col>
                  <Col xl={3} className="text-xl-right">
                    <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                    <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center seriesTable">
                  <thead>
                    <tr>
                      <th className="text-left">Series Id</th>
                      <th className="text-left">Series Name</th>
                      <th className="text-left">Short Name</th>
                      <th className="text-right">Inactive Matches</th>
                      {/* <th className="text-right">Is Favourite</th> */}
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {series.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.rows.id_api}</td>
                          <td className="text-left">{item.rows.name}</td>
                          <td className="text-left">{item.rows.short_name}</td>
                          <td className="text-right">{item.rows.numOfinactive}</td>
                          {/* <td className="text-right">
                            <span> <input type="checkbox" name="isFavourite" checked={item.rows.isFavourite || false} onChange={() => toggleFavourite(!item.rows.isFavourite, item.rows.id_api)} /></span>
                          </td> */}
                          <td className="text-center">
                            {
                              <Status item={item.rows} refreshData={pageData} />
                            }
                          </td>
                          <td className="text-center w-40">
                            {
                              _.isEmpty(props.match.params.id) ?
                                <div>
                                  <Link to={{ pathname: `/update-short-name/${item.rows.id_api}` }} className="btn-link">
                                    <button className="btn circle_btn btn-sm mr-1" type="button" title="Update Short Name">
                                      Update Short Name
                                    </button>
                                  </Link>
                                  <button className="btn circle_btn btn-sm mr-1" type="button" title="View Details" onClick={() => handleMatchData(item?.rows)}>Matches</button>                                  
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(series) && <tr><td colSpan="7"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(series) && <div className="show-pagination technician-page">
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
      <View getData={getData} pagePath={pagePath} item={matchData} modal={modal} handleCloseModal={handleCloseModal} />
    </div>
  );
};

export default Series;
