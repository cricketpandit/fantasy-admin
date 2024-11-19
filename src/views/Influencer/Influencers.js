import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import Status from './Action/Status';
import Delete from './Action/Delete';
import { useAlert } from "react-alert";

const Influencers = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const module = session.profile.user_type == "editor" ? session.profile.permissions.find((e) => e.manager == "Influencers") : {}
  const { user_type } = session.profile;

  const getData = async (page = activepage) => {
    setVisibale(true);
    setActivePage(page)
    const itemsPerPage = 10;
    let path;
    if (props.match.params.id) {
      path = apiUrl.get_influencers + '/' + `${props.match.params.id}` + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    } else {
      path = apiUrl.get_influencers + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    }
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setVisibale(false)
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const buildApiUrl = () => {
    const itemsPerPage = 10;
    const baseApiUrl = apiUrl.get_influencers;  
    const commonParams = `?page=${activepage}&itemsPerPage=${itemsPerPage}&keyword=${keywords}&status=${serachstatus}`;  
    return `${baseApiUrl}/${commonParams}`
  };
  
  const handleSearching = async () => {
    try {
      setActivePage(activepage || 1);
      setIsserach(true);
  
      const path = buildApiUrl();
  
      const fr = await Helper.get(token,path);
      const res = await fr.response.json();
  
      if (fr.status === 200) {
        if (res.success) {
          setUsers(res.results.docs || []);
          setTotalItems(res.results.totalDocs);
        } else {
          alert.error(res.msg);
        }
      } else {
        alert.error(res.error);
      }
  
      setIsserach(false);
    } catch (error) {
      alert.error(error.message);
      setIsserach(false);
    }
  };

  

  const canDelete = (user_type === "editor" && module.delete === 1) || user_type === "admin";
  const canEditOrAdmin = (user_type === "editor" && module.edit === 1) || user_type === "admin";


  const onReset = (e) => {
    setKeyWords('');
    setSerachStatus('');
    getData();
  };

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">
            Influencers
              <div className="ml-auto">
                <Link to="/add-influencer-code" className="btn btn-primary">
                  <i className="fa fa-plus mr-1"></i>Add Influencer Code
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
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <select type="text" placeholder="Status" className="form-control" value={serachstatus}
                              onChange={(e) => { setSerachStatus(e.target.value) }} >
                              <option value="">Select Influencer Status</option>
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
                      <th className="text-left">Name</th>
                      <th className="text-left">Code</th>
                      <th className="text-right">Bonus Amount</th>
                      <th className="text-center">Created At</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.name}</td>
                          <td className="text-left">{item.code}</td>
                          <td className="text-right">{item.bonus_amount}</td>
                          <td className="text-center">{moment(item.created_at).format('LLL')}</td>
                          <td className="text-center">
                            <Status item={item} refreshData={getData} />
                          </td>
                          <td className="text-center w-40">
                            {
                              _.isEmpty(props.match.params.id) ?
                                <div>
                                  {canDelete && <Delete item={item} refreshData={getData} />}
                                  {canEditOrAdmin && (
                                    <>
                                      <Link to={{ pathname: `/edit-influencer-code/${item.id}` }} className="btn-link">
                                        <button className="btn circle_btn btn-sm mr-1" type="button" title="Edit">
                                          <i className="fa fa-pencil" />
                                        </button>
                                      </Link>
                                      <Link to={{ pathname: `/list-influencer-code-users/${item._id}` }} className="btn-link">
                                        <button className="btn circle_btn btn-sm mr-1" type="button" title="Users List">
                                          <i className="fa fa-eye" />
                                        </button>
                                      </Link>
                                    </>
                                  )}
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="14"><div className="text-center">No Record Found</div></td></tr>}
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
                  onChange={getData}
                />
              </div>}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Influencers;
