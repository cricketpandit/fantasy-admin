import React, { useState, useEffect } from 'react';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Card, CardBody, Col, Row, Table, Form, FormGroup } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import PlayerRow from './PlayerRow'
import useSession from "react-session-hook";
import { useAlert } from "react-alert";

const SeriesPlayers = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [totalitems, setTotalItems] = useState('');
  const [activepage,setActivePage] = useState(1);
  const [serachstatus] = useState('');
  const [series_id, setSeriesId] = useState('');
  const [team_type, setTeamType] = useState('');
  const [team_id, setTeamId] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState({});

  const handleChange = (e) => {
    if(e.target.name === 'keywords') {
      setKeyWords(e.target.value);
    } else if(e.target.name === 'series_id') {
      setSeriesId(e.target.value);
      getTeams(e.target.value);
    } else if(e.target.name === 'team_type') {
      setTeamType(e.target.value);
    } else if(e.target.name === 'team_id') {
      setTeamId(e.target.value);
    }
  }

  const pageData = async (page = activepage) => {
    setVisibale(false);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query); 
    path = apiUrl.get_series_players + `?${queryString}`;
    getInitialData(path)
  };  

  const getPlayers = async () => {
    setIsserach(true);
    const itemsPerPage = 10;
    let path;
    let page = 1;
    setActivePage(page)
    let queries = {
        page:page,
        itemsPerPage:itemsPerPage,
        keyword:keywords,
        series_id:series_id,
        team_id:team_id,
        team_type:team_type,
        status:serachstatus
    }
    setQuery(queries)   
    path = apiUrl.get_series_players + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` +  '&team_id=' + `${team_id}` + '&team_type=' + `${team_type}` + '&keyword=' + `${keywords}` + '&series_id=' + `${series_id}` + '&status=' + `${serachstatus}`;
    getInitialData(path)    
  };

  const resetSearch = async () => {
    let path = apiUrl.get_series_players + '?page=1&itemsPerPage=10';
    getInitialData(path)
  }  

  const getInitialData = async (path) => {
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setPlayers(res.results || []);
        setTotalItems(res.totalDocs);
        setVisibale(false);
        setIsserach(false);
      } else {
        alert.error(res.msg);
        setIsserach(false); setVisibale(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false); setVisibale(false);
    }
  };
    

  const getData = async () => {
    setVisibale(false);
    let path;

    path = apiUrl.get_series;

    const fr = await Helper.get(token,path);
    const res = await fr.response.json();

    if (fr.status === 200) {

      if (res.success) {
        setDropdown(res.results || []);
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

  const getTeams = async (seriesId) => {
    setVisibale(false);
    let path;
    path = apiUrl.get_series_teams + '?series_id=' + `${seriesId}`;

    const frr = await Helper.get(token,path);
    const resr = await frr.response.json();

    if (frr.status === 200) {

      if (resr.success) {
        setTeams(resr.results || []);
        setVisibale(false);
      } else {
        alert.error(resr.msg);
        setVisibale(false)
      }
    } else {
      alert.error(resr.error);
      setVisibale(false)
    }

  };

const onReset = (e) => {
    setQuery({})
    setKeyWords("");
    setSeriesId(""); 
    setTeamId(""); 
    setTeamType(""); 
    resetSearch();
    setActivePage(1);

    const itemsPerPage = 10;
    let path;
    let page = 1;
    setActivePage(page)
    let queries = {
        page:page,
        itemsPerPage:itemsPerPage,
        keyword:"",
        series_id:"",
        team_id:"",
        team_type:team_type,
        status:serachstatus
    }
    setQuery(queries)   
    path = apiUrl.get_series_players + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` +  '&team_id=' + `${""}` + '&team_type=' + `${team_type}` + '&keyword=' + `${""}` + '&series_id=' + `${""}` + '&status=' + `${serachstatus}`;
    getInitialData(path)  
};

useEffect(() => {
  getData();
  pageData();
}, []);


  return (
    
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="multipal-searching">
                <Row className='gx-2'> 
                  <Col lg={9} className="multiple-column ">
                    <Form>
                      <Row className='align-items-center'>
                      <Col md={3}>
                          <FormGroup className='mb-0'>
                            <select className={"form-control"} value={series_id} name="series_id" onChange={handleChange}>
                              <option value={""}>Select Series</option>
                              {
                                dropdown.map((type, index) => {
                                  return <option key={index} value={type.id_api}>{type.name}</option>
                                })
                              }
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup className='mb-0'> 
                            <select type="text"  name="team_type" placeholder="Status" className="form-control" value={team_type}
                              onChange={handleChange} >
                              <option value="">Select Team Type</option>
                              <option value="all">All</option>
                              <option value="t10">T10</option>
                              <option value="t20">T20</option>
                              <option value="odi">ODI</option>
                              <option value="test">Test</option>
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup className='mb-0'> 
                          <select className={"form-control"} value={team_id} name="team_id" onChange={handleChange}>
                              <option value={""}>Select Team</option>
                              {
                                teams.map((type, index) => {
                                  return <option key={index} value={type.team_id}>{type.team_name}</option>
                                })
                              }
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup className='mb-0'>
                            <input type="text" placeholder="Search" value={keywords} className="form-control" name="keywords" onChange={handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col xl={3} className='d-flex justify-content-end'>
                       <button className="btn btn-primary mr-1 col-md-5 mb-3 mb-md-0 d-inline-flex align-items-center justify-content-center" type="button" onClick={getPlayers}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                         <button className="btn dark_btn col-md-5 justify-content-center" type="button" onClick={onReset}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
              <Table bordered responsive className="mt-3 text-center playertabl">
                  <thead>
                    <tr>
                      <th className="text-left">Name</th>
                      <th className="text-left upload_img_w">Image</th>
                      <th className="text-center">Role</th>
                      {/* <th className="text-center">Type</th> */}
                      <th className="text-left">Team</th>
                      <th className="text-left">Series Name</th>
                      <th className="text-right">Credits</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((item, key) => {
                      return (
                        <PlayerRow key={key} item={item} sno={key} />
                      )
                    })}
                    {_.isEmpty(players) && <tr><td colSpan="7"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(players) && <div className="show-pagination technician-page">
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

export default SeriesPlayers;