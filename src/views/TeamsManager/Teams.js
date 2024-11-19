import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Card, CardBody, Col, Row, Table, Form, FormGroup } from 'reactstrap';
import _ from "lodash";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import { useAlert } from "react-alert";

const Teams = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [totalitems, setTotalItems] = useState('');
  const [activepage,setActivePage] = useState(1);
  const [serachstatus] = useState('');
  const [series_id, setSeriesId] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [teams, setTeams] = useState([]);
  const [query, setQuery] = useState({});

  const handleChange = (e) => {
    if(e.target.name === 'keywords') {
      setKeyWords(e.target.value);
    } else if(e.target.name === 'series_id') {
      setSeriesId(e.target.value);
    }
  }
  const getData = async () => {
    setVisibale(true);
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

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query); 
    path = apiUrl.get_all_teams + `?${queryString}`;
    getInitialData(path)
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
        series_id:series_id,
        status:serachstatus
      }
      setQuery(queries)
      path = apiUrl.get_all_teams + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&series_id=' + `${series_id}`;
      getInitialData(path);
    };
    const resetSearch = async () => {
      let path = apiUrl.get_all_teams + '?page=1&itemsPerPage=10';
      getInitialData(path)
    }

    const getInitialData = async (path) => {
      const fr = await Helper.get(token,path);
      const res = await fr.response.json();
      if (fr.status === 200) {
        if (res.success) {
          setTeams(res.results.docs || []);
          setTotalItems(res.results.totalDocs);
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
const onReset = (e) => {
    setQuery({})
    setKeyWords("");
    setSeriesId(""); 
    resetSearch();
    setActivePage(1);
};

const placeholderImage = process.env.REACT_APP_AWS_MEDIA_URL +"/static/team_flags/no_image.jpg"
const onImageError = (e) => {
  e.target.src = placeholderImage
}

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
                <Row>
                  <Col lg={9}>
                    <Form>
                      <Row>
                      <Col md={6} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <input type="text" placeholder="Search" value={keywords} className="form-control" name="keywords" onChange={handleChange} />
                          </FormGroup>
                        </Col>
                        <Col md={6} sm={6}>
                          <FormGroup className="mb-xl-0">
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
                      </Row>
                    </Form>
                  </Col>
                  <Col xl={3} className="text-xl-right">
                        <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                        <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Team Name</th>
                      <th className="text-left">Team Short Name</th>
                      <th className="text-left">Flag</th>
                      <th className="text-left">Jersey</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((item, key) => {
                     
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.team_name}</td>
                          <td className="text-left">{item.team_short_name}</td>
                          <td className="text-left"><img width="40px" src={process.env.REACT_APP_AWS_MEDIA_URL + '/'+item.flag ? process.env.REACT_APP_AWS_MEDIA_URL + '/'+item.flag : placeholderImage}/></td>
                          <td className="text-left"><img width="40px" src={process.env.REACT_APP_AWS_MEDIA_URL + '/'+item.team_jersey ? process.env.REACT_APP_AWS_MEDIA_URL + '/'+item.team_jersey : placeholderImage}/></td>
                          
                          <td className="text-center w-40">
                            {
                              _.isEmpty(item.team_id) ?
                                <div>
                                  <Link to={{ pathname: `/edit-flag/${item.team_id}` }} className="btn-link">
                                    <button className="btn circle_btn table_auto_btn btn-sm mr-1" type="button" title="Update Flag And Jersey">
                                      Update Flag And Jersey
                                    </button>
                                  </Link>
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(teams) && <tr><td colSpan="5"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(teams) && <div className="show-pagination technician-page">
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

export default Teams;